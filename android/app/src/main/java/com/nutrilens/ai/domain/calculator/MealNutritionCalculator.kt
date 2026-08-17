package com.nutrilens.ai.domain.calculator

import androidx.annotation.Keep
import com.nutrilens.ai.data.model.FullNutrients
import com.nutrilens.ai.data.model.MealType
import com.nutrilens.ai.domain.matcher.FoodMatchResult
import com.nutrilens.ai.domain.parser.IngredientParser
import com.nutrilens.ai.domain.parser.ParsedIngredient
import com.nutrilens.ai.domain.search.FoodSearchEngine
import com.nutrilens.ai.util.CalculatedServingItem
import com.nutrilens.ai.util.NutritionCalculator
import com.nutrilens.ai.util.ServingCalculator
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.roundToInt

@Keep
data class CalculatedIngredientResult(
    val parsed: ParsedIngredient,
    val matchedFoodName: String?,
    val matchConfidence: Double,
    val servingItem: CalculatedServingItem?
)

@Keep
data class ParsedMealNutritionResult(
    val mealType: MealType,
    val rawInputText: String,
    val ingredients: List<CalculatedIngredientResult>,
    val totalWeightGrams: Double,
    val totalCalories: Double,
    val totalProteinG: Double,
    val totalFatG: Double,
    val totalCarbsG: Double,
    val totalFiberG: Double,
    val totalSugarG: Double,
    val totalNetCarbsG: Double,
    val totalWaterG: Double,
    val totalNutrients: FullNutrients
)

/**
 * Meal Nutrition Calculator for Manual Ingredient Entries.
 *
 * Process:
 * 1. Takes raw manual text entries (e.g. "2 Eggs", "250g Chicken Breast", "100g Rice", "150ml Milk")
 * 2. Parses quantity, unit, and food name using [IngredientParser]
 * 3. Queries local SQLite fooddata.db database via [FoodSearchEngine]
 * 4. Scales per-100g USDA nutrition values using [ServingCalculator]
 * 5. Aggregates all ingredient totals deterministically without internet or Gemini calls
 */
class MealNutritionCalculator(
    private val foodSearchEngine: FoodSearchEngine
) {

    /**
     * Calculates complete meal nutrition for raw manual ingredient text input.
     */
    suspend fun calculateMealFromText(
        inputText: String,
        mealType: MealType = MealType.LUNCH
    ): ParsedMealNutritionResult = withContext(Dispatchers.IO) {
        val parsedIngredients = IngredientParser.parseInputText(inputText)
        return@withContext calculateMealFromParsed(parsedIngredients, inputText, mealType)
    }

    /**
     * Calculates complete meal nutrition from a pre-parsed list of [ParsedIngredient].
     */
    suspend fun calculateMealFromParsed(
        parsedIngredients: List<ParsedIngredient>,
        rawText: String = "",
        mealType: MealType = MealType.LUNCH
    ): ParsedMealNutritionResult = withContext(Dispatchers.IO) {
        val ingredientResults = mutableListOf<CalculatedIngredientResult>()

        for (parsed in parsedIngredients) {
            val matchResult = foodSearchEngine.searchFoodItem(parsed.foodName)

            when (matchResult) {
                is FoodMatchResult.Success -> {
                    val food = matchResult.matchedFood
                    val servingItem = ServingCalculator.calculateServing(
                        food = food,
                        quantity = parsed.quantity,
                        unit = parsed.unit
                    )

                    ingredientResults.add(
                        CalculatedIngredientResult(
                            parsed = parsed,
                            matchedFoodName = food.name,
                            matchConfidence = matchResult.confidenceScore,
                            servingItem = servingItem
                        )
                    )
                }
                is FoodMatchResult.NoMatch -> {
                    ingredientResults.add(
                        CalculatedIngredientResult(
                            parsed = parsed,
                            matchedFoodName = null,
                            matchConfidence = 0.0,
                            servingItem = null
                        )
                    )
                }
            }
        }

        val validServings = ingredientResults.mapNotNull { it.servingItem }
        val totalWeightGrams = roundToOneDecimal(validServings.sumOf { it.netWeightGrams })
        val totalNutrients = NutritionCalculator.aggregate(validServings.map { it.nutrients })

        ParsedMealNutritionResult(
            mealType = mealType,
            rawInputText = rawText,
            ingredients = ingredientResults,
            totalWeightGrams = totalWeightGrams,
            totalCalories = roundToOneDecimal(totalNutrients.calories),
            totalProteinG = roundToOneDecimal(totalNutrients.proteinG),
            totalFatG = roundToOneDecimal(totalNutrients.fatG),
            totalCarbsG = roundToOneDecimal(totalNutrients.carbsG),
            totalFiberG = roundToOneDecimal(totalNutrients.fiberG),
            totalSugarG = roundToOneDecimal(totalNutrients.sugarG),
            totalNetCarbsG = roundToOneDecimal(totalNutrients.netCarbsG),
            totalWaterG = roundToOneDecimal(totalNutrients.waterG),
            totalNutrients = totalNutrients
        )
    }

    private fun roundToOneDecimal(value: Double): Double {
        return (value * 10.0).roundToInt() / 10.0
    }
}
