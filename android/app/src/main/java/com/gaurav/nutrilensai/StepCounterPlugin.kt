package com.gaurav.nutrilensai

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback

@CapacitorPlugin(
    name = "StepCounter",
    permissions = [
        Permission(
            strings = [Manifest.permission.ACTIVITY_RECOGNITION],
            alias = "activityRecognition"
        )
    ]
)
class StepCounterPlugin : Plugin() {

    private lateinit var manager: StepCounterManager
    private val stepListener: (Long) -> Unit = { steps ->
        val data = JSObject()
        data.put("steps", steps)
        data.put("date", manager.getCurrentDateString())
        data.put("isTracking", manager.isTracking())
        notifyListeners("stepUpdate", data)
    }

    override fun load() {
        super.load()
        manager = StepCounterManager.getInstance(context)
        manager.addListener(stepListener)
    }

    override fun handleOnDestroy() {
        super.handleOnDestroy()
        manager.removeListener(stepListener)
    }

    @PluginMethod
    fun isStepSensorAvailable(call: PluginCall) {
        val ret = JSObject()
        val available = manager.isSensorAvailable()
        ret.put("available", available)
        ret.put("sensorName", manager.getSensorName())
        if (!available) {
            ret.put("message", "Device lacks hardware TYPE_STEP_COUNTER sensor.")
        }
        call.resolve(ret)
    }

    @PluginMethod
    fun checkPermission(call: PluginCall) {
        val ret = JSObject()
        val hasPermission = checkActivityRecognitionPermission()
        ret.put("granted", hasPermission)
        ret.put("status", if (hasPermission) "granted" else "denied")
        call.resolve(ret)
    }

    @PluginMethod
    fun requestPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (checkActivityRecognitionPermission()) {
                val ret = JSObject()
                ret.put("granted", true)
                ret.put("status", "granted")
                call.resolve(ret)
            } else {
                requestPermissionForAlias("activityRecognition", call, "permissionCallback")
            }
        } else {
            // Android 9 and lower do not require runtime ACTIVITY_RECOGNITION
            val ret = JSObject()
            ret.put("granted", true)
            ret.put("status", "granted")
            call.resolve(ret)
        }
    }

    @PermissionCallback
    private fun permissionCallback(call: PluginCall) {
        val granted = checkActivityRecognitionPermission()
        val ret = JSObject()
        ret.put("granted", granted)
        ret.put("status", if (granted) "granted" else "denied")
        call.resolve(ret)
    }

    @PluginMethod
    fun getCurrentStepCount(call: PluginCall) {
        val ret = JSObject()
        ret.put("steps", manager.getTodaySteps())
        ret.put("date", manager.getCurrentDateString())
        ret.put("isTracking", manager.isTracking())
        ret.put("isSensorAvailable", manager.isSensorAvailable())
        call.resolve(ret)
    }

    @PluginMethod
    fun startStepTracking(call: PluginCall) {
        if (!manager.isSensorAvailable()) {
            call.reject("Hardware TYPE_STEP_COUNTER sensor is not available on this device.")
            return
        }

        if (!checkActivityRecognitionPermission()) {
            call.reject("ACTIVITY_RECOGNITION permission has not been granted.")
            return
        }

        manager.setTracking(true)
        val ret = JSObject()
        ret.put("success", true)
        ret.put("steps", manager.getTodaySteps())
        ret.put("date", manager.getCurrentDateString())
        ret.put("isTracking", true)
        call.resolve(ret)
    }

    @PluginMethod
    fun stopStepTracking(call: PluginCall) {
        manager.setTracking(false)
        val ret = JSObject()
        ret.put("success", true)
        ret.put("isTracking", false)
        call.resolve(ret)
    }

    @PluginMethod
    fun getDailyStepHistory(call: PluginCall) {
        val ret = JSObject()
        val historyObj = manager.getDailyHistory()
        ret.put("history", JSObject(historyObj.toString()))
        call.resolve(ret)
    }

    @PluginMethod
    fun resetTodaySteps(call: PluginCall) {
        manager.resetTodaySteps()
        val ret = JSObject()
        ret.put("success", true)
        ret.put("steps", 0)
        call.resolve(ret)
    }

    private fun checkActivityRecognitionPermission(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACTIVITY_RECOGNITION
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
    }
}
