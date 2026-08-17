package com.nutrilens.ai.domain.calculator

import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.FullNutrients
import com.nutrilens.ai.data.model.ScannedFoodItem
import com.nutrilens.ai.data.model.ScannedMealResult
import com.nutrilens.ai.domain.matcher.FoodMatchResult
import com.nutrilens.ai.util.NutritionCalculator

/**
 * Precision Meal Nutrition Calculator.
 * 
 * STRICT MANDATE:
 * 1. 100% of all calories, macros, micro-nutrients, and vitamins are derived strictly from USDA fooddata.db entries.
 * 2. Gemini is NEVER permitted to calculate, estimate, or guess any nutrition value.
 * 3. Multi-food plates are calculated per individual item and aggregated deterministically.
 */
object MealCalculator {

    /**
     * Calculates scaled nutrients for a single matched food item given detected weight in grams.
     * Formula: (weight_g * nutrient_per_100g) / 100.0
     */
    fun calculateItemNutrition(
        foodMatch: FoodMatchResult.Success,
        weightG: Double,
        preparation: String = "cooked"
    ): ScannedFoodItem {
        val food = foodMatch.matchedFood
        val fullNutrients = NutritionCalculator.calculateForWeight(food, weightG)

        return ScannedFoodItem(
            detectedName = foodMatch.detectedName,
            matchedFood = food,
            estimatedWeightG = weightG,
            preparation = preparation,
            confidence = foodMatch.confidenceScore,
            scaledCalories = fullNutrients.calories,
            scaledProteinG = fullNutrients.proteinG,
            scaledCarbsG = fullNutrients.carbsG,
            scaledFatG = fullNutrients.fatG,
            scaledFiberG = fullNutrients.fiberG,
            scaledSugarG = fullNutrients.sugarG,
            scaledSodiumMg = fullNutrients.sodiumMg,
            scaledPotassiumMg = fullNutrients.potassiumMg,
            scaledCalciumMg = fullNutrients.calciumMg,
            scaledIronMg = fullNutrients.ironMg,
            scaledMagnesiumMg = fullNutrients.magnesiumMg,
            scaledVitAUg = fullNutrients.vitAUg,
            scaledVitB12Ug = fullNutrients.vitB12Ug,
            scaledVitDUg = fullNutrients.vitDUg,
            scaledOmega3G = fullNutrients.omega3G
        )
    }

    /**
     * Aggregates a list of scanned food items into a complete meal result.
     */
    fun aggregateMeal(items: List<ScannedFoodItem>): ScannedMealResult {
        val totalWeight = items.sumOf { it.estimatedWeightG }
        val totalCals = items.sumOf { it.scaledCalories }
        val totalProtein = items.sumOf { it.scaledProteinG }
        val totalCarbs = items.sumOf { it.scaledCarbsG }
        val totalFat = items.sumOf { it.scaledFatG }
        val totalFiber = items.sumOf { it.scaledFiberG }
        val totalSugar = items.sumOf { it.scaledSugarG }
        val totalSodium = items.sumOf { it.scaledSodiumMg }
        val totalPotassium = items.sumOf { it.scaledPotassiumMg }
        val totalCalcium = items.sumOf { it.scaledCalciumMg }
        val totalIron = items.sumOf { it.scaledIronMg }
        val totalMagnesium = items.sumOf { it.scaledMagnesiumMg }
        val totalVitA = items.sumOf { it.scaledVitAUg }
        val totalVitB12 = items.sumOf { it.scaledVitB12Ug }
        val totalVitD = items.sumOf { it.scaledVitDUg }
        val totalOmega3 = items.sumOf { it.scaledOmega3G }
        val avgConfidence = if (items.isNotEmpty()) items.map { it.confidence }.average() else 0.0

        return ScannedMealResult(
            items = items,
            totalWeightG = totalWeight,
            totalCalories = totalCals,
            totalProteinG = totalProtein,
            totalCarbsG = totalCarbs,
            totalFatG = totalFat,
            totalFiberG = totalFiber,
            totalSugarG = totalSugar,
            totalSodiumMg = totalSodium,
            totalPotassiumMg = totalPotassium,
            totalCalciumMg = totalCalcium,
            totalIronMg = totalIron,
            totalMagnesiumMg = totalMagnesium,
            totalVitAUg = totalVitA,
            totalVitB12Ug = totalVitB12,
            totalVitDUg = totalVitD,
            totalOmega3G = totalOmega3,
            overallConfidence = avgConfidence
        )
    }
}
