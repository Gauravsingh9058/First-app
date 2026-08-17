import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, Camera, Utensils, Flame, ChevronRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NutriLens — Smart AI Calorie & Nutrition Tracker" },
      {
        name: "description",
        content:
          "Calorie tracking made easy. Scan meals with your camera, track calories, macros, and achieve your health goals with AI.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [phoneTab, setPhoneTab] = useState<"camera" | "dashboard">("camera");

  // Auto-switch phone mockup tab every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPhoneTab((prev) => (prev === "camera" ? "dashboard" : "camera"));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    navigate({ to: "/auth", search: { mode: "sign_up" } });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between bg-[#071018] px-4 py-8 sm:py-12 text-white overflow-hidden selection:bg-[#38BDF8]/30">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#38BDF8]/20 via-[#22D3EE]/15 to-[#34D399]/20 blur-[120px] animate-ambient-breathing" />
      </div>

      {/* Top Bar Spacer */}
      <div className="relative z-10 h-4 w-full" />

      {/* Main Showcase Section */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center my-auto">
        {/* Smartphone Frame Mockup */}
        <div className="relative w-[280px] sm:w-[310px] rounded-[42px] border-[7px] border-[#1F2937] bg-black p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] transition-all duration-500">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-3.5 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-black z-30 flex items-center justify-end px-2">
            <div className="h-2 w-2 rounded-full bg-slate-800" />
          </div>

          {/* Phone Display Screen */}
          <div className="relative h-[440px] sm:h-[480px] w-full overflow-hidden rounded-[32px] bg-[#0A0F17]">
            {phoneTab === "camera" ? (
              /* Screen 1: Camera Meal Scanner */
              <div className="relative h-full w-full flex flex-col justify-between p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
                {/* Simulated Camera Viewfinder Header */}
                <div className="flex items-center justify-between pt-6 text-xs text-slate-300">
                  <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                    <Camera className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="font-medium">AI Camera</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">1080p AI</span>
                </div>

                {/* Simulated Meal Frame */}
                <div className="relative my-auto flex flex-col items-center justify-center">
                  {/* Photo representation */}
                  <div className="relative w-52 h-44 rounded-2xl overflow-hidden border-2 border-emerald-400/60 shadow-2xl bg-slate-800 flex items-center justify-center group">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                      alt="Healthy Meal"
                      className="w-full h-full object-cover"
                    />
                    {/* Corner Scanner Reticles */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white" />

                    {/* Scan Food Badge */}
                    <div className="absolute bottom-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Scan Food</span>
                    </div>
                  </div>
                </div>

                {/* Shutter Controls */}
                <div className="pb-3 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full border-2 border-white/80 p-1 flex items-center justify-center cursor-pointer">
                    <div className="h-full w-full rounded-full bg-white shadow-md active:scale-90 transition" />
                  </div>
                </div>
              </div>
            ) : (
              /* Screen 2: Cal AI Tracker Dashboard */
              <div className="relative h-full w-full flex flex-col justify-between p-4 bg-[#F8FAFC] text-slate-900">
                {/* Header */}
                <div className="pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-lg bg-emerald-500 grid place-items-center text-white text-xs font-black">
                      N
                    </div>
                    <span className="font-black text-sm tracking-tight text-slate-900">
                      NutriLens AI
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                    Today
                  </span>
                </div>

                {/* Calorie Left Main Ring Card */}
                <div className="my-auto bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">2,199</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Cals Left
                  </span>

                  {/* Macros Trio */}
                  <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-3 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                      <span className="text-xs font-black text-slate-900 block">161g</span>
                      <span className="text-[10px] font-bold text-slate-400">Protein left</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                      <span className="text-xs font-black text-slate-900 block">251g</span>
                      <span className="text-[10px] font-bold text-slate-400">Carbs left</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                      <span className="text-xs font-black text-slate-900 block">61g</span>
                      <span className="text-[10px] font-bold text-slate-400">Fat left</span>
                    </div>
                  </div>
                </div>

                {/* Recently eaten hint */}
                <div className="bg-slate-100/80 rounded-2xl p-3 text-left">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">
                    Recently Eaten
                  </span>
                  <p className="text-xs text-slate-600 font-medium">
                    Start tracking today&apos;s meals by taking a quick picture.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab switcher indicator */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setPhoneTab("camera")}
            className={`h-2 rounded-full transition-all ${
              phoneTab === "camera" ? "w-6 bg-[#38BDF8]" : "w-2 bg-slate-700"
            }`}
          />
          <button
            onClick={() => setPhoneTab("dashboard")}
            className={`h-2 rounded-full transition-all ${
              phoneTab === "dashboard" ? "w-6 bg-[#38BDF8]" : "w-2 bg-slate-700"
            }`}
          />
        </div>

        {/* Headline */}
        <h2 className="mt-6 text-2xl sm:text-3xl font-black text-center text-white tracking-tight">
          Calorie tracking <br /> made easy
        </h2>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-3 mt-6">
        <button
          onClick={handleGetStarted}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-slate-950 font-black text-base py-4 px-6 shadow-xl hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Get Started</span>
        </button>

        <Link
          to="/auth"
          search={{ mode: "sign_in" }}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1"
        >
          Already have an account? <span className="underline font-bold text-white">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
