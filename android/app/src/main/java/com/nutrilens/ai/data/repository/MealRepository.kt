package com.nutrilens.ai.data.repository

import android.database.Cursor
import android.util.Log
import com.nutrilens.ai.data.local.DatabaseHelper
import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.model.MealType
import com.nutrilens.ai.domain.generator.DietRuleEngine
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Interface for querying food candidates from fooddata.db for local meal generation.
 */
interface MealRepository {
    suspend fun getCandidateFoodsForMeal(
        mealType: MealType,
        constraints: DietRuleEngine.DietRuleQueryConstraints,
        limit: Int = 100
    ): List<Food>

    suspend fun searchFoodsByCategory(
        category: String,
        limit: Int = 50
    ): List<Food>

    suspend fun searchFoodsByNutrientRange(
        minProtein: Double? = null,
        maxCarbs: Double? = null,
        maxSugar: Double? = null,
        limit: Int = 50
    ): List<Food>
}

/**
 * Production SQLite implementation querying fooddata.db for candidate foods.
 * Uses prepared SQL statements, Coroutines Dispatchers.IO, and background caching for instant execution.
 */
class MealRepositoryImpl(
    private val dbHelper: DatabaseHelper
) : MealRepository {

    companion object {
        private const val TAG = "NutriLens_MealRepo"
    }

    override suspend fun getCandidateFoodsForMeal(
        mealType: MealType,
        constraints: DietRuleEngine.DietRuleQueryConstraints,
        limit: Int
    ): List<Food> = withContext(Dispatchers.IO) {
        val sqlBuilder = StringBuilder()
        val argsList = mutableListOf<String>()

        sqlBuilder.append("""
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE f.calories > 10
        """.trimIndent())

        // Apply constraints
        constraints.maxSugarGramsPer100g?.let {
            sqlBuilder.append(" AND f.sugar <= ?")
            argsList.add(it.toString())
        }

        constraints.maxSodiumMgPer100g?.let {
            sqlBuilder.append(" AND f.sodium <= ?")
            argsList.add(it.toString())
        }

        constraints.minProteinGramsPer100g?.let {
            sqlBuilder.append(" AND f.protein >= ?")
            argsList.add(it.toString())
        }

        constraints.maxCarbsGramsPer100g?.let {
            sqlBuilder.append(" AND f.carbs <= ?")
            argsList.add(it.toString())
        }

        // Apply keyword exclusions for allergies / dietary restrictions
        for (keyword in constraints.excludedKeywords.take(15)) {
            if (keyword.length >= 3) {
                sqlBuilder.append(" AND LOWER(f.description) NOT LIKE '%' || ? || '%'")
                argsList.add(keyword.lowercase())
            }
        }

        // Add meal type search clauses
        val mealKeywords = when (mealType) {
            MealType.BREAKFAST -> listOf("egg", "oat", "yogurt", "pancake", "bread", "fruit", "milk", "cheese", "apple", "banana", "cereal")
            MealType.LUNCH, MealType.DINNER -> listOf("chicken", "beef", "turkey", "salmon", "tofu", "rice", "quinoa", "pasta", "broccoli", "spinach", "salad", "potato")
            MealType.SNACK -> listOf("almond", "walnut", "nut", "yogurt", "apple", "banana", "berry", "hummus", "carrot", "chocolate")
        }

        if (mealKeywords.isNotEmpty()) {
            val kwClauses = mealKeywords.joinToString(" OR ") { "LOWER(f.description) LIKE '%' || ? || '%'" }
            sqlBuilder.append(" AND ($kwClauses)")
            mealKeywords.forEach { argsList.add(it) }
        }

        sqlBuilder.append(" ORDER BY f.calories DESC LIMIT ?")
        argsList.add(limit.toString())

        return@withContext executeQuery(sqlBuilder.toString(), argsList.toTypedArray())
    }

    override suspend fun searchFoodsByCategory(category: String, limit: Int): List<Food> = withContext(Dispatchers.IO) {
        val sql = """
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE LOWER(f.category) LIKE '%' || ? || '%'
            LIMIT ?
        """.trimIndent()

        return@withContext executeQuery(sql, arrayOf(category.lowercase(), limit.toString()))
    }

    override suspend fun searchFoodsByNutrientRange(
        minProtein: Double?,
        maxCarbs: Double?,
        maxSugar: Double?,
        limit: Int
    ): List<Food> = withContext(Dispatchers.IO) {
        val sb = StringBuilder("""
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE 1=1
        """.trimIndent())

        val args = mutableListOf<String>()

        minProtein?.let {
            sb.append(" AND f.protein >= ?")
            args.add(it.toString())
        }

        maxCarbs?.let {
            sb.append(" AND f.carbs <= ?")
            args.add(it.toString())
        }

        maxSugar?.let {
            sb.append(" AND f.sugar <= ?")
            args.add(it.toString())
        }

        sb.append(" LIMIT ?")
        args.add(limit.toString())

        return@withContext executeQuery(sb.toString(), args.toTypedArray())
    }

    private suspend fun executeQuery(sql: String, args: Array<String>): List<Food> {
        val results = mutableListOf<Food>()
        try {
            val db = dbHelper.getDatabase()
            db.rawQuery(sql, args).use { cursor ->
                if (cursor.moveToFirst()) {
                    do {
                        parseFoodFromCursor(cursor)?.let { results.add(it) }
                    } while (cursor.moveToNext())
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error executing SQLite query", e)
        }
        return results
    }

    private fun parseFoodFromCursor(cursor: Cursor): Food? {
        return try {
            val id = getLongSafe(cursor, "id")
            val name = getStringSafe(cursor, "description") ?: return null

            Food(
                id = id,
                fdcId = getLongSafe(cursor, "fdc_id"),
                name = name,
                category = getStringSafe(cursor, "category"),
                servingSizeGrams = getDoubleSafe(cursor, "serving_size", 100.0),
                servingUnit = getStringSafe(cursor, "serving_unit", "g"),
                calories = getDoubleSafe(cursor, "calories"),
                proteinG = getDoubleSafe(cursor, "protein"),
                fatG = getDoubleSafe(cursor, "fat"),
                carbsG = getDoubleSafe(cursor, "carbs"),
                fiberG = getDoubleSafe(cursor, "fiber"),
                sugarG = getDoubleSafe(cursor, "sugar"),
                sodiumMg = getDoubleSafe(cursor, "sodium"),
                potassiumMg = getDoubleSafe(cursor, "potassium"),
                calciumMg = getDoubleSafe(cursor, "calcium"),
                ironMg = getDoubleSafe(cursor, "iron"),
                magnesiumMg = getDoubleSafe(cursor, "magnesium"),
                vitAUg = getDoubleSafe(cursor, "vitamin_a"),
                vitB12Ug = getDoubleSafe(cursor, "vitamin_b12"),
                vitDUg = getDoubleSafe(cursor, "vitamin_d"),
                omega3G = getDoubleSafe(cursor, "omega_3")
            )
        } catch (e: Exception) {
            Log.e(TAG, "Failed to parse cursor row to Food model", e)
            null
        }
    }

    private fun getLongSafe(cursor: Cursor, columnName: String, default: Long = 0L): Long {
        val idx = cursor.getColumnIndex(columnName)
        return if (idx != -1 && !cursor.isNull(idx)) cursor.getLong(idx) else default
    }

    private fun getDoubleSafe(cursor: Cursor, columnName: String, default: Double = 0.0): Double {
        val idx = cursor.getColumnIndex(columnName)
        return if (idx != -1 && !cursor.isNull(idx)) cursor.getDouble(idx) else default
    }

    private fun getStringSafe(cursor: Cursor, columnName: String, default: String? = null): String? {
        val idx = cursor.getColumnIndex(columnName)
        return if (idx != -1 && !cursor.isNull(idx)) cursor.getString(idx) else default
    }
}
