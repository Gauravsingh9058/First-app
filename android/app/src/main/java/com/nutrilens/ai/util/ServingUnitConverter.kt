package com.nutrilens.ai.util

/**
 * Utility to convert various user serving units (grams, kg, ml, cups, tbsp, tsp, pieces, slices, bowls)
 * into standardized net weight in grams for precise USDA per-100g nutrient scaling.
 */
object ServingUnitConverter {

    /**
     * Converts quantity + unit into equivalent weight in grams.
     * Optional customUnitGramWeight specifies item-specific weight if known (e.g. 1 slice of bread = 30g).
     */
    fun toGrams(
        quantity: Double,
        unit: String,
        customUnitGramWeight: Double? = null
    ): Double {
        if (quantity <= 0) return 0.0

        val normalizedUnit = unit.trim().lowercase()

        // If custom weight is provided for piece/slice/bowl, prioritize it
        if (customUnitGramWeight != null && customUnitGramWeight > 0) {
            return quantity * customUnitGramWeight
        }

        return when (normalizedUnit) {
            "g", "gram", "grams" -> quantity
            "kg", "kilogram", "kilograms" -> quantity * 1000.0
            "ml", "milliliter", "milliliters" -> quantity * 1.0 // Standard density 1g = 1ml
            "cup", "cups" -> quantity * 240.0 // Standard US culinary cup ~ 240g
            "tbsp", "tablespoon", "tablespoons" -> quantity * 15.0 // Standard tbsp ~ 15g
            "tsp", "teaspoon", "teaspoons" -> quantity * 5.0 // Standard tsp ~ 5g
            "piece", "pieces", "pc", "pcs" -> quantity * 100.0 // Default medium piece ~ 100g
            "slice", "slices" -> quantity * 30.0 // Default medium slice ~ 30g
            "bowl", "bowls" -> quantity * 250.0 // Default standard bowl ~ 250g
            "oz", "ounce", "ounces" -> quantity * 28.3495 // 1 oz = 28.35g
            "lb", "lbs", "pound", "pounds" -> quantity * 453.592 // 1 lb = 453.6g
            else -> quantity // Fallback assumption: grams
        }
    }
}
