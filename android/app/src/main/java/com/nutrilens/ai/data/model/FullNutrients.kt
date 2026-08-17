package com.nutrilens.ai.data.model

import androidx.annotation.Keep

/**
 * Comprehensive nutritional breakdown model storing all USDA FoodData Central nutrients.
 * All base values in USDA database are defined per 100 grams.
 * 
 * STRICT RULE: Calculated exclusively from fooddata.db. Gemini NEVER generates nutrition values.
 */
@Keep
data class FullNutrients(
    // Base Macros
    val calories: Double = 0.0,
    val proteinG: Double = 0.0,
    val fatG: Double = 0.0,
    val carbsG: Double = 0.0,
    val fiberG: Double = 0.0,
    val sugarG: Double = 0.0,
    val cholesterolMg: Double = 0.0,
    val waterG: Double = 0.0,
    val alcoholG: Double = 0.0,
    val caffeineMg: Double = 0.0,

    // Minerals (mg / ug)
    val sodiumMg: Double = 0.0,
    val potassiumMg: Double = 0.0,
    val calciumMg: Double = 0.0,
    val ironMg: Double = 0.0,
    val magnesiumMg: Double = 0.0,
    val zincMg: Double = 0.0,
    val copperMg: Double = 0.0,
    val phosphorusMg: Double = 0.0,
    val seleniumUg: Double = 0.0,
    val manganeseMg: Double = 0.0,
    val cholineMg: Double = 0.0,
    val iodineUg: Double = 0.0,

    // Vitamins
    val vitAUg: Double = 0.0,
    val vitB1ThiamineMg: Double = 0.0,
    val vitB2RiboflavinMg: Double = 0.0,
    val vitB3NiacinMg: Double = 0.0,
    val vitB5PantothenicMg: Double = 0.0,
    val vitB6Mg: Double = 0.0,
    val vitB7BiotinUg: Double = 0.0,
    val vitB9FolateUg: Double = 0.0,
    val vitB12Ug: Double = 0.0,
    val vitCUg: Double = 0.0,
    val vitDUg: Double = 0.0,
    val vitEUg: Double = 0.0,
    val vitKUg: Double = 0.0,
    val omega3G: Double = 0.0
) {
    /**
     * Net Carbs = Total Carbs - Fiber (min 0.0)
     */
    val netCarbsG: Double
        get() = maxOf(0.0, carbsG - fiberG)

    /**
     * Operator overload to cleanly sum two FullNutrients objects.
     */
    operator fun plus(other: FullNutrients): FullNutrients {
        return FullNutrients(
            calories = calories + other.calories,
            proteinG = proteinG + other.proteinG,
            fatG = fatG + other.fatG,
            carbsG = carbsG + other.carbsG,
            fiberG = fiberG + other.fiberG,
            sugarG = sugarG + other.sugarG,
            cholesterolMg = cholesterolMg + other.cholesterolMg,
            waterG = waterG + other.waterG,
            alcoholG = alcoholG + other.alcoholG,
            caffeineMg = caffeineMg + other.caffeineMg,
            sodiumMg = sodiumMg + other.sodiumMg,
            potassiumMg = potassiumMg + other.potassiumMg,
            calciumMg = calciumMg + other.calciumMg,
            ironMg = ironMg + other.ironMg,
            magnesiumMg = magnesiumMg + other.magnesiumMg,
            zincMg = zincMg + other.zincMg,
            copperMg = copperMg + other.copperMg,
            phosphorusMg = phosphorusMg + other.phosphorusMg,
            seleniumUg = seleniumUg + other.seleniumUg,
            manganeseMg = manganeseMg + other.manganeseMg,
            cholineMg = cholineMg + other.cholineMg,
            iodineUg = iodineUg + other.iodineUg,
            vitAUg = vitAUg + other.vitAUg,
            vitB1ThiamineMg = vitB1ThiamineMg + other.vitB1ThiamineMg,
            vitB2RiboflavinMg = vitB2RiboflavinMg + other.vitB2RiboflavinMg,
            vitB3NiacinMg = vitB3NiacinMg + other.vitB3NiacinMg,
            vitB5PantothenicMg = vitB5PantothenicMg + other.vitB5PantothenicMg,
            vitB6Mg = vitB6Mg + other.vitB6Mg,
            vitB7BiotinUg = vitB7BiotinUg + other.vitB7BiotinUg,
            vitB9FolateUg = vitB9FolateUg + other.vitB9FolateUg,
            vitB12Ug = vitB12Ug + other.vitB12Ug,
            vitCUg = vitCUg + other.vitCUg,
            vitDUg = vitDUg + other.vitDUg,
            vitEUg = vitEUg + other.vitEUg,
            vitKUg = vitKUg + other.vitKUg,
            omega3G = omega3G + other.omega3G
        )
    }
}
