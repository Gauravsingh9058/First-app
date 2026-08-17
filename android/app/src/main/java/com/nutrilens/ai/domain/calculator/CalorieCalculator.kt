package com.nutrilens.ai.domain.calculator

import com.nutrilens.ai.data.model.ActivityLevel
import com.nutrilens.ai.data.model.Gender
import com.nutrilens.ai.data.model.Goal
import kotlin.math.roundToInt

/**
 * Precision Calorie & Energy Expenditure Calculator.
 * Implements Mifflin-St Jeor formula for BMR, TDEE, BMI, Goal-based Calorie Deficits/Surpluses,
 * and daily hydration targets.
 */
object CalorieCalculator {

    /**
     * Calculates Body Mass Index (BMI).
     */
    fun calculateBmi(weightKg: Double, heightCm: Double): Double {
        if (heightCm <= 0.0 || weightKg <= 0.0) return 0.0
        val heightM = heightCm / 100.0
        val bmi = weightKg / (heightM * heightM)
        return (bmi * 10.0).roundToInt() / 10.0
    }

    /**
     * Returns clinical WHO BMI classification.
     */
    fun getBmiCategory(bmi: Double): String {
        return when {
            bmi < 18.5 -> "Underweight"
            bmi < 25.0 -> "Normal Weight"
            bmi < 30.0 -> "Overweight"
            else -> "Obese"
        }
    }

    /**
     * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation.
     * Male: 10W + 6.25H - 5A + 5
     * Female: 10W + 6.25H - 5A - 161
     */
    fun calculateBmr(gender: Gender, weightKg: Double, heightCm: Double, age: Int): Double {
        if (weightKg <= 0.0 || heightCm <= 0.0 || age <= 0) return 1800.0
        val base = (10.0 * weightKg) + (6.25 * heightCm) - (5.0 * age)
        val bmr = when (gender) {
            Gender.MALE -> base + 5.0
            Gender.FEMALE -> base - 161.0
            Gender.OTHER -> base - 78.0 // Midpoint average
        }
        return (bmr * 10.0).roundToInt() / 10.0
    }

    /**
     * Calculates Total Daily Energy Expenditure (TDEE).
     */
    fun calculateTdee(bmr: Double, activityLevel: ActivityLevel): Double {
        val tdee = bmr * activityLevel.multiplier
        return (tdee * 10.0).roundToInt() / 10.0
    }

    /**
     * Calculates target daily calories based on user goal.
     * Weight Loss: ~20% deficit (capped at 500-750 kcal deficit, min 1200 kcal female / 1500 kcal male).
     * Weight Gain / Muscle Gain: ~15% surplus (+300-500 kcal).
     * Maintenance: TDEE.
     */
    fun calculateTargetCalories(tdee: Double, goal: Goal, gender: Gender): Double {
        val calculated = when (goal) {
            Goal.WEIGHT_LOSS -> tdee - 500.0
            Goal.WEIGHT_GAIN, Goal.MUSCLE_GAIN -> tdee + 400.0
            Goal.MAINTENANCE -> tdee
        }

        // Apply health safety boundaries
        val minCalories = if (gender == Gender.FEMALE) 1200.0 else 1500.0
        val safeCalories = maxOf(minCalories, calculated)
        return (safeCalories * 10.0).roundToInt() / 10.0
    }

    /**
     * Calculates recommended daily hydration in Liters based on body mass and activity level.
     * Base: ~35ml / kg + Activity bonus.
     */
    fun calculateWaterIntakeLiters(weightKg: Double, activityLevel: ActivityLevel): Double {
        val baseLiters = (weightKg * 0.035)
        val activityBonus = when (activityLevel) {
            ActivityLevel.SEDENTARY -> 0.0
            ActivityLevel.LIGHTLY_ACTIVE -> 0.3
            ActivityLevel.MODERATELY_ACTIVE -> 0.5
            ActivityLevel.VERY_ACTIVE -> 0.8
            ActivityLevel.EXTRA_ACTIVE -> 1.0
        }
        val total = baseLiters + activityBonus
        return (total * 10.0).roundToInt() / 10.0
    }
}
