package com.nutrilens.ai.data.repository

import com.nutrilens.ai.data.model.DailyNutritionSummary
import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.LoggedFoodPortion
import com.nutrilens.ai.data.model.MealEntry
import com.nutrilens.ai.data.model.MealType
import com.nutrilens.ai.util.NutritionCalculator
import com.nutrilens.ai.util.ServingUnitConverter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.concurrent.ConcurrentHashMap

/**
 * Implementation of NutritionRepository computing exact USDA values and managing daily logs.
 * 
 * STRICT ARCHITECTURAL CONSTRAINTS:
 * 1. 100% of nutritional values are computed strictly from fooddata.db data structures.
 * 2. Gemini is NEVER invoked to calculate calories, macros, or vitamins.
 * 3. All calculations execute on Dispatchers.IO.
 */
class NutritionRepositoryImpl : NutritionRepository {

    // Thread-safe memory store for active daily summaries indexed by YYYY-MM-DD
    private val dailyStore = ConcurrentHashMap<String, DailyNutritionSummary>()

    override suspend fun calculatePortionNutrition(
        food: Food,
        quantity: Double,
        unit: String
    ): LoggedFoodPortion = withContext(Dispatchers.IO) {
        val netGrams = ServingUnitConverter.toGrams(quantity, unit)
        val nutrients = NutritionCalculator.calculateForWeight(food, netGrams)

        LoggedFoodPortion(
            foodId = food.id,
            foodName = food.name,
            quantity = quantity,
            servingUnit = unit,
            netWeightGrams = netGrams,
            nutrients = nutrients
        )
    }

    override suspend fun calculateMealEntry(
        mealType: MealType,
        portions: List<LoggedFoodPortion>
    ): MealEntry = withContext(Dispatchers.IO) {
        val totalGrams = portions.sumOf { it.netWeightGrams }
        val aggregatedNutrients = NutritionCalculator.aggregate(portions.map { it.nutrients })

        MealEntry(
            mealType = mealType,
            portions = portions,
            totalWeightGrams = totalGrams,
            totalNutrients = aggregatedNutrients
        )
    }

    override suspend fun logMeal(
        dateString: String,
        mealEntry: MealEntry
    ): DailyNutritionSummary = withContext(Dispatchers.IO) {
        val existing = dailyStore[dateString] ?: DailyNutritionSummary(dateString = dateString)

        val updatedBreakfast = existing.breakfast.toMutableList()
        val updatedLunch = existing.lunch.toMutableList()
        val updatedDinner = existing.dinner.toMutableList()
        val updatedSnacks = existing.snacks.toMutableList()

        when (mealEntry.mealType) {
            MealType.BREAKFAST -> updatedBreakfast.add(mealEntry)
            MealType.LUNCH -> updatedLunch.add(mealEntry)
            MealType.DINNER -> updatedDinner.add(mealEntry)
            MealType.SNACK -> updatedSnacks.add(mealEntry)
        }

        val allMeals = updatedBreakfast + updatedLunch + updatedDinner + updatedSnacks
        val totalNutrients = NutritionCalculator.aggregate(allMeals.map { it.totalNutrients })
        val totalWeight = allMeals.sumOf { it.totalWeightGrams }

        val newSummary = DailyNutritionSummary(
            dateString = dateString,
            breakfast = updatedBreakfast,
            lunch = updatedLunch,
            dinner = updatedDinner,
            snacks = updatedSnacks,
            waterGlasses = existing.waterGlasses,
            totalDailyNutrients = totalNutrients,
            totalDailyWeightGrams = totalWeight
        )

        dailyStore[dateString] = newSummary
        return@withContext newSummary
    }

    override suspend fun getDailySummary(dateString: String): DailyNutritionSummary =
        withContext(Dispatchers.IO) {
            dailyStore[dateString] ?: DailyNutritionSummary(dateString = dateString)
        }
}
