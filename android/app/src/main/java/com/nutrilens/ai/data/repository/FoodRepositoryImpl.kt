package com.nutrilens.ai.data.repository

import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.util.Log
import com.nutrilens.ai.data.local.DatabaseHelper
import com.nutrilens.ai.data.model.Food
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Implementation of FoodRepository querying fooddata.db (~2.1M USDA Foods).
 * 
 * STRICT ARCHITECTURAL RULE:
 * All nutritional data (Calories, Macros, Micros, Vitamins, Minerals) is sourced
 * EXCLUSIVELY from fooddata.db via prepared SQL statements. Gemini is NEVER used to
 * calculate or generate nutritional values.
 */
class FoodRepositoryImpl(
    private val dbHelper: DatabaseHelper
) : FoodRepository {

    companion object {
        private const val TAG = "NutriLens_FoodRepo"
    }

    override suspend fun searchFood(query: String, limit: Int, offset: Int): List<Food> =
        withContext(Dispatchers.IO) {
            val sanitizedQuery = query.trim()
            if (sanitizedQuery.isEmpty()) return@withContext emptyList()

            // Try exact and starts-with first for maximum performance
            val startsWithResults = searchStartsWithInternal(sanitizedQuery, limit)
            if (startsWithResults.size >= limit) {
                return@withContext startsWithResults
            }

            // Fallback to contains search
            val containsResults = searchContainsInternal(sanitizedQuery, limit, offset)
            val combinedMap = LinkedHashMap<Long, Food>()
            startsWithResults.forEach { combinedMap[it.id] = it }
            containsResults.forEach { if (!combinedMap.containsKey(it.id)) combinedMap[it.id] = it }

            return@withContext combinedMap.values.toList().take(limit)
        }

    override suspend fun searchExact(query: String): List<Food> = withContext(Dispatchers.IO) {
        val sanitizedQuery = query.trim()
        if (sanitizedQuery.isEmpty()) return@withContext emptyList()

        val sql = """
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE LOWER(f.description) = LOWER(?)
            LIMIT 50
        """.trimIndent()

        executeFoodQuery(sql, arrayOf(sanitizedQuery))
    }

    override suspend fun searchStartsWith(query: String, limit: Int): List<Food> =
        withContext(Dispatchers.IO) {
            searchStartsWithInternal(query, limit)
        }

    override suspend fun searchContains(query: String, limit: Int): List<Food> =
        withContext(Dispatchers.IO) {
            searchContainsInternal(query, limit, 0)
        }

    override suspend fun getFoodById(id: Long): Food? = withContext(Dispatchers.IO) {
        val sql = """
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE f.id = ?
            LIMIT 1
        """.trimIndent()

        executeFoodQuery(sql, arrayOf(id.toString())).firstOrNull()
    }

    override suspend fun getFoodByFdcId(fdcId: Long): Food? = withContext(Dispatchers.IO) {
        val sql = """
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE f.fdc_id = ?
            LIMIT 1
        """.trimIndent()

        executeFoodQuery(sql, arrayOf(fdcId.toString())).firstOrNull()
    }

    private suspend fun searchStartsWithInternal(query: String, limit: Int): List<Food> {
        val sanitizedQuery = query.trim()
        if (sanitizedQuery.isEmpty()) return emptyList()

        val sql = """
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE f.description LIKE ? || '%'
            ORDER BY LENGTH(f.description) ASC
            LIMIT ?
        """.trimIndent()

        return executeFoodQuery(sql, arrayOf(sanitizedQuery, limit.toString()))
    }

    private suspend fun searchContainsInternal(query: String, limit: Int, offset: Int): List<Food> {
        val sanitizedQuery = query.trim()
        if (sanitizedQuery.isEmpty()) return emptyList()

        val sql = """
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE f.description LIKE '%' || ? || '%'
            ORDER BY LENGTH(f.description) ASC
            LIMIT ? OFFSET ?
        """.trimIndent()

        return executeFoodQuery(sql, arrayOf(sanitizedQuery, limit.toString(), offset.toString()))
    }

    /**
     * Executes parameterized raw SQL query safely using SQLiteDatabase.
     */
    private suspend fun executeFoodQuery(sql: String, args: Array<String>): List<Food> {
        val resultList = mutableListOf<Food>()
        try {
            val db = dbHelper.getDatabase()
            db.rawQuery(sql, args).use { cursor ->
                if (cursor.moveToFirst()) {
                    do {
                        parseFoodFromCursor(cursor)?.let { resultList.add(it) }
                    } while (cursor.moveToNext())
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error executing query: $sql with args: ${args.joinToString()}", e)
        }
        return resultList
    }

    /**
     * Helper to safely map SQLite Cursor rows into Food model objects.
     */
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
            Log.e(TAG, "Failed to parse Cursor row to Food model", e)
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
