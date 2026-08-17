package com.nutrilens.ai.data.repository

import com.nutrilens.ai.data.model.Food

/**
 * Repository interface for food lookup and USDA database queries.
 * Reusable by Search Screen, Food Scanner, Recommendations, AI Coach, and Meal Planner.
 */
interface FoodRepository {

    /**
     * Search foods matching query using indexed full-text or fuzzy search.
     */
    suspend fun searchFood(query: String, limit: Int = 50, offset: Int = 0): List<Food>

    /**
     * Search foods with exact name match.
     */
    suspend fun searchExact(query: String): List<Food>

    /**
     * Search foods starting with the query string.
     */
    suspend fun searchStartsWith(query: String, limit: Int = 50): List<Food>

    /**
     * Search foods containing query string.
     */
    suspend fun searchContains(query: String, limit: Int = 50): List<Food>

    /**
     * Retrieve single food by primary key ID.
     */
    suspend fun getFoodById(id: Long): Food?

    /**
     * Retrieve single food by FDC (FoodData Central) ID.
     */
    suspend fun getFoodByFdcId(fdcId: Long): Food?
}
