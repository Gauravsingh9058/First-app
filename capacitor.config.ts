import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gaurav.nutrilensai",
  appName: "NutriLens AI",
  webDir: "dist",
  server: {
    androidScheme: "https",
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    // Custom native plugin registered via Capacitor MainActivity
  },
};

export default config;
