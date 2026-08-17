package com.nutrilens.ai.data.download

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.util.Log
import java.io.File
import java.io.IOException

/**
 * Manages physical file locations, atomic replacements, and connection opening for fooddata.db.
 */
class DatabaseManager(
    private val context: Context,
    private val validator: DatabaseValidator = DatabaseValidator()
) {

    companion object {
        private const val TAG = "NutriLens_DBManager"
        const val DB_NAME = "fooddata.db"
        const val TEMP_DB_NAME = "fooddata_temp.db"
    }

    /**
     * Gets target database file location: Context.getDatabasePath("fooddata.db")
     */
    val databaseFile: File
        get() = context.getDatabasePath(DB_NAME)

    /**
     * Gets temporary file location for streaming download before atomic swap.
     */
    val tempDatabaseFile: File
        get() = File(databaseFile.parentFile, TEMP_DB_NAME)

    /**
     * Checks if a valid fooddata.db file already exists.
     */
    fun isDatabaseInstalledAndValid(): Boolean {
        val dbFile = databaseFile
        if (!dbFile.exists()) return false
        return validator.validateDatabase(dbFile)
    }

    /**
     * Ensures parent databases directory exists.
     */
    fun ensureDirectoryExists() {
        val parent = databaseFile.parentFile
        if (parent != null && !parent.exists()) {
            parent.mkdirs()
        }
    }

    /**
     * Promotes temporary downloaded file to fooddata.db atomically.
     */
    @Throws(IOException::class)
    fun promoteTempToFinalDatabase(): Boolean {
        val temp = tempDatabaseFile
        val target = databaseFile

        if (!temp.exists()) {
            throw IOException("Temporary download file does not exist")
        }

        if (!validator.validateDatabase(temp)) {
            temp.delete()
            throw IOException("Downloaded temporary database failed integrity verification")
        }

        if (target.exists()) {
            target.delete()
        }

        val renamed = temp.renameTo(target)
        if (!renamed) {
            // Fallback manual copy if rename fails across file systems
            temp.copyTo(target, overwrite = true)
            temp.delete()
        }

        Log.i(TAG, "Successfully promoted downloaded database to final destination ${target.absolutePath}")
        return true
    }

    /**
     * Opens the SQLite database connection.
     */
    fun openDatabase(): SQLiteDatabase {
        require(databaseFile.exists()) { "Database file does not exist at ${databaseFile.absolutePath}" }
        return SQLiteDatabase.openDatabase(
            databaseFile.absolutePath,
            null,
            SQLiteDatabase.OPEN_READWRITE
        )
    }

    /**
     * Cleans up temporary or corrupted files.
     */
    fun deleteCorruptedDatabase() {
        if (databaseFile.exists()) databaseFile.delete()
        if (tempDatabaseFile.exists()) tempDatabaseFile.delete()
    }
}
