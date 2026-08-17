package com.nutrilens.ai.domain.matcher

import android.util.Log
import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.repository.SQLiteSearchRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Intelligent Matcher coordinating SQLite search and ranking.
 * 
 * 7-Tier Matching Strategy:
 * 1. Exact Match
 * 2. Prefix Match
 * 3. Token Match
 * 4. Synonym Search
 * 5. LIKE Partial Match
 * 6. Levenshtein Distance Ranking
 * 7. Highest Similarity Selection
 */
class FoodMatcher(
    private val sqLiteSearchRepository: SQLiteSearchRepository
) {

    companion object {
        private const val TAG = "NutriLens_FoodMatcher"
        private const val MIN_ACCEPTABLE_SCORE = 0.25
    }

    /**
     * Matches a detected food name (e.g., "banana", "chicken curry", "paneer butter masala")
     * against local USDA fooddata.db entries and returns the best matching Food record.
     */
    suspend fun matchFood(detectedName: String): FoodMatchResult = withContext(Dispatchers.IO) {
        val startTime = System.currentTimeMillis()
        val query = detectedName.trim()

        if (query.isEmpty()) {
            return@withContext FoodMatchResult.NoMatch(detectedName)
        }

        // Fetch candidates from multi-tiered SQLite queries
        val candidates = sqLiteSearchRepository.searchCandidates(query, maxCandidates = 40)

        if (candidates.isEmpty()) {
            Log.w(TAG, "No candidate SQLite records found for '$query'")
            return@withContext FoodMatchResult.NoMatch(detectedName)
        }

        // Rank candidates using Levenshtein & Token similarity
        val ranked = SearchRanking.rankFoodCandidates(query, candidates)

        val bestCandidate = ranked.firstOrNull()
        val elapsed = System.currentTimeMillis() - startTime
        Log.d(TAG, "Matched '$query' -> '${bestCandidate?.first?.name}' with score ${bestCandidate?.second} in ${elapsed}ms")

        return@withContext if (bestCandidate != null && bestCandidate.second >= MIN_ACCEPTABLE_SCORE) {
            FoodMatchResult.Success(
                detectedName = detectedName,
                matchedFood = bestCandidate.first,
                confidenceScore = bestCandidate.second,
                executionTimeMs = elapsed
            )
        } else {
            FoodMatchResult.NoMatch(detectedName)
        }
    }
}

/**
 * Result sealed class for food matching operations.
 */
sealed interface FoodMatchResult {
    data class Success(
        val detectedName: String,
        val matchedFood: Food,
        val confidenceScore: Double,
        val executionTimeMs: Long
    ) : FoodMatchResult

    data class NoMatch(
        val detectedName: String
    ) : FoodMatchResult
}
