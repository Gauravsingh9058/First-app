package com.nutrilens.ai.data.repository

import android.graphics.Bitmap
import com.nutrilens.ai.data.model.DetectedFoodItem
import com.nutrilens.ai.data.remote.FoodRecognitionService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Repository interface exposing food vision recognition.
 */
interface GeminiVisionRepository {
    suspend fun recognizeFoods(bitmap: Bitmap): Result<List<DetectedFoodItem>>
}

/**
 * Implementation of GeminiVisionRepository delegating to FoodRecognitionService.
 * Strictly performs image recognition (Image -> Labels). Zero nutrition calculation.
 */
class GeminiVisionRepositoryImpl(
    private val foodRecognitionService: FoodRecognitionService
) : GeminiVisionRepository {

    override suspend fun recognizeFoods(bitmap: Bitmap): Result<List<DetectedFoodItem>> =
        withContext(Dispatchers.IO) {
            val responseResult = foodRecognitionService.recognizeFoodsFromImage(bitmap)
            if (responseResult.isSuccess) {
                Result.success(responseResult.getOrNull()?.foods ?: emptyList())
            } else {
                Result.failure(responseResult.exceptionOrNull() ?: Exception("Vision recognition failed"))
            }
        }
}
