package com.nutrilens.ai.data.download

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.ServiceInfo
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.ForegroundInfo
import androidx.work.WorkerParameters
import androidx.work.workDataOf
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Background WorkManager worker for downloading fooddata.db with foreground notification support.
 */
class DownloadWorker(
    context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    companion object {
        private const val TAG = "NutriLens_DownloadWorker"
        const val WORK_NAME = "nutrilens_database_download_work"
        private const val NOTIFICATION_CHANNEL_ID = "nutrilens_db_download_channel"
        private const val NOTIFICATION_ID = 1001

        const val KEY_PROGRESS_PERCENT = "progress_percent"
        const val KEY_DOWNLOADED_BYTES = "downloaded_bytes"
        const val KEY_TOTAL_BYTES = "total_bytes"
        const val KEY_SPEED = "speed_formatted"
        const val KEY_ETA = "eta_formatted"
        const val KEY_ERROR_MESSAGE = "error_message"
    }

    private val dbManager = DatabaseManager(applicationContext)
    private val downloader = DatabaseDownloader()
    private val versionManager = DatabaseVersionManager(applicationContext)

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            dbManager.ensureDirectoryExists()
            val tempFile = dbManager.tempDatabaseFile

            // Show foreground notification
            createNotificationChannel()
            val initialForegroundInfo = createForegroundInfo(0, "0.00 GB / 3.60 GB", "Starting...")
            setForeground(initialForegroundInfo)

            downloader.downloadDatabase(
                destinationFile = tempFile,
                onProgress = { progress ->
                    val progressData = workDataOf(
                        KEY_PROGRESS_PERCENT to progress.percentage,
                        KEY_DOWNLOADED_BYTES to progress.bytesDownloaded,
                        KEY_TOTAL_BYTES to progress.totalBytes,
                        KEY_SPEED to progress.speedFormatted,
                        KEY_ETA to progress.etaFormatted
                    )
                    setProgressAsync(progressData)

                    // Update notification
                    val notification = createNotification(
                        progress.percentage,
                        "${progress.downloadedFormatted} / ${progress.totalFormatted}",
                        "${progress.speedFormatted} • ${progress.etaFormatted}"
                    )
                    val manager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                    manager.notify(NOTIFICATION_ID, notification)
                },
                isCancelled = { isStopped },
                isPaused = { false }
            )

            if (isStopped) {
                Log.w(TAG, "Worker stopped during download execution")
                return@withContext Result.retry()
            }

            // Promote temp file to final DB
            dbManager.promoteTempToFinalDatabase()
            versionManager.installedVersion = DatabaseVersionManager.CURRENT_DATABASE_VERSION
            versionManager.resetDownloadProgress()

            Result.success()
        } catch (e: Exception) {
            Log.e(TAG, "Database download worker failed", e)
            val errorData = workDataOf(KEY_ERROR_MESSAGE to (e.localizedMessage ?: "Download failed"))
            Result.failure(errorData)
        }
    }

    private fun createForegroundInfo(progress: Int, subText: String, title: String): ForegroundInfo {
        val notification = createNotification(progress, subText, title)
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ForegroundInfo(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC)
        } else {
            ForegroundInfo(NOTIFICATION_ID, notification)
        }
    }

    private fun createNotification(progress: Int, subText: String, title: String) =
        NotificationCompat.Builder(applicationContext, NOTIFICATION_CHANNEL_ID)
            .setContentTitle("Downloading Nutrition Database")
            .setContentText("$subText ($title)")
            .setSmallIcon(android.R.drawable.stat_sys_download)
            .setProgress(100, progress, false)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .build()

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Database Download",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows progress while downloading the local food database"
            }
            val manager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }
}
