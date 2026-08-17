package com.nutrilens.ai.data.model

import androidx.annotation.Keep

/**
 * Domain model representing a USDA Food item from fooddata.db.
 * Read-only model populated directly from the local SQLite USDA dataset.
 */
@Keep
data class Food(
    val id: Long,
    val fdcId: Long = 0L,
    val name: String,
    val category: String? = null,
    val servingSizeGrams: Double = 100.0,
    val servingUnit: String = "g",
    val calories: Double = 0.0,
    val proteinG: Double = 0.0,
    val fatG: Double = 0.0,
    val carbsG: Double = 0.0,
    val fiberG: Double = 0.0,
    val sugarG: Double = 0.0,
    val sodiumMg: Double = 0.0,
    val potassiumMg: Double = 0.0,
    val calciumMg: Double = 0.0,
    val ironMg: Double = 0.0,
    val magnesiumMg: Double = 0.0,
    val vitAUg: Double = 0.0,
    val vitB12Ug: Double = 0.0,
    val vitDUg: Double = 0.0,
    val omega3G: Double = 0.0
)
