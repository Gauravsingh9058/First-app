package com.nutrilens.ai.data.repository

import com.nutrilens.ai.data.model.DailyNutritionSummary
import com.nutrilens.ai.data.model.LoggedFoodPortion
import com.nutrilens.ai.data.model.MealEntry
import com.nutrilens.ai.data.model.MealType
import com.nutrilens.ai.domain.calculator.ParsedMealNutritionResult
import com.nutrilens.ai.util.NutritionCalculator
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.concurrent.ConcurrentHashMap

/**
 * Interface for logging manual ingredients, retrieving daily/weekly/monthly nutrition summaries.
 */
interface DailyNutritionRepository {

    suspend fun logManualMeal(
        dateString: String,
        mealResult: ParsedMealNutritionResult
    ): DailyNutritionSummary

    suspend fun getDailySummary(dateString: String): DailyNutritionSummary

    suspend fun getWeeklySummary(dateStrings: List<String>): List<DailyNutritionSummary>

    suspend fun getMonthlySummary(dateStrings: List<String>): List<DailyNutritionSummary>
}

/**
 * Production local implementation for logging and aggregating daily, weekly, and monthly nutrition totals.
 * Works 100% offline using in-memory / local thread-safe stores.
 */
class DailyNutritionRepositoryImpl : DailyNutritionRepository {

    private val dailyStore = ConcurrentHashMap<String, DailyNutritionSummary>()

    override suspend fun logManualMeal(
        dateString: String,
        mealResult: ParsedMealNutritionResult
    ): DailyNutritionSummary = withContext(Dispatchers.IO) {
        val existing = dailyStore[dateString] ?: DailyNutritionSummary(dateString = dateString)

        val portions = mealResult.ingredients.mapNotNull { item ->
            val serving = item.servingItem ?: return@mapNotNull null
            LoggedFoodPortion(
                foodId = serving.foodId,
                foodName = serving.foodName,
                quantity = serving.inputQuantity,
                servingUnit = serving.inputUnit,
                netWeightGrams = serving.netWeightGrams,
                nutrients = serving.nutrients
            )
        }

        val mealEntry = MealEntry(
            mealType = mealResult.mealType,
            portions = portions,
            totalWeightGrams = mealResult.totalWeightGrams,
            totalNutrients = mealResult.totalNutrients
        )

        val updatedBreakfast = existing.breakfast.toMutableList()
        val updatedLunch = existing.lunch.toMutableList()
        val updatedDinner = existing.dinner.toMutableList()
        val updatedSnacks = existing.snacks.toMutableList()

        when (mealResult.mealType) {
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

    override suspend fun getWeeklySummary(dateStrings: List<String>): List<DailyNutritionSummary> =
        withContext(Dispatchers.IO) {
            dateStrings.map { date ->
                dailyStore[date] ?: DailyNutritionSummary(dateString = date)
            }
        }

    override suspend fun getMonthlySummary(dateStrings: List<String>): List<DailyNutritionSummary> =
        withContext(Dispatchers.IO) {
            dateStrings.map { date ->
                dailyStore[date] ?: DailyNutritionSummary(dateString = date)
            }
        }
}
