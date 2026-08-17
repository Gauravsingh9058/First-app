package com.nutrilens.ai.util

import androidx.annotation.Keep
import java.util.regex.Pattern

@Keep
data class ParsedIngredient(
    val rawText: String,
    val foodName: String,
    val quantity: Double,
    val unit: String
)

/**
 * Intelligent Ingredient Parser.
 * Extracts quantity, measurement unit, and clean food name from natural text inputs.
 * Examples:
 * - "250g Chicken Breast" -> Quantity: 250.0, Unit: "g", FoodName: "Chicken Breast"
 * - "2 Eggs" -> Quantity: 2.0, Unit: "piece", FoodName: "Egg"
 * - "150ml Milk" -> Quantity: 150.0, Unit: "ml", FoodName: "Milk"
 * - "1.5 cups Rice" -> Quantity: 1.5, Unit: "cup", FoodName: "Rice"
 * - "30g Peanut Butter" -> Quantity: 30.0, Unit: "g", FoodName: "Peanut Butter"
 */
object IngredientParser {

    private val QUANTITY_UNIT_PATTERN = Pattern.compile(
        "^\\s*([0-9]+(?:\\.[0-9]+)?|[0-9]+\\/[0-9]+)?\\s*([a-zA-Z]+)?\\s+(.+)\$",
        Pattern.CASE_INSENSITIVE
    )

    private val COMPACT_PATTERN = Pattern.compile(
        "^\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(g|kg|ml|l|liter|liters|oz|lb|lbs|cup|cups|tbsp|tsp|piece|pieces|slice|slices|serving|servings|portion|portions)?\\b\\s*(.+)\$",
        Pattern.CASE_INSENSITIVE
    )

    private val KNOWN_UNITS = setOf(
        "g", "gram", "grams", "kg", "kilogram", "kilograms",
        "ml", "milliliter", "milliliters", "l", "liter", "liters",
        "oz", "ounce", "ounces", "lb", "lbs", "pound", "pounds",
        "cup", "cups", "tbsp", "tablespoon", "tablespoons",
        "tsp", "teaspoon", "teaspoons", "piece", "pieces",
        "slice", "slices", "serving", "servings", "portion", "portions",
        "egg", "eggs", "chapati", "chapatis", "roti", "rotis", "apple", "apples", "banana", "bananas"
    )

    fun parseLine(inputLine: String): ParsedIngredient {
        val line = inputLine.trim()
        if (line.isEmpty()) {
            return ParsedIngredient(line, "", 1.0, "serving")
        }

        // Try compact pattern e.g. "250g Chicken" or "2 Eggs"
        val compactMatcher = COMPACT_PATTERN.matcher(line)
        if (compactMatcher.matches()) {
            val qtyStr = compactMatcher.group(1)
            val unitStr = compactMatcher.group(2)
            val foodStr = compactMatcher.group(3)

            val qty = parseQuantity(qtyStr)
            val (unit, cleanFood) = normalizeUnitAndFood(unitStr, foodStr)

            return ParsedIngredient(
                rawText = line,
                foodName = cleanFood,
                quantity = qty,
                unit = unit
            )
        }

        // Try standard space-separated pattern
        val matcher = QUANTITY_UNIT_PATTERN.matcher(line)
        if (matcher.matches()) {
            val qtyStr = matcher.group(1)
            val potentialUnit = matcher.group(2)
            val remainder = matcher.group(3)

            val qty = parseQuantity(qtyStr)
            if (potentialUnit != null && KNOWN_UNITS.contains(potentialUnit.lowercase())) {
                val (unit, cleanFood) = normalizeUnitAndFood(potentialUnit, remainder)
                return ParsedIngredient(
                    rawText = line,
                    foodName = cleanFood,
                    quantity = qty,
                    unit = unit
                )
            } else {
                val combinedFood = if (potentialUnit != null) "$potentialUnit $remainder" else remainder ?: line
                return ParsedIngredient(
                    rawText = line,
                    foodName = cleanFoodName(combinedFood),
                    quantity = qty,
                    unit = "piece"
                )
            }
        }

        return ParsedIngredient(
            rawText = line,
            foodName = cleanFoodName(line),
            quantity = 1.0,
            unit = "serving"
        )
    }

    fun parseMultipleLines(input: String): List<ParsedIngredient> {
        return input.split("\n", ",")
            .map { it.trim() }
            .filter { it.isNotEmpty() }
            .map { parseLine(it) }
    }

    private fun parseQuantity(qtyStr: String?): Double {
        if (qtyStr == null) return 1.0
        return try {
            if (qtyStr.contains("/")) {
                val parts = qtyStr.split("/")
                val num = parts[0].trim().toDouble()
                val den = parts[1].trim().toDouble()
                if (den != 0.0) num / den else 1.0
            } else {
                qtyStr.toDouble()
            }
        } catch (e: Exception) {
            1.0
        }
    }

    private fun normalizeUnitAndFood(unitStr: String?, foodStr: String?): Pair<String, String> {
        val food = cleanFoodName(foodStr ?: "")
        val rawUnit = unitStr?.lowercase()?.trim() ?: "serving"

        val normalizedUnit = when (rawUnit) {
            "g", "gram", "grams" -> "g"
            "kg", "kilogram", "kilograms" -> "kg"
            "ml", "milliliter", "milliliters" -> "ml"
            "l", "liter", "liters" -> "l"
            "oz", "ounce", "ounces" -> "oz"
            "lb", "lbs", "pound", "pounds" -> "lb"
            "cup", "cups" -> "cup"
            "tbsp", "tablespoon", "tablespoons" -> "tbsp"
            "tsp", "teaspoon", "teaspoons" -> "tsp"
            "piece", "pieces" -> "piece"
            "slice", "slices" -> "slice"
            "portion", "portions" -> "portion"
            else -> "serving"
        }

        return Pair(normalizedUnit, food)
    }

    private fun cleanFoodName(name: String): String {
        return name
            .replace(Regex("(?i)\\b(fresh|raw|cooked|organic|boiled|fried|grilled|steamed|roasted|baked|sliced|chopped)\\b"), "")
            .replace(Regex("[^a-zA-Z0-9\\s]"), " ")
            .trim()
            .replace(Regex("\\s+"), " ")
    }
}
