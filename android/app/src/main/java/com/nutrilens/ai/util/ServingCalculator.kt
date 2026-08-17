package com.nutrilens.ai.util

import androidx.annotation.Keep
import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.FullNutrients

@Keep
data class CalculatedServingItem(
    val foodId: Long,
    val foodName: String,
    val category: String?,
    val inputQuantity: Double,
    val inputUnit: String,
    val netWeightGrams: Double,
    val calories: Double,
    val proteinG: Double,
    val fatG: Double,
    val carbsG: Double,
    val fiberG: Double,
    val sugarG: Double,
    val netCarbsG: Double,
    val waterG: Double,
    val nutrients: FullNutrients
)

/**
 * Serving & Portion Nutrition Calculator.
 * Computes exact per-gram scaled nutrients for food items based on serving sizes and USDA tables.
 */
object ServingCalculator {

    /**
     * Calculates scaled nutrients for a [Food] given a serving quantity and unit.
     */
    fun calculateServing(
        food: Food,
        quantity: Double,
        unit: String,
        customGramWeight: Double? = null
    ): CalculatedServingItem {
        val netGrams = UnitConverter.toGrams(
            quantity = quantity,
            unit = unit,
            customUnitGramWeight = customGramWeight,
            foodName = food.name
        )

        val fullNutrients = NutritionCalculator.calculateForWeight(food, netGrams)

        return CalculatedServingItem(
            foodId = food.id,
            foodName = food.name,
            category = food.category,
            inputQuantity = quantity,
            inputUnit = unit,
            netWeightGrams = netGrams,
            calories = fullNutrients.calories,
            proteinG = fullNutrients.proteinG,
            fatG = fullNutrients.fatG,
            carbsG = fullNutrients.carbsG,
            fiberG = fullNutrients.fiberG,
            sugarG = fullNutrients.sugarG,
            netCarbsG = fullNutrients.netCarbsG,
            waterG = fullNutrients.waterG,
            nutrients = fullNutrients
        )
    }
}
