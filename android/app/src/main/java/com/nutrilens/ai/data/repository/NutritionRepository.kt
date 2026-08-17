package com.nutrilens.ai.data.repository

import com.nutrilens.ai.data.model.DailyNutritionSummary
import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.MealEntry
import com.nutrilens.ai.data.model.MealType

/**
 * Repository interface for computing, logging, and retrieving daily nutrition totals.
 */
interface NutritionRepository {

    /**
     * Calculates full scaled nutrition for a given Food item and portion size.
     */
    suspend fun calculatePortionNutrition(
        food: Food,
        quantity: Double,
        unit: String
    ): com.nutrilens.ai.data.model.LoggedFoodPortion

    /**
     * Calculates combined meal entry from a list of portions for a given meal type.
     */
    suspend fun calculateMealEntry(
        mealType: MealType,
        portions: List<com.nutrilens.ai.data.model.LoggedFoodPortion>
    ): MealEntry

    /**
     * Logs a completed meal entry for a given date (YYYY-MM-DD).
     */
    suspend fun logMeal(dateString: String, mealEntry: MealEntry): DailyNutritionSummary

    /**
     * Retrieves daily summary for a given date.
     */
    suspend fun getDailySummary(dateString: String): DailyNutritionSummary
}
