package com.gaurav.nutrilensai

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(StepCounterPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
