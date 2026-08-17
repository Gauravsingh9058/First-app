package com.gaurav.nutrilensai

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import java.util.Locale

class StepCounterService : Service() {

    companion object {
        const val CHANNEL_ID = "nutrilens_step_counter_channel"
        const val NOTIFICATION_ID = 1001

        fun start(context: Context) {
            val intent = Intent(context, StepCounterService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stop(context: Context) {
            val intent = Intent(context, StepCounterService::class.java)
            context.stopService(intent)
        }
    }

    private lateinit var manager: StepCounterManager
    private val stepListener: (Long) -> Unit = { steps ->
        updateNotification(steps)
    }

    override fun onCreate() {
        super.onCreate()
        manager = StepCounterManager.getInstance(this)
        createNotificationChannel()

        val notification = buildNotification(manager.getTodaySteps())

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) { // Android 14+
                startForeground(
                    NOTIFICATION_ID,
                    notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH
                )
            } else {
                startForeground(NOTIFICATION_ID, notification)
            }
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        manager.addListener(stepListener)
        manager.startListening()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        manager.startListening()
        updateNotification(manager.getTodaySteps())
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        manager.removeListener(stepListener)
        // Note: if user explicitly stopped tracking, manager.stopListening() was called
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "NutriLens Step Tracker",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows live daily step count in real-time"
                setShowBadge(false)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            }
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(steps: Long): Notification {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("NutriLens AI · Activity Tracker")
            .setContentText(String.format(Locale.US, "%,d steps today · Keep moving!", steps))
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build()
    }

    private fun updateNotification(steps: Long) {
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
        notificationManager?.notify(NOTIFICATION_ID, buildNotification(steps))
    }
}
