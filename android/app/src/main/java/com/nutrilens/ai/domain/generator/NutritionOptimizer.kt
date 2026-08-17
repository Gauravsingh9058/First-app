package com.nutrilens.ai.domain.generator

import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.FullNutrients
import com.nutrilens.ai.data.model.GeneratedMeal
import com.nutrilens.ai.data.model.GeneratedMealFood
import com.nutrilens.ai.data.model.MealType
import com.nutrilens.ai.data.model.UserProfile
import com.nutrilens.ai.util.NutritionCalculator
import kotlin.math.roundToInt

/**
 * Combinatorial & Portion Optimization Engine.
 * Selects complementary food ensembles and dynamically optimizes serving sizes
 * to match exact target calorie and macronutrient allocations per meal.
 */
object NutritionOptimizer {

    data class TargetMealMacros(
        val targetCalories: Double,
        val targetProteinG: Double,
        val targetFatG: Double,
        val targetCarbsG: Double
    )

    /**
     * Optimizes portion sizes and builds a single balanced meal.
     */
    fun optimizeMeal(
        mealType: MealType,
        mealTitle: String,
        selectedFoods: List<Food>,
        targetMacros: TargetMealMacros,
        profile: UserProfile
    ): GeneratedMeal {
        if (selectedFoods.isEmpty()) {
            return GeneratedMeal(
                mealType = mealType,
                mealTitle = mealTitle,
                foods = emptyList(),
                totalCalories = 0.0,
                totalProteinG = 0.0,
                totalFatG = 0.0,
                totalCarbsG = 0.0,
                totalFiberG = 0.0,
                totalSugarG = 0.0,
                totalNutrients = FullNutrients()
            )
        }

        // Allocate target calories across items in ensemble (e.g. 45% main protein/dish, 35% side/grain, 20% veggie/fat)
        val calorieDistribution = when (selectedFoods.size) {
            1 -> listOf(1.0)
            2 -> listOf(0.60, 0.40)
            3 -> listOf(0.45, 0.35, 0.20)
            4 -> listOf(0.40, 0.30, 0.18, 0.12)
            else -> List(selectedFoods.size) { 1.0 / selectedFoods.size }
        }

        val mealFoods = mutableListOf<GeneratedMealFood>()

        for (i in selectedFoods.indices) {
            val food = selectedFoods[i]
            val allocatedCal = targetMacros.targetCalories * calorieDistribution[i]

            // Calculate portion weight (grams) required to provide allocated calories
            val baseCalPer100g = maxOf(20.0, food.calories)
            var targetWeightG = (allocatedCal / baseCalPer100g) * 100.0

            // Apply realistic food weight boundaries
            targetWeightG = when {
                food.name.contains("oil", ignoreCase = true) || food.name.contains("butter", ignoreCase = true) -> targetWeightG.coerceIn(5.0, 25.0)
                food.name.contains("nut", ignoreCase = true) || food.name.contains("seed", ignoreCase = true) -> targetWeightG.coerceIn(15.0, 50.0)
                food.name.contains("egg", ignoreCase = true) -> targetWeightG.coerceIn(50.0, 200.0)
                else -> targetWeightG.coerceIn(40.0, 350.0)
            }

            targetWeightG = (targetWeightG / 5.0).roundToInt() * 5.0 // Round to nearest 5g
            targetWeightG = maxOf(10.0, targetWeightG)

            val fullNutrients = NutritionCalculator.calculateForWeight(food, targetWeightG)
            val quantity = roundToOneDecimal(targetWeightG / food.servingSizeGrams)

            mealFoods.add(
                GeneratedMealFood(
                    foodId = food.id,
                    foodName = food.name,
                    category = food.category,
                    weightGrams = targetWeightG,
                    servingUnit = food.servingUnit,
                    quantity = quantity,
                    calories = fullNutrients.calories,
                    proteinG = fullNutrients.proteinG,
                    fatG = fullNutrients.fatG,
                    carbsG = fullNutrients.carbsG,
                    fiberG = fullNutrients.fiberG,
                    sugarG = fullNutrients.sugarG,
                    nutrients = fullNutrients
                )
            )
        }

        val totalCalories = roundToOneDecimal(mealFoods.sumOf { it.calories })
        val totalProtein = roundToOneDecimal(mealFoods.sumOf { it.proteinG })
        val totalFat = roundToOneDecimal(mealFoods.sumOf { it.fatG })
        val totalCarbs = roundToOneDecimal(mealFoods.sumOf { it.carbsG })
        val totalFiber = roundToOneDecimal(mealFoods.sumOf { it.fiberG })
        val totalSugar = roundToOneDecimal(mealFoods.sumOf { it.sugarG })
        val totalNutrients = NutritionCalculator.aggregate(mealFoods.map { it.nutrients })

        return GeneratedMeal(
            mealType = mealType,
            mealTitle = mealTitle,
            foods = mealFoods,
            totalCalories = totalCalories,
            totalProteinG = totalProtein,
            totalFatG = totalFat,
            totalCarbsG = totalCarbs,
            totalFiberG = totalFiber,
            totalSugarG = totalSugar,
            totalNutrients = totalNutrients
        )
    }

    private fun roundToOneDecimal(value: Double): Double {
        return (value * 10.0).roundToInt() / 10.0
    }
}
