package com.nutrilens.ai.ui.scan

import android.graphics.Bitmap
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nutrilens.ai.data.model.ScannedMealResult
import com.nutrilens.ai.domain.usecase.ScanFoodImageUseCase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * UI State for the AI Camera Food Scanner.
 */
sealed interface FoodScanUiState {
    object Idle : FoodScanUiState
    object CapturingImage : FoodScanUiState
    object AnalyzingWithVision : FoodScanUiState
    object QueryingDatabase : FoodScanUiState
    data class Success(val result: ScannedMealResult, val capturedImage: Bitmap) : FoodScanUiState
    data class Error(val message: String, val canRetry: Boolean = true) : FoodScanUiState
}

/**
 * ViewModel orchestrating AI Food Camera Scan pipeline.
 */
class FoodScannerViewModel(
    private val scanFoodImageUseCase: ScanFoodImageUseCase
) : ViewModel() {

    private val _scanState = MutableStateFlow<FoodScanUiState>(FoodScanUiState.Idle)
    val scanState: StateFlow<FoodScanUiState> = _scanState.asStateFlow()

    private var activeScanJob: Job? = null

    /**
     * Called when a camera frame or photo is captured by the user.
     * Immediately cancels any ongoing active scan job to prevent race conditions.
     */
    fun onPhotoCaptured(bitmap: Bitmap) {
        activeScanJob?.cancel()

        _scanState.value = FoodScanUiState.AnalyzingWithVision

        activeScanJob = viewModelScope.launch(Dispatchers.IO) {
            _scanState.value = FoodScanUiState.QueryingDatabase

            scanFoodImageUseCase(bitmap)
                .onSuccess { mealResult ->
                    _scanState.value = FoodScanUiState.Success(mealResult, bitmap)
                }
                .onFailure { exception ->
                    val errorMsg = when {
                        exception.message?.contains("Unable to resolve host", ignoreCase = true) == true ||
                        exception.message?.contains("ConnectException", ignoreCase = true) == true ->
                            "No internet connection. Gemini Vision requires active network."

                        exception.message?.contains("Gemini API Error", ignoreCase = true) == true ->
                            "AI Vision service error. Please try scanning again."

                        exception.message?.contains("Identified items could not be matched", ignoreCase = true) == true ->
                            "Food detected, but could not match in USDA database. Try searching manually."

                        else -> exception.localizedMessage ?: "Failed to analyze food scan."
                    }

                    _scanState.value = FoodScanUiState.Error(errorMsg, canRetry = true)
                }
        }
    }

    /**
     * Resets the camera scanner to idle state for another scan.
     */
    fun resetScan() {
        activeScanJob?.cancel()
        _scanState.value = FoodScanUiState.Idle
    }

    /**
     * Called when ViewModel is cleared to release active jobs.
     */
    override fun onCleared() {
        super.onCleared()
        activeScanJob?.cancel()
    }
}
