package com.nutrilens.ai.data.download

import android.content.Context
import android.util.Log
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkInfo
import androidx.work.WorkManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Repository interface exposing fooddata.db download state flow & controls.
 */
interface DownloadRepository {
    val downloadState: StateFlow<DownloadState>
    suspend fun checkDatabaseStatus()
    fun startDownload()
    fun pauseDownload()
    fun resumeDownload()
    fun cancelDownload()
}

/**
 * Implementation managing database checks and WorkManager / Direct Download execution.
 */
class DownloadRepositoryImpl(
    private val context: Context,
    private val dbManager: DatabaseManager = DatabaseManager(context),
    private val versionManager: DatabaseVersionManager = DatabaseVersionManager(context),
    private val downloader: DatabaseDownloader = DatabaseDownloader()
) : DownloadRepository {

    companion object {
        private const val TAG = "NutriLens_DownloadRepo"
    }

    private val _downloadState = MutableStateFlow<DownloadState>(DownloadState.Idle)
    override val downloadState: StateFlow<DownloadState> = _downloadState.asStateFlow()

    private val workManager = WorkManager.getInstance(context)
    private val repoScope = CoroutineScope(Dispatchers.IO)
    private var directDownloadJob: Job? = null

    private var isPaused = false
    private var isCancelled = false

    override suspend fun checkDatabaseStatus() = withContext(Dispatchers.IO) {
        _downloadState.value = DownloadState.CheckingDatabase

        if (dbManager.isDatabaseInstalledAndValid()) {
            _downloadState.value = DownloadState.Ready
        } else {
            // DB does not exist or is corrupted -> Start download automatically
            _downloadState.value = DownloadState.Idle
            startDownload()
        }
    }

    override fun startDownload() {
        isCancelled = false
        isPaused = false

        directDownloadJob?.cancel()
        directDownloadJob = repoScope.launch(Dispatchers.IO) {
            try {
                dbManager.ensureDirectoryExists()
                val tempFile = dbManager.tempDatabaseFile

                _downloadState.value = DownloadState.Downloading(DownloadProgress())

                downloader.downloadDatabase(
                    destinationFile = tempFile,
                    onProgress = { progress ->
                        if (isPaused) {
                            _downloadState.value = DownloadState.Paused(progress)
                        } else {
                            _downloadState.value = DownloadState.Downloading(progress)
                        }
                    },
                    isCancelled = { isCancelled },
                    isPaused = { isPaused }
                )

                if (isCancelled) {
                    _downloadState.value = DownloadState.Idle
                    return@launch
                }

                _downloadState.value = DownloadState.VerifyingIntegrity

                val success = dbManager.promoteTempToFinalDatabase()
                if (success) {
                    versionManager.installedVersion = DatabaseVersionManager.CURRENT_DATABASE_VERSION
                    versionManager.resetDownloadProgress()
                    _downloadState.value = DownloadState.Ready
                } else {
                    _downloadState.value = DownloadState.Error("Database integrity verification failed. Please try again.")
                }

            } catch (e: Exception) {
                Log.e(TAG, "Error during database download", e)
                _downloadState.value = DownloadState.Error(
                    e.localizedMessage ?: "Failed to download database. Check connection and storage space."
                )
            }
        }
    }

    override fun pauseDownload() {
        isPaused = true
        val currentState = _downloadState.value
        if (currentState is DownloadState.Downloading) {
            _downloadState.value = DownloadState.Paused(currentState.progress)
        }
    }

    override fun resumeDownload() {
        isPaused = false
        val currentState = _downloadState.value
        if (currentState is DownloadState.Paused) {
            _downloadState.value = DownloadState.Downloading(currentState.progress)
        } else {
            startDownload()
        }
    }

    override fun cancelDownload() {
        isCancelled = true
        isPaused = false
        directDownloadJob?.cancel()
        dbManager.deleteCorruptedDatabase()
        _downloadState.value = DownloadState.Idle
    }
}
