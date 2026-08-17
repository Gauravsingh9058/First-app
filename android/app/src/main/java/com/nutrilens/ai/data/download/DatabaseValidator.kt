package com.nutrilens.ai.data.download

import android.database.sqlite.SQLiteDatabase
import android.util.Log
import java.io.File
import java.io.FileInputStream

/**
 * Validates the downloaded fooddata.db file size and header integrity before opening.
 */
class DatabaseValidator {

    companion object {
        private const val TAG = "NutriLens_DBValidator"
        // Valid SQLite database header string ("SQLite format 3\0")
        private const val SQLITE_HEADER = "SQLite format 3"
        // Minimum valid size for fooddata.db (~50MB sanity check threshold)
        private const val MIN_EXPECTED_SIZE_BYTES = 50_000_000L
    }

    /**
     * Performs strict validation:
     * 1. Checks file existence and minimum size threshold.
     * 2. Inspects magic 16-byte header string.
     * 3. Attempts test connection via SQLiteDatabase to verify integrity.
     */
    fun validateDatabase(dbFile: File): Boolean {
        if (!dbFile.exists()) {
            Log.e(TAG, "Validation failed: Database file does not exist at ${dbFile.absolutePath}")
            return false
        }

        if (dbFile.length() < MIN_EXPECTED_SIZE_BYTES) {
            Log.e(TAG, "Validation failed: Database file size (${dbFile.length()} bytes) is too small")
            return false
        }

        if (!verifySQLiteHeader(dbFile)) {
            Log.e(TAG, "Validation failed: Invalid SQLite header signature")
            return false
        }

        return verifySQLiteConnection(dbFile)
    }

    private fun verifySQLiteHeader(dbFile: File): Boolean {
        return try {
            FileInputStream(dbFile).use { fis ->
                val headerBytes = ByteArray(16)
                val readBytes = fis.read(headerBytes)
                if (readBytes < 16) return false

                val headerStr = String(headerBytes, 0, 15, Charsets.US_ASCII)
                headerStr == SQLITE_HEADER
            }
        } catch (e: Exception) {
            Log.e(TAG, "Header validation error", e)
            false
        }
    }

    private fun verifySQLiteConnection(dbFile: File): Boolean {
        var db: SQLiteDatabase? = null
        return try {
            db = SQLiteDatabase.openDatabase(
                dbFile.absolutePath,
                null,
                SQLiteDatabase.OPEN_READONLY
            )
            // Query sqlite_master to verify schema table readability
            val cursor = db.rawQuery("SELECT count(*) FROM sqlite_master", null)
            val isValid = cursor.moveToFirst() && cursor.getInt(0) > 0
            cursor.close()
            isValid
        } catch (e: Exception) {
            Log.e(TAG, "SQLite test connection failed", e)
            false
        } finally {
            db?.close()
        }
    }
}
