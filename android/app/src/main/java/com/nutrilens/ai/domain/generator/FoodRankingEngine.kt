package com.nutrilens.ai.domain.generator

import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.MealType
import com.nutrilens.ai.data.model.UserProfile

/**
 * Intelligent Food Ranking Engine.
 * Evaluates candidate foods from fooddata.db based on nutrient density,
 * meal type appropriateness, macro ratios, and user goal alignment.
 */
object FoodRankingEngine {

    data class RankedFood(
        val food: Food,
        val score: Double,
        val mealTypeSuitability: Double,
        val nutrientDensityScore: Double
    )

    private val BREAKFAST_KEYWORDS = listOf(
        "egg", "oat", "yogurt", "pancake", "waffle", "toast", "cereal", "berry",
        "banana", "apple", "milk", "cheese", "avocado", "smoothie", "bagel", "bacon",
        "sausage", "muffin", "chia", "granola", "omelet", "nut butter", "peanut butter"
    )

    private val LUNCH_DINNER_KEYWORDS = listOf(
        "chicken", "turkey", "beef", "steak", "salmon", "tuna", "fish", "tofu",
        "rice", "quinoa", "pasta", "broccoli", "spinach", "salad", "asparagus",
        "beans", "lentils", "sweet potato", "potato", "carrot", "pepper", "olive oil",
        "shrimp", "cod", "curry", "soup", "stew", "wrap", "burger", "pork"
    )

    private val SNACK_KEYWORDS = listOf(
        "almond", "walnut", "cashew", "nut", "apple", "banana", "berry", "grape",
        "yogurt", "protein", "hummus", "carrot", "celery", "dark chocolate", "rice cake",
        "popcorn", "edamame", "cottage cheese", "trail mix", "raisin", "date"
    )

    /**
     * Ranks a list of candidate foods for a specific meal type and profile.
     */
    fun rankFoods(
        candidates: List<Food>,
        mealType: MealType,
        profile: UserProfile
    ): List<RankedFood> {
        return candidates.map { food ->
            val mealSuitability = calculateMealSuitability(food, mealType)
            val nutrientDensity = calculateNutrientDensity(food, profile)
            val macroAlignment = calculateMacroAlignment(food, profile)

            val totalScore = (mealSuitability * 0.4) + (nutrientDensity * 0.4) + (macroAlignment * 0.2)

            RankedFood(
                food = food,
                score = totalScore,
                mealTypeSuitability = mealSuitability,
                nutrientDensityScore = nutrientDensity
            )
        }.sortedByDescending { it.score }
    }

    /**
     * Scores how natural a food is for a given meal slot (0 - 100).
     */
    private fun calculateMealSuitability(food: Food, mealType: MealType): Double {
        val nameLower = food.name.lowercase()
        val catLower = (food.category ?: "").lowercase()

        val targetKeywords = when (mealType) {
            MealType.BREAKFAST -> BREAKFAST_KEYWORDS
            MealType.LUNCH, MealType.DINNER -> LUNCH_DINNER_KEYWORDS
            MealType.SNACK -> SNACK_KEYWORDS
        }

        var matchCount = 0
        for (kw in targetKeywords) {
            if (nameLower.contains(kw) || catLower.contains(kw)) {
                matchCount++
            }
        }

        return when {
            matchCount >= 2 -> 100.0
            matchCount == 1 -> 80.0
            else -> 40.0
        }
    }

    /**
     * Calculates general nutrient density score per calorie.
     */
    private fun calculateNutrientDensity(food: Food, profile: UserProfile): Double {
        if (food.calories <= 0) return 30.0

        // Protein density (g protein per 100 kcal)
        val proteinPer100kcal = (food.proteinG / food.calories) * 100.0
        val proteinScore = minOf(100.0, proteinPer100kcal * 10.0)

        // Fiber density
        val fiberPer100kcal = (food.fiberG / food.calories) * 100.0
        val fiberScore = minOf(100.0, fiberPer100kcal * 25.0)

        // Low sugar bonus
        val sugarPenalty = if (food.sugarG > 15.0) (food.sugarG - 15.0) * 3.0 else 0.0

        // Micronutrient bonus (Potassium, Calcium, Iron, Vitamins)
        var microBonus = 0.0
        if (food.potassiumMg > 200) microBonus += 10
        if (food.calciumMg > 100) microBonus += 10
        if (food.ironMg > 2) microBonus += 10
        if (food.vitAUg > 100 || food.vitDUg > 1) microBonus += 10

        val score = (proteinScore * 0.4) + (fiberScore * 0.3) + microBonus - sugarPenalty
        return score.coerceIn(10.0, 100.0)
    }

    /**
     * Evaluates macro alignment with user goal.
     */
    private fun calculateMacroAlignment(food: Food, profile: UserProfile): Double {
        if (food.calories <= 0) return 50.0

        val proteinPct = (food.proteinG * 4.0) / food.calories
        val carbPct = (food.carbsG * 4.0) / food.calories
        val fatPct = (food.fatG * 9.0) / food.calories

        return when (profile.dietPreference) {
            com.nutrilens.ai.data.model.DietPreference.HIGH_PROTEIN -> if (proteinPct > 0.30) 100.0 else 50.0
            com.nutrilens.ai.data.model.DietPreference.KETO -> if (fatPct > 0.60 && carbPct < 0.10) 100.0 else 30.0
            com.nutrilens.ai.data.model.DietPreference.LOW_CARB -> if (carbPct < 0.25) 100.0 else 40.0
            com.nutrilens.ai.data.model.DietPreference.DIABETIC -> if (food.sugarG < 5.0 && food.fiberG > 2.0) 100.0 else 50.0
            else -> 75.0
        }
    }
}
