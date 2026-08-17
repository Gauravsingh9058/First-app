package com.nutrilens.ai.data.download

import androidx.annotation.Keep

/**
 * Encapsulates real-time progress metrics during fooddata.db (~3.6GB) background download.
 */
@Keep
data class DownloadProgress(
    val bytesDownloaded: Long = 0L,
    val totalBytes: Long = 3_865_470_566L, // ~3.6 GB
    val bytesPerSecond: Long = 0L,
    val estimatedRemainingSeconds: Long = 0L,
    val percentage: Int = 0
) {
    val downloadedFormatted: String
        get() = String.format("%.2f GB", bytesDownloaded.toDouble() / (1024 * 1024 * 1024))

    val totalFormatted: String
        get() = String.format("%.2f GB", totalBytes.toDouble() / (1024 * 1024 * 1024))

    val speedFormatted: String
        get() {
            val mbps = bytesPerSecond.toDouble() / (1024 * 1024)
            return if (mbps >= 1.0) {
                String.format("%.1f MB/s", mbps)
            } else {
                val kbps = bytesPerSecond.toDouble() / 1024
                String.format("%.0f KB/s", kbps)
            }
        }

    val etaFormatted: String
        get() {
            if (estimatedRemainingSeconds <= 0) return "Calculating..."
            val mins = estimatedRemainingSeconds / 60
            val secs = estimatedRemainingSeconds % 60
            return if (mins > 0) {
                "$mins min $secs sec remaining"
            } else {
                "$secs sec remaining"
            }
        }
}

/**
 * Sealed UI State representing database initialization & download lifecycle.
 */
sealed interface DownloadState {
    object Idle : DownloadState
    object CheckingDatabase : DownloadState
    data class Downloading(val progress: DownloadProgress) : DownloadState
    data class Paused(val progress: DownloadProgress) : DownloadState
    object VerifyingIntegrity : DownloadState
    object Ready : DownloadState
    data class Error(val message: String, val canRetry: Boolean = true) : DownloadState
}
