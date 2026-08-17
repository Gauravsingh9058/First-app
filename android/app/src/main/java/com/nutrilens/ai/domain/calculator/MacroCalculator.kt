package com.nutrilens.ai.domain.calculator

import com.nutrilens.ai.data.model.DietPreference
import com.nutrilens.ai.data.model.Goal
import com.nutrilens.ai.data.model.NutritionTargets
import com.nutrilens.ai.data.model.UserProfile
import kotlin.math.roundToInt

/**
 * Macro & Micronutrient Target Calculation Engine.
 * Calculates optimal distribution of Protein, Fat, Carbohydrates, and Fiber
 * tailored to user goals, diet preferences, and medical conditions.
 */
object MacroCalculator {

    data class MacroBreakdown(
        val proteinG: Double,
        val fatG: Double,
        val carbsG: Double,
        val fiberG: Double
    )

    /**
     * Computes complete NutritionTargets for a UserProfile.
     */
    fun computeTargets(profile: UserProfile): NutritionTargets {
        val bmi = CalorieCalculator.calculateBmi(profile.weightKg, profile.heightCm)
        val bmiCategory = CalorieCalculator.getBmiCategory(bmi)
        val bmr = CalorieCalculator.calculateBmr(profile.gender, profile.weightKg, profile.heightCm, profile.age)
        val tdee = CalorieCalculator.calculateTdee(bmr, profile.activityLevel)

        val targetCalories = profile.targetCalories
            ?: CalorieCalculator.calculateTargetCalories(tdee, profile.goal, profile.gender)

        val macros = calculateMacros(
            targetCalories = targetCalories,
            weightKg = profile.weightKg,
            goal = profile.goal,
            dietPreference = profile.dietPreference,
            medicalConditions = profile.medicalConditions,
            customProtein = profile.targetProteinG,
            customFat = profile.targetFatG,
            customCarbs = profile.targetCarbsG
        )

        val waterLiters = CalorieCalculator.calculateWaterIntakeLiters(profile.weightKg, profile.activityLevel)

        return NutritionTargets(
            bmi = bmi,
            bmiCategory = bmiCategory,
            bmr = bmr,
            tdee = tdee,
            targetCalories = targetCalories,
            targetProteinG = macros.proteinG,
            targetFatG = macros.fatG,
            targetCarbsG = macros.carbsG,
            targetFiberG = macros.fiberG,
            waterIntakeLiters = waterLiters
        )
    }

    /**
     * Calculates Macronutrient distributions in grams (4 kcal/g protein, 9 kcal/g fat, 4 kcal/g carbs).
     */
    fun calculateMacros(
        targetCalories: Double,
        weightKg: Double,
        goal: Goal,
        dietPreference: DietPreference,
        medicalConditions: List<String> = emptyList(),
        customProtein: Double? = null,
        customFat: Double? = null,
        customCarbs: Double? = null
    ): MacroBreakdown {
        // Fiber target: 14g per 1000 kcal, minimum 28g
        val fiberG = roundToOneDecimal(maxOf(28.0, (targetCalories / 1000.0) * 14.0))

        // If custom macros are explicitly supplied, use them
        if (customProtein != null && customFat != null && customCarbs != null) {
            return MacroBreakdown(
                proteinG = roundToOneDecimal(customProtein),
                fatG = roundToOneDecimal(customFat),
                carbsG = roundToOneDecimal(customCarbs),
                fiberG = fiberG
            )
        }

        val isDiabetic = dietPreference == DietPreference.DIABETIC ||
                medicalConditions.any { it.contains("diabet", ignoreCase = true) }

        // Determine macro percentages (% of total calories) based on diet & goal
        val (proteinPct, fatPct, carbPct) = when {
            dietPreference == DietPreference.KETO -> Triple(0.25, 0.70, 0.05)
            dietPreference == DietPreference.LOW_CARB -> Triple(0.35, 0.45, 0.20)
            dietPreference == DietPreference.HIGH_PROTEIN || goal == Goal.MUSCLE_GAIN -> Triple(0.35, 0.25, 0.40)
            isDiabetic -> Triple(0.30, 0.35, 0.35)
            dietPreference == DietPreference.PALEO -> Triple(0.30, 0.40, 0.30)
            else -> when (goal) {
                Goal.WEIGHT_LOSS -> Triple(0.30, 0.30, 0.40)
                Goal.WEIGHT_GAIN -> Triple(0.25, 0.25, 0.50)
                Goal.MAINTENANCE, Goal.MUSCLE_GAIN -> Triple(0.25, 0.30, 0.45)
            }
        }

        var proteinG = customProtein ?: ((targetCalories * proteinPct) / 4.0)
        var fatG = customFat ?: ((targetCalories * fatPct) / 9.0)
        var carbsG = customCarbs ?: ((targetCalories * carbPct) / 4.0)

        // Ensure minimum protein intake based on body weight (1.6g - 2.2g per kg for muscle loss prevention)
        val minProteinG = when (goal) {
            Goal.WEIGHT_LOSS, Goal.MUSCLE_GAIN -> weightKg * 1.8
            else -> weightKg * 1.2
        }
        if (proteinG < minProteinG && customProtein == null) {
            proteinG = minProteinG
            // Recalculate remaining calories for fat and carbs
            val remainingCal = maxOf(0.0, targetCalories - (proteinG * 4.0))
            fatG = (remainingCal * (fatPct / (fatPct + carbPct))) / 9.0
            carbsG = (remainingCal * (carbPct / (fatPct + carbPct))) / 4.0
        }

        return MacroBreakdown(
            proteinG = roundToOneDecimal(proteinG),
            fatG = roundToOneDecimal(fatG),
            carbsG = roundToOneDecimal(carbsG),
            fiberG = fiberG
        )
    }

    private fun roundToOneDecimal(value: Double): Double {
        return (value * 10.0).roundToInt() / 10.0
    }
}
