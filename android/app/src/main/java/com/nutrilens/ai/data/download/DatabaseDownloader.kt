package com.nutrilens.ai.data.download

import android.util.Log
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

/**
 * Low-level downloader utilizing OkHttp to stream fooddata.db (~3.6GB) directly to disk.
 * Supports HTTP Range header for resuming interrupted downloads.
 */
class DatabaseDownloader(
    private val client: OkHttpClient = OkHttpClient.Builder()
        .followRedirects(true)
        .followSslRedirects(true)
        .build()
) {

    companion object {
        private const val TAG = "NutriLens_DBDownloader"
        private const val BUFFER_SIZE = 64 * 1024 // 64 KB buffer for high-throughput streaming
        const val GOOGLE_DRIVE_FILE_ID = "11WfVQDWH9enpm_q6FolXvCNSuRUThXXf"
        val DIRECT_DRIVE_URL = "https://drive.google.com/uc?export=download&id=$GOOGLE_DRIVE_FILE_ID&confirm=t"
    }

    /**
     * Streams download directly to [destinationFile].
     * Invokes [onProgress] callback with progress metrics.
     * Supports cancellation via [isCancelled] check lambda.
     */
    @Throws(IOException::class)
    fun downloadDatabase(
        downloadUrl: String = DIRECT_DRIVE_URL,
        destinationFile: File,
        onProgress: (DownloadProgress) -> Unit,
        isCancelled: () -> Boolean,
        isPaused: () -> Boolean
    ) {
        val existingBytes = if (destinationFile.exists()) destinationFile.length() else 0L

        val requestBuilder = Request.Builder()
            .url(downloadUrl)
            .addHeader("User-Agent", "Mozilla/5.0 (Android; NutriLensAI)")

        // Add HTTP Range header if resuming partial download
        if (existingBytes > 0) {
            requestBuilder.addHeader("Range", "bytes=$existingBytes-")
            Log.d(TAG, "Resuming download from byte: $existingBytes")
        }

        val request = requestBuilder.build()
        val response: Response = client.newCall(request).execute()

        if (!response.isSuccessful && response.code != 206) {
            response.close()
            throw IOException("Server returned HTTP error code: ${response.code}")
        }

        val body = response.body ?: throw IOException("Empty response body from server")
        val contentLength = body.contentLength()
        val totalBytes = if (response.code == 206) {
            existingBytes + contentLength
        } else {
            if (contentLength > 0) contentLength else 3_865_470_566L // Fallback estimate ~3.6GB
        }

        val append = response.code == 206 && existingBytes > 0
        var downloadedBytes = if (append) existingBytes else 0L

        val inputStream = body.byteStream()
        val outputStream = FileOutputStream(destinationFile, append)

        try {
            val buffer = ByteArray(BUFFER_SIZE)
            var bytesRead: Int
            var lastReportTime = System.currentTimeMillis()
            var bytesSinceLastReport = 0L

            while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                if (isCancelled()) {
                    Log.i(TAG, "Download cancelled by user")
                    outputStream.flush()
                    outputStream.close()
                    inputStream.close()
                    response.close()
                    return
                }

                while (isPaused()) {
                    Thread.sleep(500)
                    if (isCancelled()) return
                }

                outputStream.write(buffer, 0, bytesRead)
                downloadedBytes += bytesRead
                bytesSinceLastReport += bytesRead

                val now = System.currentTimeMillis()
                val elapsed = now - lastReportTime

                // Update progress metrics every 300ms
                if (elapsed >= 300) {
                    val bytesPerSecond = if (elapsed > 0) (bytesSinceLastReport * 1000) / elapsed else 0L
                    val remainingBytes = totalBytes - downloadedBytes
                    val remainingSeconds = if (bytesPerSecond > 0) remainingBytes / bytesPerSecond else 0L
                    val percentage = if (totalBytes > 0) ((downloadedBytes * 100) / totalBytes).toInt() else 0

                    val progress = DownloadProgress(
                        bytesDownloaded = downloadedBytes,
                        totalBytes = totalBytes,
                        bytesPerSecond = bytesPerSecond,
                        estimatedRemainingSeconds = remainingSeconds,
                        percentage = percentage.coerceIn(0, 100)
                    )

                    onProgress(progress)

                    lastReportTime = now
                    bytesSinceLastReport = 0L
                }
            }

            outputStream.flush()

            // Final 100% progress update
            val finalProgress = DownloadProgress(
                bytesDownloaded = downloadedBytes,
                totalBytes = downloadedBytes,
                bytesPerSecond = 0,
                estimatedRemainingSeconds = 0,
                percentage = 100
            )
            onProgress(finalProgress)

        } finally {
            try { outputStream.close() } catch (_: Exception) {}
            try { inputStream.close() } catch (_: Exception) {}
            response.close()
        }
    }
}
