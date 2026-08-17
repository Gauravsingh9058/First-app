package com.nutrilens.ai.domain.calculator

import androidx.annotation.Keep
import com.nutrilens.ai.data.model.FullNutrients
import kotlin.math.min
import kotlin.math.roundToInt

@Keep
data class MacroProgress(
    val currentCalories: Double,
    val targetCalories: Double,
    val calorieProgressPct: Int,

    val currentProteinG: Double,
    val targetProteinG: Double,
    val proteinProgressPct: Int,

    val currentFatG: Double,
    val targetFatG: Double,
    val fatProgressPct: Int,

    val currentCarbsG: Double,
    val targetCarbsG: Double,
    val carbsProgressPct: Int,

    val currentFiberG: Double,
    val targetFiberG: Double,
    val fiberProgressPct: Int,

    val currentSugarG: Double,
    val maxSugarG: Double,

    val netCarbsG: Double
)

/**
 * Macro Progress & Goal Tracker.
 */
object MacroTracker {

    fun computeMacroProgress(
        current: FullNutrients,
        targetCalories: Double = 2000.0,
        targetProteinG: Double = 150.0,
        targetFatG: Double = 65.0,
        targetCarbsG: Double = 225.0,
        targetFiberG: Double = 28.0,
        maxSugarG: Double = 35.0
    ): MacroProgress {
        val netCarbs = maxOf(0.0, current.carbsG - current.fiberG)

        return MacroProgress(
            currentCalories = roundToOneDecimal(current.calories),
            targetCalories = targetCalories,
            calorieProgressPct = calcPct(current.calories, targetCalories),

            currentProteinG = roundToOneDecimal(current.proteinG),
            targetProteinG = targetProteinG,
            proteinProgressPct = calcPct(current.proteinG, targetProteinG),

            currentFatG = roundToOneDecimal(current.fatG),
            targetFatG = targetFatG,
            fatProgressPct = calcPct(current.fatG, targetFatG),

            currentCarbsG = roundToOneDecimal(current.carbsG),
            targetCarbsG = targetCarbsG,
            carbsProgressPct = calcPct(current.carbsG, targetCarbsG),

            currentFiberG = roundToOneDecimal(current.fiberG),
            targetFiberG = targetFiberG,
            fiberProgressPct = calcPct(current.fiberG, targetFiberG),

            currentSugarG = roundToOneDecimal(current.sugarG),
            maxSugarG = maxSugarG,

            netCarbsG = roundToOneDecimal(netCarbs)
        )
    }

    private fun calcPct(current: Double, target: Double): Int {
        if (target <= 0.0) return 0
        return min(100, ((current / target) * 100.0).roundToInt())
    }

    private fun roundToOneDecimal(value: Double): Double {
        return (value * 10.0).roundToInt() / 10.0
    }
}
