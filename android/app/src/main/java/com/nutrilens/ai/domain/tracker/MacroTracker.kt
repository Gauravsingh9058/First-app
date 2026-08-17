package com.nutrilens.ai.domain.tracker

import androidx.annotation.Keep
import com.nutrilens.ai.data.model.FullNutrients
import kotlin.math.roundToInt

@Keep
data class MacroProgressItem(
    val label: String,
    val consumedGrams: Double,
    val targetGrams: Double,
    val percentCompleted: Double,
    val caloriesContribution: Double,
    val percentageOfTotalCalories: Double
)

@Keep
data class DailyMacroSummary(
    val totalCalories: Double,
    val targetCalories: Double,
    val caloriesPercent: Double,
    val protein: MacroProgressItem,
    val fat: MacroProgressItem,
    val carbs: MacroProgressItem,
    val fiberGrams: Double,
    val targetFiberGrams: Double,
    val sugarGrams: Double,
    val maxSugarGrams: Double,
    val netCarbsGrams: Double,
    val waterGrams: Double,
    val alcoholGrams: Double,
    val caffeineMg: Double
)

/**
 * Macro Tracker Engine.
 * Evaluates total caloric distribution and macronutrient target percentages.
 */
object MacroTracker {

    /**
     * Calculates macronutrient ratios and progress targets.
     */
    fun calculateMacroProgress(
        nutrients: FullNutrients,
        targetCalories: Double = 2000.0,
        targetProteinG: Double = 150.0,
        targetFatG: Double = 65.0,
        targetCarbsG: Double = 225.0,
        targetFiberG: Double = 30.0,
        maxSugarG: Double = 35.0
    ): DailyMacroSummary {

        val totalCals = maxOf(0.0, nutrients.calories)
        val calPercent = if (targetCalories > 0.0) roundToOneDecimal((totalCals / targetCalories) * 100.0) else 0.0

        // Macro Calorie Contributions (4 kcal/g protein, 9 kcal/g fat, 4 kcal/g carb)
        val proteinCals = nutrients.proteinG * 4.0
        val fatCals = nutrients.fatG * 9.0
        val carbCals = nutrients.carbsG * 4.0

        val effectiveCals = maxOf(1.0, proteinCals + fatCals + carbCals)

        val proteinPct = roundToOneDecimal((proteinCals / effectiveCals) * 100.0)
        val fatPct = roundToOneDecimal((fatCals / effectiveCals) * 100.0)
        val carbPct = roundToOneDecimal((carbCals / effectiveCals) * 100.0)

        val proteinProgress = MacroProgressItem(
            label = "Protein",
            consumedGrams = roundToOneDecimal(nutrients.proteinG),
            targetGrams = targetProteinG,
            percentCompleted = if (targetProteinG > 0) roundToOneDecimal((nutrients.proteinG / targetProteinG) * 100.0) else 0.0,
            caloriesContribution = roundToOneDecimal(proteinCals),
            percentageOfTotalCalories = proteinPct
        )

        val fatProgress = MacroProgressItem(
            label = "Fat",
            consumedGrams = roundToOneDecimal(nutrients.fatG),
            targetGrams = targetFatG,
            percentCompleted = if (targetFatG > 0) roundToOneDecimal((nutrients.fatG / targetFatG) * 100.0) else 0.0,
            caloriesContribution = roundToOneDecimal(fatCals),
            percentageOfTotalCalories = fatPct
        )

        val carbProgress = MacroProgressItem(
            label = "Carbohydrates",
            consumedGrams = roundToOneDecimal(nutrients.carbsG),
            targetGrams = targetCarbsG,
            percentCompleted = if (targetCarbsG > 0) roundToOneDecimal((nutrients.carbsG / targetCarbsG) * 100.0) else 0.0,
            caloriesContribution = roundToOneDecimal(carbCals),
            percentageOfTotalCalories = carbPct
        )

        return DailyMacroSummary(
            totalCalories = roundToOneDecimal(totalCals),
            targetCalories = targetCalories,
            caloriesPercent = calPercent,
            protein = proteinProgress,
            fat = fatProgress,
            carbs = carbProgress,
            fiberGrams = roundToOneDecimal(nutrients.fiberG),
            targetFiberGrams = targetFiberG,
            sugarGrams = roundToOneDecimal(nutrients.sugarG),
            maxSugarGrams = maxSugarG,
            netCarbsGrams = roundToOneDecimal(nutrients.netCarbsG),
            waterGrams = roundToOneDecimal(nutrients.waterG),
            alcoholGrams = roundToOneDecimal(nutrients.alcoholG),
            caffeineMg = roundToOneDecimal(nutrients.caffeineMg)
        )
    }

    private fun roundToOneDecimal(value: Double): Double {
        return (value * 10.0).roundToInt() / 10.0
    }
}
