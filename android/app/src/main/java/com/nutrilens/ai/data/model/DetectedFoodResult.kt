package com.nutrilens.ai.data.model

import androidx.annotation.Keep

/**
 * Data structures for parsing Gemini Vision JSON responses.
 * STRICT RULE: Gemini ONLY provides food names, estimated weight in grams,
 * preparation, and confidence. Gemini NEVER provides nutrition or calories.
 */
@Keep
data class DetectedFoodItem(
    val name: String,
    val weight_g: Double = 100.0,
    val preparation: String = "raw",
    val confidence: Double = 1.0
)

@Keep
data class DetectedFoodResponse(
    val foods: List<DetectedFoodItem> = emptyList()
)

@Keep
data class IngredientBreakdownResponse(
    val ingredients: List<String> = emptyList()
)
