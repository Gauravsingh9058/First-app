package com.nutrilens.ai.data.remote

import android.graphics.Bitmap
import android.util.Base64
import android.util.Log
import com.nutrilens.ai.data.model.DetectedFoodResponse
import com.nutrilens.ai.data.model.IngredientBreakdownResponse
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.net.HttpURLConnection
import java.net.URL
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Service for communicating with Gemini Vision API.
 * 
 * CRITICAL ARCHITECTURAL CONSTRAINTS:
 * 1. Gemini is ONLY used for visual identification, ingredient breakdown, weight estimation, and preparation.
 * 2. Gemini MUST NEVER calculate or provide calories, macros, vitamins, or health scores.
 * 3. All prompts strictly instruct Gemini to output clean JSON without any nutrition values.
 */
class GeminiVisionService(
    private val apiKey: String
) {

    companion object {
        private const val TAG = "NutriLens_GeminiVision"
        private const val GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

        private const val FOOD_IDENTIFICATION_PROMPT = """
You are a precision food identification system. Analyze the provided food image.
Identify every visible food item, dish, or beverage.
For each item, estimate:
1. Exact name of the food item (e.g. "Banana", "Grilled Chicken Breast", "Steamed White Rice")
2. Estimated weight in grams (e.g. 150)
3. Preparation method (e.g. "raw", "grilled", "steamed", "fried", "boiled")
4. Visual confidence score between 0.0 and 1.0

CRITICAL STRICT RULE: You MUST NEVER output calories, protein, carbs, fat, vitamins, or any nutrition data.

Respond ONLY with a raw valid JSON object (no markdown wrapping, no markdown codeblocks, no explanations) adhering strictly to this schema:
{
  "foods": [
    {
      "name": "Food Name",
      "weight_g": 120,
      "preparation": "cooked",
      "confidence": 0.95
    }
  ]
}
"""

        private const val INGREDIENT_BREAKDOWN_PROMPT = """
You are a food ingredient breakdown system. Break down the specified complex food dish into its basic individual raw or cooked food ingredients only.

CRITICAL STRICT RULE: You MUST NEVER output calories, protein, carbs, fat, vitamins, or any nutrition data.

Respond ONLY with a raw valid JSON object (no markdown wrapping, no extra text):
{
  "ingredients": [
    "Ingredient 1",
    "Ingredient 2",
    "Ingredient 3"
  ]
}
"""
    }

    /**
     * Identifies foods and estimated weights from a camera bitmap.
     */
    suspend fun detectFoodsFromImage(bitmap: Bitmap): Result<DetectedFoodResponse> =
        withContext(Dispatchers.IO) {
            try {
                val base64Image = bitmapToBase64(bitmap)
                val requestBody = buildGeminiVisionPayload(base64Image, FOOD_IDENTIFICATION_PROMPT)

                val responseJson = postToGeminiApi(requestBody)
                val rawText = parseTextFromGeminiResponse(responseJson)

                val cleanedJson = sanitizeJsonResponse(rawText)
                val jsonObject = JSONObject(cleanedJson)

                val foodsArray = jsonObject.optJSONArray("foods") ?: return@withContext Result.failure(
                    Exception("No 'foods' array in Gemini Vision response")
                )

                val foodList = mutableListOf<com.nutrilens.ai.data.model.DetectedFoodItem>()
                for (i in 0 until foodsArray.length()) {
                    val item = foodsArray.getJSONObject(i)
                    foodList.add(
                        com.nutrilens.ai.data.model.DetectedFoodItem(
                            name = item.optString("name", "Unknown Food"),
                            weight_g = item.optDouble("weight_g", 100.0),
                            preparation = item.optString("preparation", "raw"),
                            confidence = item.optDouble("confidence", 0.9)
                        )
                    )
                }

                Result.success(DetectedFoodResponse(foodList))
            } catch (e: Exception) {
                Log.e(TAG, "Failed food detection with Gemini Vision", e)
                Result.failure(e)
            }
        }

    /**
     * Fallback breakdown request if a dish isn't directly found in USDA database.
     */
    suspend fun breakdownComplexFood(foodName: String): Result<IngredientBreakdownResponse> =
        withContext(Dispatchers.IO) {
            try {
                val prompt = "$INGREDIENT_BREAKDOWN_PROMPT\nComplex Dish to break down: \"$foodName\""
                val requestBody = buildGeminiTextPayload(prompt)

                val responseJson = postToGeminiApi(requestBody)
                val rawText = parseTextFromGeminiResponse(responseJson)

                val cleanedJson = sanitizeJsonResponse(rawText)
                val jsonObject = JSONObject(cleanedJson)

                val ingredientsArray = jsonObject.optJSONArray("ingredients") ?: return@withContext Result.failure(
                    Exception("No 'ingredients' array in Gemini response")
                )

                val ingredientsList = mutableListOf<String>()
                for (i in 0 until ingredientsArray.length()) {
                    ingredientsList.add(ingredientsArray.getString(i))
                }

                Result.success(IngredientBreakdownResponse(ingredientsList))
            } catch (e: Exception) {
                Log.e(TAG, "Failed ingredient breakdown for $foodName", e)
                Result.failure(e)
            }
        }

    private fun bitmapToBase64(bitmap: Bitmap): String {
        val stream = ByteArrayOutputStream()
        // Compress bitmap to JPEG for fast transport
        bitmap.compress(Bitmap.CompressFormat.JPEG, 85, stream)
        val byteArray = stream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.NO_WRAP)
    }

    private fun buildGeminiVisionPayload(base64Image: String, prompt: String): String {
        return JSONObject().apply {
            put("contents", org.json.JSONArray().apply {
                put(JSONObject().apply {
                    put("parts", org.json.JSONArray().apply {
                        put(JSONObject().apply {
                            put("text", prompt)
                        })
                        put(JSONObject().apply {
                            put("inline_data", JSONObject().apply {
                                put("mime_type", "image/jpeg")
                                put("data", base64Image)
                            })
                        })
                    })
                })
            })
        }.toString()
    }

    private fun buildGeminiTextPayload(prompt: String): String {
        return JSONObject().apply {
            put("contents", org.json.JSONArray().apply {
                put(JSONObject().apply {
                    put("parts", org.json.JSONArray().apply {
                        put(JSONObject().apply {
                            put("text", prompt)
                        })
                    })
                })
            })
        }.toString()
    }

    private fun postToGeminiApi(payload: String): String {
        val url = URL("$GEMINI_API_URL?key=$apiKey")
        val conn = url.openConnection() as HttpURLConnection
        conn.requestMethod = "POST"
        conn.setRequestProperty("Content-Type", "application/json")
        conn.connectTimeout = 15000
        conn.readTimeout = 15000
        conn.doOutput = true

        conn.outputStream.use { os ->
            os.write(payload.toByteArray(Charsets.UTF_8))
        }

        val code = conn.responseCode
        if (code in 200..299) {
            return conn.inputStream.bufferedReader().use { it.readText() }
        } else {
            val errText = conn.errorStream?.bufferedReader()?.use { it.readText() } ?: ""
            throw Exception("Gemini API Error (HTTP $code): $errText")
        }
    }

    private fun parseTextFromGeminiResponse(responseJson: String): String {
        val json = JSONObject(responseJson)
        val candidates = json.optJSONArray("candidates") ?: throw Exception("No candidates returned from Gemini API")
        if (candidates.length() == 0) throw Exception("Empty candidates array from Gemini API")

        val firstCandidate = candidates.getJSONObject(0)
        val content = firstCandidate.optJSONObject("content") ?: throw Exception("No content in candidate")
        val parts = content.optJSONArray("parts") ?: throw Exception("No parts in candidate content")
        if (parts.length() == 0) throw Exception("Empty parts array in candidate content")

        return parts.getJSONObject(0).optString("text", "")
    }

    private fun sanitizeJsonResponse(rawText: String): String {
        return rawText
            .replace("```json", "")
            .replace("```", "")
            .trim()
    }
}
