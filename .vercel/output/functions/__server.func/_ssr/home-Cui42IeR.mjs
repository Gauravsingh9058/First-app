import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as RDA, n as MICRO_LABELS, r as MICRO_UNITS } from "./nutrition-BAeM0OEM.mjs";
import { t as supabase } from "./client-gnngM_Y9.mjs";
import { t as getLocalDateString } from "./date-utils-CMo_soRo.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as Leaf, E as Square, G as PartyPopper, Gt as Activity, H as Play, Ht as ArrowRight, It as Bell, K as Navigation, Lt as BellRing, M as ShieldCheck, O as Sparkles, Ot as Check, V as Plus, a as VolumeX, c as Utensils, g as TriangleAlert, gt as Droplet, h as Trophy, ht as Dumbbell, i as Wheat, j as SlidersHorizontal, jt as Camera, k as Smartphone, kt as CheckCheck, lt as Footprints, nt as Info, o as Volume2, ot as Heart, r as X, t as Zap, ut as Flame, vt as Clock, xt as CircleCheck, y as Trash2 } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as confetti_module_default } from "../_libs/canvas-confetti.mjs";
import { a as LocalStore, c as clearAllNotifications, d as getNotificationPreferences, f as markAllNotificationsAsRead, g as triggerTestNotification, h as saveNotificationPreferences, i as updateProfile, l as getBrowserNotificationPermission, m as requestNutriLensNotificationPermission, n as addWater, o as getToday, p as markNotificationAsRead, r as getProfile, u as getNotificationHistory, v as useServerFn } from "./router-BBaCA5Zn.mjs";
import { n as registerPlugin, t as Capacitor } from "../_libs/capacitor__core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/home-Cui42IeR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CalorieHero({ consumed, target, protein, proteinTarget, score }) {
	const remaining = Math.max(0, target - consumed);
	const pct = Math.min(1, target > 0 ? consumed / target : 0);
	const [animatedPct, setAnimatedPct] = (0, import_react.useState)(0);
	const [displayConsumed, setDisplayConsumed] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setAnimatedPct(pct), 60);
		return () => clearTimeout(t);
	}, [pct]);
	(0, import_react.useEffect)(() => {
		let animationFrameId;
		let startTimestamp = null;
		const duration = 1e3;
		const endVal = Math.round(consumed);
		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			const easedProgress = 1 - Math.pow(1 - progress, 3);
			setDisplayConsumed(Math.round(endVal * easedProgress));
			if (progress < 1) animationFrameId = requestAnimationFrame(step);
		};
		animationFrameId = requestAnimationFrame(step);
		return () => cancelAnimationFrame(animationFrameId);
	}, [consumed]);
	const r = 88;
	const c = 2 * Math.PI * r;
	const dash = c * animatedPct;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 20,
			scale: .97
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		transition: { duration: .35 },
		className: "relative overflow-hidden rounded-[24px] border border-border/80 bg-card text-card-foreground shadow-lg dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl dark:text-white dark:shadow-2xl p-6 transition-all duration-300 hover:border-border dark:hover:border-white/20 sm:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden dark:block animate-ambient-breathing pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#38BDF8]/15 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden dark:block animate-ambient-breathing pointer-events-none absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-[#34D399]/10 blur-3xl [animation-delay:3s]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-center justify-between border-b border-border/50 dark:border-white/5 pb-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-2xl bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 shadow-sm dark:shadow-[0_0_12px_rgba(56,189,248,0.2)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4.5 w-4.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm font-black tracking-wide text-foreground dark:text-white",
						children: "CALORIE & MACRO OVERVIEW"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#38BDF8] px-3 py-1 text-[11px] font-black shadow-sm dark:shadow-[0_0_10px_rgba(56,189,248,0.2)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Optimal Energy" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-center justify-center shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: "210",
						height: "210",
						viewBox: "0 0 210 210",
						className: "drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "primaryGreenGradient",
								x1: "0%",
								y1: "0%",
								x2: "100%",
								y2: "100%",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#38BDF8"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#34D399"
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "105",
								cy: "105",
								r,
								fill: "none",
								className: "stroke-muted dark:stroke-white/10",
								strokeWidth: "15"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "105",
								cy: "105",
								r,
								fill: "none",
								stroke: "url(#primaryGreenGradient)",
								strokeWidth: "15",
								strokeLinecap: "round",
								strokeDasharray: `${dash} ${c}`,
								transform: "rotate(-90 105 105)",
								style: { transition: "stroke-dasharray 1200ms cubic-bezier(.16,1,.3,1)" }
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-4xl font-black leading-none text-foreground dark:text-white tracking-tight tabular-nums",
								children: displayConsumed
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[10px] font-black uppercase tracking-widest text-[#38BDF8]",
								children: "KCAL EATEN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 rounded-full border border-border bg-muted/50 dark:border-white/10 dark:bg-white/5 px-3 py-0.5 text-xs font-semibold text-muted-foreground dark:text-slate-300",
								children: [Math.round(remaining), " kcal left"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full flex-1 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-[20px] border border-border/60 bg-muted/30 dark:border-white/5 dark:bg-[#0F2130]/80 p-3.5 backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-400",
								children: "DAILY GOAL TARGET"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-2xl font-black text-foreground dark:text-white tabular-nums",
								children: [
									target,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground dark:text-slate-400",
										children: "kcal"
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right text-xs text-[#38BDF8] font-black",
								children: [Math.round(pct * 100), "% Met"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground/90 dark:text-slate-300 flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[#38BDF8] shadow-sm dark:shadow-[0_0_8px_#38BDF8]" }),
										" ",
										"Protein Intake"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold tabular-nums text-foreground dark:text-white",
									children: [
										Math.round(protein),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground dark:text-slate-400",
											children: [
												"/ ",
												proteinTarget,
												"g"
											]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/5 p-0.5 border border-border/40 dark:border-white/5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] shadow-sm dark:shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all duration-1000 ease-out",
									style: { width: `${Math.min(100, protein / Math.max(proteinTarget, 1) * 100)}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground/90 dark:text-[#C7D2CC] flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-3.5 w-3.5 text-amber-500 dark:text-amber-400" }), " Nutrition Quality Score"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-display text-lg font-black text-amber-500 dark:text-amber-400 tabular-nums",
									children: [score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground dark:text-slate-400",
										children: "/100"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/5 p-0.5 border border-border/40 dark:border-white/5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-sm dark:shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all duration-1000 ease-out",
									style: { width: `${Math.min(100, score)}%` }
								})
							})]
						})
					]
				})]
			})
		]
	});
}
/**
* Web Fallback Implementation
* When running in a standard web browser where Android TYPE_STEP_COUNTER is absent,
* gracefully reads from persistent LocalStore rather than generating fake or random numbers.
*/
var StepCounterWeb = class {
	isTrackingEnabled = false;
	listeners = [];
	getTodayString() {
		const d = /* @__PURE__ */ new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	}
	async isStepSensorAvailable() {
		return {
			available: false,
			sensorName: "Browser Web Mode",
			message: "Native hardware TYPE_STEP_COUNTER is available when running on an Android device via Capacitor."
		};
	}
	async checkPermission() {
		if (typeof window === "undefined") return {
			granted: false,
			status: "denied"
		};
		const granted = localStorage.getItem("nutrilens_web_step_permission") === "granted";
		return {
			granted,
			status: granted ? "granted" : "prompt"
		};
	}
	async requestPermission() {
		if (typeof window === "undefined") return {
			granted: false,
			status: "denied"
		};
		localStorage.setItem("nutrilens_web_step_permission", "granted");
		return {
			granted: true,
			status: "granted"
		};
	}
	async getCurrentStepCount() {
		const today = this.getTodayString();
		return {
			steps: LocalStore.getSteps(today),
			date: today,
			isTracking: this.isTrackingEnabled,
			isSensorAvailable: false
		};
	}
	async startStepTracking() {
		this.isTrackingEnabled = true;
		const today = this.getTodayString();
		return {
			success: true,
			steps: LocalStore.getSteps(today),
			date: today,
			isTracking: true
		};
	}
	async stopStepTracking() {
		this.isTrackingEnabled = false;
		return {
			success: true,
			isTracking: false
		};
	}
	async getDailyStepHistory() {
		const today = this.getTodayString();
		const steps = LocalStore.getSteps(today);
		return { history: { [today]: steps } };
	}
	async resetTodaySteps() {
		const today = this.getTodayString();
		LocalStore.saveSteps(today, 0);
		this.notifyStepUpdate(0);
		return {
			success: true,
			steps: 0
		};
	}
	async addListener(eventName, listenerFunc) {
		if (eventName === "stepUpdate") this.listeners.push(listenerFunc);
		return { remove: async () => {
			this.listeners = this.listeners.filter((l) => l !== listenerFunc);
		} };
	}
	async removeAllListeners() {
		this.listeners = [];
	}
	notifyStepUpdate(steps) {
		const event = {
			steps,
			date: this.getTodayString(),
			isTracking: this.isTrackingEnabled
		};
		for (const listener of this.listeners) try {
			listener(event);
		} catch (err) {
			console.error("Error in step listener", err);
		}
	}
};
var StepCounter$1 = registerPlugin("StepCounter", { web: () => new StepCounterWeb() });
var isNativeAndroid = () => {
	return Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";
};
function useStepCounter(options = {}) {
	const getTodayString = () => {
		const d = /* @__PURE__ */ new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	};
	const todayStr = options.todayStr || getTodayString();
	const weightKg = options.weightKg || 70;
	const heightCm = options.heightCm || 175;
	const targetSteps = options.targetSteps || 1e4;
	const autoStart = options.autoStart !== false;
	const [steps, setSteps] = (0, import_react.useState)(() => LocalStore.getSteps(todayStr));
	const [isTracking, setIsTracking] = (0, import_react.useState)(false);
	const [isAvailable, setIsAvailable] = (0, import_react.useState)(null);
	const [sensorName, setSensorName] = (0, import_react.useState)("");
	const [hasPermission, setHasPermission] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const isNative = isNativeAndroid();
	const syncStepsToSupabase = (0, import_react.useCallback)(async (dStr, stepCount) => {
		try {
			const { data: sess } = await supabase.auth.getSession();
			const userId = sess.session?.user?.id;
			if (!userId) return;
			const strideM = (heightCm || 175) * .414 / 100;
			const distKm = Number((stepCount * strideM / 1e3).toFixed(2));
			const cals = Number((stepCount * (weightKg || 70) * 6125e-7).toFixed(1));
			const mins = Math.round(stepCount / 100);
			await supabase.from("step_logs").upsert({
				user_id: userId,
				day: dStr,
				steps: stepCount,
				distance_km: distKm,
				calories_burned: cals,
				active_minutes: mins,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}, { onConflict: "user_id,day" });
		} catch {}
	}, [heightCm, weightKg]);
	const listenerHandleRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setSteps(LocalStore.getSteps(todayStr));
	}, [todayStr]);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		async function checkSensorAndPermission() {
			try {
				const avail = await StepCounter$1.isStepSensorAvailable();
				if (!isMounted) return;
				setIsAvailable(avail.available);
				setSensorName(avail.sensorName || (avail.available ? "Hardware Step Counter" : ""));
				if (!avail.available && isNative) setError("Hardware TYPE_STEP_COUNTER sensor is not available on this Android device.");
				const perm = await StepCounter$1.checkPermission();
				if (!isMounted) return;
				setHasPermission(perm.granted);
				const current = await StepCounter$1.getCurrentStepCount();
				if (!isMounted) return;
				if (typeof current.steps === "number") {
					const syncedSteps = Math.max(current.steps, LocalStore.getSteps(todayStr));
					setSteps(syncedSteps);
					LocalStore.saveSteps(todayStr, syncedSteps, {
						weightKg,
						heightCm,
						targetSteps
					});
				}
				setIsTracking(current.isTracking);
				if (autoStart && perm.granted && avail.available && !current.isTracking) try {
					await StepCounter$1.startStepTracking();
					setIsTracking(true);
				} catch (trackErr) {
					console.warn("[useStepCounter] autoStart error:", trackErr);
				}
			} catch (err) {
				console.warn("[useStepCounter] Init error:", err);
				if (isMounted) {
					setIsAvailable(false);
					setHasPermission(false);
				}
			}
		}
		checkSensorAndPermission();
		return () => {
			isMounted = false;
		};
	}, [
		todayStr,
		weightKg,
		heightCm,
		targetSteps,
		autoStart,
		isNative
	]);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		async function subscribeStepUpdates() {
			try {
				if (listenerHandleRef.current) {
					await listenerHandleRef.current.remove();
					listenerHandleRef.current = null;
				}
				const handle = await StepCounter$1.addListener("stepUpdate", (event) => {
					if (!isMounted) return;
					if (typeof event.steps === "number") {
						const sanitized = Math.max(0, Math.round(event.steps));
						setSteps(sanitized);
						setError(null);
						LocalStore.saveSteps(event.date || todayStr, sanitized, {
							weightKg,
							heightCm,
							targetSteps
						});
					}
					if (typeof event.isTracking === "boolean") setIsTracking(event.isTracking);
				});
				if (isMounted) listenerHandleRef.current = handle;
				else await handle.remove();
			} catch (err) {
				console.warn("[useStepCounter] Failed to add stepUpdate listener:", err);
			}
		}
		subscribeStepUpdates();
		return () => {
			isMounted = false;
			if (listenerHandleRef.current) {
				listenerHandleRef.current.remove().catch(() => {});
				listenerHandleRef.current = null;
			}
		};
	}, [
		todayStr,
		weightKg,
		heightCm,
		targetSteps
	]);
	const requestPermission = (0, import_react.useCallback)(async () => {
		try {
			const res = await StepCounter$1.requestPermission();
			setHasPermission(res.granted);
			if (!res.granted) setError("Activity recognition permission was denied.");
			else setError(null);
			return res.granted;
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setError(msg);
			setHasPermission(false);
			return false;
		}
	}, []);
	const startTracking = (0, import_react.useCallback)(async () => {
		try {
			if (hasPermission === false || hasPermission === null) {
				if (!await requestPermission()) return false;
			}
			const res = await StepCounter$1.startStepTracking();
			if (res.success) {
				setIsTracking(true);
				setError(null);
				if (typeof res.steps === "number") {
					setSteps(res.steps);
					LocalStore.saveSteps(todayStr, res.steps, {
						weightKg,
						heightCm,
						targetSteps
					});
				}
				return true;
			}
			return false;
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setError(msg);
			setIsTracking(false);
			return false;
		}
	}, [
		hasPermission,
		requestPermission,
		todayStr,
		weightKg,
		heightCm,
		targetSteps
	]);
	const stopTracking = (0, import_react.useCallback)(async () => {
		try {
			if ((await StepCounter$1.stopStepTracking()).success) {
				setIsTracking(false);
				return true;
			}
			return false;
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setError(msg);
			return false;
		}
	}, []);
	const refreshSteps = (0, import_react.useCallback)(async () => {
		try {
			const res = await StepCounter$1.getCurrentStepCount();
			if (typeof res.steps === "number") {
				const synced = Math.max(res.steps, LocalStore.getSteps(todayStr));
				setSteps(synced);
				LocalStore.saveSteps(todayStr, synced, {
					weightKg,
					heightCm,
					targetSteps
				});
				return synced;
			}
		} catch (err) {
			console.warn("[useStepCounter] refreshSteps error:", err);
		}
		const current = LocalStore.getSteps(todayStr);
		setSteps(current);
		return current;
	}, [
		todayStr,
		weightKg,
		heightCm,
		targetSteps
	]);
	const resetTodaySteps = (0, import_react.useCallback)(async () => {
		try {
			await StepCounter$1.resetTodaySteps();
		} catch {}
		setSteps(0);
		LocalStore.saveSteps(todayStr, 0, {
			weightKg,
			heightCm,
			targetSteps
		});
		syncStepsToSupabase(todayStr, 0);
	}, [
		todayStr,
		weightKg,
		heightCm,
		targetSteps,
		syncStepsToSupabase
	]);
	const updateManualSteps = (0, import_react.useCallback)((newCount) => {
		const sanitized = Math.max(0, Math.round(newCount));
		setSteps(sanitized);
		LocalStore.saveSteps(todayStr, sanitized, {
			weightKg,
			heightCm,
			targetSteps
		});
		syncStepsToSupabase(todayStr, sanitized);
	}, [
		todayStr,
		weightKg,
		heightCm,
		targetSteps,
		syncStepsToSupabase
	]);
	const strideMeters = (heightCm || 175) * .414 / 100;
	const distanceKm = (steps * strideMeters / 1e3).toFixed(2);
	const caloriesBurned = (steps * (weightKg || 70) * 6125e-7).toFixed(1);
	const activeMins = Math.round(steps / 100);
	const remainingSteps = Math.max(0, targetSteps - steps);
	return {
		steps,
		isTracking,
		isAvailable,
		sensorName,
		hasPermission,
		error,
		isNative,
		todayStr,
		strideMeters,
		distanceKm,
		caloriesBurned,
		activeMins,
		progressPct: Math.min(100, Math.round(steps / Math.max(1, targetSteps) * 100)),
		remainingSteps,
		startTracking,
		stopTracking,
		requestPermission,
		refreshSteps,
		resetTodaySteps,
		updateManualSteps
	};
}
function calculateAIStepGoal(goal, fitnessGoals = [], currentWeight = 70, goalWeight = 70, activity) {
	const g = (goal || "").toLowerCase().replace(/_/g, " ");
	const fgList = fitnessGoals.map((item) => item.toLowerCase());
	const hasFatLoss = g.includes("fat loss") || g.includes("weight loss") || g.includes("cut") || g.includes("loss") || fgList.some((f) => f.includes("lose weight") || f.includes("fat loss"));
	const hasMuscleGain = !hasFatLoss && (g.includes("bulk") || g.includes("muscle") || g.includes("gain") || fgList.some((f) => f.includes("gain weight") || f.includes("gain muscle")));
	const hasRecomp = !hasFatLoss && !hasMuscleGain && (g.includes("recomp") || fgList.some((f) => f.includes("recomposition")));
	const hasStamina = !hasFatLoss && !hasMuscleGain && !hasRecomp && fgList.some((f) => f.includes("stamina") || f.includes("heart") || f.includes("diabetes"));
	if (hasFatLoss) {
		const target = currentWeight >= 85 ? 12500 : 11e3;
		return {
			target,
			goalLabel: "Fat Loss / Calorie Deficit",
			strategy: "Fat Loss & Calorie Deficit 🔥",
			reason: `Target set to ${target.toLocaleString()} steps/day. High daily NEAT creates a strong caloric deficit while protecting lean muscle mass.`,
			badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
		};
	} else if (hasMuscleGain) {
		const target = 6500;
		return {
			target,
			goalLabel: "Muscle & Weight Gain",
			strategy: "Muscle & Mass Building 🏋️",
			reason: `Target set to ${target.toLocaleString()} steps/day. Moderate walking conserves energy surplus for weight lifting & muscle growth.`,
			badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
		};
	} else if (hasRecomp) {
		const target = 9e3;
		return {
			target,
			goalLabel: "Body Recomposition",
			strategy: "Body Recomposition ⚖️",
			reason: `Target set to ${target.toLocaleString()} steps/day. Balances fat oxidation with muscle retention.`,
			badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20"
		};
	} else if (hasStamina) {
		const target = 1e4;
		return {
			target,
			goalLabel: "Improve Stamina & Health",
			strategy: "Cardiovascular Endurance 🫀",
			reason: `Target set to ${target.toLocaleString()} steps/day. Optimizes VO2 max, glucose control, and stamina.`,
			badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
		};
	} else {
		const target = 8e3;
		return {
			target,
			goalLabel: "Maintain Weight & Wellness",
			strategy: "Weight Maintenance & Wellness 🌿",
			reason: `Target set to ${target.toLocaleString()} steps/day for active metabolism, stamina, and health stability.`,
			badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
		};
	}
}
function StepCounter({ todayStr, weightKg = 70, heightCm = 175, goalWeightKg = 70, userGoal = "fat_loss", fitnessGoals = [], activityLevel = "moderate", customTargetSteps }) {
	const [showEditInput, setShowEditInput] = (0, import_react.useState)(false);
	const [customInput, setCustomInput] = (0, import_react.useState)("");
	const [overrideTarget, setOverrideTarget] = (0, import_react.useState)(customTargetSteps || null);
	const [showTechnicalDetails, setShowTechnicalDetails] = (0, import_react.useState)(false);
	const [isSyncingHC, setIsSyncingHC] = (0, import_react.useState)(false);
	const aiPrediction = calculateAIStepGoal(userGoal, fitnessGoals, weightKg, goalWeightKg, activityLevel);
	const targetSteps = overrideTarget && overrideTarget > 0 ? overrideTarget : aiPrediction.target;
	const { steps, isTracking, isAvailable, sensorName, hasPermission, error, isNative, strideMeters, distanceKm, caloriesBurned, activeMins, progressPct, remainingSteps, startTracking, stopTracking, requestPermission, refreshSteps, updateManualSteps } = useStepCounter({
		todayStr,
		weightKg,
		heightCm,
		targetSteps,
		autoStart: true
	});
	const [showSensorAlertModal, setShowSensorAlertModal] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem("nutrilens_sensor_alert_dismissed") !== "true";
	});
	const handleRequestPermission = async () => {
		if (await requestPermission()) {
			toast.success("Activity Recognition permission granted! Real-time step counter active.");
			await startTracking();
			setShowSensorAlertModal(false);
			localStorage.setItem("nutrilens_sensor_alert_dismissed", "true");
		} else toast.error("Permission was not granted. Please enable Physical Activity in App Settings.");
	};
	const handleToggleTracking = async () => {
		if (isTracking) {
			if (await stopTracking()) toast.info("Step tracking paused.");
		} else if (await startTracking()) toast.success("Step tracking started!");
		else if (error) toast.error(error);
	};
	const handleManualSave = () => {
		const val = parseInt(customInput, 10);
		if (!isNaN(val) && val >= 0) {
			setOverrideTarget(val);
			toast.success(`Daily target steps updated to ${val.toLocaleString()}`);
			setShowEditInput(false);
		} else toast.error("Please enter a valid step count");
	};
	const handleAddTestSteps = () => {
		updateManualSteps(steps + 100);
		toast.success("Added 100 steps for verification!");
	};
	const getSourceDisplayLabel = () => {
		if (isNative) {
			if (hasPermission === false) return {
				userLabel: "Activity Permission Required",
				badgeText: "Permission Needed",
				badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
				techDetails: `Android Native · ${sensorName || "TYPE_STEP_COUNTER"} (Permission Needed)`,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-500" })
			};
			if (isAvailable === false) return {
				userLabel: "Hardware Sensor Unavailable",
				badgeText: "Sensor Unavailable",
				badgeColor: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
				techDetails: "Device lacks hardware TYPE_STEP_COUNTER sensor",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-rose-500" })
			};
			return {
				userLabel: isTracking ? "Android Native Hardware Step Sensor Active" : "Hardware Step Sensor Paused",
				badgeText: isTracking ? "Sensor Active" : "Sensor Paused",
				badgeColor: isTracking ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" : "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
				techDetails: `Android SensorManager: ${sensorName || "Sensor.TYPE_STEP_COUNTER"} · Foreground Service`,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-500" })
			};
		} else return {
			userLabel: "Step tracking is active in the Android app",
			badgeText: "Web Preview",
			badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
			techDetails: "Web Preview Mode · Native Android TYPE_STEP_COUNTER is used when installed on Android",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-500" })
		};
	};
	const statusInfo = getSourceDisplayLabel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-extrabold text-foreground tracking-tight truncate",
								children: "Activity & Step Tracker"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowTechnicalDetails(!showTechnicalDetails),
								className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${statusInfo.badgeColor} transition hover:scale-105 active:scale-95 shrink-0`,
								title: "Click to view step tracking diagnostic details",
								children: [statusInfo.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: statusInfo.badgeText })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5 font-medium truncate",
							children: statusInfo.userLabel
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0 flex-wrap",
					children: [
						isNative && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleToggleTracking,
							className: `inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${isTracking ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"}`,
							title: isTracking ? "Pause background step sensor" : "Start live step sensor",
							children: [isTracking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isTracking ? "Pause Sensor" : "Start Sensor" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleAddTestSteps,
							className: "inline-flex items-center gap-1.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition active:scale-95",
							title: "Simulate 100 steps for verification",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+100 Test" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setCustomInput(String(targetSteps));
								setShowEditInput(!showEditInput);
							},
							className: "rounded-2xl border border-border bg-card/80 px-3.5 py-1.5 text-xs font-bold text-foreground hover:border-emerald-500/40 transition shadow-sm active:scale-95",
							children: showEditInput ? "Cancel" : "Custom Goal"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showSensorAlertModal && isNative && hasPermission === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						scale: .9,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					exit: {
						scale: .9,
						opacity: 0
					},
					className: "relative w-full max-w-md rounded-3xl border border-emerald-500/30 bg-card p-6 shadow-2xl space-y-5 text-card-foreground overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-500 border border-emerald-500/30 shadow-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-6 w-6 animate-pulse" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-extrabold text-foreground tracking-tight",
									children: "Turn On Step Tracker"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground font-medium",
									children: "Physical Activity Sensor Permission"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowSensorAlertModal(false),
								className: "rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: "NutriLens AI uses your Android device's hardware step sensor to record real footsteps accurately in the background without battery drain."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleRequestPermission,
								className: "w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3 text-xs font-black text-slate-950 shadow-lg hover:brightness-110 active:scale-95 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Allow Physical Activity Permission" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowSensorAlertModal(false),
								className: "w-full rounded-2xl border border-border bg-card py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted transition text-center",
								children: "Maybe Later"
							})]
						})
					]
				})
			}) }),
			showTechnicalDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-muted/40 p-3.5 text-xs space-y-2 animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between font-bold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 text-emerald-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4" }), " System Step Tracking Diagnostics"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground",
						children: isNative ? "Android Native Sensor" : "Web Preview Mode"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground font-mono text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground",
								children: "Active Driver:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: statusInfo.techDetails
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground",
								children: "Stride Math:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								(strideMeters * 100).toFixed(1),
								" cm / step (",
								heightCm,
								"cm height)"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground",
								children: "Status:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isTracking ? "Tracking Live" : "Standby" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground",
								children: "MET Formula:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								(weightKg * 6125e-7).toFixed(4),
								" kcal/step (",
								weightKg,
								"kg)"
							] })]
						})
					]
				})]
			}),
			showEditInput && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-2xl bg-muted/30 p-3 border border-border animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					value: customInput,
					onChange: (e) => setCustomInput(e.target.value),
					placeholder: "Set custom daily step goal",
					className: "input text-sm py-1.5",
					min: "1000"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleManualSave,
					className: "rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow",
					children: "Save Target"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 lg:col-span-2 rounded-[22px] bg-gradient-to-br from-emerald-500/15 via-emerald-950/20 to-transparent border border-emerald-500/30 p-4 sm:p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-bold text-emerald-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "uppercase tracking-widest flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "h-4 w-4" }), " TODAY'S STEPS"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-emerald-500/15 px-2.5 py-0.5 border border-emerald-500/30",
									children: [progressPct, "% Goal"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "my-3 flex items-center justify-between gap-4 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display text-3xl sm:text-4xl font-black text-foreground tabular-nums tracking-tight truncate",
											children: steps.toLocaleString()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground mt-1 font-medium truncate",
											children: [
												"Goal: ",
												targetSteps.toLocaleString(),
												" steps (",
												aiPrediction.goalLabel,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-emerald-500 font-semibold mt-1",
											children: remainingSteps > 0 ? `${remainingSteps.toLocaleString()} steps remaining` : "🎉 Target Achieved!"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative grid h-16 w-16 place-items-center shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										className: "h-full w-full -rotate-90 transform",
										viewBox: "0 0 36 36",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											className: "text-emerald-950/50",
											strokeWidth: "3.5",
											stroke: "currentColor",
											fill: "none",
											d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											className: "text-emerald-500 transition-all duration-700 ease-out",
											strokeDasharray: `${progressPct}, 100`,
											strokeWidth: "3.5",
											strokeLinecap: "round",
											stroke: "currentColor",
											fill: "none",
											d: "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "absolute font-display text-xs font-black text-foreground",
										children: [progressPct, "%"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2.5 w-full rounded-full bg-emerald-950/40 border border-emerald-500/20 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_#34D399] transition-all duration-700",
									style: { width: `${progressPct}%` }
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-1 lg:col-span-1 rounded-[22px] border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-orange-950/20 to-transparent p-4 flex flex-col justify-between shadow-md hover:border-amber-500/50 transition min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-extrabold uppercase text-amber-500 dark:text-amber-400 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-amber-500 animate-pulse shrink-0" }), " CALORIES BURNED"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "my-2 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 tabular-nums truncate",
									children: caloriesBurned
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] font-semibold text-muted-foreground mt-0.5 truncate",
									children: [
										"kcal (",
										weightKg,
										"kg weight)"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-amber-500/80 font-medium truncate",
								children: [
									"Accurate MET scale (~",
									(weightKg * 6125e-7).toFixed(3),
									" kcal/step)"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-1 lg:col-span-1 rounded-[22px] border border-blue-500/30 bg-gradient-to-br from-blue-500/15 via-indigo-950/20 to-transparent p-4 flex flex-col justify-between shadow-md hover:border-blue-500/50 transition min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between text-xs font-extrabold uppercase text-blue-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-4 w-4 text-blue-400 shrink-0" }), " DISTANCE & TIME"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "my-2 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-display text-2xl font-black text-foreground tabular-nums truncate",
									children: [
										distanceKm,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-muted-foreground",
											children: "km"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-blue-400 font-semibold flex items-center gap-1 mt-1 truncate",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 shrink-0" }),
										" ",
										activeMins,
										" mins active"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground font-medium truncate",
								children: [
									"Stride length ~",
									(strideMeters * 100).toFixed(1),
									"cm (",
									heightCm,
									"cm)"
								]
							})
						]
					})
				]
			})
		]
	});
}
function MacroRing({ label, value, target, unit = "g", color, icon }) {
	const pct = Math.min(1, target > 0 ? value / target : 0);
	const pctDisplay = Math.min(100, Math.round(pct * 100));
	const r = 28;
	const c = 2 * Math.PI * r;
	const dash = c * pct;
	const [displayVal, setDisplayVal] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let animationFrameId;
		let startTimestamp = null;
		const duration = 800;
		const endVal = Math.round(value);
		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			const easedProgress = 1 - Math.pow(1 - progress, 3);
			setDisplayVal(Math.round(endVal * easedProgress));
			if (progress < 1) animationFrameId = requestAnimationFrame(step);
		};
		animationFrameId = requestAnimationFrame(step);
		return () => cancelAnimationFrame(animationFrameId);
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 20,
			scale: .97
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		transition: { duration: .35 },
		whileHover: {
			y: -4,
			scale: 1.02
		},
		className: "group relative flex flex-col items-center justify-between gap-3 rounded-[22px] border border-border/80 bg-card text-card-foreground shadow-sm backdrop-blur-2xl transition-all duration-300 hover:border-border dark:border-white/10 dark:bg-[#0C1722]/80 dark:text-white dark:hover:bg-[#0F2130] dark:hover:border-[#38BDF8]/30 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-3 sm:p-4 active:scale-[0.98] min-w-0 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full items-center justify-between gap-1 border-b border-border/50 dark:border-white/5 pb-2.5 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 font-display text-xs font-bold text-foreground dark:text-white min-w-0",
					children: [icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "drop-shadow-sm dark:drop-shadow-[0_0_8px_currentColor] transition-transform duration-300 group-hover:scale-110 shrink-0",
						style: { color },
						children: icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: label
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black tabular-nums border border-border/40 dark:border-white/5",
					style: {
						backgroundColor: `${color}18`,
						color
					},
					children: [pctDisplay, "%"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative my-1 flex items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					width: "78",
					height: "78",
					viewBox: "0 0 78 78",
					className: "drop-shadow-sm dark:drop-shadow-[0_0_12px_rgba(56,189,248,0.2)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "39",
						cy: "39",
						r,
						fill: "none",
						className: "stroke-muted dark:stroke-white/10",
						strokeWidth: "7"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "39",
						cy: "39",
						r,
						fill: "none",
						stroke: color,
						strokeWidth: "7",
						strokeLinecap: "round",
						strokeDasharray: `${dash} ${c}`,
						transform: "rotate(-90 39 39)",
						style: { transition: "stroke-dasharray 900ms cubic-bezier(.16,1,.3,1)" }
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display text-base font-black tracking-tight text-foreground dark:text-white tabular-nums",
						children: [displayVal, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-medium text-muted-foreground dark:text-slate-400 ml-0.5",
							children: unit
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full text-center text-[10px] font-bold text-muted-foreground dark:text-slate-400",
				children: [
					"Target: ",
					target,
					unit
				]
			})
		]
	});
}
/**
* Triggers a grand congratulatory confetti celebration with metallic shiny colors and ribbon strips.
*/
function fireCongratulationsConfetti() {
	if (typeof window === "undefined") return;
	const count = 200;
	const defaults = {
		origin: { y: .7 },
		colors: [
			"#FFD700",
			"#FF69B4",
			"#00E5FF",
			"#76FF03",
			"#FF3D00",
			"#E040FB",
			"#FFFFFF"
		]
	};
	function fire(particleRatio, opts) {
		confetti_module_default({
			...defaults,
			...opts,
			particleCount: Math.floor(count * particleRatio)
		});
	}
	fire(.25, {
		spread: 26,
		startVelocity: 55,
		scalar: 1.2
	});
	fire(.2, {
		spread: 60,
		startVelocity: 45,
		scalar: 1
	});
	fire(.35, {
		spread: 100,
		decay: .91,
		scalar: .9
	});
	fire(.1, {
		spread: 120,
		startVelocity: 25,
		decay: .92,
		scalar: 1.1
	});
	fire(.1, {
		spread: 120,
		startVelocity: 45,
		scalar: 1.3
	});
	setTimeout(() => {
		confetti_module_default({
			particleCount: 80,
			angle: 60,
			spread: 70,
			origin: {
				x: 0,
				y: .8
			},
			colors: defaults.colors
		});
		confetti_module_default({
			particleCount: 80,
			angle: 120,
			spread: 70,
			origin: {
				x: 1,
				y: .8
			},
			colors: defaults.colors
		});
	}, 200);
}
function CustomWaterModal({ isOpen, onClose, currentGlasses, waterTargetGlasses, todayStr, onUpdate }) {
	const addWaterFn = useServerFn(addWater);
	const updateProfileFn = useServerFn(updateProfile);
	const initialTargetL = (waterTargetGlasses * .25).toFixed(1);
	const [targetLitersStr, setTargetLitersStr] = (0, import_react.useState)(initialTargetL);
	const [addLitersStr, setAddLitersStr] = (0, import_react.useState)("0.5");
	const [isSavingTarget, setIsSavingTarget] = (0, import_react.useState)(false);
	const [isLoggingWater, setIsLoggingWater] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isOpen) setTargetLitersStr((waterTargetGlasses * .25).toFixed(1));
	}, [isOpen, waterTargetGlasses]);
	if (!isOpen) return null;
	const parsedTargetL = parseFloat(targetLitersStr) || 0;
	const calcTargetGlasses = Math.round(parsedTargetL * 1e3 / 250);
	const parsedAddL = parseFloat(addLitersStr) || 0;
	const calcAddGlasses = Math.round(parsedAddL * 1e3 / 250 * 10) / 10;
	const currentLitersNum = currentGlasses * .25;
	const currentLiters = currentLitersNum.toFixed(1);
	const targetLitersNum = waterTargetGlasses * .25;
	const progressPercent = targetLitersNum > 0 ? Math.min(100, Math.round(currentLitersNum / targetLitersNum * 100)) : 0;
	const handleSaveGoal = async (e) => {
		e.preventDefault();
		if (parsedTargetL < .5 || parsedTargetL > 10) {
			toast.error("Please enter a realistic goal between 0.5L and 10L");
			return;
		}
		setIsSavingTarget(true);
		const newGlasses = Math.max(2, Math.round(parsedTargetL * 1e3 / 250));
		try {
			const p = LocalStore.getProfile();
			if (p) LocalStore.saveProfile({
				...p,
				water_target_glasses: newGlasses,
				water_goal_l: parsedTargetL
			});
			await updateProfileFn({ data: {
				water_goal_l: parsedTargetL,
				water_target_glasses: newGlasses
			} });
			toast.success(`Daily Goal updated to ${parsedTargetL} Liters (${newGlasses} glasses)!`);
			onUpdate();
			onClose();
		} catch {
			toast.success(`Daily Goal updated to ${parsedTargetL} Liters!`);
			onUpdate();
			onClose();
		} finally {
			setIsSavingTarget(false);
		}
	};
	const handleLogIntake = async (e) => {
		e.preventDefault();
		if (parsedAddL <= 0) {
			toast.error("Please enter a valid amount in Liters");
			return;
		}
		setIsLoggingWater(true);
		try {
			LocalStore.addWater(calcAddGlasses, todayStr);
			toast.success(`Logged ${parsedAddL}L (+${calcAddGlasses} glasses)`);
			try {
				await addWaterFn({ data: {
					glasses: calcAddGlasses,
					day: todayStr
				} });
			} catch {}
			onUpdate();
			onClose();
		} catch {
			toast.error("Failed to log water");
		} finally {
			setIsLoggingWater(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-[92vw] max-w-md md:max-w-lg lg:max-w-xl my-auto rounded-[24px] sm:rounded-[28px] md:rounded-[32px] border border-cyan-500/30 bg-[#0A1612] p-4 sm:p-6 md:p-7 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-foreground space-y-4 sm:space-y-5 md:space-y-6 max-h-[90vh] overflow-y-auto scrollbar-none min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-44 w-44 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-cyan-500/20 pb-3 sm:pb-4 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, { className: "h-5 w-5 sm:h-6 sm:w-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-base sm:text-lg md:text-xl font-extrabold text-white truncate",
								children: "Custom Water Intake"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs md:text-sm text-cyan-300/80 truncate",
								children: [
									"Today: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-bold text-white",
										children: [currentLiters, "L"]
									}),
									" (",
									currentGlasses,
									" glasses)"
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						"aria-label": "Close custom water intake",
						className: "grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-white transition shrink-0 cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 sm:h-5 sm:w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-3 sm:p-4 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs md:text-sm font-extrabold text-cyan-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hydration Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-cyan-400",
							children: [progressPercent, "% of Goal"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2.5 sm:h-3 w-full rounded-full bg-black/60 overflow-hidden border border-cyan-500/20 p-0.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]",
							style: { width: `${progressPercent}%` }
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveGoal,
						className: "rounded-2xl border border-cyan-500/20 bg-cyan-950/30 p-3.5 sm:p-4 md:p-5 space-y-3 flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-[11px] sm:text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-cyan-400 shrink-0" }), " Daily Goal"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 shrink-0",
										children: "Auto-Calculated"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: "0.1",
										min: "0.5",
										max: "10",
										value: targetLitersStr,
										onChange: (e) => setTargetLitersStr(e.target.value),
										placeholder: "e.g. 3.0",
										className: "w-full rounded-xl border border-cyan-500/30 bg-black/50 px-3.5 sm:px-4 py-2 sm:py-2.5 text-base sm:text-lg font-black text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition pr-16"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-3.5 sm:right-4 top-2.5 sm:top-3 text-xs font-black text-cyan-400 uppercase pointer-events-none",
										children: "Liters"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5 pt-0.5",
									children: [
										"1.5",
										"2.0",
										"2.5",
										"3.0"
									].map((val) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setTargetLitersStr(val),
										className: `px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer border ${targetLitersStr === val ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20"}`,
										children: [val, "L"]
									}, val))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-2.5 flex items-center justify-between gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-cyan-200/80 font-medium shrink-0",
										children: "Glasses:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-extrabold text-white text-xs sm:text-sm text-right",
										children: [
											"✨ ",
											calcTargetGlasses,
											" Glasses",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-cyan-300 font-normal whitespace-nowrap",
												children: "(250ml each)"
											})
										]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: isSavingTarget,
							className: "mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 text-xs font-black text-[#071018] hover:bg-cyan-400 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 stroke-[3]" }),
								" Save Goal (",
								targetLitersStr || 0,
								"L)"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleLogIntake,
						className: "rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:p-4 md:p-5 space-y-3 flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 text-cyan-400 shrink-0" }), " Log Water Drank"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: "0.1",
										min: "0.1",
										max: "5",
										value: addLitersStr,
										onChange: (e) => setAddLitersStr(e.target.value),
										placeholder: "e.g. 0.5",
										className: "w-full rounded-xl border border-white/10 bg-black/50 px-3.5 sm:px-4 py-2 sm:py-2.5 text-base sm:text-lg font-black text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition pr-16"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-3.5 sm:right-4 top-2.5 sm:top-3 text-xs font-black text-cyan-400 uppercase pointer-events-none",
										children: "Liters"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5 pt-0.5",
									children: [
										{
											label: "+0.25L",
											val: "0.25"
										},
										{
											label: "+0.5L",
											val: "0.5"
										},
										{
											label: "+0.75L",
											val: "0.75"
										},
										{
											label: "+1.0L",
											val: "1.0"
										}
									].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setAddLitersStr(item.val),
										className: `px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer border ${addLitersStr === item.val ? "bg-cyan-400 text-slate-950 border-cyan-300" : "bg-white/10 text-slate-200 border-white/10 hover:bg-white/20"}`,
										children: item.label
									}, item.val))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-white/5 border border-white/10 p-2.5 flex items-center justify-between gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground font-medium shrink-0",
										children: "Glasses:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-extrabold text-white text-xs sm:text-sm text-right",
										children: [
											"+",
											calcAddGlasses,
											" Glasses",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-muted-foreground font-normal whitespace-nowrap",
												children: [
													"(",
													parsedAddL * 1e3,
													" ml)"
												]
											})
										]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: isLoggingWater,
							className: "mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 py-2.5 text-xs font-black text-[#071018] hover:brightness-110 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 stroke-[3]" }),
								" Log +",
								addLitersStr || 0,
								" Liters"
							]
						})]
					})]
				})
			]
		})
	});
}
function NotificationCenterModal({ isOpen, onClose }) {
	const [prefs, setPrefs] = (0, import_react.useState)(getNotificationPreferences);
	const [history, setHistory] = (0, import_react.useState)(getNotificationHistory);
	const [permissionStatus, setPermissionStatus] = (0, import_react.useState)(getBrowserNotificationPermission);
	const [activeTab, setActiveTab] = (0, import_react.useState)("inbox");
	const refreshData = () => {
		setPrefs(getNotificationPreferences());
		setHistory(getNotificationHistory());
		setPermissionStatus(getBrowserNotificationPermission());
	};
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		refreshData();
		const handleUpdate = () => refreshData();
		window.addEventListener("nutrilens-notification-received", handleUpdate);
		window.addEventListener("nutrilens-notifications-updated", handleUpdate);
		window.addEventListener("nutrilens-notifications-prefs-changed", handleUpdate);
		return () => {
			window.removeEventListener("nutrilens-notification-received", handleUpdate);
			window.removeEventListener("nutrilens-notifications-updated", handleUpdate);
			window.removeEventListener("nutrilens-notifications-prefs-changed", handleUpdate);
		};
	}, [isOpen]);
	if (!isOpen) return null;
	const handleRequestPermission = async () => {
		const granted = await requestNutriLensNotificationPermission();
		refreshData();
		if (granted) toast.success("System notifications enabled successfully!");
		else toast.info("In-app notifications are active.");
	};
	const handleTogglePref = (key, value) => {
		const updated = saveNotificationPreferences({ [key]: value });
		setPrefs(updated);
		toast.success("Notification settings updated");
	};
	const handleTestNotif = (type) => {
		triggerTestNotification(type);
	};
	const unreadCount = history.filter((h) => !h.read).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md bg-[#0F1722] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 border-b border-white/10 flex items-center justify-between bg-[#131E2D]/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-base font-black tracking-tight text-white flex items-center gap-2",
							children: ["NutriLens Notifications", unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-500 text-slate-950",
								children: [unreadCount, " new"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: "Real-time alerts, meals & streak reminders"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 p-2 bg-[#0B111A] border-b border-white/5 gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("inbox"),
						className: `py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${activeTab === "inbox" ? "bg-[#1E293B] text-white shadow" : "text-slate-400 hover:text-white"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-3.5 w-3.5" }),
							"Inbox (",
							history.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab("settings"),
						className: `py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${activeTab === "settings" ? "bg-[#1E293B] text-white shadow" : "text-slate-400 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), "Schedules & Channels"]
					})]
				}),
				permissionStatus !== "granted" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3.5 bg-gradient-to-r from-sky-950/50 to-blue-950/50 border-b border-sky-500/20 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-sky-300 block",
							children: "Enable Device Notifications"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-slate-300",
							children: "Receive lock screen alerts for your daily meal & water targets"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleRequestPermission,
						className: "shrink-0 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition",
						children: "Allow"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 overflow-y-auto flex-1 space-y-4",
					children: [activeTab === "inbox" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-400",
									children: "Test Notification Engine"
								}), history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: markAllNotificationsAsRead,
										className: "text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3 w-3" }), " Mark all read"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: clearAllNotifications,
										className: "text-[11px] font-bold text-rose-400 hover:underline flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), " Clear"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 pb-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleTestNotif("meal"),
										className: "px-3 py-1.5 rounded-xl bg-[#172535] hover:bg-[#1E334A] border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-3.5 w-3.5" }), " Test Meal Alert"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleTestNotif("hydration"),
										className: "px-3 py-1.5 rounded-xl bg-[#132A38] hover:bg-[#1A3B4F] border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, { className: "h-3.5 w-3.5" }), " Test Water Alert"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleTestNotif("streak"),
										className: "px-3 py-1.5 rounded-xl bg-[#321C16] hover:bg-[#47261E] border border-orange-500/30 text-orange-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3.5 w-3.5" }), " Test Streak Alert"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => handleTestNotif("ai"),
										className: "px-3 py-1.5 rounded-xl bg-[#261738] hover:bg-[#392154] border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Test AI Coach"]
									})
								]
							}),
							history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-12 text-center space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-12 w-12 rounded-full bg-[#182332] text-slate-500 grid place-items-center mx-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-6 w-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-slate-300",
										children: "No notifications yet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500 max-w-xs mx-auto",
										children: "Tap any of the test buttons above to see how real NutriLens alerts look and chime."
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2.5",
								children: history.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									onClick: () => markNotificationAsRead(item.id),
									className: `p-3.5 rounded-2xl border transition cursor-pointer ${!item.read ? "bg-[#182536] border-sky-500/40 shadow-sm" : "bg-[#111A24] border-white/5 opacity-80"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [!item.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-sky-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-bold text-white",
													children: item.title
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-300 leading-relaxed",
												children: item.body
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-slate-500 shrink-0",
											children: new Date(item.timestamp).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit"
											})
										})]
									})
								}, item.id))
							})
						]
					}), activeTab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-[#141F2D] border border-white/10 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-black text-white",
									children: "Enable Notifications"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-slate-400",
									children: "Master switch for all NutriLens alerts"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: prefs.enabled,
									onChange: (e) => handleTogglePref("enabled", e.target.checked),
									className: "h-5 w-5 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-0 cursor-pointer accent-sky-500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-[#141F2D] border border-white/10 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [prefs.soundEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4 text-sky-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-white",
										children: "Audio Chime"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-slate-400",
										children: "Play tone when receiving notifications"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: prefs.soundEnabled,
									onChange: (e) => handleTogglePref("soundEnabled", e.target.checked),
									className: "h-5 w-5 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-0 cursor-pointer accent-sky-500"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-slate-400 uppercase tracking-wider block px-1",
									children: "Active Channels"
								}), [
									{
										key: "mealReminders",
										title: "Meal Logging Reminders",
										desc: "Breakfast (8:30am), Lunch (1:00pm), Dinner (7:30pm)",
										icon: Utensils,
										color: "text-amber-400"
									},
									{
										key: "waterAlerts",
										title: "Hydration Reminders",
										desc: "Gentle reminders to drink 250ml water every 2 hours",
										icon: Droplet,
										color: "text-cyan-400"
									},
									{
										key: "streakReminders",
										title: "Streak Safeguard Alert",
										desc: "Notifies you at 8:30pm if your daily calorie goal is incomplete",
										icon: Flame,
										color: "text-orange-400"
									},
									{
										key: "coachTips",
										title: "AI Nutritionist Insights",
										desc: "Personalized micro/macro balance suggestions and tips",
										icon: Sparkles,
										color: "text-purple-400"
									}
								].map((channel) => {
									const Icon = channel.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-2xl bg-[#111A24] border border-white/5 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `p-2 rounded-xl bg-white/5 ${channel.color}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-bold text-white",
												children: channel.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-slate-400",
												children: channel.desc
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: Boolean(prefs[channel.key]),
											onChange: (e) => handleTogglePref(channel.key, e.target.checked),
											className: "h-5 w-5 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-0 cursor-pointer accent-sky-500"
										})]
									}, channel.key);
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-white/10 bg-[#131E2D]/50 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-slate-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-400" }), "NutriLens Notification Service Active"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition",
						children: "Done"
					})]
				})
			]
		})
	});
}
function HomePage() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const getTodayFn = useServerFn(getToday);
	const getProfileFn = useServerFn(getProfile);
	const addWaterFn = useServerFn(addWater);
	const [extraWater, setExtraWater] = (0, import_react.useState)(0);
	const [isWaterModalOpen, setIsWaterModalOpen] = (0, import_react.useState)(false);
	const [isNotifModalOpen, setIsNotifModalOpen] = (0, import_react.useState)(false);
	const [unreadNotifs, setUnreadNotifs] = (0, import_react.useState)(() => {
		return getNotificationHistory().filter((n) => !n.read).length;
	});
	(0, import_react.useEffect)(() => {
		const updateUnread = () => {
			const hist = getNotificationHistory();
			setUnreadNotifs(hist.filter((n) => !n.read).length);
		};
		window.addEventListener("nutrilens-notification-received", updateUnread);
		window.addEventListener("nutrilens-notifications-updated", updateUnread);
		return () => {
			window.removeEventListener("nutrilens-notification-received", updateUnread);
			window.removeEventListener("nutrilens-notifications-updated", updateUnread);
		};
	}, []);
	const profileQ = useQuery({
		queryKey: ["profile"],
		queryFn: () => getProfileFn({ data: void 0 })
	});
	const todayQ = useQuery({
		queryKey: ["today"],
		queryFn: () => getTodayFn({ data: void 0 })
	});
	(0, import_react.useEffect)(() => {
		if (profileQ.data && profileQ.data.profile && !profileQ.data.profile.onboarded) {
			if (!LocalStore.getProfile()?.onboarded) navigate({
				to: "/onboarding",
				replace: true
			});
		}
	}, [profileQ.data, navigate]);
	const getLocalDateStr = () => getLocalDateString();
	const [todayStr, setTodayStr] = (0, import_react.useState)(getLocalDateStr);
	const [localVersion, setLocalVersion] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const handleDataChange = () => {
			setLocalVersion((v) => v + 1);
		};
		window.addEventListener("nutrilens-data-changed", handleDataChange);
		return () => window.removeEventListener("nutrilens-data-changed", handleDataChange);
	}, []);
	(0, import_react.useEffect)(() => {
		const checkMidnight = () => {
			const nowStr = getLocalDateStr();
			if (nowStr !== todayStr) {
				setTodayStr(nowStr);
				setExtraWater(0);
				qc.invalidateQueries({ queryKey: ["today"] });
				qc.invalidateQueries({ queryKey: ["profile"] });
				toast.info("🌅 A new day has started! Your daily dashboard and targets have been refreshed.", { duration: 5e3 });
			}
		};
		const timer = setInterval(checkMidnight, 5e3);
		const handleFocus = () => checkMidnight();
		window.addEventListener("focus", handleFocus);
		document.addEventListener("visibilitychange", handleFocus);
		return () => {
			clearInterval(timer);
			window.removeEventListener("focus", handleFocus);
			document.removeEventListener("visibilitychange", handleFocus);
		};
	}, [todayStr, qc]);
	const water = useMutation({
		mutationFn: async () => {
			const newTotal = LocalStore.addWater(todayStr, 1);
			setExtraWater(newTotal);
			try {
				await addWaterFn({ data: { glasses: 1 } });
			} catch {}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["today"] });
			toast.success("+1 glass logged");
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
	});
	const localMeals = typeof window !== "undefined" ? LocalStore.getMeals(todayStr) : [];
	const localWater = typeof window !== "undefined" ? LocalStore.getWater(todayStr) : 0;
	const localProfile = typeof window !== "undefined" ? LocalStore.getProfile() : null;
	const serverMeals = todayQ.data?.meals ?? [];
	const serverMealIds = new Set(serverMeals.map((m) => m.id));
	const combinedMeals = [...serverMeals, ...localMeals.filter((m) => !serverMealIds.has(m.id))];
	const profile = profileQ.data?.profile || localProfile || {
		display_name: "Gaurav",
		gender: "other",
		age: 25,
		height_cm: 175,
		weight_kg: 70,
		goal_weight_kg: 70,
		activity: "moderate",
		goal: "maintenance",
		diet: "non_veg",
		daily_calorie_target: 2e3,
		protein_target_g: 120,
		water_target_glasses: 8,
		water_goal_l: 2.5,
		onboarded: true,
		extended_data: {}
	};
	const rollup = todayQ.data?.rollup;
	const calTarget = Number(profile?.daily_calorie_target ?? 2e3);
	const protTarget = Number(profile?.protein_target_g ?? 120);
	const waterTarget = Number(profile?.water_target_glasses ?? 8);
	const caloriesFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.calories || 0), 0);
	const proteinFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.protein_g || 0), 0);
	const carbsFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.carbs_g || 0), 0);
	const fatFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.fat_g || 0), 0);
	const fiberFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.fiber_g || 0), 0);
	const sugarFromMeals = combinedMeals.reduce((sum, m) => sum + Number(m.sugar_g || 0), 0);
	const calories = Math.max(Number(rollup?.calories || 0), caloriesFromMeals);
	const protein = Math.max(Number(rollup?.protein_g || 0), proteinFromMeals);
	const carbs = Math.max(Number(rollup?.carbs_g || 0), carbsFromMeals);
	const fat = Math.max(Number(rollup?.fat_g || 0), fatFromMeals);
	const fiber = Math.max(Number(rollup?.fiber_g || 0), fiberFromMeals);
	const sugar = Math.max(Number(rollup?.sugar_g || 0), sugarFromMeals);
	const waterGlasses = Math.max(Number(rollup?.water_glasses ?? 0), localWater, extraWater);
	const microStats = Object.keys(RDA).map((k) => {
		const serverVal = Number(rollup?.[k] ?? 0);
		const mealVal = combinedMeals.reduce((sum, m) => sum + Number(m[k] || 0), 0);
		const total = Math.round((serverVal > 0 ? serverVal : mealVal) * 10) / 10;
		const rda = RDA[k];
		const pct = Math.min(100, Math.round(total / rda * 100));
		return {
			key: k,
			label: MICRO_LABELS[k],
			unit: MICRO_UNITS[k],
			value: total,
			rda,
			pct
		};
	});
	const score = rollup?.score ? Number(rollup.score) : Math.min(100, Math.round((calories > 0 ? 30 : 0) + Math.min(35, protein / Math.max(1, protTarget) * 35) + Math.min(20, waterGlasses / Math.max(1, waterTarget) * 20) + Math.min(15, fiber / 30 * 15)));
	const lowMicros = microStats.filter((m) => m.pct < 50).slice(0, 3);
	const mealTaskDone = combinedMeals.length > 0;
	const calTaskDone = calories >= calTarget * .85;
	const proteinTaskDone = protein >= protTarget * .8;
	const isAllTasksCompleted = (mealTaskDone ? 1 : 0) + (calTaskDone ? 1 : 0) + (proteinTaskDone ? 1 : 0) + (waterGlasses >= waterTarget ? 1 : 0) === 4;
	const [showVictoryModal, setShowVictoryModal] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isAllTasksCompleted) {
			const celebratedKey = `celebrated_popup_${todayStr}`;
			if (!localStorage.getItem(celebratedKey)) {
				setShowVictoryModal(true);
				fireCongratulationsConfetti();
				localStorage.setItem(celebratedKey, "true");
				toast.success("🎉 Outstanding! All your daily nutrition tasks & calorie targets are completed!");
			}
		}
	}, [isAllTasksCompleted, todayStr]);
	let advice = "Add a balanced lunch and you're on track for today.";
	if (calories === 0) advice = "Log your first meal to start tracking today.";
	else if (protein < protTarget * .6) advice = `You're ${Math.round(protTarget - protein)}g short on protein — a Greek yogurt or chicken breast would close most of that gap.`;
	else if (calories > calTarget * 1.1) advice = `You're ${Math.round(calories - calTarget)} kcal over today's target. Light, fiber-forward dinner recommended.`;
	else if (lowMicros.length > 0) advice = `Your ${lowMicros[0].label} intake is low today — consider adding a nutrient-dense snack.`;
	combinedMeals.map((m, idx) => {
		const mealObj = m;
		return {
			id: String(mealObj.id || idx),
			name: mealObj.name || "Logged Meal",
			calories: Number(mealObj.calories || 0),
			protein: Number(mealObj.protein_g || 0),
			time: mealObj.time || (mealObj.eaten_at ? new Date(mealObj.eaten_at).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			}) : "Today"),
			emoji: mealObj.emoji || (idx % 2 === 0 ? "🍳" : "🥗")
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-6 animate-in fade-in duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 rounded-full border border-[#00E58F]/30 bg-[#00E58F]/10 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#00E58F]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[#00E58F] animate-pulse" }), "TODAY"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground truncate",
							children: ["Hello, ", profile?.display_name ? profile.display_name.split(" ")[0] : "Gaurav"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground truncate",
							children: "Let's make today healthier than yesterday."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0 self-start sm:self-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setIsNotifModalOpen(true),
						className: "relative p-3 rounded-2xl bg-card border border-border hover:bg-muted text-foreground transition-all duration-200 active:scale-95 cursor-pointer shadow-sm",
						title: "NutriLens Notifications & Reminders",
						"aria-label": "Open Notifications",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), unreadNotifs > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-black text-slate-950 shadow-[0_0_8px_rgba(56,189,248,0.5)]",
							children: unreadNotifs > 9 ? "9+" : unreadNotifs
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => navigate({ to: "/scan" }),
						className: "group relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#34D399] px-4 py-3 text-xs font-black text-[#071018] shadow-lg shadow-[#38BDF8]/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-7 w-7 place-items-center rounded-xl bg-black/15 text-[#071018]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline",
							children: "Scan Meal"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalorieHero, {
				consumed: calories,
				target: calTarget,
				protein,
				proteinTarget: protTarget,
				score
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-base font-extrabold tracking-tight text-foreground truncate",
						children: "Macro Breakdown"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-muted-foreground truncate",
						children: "Daily Target Balance"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroRing, {
							label: "Protein",
							value: protein,
							target: protTarget,
							color: "var(--color-protein)",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-3.5 w-3.5 text-[#00E58F]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroRing, {
							label: "Carbs",
							value: carbs,
							target: Math.round(calTarget * .45 / 4),
							color: "var(--color-carbs)",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wheat, { className: "h-3.5 w-3.5 text-blue-400" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroRing, {
							label: "Fat",
							value: fat,
							target: Math.round(calTarget * .3 / 9),
							color: "var(--color-fat)",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, { className: "h-3.5 w-3.5 text-amber-500" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroRing, {
							label: "Fiber",
							value: fiber,
							target: 30,
							color: "var(--color-fiber)",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-3.5 w-3.5 text-teal-400" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroRing, {
							label: "Sugar",
							value: sugar,
							target: 50,
							color: "var(--color-sugar)",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-3.5 w-3.5 text-pink-400" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[22px] border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-card-foreground shadow-sm dark:border-[#38BDF8]/30 dark:bg-gradient-to-r dark:from-[#38BDF8]/15 dark:via-[#0C1722] dark:to-[#071018] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] p-4 sm:p-5 backdrop-blur-xl min-w-0 w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#38BDF8]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 animate-pulse text-[#38BDF8] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NutriLens Coach Recommendation" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-xs font-semibold text-foreground/90 dark:text-slate-300 leading-relaxed",
					children: advice
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] border border-border/80 bg-card text-card-foreground shadow-sm dark:border-white/10 dark:bg-[#0C1722]/90 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-4 sm:p-5 backdrop-blur-xl space-y-4 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/50 dark:border-white/5 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-[#38BDF8] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-base font-black text-foreground dark:text-white tracking-tight truncate",
							children: "Advanced Micronutrients"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-muted-foreground dark:text-slate-400 shrink-0",
						children: "Essential Minerals & Vitamins"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3",
					children: microStats.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-2xl border p-3 min-w-0 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 ${m.key === "iron_mg" || kIsMineral(m.key) ? "border-[#38BDF8]/30 bg-[#38BDF8]/5 dark:border-[#38BDF8]/30 dark:bg-[#38BDF8]/5 shadow-sm dark:shadow-[0_0_12px_rgba(56,189,248,0.08)]" : "border-border/60 bg-muted/20 dark:border-white/5 dark:bg-[#0F2130]/60"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-extrabold text-foreground dark:text-white truncate",
									children: m.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 rounded-full bg-[#38BDF8]/15 px-2 py-0.5 text-[10px] font-black text-[#38BDF8] tabular-nums border border-[#38BDF8]/20",
									children: [m.pct, "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 font-display text-lg font-black text-foreground dark:text-white tabular-nums",
								children: [
									m.value,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-muted-foreground dark:text-slate-400",
										children: m.unit
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] font-semibold text-muted-foreground dark:text-slate-400 mt-0.5 truncate",
								children: [
									"RDA: ",
									m.rda,
									" ",
									m.unit
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/5 border border-border/40 dark:border-white/5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] shadow-sm dark:shadow-[0_0_8px_#38BDF8] transition-all duration-500",
									style: { width: `${m.pct}%` }
								})
							})
						]
					}, m.key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCounter, {
				todayStr,
				weightKg: profile?.weight_kg || 70,
				heightCm: profile?.height_cm || 175,
				goalWeightKg: profile?.goal_weight_kg || profile?.weight_kg || 70,
				userGoal: profile?.goal || "fat_loss",
				fitnessGoals: (profile?.extended_data)?.fitness_goals || [],
				activityLevel: profile?.activity || "moderate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-center justify-between gap-4 rounded-[24px] border border-cyan-500/30 bg-cyan-500/5 text-card-foreground shadow-sm dark:bg-gradient-to-br dark:from-cyan-500/10 dark:via-[#0C1722] dark:to-[#071018] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-4 sm:p-5 md:p-6 backdrop-blur-xl transition-all hover:border-cyan-400/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3.5 w-full md:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, { className: "h-6 w-6 sm:h-7 sm:w-7 text-cyan-600 dark:text-cyan-400 animate-water-bounce" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider",
									children: "Water Intake"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-extrabold text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20",
									children: [
										(waterGlasses * .25).toFixed(1),
										"L / ",
										(waterTarget * .25).toFixed(1),
										"L"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-xl sm:text-2xl font-black tabular-nums text-foreground dark:text-white",
								children: [waterGlasses.toFixed(waterGlasses % 1 !== 0 ? 1 : 0), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs sm:text-sm font-semibold text-muted-foreground dark:text-slate-400",
									children: [
										" ",
										"/ ",
										waterTarget,
										" glasses"
									]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full md:w-48 lg:w-64 px-1 md:px-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-[11px] font-bold text-cyan-600 dark:text-cyan-300 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono",
								children: [waterTarget > 0 ? Math.min(100, Math.round(waterGlasses / waterTarget * 100)) : 0, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full rounded-full bg-cyan-950/40 border border-cyan-500/20 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
								style: { width: `${waterTarget > 0 ? Math.min(100, Math.round(waterGlasses / waterTarget * 100)) : 0}%` }
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 w-full md:w-auto justify-end shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setIsWaterModalOpen(true),
							className: "flex items-center gap-1.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs sm:text-sm font-black text-cyan-500 dark:text-cyan-400 hover:bg-cyan-500/20 transition-all active:scale-95 cursor-pointer shadow-sm",
							title: "Custom Water System",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4" }), "Custom"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => water.mutate(),
							disabled: water.isPending,
							className: "grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#34D399] text-[#071018] font-black shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all active:scale-90 disabled:opacity-50 hover:brightness-110 cursor-pointer shrink-0",
							title: "Add 1 glass",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-6 w-6 stroke-[3]" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-[24px] border border-[#38BDF8]/30 bg-[#38BDF8]/5 text-card-foreground shadow-sm dark:border-[#38BDF8]/30 dark:bg-gradient-to-br dark:from-[#38BDF8]/10 dark:via-[#0C1722] dark:to-[#071018] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-5 backdrop-blur-xl transition-all hover:border-[#38BDF8]/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 shadow-[0_0_15px_rgba(56,189,248,0.25)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-6 w-6 text-[#38BDF8]" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider",
							children: "Meals Logged Today"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-2xl font-black tabular-nums text-foreground dark:text-white",
							children: [
								combinedMeals.length,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground dark:text-slate-400",
									children: "meals"
								})
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => navigate({ to: "/scan" }),
						className: "rounded-2xl border border-[#38BDF8]/40 bg-[#38BDF8]/15 px-4 py-2.5 text-xs font-black text-[#38BDF8] hover:bg-gradient-to-r hover:from-[#38BDF8] hover:to-[#34D399] hover:text-[#071018] transition-all shadow-sm dark:shadow-[0_0_15px_rgba(56,189,248,0.2)] active:scale-95 cursor-pointer",
						children: "+ Add Meal"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-base font-extrabold tracking-tight text-foreground",
							children: "Recent Meals Logged"
						}), combinedMeals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigate({ to: "/calendar" }),
							className: "text-xs font-bold text-[#00E58F] hover:underline",
							children: "View History"
						})]
					}), combinedMeals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[24px] border-2 border-dashed border-border/80 bg-card/40 p-8 text-center backdrop-blur-md space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#00E58F]/15 text-[#00E58F]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-base font-extrabold text-foreground",
								children: "No meals logged yet today"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Scan your plate with NutriLens for instant macro breakdown"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => navigate({ to: "/scan" }),
								className: "inline-flex items-center gap-2 rounded-2xl bg-[#00E58F] px-5 py-2.5 text-xs font-black text-black shadow-md shadow-[#00E58F]/25 transition hover:scale-105 active:scale-95",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }),
									" Scan your first meal",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
								]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-3",
						children: combinedMeals.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-[20px] border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-border min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-sm font-extrabold text-foreground truncate",
									children: m.name
								}), (() => {
									const mealObj = m;
									const servingDesc = typeof mealObj.serving_desc === "string" ? mealObj.serving_desc : "";
									const eatenAt = typeof mealObj.eaten_at === "string" ? mealObj.eaten_at : "";
									const iron = typeof mealObj.iron_mg === "number" ? mealObj.iron_mg : 0;
									const calcium = typeof mealObj.calcium_mg === "number" ? mealObj.calcium_mg : 0;
									const magnesium = typeof mealObj.magnesium_mg === "number" ? mealObj.magnesium_mg : 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs font-medium text-muted-foreground mt-0.5 truncate",
										children: [servingDesc ? `${servingDesc} · ` : "", eatenAt ? new Date(eatenAt).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										}) : "Today"]
									}), (iron > 0 || calcium > 0 || magnesium > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap gap-1.5",
										children: [
											iron > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-500",
												children: [
													"Iron: ",
													iron,
													"mg"
												]
											}),
											calcium > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400",
												children: [
													"Calcium: ",
													calcium,
													"mg"
												]
											}),
											magnesium > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center rounded-lg bg-[#00E58F]/10 border border-[#00E58F]/20 px-2 py-0.5 text-[10px] font-bold text-[#00E58F]",
												children: [
													"Magnesium: ",
													magnesium,
													"mg"
												]
											})
										]
									})] });
								})()]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-left sm:text-right text-xs shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-display text-base font-black tabular-nums text-foreground",
									children: [
										Math.round(Number(m.calories)),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground font-normal",
											children: "kcal"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] font-semibold text-muted-foreground mt-0.5",
									children: [
										"P ",
										Math.round(Number(m.protein_g)),
										"g · C ",
										Math.round(Number(m.carbs_g)),
										"g · F",
										" ",
										Math.round(Number(m.fat_g)),
										"g"
									]
								})]
							})]
						}, m.id || `meal-${idx}`))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomWaterModal, {
				isOpen: isWaterModalOpen,
				onClose: () => setIsWaterModalOpen(false),
				currentGlasses: waterGlasses,
				waterTargetGlasses: waterTarget,
				todayStr,
				onUpdate: () => {
					qc.invalidateQueries({ queryKey: ["today"] });
					qc.invalidateQueries({ queryKey: ["profile"] });
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showVictoryModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						scale: .9,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					exit: {
						scale: .9,
						opacity: 0
					},
					className: "relative w-full max-w-md my-auto rounded-[32px] border border-amber-400/40 bg-gradient-to-b from-[#18231E] via-[#0C1722] to-[#071018] p-6 sm:p-7 shadow-[0_0_50px_rgba(251,191,36,0.3)] text-foreground space-y-5 text-center overflow-hidden mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowVictoryModal(false),
							className: "absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-white flex items-center justify-center transition cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center space-y-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative grid h-20 w-20 place-items-center rounded-3xl bg-amber-500/20 border border-amber-400/40 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)] animate-bounce",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-10 w-10 text-amber-400" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-amber-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "h-3.5 w-3.5" }), " Victory Unlocked"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-black tracking-tight text-white",
								children: "Daily Goals Complete!"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-slate-300",
								children: "Incredible discipline! You hit all 4 nutrition and calorie targets today."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2.5 text-left text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 font-bold text-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }), "Meal Logged"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-black text-emerald-400",
										children: [combinedMeals.length, " Meals"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 font-bold text-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }), "Calorie Target"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-black text-emerald-400",
										children: [
											Math.round(calories),
											" / ",
											calTarget,
											" kcal"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 font-bold text-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }), "Protein Target"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-black text-emerald-400",
										children: [
											Math.round(protein),
											"g / ",
											protTarget,
											"g"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2 font-bold text-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400 shrink-0" }), "Water Target"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-black text-emerald-400",
										children: [
											waterGlasses,
											" / ",
											waterTarget,
											" glasses"
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								fireCongratulationsConfetti();
								setShowVictoryModal(false);
							},
							className: "w-full rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 py-3.5 px-4 font-black text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "h-4 w-4" }), " Claim Victory 🏆"]
						})
					]
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationCenterModal, {
				isOpen: isNotifModalOpen,
				onClose: () => setIsNotifModalOpen(false)
			})
		]
	});
}
function kIsMineral(key) {
	return key === "iron_mg" || key === "calcium_mg" || key === "magnesium_mg";
}
//#endregion
export { HomePage as component };
