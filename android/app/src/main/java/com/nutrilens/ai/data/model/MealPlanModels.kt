package com.nutrilens.ai.data.model

import androidx.annotation.Keep
import java.util.UUID

@Keep
enum class Gender {
    MALE,
    FEMALE,
    OTHER
}

@Keep
enum class Goal {
    WEIGHT_LOSS,
    WEIGHT_GAIN,
    MAINTENANCE,
    MUSCLE_GAIN
}

@Keep
enum class ActivityLevel(val multiplier: Double) {
    SEDENTARY(1.2),
    LIGHTLY_ACTIVE(1.375),
    MODERATELY_ACTIVE(1.55),
    VERY_ACTIVE(1.725),
    EXTRA_ACTIVE(1.9)
}

@Keep
enum class DietPreference {
    STANDARD,
    VEGETARIAN,
    VEGAN,
    KETO,
    LOW_CARB,
    HIGH_PROTEIN,
    DIABETIC,
    PALEO,
    MEDITERRANEAN
}

@Keep
data class UserProfile(
    val age: Int = 30,
    val gender: Gender = Gender.MALE,
    val heightCm: Double = 175.0,
    val weightKg: Double = 70.0,
    val goal: Goal = Goal.MAINTENANCE,
    val activityLevel: ActivityLevel = ActivityLevel.MODERATELY_ACTIVE,
    val dietPreference: DietPreference = DietPreference.STANDARD,
    val foodAllergies: List<String> = emptyList(),
    val medicalConditions: List<String> = emptyList(),
    val targetCalories: Double? = null,
    val targetProteinG: Double? = null,
    val targetFatG: Double? = null,
    val targetCarbsG: Double? = null,
    val mealCount: Int = 3
)

@Keep
data class NutritionTargets(
    val bmi: Double,
    val bmiCategory: String,
    val bmr: Double,
    val tdee: Double,
    val targetCalories: Double,
    val targetProteinG: Double,
    val targetFatG: Double,
    val targetCarbsG: Double,
    val targetFiberG: Double,
    val waterIntakeLiters: Double
)

@Keep
data class GeneratedMealFood(
    val foodId: Long,
    val foodName: String,
    val category: String? = null,
    val weightGrams: Double,
    val servingUnit: String = "g",
    val quantity: Double = 1.0,
    val calories: Double,
    val proteinG: Double,
    val fatG: Double,
    val carbsG: Double,
    val fiberG: Double,
    val sugarG: Double,
    val nutrients: FullNutrients
)

@Keep
data class GeneratedMeal(
    val id: String = UUID.randomUUID().toString(),
    val mealType: MealType,
    val mealTitle: String,
    val foods: List<GeneratedMealFood>,
    val totalCalories: Double,
    val totalProteinG: Double,
    val totalFatG: Double,
    val totalCarbsG: Double,
    val totalFiberG: Double,
    val totalSugarG: Double,
    val totalNutrients: FullNutrients
)

@Keep
data class DailyMealPlan(
    val id: String = UUID.randomUUID().toString(),
    val timestamp: Long = System.currentTimeMillis(),
    val profile: UserProfile,
    val targets: NutritionTargets,
    val meals: List<GeneratedMeal>,
    val totalDailyCalories: Double,
    val totalDailyProteinG: Double,
    val totalDailyFatG: Double,
    val totalDailyCarbsG: Double,
    val totalDailyFiberG: Double,
    val totalDailySugarG: Double,
    val totalDailyNutrients: FullNutrients
)
