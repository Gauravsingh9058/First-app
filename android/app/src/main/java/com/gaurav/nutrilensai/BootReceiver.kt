package com.gaurav.nutrilensai

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
    companion object {
        private const val TAG = "BootReceiver"
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if (context == null || intent == null) return

        val action = intent.action
        if (Intent.ACTION_BOOT_COMPLETED == action || Intent.ACTION_MY_PACKAGE_REPLACED == action) {
            Log.d(TAG, "Received broadcast: $action - checking step tracking status")
            val manager = StepCounterManager.getInstance(context)
            if (manager.isTracking() && manager.isSensorAvailable()) {
                Log.i(TAG, "Restarting step tracking service after boot/update")
                StepCounterService.start(context)
            }
        }
    }
}
