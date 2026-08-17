package com.nutrilens.ai.ui.download

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nutrilens.ai.data.download.DownloadRepository
import com.nutrilens.ai.data.download.DownloadState
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel managing the initial fooddata.db download & initialization UI screen.
 */
class DownloadViewModel(
    private val downloadRepository: DownloadRepository
) : ViewModel() {

    val downloadState: StateFlow<DownloadState> = downloadRepository.downloadState

    init {
        checkAndStartDatabaseFlow()
    }

    fun checkAndStartDatabaseFlow() {
        viewModelScope.launch {
            downloadRepository.checkDatabaseStatus()
        }
    }

    fun onPauseClicked() {
        downloadRepository.pauseDownload()
    }

    fun onResumeClicked() {
        downloadRepository.resumeDownload()
    }

    fun onCancelClicked() {
        downloadRepository.cancelDownload()
    }

    fun onRetryClicked() {
        downloadRepository.startDownload()
    }
}
