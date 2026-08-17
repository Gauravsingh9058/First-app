package com.nutrilens.ai.data.download

import android.content.Context
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Startup bootstrapper that checks if fooddata.db exists and initializes SQLite connections.
 */
class DatabaseInitializer(
    private val context: Context,
    private val dbManager: DatabaseManager = DatabaseManager(context),
    private val versionManager: DatabaseVersionManager = DatabaseVersionManager(context)
) {

    companion object {
        private const val TAG = "NutriLens_DBInit"
    }

    /**
     * Initializes database state on app startup:
     * - Returns true if fooddata.db exists and passes integrity check -> proceed directly to main app.
     * - Returns false if fooddata.db is missing -> trigger download flow.
     */
    suspend fun initialize(): Boolean = withContext(Dispatchers.IO) {
        Log.i(TAG, "Checking local fooddata.db status...")

        val isInstalled = dbManager.isDatabaseInstalledAndValid()

        if (isInstalled) {
            Log.i(TAG, "fooddata.db is installed and valid (v${versionManager.installedVersion}). Opening SQLite connection.")
            return@withContext true
        } else {
            Log.w(TAG, "fooddata.db missing or corrupted. Triggering initial 3.6GB Google Drive download.")
            return@withContext false
        }
    }
}
