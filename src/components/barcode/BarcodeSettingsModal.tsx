import { BarcodeSettings } from "@/types/barcode";
import {
  Sliders,
  Volume2,
  VolumeX,
  Zap,
  ZapOff,
  Vibrate,
  RefreshCw,
  X,
  ShieldCheck,
} from "lucide-react";

interface BarcodeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BarcodeSettings;
  onUpdateSettings: (newSettings: BarcodeSettings) => void;
}

export function BarcodeSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: BarcodeSettingsModalProps) {
  if (!isOpen) return null;

  const toggle = (key: keyof BarcodeSettings) => {
    onUpdateSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6 text-foreground">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Scanner Settings</h3>
              <p className="text-xs text-muted-foreground">
                Customize camera, sound & vibration feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Auto Scan */}
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Auto Detect Barcode
              </div>
              <p className="text-xs text-muted-foreground">
                Detect barcode automatically without tapping capture button
              </p>
            </div>
            <button
              onClick={() => toggle("autoScan")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoScan ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoScan ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Vibration Feedback */}
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground flex items-center gap-2">
                <Vibrate className="h-4 w-4 text-primary" /> Haptic Vibration
              </div>
              <p className="text-xs text-muted-foreground">
                Vibrate phone on successful barcode detection
              </p>
            </div>
            <button
              onClick={() => toggle("vibration")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.vibration ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.vibration ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Sound Chime */}
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground flex items-center gap-2">
                {settings.sound ? (
                  <Volume2 className="h-4 w-4 text-amber-500" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}{" "}
                Sound Chime
              </div>
              <p className="text-xs text-muted-foreground">
                Play a pleasant synth audio chime when product is found
              </p>
            </div>
            <button
              onClick={() => toggle("sound")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.sound ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.sound ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Auto Flash */}
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground flex items-center gap-2">
                {settings.autoFlash ? (
                  <Zap className="h-4 w-4 text-amber-400" />
                ) : (
                  <ZapOff className="h-4 w-4 text-muted-foreground" />
                )}{" "}
                Torch Auto Flash
              </div>
              <p className="text-xs text-muted-foreground">
                Turn on camera torch light automatically in low light
              </p>
            </div>
            <button
              onClick={() => toggle("autoFlash")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoFlash ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoFlash ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Continuous Scan Mode */}
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/20 p-4">
            <div className="space-y-0.5">
              <div className="font-bold text-foreground flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-indigo-400" /> Continuous Scan Mode
              </div>
              <p className="text-xs text-muted-foreground">
                Keep camera active after scanning to scan multiple items quickly
              </p>
            </div>
            <button
              onClick={() => toggle("continuousScan")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.continuousScan ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.continuousScan ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-primary px-5 py-3 font-display text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition"
        >
          Save & Done
        </button>
      </div>
    </div>
  );
}
