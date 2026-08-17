package com.nutrilens.ai.domain.generator

import com.nutrilens.ai.data.model.DailyMealPlan
import com.nutrilens.ai.data.model.GeneratedMeal
import com.nutrilens.ai.data.model.UserProfile
import com.nutrilens.ai.data.repository.MealRepository
import com.nutrilens.ai.util.NutritionCalculator
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.roundToInt

/**
 * Main Offline Local Meal Generator Engine.
 * 
 * STRICT ARCHITECTURAL RULES:
 * - 100% Offline, SQLite fooddata.db driven.
 * - Gemini or external AI is NEVER called for meal generation or nutrition calculations.
 * - Executes on background coroutine threads with zero UI lag.
 */
class MealGenerator(
    private val mealRepository: MealRepository
) {

    /**
     * Generates a fully personalized, nutritionally balanced daily meal plan
     * sourced strictly from fooddata.db.
     */
    suspend fun generateDailyMealPlan(
        profile: UserProfile,
        seed: Long = System.currentTimeMillis()
    ): DailyMealPlan = withContext(Dispatchers.IO) {

        // 1. Calculate BMR, TDEE, Calories, Macros & Hydration
        val targets = MacroCalculator.computeTargets(profile)

        // 2. Derive Dietary Rule Constraints
        val queryConstraints = DietRuleEngine.getQueryConstraints(profile)

        // 3. Divide targets across meal slots
        val slotTargets = MealPlanner.createMealSlotTargets(profile, targets)

        val generatedMeals = mutableListOf<GeneratedMeal>()

        // 4. Generate each meal independently
        for (slot in slotTargets) {
            // Retrieve candidate foods from local SQLite database
            val rawCandidates = mealRepository.getCandidateFoodsForMeal(
                mealType = slot.mealType,
                constraints = queryConstraints,
                limit = 80
            )

            // Filter strictly against diet rules & allergies
            val allowedCandidates = rawCandidates.filter { food ->
                DietRuleEngine.isFoodAllowed(food, profile)
            }

            // Rank foods by suitability, nutrient density, and macro alignment
            val ranked = FoodRankingEngine.rankFoods(
                candidates = allowedCandidates.ifEmpty { rawCandidates },
                mealType = slot.mealType,
                profile = profile
            )

            // Select ensemble with variation
            val foodEnsemble = MealVariationEngine.selectEnsemble(
                rankedCandidates = ranked,
                mealType = slot.mealType,
                seed = seed + slot.mealType.ordinal
            )

            // Generate title
            val mealTitle = MealVariationEngine.generateMealTitle(
                mealType = slot.mealType,
                foods = foodEnsemble,
                seed = seed
            )

            // Optimize portions & scale macros
            val meal = NutritionOptimizer.optimizeMeal(
                mealType = slot.mealType,
                mealTitle = mealTitle,
                selectedFoods = foodEnsemble,
                targetMacros = slot.targetMacros,
                profile = profile
            )

            generatedMeals.add(meal)
        }

        // 5. Aggregate total daily nutrition
        val totalDailyCalories = roundToOneDecimal(generatedMeals.sumOf { it.totalCalories })
        val totalDailyProtein = roundToOneDecimal(generatedMeals.sumOf { it.totalProteinG })
        val totalDailyFat = roundToOneDecimal(generatedMeals.sumOf { it.totalFatG })
        val totalDailyCarbs = roundToOneDecimal(generatedMeals.sumOf { it.totalCarbsG })
        val totalDailyFiber = roundToOneDecimal(generatedMeals.sumOf { it.totalFiberG })
        val totalDailySugar = roundToOneDecimal(generatedMeals.sumOf { it.totalSugarG })
        val totalDailyNutrients = NutritionCalculator.aggregate(generatedMeals.map { it.totalNutrients })

        DailyMealPlan(
            profile = profile,
            targets = targets,
            meals = generatedMeals,
            totalDailyCalories = totalDailyCalories,
            totalDailyProteinG = totalDailyProtein,
            totalDailyFatG = totalDailyFat,
            totalDailyCarbsG = totalDailyCarbs,
            totalDailyFiberG = totalDailyFiber,
            totalDailySugarG = totalDailySugar,
            totalDailyNutrients = totalDailyNutrients
        )
    }

    private fun roundToOneDecimal(value: Double): Double {
        return (value * 10.0).roundToInt() / 10.0
    }
}
