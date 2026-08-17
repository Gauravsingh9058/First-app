package com.nutrilens.ai.data.repository

import android.database.Cursor
import android.util.Log
import com.nutrilens.ai.data.local.DatabaseHelper
import com.nutrilens.ai.data.model.Food
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * High-performance SQLite search repository executing fast multi-stage queries against fooddata.db.
 * Target execution speed: <100ms using prepared statements, indexing, and coroutine execution on Dispatchers.IO.
 */
class SQLiteSearchRepository(
    private val dbHelper: DatabaseHelper
) {

    companion object {
        private const val TAG = "NutriLens_SQLiteRepo"

        // Built-in culinary synonym mapping dictionary
        private val SYNONYMS = mapOf(
            "paneer" to listOf("cottage cheese", "cheese", "indian cheese"),
            "dal" to listOf("lentil", "lentil soup", "pigeon peas", "mung bean"),
            "dahi" to listOf("yogurt", "curd"),
            "curd" to listOf("yogurt", "dahi"),
            "roti" to listOf("flatbread", "wheat bread", "chapati", "pitas"),
            "chapati" to listOf("flatbread", "roti", "wheat bread"),
            "naan" to listOf("flatbread", "leavened bread"),
            "chana" to listOf("chickpea", "garbanzo bean"),
            "chickpeas" to listOf("garbanzo bean", "chana"),
            "rajma" to listOf("kidney bean"),
            "poha" to listOf("flattened rice", "rice flakes"),
            "upma" to listOf("semolina", "wheat cream"),
            "idli" to listOf("steamed rice cake"),
            "dosa" to listOf("rice crepe", "pancake"),
            "egg" to listOf("whole egg", "boiled egg", "chicken egg"),
            "mutton" to listOf("goat meat", "lamb"),
            "curry" to listOf("stew", "gravy", "sauce")
        )
    }

    /**
     * Executes multi-stage SQL search with candidate fallback.
     */
    suspend fun searchCandidates(query: String, maxCandidates: Int = 30): List<Food> =
        withContext(Dispatchers.IO) {
            val sanitized = query.trim().lowercase()
            if (sanitized.isEmpty()) return@withContext emptyList()

            val candidatesMap = LinkedHashMap<Long, Food>()

            // 1. Exact Match
            val exactList = queryExact(sanitized, limit = 10)
            exactList.forEach { candidatesMap[it.id] = it }

            // 2. Starts With Match
            if (candidatesMap.size < maxCandidates) {
                val startsList = queryStartsWith(sanitized, limit = maxCandidates - candidatesMap.size)
                startsList.forEach { if (!candidatesMap.containsKey(it.id)) candidatesMap[it.id] = it }
            }

            // 3. Contains / Token Match
            if (candidatesMap.size < maxCandidates) {
                val containsList = queryContains(sanitized, limit = maxCandidates - candidatesMap.size)
                containsList.forEach { if (!candidatesMap.containsKey(it.id)) candidatesMap[it.id] = it }
            }

            // 4. Synonym Expansion Search
            if (candidatesMap.size < maxCandidates) {
                val synonyms = SYNONYMS[sanitized] ?: emptyList()
                for (syn in synonyms) {
                    if (candidatesMap.size >= maxCandidates) break
                    val synList = queryContains(syn, limit = 10)
                    synList.forEach { if (!candidatesMap.containsKey(it.id)) candidatesMap[it.id] = it }
                }
            }

            return@withContext candidatesMap.values.toList()
        }

    private suspend fun queryExact(query: String, limit: Int): List<Food> {
        val sql = """
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE LOWER(f.description) = ?
            LIMIT ?
        """.trimIndent()
        return executeQuery(sql, arrayOf(query, limit.toString()))
    }

    private suspend fun queryStartsWith(query: String, limit: Int): List<Food> {
        val sql = """
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE LOWER(f.description) LIKE ? || '%'
            ORDER BY LENGTH(f.description) ASC
            LIMIT ?
        """.trimIndent()
        return executeQuery(sql, arrayOf(query, limit.toString()))
    }

    private suspend fun queryContains(query: String, limit: Int): List<Food> {
        val sql = """
            SELECT f.id, f.fdc_id, f.description, f.category, f.serving_size, f.serving_unit,
                   f.calories, f.protein, f.fat, f.carbs, f.fiber, f.sugar,
                   f.sodium, f.potassium, f.calcium, f.iron, f.magnesium,
                   f.vitamin_a, f.vitamin_b12, f.vitamin_d, f.omega_3
            FROM foods f
            WHERE LOWER(f.description) LIKE '%' || ? || '%'
            ORDER BY LENGTH(f.description) ASC
            LIMIT ?
        """.trimIndent()
        return executeQuery(sql, arrayOf(query, limit.toString()))
    }

    private suspend fun executeQuery(sql: String, args: Array<String>): List<Food> {
        val list = mutableListOf<Food>()
        try {
            val db = dbHelper.getDatabase()
            db.rawQuery(sql, args).use { cursor ->
                if (cursor.moveToFirst()) {
                    do {
                        val food = parseFoodFromCursor(cursor)
                        if (food != null) list.add(food)
                    } while (cursor.moveToNext())
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error executing SQL query: $sql", e)
        }
        return list
    }

    private fun parseFoodFromCursor(cursor: Cursor): Food? {
        return try {
            val idIdx = cursor.getColumnIndex("id")
            val descIdx = cursor.getColumnIndex("description")
            if (idIdx == -1 || descIdx == -1 || cursor.isNull(descIdx)) return null

            Food(
                id = cursor.getLong(idIdx),
                fdcId = getLongSafe(cursor, "fdc_id"),
                name = cursor.getString(descIdx),
                category = getStringSafe(cursor, "category"),
                servingSizeGrams = getDoubleSafe(cursor, "serving_size", 100.0),
                servingUnit = getStringSafe(cursor, "serving_unit", "g") ?: "g",
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
            Log.e(TAG, "Failed parsing food cursor row", e)
            null
        }
    }

    private fun getLongSafe(cursor: Cursor, columnName: String): Long {
        val idx = cursor.getColumnIndex(columnName)
        return if (idx != -1 && !cursor.isNull(idx)) cursor.getLong(idx) else 0L
    }

    private fun getDoubleSafe(cursor: Cursor, columnName: String, default: Double = 0.0): Double {
        val idx = cursor.getColumnIndex(columnName)
        return if (idx != -1 && !cursor.isNull(idx)) cursor.getDouble(idx) else default
    }

    private fun getStringSafe(cursor: Cursor, columnName: String): String? {
        val idx = cursor.getColumnIndex(columnName)
        return if (idx != -1 && !cursor.isNull(idx)) cursor.getString(idx) else null
    }
}
