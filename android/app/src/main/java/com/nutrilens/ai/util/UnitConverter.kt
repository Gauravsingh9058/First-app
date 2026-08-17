package com.nutrilens.ai.util

import java.util.Locale

/**
 * Universal Serving Unit Converter.
 * Converts user serving units (grams, kg, ml, liter, cup, tbsp, tsp, piece, slice, bowl, oz, lb)
 * into standardized net weight in grams for USDA per-100g nutrient scaling.
 */
object UnitConverter {

    /**
     * Converts quantity + unit into equivalent weight in grams.
     * Optional foodName allows item-aware default piece/portion weights.
     */
    fun toGrams(
        quantity: Double,
        unit: String,
        customUnitGramWeight: Double? = null,
        foodName: String? = null
    ): Double {
        if (quantity <= 0.0) return 0.0

        val normalizedUnit = unit.trim().lowercase(Locale.ROOT)

        // 1. If explicit custom weight per unit exists from database portion table, use it
        if (customUnitGramWeight != null && customUnitGramWeight > 0.0) {
            return quantity * customUnitGramWeight
        }

        // 2. Standardized physical volume / mass conversions
        return when (normalizedUnit) {
            "g", "gram", "grams" -> quantity
            "kg", "kilogram", "kilograms" -> quantity * 1000.0
            "ml", "milliliter", "milliliters" -> quantity * 1.0 // Standard density 1ml = 1g
            "l", "liter", "liters" -> quantity * 1000.0
            "cup", "cups" -> quantity * 240.0 // Standard US cup ~ 240g
            "tbsp", "tablespoon", "tablespoons" -> quantity * 15.0 // Standard tbsp ~ 15g
            "tsp", "teaspoon", "teaspoons" -> quantity * 5.0 // Standard tsp ~ 5g
            "oz", "ounce", "ounces" -> quantity * 28.3495
            "lb", "lbs", "pound", "pounds" -> quantity * 453.592
            "slice", "slices" -> quantity * getSliceWeight(foodName)
            "bowl", "bowls" -> quantity * 250.0 // Standard bowl ~ 250g
            "piece", "pieces", "pc", "pcs", "serving", "servings", "portion", "portions", "head", "clove" -> {
                quantity * getItemPieceWeight(foodName)
            }
            else -> quantity // Fallback to grams
        }
    }

    private fun getSliceWeight(foodName: String?): Double {
        if (foodName.isNullOrEmpty()) return 30.0
        val lower = foodName.lowercase(Locale.ROOT)
        return when {
            lower.contains("bread") || lower.contains("toast") -> 30.0
            lower.contains("cheese") -> 20.0
            lower.contains("pizza") -> 100.0
            lower.contains("cake") -> 80.0
            else -> 30.0
        }
    }

    private fun getItemPieceWeight(foodName: String?): Double {
        if (foodName.isNullOrEmpty()) return 100.0
        val lower = foodName.lowercase(Locale.ROOT)

        return when {
            lower.contains("egg") -> 50.0 // 1 whole egg ~ 50g
            lower.contains("apple") -> 120.0 // 1 medium apple ~ 120g
            lower.contains("banana") -> 120.0 // 1 medium banana ~ 120g
            lower.contains("orange") -> 130.0
            lower.contains("chapati") || lower.contains("roti") -> 35.0 // 1 chapati ~ 35g
            lower.contains("naan") -> 90.0
            lower.contains("paneer") -> 100.0
            lower.contains("curd") || lower.contains("dahi") -> 100.0
            lower.contains("clove") -> 5.0
            lower.contains("head") -> 300.0
            lower.contains("chicken") -> 150.0 // 1 chicken piece ~ 150g
            lower.contains("potato") -> 150.0
            else -> 100.0 // Default medium piece ~ 100g
        }
    }
}
