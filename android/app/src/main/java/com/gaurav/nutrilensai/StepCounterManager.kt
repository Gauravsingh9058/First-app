package com.gaurav.nutrilensai

import android.content.Context
import android.content.SharedPreferences
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.util.Log
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class StepCounterManager private constructor(private val context: Context) : SensorEventListener {

    companion object {
        private const val TAG = "StepCounterManager"
        private const val PREFS_NAME = "nutrilens_step_counter_prefs"

        private const val KEY_LAST_DATE = "last_active_date"
        private const val KEY_BASELINE_RAW_STEPS = "baseline_raw_steps"
        private const val KEY_ACCUMULATED_TODAY_STEPS = "accumulated_today_steps"
        private const val KEY_LAST_RAW_STEPS = "last_raw_steps"
        private const val KEY_TODAY_STEPS = "today_steps"
        private const val KEY_IS_TRACKING = "is_tracking_enabled"
        private const val KEY_DAILY_HISTORY = "daily_step_history_json"

        @Volatile
        private var instance: StepCounterManager? = null

        fun getInstance(context: Context): StepCounterManager {
            return instance ?: synchronized(this) {
                instance ?: StepCounterManager(context.applicationContext).also { instance = it }
            }
        }
    }

    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    private val sensorManager: SensorManager =
        context.getSystemService(Context.SENSOR_SERVICE) as SensorManager

    private var stepCounterSensor: Sensor? =
        sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)

    private val listeners = mutableSetOf<(Long) -> Unit>()
    private var isListening = false

    init {
        checkDateRollover()
    }

    fun isSensorAvailable(): Boolean {
        return stepCounterSensor != null
    }

    fun getSensorName(): String {
        return stepCounterSensor?.name ?: "No TYPE_STEP_COUNTER sensor"
    }

    fun isTracking(): Boolean {
        return prefs.getBoolean(KEY_IS_TRACKING, false)
    }

    fun setTracking(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_IS_TRACKING, enabled).apply()
        if (enabled) {
            startListening()
            StepCounterService.start(context)
        } else {
            stopListening()
            StepCounterService.stop(context)
        }
    }

    fun addListener(listener: (Long) -> Unit) {
        listeners.add(listener)
    }

    fun removeListener(listener: (Long) -> Unit) {
        listeners.remove(listener)
    }

    fun getCurrentDateString(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        return sdf.format(Date())
    }

    fun getTodaySteps(): Long {
        checkDateRollover()
        return prefs.getLong(KEY_TODAY_STEPS, 0L)
    }

    fun startListening(): Boolean {
        if (isListening) return true
        if (stepCounterSensor == null) {
            Log.w(TAG, "Hardware TYPE_STEP_COUNTER sensor is not available on this device.")
            return false
        }

        // Register with SENSOR_DELAY_NORMAL or SENSOR_DELAY_UI for low-power continuous tracking
        val registered = sensorManager.registerListener(
            this,
            stepCounterSensor,
            SensorManager.SENSOR_DELAY_UI
        )

        if (registered) {
            isListening = true
            Log.d(TAG, "Step sensor listener registered successfully.")
        } else {
            Log.e(TAG, "Failed to register step sensor listener.")
        }
        return registered
    }

    fun stopListening() {
        if (!isListening) return
        try {
            sensorManager.unregisterListener(this)
        } catch (e: Exception) {
            Log.e(TAG, "Error unregistering step listener", e)
        }
        isListening = false
        Log.d(TAG, "Step sensor listener stopped.")
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null || event.sensor.type != Sensor.TYPE_STEP_COUNTER) return
        if (event.values.isEmpty()) return

        val rawSensorSteps = event.values[0].toLong()
        processRawSensorSteps(rawSensorSteps)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // No-op for step counter
    }

    /**
     * Core Algorithm for real-time daily step counting:
     * 1. Detect midnight / new day -> archives yesterday and sets new baseline
     * 2. Detect device reboot (rawSensorSteps < lastRaw) -> saves accumulated before reboot
     * 3. Calculates todaySteps = accumulatedToday + max(0, currentRaw - baselineRaw)
     */
    @Synchronized
    fun processRawSensorSteps(rawSensorSteps: Long) {
        val today = getCurrentDateString()
        val lastDate = prefs.getString(KEY_LAST_DATE, today) ?: today

        // Check if calendar day rolled over
        if (today != lastDate) {
            val yesterdaySteps = prefs.getLong(KEY_TODAY_STEPS, 0L)
            saveHistoryForDate(lastDate, yesterdaySteps)

            // Start fresh for new day
            prefs.edit()
                .putString(KEY_LAST_DATE, today)
                .putLong(KEY_BASELINE_RAW_STEPS, rawSensorSteps)
                .putLong(KEY_ACCUMULATED_TODAY_STEPS, 0L)
                .putLong(KEY_LAST_RAW_STEPS, rawSensorSteps)
                .putLong(KEY_TODAY_STEPS, 0L)
                .apply()

            notifyAllListeners(0L)
            return
        }

        val lastRaw = prefs.getLong(KEY_LAST_RAW_STEPS, 0L)
        var baseline = prefs.getLong(KEY_BASELINE_RAW_STEPS, -1L)
        var accumulated = prefs.getLong(KEY_ACCUMULATED_TODAY_STEPS, 0L)

        // First initialization of baseline
        if (baseline < 0L) {
            baseline = rawSensorSteps
            prefs.edit()
                .putLong(KEY_BASELINE_RAW_STEPS, baseline)
                .putLong(KEY_LAST_RAW_STEPS, rawSensorSteps)
                .putLong(KEY_TODAY_STEPS, 0L)
                .apply()
            notifyAllListeners(0L)
            return
        }

        // Reboot detection: raw sensor count was reset to lower value during today
        if (rawSensorSteps < lastRaw) {
            Log.i(TAG, "Device reboot detected! rawSensorSteps ($rawSensorSteps) < lastRaw ($lastRaw)")
            val segmentBeforeReboot = maxOf(0L, lastRaw - baseline)
            accumulated += segmentBeforeReboot
            baseline = rawSensorSteps

            prefs.edit()
                .putLong(KEY_ACCUMULATED_TODAY_STEPS, accumulated)
                .putLong(KEY_BASELINE_RAW_STEPS, baseline)
                .apply()
        }

        val currentSegment = maxOf(0L, rawSensorSteps - baseline)
        val todaySteps = accumulated + currentSegment

        prefs.edit()
            .putLong(KEY_LAST_RAW_STEPS, rawSensorSteps)
            .putLong(KEY_TODAY_STEPS, todaySteps)
            .apply()

        notifyAllListeners(todaySteps)
    }

    private fun checkDateRollover() {
        val today = getCurrentDateString()
        val lastDate = prefs.getString(KEY_LAST_DATE, "")

        if (!lastDate.isNullOrEmpty() && lastDate != today) {
            val yesterdaySteps = prefs.getLong(KEY_TODAY_STEPS, 0L)
            saveHistoryForDate(lastDate, yesterdaySteps)

            // When new day arrives while closed, reset today count and set baseline invalid
            // until next sensor tick establishes the new baseline
            prefs.edit()
                .putString(KEY_LAST_DATE, today)
                .putLong(KEY_BASELINE_RAW_STEPS, -1L)
                .putLong(KEY_ACCUMULATED_TODAY_STEPS, 0L)
                .putLong(KEY_TODAY_STEPS, 0L)
                .apply()
        } else if (lastDate.isNullOrEmpty()) {
            prefs.edit().putString(KEY_LAST_DATE, today).apply()
        }
    }

    private fun saveHistoryForDate(dateStr: String, steps: Long) {
        try {
            val historyJsonStr = prefs.getString(KEY_DAILY_HISTORY, "{}") ?: "{}"
            val json = JSONObject(historyJsonStr)
            json.put(dateStr, steps)
            prefs.edit().putString(KEY_DAILY_HISTORY, json.toString()).apply()
            Log.d(TAG, "Saved step history for $dateStr: $steps")
        } catch (e: Exception) {
            Log.e(TAG, "Error saving step history", e)
        }
    }

    fun getDailyHistory(): JSONObject {
        return try {
            val historyJsonStr = prefs.getString(KEY_DAILY_HISTORY, "{}") ?: "{}"
            JSONObject(historyJsonStr)
        } catch (e: Exception) {
            JSONObject()
        }
    }

    fun resetTodaySteps() {
        val lastRaw = prefs.getLong(KEY_LAST_RAW_STEPS, 0L)
        prefs.edit()
            .putLong(KEY_BASELINE_RAW_STEPS, lastRaw)
            .putLong(KEY_ACCUMULATED_TODAY_STEPS, 0L)
            .putLong(KEY_TODAY_STEPS, 0L)
            .apply()
        notifyAllListeners(0L)
    }

    private fun notifyAllListeners(steps: Long) {
        for (listener in listeners) {
            try {
                listener(steps)
            } catch (e: Exception) {
                Log.e(TAG, "Error notifying listener", e)
            }
        }
    }
}
