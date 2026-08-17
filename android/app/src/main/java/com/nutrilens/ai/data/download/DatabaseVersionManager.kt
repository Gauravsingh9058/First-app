package com.nutrilens.ai.data.download

import android.content.Context
import android.content.SharedPreferences

/**
 * Manages versioning and download metadata for fooddata.db using SharedPreferences.
 */
class DatabaseVersionManager(context: Context) {

    private val prefs: SharedPreferences =
        context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "nutrilens_db_version_prefs"
        private const val KEY_DB_VERSION = "key_installed_db_version"
        private const val KEY_LAST_CHECK_TIME = "key_last_check_timestamp"
        private const val KEY_DOWNLOADED_BYTES = "key_partially_downloaded_bytes"
        const val CURRENT_DATABASE_VERSION = 1
    }

    var installedVersion: Int
        get() = prefs.getInt(KEY_DB_VERSION, 0)
        set(version) = prefs.edit().putInt(KEY_DB_VERSION, version).apply()

    var downloadedBytes: Long
        get() = prefs.getLong(KEY_DOWNLOADED_BYTES, 0L)
        set(bytes) = prefs.edit().putLong(KEY_DOWNLOADED_BYTES, bytes).apply()

    var lastCheckTimestamp: Long
        get() = prefs.getLong(KEY_LAST_CHECK_TIME, 0L)
        set(timestamp) = prefs.edit().putLong(KEY_LAST_CHECK_TIME, timestamp).apply()

    fun resetDownloadProgress() {
        prefs.edit().remove(KEY_DOWNLOADED_BYTES).apply()
    }

    fun isUpdateAvailable(remoteVersion: Int): Boolean {
        return remoteVersion > installedVersion
    }
}
