package com.nutrilens.ai.domain.calculator

import androidx.annotation.Keep
import com.nutrilens.ai.data.model.FullNutrients
import kotlin.math.min
import kotlin.math.roundToInt

@Keep
data class NutrientProgressItem(
    val name: String,
    val currentValue: Double,
    val targetValue: Double,
    val unit: String,
    val progressPct: Int
)

@Keep
data class MicronutrientSummary(
    val vitamins: List<NutrientProgressItem>,
    val minerals: List<NutrientProgressItem>
)

/**
 * Micronutrient Progress & Recommended Daily Allowance (RDA) Tracker.
 */
object MicronutrientTracker {

    fun computeMicronutrientProgress(
        current: FullNutrients
    ): MicronutrientSummary {
        val vitamins = listOf(
            NutrientProgressItem("Vitamin A", roundToOneDecimal(current.vitAUg), 900.0, "µg", calcPct(current.vitAUg, 900.0)),
            NutrientProgressItem("Vitamin C", roundToOneDecimal(current.vitCMg), 90.0, "mg", calcPct(current.vitCMg, 90.0)),
            NutrientProgressItem("Vitamin D", roundToOneDecimal(current.vitDUg), 20.0, "µg", calcPct(current.vitDUg, 20.0)),
            NutrientProgressItem("Vitamin E", roundToOneDecimal(current.vitEMg), 15.0, "mg", calcPct(current.vitEMg, 15.0)),
            NutrientProgressItem("Vitamin K", roundToOneDecimal(current.vitKUg), 120.0, "µg", calcPct(current.vitKUg, 120.0)),
            NutrientProgressItem("Vitamin B1 (Thiamin)", roundToOneDecimal(current.vitB1Mg), 1.2, "mg", calcPct(current.vitB1Mg, 1.2)),
            NutrientProgressItem("Vitamin B2 (Riboflavin)", roundToOneDecimal(current.vitB2Mg), 1.3, "mg", calcPct(current.vitB2Mg, 1.3)),
            NutrientProgressItem("Vitamin B3 (Niacin)", roundToOneDecimal(current.vitB3Mg), 16.0, "mg", calcPct(current.vitB3Mg, 16.0)),
            NutrientProgressItem("Vitamin B6", roundToOneDecimal(current.vitB6Mg), 1.7, "mg", calcPct(current.vitB6Mg, 1.7)),
            NutrientProgressItem("Vitamin B9 (Folate)", roundToOneDecimal(current.vitB9Ug), 400.0, "µg", calcPct(current.vitB9Ug, 400.0)),
            NutrientProgressItem("Vitamin B12", roundToOneDecimal(current.vitB12Ug), 2.4, "µg", calcPct(current.vitB12Ug, 2.4))
        )

        val minerals = listOf(
            NutrientProgressItem("Calcium", roundToOneDecimal(current.calciumMg), 1000.0, "mg", calcPct(current.calciumMg, 1000.0)),
            NutrientProgressItem("Iron", roundToOneDecimal(current.ironMg), 18.0, "mg", calcPct(current.ironMg, 18.0)),
            NutrientProgressItem("Magnesium", roundToOneDecimal(current.magnesiumMg), 420.0, "mg", calcPct(current.magnesiumMg, 420.0)),
            NutrientProgressItem("Potassium", roundToOneDecimal(current.potassiumMg), 3400.0, "mg", calcPct(current.potassiumMg, 3400.0)),
            NutrientProgressItem("Sodium", roundToOneDecimal(current.sodiumMg), 2300.0, "mg", calcPct(current.sodiumMg, 2300.0)),
            NutrientProgressItem("Zinc", roundToOneDecimal(current.zincMg), 11.0, "mg", calcPct(current.zincMg, 11.0)),
            NutrientProgressItem("Phosphorus", roundToOneDecimal(current.phosphorusMg), 700.0, "mg", calcPct(current.phosphorusMg, 700.0)),
            NutrientProgressItem("Copper", roundToOneDecimal(current.copperMg), 0.9, "mg", calcPct(current.copperMg, 0.9)),
            NutrientProgressItem("Manganese", roundToOneDecimal(current.manganeseMg), 2.3, "mg", calcPct(current.manganeseMg, 2.3)),
            NutrientProgressItem("Selenium", roundToOneDecimal(current.seleniumUg), 55.0, "µg", calcPct(current.seleniumUg, 55.0)),
            NutrientProgressItem("Choline", roundToOneDecimal(current.cholineMg), 550.0, "mg", calcPct(current.cholineMg, 550.0))
        )

        return MicronutrientSummary(vitamins = vitamins, minerals = minerals)
    }

    private fun calcPct(current: Double, target: Double): Int {
        if (target <= 0.0) return 0
        return min(100, ((current / target) * 100.0).roundToInt())
    }

    private fun roundToOneDecimal(value: Double): Double {
        return (value * 10.0).roundToInt() / 10.0
    }
}
