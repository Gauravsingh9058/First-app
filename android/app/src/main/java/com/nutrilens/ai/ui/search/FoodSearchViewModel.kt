package com.nutrilens.ai.ui.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nutrilens.ai.data.model.Food
import com.nutrilens.ai.data.repository.RecentSearchRepository
import com.nutrilens.ai.domain.usecase.SearchFoodUseCase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.launch

/**
 * UI State representing the Food Search Engine screen.
 */
sealed interface SearchUiState {
    object Idle : SearchUiState
    object Loading : SearchUiState
    data class Success(val foods: List<Food>, val query: String) : SearchUiState
    data class Empty(val query: String) : SearchUiState
    data class Error(val message: String) : SearchUiState
}

/**
 * ViewModel managing local food database search with:
 * - 300ms debounced auto-suggestions
 * - Multi-tiered ranked results (Exact, StartsWith, Contains)
 * - Search history persistence
 * - Zero network / Zero Gemini calls
 */
@OptIn(FlowPreview::class)
class FoodSearchViewModel(
    private val searchFoodUseCase: SearchFoodUseCase,
    private val recentSearchRepository: RecentSearchRepository
) : ViewModel() {

    private val _query = MutableStateFlow("")
    val query: StateFlow<String> = _query.asStateFlow()

    private val _uiState = MutableStateFlow<SearchUiState>(SearchUiState.Idle)
    val uiState: StateFlow<SearchUiState> = _uiState.asStateFlow()

    private val _suggestions = MutableStateFlow<List<Food>>(emptyList())
    val suggestions: StateFlow<List<Food>> = _suggestions.asStateFlow()

    val recentSearches: StateFlow<List<String>> = recentSearchRepository.recentSearches

    private var searchJob: Job? = null

    init {
        observeQueryForDebouncedSuggestions()
    }

    /**
     * Debounces keystrokes by 300ms before fetching suggestions.
     */
    private fun observeQueryForDebouncedSuggestions() {
        viewModelScope.launch(Dispatchers.IO) {
            _query
                .debounce(300L)
                .distinctUntilChanged()
                .collect { currentQuery ->
                    val trimmed = currentQuery.trim()
                    if (trimmed.length >= 2) {
                        val suggestionResults = searchFoodUseCase.getSuggestions(trimmed, limit = 20)
                        _suggestions.value = suggestionResults
                    } else {
                        _suggestions.value = emptyList()
                    }
                }
        }
    }

    /**
     * Called on text input change in search bar.
     */
    fun onQueryChanged(newQuery: String) {
        _query.value = newQuery
        if (newQuery.trim().isEmpty()) {
            _suggestions.value = emptyList()
            _uiState.value = SearchUiState.Idle
        }
    }

    /**
     * Triggered when user submits search (e.g. presses Enter / Search button).
     */
    fun onSearchSubmitted(inputQuery: String = _query.value) {
        val trimmedQuery = inputQuery.trim()
        if (trimmedQuery.isEmpty()) return

        _query.value = trimmedQuery
        _suggestions.value = emptyList()
        _uiState.value = SearchUiState.Loading

        searchJob?.cancel()
        searchJob = viewModelScope.launch(Dispatchers.IO) {
            // Save search term to history
            recentSearchRepository.addSearchQuery(trimmedQuery)

            searchFoodUseCase(trimmedQuery)
                .onSuccess { results ->
                    if (results.isEmpty()) {
                        _uiState.value = SearchUiState.Empty(trimmedQuery)
                    } else {
                        _uiState.value = SearchUiState.Success(results, trimmedQuery)
                    }
                }
                .onFailure { exception ->
                    _uiState.value = SearchUiState.Error(
                        exception.localizedMessage ?: "Error querying food database"
                    )
                }
        }
    }

    /**
     * Called when user taps a suggestion item.
     */
    fun selectSuggestion(food: Food) {
        _query.value = food.name
        _suggestions.value = emptyList()
        _uiState.value = SearchUiState.Success(listOf(food), food.name)
        viewModelScope.launch(Dispatchers.IO) {
            recentSearchRepository.addSearchQuery(food.name)
        }
    }

    /**
     * Clears current query and resets UI state.
     */
    fun clearSearch() {
        _query.value = ""
        _suggestions.value = emptyList()
        _uiState.value = SearchUiState.Idle
    }

    /**
     * Clears recent search history.
     */
    fun clearHistory() {
        viewModelScope.launch(Dispatchers.IO) {
            recentSearchRepository.clearHistory()
        }
    }

    /**
     * Removes single search item from history.
     */
    fun removeRecentSearchItem(term: String) {
        viewModelScope.launch(Dispatchers.IO) {
            recentSearchRepository.removeSearchQuery(term)
        }
    }
}
