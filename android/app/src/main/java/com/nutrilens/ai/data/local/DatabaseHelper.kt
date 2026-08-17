package com.nutrilens.ai.data.local

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteException
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Singleton DatabaseHelper for managing fooddata.db (~1.7 GB USDA SQLite database).
 * Copies the database from assets to internal app storage on first launch.
 * Opens the database connection exactly once in READ-ONLY mode to ensure zero lock contention.
 */
class DatabaseHelper private constructor(private val context: Context) {

    private var database: SQLiteDatabase? = null
    private val isInitializing = AtomicBoolean(false)

    companion object {
        private const val TAG = "NutriLens_DbHelper"
        private const val DB_NAME = "fooddata.db"
        private const val BUFFER_SIZE = 8192

        @Volatile
        private var INSTANCE: DatabaseHelper? = null

        fun getInstance(context: Context): DatabaseHelper {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: DatabaseHelper(context.applicationContext).also { INSTANCE = it }
            }
        }
    }

    /**
     * Obtains the singleton SQLiteDatabase instance.
     * Guarantees the database file is present in internal storage and opened only once.
     */
    suspend fun getDatabase(): SQLiteDatabase = withContext(Dispatchers.IO) {
        synchronized(this@DatabaseHelper) {
            database?.let { if (it.isOpen) return@withContext it }

            val dbFile = context.getDatabasePath(DB_NAME)

            if (!dbFile.exists()) {
                Log.i(TAG, "fooddata.db not found in internal storage. Initiating asset copy...")
                copyDatabaseFromAssets(dbFile)
            } else {
                Log.d(TAG, "fooddata.db found in internal storage (${dbFile.length()} bytes). Reusing existing database.")
            }

            try {
                database = SQLiteDatabase.openDatabase(
                    dbFile.absolutePath,
                    null,
                    SQLiteDatabase.OPEN_READONLY or SQLiteDatabase.NO_LOCALIZED_COLLATORS
                )
                Log.i(TAG, "fooddata.db opened successfully in READ-ONLY mode.")
            } catch (e: SQLiteException) {
                Log.e(TAG, "Fatal error opening SQLite database at ${dbFile.absolutePath}", e)
                throw e
            }

            return@withContext database!!
        }
    }

    /**
     * Copies fooddata.db from assets directory to internal app storage.
     */
    private fun copyDatabaseFromAssets(dbFile: File) {
        val parentDir = dbFile.parentFile
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs()
        }

        try {
            context.assets.open(DB_NAME).use { inputStream ->
                FileOutputStream(dbFile).use { outputStream ->
                    val buffer = ByteArray(BUFFER_SIZE)
                    var length: Int
                    var totalCopied = 0L
                    while (inputStream.read(buffer).also { length = it } > 0) {
                        outputStream.write(buffer, 0, length)
                        totalCopied += length
                    }
                    outputStream.flush()
                    Log.i(TAG, "Successfully copied fooddata.db ($totalCopied bytes) to ${dbFile.absolutePath}")
                }
            }
        } catch (e: IOException) {
            Log.e(TAG, "Failed to copy fooddata.db from assets to internal storage", e)
            if (dbFile.exists()) {
                dbFile.delete()
            }
            throw e
        }
    }

    /**
     * Safely closes database when application lifecycle terminates.
     */
    fun closeDatabase() {
        synchronized(this) {
            try {
                database?.let {
                    if (it.isOpen) {
                        it.close()
                        Log.i(TAG, "fooddata.db closed safely.")
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error closing database", e)
            } finally {
                database = null
            }
        }
    }
}
