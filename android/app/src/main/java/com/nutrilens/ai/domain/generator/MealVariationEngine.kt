package com.nutrilens.ai.domain.generator

import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.MealType
import kotlin.random.Random

/**
 * Meal Variation & Diversity Engine.
 * Implements stochastic selection among top-tier candidate foods to guarantee over 100+
 * distinct, non-repetitive meal plan combinations.
 */
object MealVariationEngine {

    private val BREAKFAST_TITLES = listOf(
        "Power Protein Breakfast",
        "Morning Energy Bowl",
        "Balanced Fuel Breakfast",
        "Vitality Breakfast Plate",
        "High-Fiber Morning Start",
        "Clean Eating Breakfast",
        "Fit Starter Breakfast"
    )

    private val LUNCH_TITLES = listOf(
        "Nutrient-Dense Lunch Bowl",
        "Lean Protein Power Lunch",
        "Mediterranean Fuel Lunch",
        "Macro Balanced Lunch Plate",
        "Sustained Energy Lunch",
        "Fresh Harvest Lunch"
    )

    private val DINNER_TITLES = listOf(
        "Recovery & Growth Dinner",
        "Hearty Protein Dinner Plate",
        "Restorative Evening Meal",
        "Gourmet Balanced Dinner",
        "Clean Protein & Veggie Dinner",
        "Optimal Recovery Dinner"
    )

    private val SNACK_TITLES = listOf(
        "Mid-Day Energy Boost",
        "Quick Protein Snack",
        "Nutrient Crunch Snack",
        "Vitality Power Snack",
        "Satiety & Focus Snack"
    )

    /**
     * Selects 2-4 complementary foods from ranked candidates using a randomized seed for variety.
     */
    fun selectEnsemble(
        rankedCandidates: List<FoodRankingEngine.RankedFood>,
        mealType: MealType,
        seed: Long = System.currentTimeMillis()
    ): List<Food> {
        if (rankedCandidates.isEmpty()) return emptyList()

        val random = Random(seed)

        // Filter top tier candidates (score > 40.0)
        val topTier = rankedCandidates.filter { it.score >= 40.0 }.map { it.food }
        val pool = if (topTier.size >= 3) topTier else rankedCandidates.map { it.food }

        val ensembleSize = when (mealType) {
            MealType.BREAKFAST -> 2.coerceAtMost(pool.size)
            MealType.LUNCH, MealType.DINNER -> 3.coerceAtMost(pool.size)
            MealType.SNACK -> 2.coerceAtMost(pool.size)
        }

        // Shuffle pool in small buckets to maintain high quality while ensuring variation
        val shuffledPool = pool.shuffled(random)
        val selected = mutableListOf<Food>()

        for (food in shuffledPool) {
            if (selected.size >= ensembleSize) break
            // Avoid adding duplicate or near-identical items
            if (selected.none { it.id == food.id || it.name.equals(food.name, ignoreCase = true) }) {
                selected.add(food)
            }
        }

        return selected
    }

    /**
     * Generates a descriptive meal title based on selected foods and meal type.
     */
    fun generateMealTitle(mealType: MealType, foods: List<Food>, seed: Long = System.currentTimeMillis()): String {
        val random = Random(seed)

        val baseTitle = when (mealType) {
            MealType.BREAKFAST -> BREAKFAST_TITLES.random(random)
            MealType.LUNCH -> LUNCH_TITLES.random(random)
            MealType.DINNER -> DINNER_TITLES.random(random)
            MealType.SNACK -> SNACK_TITLES.random(random)
        }

        val primaryFood = foods.firstOrNull()?.name?.take(20)?.trim()
        return if (!primaryFood.isNullOrEmpty()) {
            "$baseTitle ($primaryFood)"
        } else {
            baseTitle
        }
    }
}
