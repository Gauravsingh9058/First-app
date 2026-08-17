package com.nutrilens.ai.domain.parser

import androidx.annotation.Keep
import java.util.Locale
import java.util.regex.Pattern

/**
 * Parsed representation of a raw manual ingredient line.
 */
@Keep
data class ParsedIngredient(
    val rawText: String,
    val foodName: String,
    val quantity: Double,
    val unit: String
)

/**
 * High-performance offline Ingredient Parser.
 * Extracts food name, numerical quantity, and serving unit from natural text input.
 *
 * Examples:
 * - "2 Eggs" -> qty=2.0, unit="piece", foodName="Egg"
 * - "250g Chicken Breast" -> qty=250.0, unit="g", foodName="Chicken Breast"
 * - "100g Rice" -> qty=100.0, unit="g", foodName="Rice"
 * - "150ml Milk" -> qty=150.0, unit="ml", foodName="Milk"
 * - "1 Apple" -> qty=1.0, unit="piece", foodName="Apple"
 * - "1 Banana" -> qty=1.0, unit="piece", foodName="Banana"
 * - "30g Peanut Butter" -> qty=30.0, unit="g", foodName="Peanut Butter"
 * - "200g Paneer" -> qty=200.0, unit="g", foodName="Paneer"
 * - "2 Chapati" -> qty=2.0, unit="piece", foodName="Chapati"
 * - "100g Curd" -> qty=100.0, unit="g", foodName="Curd"
 */
object IngredientParser {

    private val UNITS = listOf(
        "kilogram", "kilograms", "kg",
        "gram", "grams", "g",
        "milliliter", "milliliters", "ml",
        "liter", "liters", "l",
        "tablespoon", "tablespoons", "tbsp", "tbs",
        "teaspoon", "teaspoons", "tsp",
        "cup", "cups",
        "ounce", "ounces", "oz",
        "pound", "pounds", "lb", "lbs",
        "piece", "pieces", "pc", "pcs",
        "slice", "slices",
        "bowl", "bowls",
        "serving", "servings",
        "portion", "portions", "head", "heads", "clove", "cloves"
    )

    // Regex matching numbers/fractions attached directly or separated from unit & food
    // e.g. "250g", "2.5 kg", "1/2 cup", "2"
    private val REGEX_PATTERN = Pattern.compile(
        "^\\s*(?:(\\d+(?:\\.\\d+)?)\\s*(/\\s*(\\d+(?:\\.\\d+)?))?|(\\d+))?\\s*([a-zA-Z]+)?\\s*(.*)$",
        Pattern.CASE_INSENSITIVE
    )

    /**
     * Parses a block of text (single line, comma-separated, or multiline) into a list of [ParsedIngredient].
     */
    fun parseInputText(text: String): List<ParsedIngredient> {
        if (text.isBlank()) return emptyList()

        val lines = text.split("\n", ",", ";")
            .map { it.trim() }
            .filter { it.isNotEmpty() }

        return lines.mapNotNull { parseSingleLine(it) }
    }

    /**
     * Parses a single ingredient line into a structured [ParsedIngredient].
     */
    fun parseSingleLine(rawLine: String): ParsedIngredient? {
        val trimmed = rawLine.trim()
        if (trimmed.isEmpty()) return null

        val lower = trimmed.lowercase(Locale.ROOT)

        // 1. Check for number + unit attached without space (e.g. 250g, 150ml, 30g, 200g, 100g)
        val attachedMatch = Pattern.compile("^(\\d+(?:\\.\\d+)?)\\s*([a-zA-Z]+)\\s+(.+)$").matcher(trimmed)
        if (attachedMatch.matches()) {
            val qtyStr = attachedMatch.group(1) ?: "1"
            val unitCandidate = attachedMatch.group(2) ?: "g"
            val foodPart = attachedMatch.group(3) ?: ""

            val qty = qtyStr.toDoubleOrNull() ?: 1.0
            val normalizedUnit = normalizeUnit(unitCandidate)
            val foodName = cleanFoodName(foodPart)

            if (foodName.isNotEmpty()) {
                return ParsedIngredient(
                    rawText = trimmed,
                    foodName = foodName,
                    quantity = qty,
                    unit = normalizedUnit
                )
            }
        }

        // 2. Token based matching for standalone quantity + optional unit + food name
        val tokens = trimmed.split("\\s+".toRegex())
        var quantity = 1.0
        var unit = "piece"
        var foodStartIndex = 0

        // Parse fraction like 1/2 or decimal like 2.5
        if (tokens.isNotEmpty()) {
            val firstToken = tokens[0]
            val num = parseQuantityToken(firstToken)
            if (num != null) {
                quantity = num
                foodStartIndex = 1

                if (tokens.size > 1) {
                    val secondToken = tokens[1].lowercase(Locale.ROOT)
                    if (UNITS.contains(secondToken)) {
                        unit = normalizeUnit(secondToken)
                        foodStartIndex = 2
                    }
                }
            }
        }

        val rawFoodName = tokens.drop(foodStartIndex).joinToString(" ")
        val cleanedFoodName = cleanFoodName(rawFoodName)

        val finalFoodName = if (cleanedFoodName.isEmpty()) {
            // Fallback if whole line was passed
            cleanFoodName(trimmed)
        } else {
            cleanedFoodName
        }

        if (finalFoodName.isEmpty()) return null

        return ParsedIngredient(
            rawText = trimmed,
            foodName = finalFoodName,
            quantity = quantity,
            unit = unit
        )
    }

    private fun parseQuantityToken(token: String): Double? {
        if (token.contains("/")) {
            val parts = token.split("/")
            if (parts.size == 2) {
                val num = parts[0].toDoubleOrNull()
                val den = parts[1].toDoubleOrNull()
                if (num != null && den != null && den != 0.0) {
                    return num / den
                }
            }
        }
        return token.toDoubleOrNull()
    }

    private fun normalizeUnit(unitCandidate: String): String {
        val lower = unitCandidate.lowercase(Locale.ROOT).trim()
        return when (lower) {
            "g", "gram", "grams" -> "g"
            "kg", "kilogram", "kilograms" -> "kg"
            "ml", "milliliter", "milliliters" -> "ml"
            "l", "liter", "liters" -> "liter"
            "tbsp", "tbs", "tablespoon", "tablespoons" -> "tbsp"
            "tsp", "teaspoon", "teaspoons" -> "tsp"
            "cup", "cups" -> "cup"
            "oz", "ounce", "ounces" -> "oz"
            "lb", "lbs", "pound", "pounds" -> "lb"
            "slice", "slices" -> "slice"
            "bowl", "bowls" -> "bowl"
            "serving", "servings" -> "serving"
            "portion", "portions" -> "portion"
            else -> "piece"
        }
    }

    private fun cleanFoodName(rawName: String): String {
        var clean = rawName
            .replace("[^a-zA-Z0-9\\s]".toRegex(), " ")
            .replace("\\s+".toRegex(), " ")
            .trim()

        // Singularize common plurals
        val lower = clean.lowercase(Locale.ROOT)
        clean = when {
            lower.endsWith("eggs") -> clean.substring(0, clean.length - 1)
            lower.endsWith("apples") -> clean.substring(0, clean.length - 1)
            lower.endsWith("bananas") -> clean.substring(0, clean.length - 1)
            lower.endsWith("chapatis") -> clean.substring(0, clean.length - 1)
            lower.endsWith("rotis") -> clean.substring(0, clean.length - 1)
            else -> clean
        }

        return clean.trim()
    }
}
