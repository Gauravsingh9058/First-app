package com.nutrilens.ai.domain.tracker

import androidx.annotation.Keep
import com.nutrilens.ai.data.model.FullNutrients
import kotlin.math.roundToInt

@Keep
data class MicronutrientProgress(
    val name: String,
    val key: String,
    val consumedValue: Double,
    val rdaTargetValue: Double,
    val unit: String,
    val percentCompleted: Double,
    val category: MicronutrientCategory
)

@Keep
enum class MicronutrientCategory {
    VITAMIN,
    MINERAL
}

/**
 * Micronutrient Tracking Engine.
 * Evaluates daily intake of vitamins and minerals against standard adult RDA / DRI thresholds.
 */
object MicronutrientTracker {

    /**
     * Standard adult daily Recommended Dietary Allowances (RDA) / Dietary Reference Intakes (DRI)
     */
    val RDA_TARGETS = mapOf(
        // Vitamins
        "vitA" to Triple("Vitamin A", 900.0, "mcg"),
        "vitB1" to Triple("Vitamin B1 (Thiamin)", 1.2, "mg"),
        "vitB2" to Triple("Vitamin B2 (Riboflavin)", 1.3, "mg"),
        "vitB3" to Triple("Vitamin B3 (Niacin)", 16.0, "mg"),
        "vitB5" to Triple("Vitamin B5 (Pantothenic Acid)", 5.0, "mg"),
        "vitB6" to Triple("Vitamin B6", 1.7, "mg"),
        "vitB7" to Triple("Vitamin B7 (Biotin)", 30.0, "mcg"),
        "vitB9" to Triple("Vitamin B9 (Folate)", 400.0, "mcg"),
        "vitB12" to Triple("Vitamin B12", 2.4, "mcg"),
        "vitC" to Triple("Vitamin C", 90.0, "mg"),
        "vitD" to Triple("Vitamin D", 15.0, "mcg"),
        "vitE" to Triple("Vitamin E", 15.0, "mg"),
        "vitK" to Triple("Vitamin K", 120.0, "mcg"),

        // Minerals
        "calcium" to Triple("Calcium", 1000.0, "mg"),
        "iron" to Triple("Iron", 18.0, "mg"),
        "magnesium" to Triple("Magnesium", 420.0, "mg"),
        "potassium" to Triple("Potassium", 3400.0, "mg"),
        "phosphorus" to Triple("Phosphorus", 700.0, "mg"),
        "sodium" to Triple("Sodium", 2300.0, "mg"),
        "zinc" to Triple("Zinc", 11.0, "mg"),
        "copper" to Triple("Copper", 0.9, "mg"),
        "manganese" to Triple("Manganese", 2.3, "mg"),
        "selenium" to Triple("Selenium", 55.0, "mcg"),
        "choline" to Triple("Choline", 550.0, "mg"),
        "iodine" to Triple("Iodine", 150.0, "mcg")
    )

    /**
     * Calculates micronutrient progress against RDA targets for a given [FullNutrients] daily total.
     */
    fun calculateProgress(nutrients: FullNutrients): List<MicronutrientProgress> {
        val list = mutableListOf<MicronutrientProgress>()

        // Vitamins
        addProgress(list, "vitA", nutrients.vitAUg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitB1", nutrients.vitB1ThiamineMg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitB2", nutrients.vitB2RiboflavinMg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitB3", nutrients.vitB3NiacinMg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitB5", nutrients.vitB5PantothenicMg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitB6", nutrients.vitB6Mg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitB7", nutrients.vitB7BiotinUg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitB9", nutrients.vitB9FolateUg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitB12", nutrients.vitB12Ug, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitC", nutrients.vitCUg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitD", nutrients.vitDUg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitE", nutrients.vitEUg, MicronutrientCategory.VITAMIN)
        addProgress(list, "vitK", nutrients.vitKUg, MicronutrientCategory.VITAMIN)

        // Minerals
        addProgress(list, "calcium", nutrients.calciumMg, MicronutrientCategory.MINERAL)
        addProgress(list, "iron", nutrients.ironMg, MicronutrientCategory.MINERAL)
        addProgress(list, "magnesium", nutrients.magnesiumMg, MicronutrientCategory.MINERAL)
        addProgress(list, "potassium", nutrients.potassiumMg, MicronutrientCategory.MINERAL)
        addProgress(list, "phosphorus", nutrients.phosphorusMg, MicronutrientCategory.MINERAL)
        addProgress(list, "sodium", nutrients.sodiumMg, MicronutrientCategory.MINERAL)
        addProgress(list, "zinc", nutrients.zincMg, MicronutrientCategory.MINERAL)
        addProgress(list, "copper", nutrients.copperMg, MicronutrientCategory.MINERAL)
        addProgress(list, "manganese", nutrients.manganeseMg, MicronutrientCategory.MINERAL)
        addProgress(list, "selenium", nutrients.seleniumUg, MicronutrientCategory.MINERAL)
        addProgress(list, "choline", nutrients.cholineMg, MicronutrientCategory.MINERAL)
        addProgress(list, "iodine", nutrients.iodineUg, MicronutrientCategory.MINERAL)

        return list
    }

    private fun addProgress(
        dest: MutableList<MicronutrientProgress>,
        key: String,
        consumed: Double,
        category: MicronutrientCategory
    ) {
        val targetInfo = RDA_TARGETS[key] ?: return
        val name = targetInfo.first
        val target = targetInfo.second
        val unit = targetInfo.third

        val percent = if (target > 0.0) ((consumed / target) * 100.0) else 0.0

        dest.add(
            MicronutrientProgress(
                name = name,
                key = key,
                consumedValue = roundToOneDecimal(consumed),
                rdaTargetValue = target,
                unit = unit,
                percentCompleted = roundToOneDecimal(percent),
                category = category
            )
        )
    }

    private fun roundToOneDecimal(value: Double): Double {
        return (value * 10.0).roundToInt() / 10.0
    }
}
