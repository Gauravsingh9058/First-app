package com.nutrilens.ai.domain.usecase

import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.repository.FoodRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * UseCase encapsulating production-grade multi-tier search & ranking rules:
 * Priority 1: Exact Match (case-insensitive)
 * Priority 2: Starts With (sorted alphabetically)
 * Priority 3: Contains (sorted alphabetically)
 *
 * All extra leading/trailing and interior spaces are normalized.
 * Execution runs strictly on Dispatchers.IO.
 */
class SearchFoodUseCase(
    private val foodRepository: FoodRepository
) {

    suspend operator fun invoke(
        rawQuery: String,
        limit: Int = 50
    ): Result<List<Food>> = withContext(Dispatchers.IO) {
        try {
            // Clean & normalize search query
            val query = rawQuery.trim().replace("\\s+".toRegex(), " ")
            if (query.isEmpty()) {
                return@withContext Result.success(emptyList())
            }

            // Priority 1: Exact Match
            val exactMatches = foodRepository.searchExact(query)

            // Priority 2: Starts With
            val startsWithMatches = foodRepository.searchStartsWith(query, limit = 100)

            // Priority 3: Contains
            val containsMatches = foodRepository.searchContains(query, limit = 100)

            val exactIds = exactMatches.map { it.id }.toSet()

            // Filter out exact matches from startsWith, then sort alphabetically
            val filteredStartsWith = startsWithMatches
                .filter { it.id !in exactIds }
                .sortedBy { it.name.lowercase() }

            val startsWithIds = filteredStartsWith.map { it.id }.toSet()

            // Filter out exact and startsWith matches from contains, then sort alphabetically
            val filteredContains = containsMatches
                .filter { it.id !in exactIds && it.id !in startsWithIds }
                .sortedBy { it.name.lowercase() }

            // Combine ranked tiers
            val combinedList = ArrayList<Food>()
            combinedList.addAll(exactMatches)
            combinedList.addAll(filteredStartsWith)
            combinedList.addAll(filteredContains)

            Result.success(combinedList.take(limit))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Rapid suggestion lookup for real-time keystroke predictions (Top 20 matches).
     */
    suspend fun getSuggestions(rawQuery: String, limit: Int = 20): List<Food> =
        withContext(Dispatchers.IO) {
            val query = rawQuery.trim().replace("\\s+".toRegex(), " ")
            if (query.length < 2) return@withContext emptyList()

            invoke(query, limit = limit).getOrDefault(emptyList())
        }
}
