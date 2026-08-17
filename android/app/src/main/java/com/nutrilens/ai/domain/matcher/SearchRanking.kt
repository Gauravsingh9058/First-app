package com.nutrilens.ai.domain.matcher

import com.nutrilens.ai.data.model.Food
import kotlin.math.max
import kotlin.math.min

/**
 * High-performance string distance and similarity metrics to rank SQLite candidate food entries.
 * 
 * Uses multi-tier scoring:
 * 1. Exact Match (Score 1.0)
 * 2. Prefix / StartsWith Match (Score 0.85 - 0.95)
 * 3. Token Overlap Jaccard Index (Score 0.6 - 0.85)
 * 4. Normalized Levenshtein Distance (Score 0.0 - 0.6)
 */
object SearchRanking {

    /**
     * Calculates combined similarity score between [query] and [candidate] string.
     */
    fun calculateScore(query: String, candidate: String): Double {
        val q = query.trim().lowercase()
        val c = candidate.trim().lowercase()

        if (q == c) return 1.0
        if (c.startsWith(q)) return 0.95 - (c.length - q.length) * 0.005
        if (q.startsWith(c)) return 0.90

        // Token Overlap Score
        val qTokens = q.split("\\s+".toRegex()).filter { it.length > 1 }.toSet()
        val cTokens = c.split("\\s+".toRegex()).filter { it.length > 1 }.toSet()

        if (qTokens.isNotEmpty() && cTokens.isNotEmpty()) {
            val intersection = qTokens.intersect(cTokens).size
            val union = qTokens.union(cTokens).size
            val jaccard = intersection.toDouble() / union.toDouble()

            if (intersection > 0) {
                val levenshteinBonus = levenshteinSimilarity(q, c) * 0.2
                return (0.6 * jaccard) + levenshteinBonus
            }
        }

        return levenshteinSimilarity(q, c) * 0.5
    }

    /**
     * Computes normalized Levenshtein similarity between 0.0 (completely distinct) and 1.0 (identical).
     */
    fun levenshteinSimilarity(s1: String, s2: String): Double {
        val maxLen = max(s1.length, s2.length)
        if (maxLen == 0) return 1.0

        val distance = levenshteinDistance(s1, s2)
        return (1.0 - (distance.toDouble() / maxLen.toDouble())).coerceIn(0.0, 1.0)
    }

    /**
     * Calculates Levenshtein edit distance between two strings.
     */
    fun levenshteinDistance(lhs: CharSequence, rhs: CharSequence): Int {
        val lhsLength = lhs.length
        val rhsLength = rhs.length

        var cost = IntArray(lhsLength + 1) { it }
        var newCost = IntArray(lhsLength + 1)

        for (i in 1..rhsLength) {
            newCost[0] = i
            for (j in 1..lhsLength) {
                val match = if (lhs[j - 1] == rhs[i - 1]) 0 else 1
                val costReplace = cost[j - 1] + match
                val costInsert = cost[j] + 1
                val costDelete = newCost[j - 1] + 1

                newCost[j] = min(min(costInsert, costDelete), costReplace)
            }
            val swap = cost
            cost = newCost
            newCost = swap
        }

        return cost[lhsLength]
    }

    /**
     * Ranks a collection of candidate Food objects against a detected food query.
     */
    fun rankFoodCandidates(query: String, candidates: List<Food>): List<Pair<Food, Double>> {
        return candidates
            .map { food -> food to calculateScore(query, food.name) }
            .sortedByDescending { it.second }
    }
}
