package com.nutrilens.ai.data.model

import androidx.annotation.Keep

/**
 * Single food item matched in fooddata.db with weight-scaled nutrients.
 */
@Keep
data class ScannedFoodItem(
    val detectedName: String,
    val matchedFood: Food,
    val estimatedWeightG: Double,
    val preparation: String,
    val confidence: Double,
    val scaledCalories: Double,
    val scaledProteinG: Double,
    val scaledCarbsG: Double,
    val scaledFatG: Double,
    val scaledFiberG: Double,
    val scaledSugarG: Double,
    val scaledSodiumMg: Double,
    val scaledPotassiumMg: Double,
    val scaledCalciumMg: Double,
    val scaledIronMg: Double,
    val scaledMagnesiumMg: Double,
    val scaledVitAUg: Double,
    val scaledVitB12Ug: Double,
    val scaledVitDUg: Double,
    val scaledOmega3G: Double
)

/**
 * Complete scanned meal result aggregated across all detected foods.
 * All nutrition values come 100% from USDA SQLite records.
 */
@Keep
data class ScannedMealResult(
    val items: List<ScannedFoodItem>,
    val totalWeightG: Double,
    val totalCalories: Double,
    val totalProteinG: Double,
    val totalCarbsG: Double,
    val totalFatG: Double,
    val totalFiberG: Double,
    val totalSugarG: Double,
    val totalSodiumMg: Double,
    val totalPotassiumMg: Double,
    val totalCalciumMg: Double,
    val totalIronMg: Double,
    val totalMagnesiumMg: Double,
    val totalVitAUg: Double,
    val totalVitB12Ug: Double,
    val totalVitDUg: Double,
    val totalOmega3G: Double,
    val overallConfidence: Double
)
