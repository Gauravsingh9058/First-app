package com.nutrilens.ai.data.remote

import android.graphics.Bitmap
import android.util.Base64
import android.util.Log
import com.nutrilens.ai.data.model.DetectedFoodItem
import com.nutrilens.ai.data.model.DetectedFoodResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.net.HttpURLConnection
import java.net.URL

/**
 * Service for invoking Gemini Vision API strictly for Food Recognition (Image -> Food Names + Confidence).
 * 
 * STRICT MANDATE:
 * 1. Gemini Vision ONLY identifies food names and visual confidence scores.
 * 2. Gemini MUST NEVER calculate calories, protein, carbs, fat, vitamins, minerals, or serving sizes.
 * 3. Returns pure JSON schema: {"foods": [{"name": "food_name", "confidence": 0.98}]}
 */
class FoodRecognitionService(
    private val apiKey: String
) {

    companion object {
        private const val TAG = "NutriLens_FoodRecognition"
        private const val GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

        private const val RECOGNITION_SYSTEM_PROMPT = """
You are a pure computer vision food recognition engine.
Analyze the provided image and identify every visible food item, beverage, dish component, or ingredient.

STRICT MANDATE & CRITICAL RULES:
1. Return ONLY the food names and your visual confidence score (0.0 to 1.0).
2. You MUST NEVER output calories, protein, carbs, fat, vitamins, minerals, serving sizes, or health scores.
3. If no food is identified, return an empty array: {"foods": []}.
4. Respond ONLY with valid raw JSON (no markdown formatting, no codeblocks, no explanations).

Schema:
{
  "foods": [
    {
      "name": "banana",
      "confidence": 0.98
    },
    {
      "name": "steamed white rice",
      "confidence": 0.95
    }
  ]
}
"""
    }

    /**
     * Sends food image to Gemini Vision API and returns list of detected food names with confidence scores.
     */
    suspend fun recognizeFoodsFromImage(bitmap: Bitmap): Result<DetectedFoodResponse> =
        withContext(Dispatchers.IO) {
            try {
                val base64Image = compressAndEncodeImage(bitmap)
                val payload = buildPayload(base64Image)

                val responseJsonStr = executeHttpRequest(payload)
                val rawText = extractTextFromGeminiResponse(responseJsonStr)

                val cleanedJson = sanitizeJson(rawText)
                val jsonObject = JSONObject(cleanedJson)

                val foodsArray = jsonObject.optJSONArray("foods") ?: return@withContext Result.success(
                    DetectedFoodResponse(emptyList())
                )

                val foodItems = mutableListOf<DetectedFoodItem>()
                for (i in 0 until foodsArray.length()) {
                    val obj = foodsArray.getJSONObject(i)
                    val name = obj.optString("name", "").trim()
                    val confidence = obj.optDouble("confidence", 0.9)
                    if (name.isNotEmpty()) {
                        foodItems.add(
                            DetectedFoodItem(
                                name = name,
                                weight_g = 100.0, // Default baseline 100g, scaled in UI/SQLite lookup
                                preparation = "cooked",
                                confidence = confidence
                            )
                        )
                    }
                }

                Result.success(DetectedFoodResponse(foodItems))
            } catch (e: Exception) {
                Log.e(TAG, "Gemini Vision recognition failed", e)
                Result.failure(e)
            }
        }

    private fun compressAndEncodeImage(bitmap: Bitmap): String {
        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 85, stream)
        val byteArray = stream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.NO_WRAP)
    }

    private fun buildPayload(base64Image: String): String {
        return JSONObject().apply {
            put("contents", org.json.JSONArray().apply {
                put(JSONObject().apply {
                    put("parts", org.json.JSONArray().apply {
                        put(JSONObject().apply {
                            put("text", RECOGNITION_SYSTEM_PROMPT)
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

    private fun executeHttpRequest(payload: String): String {
        val url = URL("$GEMINI_API_URL?key=$apiKey")
        val conn = url.openConnection() as HttpURLConnection
        conn.requestMethod = "POST"
        conn.setRequestProperty("Content-Type", "application/json")
        conn.connectTimeout = 12000
        conn.readTimeout = 12000
        conn.doOutput = true

        conn.outputStream.use { os ->
            os.write(payload.toByteArray(Charsets.UTF_8))
        }

        val code = conn.responseCode
        if (code in 200..299) {
            return conn.inputStream.bufferedReader().use { it.readText() }
        } else {
            val err = conn.errorStream?.bufferedReader()?.use { it.readText() } ?: ""
            throw Exception("Gemini API HTTP Error $code: $err")
        }
    }

    private fun extractTextFromGeminiResponse(responseJsonStr: String): String {
        val root = JSONObject(responseJsonStr)
        val candidates = root.optJSONArray("candidates") ?: throw Exception("No candidates in response")
        if (candidates.length() == 0) return "{\"foods\":[]}"

        val content = candidates.getJSONObject(0).optJSONObject("content") ?: return "{\"foods\":[]}"
        val parts = content.optJSONArray("parts") ?: return "{\"foods\":[]}"
        if (parts.length() == 0) return "{\"foods\":[]}"

        return parts.getJSONObject(0).optString("text", "{\"foods\":[]}")
    }

    private fun sanitizeJson(raw: String): String {
        return raw.replace("```json", "").replace("```", "").trim()
    }
}
