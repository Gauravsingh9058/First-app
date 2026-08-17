package com.nutrilens.ai.data.repository

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext

/**
 * Repository to persist and manage local search history using SharedPreferences.
 */
class RecentSearchRepository(context: Context) {

    private val prefs: SharedPreferences =
        context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val _recentSearches = MutableStateFlow<List<String>>(emptyList())
    val recentSearches: StateFlow<List<String>> = _recentSearches.asStateFlow()

    companion object {
        private const val PREFS_NAME = "nutrilens_recent_searches"
        private const val KEY_SEARCHES = "recent_search_list"
        private const val MAX_RECENT_COUNT = 15
        private const val DELIMITER = "|||"
    }

    init {
        loadRecentSearches()
    }

    private fun loadRecentSearches() {
        val raw = prefs.getString(KEY_SEARCHES, "") ?: ""
        if (raw.isNotEmpty()) {
            _recentSearches.value = raw.split(DELIMITER).filter { it.isNotBlank() }
        } else {
            _recentSearches.value = emptyList()
        }
    }

    suspend fun addSearchQuery(query: String) = withContext(Dispatchers.IO) {
        val trimmed = query.trim()
        if (trimmed.length < 2) return@withContext

        val current = _recentSearches.value.toMutableList()
        current.remove(trimmed) // Move to top if already exists
        current.add(0, trimmed)

        if (current.size > MAX_RECENT_COUNT) {
            current.subList(MAX_RECENT_COUNT, current.size).clear()
        }

        saveList(current)
    }

    suspend fun removeSearchQuery(query: String) = withContext(Dispatchers.IO) {
        val current = _recentSearches.value.toMutableList()
        current.remove(query.trim())
        saveList(current)
    }

    suspend fun clearHistory() = withContext(Dispatchers.IO) {
        prefs.edit().remove(KEY_SEARCHES).apply()
        _recentSearches.value = emptyList()
    }

    private fun saveList(list: List<String>) {
        val encoded = list.joinToString(DELIMITER)
        prefs.edit().putString(KEY_SEARCHES, encoded).apply()
        _recentSearches.value = list
    }
}
