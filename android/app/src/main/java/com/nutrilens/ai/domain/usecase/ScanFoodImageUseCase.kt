package com.nutrilens.ai.domain.usecase

import android.graphics.Bitmap
import android.util.Log
import com.nutrilens.ai.data.model.ScannedFoodItem
import com.nutrilens.ai.data.model.ScannedMealResult
import com.nutrilens.ai.data.remote.GeminiVisionService
import com.nutrilens.ai.data.repository.FoodRepository
import com.nutrilens.ai.data.repository.SQLiteSearchRepository
import com.nutrilens.ai.domain.calculator.MealCalculator
import com.nutrilens.ai.domain.matcher.FoodMatchResult
import com.nutrilens.ai.domain.matcher.FoodMatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * UseCase coordinating AI Vision detection with local USDA database lookup using FoodMatcher & MealCalculator.
 * 
 * STRICT ARCHITECTURAL GUARANTEE:
 * 1. Gemini Vision ONLY detects food item names & confidence scores.
 * 2. SQLite fooddata.db is the EXCLUSIVE source of all calories, macros, and micro-nutrients.
 * 3. Nutrients are strictly calculated using: (DetectedWeightG * NutrientPer100g) / 100.0
 * 4. Multi-food items are matched separately and aggregated locally.
 */
class ScanFoodImageUseCase(
    private val geminiVisionService: GeminiVisionService,
    private val foodRepository: FoodRepository,
    private val searchFoodUseCase: SearchFoodUseCase,
    private val sqLiteSearchRepository: SQLiteSearchRepository
) {

    private val foodMatcher = FoodMatcher(sqLiteSearchRepository)

    companion object {
        private const val TAG = "NutriLens_ScanUseCase"
    }

    suspend operator fun invoke(bitmap: Bitmap): Result<ScannedMealResult> = withContext(Dispatchers.IO) {
        try {
            // Step 1: Send image to Gemini Vision to detect items
            val visionResult = geminiVisionService.detectFoodsFromImage(bitmap)
            if (visionResult.isFailure) {
                return@withContext Result.failure(
                    visionResult.exceptionOrNull() ?: Exception("Failed to analyze food image with Gemini Vision")
                )
            }

            val detectedFoods = visionResult.getOrNull()?.foods ?: emptyList()
            if (detectedFoods.isEmpty()) {
                return@withContext Result.failure(Exception("No food items identified in the image"))
            }

            val scannedItems = mutableListOf<ScannedFoodItem>()

            // Step 2: Query SQLite for each detected food item using FoodMatcher
            for (item in detectedFoods) {
                val weight = if (item.weight_g > 0) item.weight_g else 100.0
                val matchResult = foodMatcher.matchFood(item.name)

                if (matchResult is FoodMatchResult.Success) {
                    val scannedItem = MealCalculator.calculateItemNutrition(
                        foodMatch = matchResult,
                        weightG = weight,
                        preparation = item.preparation
                    )
                    scannedItems.add(scannedItem)
                } else {
                    Log.w(TAG, "Food '${item.name}' not matched directly. Attempting ingredient breakdown...")
                    val breakdownResult = geminiVisionService.breakdownComplexFood(item.name)
                    val ingredients = breakdownResult.getOrNull()?.ingredients ?: emptyList()

                    if (ingredients.isNotEmpty()) {
                        val ingWeight = weight / ingredients.size.toDouble()
                        for (ingName in ingredients) {
                            val ingMatch = foodMatcher.matchFood(ingName)
                            if (ingMatch is FoodMatchResult.Success) {
                                scannedItems.add(
                                    MealCalculator.calculateItemNutrition(
                                        foodMatch = ingMatch,
                                        weightG = ingWeight,
                                        preparation = item.preparation
                                    )
                                )
                            }
                        }
                    } else {
                        Log.e(TAG, "Could not match '${item.name}' or its ingredients in local USDA database")
                    }
                }
            }

            if (scannedItems.isEmpty()) {
                return@withContext Result.failure(Exception("Identified items could not be matched in local USDA database"))
            }

            // Step 3: Aggregate meal nutrition strictly from local SQLite records
            val mealResult = MealCalculator.aggregateMeal(scannedItems)
            Result.success(mealResult)

        } catch (e: Exception) {
            Log.e(TAG, "Error processing food scan pipeline", e)
            Result.failure(e)
        }
    }
}
