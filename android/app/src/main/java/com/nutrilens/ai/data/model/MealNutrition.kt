package com.nutrilens.ai.data.model

import androidx.annotation.Keep

/**
 * Supported meal classifications for daily logging.
 */
@Keep
enum class MealType {
    BREAKFAST,
    LUNCH,
    DINNER,
    SNACK
}

/**
 * Individual logged food portion within a meal.
 */
@Keep
data class LoggedFoodPortion(
    val id: String = java.util.UUID.randomUUID().toString(),
    val foodId: Long,
    val foodName: String,
    val quantity: Double,
    val servingUnit: String,
    val netWeightGrams: Double,
    val nutrients: FullNutrients
)

/**
 * Complete logged meal (e.g., Lunch) comprising multiple food portions.
 */
@Keep
data class MealEntry(
    val id: String = java.util.UUID.randomUUID().toString(),
    val mealType: MealType,
    val loggedAtTimestamp: Long = System.currentTimeMillis(),
    val portions: List<LoggedFoodPortion>,
    val totalWeightGrams: Double,
    val totalNutrients: FullNutrients
)

/**
 * Daily aggregation summarizing nutritional totals across Breakfast, Lunch, Dinner, and Snacks.
 */
@Keep
data class DailyNutritionSummary(
    val dateString: String, // YYYY-MM-DD
    val breakfast: List<MealEntry> = emptyList(),
    val lunch: List<MealEntry> = emptyList(),
    val dinner: List<MealEntry> = emptyList(),
    val snacks: List<MealEntry> = emptyList(),
    val waterGlasses: Int = 0,
    val totalDailyNutrients: FullNutrients = FullNutrients(),
    val totalDailyWeightGrams: Double = 0.0
)
