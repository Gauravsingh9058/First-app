package com.nutrilens.ai.domain.search

import android.util.Log
import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.repository.SQLiteSearchRepository
import com.nutrilens.ai.domain.matcher.FoodMatcher
import com.nutrilens.ai.domain.matcher.FoodMatchResult
import com.nutrilens.ai.domain.matcher.SearchRanking
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Local Food Search Engine powering manual ingredient searches against fooddata.db.
 *
 * Search Strategy:
 * 1. Exact Match
 * 2. Prefix & StartsWith Match
 * 3. Token Jaccard Overlap
 * 4. Synonym Expansion (e.g., Paneer, Chapati, Roti, Curd, Dahi, Dal, Egg)
 * 5. Levenshtein Distance Fuzzy Ranking
 * 6. Top Similarity Selection (<100ms execution target)
 */
class FoodSearchEngine(
    private val sqLiteSearchRepository: SQLiteSearchRepository,
    private val foodMatcher: FoodMatcher
) {

    companion object {
        private const val TAG = "NutriLens_FoodSearchEngine"
    }

    /**
     * Searches for a single food item name and returns the top matched [Food] entry.
     */
    suspend fun searchFoodItem(foodName: String): FoodMatchResult = withContext(Dispatchers.IO) {
        val startTime = System.currentTimeMillis()
        val matchResult = foodMatcher.matchFood(foodName)
        val elapsed = System.currentTimeMillis() - startTime
        Log.d(TAG, "Search for '$foodName' completed in ${elapsed}ms")
        return@withContext matchResult
    }

    /**
     * Searches and returns a ranked list of food candidates for user dropdowns or manual selection.
     */
    suspend fun searchCandidates(query: String, maxResults: Int = 20): List<Food> = withContext(Dispatchers.IO) {
        val candidates = sqLiteSearchRepository.searchCandidates(query, maxCandidates = maxResults * 2)
        if (candidates.isEmpty()) return@withContext emptyList()

        val ranked = SearchRanking.rankFoodCandidates(query, candidates)
        return@withContext ranked.map { it.first }.take(maxResults)
    }
}
