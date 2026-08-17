package com.nutrilens.ai.domain.generator

import com.nutrilens.ai.data.model.MealType
import com.nutrilens.ai.data.model.NutritionTargets
import com.nutrilens.ai.data.model.UserProfile

/**
 * Meal Structure & Macro Split Allocator.
 * Distributes daily energy and macronutrient targets across requested meal slots
 * (Breakfast, Lunch, Dinner, Snacks) with optimal caloric timing.
 */
object MealPlanner {

    data class MealSlotTarget(
        val mealType: MealType,
        val slotName: String,
        val targetMacros: NutritionOptimizer.TargetMealMacros
    )

    /**
     * Generates calorie & macro targets per meal slot for the user profile.
     */
    fun createMealSlotTargets(
        profile: UserProfile,
        targets: NutritionTargets
    ): List<MealSlotTarget> {
        val totalCal = targets.targetCalories
        val totalProtein = targets.targetProteinG
        val totalFat = targets.targetFatG
        val totalCarbs = targets.targetCarbsG

        val slots = mutableListOf<MealSlotTarget>()

        when (profile.mealCount.coerceIn(3, 5)) {
            3 -> {
                // Breakfast (25%), Lunch (35%), Dinner (40%)
                slots.add(buildSlot(MealType.BREAKFAST, "Breakfast", totalCal * 0.25, totalProtein * 0.25, totalFat * 0.25, totalCarbs * 0.25))
                slots.add(buildSlot(MealType.LUNCH, "Lunch", totalCal * 0.35, totalProtein * 0.35, totalFat * 0.35, totalCarbs * 0.35))
                slots.add(buildSlot(MealType.DINNER, "Dinner", totalCal * 0.40, totalProtein * 0.40, totalFat * 0.40, totalCarbs * 0.40))
            }
            4 -> {
                // Breakfast (25%), Lunch (35%), Dinner (30%), Snack (10%)
                slots.add(buildSlot(MealType.BREAKFAST, "Breakfast", totalCal * 0.25, totalProtein * 0.25, totalFat * 0.25, totalCarbs * 0.25))
                slots.add(buildSlot(MealType.LUNCH, "Lunch", totalCal * 0.35, totalProtein * 0.35, totalFat * 0.35, totalCarbs * 0.35))
                slots.add(buildSlot(MealType.DINNER, "Dinner", totalCal * 0.30, totalProtein * 0.30, totalFat * 0.30, totalCarbs * 0.30))
                slots.add(buildSlot(MealType.SNACK, "Snack", totalCal * 0.10, totalProtein * 0.10, totalFat * 0.10, totalCarbs * 0.10))
            }
            5 -> {
                // Breakfast (20%), Morning Snack (10%), Lunch (30%), Afternoon Snack (10%), Dinner (30%)
                slots.add(buildSlot(MealType.BREAKFAST, "Breakfast", totalCal * 0.20, totalProtein * 0.20, totalFat * 0.20, totalCarbs * 0.20))
                slots.add(buildSlot(MealType.SNACK, "Morning Snack", totalCal * 0.10, totalProtein * 0.10, totalFat * 0.10, totalCarbs * 0.10))
                slots.add(buildSlot(MealType.LUNCH, "Lunch", totalCal * 0.30, totalProtein * 0.30, totalFat * 0.30, totalCarbs * 0.30))
                slots.add(buildSlot(MealType.SNACK, "Afternoon Snack", totalCal * 0.10, totalProtein * 0.10, totalFat * 0.10, totalCarbs * 0.10))
                slots.add(buildSlot(MealType.DINNER, "Dinner", totalCal * 0.30, totalProtein * 0.30, totalFat * 0.30, totalCarbs * 0.30))
            }
        }

        return slots
    }

    private fun buildSlot(
        mealType: MealType,
        slotName: String,
        cal: Double,
        protein: Double,
        fat: Double,
        carbs: Double
    ): MealSlotTarget {
        return MealSlotTarget(
            mealType = mealType,
            slotName = slotName,
            targetMacros = NutritionOptimizer.TargetMealMacros(
                targetCalories = cal,
                targetProteinG = protein,
                targetFatG = fat,
                targetCarbsG = carbs
            )
        )
    }
}
