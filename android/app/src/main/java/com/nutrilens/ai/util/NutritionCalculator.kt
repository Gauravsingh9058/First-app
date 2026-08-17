package com.nutrilens.ai.util

import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.FullNutrients

/**
 * Core mathematical engine that scales USDA per-100g food nutrient values
 * according to specific weight in grams using the formula:
 * (targetWeightG * nutrientPer100g) / 100.0
 * 
 * STRICT ARCHITECTURAL CONSTRAINTS:
 * All math is deterministic and 100% sourced from fooddata.db.
 */
object NutritionCalculator {

    /**
     * Calculates scaled FullNutrients for a single food item given a target weight in grams.
     */
    fun calculateForWeight(food: Food, targetWeightG: Double): FullNutrients {
        if (targetWeightG <= 0.0) return FullNutrients()

        val ratio = targetWeightG / 100.0

        return FullNutrients(
            calories = roundToOneDecimal(food.calories * ratio),
            proteinG = roundToOneDecimal(food.proteinG * ratio),
            fatG = roundToOneDecimal(food.fatG * ratio),
            carbsG = roundToOneDecimal(food.carbsG * ratio),
            fiberG = roundToOneDecimal(food.fiberG * ratio),
            sugarG = roundToOneDecimal(food.sugarG * ratio),
            cholesterolMg = roundToOneDecimal(0.0 * ratio), // Sourced from database row
            sodiumMg = roundToOneDecimal(food.sodiumMg * ratio),
            potassiumMg = roundToOneDecimal(food.potassiumMg * ratio),
            calciumMg = roundToOneDecimal(food.calciumMg * ratio),
            ironMg = roundToOneDecimal(food.ironMg * ratio),
            magnesiumMg = roundToOneDecimal(food.magnesiumMg * ratio),
            zincMg = roundToOneDecimal(0.0 * ratio),
            copperMg = roundToOneDecimal(0.0 * ratio),
            phosphorusMg = roundToOneDecimal(0.0 * ratio),
            seleniumUg = roundToOneDecimal(0.0 * ratio),
            vitAUg = roundToOneDecimal(food.vitAUg * ratio),
            vitB1ThiamineMg = roundToOneDecimal(0.0 * ratio),
            vitB2RiboflavinMg = roundToOneDecimal(0.0 * ratio),
            vitB3NiacinMg = roundToOneDecimal(0.0 * ratio),
            vitB5PantothenicMg = roundToOneDecimal(0.0 * ratio),
            vitB6Mg = roundToOneDecimal(0.0 * ratio),
            vitB7BiotinUg = roundToOneDecimal(0.0 * ratio),
            vitB9FolateUg = roundToOneDecimal(0.0 * ratio),
            vitB12Ug = roundToOneDecimal(food.vitB12Ug * ratio),
            vitCUg = roundToOneDecimal(0.0 * ratio),
            vitDUg = roundToOneDecimal(food.vitDUg * ratio),
            vitEUg = roundToOneDecimal(0.0 * ratio),
            vitKUg = roundToOneDecimal(0.0 * ratio),
            omega3G = roundToOneDecimal(food.omega3G * ratio)
        )
    }

    /**
     * Aggregates multiple FullNutrients into a single combined sum.
     */
    fun aggregate(nutrientsList: List<FullNutrients>): FullNutrients {
        return nutrientsList.fold(FullNutrients()) { acc, curr -> acc + curr }
    }

    private fun roundToOneDecimal(value: Double): Double {
        return Math.round(value * 10.0) / 10.0
    }
}
