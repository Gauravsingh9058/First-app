package com.nutrilens.ai.domain.generator

import com.nutrilens.ai.data.model.DietPreference
import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.UserProfile

/**
 * Diet Rule Engine for strict filtering of food items based on:
 * - Dietary Preferences (Vegetarian, Vegan, Keto, Low Carb, High Protein, Diabetic, Paleo)
 * - Food Allergies (Peanut, Milk, Eggs, Soy, Gluten, Fish, Shellfish, Tree Nuts)
 * - Medical Conditions (Diabetes, Hypertension, Celiac, High Cholesterol)
 */
object DietRuleEngine {

    data class DietRuleQueryConstraints(
        val excludedKeywords: List<String>,
        val maxSugarGramsPer100g: Double? = null,
        val maxSodiumMgPer100g: Double? = null,
        val minProteinGramsPer100g: Double? = null,
        val maxCarbsGramsPer100g: Double? = null
    )

    // Forbidden keywords for Vegetarian
    private val MEAT_KEYWORDS = listOf(
        "beef", "pork", "chicken", "turkey", "lamb", "bacon", "sausage", "ham",
        "steak", "veal", "duck", "salmon", "tuna", "shrimp", "fish", "crab",
        "lobster", "anchovy", "sardine", "tilapia", "cod", "meat", "poultry", "seafood"
    )

    // Additional forbidden keywords for Vegan (Meat + Dairy + Eggs + Honey)
    private val ANIMAL_DERIVED_KEYWORDS = MEAT_KEYWORDS + listOf(
        "milk", "cheese", "butter", "yogurt", "cream", "whey", "casein", "egg",
        "honey", "gelatin", "lard", "ghee", "mayonnaise"
    )

    // High Carb Foods to exclude for Keto / Very Low Carb
    private val HIGH_CARB_KEYWORDS = listOf(
        "sugar", "candy", "cake", "cookie", "donut", "soda", "syrup", "white bread",
        "pasta", "potato", "rice", "corn", "sweet potato", "cereal"
    )

    /**
     * Checks if a food item is allowed for a given user profile.
     */
    fun isFoodAllowed(food: Food, profile: UserProfile): Boolean {
        val nameLower = food.name.lowercase()
        val categoryLower = (food.category ?: "").lowercase()

        // 1. Allergies Check
        for (allergy in profile.foodAllergies) {
            val allergyClean = allergy.trim().lowercase()
            if (allergyClean.isEmpty()) continue
            if (nameLower.contains(allergyClean) || categoryLower.contains(allergyClean)) {
                return false
            }
            // Allergen synonyms
            if (allergyClean == "gluten" && (nameLower.contains("wheat") || nameLower.contains("barley") || nameLower.contains("rye"))) {
                return false
            }
            if (allergyClean == "dairy" && (nameLower.contains("milk") || nameLower.contains("cheese") || nameLower.contains("butter") || nameLower.contains("cream"))) {
                return false
            }
        }

        // 2. Diet Preference Filter
        when (profile.dietPreference) {
            DietPreference.VEGETARIAN -> {
                if (MEAT_KEYWORDS.any { nameLower.contains(it) || categoryLower.contains(it) }) return false
            }
            DietPreference.VEGAN -> {
                if (ANIMAL_DERIVED_KEYWORDS.any { nameLower.contains(it) || categoryLower.contains(it) }) return false
            }
            DietPreference.KETO -> {
                if (food.carbsG > 10.0) return false
                if (HIGH_CARB_KEYWORDS.any { nameLower.contains(it) }) return false
            }
            DietPreference.LOW_CARB -> {
                if (food.carbsG > 25.0) return false
            }
            DietPreference.HIGH_PROTEIN -> {
                // Prefer higher protein foods
            }
            DietPreference.DIABETIC -> {
                if (food.sugarG > 12.0) return false
            }
            DietPreference.PALEO -> {
                if (nameLower.contains("processed") || nameLower.contains("sugar") || nameLower.contains("candy")) return false
            }
            DietPreference.STANDARD, DietPreference.MEDITERRANEAN -> {}
        }

        // 3. Medical Conditions Filter
        for (condition in profile.medicalConditions) {
            val condLower = condition.trim().lowercase()
            if (condLower.contains("diabet") && food.sugarG > 12.0) {
                return false
            }
            if (condLower.contains("hypertension") && food.sodiumMg > 600.0) {
                return false
            }
            if (condLower.contains("celiac") && (nameLower.contains("wheat") || nameLower.contains("barley") || nameLower.contains("rye") || nameLower.contains("gluten"))) {
                return false
            }
            if (condLower.contains("cholesterol") && food.fatG > 20.0 && (nameLower.contains("butter") || nameLower.contains("bacon") || nameLower.contains("lard"))) {
                return false
            }
        }

        return true
    }

    /**
     * Builds structured query constraints for SQL candidate retrieval.
     */
    fun getQueryConstraints(profile: UserProfile): DietRuleQueryConstraints {
        val excludedList = mutableListOf<String>()

        // Add allergies
        profile.foodAllergies.forEach { allergen ->
            val clean = allergen.trim().lowercase()
            if (clean.isNotEmpty()) excludedList.add(clean)
        }

        // Add diet preference keywords
        when (profile.dietPreference) {
            DietPreference.VEGETARIAN -> excludedList.addAll(MEAT_KEYWORDS)
            DietPreference.VEGAN -> excludedList.addAll(ANIMAL_DERIVED_KEYWORDS)
            DietPreference.KETO -> excludedList.addAll(HIGH_CARB_KEYWORDS)
            else -> {}
        }

        var maxSugar: Double? = null
        var maxSodium: Double? = null
        var minProtein: Double? = null
        var maxCarbs: Double? = null

        if (profile.dietPreference == DietPreference.DIABETIC ||
            profile.medicalConditions.any { it.contains("diabet", ignoreCase = true) }
        ) {
            maxSugar = 12.0
        }

        if (profile.medicalConditions.any { it.contains("hypertension", ignoreCase = true) }) {
            maxSodium = 600.0
        }

        if (profile.dietPreference == DietPreference.HIGH_PROTEIN) {
            minProtein = 5.0
        }

        if (profile.dietPreference == DietPreference.KETO) {
            maxCarbs = 10.0
        } else if (profile.dietPreference == DietPreference.LOW_CARB) {
            maxCarbs = 25.0
        }

        return DietRuleQueryConstraints(
            excludedKeywords = excludedList.distinct(),
            maxSugarGramsPer100g = maxSugar,
            maxSodiumMgPer100g = maxSodium,
            minProteinGramsPer100g = minProtein,
            maxCarbsGramsPer100g = maxCarbs
        )
    }
}
