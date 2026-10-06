import { o as __toESM } from "../_runtime.mjs";
import { i as getServerFnById, n as createServerFn, o as __exportAll, t as TSS_SERVER_FUNCTION } from "./server-BL6TnVUX.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { I as isRedirect, _ as createFileRoute, b as useNavigate, d as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRouteWithContext, x as useRouter, z as redirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DFYPc8zw.mjs";
import { i as RDA, n as MICRO_LABELS, r as MICRO_UNITS } from "./nutrition-BAeM0OEM.mjs";
import { a as objectType, i as numberType, n as arrayType, o as stringType, r as enumType, t as anyType } from "../_libs/zod.mjs";
import { t as supabase } from "./client-gnngM_Y9.mjs";
import { t as getLocalDateString } from "./date-utils-CMo_soRo.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { a as XAxis, c as CartesianGrid, d as Tooltip, f as Legend, i as YAxis, l as Bar, n as BarChart, o as Area, r as LineChart, s as Line, t as AreaChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { $ as Leaf, B as RefreshCw, Bt as BadgeCheck, Ct as ChevronUp, D as Sprout, Dt as ChefHat, Et as ChevronDown, It as Bell, J as Minus, L as Scale, M as ShieldCheck, Mt as Calendar, O as Sparkles, Ot as Check, P as Settings, Pt as CalendarCheck, Q as LoaderCircle, R as Salad, Rt as Beef, S as Target, Tt as ChevronLeft, U as Phone, Ut as ArrowLeft, V as Plus, Vt as Award, Wt as Apple, X as LogOut, Y as Mail, Z as Lock, _ as TrendingUp, _t as Coins, b as ThumbsUp, bt as CircleQuestionMark, c as Utensils, d as User, dt as Fish, ft as FileText, gt as Droplet, ht as Dumbbell, i as Wheat, jt as Camera, k as Smartphone, lt as Footprints, m as Tv, nt as Info, ot as Heart, r as X, st as HeartPulse, t as Zap, u as Users, ut as Flame, v as TrendingDown, vt as Clock, wt as ChevronRight, x as ThumbsDown, xt as CircleCheck, z as RotateCcw } from "../_libs/lucide-react.mjs";
import { n as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as confetti_module_default } from "../_libs/canvas-confetti.mjs";
import { n as Type, t as GoogleGenAI } from "../_libs/@google/genai.mjs";
import fs from "fs";
import path from "path";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-1hBhF-xg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BBaCA5Zn.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-B8bm5qhf.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var PREFS_STORAGE_KEY = "nutrilens_notification_preferences";
var HISTORY_STORAGE_KEY = "nutrilens_notification_history";
var DEFAULT_NOTIFICATION_PREFERENCES = {
	enabled: true,
	mealReminders: true,
	waterAlerts: true,
	streakReminders: true,
	coachTips: true,
	weeklyReport: true,
	soundEnabled: true,
	mealTimes: {
		breakfast: "08:30",
		lunch: "13:00",
		dinner: "19:30"
	}
};
function playNotificationChime() {
	try {
		const AudioContextClass = window.AudioContext || window.webkitAudioContext;
		if (!AudioContextClass) return;
		const ctx = new AudioContextClass();
		const now = ctx.currentTime;
		const osc1 = ctx.createOscillator();
		const osc2 = ctx.createOscillator();
		const gainNode = ctx.createGain();
		osc1.type = "sine";
		osc1.frequency.setValueAtTime(587.33, now);
		osc1.frequency.exponentialRampToValueAtTime(880, now + .12);
		osc2.type = "triangle";
		osc2.frequency.setValueAtTime(880, now);
		osc2.frequency.exponentialRampToValueAtTime(1174.66, now + .12);
		gainNode.gain.setValueAtTime(.001, now);
		gainNode.gain.exponentialRampToValueAtTime(.18, now + .04);
		gainNode.gain.exponentialRampToValueAtTime(.001, now + .45);
		osc1.connect(gainNode);
		osc2.connect(gainNode);
		gainNode.connect(ctx.destination);
		osc1.start(now);
		osc2.start(now);
		osc1.stop(now + .45);
		osc2.stop(now + .45);
	} catch (err) {
		console.debug("Could not play audio chime:", err);
	}
}
function getNotificationPreferences() {
	if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFERENCES;
	try {
		const raw = localStorage.getItem(PREFS_STORAGE_KEY);
		if (!raw) return DEFAULT_NOTIFICATION_PREFERENCES;
		return {
			...DEFAULT_NOTIFICATION_PREFERENCES,
			...JSON.parse(raw)
		};
	} catch {
		return DEFAULT_NOTIFICATION_PREFERENCES;
	}
}
function saveNotificationPreferences(prefs) {
	if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFERENCES;
	const updated = {
		...getNotificationPreferences(),
		...prefs
	};
	try {
		localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(updated));
		window.dispatchEvent(new CustomEvent("nutrilens-notifications-prefs-changed", { detail: updated }));
	} catch (err) {
		console.warn("Error saving notification preferences:", err);
	}
	return updated;
}
function getNotificationHistory() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
		if (!raw) return [];
		return JSON.parse(raw);
	} catch {
		return [];
	}
}
function saveNotificationToHistory(item) {
	if (typeof window === "undefined") return;
	try {
		const history = getNotificationHistory();
		const newItem = {
			...item,
			id: "notif_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
			timestamp: Date.now(),
			read: false
		};
		const updated = [newItem, ...history].slice(0, 50);
		localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
		window.dispatchEvent(new CustomEvent("nutrilens-notification-received", { detail: newItem }));
		return newItem;
	} catch (err) {
		console.warn("Error saving notification to history:", err);
	}
}
function markNotificationAsRead(id) {
	if (typeof window === "undefined") return;
	const updated = getNotificationHistory().map((item) => item.id === id ? {
		...item,
		read: true
	} : item);
	localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
	window.dispatchEvent(new CustomEvent("nutrilens-notifications-updated"));
}
function markAllNotificationsAsRead() {
	if (typeof window === "undefined") return;
	const updated = getNotificationHistory().map((item) => ({
		...item,
		read: true
	}));
	localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
	window.dispatchEvent(new CustomEvent("nutrilens-notifications-updated"));
}
function clearAllNotifications() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(HISTORY_STORAGE_KEY);
	window.dispatchEvent(new CustomEvent("nutrilens-notifications-updated"));
}
function getBrowserNotificationPermission() {
	if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
	return Notification.permission;
}
async function requestNutriLensNotificationPermission() {
	if (typeof window === "undefined") return false;
	let granted = false;
	if ("Notification" in window) try {
		if (Notification.permission === "granted") granted = true;
		else if (Notification.permission !== "denied") granted = await Notification.requestPermission() === "granted";
	} catch (err) {
		console.warn("Notification.requestPermission error (may be sandboxed iframe):", err);
		granted = true;
	}
	else granted = true;
	saveNotificationPreferences({ enabled: granted });
	if (granted) sendNutriLensNotification({
		title: "NutriLens AI ✨",
		body: "Notifications enabled! You'll receive daily meal reminders, water alerts, and macro goal tracking.",
		type: "system"
	});
	return granted;
}
function sendNutriLensNotification(params) {
	if (typeof window === "undefined") return;
	const prefs = getNotificationPreferences();
	if (!prefs.enabled) return;
	const type = params.type || "system";
	if (type === "meal" && !prefs.mealReminders) return;
	if (type === "hydration" && !prefs.waterAlerts) return;
	if (type === "streak" && !prefs.streakReminders) return;
	if (type === "ai" && !prefs.coachTips) return;
	if (prefs.soundEnabled && !params.silent) playNotificationChime();
	if ("Notification" in window && Notification.permission === "granted") try {
		const nativeNotif = new Notification(params.title, {
			body: params.body,
			icon: "/favicon.ico",
			badge: "/favicon.ico",
			tag: "nutrilens-" + type
		});
		nativeNotif.onclick = () => {
			window.focus();
			if (params.actionUrl) window.location.href = params.actionUrl;
			nativeNotif.close();
		};
	} catch (err) {
		console.debug("Native notification error:", err);
	}
	saveNotificationToHistory({
		title: params.title,
		body: params.body,
		type,
		actionUrl: params.actionUrl
	});
	toast(params.title, {
		description: params.body,
		icon: {
			meal: "🥗",
			hydration: "💧",
			streak: "🔥",
			ai: "✨",
			system: "🔔"
		}[type] || "🔔",
		duration: 5e3
	});
}
function triggerTestNotification(type = "meal") {
	const samples = {
		meal: {
			title: "🥗 Lunch Reminder",
			body: "Time for a healthy midday meal! You have 620 kcal & 45g protein remaining today.",
			actionUrl: "/meals"
		},
		hydration: {
			title: "💧 Hydration Check-in",
			body: "Drink a glass of water (250ml) to keep your energy high and boost metabolic efficiency.",
			actionUrl: "/home"
		},
		streak: {
			title: "🔥 Streak Alert!",
			body: "You're only 1 meal away from completing today's goal and securing your 7-day streak!",
			actionUrl: "/home"
		},
		ai: {
			title: "✨ AI Nutrition Insight",
			body: "Great job on your fiber intake today! Pair dinner with lean protein for ideal muscle recovery.",
			actionUrl: "/analytics"
		},
		system: {
			title: "🔔 NutriLens System Alert",
			body: "Daily meal log and barcode scanner are active. Reach your goals with smart AI reminders.",
			actionUrl: "/home"
		}
	};
	sendNutriLensNotification({
		...samples[type] || samples.system,
		type
	});
}
var schedulerInitialized = false;
function initNutriLensScheduler() {
	if (typeof window === "undefined" || schedulerInitialized) return;
	schedulerInitialized = true;
	setInterval(() => {
		try {
			const prefs = getNotificationPreferences();
			if (!prefs.enabled) return;
			const now = /* @__PURE__ */ new Date();
			const currentHour = now.getHours();
			const currentMin = now.getMinutes();
			const currentTimeStr = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
			const lastTriggerKey = `nutrilens_last_reminder_${now.toDateString()}_${currentTimeStr}`;
			if (sessionStorage.getItem(lastTriggerKey)) return;
			if (prefs.mealReminders && currentTimeStr === prefs.mealTimes.breakfast) {
				sessionStorage.setItem(lastTriggerKey, "true");
				sendNutriLensNotification({
					title: "🍳 Breakfast Time!",
					body: "Kickstart your metabolism with a protein-rich breakfast. Scan or log your meal now.",
					type: "meal",
					actionUrl: "/meals"
				});
			}
			if (prefs.mealReminders && currentTimeStr === prefs.mealTimes.lunch) {
				sessionStorage.setItem(lastTriggerKey, "true");
				sendNutriLensNotification({
					title: "🥗 Lunch Reminder",
					body: "Time for lunch! Log your macros to stay on track for your daily health goal.",
					type: "meal",
					actionUrl: "/meals"
				});
			}
			if (prefs.mealReminders && currentTimeStr === prefs.mealTimes.dinner) {
				sessionStorage.setItem(lastTriggerKey, "true");
				sendNutriLensNotification({
					title: "🍲 Evening Dinner Time",
					body: "Fuel up for restful recovery. Check your remaining calorie & protein allowance.",
					type: "meal",
					actionUrl: "/meals"
				});
			}
			if (prefs.streakReminders && currentTimeStr === "20:30") {
				sessionStorage.setItem(lastTriggerKey, "true");
				sendNutriLensNotification({
					title: "🔥 Evening Streak Check",
					body: "Don't let your streak slip! Check your daily food diary and close your calorie ring.",
					type: "streak",
					actionUrl: "/home"
				});
			}
		} catch (err) {
			console.debug("Scheduler tick error:", err);
		}
	}, 6e4);
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium",
						children: "Go home"
					})]
				})
			]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl font-bold",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "This page doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
					children: "Go home"
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "NutriLens" },
			{
				name: "description",
				content: "Smart & intuitive nutrition tracking. Scan meals, see macros and micros, get coached by your own data."
			},
			{
				name: "theme-color",
				content: "#0f1e1c"
			},
			{
				property: "og:title",
				content: "NutriLens"
			},
			{
				property: "og:description",
				content: "Smart & intuitive nutrition tracking. Scan meals, see macros and micros, get coached by your own data."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:title",
				content: "NutriLens"
			},
			{
				name: "twitter:description",
				content: "Smart & intuitive nutrition tracking. Scan meals, see macros and micros, get coached by your own data."
			},
			{
				property: "og:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/cf610255-26a1-47ec-9738-03693307e57e"
			},
			{
				name: "twitter:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/cf610255-26a1-47ec-9738-03693307e57e"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", {
			suppressHydrationWarning: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			suppressHydrationWarning: true,
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	(0, import_react.useEffect)(() => {
		initNutriLensScheduler();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-center",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$5 = () => import("./routes-YmPmfO1c.mjs");
var Route$13 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "NutriLens — Smart AI Calorie & Nutrition Tracker" }, {
		name: "description",
		content: "Calorie tracking made easy. Scan meals with your camera, track calories, macros, and achieve your health goals with AI."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./route-DVjw7Lgl.mjs");
var Route$12 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		if (typeof window === "undefined") return;
		const { data } = await supabase.auth.getSession();
		const guestSession = localStorage.getItem("nutrilens_guest_session");
		if (!data.session && !guestSession) throw redirect({ to: "/auth" });
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./auth-Bnhq_BhY.mjs");
var Route$11 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — NutriLens" }] }),
	validateSearch: (search) => {
		return { mode: search.mode === "sign_up" ? "sign_up" : search.mode === "sign_in" ? "sign_in" : void 0 };
	},
	beforeLoad: async () => {
		if (typeof window === "undefined") return;
		const { data } = await supabase.auth.getSession();
		const guestSession = localStorage.getItem("nutrilens_guest_session");
		if (data.session || guestSession) throw redirect({ to: "/home" });
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var getToday = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ day: stringType().optional() }).optional().parse(d)).handler(createSsrRpc("1cbf8a0f9f623dc13b75beb6122e2e15858c04d8d42029281d33306714eccc47"));
var getMacroTrend = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ days: numberType().int().min(7).max(90).default(30) }).parse(d)).handler(createSsrRpc("82f4a259e2fd72d4112656d4b0039806a854dad601378dade95e9e6ff99e31b9"));
var getMicroTrend = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ days: numberType().int().min(7).max(90).default(30) }).parse(d)).handler(createSsrRpc("1c7be8f31749f0daa6b669a41f7eb998f1fb10b9ee48252723603da612058f96"));
var getCalendarRange = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ days: numberType().int().min(1).max(3650).default(365) }).parse(d)).handler(createSsrRpc("703e20a28f714e0ad85913e0cae738b793cdce1a7fdc3249cc8945bdfed345d4"));
var getDay = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ day: stringType() }).parse(d)).handler(createSsrRpc("64efa13b12c16399a0833a3ed85f51077ae0d3852423eeab698741acd4523bb0"));
var getWeightTrend = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ days: numberType().int().min(7).max(365).default(60) }).parse(d)).handler(createSsrRpc("9ff9b67c25935704982c975305b72e1051b011df64741995e9111e1e6fed34ee"));
var SQLITE_STORAGE_KEY = "nutrilens_sqlite_db_v1";
var dbInstance = null;
var initPromise = null;
function persistDatabase(db) {
	if (typeof window === "undefined") return;
	try {
		const data = db.export();
		const CHUNK_SIZE = 32768;
		let binary = "";
		for (let i = 0; i < data.length; i += CHUNK_SIZE) {
			const chunk = data.subarray(i, i + CHUNK_SIZE);
			binary += String.fromCharCode.apply(null, Array.from(chunk));
		}
		const base64 = btoa(binary);
		localStorage.setItem(SQLITE_STORAGE_KEY, base64);
	} catch (err) {
		console.warn("[SQLite] Persist error (quota or size):", err);
	}
}
function loadPersistedDatabase(SQL) {
	if (typeof window === "undefined") return null;
	try {
		const base64 = localStorage.getItem(SQLITE_STORAGE_KEY);
		if (!base64) return null;
		const binary = atob(base64);
		const len = binary.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
		return new SQL.Database(bytes);
	} catch (err) {
		console.warn("[SQLite] Load persisted DB error:", err);
		return null;
	}
}
function isValidWasm(buffer) {
	if (!buffer || buffer.byteLength < 8) return false;
	const header = new Uint8Array(buffer, 0, 4);
	return header[0] === 0 && header[1] === 97 && header[2] === 115 && header[3] === 109;
}
async function loadWasmBinary() {
	if (typeof window === "undefined") return null;
	let bundlerWasmUrl = "/sql-wasm.wasm";
	try {
		bundlerWasmUrl = (await import("./sql-wasm-nVpHQucB.mjs")).default || bundlerWasmUrl;
	} catch {}
	const urls = [
		bundlerWasmUrl,
		"/sql-wasm.wasm",
		"https://cdn.jsdelivr.net/npm/sql.js@1.14.1/dist/sql-wasm.wasm",
		"https://unpkg.com/sql.js@1.14.1/dist/sql-wasm.wasm",
		"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm"
	];
	for (const url of urls) try {
		const res = await fetch(url, { cache: "force-cache" });
		if (res.ok) {
			const contentType = res.headers.get("content-type") || "";
			if (contentType.includes("html") || contentType.includes("json")) continue;
			const buffer = await res.arrayBuffer();
			if (isValidWasm(buffer)) return buffer;
		}
	} catch {}
	return null;
}
async function getSQLiteDB() {
	if (dbInstance) return dbInstance;
	if (typeof window === "undefined") return null;
	if (initPromise) return initPromise;
	initPromise = (async () => {
		try {
			let initSqlJs;
			try {
				const mod = await import("../_libs/sql.js.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
				initSqlJs = mod.default || mod;
			} catch (err) {
				console.warn("[SQLite] Failed to dynamically load sql.js:", err);
				return null;
			}
			const getInitializer = () => {
				if (typeof initSqlJs === "function") return initSqlJs;
				const initObj = initSqlJs;
				if (typeof initObj?.default === "function") return initObj.default;
				return null;
			};
			const initFunc = getInitializer();
			if (!initFunc) {
				console.warn("[SQLite] initSqlJs function not available");
				return null;
			}
			let SQL;
			const wasmBinary = await loadWasmBinary();
			if (wasmBinary) try {
				SQL = await initFunc({ wasmBinary });
			} catch (wasmErr) {
				console.warn("[SQLite] initFunc with wasmBinary failed:", wasmErr);
			}
			if (!SQL) try {
				SQL = await initFunc({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.14.1/dist/${file}` });
			} catch (urlErr) {
				console.warn("[SQLite] initFunc with locateFile failed:", urlErr);
				try {
					SQL = await initFunc({ locateFile: (file) => `https://unpkg.com/sql.js@1.14.1/dist/${file}` });
				} catch (cdnErr) {
					console.warn("[SQLite] CDN WASM init failed, trying unpkg:", cdnErr);
				}
			}
			if (!SQL) return null;
			let db = loadPersistedDatabase(SQL);
			if (!db) db = new SQL.Database();
			if (!db) return null;
			db.run(`
        CREATE TABLE IF NOT EXISTS meals (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          eaten_at TEXT,
          eaten_on TEXT,
          name TEXT,
          source TEXT,
          confidence REAL,
          serving_desc TEXT,
          calories REAL,
          protein_g REAL,
          carbs_g REAL,
          fat_g REAL,
          fiber_g REAL,
          sugar_g REAL,
          sodium_mg REAL,
          iron_mg REAL,
          calcium_mg REAL,
          magnesium_mg REAL,
          potassium_mg REAL,
          vit_a_ug REAL,
          vit_b12_ug REAL,
          vit_d_ug REAL,
          omega3_g REAL,
          synced INTEGER DEFAULT 0,
          updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS profile (
          user_id TEXT PRIMARY KEY,
          display_name TEXT,
          gender TEXT,
          age INTEGER,
          height_cm REAL,
          weight_kg REAL,
          goal_weight_kg REAL,
          activity TEXT,
          goal TEXT,
          diet TEXT,
          daily_calorie_target REAL,
          protein_target_g REAL,
          water_target_glasses REAL,
          extended_data TEXT,
          synced INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS water_logs (
          day TEXT PRIMARY KEY,
          glasses INTEGER,
          synced INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS steps_logs (
          day TEXT PRIMARY KEY,
          steps INTEGER DEFAULT 0,
          distance_km REAL DEFAULT 0,
          calories_burned REAL DEFAULT 0,
          active_minutes INTEGER DEFAULT 0,
          goal_completion REAL DEFAULT 0,
          last_updated TEXT,
          synced INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS daily_nutrition_summary (
          date TEXT PRIMARY KEY,
          total_calories REAL DEFAULT 0,
          total_protein REAL DEFAULT 0,
          total_carbs REAL DEFAULT 0,
          total_fat REAL DEFAULT 0,
          total_fiber REAL DEFAULT 0,
          total_sugar REAL DEFAULT 0,
          total_water REAL DEFAULT 0,
          vitamin_a REAL DEFAULT 0,
          vitamin_c REAL DEFAULT 0,
          vitamin_d REAL DEFAULT 0,
          vitamin_e REAL DEFAULT 0,
          vitamin_k REAL DEFAULT 0,
          vitamin_b1 REAL DEFAULT 0,
          vitamin_b2 REAL DEFAULT 0,
          vitamin_b3 REAL DEFAULT 0,
          vitamin_b5 REAL DEFAULT 0,
          vitamin_b6 REAL DEFAULT 0,
          vitamin_b7 REAL DEFAULT 0,
          vitamin_b9 REAL DEFAULT 0,
          vitamin_b12 REAL DEFAULT 0,
          calcium REAL DEFAULT 0,
          iron REAL DEFAULT 0,
          magnesium REAL DEFAULT 0,
          potassium REAL DEFAULT 0,
          sodium REAL DEFAULT 0,
          phosphorus REAL DEFAULT 0,
          zinc REAL DEFAULT 0,
          copper REAL DEFAULT 0,
          selenium REAL DEFAULT 0,
          manganese REAL DEFAULT 0,
          choline REAL DEFAULT 0,
          omega3 REAL DEFAULT 0,
          omega6 REAL DEFAULT 0,
          meal_count INTEGER DEFAULT 0,
          nutrition_score REAL DEFAULT 0,
          health_score REAL DEFAULT 0,
          goal_completion REAL DEFAULT 0,
          last_updated TEXT
        );

        CREATE TABLE IF NOT EXISTS sync_queue (
          id TEXT PRIMARY KEY,
          action TEXT,
          table_name TEXT,
          record_id TEXT,
          payload TEXT,
          created_at TEXT
        );
      `);
			dbInstance = db;
			persistDatabase(db);
			console.log("SQLite Database initialized successfully.");
			return db;
		} catch (err) {
			console.warn("[SQLite] Failed to load WASM SQLite, using local fallback store:", err);
			return null;
		}
	})();
	return initPromise;
}
var inMemoryMealsDayCache = null;
var inMemoryMealsCache = null;
function invalidateMealsMemoryCache() {
	inMemoryMealsDayCache = null;
	inMemoryMealsCache = null;
}
async function saveMealToSQLite(meal) {
	invalidateMealsMemoryCache();
	const db = await getSQLiteDB();
	if (!db) return;
	try {
		db.run(`INSERT OR REPLACE INTO meals (
        id, user_id, eaten_at, eaten_on, name, source, confidence, serving_desc,
        calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg,
        iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g,
        synced, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`, [
			meal.id,
			meal.user_id || "local_user",
			meal.eaten_at,
			meal.eaten_on,
			meal.name,
			meal.source || "manual",
			meal.confidence ?? null,
			meal.serving_desc ?? null,
			meal.calories,
			meal.protein_g,
			meal.carbs_g,
			meal.fat_g,
			meal.fiber_g,
			meal.sugar_g,
			meal.sodium_mg,
			meal.iron_mg ?? 0,
			meal.calcium_mg ?? 0,
			meal.magnesium_mg ?? 0,
			meal.potassium_mg ?? 0,
			meal.vit_a_ug ?? 0,
			meal.vit_b12_ug ?? 0,
			meal.vit_d_ug ?? 0,
			meal.omega3_g ?? 0,
			(/* @__PURE__ */ new Date()).toISOString()
		]);
		addToSyncQueue(db, "insert", "meals", meal.id, meal);
		persistDatabase(db);
	} catch (err) {
		console.error("[SQLite] Error saving meal:", err);
	}
}
async function deleteMealFromSQLite(id) {
	invalidateMealsMemoryCache();
	const db = await getSQLiteDB();
	if (!db) return;
	try {
		db.run(`DELETE FROM meals WHERE id = ?`, [id]);
		addToSyncQueue(db, "delete", "meals", id, { id });
		persistDatabase(db);
	} catch (err) {
		console.error("[SQLite] Error deleting meal:", err);
	}
}
async function getMealsFromSQLite(day) {
	if (day && inMemoryMealsDayCache === day && inMemoryMealsCache !== null) return inMemoryMealsCache;
	const db = await getSQLiteDB();
	if (!db) return [];
	try {
		let stmt;
		if (day) {
			stmt = db.prepare(`SELECT * FROM meals WHERE eaten_on = ? ORDER BY eaten_at DESC`);
			stmt.bind([day]);
		} else stmt = db.prepare(`SELECT * FROM meals ORDER BY eaten_at DESC`);
		const meals = [];
		while (stmt.step()) {
			const row = stmt.getAsObject();
			meals.push({
				id: String(row.id || ""),
				user_id: row.user_id ? String(row.user_id) : void 0,
				eaten_at: String(row.eaten_at || ""),
				eaten_on: String(row.eaten_on || ""),
				name: String(row.name || ""),
				source: row.source || "manual",
				confidence: row.confidence ? Number(row.confidence) : void 0,
				serving_desc: row.serving_desc ? String(row.serving_desc) : null,
				calories: Number(row.calories || 0),
				protein_g: Number(row.protein_g || 0),
				carbs_g: Number(row.carbs_g || 0),
				fat_g: Number(row.fat_g || 0),
				fiber_g: Number(row.fiber_g || 0),
				sugar_g: Number(row.sugar_g || 0),
				sodium_mg: Number(row.sodium_mg || 0),
				iron_mg: Number(row.iron_mg || 0),
				calcium_mg: Number(row.calcium_mg || 0),
				magnesium_mg: Number(row.magnesium_mg || 0),
				potassium_mg: Number(row.potassium_mg || 0),
				vit_a_ug: Number(row.vit_a_ug || 0),
				vit_b12_ug: Number(row.vit_b12_ug || 0),
				vit_d_ug: Number(row.vit_d_ug || 0),
				omega3_g: Number(row.omega3_g || 0)
			});
		}
		stmt.free();
		if (day) {
			inMemoryMealsDayCache = day;
			inMemoryMealsCache = meals;
		}
		return meals;
	} catch (err) {
		console.error("[SQLite] Error fetching meals:", err);
		return [];
	}
}
async function saveProfileToSQLite(profile) {
	const db = await getSQLiteDB();
	if (!db) return;
	try {
		db.run(`INSERT OR REPLACE INTO profile (
        user_id, display_name, gender, age, height_cm, weight_kg, goal_weight_kg,
        activity, goal, diet, daily_calorie_target, protein_target_g, water_target_glasses,
        extended_data, synced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`, [
			profile.user_id || "local_user",
			profile.display_name,
			profile.gender,
			profile.age,
			profile.height_cm,
			profile.weight_kg,
			profile.goal_weight_kg,
			profile.activity,
			profile.goal,
			profile.diet,
			profile.daily_calorie_target,
			profile.protein_target_g,
			profile.water_target_glasses,
			JSON.stringify(profile.extended_data || {})
		]);
		addToSyncQueue(db, "upsert", "profile", profile.user_id || "local_user", profile);
		persistDatabase(db);
	} catch (err) {
		console.error("[SQLite] Error saving profile:", err);
	}
}
async function saveWaterToSQLite(day, glasses) {
	const db = await getSQLiteDB();
	if (!db) return;
	try {
		db.run(`INSERT OR REPLACE INTO water_logs (day, glasses, synced) VALUES (?, ?, 0)`, [day, glasses]);
		addToSyncQueue(db, "upsert", "water_logs", day, {
			day,
			glasses
		});
		persistDatabase(db);
	} catch (err) {
		console.error("[SQLite] Error saving water log:", err);
	}
}
async function updateDailyNutritionSummaryInSQLite(day) {
	const db = await getSQLiteDB();
	if (!db) return null;
	try {
		const meals = await getMealsFromSQLite(day);
		let glasses = 0;
		try {
			const stmt = db.prepare(`SELECT glasses FROM water_logs WHERE day = ?`);
			stmt.bind([day]);
			if (stmt.step()) {
				const row = stmt.getAsObject();
				glasses = Number(row.glasses || 0);
			}
			stmt.free();
		} catch {}
		const summary = {
			date: day,
			total_calories: 0,
			total_protein: 0,
			total_carbs: 0,
			total_fat: 0,
			total_fiber: 0,
			total_sugar: 0,
			total_water: glasses,
			vitamin_a: 0,
			vitamin_c: 0,
			vitamin_d: 0,
			vitamin_e: 0,
			vitamin_k: 0,
			vitamin_b1: 0,
			vitamin_b2: 0,
			vitamin_b3: 0,
			vitamin_b5: 0,
			vitamin_b6: 0,
			vitamin_b7: 0,
			vitamin_b9: 0,
			vitamin_b12: 0,
			calcium: 0,
			iron: 0,
			magnesium: 0,
			potassium: 0,
			sodium: 0,
			phosphorus: 0,
			zinc: 0,
			copper: 0,
			selenium: 0,
			manganese: 0,
			choline: 0,
			omega3: 0,
			omega6: 0,
			meal_count: meals.length,
			nutrition_score: 0,
			health_score: 0,
			goal_completion: 0,
			last_updated: (/* @__PURE__ */ new Date()).toISOString()
		};
		for (const m of meals) {
			summary.total_calories += Number(m.calories || 0);
			summary.total_protein += Number(m.protein_g || 0);
			summary.total_carbs += Number(m.carbs_g || 0);
			summary.total_fat += Number(m.fat_g || 0);
			summary.total_fiber += Number(m.fiber_g || 0);
			summary.total_sugar += Number(m.sugar_g || 0);
			summary.sodium += Number(m.sodium_mg || 0);
			summary.iron += Number(m.iron_mg || 0);
			summary.calcium += Number(m.calcium_mg || 0);
			summary.magnesium += Number(m.magnesium_mg || 0);
			summary.potassium += Number(m.potassium_mg || 0);
			summary.vitamin_a += Number(m.vit_a_ug || 0);
			summary.vitamin_b12 += Number(m.vit_b12_ug || 0);
			summary.vitamin_d += Number(m.vit_d_ug || 0);
			summary.omega3 += Number(m.omega3_g || 0);
		}
		summary.total_calories = Math.round(summary.total_calories);
		summary.total_protein = Math.round(summary.total_protein);
		summary.total_carbs = Math.round(summary.total_carbs);
		summary.total_fat = Math.round(summary.total_fat);
		summary.total_fiber = Math.round(summary.total_fiber);
		summary.total_sugar = Math.round(summary.total_sugar);
		summary.sodium = Math.round(summary.sodium);
		let calorieTarget = 2e3;
		let proteinTarget = 120;
		let waterTarget = 8;
		try {
			const pStmt = db.prepare(`SELECT daily_calorie_target, protein_target_g, water_target_glasses FROM profile LIMIT 1`);
			if (pStmt.step()) {
				const row = pStmt.getAsObject();
				if (Number(row.daily_calorie_target) > 0) calorieTarget = Number(row.daily_calorie_target);
				if (Number(row.protein_target_g) > 0) proteinTarget = Number(row.protein_target_g);
				if (Number(row.water_target_glasses) > 0) waterTarget = Number(row.water_target_glasses);
			}
			pStmt.free();
		} catch {}
		summary.goal_completion = calorieTarget > 0 ? Math.round(summary.total_calories / calorieTarget * 100) : 0;
		const macroSubScore = Math.min(60, summary.total_protein / proteinTarget * 35 + summary.total_fiber / 25 * 25);
		const microSubScore = Math.min(40, (summary.iron / 18 + summary.calcium / 1e3 + summary.vitamin_a / 900 + summary.vitamin_d / 20) * 10);
		summary.nutrition_score = summary.total_calories > 0 ? Math.min(100, Math.round(macroSubScore + microSubScore)) : 0;
		const waterPart = Math.min(20, summary.total_water / waterTarget * 20);
		const calAdherencePart = summary.total_calories > 0 ? Math.max(0, 30 - Math.abs(100 - summary.goal_completion) * .3) : 0;
		summary.health_score = summary.total_calories > 0 ? Math.min(100, Math.round(summary.nutrition_score * .5 + waterPart + calAdherencePart)) : 0;
		db.run(`INSERT OR REPLACE INTO daily_nutrition_summary (
        date, total_calories, total_protein, total_carbs, total_fat, total_fiber, total_sugar, total_water,
        vitamin_a, vitamin_c, vitamin_d, vitamin_e, vitamin_k, vitamin_b1, vitamin_b2, vitamin_b3, vitamin_b5,
        vitamin_b6, vitamin_b7, vitamin_b9, vitamin_b12, calcium, iron, magnesium, potassium, sodium,
        phosphorus, zinc, copper, selenium, manganese, choline, omega3, omega6, meal_count, nutrition_score,
        health_score, goal_completion, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			summary.date,
			summary.total_calories,
			summary.total_protein,
			summary.total_carbs,
			summary.total_fat,
			summary.total_fiber,
			summary.total_sugar,
			summary.total_water,
			summary.vitamin_a,
			summary.vitamin_c,
			summary.vitamin_d,
			summary.vitamin_e,
			summary.vitamin_k,
			summary.vitamin_b1,
			summary.vitamin_b2,
			summary.vitamin_b3,
			summary.vitamin_b5,
			summary.vitamin_b6,
			summary.vitamin_b7,
			summary.vitamin_b9,
			summary.vitamin_b12,
			summary.calcium,
			summary.iron,
			summary.magnesium,
			summary.potassium,
			summary.sodium,
			summary.phosphorus,
			summary.zinc,
			summary.copper,
			summary.selenium,
			summary.manganese,
			summary.choline,
			summary.omega3,
			summary.omega6,
			summary.meal_count,
			summary.nutrition_score,
			summary.health_score,
			summary.goal_completion,
			summary.last_updated
		]);
		persistDatabase(db);
		return summary;
	} catch (err) {
		console.error("[SQLite] Error updating daily nutrition summary:", err);
		return null;
	}
}
async function saveStepsToSQLite(day, steps, distanceKm = 0, caloriesBurned = 0, activeMinutes = 0, goalCompletion = 0) {
	const db = await getSQLiteDB();
	if (!db) return;
	try {
		const lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
		db.run(`INSERT OR REPLACE INTO steps_logs (
        day, steps, distance_km, calories_burned, active_minutes, goal_completion, last_updated, synced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`, [
			day,
			steps,
			distanceKm,
			caloriesBurned,
			activeMinutes,
			goalCompletion,
			lastUpdated
		]);
		persistDatabase(db);
	} catch (err) {
		console.error("[SQLite] Error saving steps log:", err);
	}
}
function addToSyncQueue(db, action, tableName, recordId, payload) {
	try {
		const id = `queue-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
		db.run(`INSERT INTO sync_queue (id, action, table_name, record_id, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)`, [
			id,
			action,
			tableName,
			recordId,
			JSON.stringify(payload),
			(/* @__PURE__ */ new Date()).toISOString()
		]);
	} catch (err) {
		console.warn("[SQLite] Sync queue insert note:", err);
	}
}
async function getSyncQueueFromSQLite() {
	const db = await getSQLiteDB();
	if (!db) return [];
	try {
		const stmt = db.prepare(`SELECT * FROM sync_queue ORDER BY created_at ASC`);
		const queue = [];
		while (stmt.step()) {
			const row = stmt.getAsObject();
			queue.push({
				id: String(row.id || ""),
				action: String(row.action || ""),
				table_name: String(row.table_name || ""),
				record_id: String(row.record_id || ""),
				payload: row.payload ? JSON.parse(String(row.payload)) : null,
				created_at: String(row.created_at || "")
			});
		}
		stmt.free();
		return queue;
	} catch (err) {
		console.error("[SQLite] Error reading sync queue:", err);
		return [];
	}
}
async function removeSyncQueueItemFromSQLite(queueId) {
	const db = await getSQLiteDB();
	if (!db) return;
	try {
		db.run(`DELETE FROM sync_queue WHERE id = ?`, [queueId]);
		persistDatabase(db);
	} catch (err) {
		console.error("[SQLite] Error removing queue item:", err);
	}
}
var NUTRILENS_DATA_CHANGED_EVENT = "nutrilens-data-changed";
var NUTRILENS_SYNC_STATUS_EVENT = "nutrilens-sync-status";
var syncStatusState = {
	isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
	isSyncing: false,
	pendingCount: 0,
	lastSyncedAt: null
};
function notifyDataChanged() {
	if (typeof window !== "undefined") setTimeout(() => {
		window.dispatchEvent(new CustomEvent(NUTRILENS_DATA_CHANGED_EVENT));
		updateSyncCount();
	}, 0);
}
function updateSyncStatus(update) {
	syncStatusState = {
		...syncStatusState,
		...update
	};
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(NUTRILENS_SYNC_STATUS_EVENT, { detail: syncStatusState }));
}
async function updateSyncCount() {
	try {
		updateSyncStatus({ pendingCount: (await getSyncQueueFromSQLite()).length });
	} catch {}
}
async function processSyncQueue() {
	if (typeof window === "undefined") return;
	if (!navigator.onLine || syncStatusState.isSyncing) return;
	try {
		const queue = await getSyncQueueFromSQLite();
		if (queue.length === 0) {
			updateSyncStatus({
				isSyncing: false,
				pendingCount: 0
			});
			return;
		}
		updateSyncStatus({
			isSyncing: true,
			pendingCount: queue.length
		});
		const { data: { session } } = await supabase.auth.getSession();
		const userId = session?.user?.id;
		for (const item of queue) try {
			if (item.table_name === "meals") {
				if (item.action === "insert" || item.action === "upsert") {
					const meal = item.payload;
					if (userId) await supabase.from("meals").upsert({
						id: typeof meal.id === "string" && meal.id.startsWith("local-") ? void 0 : meal.id,
						user_id: userId,
						name: String(meal.name || ""),
						source: meal.source || "manual",
						confidence: meal.confidence ? Number(meal.confidence) : null,
						serving_desc: meal.serving_desc ? String(meal.serving_desc) : null,
						calories: Number(meal.calories || 0),
						protein_g: Number(meal.protein_g || 0),
						carbs_g: Number(meal.carbs_g || 0),
						fat_g: Number(meal.fat_g || 0),
						fiber_g: Number(meal.fiber_g || 0),
						sugar_g: Number(meal.sugar_g || 0),
						sodium_mg: Number(meal.sodium_mg || 0),
						eaten_at: String(meal.eaten_at || ""),
						eaten_on: String(meal.eaten_on || "")
					});
				} else if (item.action === "delete") {
					if (userId && !item.record_id.startsWith("local-")) await supabase.from("meals").delete().eq("id", item.record_id);
				}
			} else if (item.table_name === "profile") {
				if (userId) {
					const prof = item.payload;
					await supabase.from("profiles").upsert({
						user_id: userId,
						display_name: String(prof.display_name || ""),
						gender: String(prof.gender || "other"),
						age: Number(prof.age || 25),
						height_cm: Number(prof.height_cm || 170),
						weight_kg: Number(prof.weight_kg || 70),
						goal_weight_kg: Number(prof.goal_weight_kg || 70),
						activity: prof.activity || "moderate",
						goal: prof.goal || "maintenance",
						diet: prof.diet || "non_veg",
						daily_calorie_target: Number(prof.daily_calorie_target || 2e3),
						protein_target_g: Number(prof.protein_target_g || 120),
						water_target_glasses: Number(prof.water_target_glasses || 8),
						onboarded: Boolean(prof.onboarded)
					});
				}
			} else if (item.table_name === "water_logs") {
				if (userId) {
					const { day, glasses } = item.payload;
					await supabase.from("water_logs").upsert({
						user_id: userId,
						day,
						glasses
					});
				}
			}
			await removeSyncQueueItemFromSQLite(item.id);
		} catch (itemErr) {
			console.warn("[SyncManager] Failed to sync queue item:", item.id, itemErr);
		}
		updateSyncStatus({
			isSyncing: false,
			pendingCount: (await getSyncQueueFromSQLite()).length,
			lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (err) {
		console.warn("[SyncManager] Sync cycle note:", err);
		updateSyncStatus({ isSyncing: false });
	}
}
if (typeof window !== "undefined") {
	window.addEventListener("online", () => {
		updateSyncStatus({ isOnline: true });
		processSyncQueue();
	});
	window.addEventListener("offline", () => {
		updateSyncStatus({
			isOnline: false,
			isSyncing: false
		});
	});
	getSQLiteDB().then(() => {
		updateSyncCount();
		if (navigator.onLine) processSyncQueue();
	});
}
var hasStorage = () => typeof window !== "undefined" || typeof localStorage !== "undefined";
var activeUserId = null;
var LocalStore = {
	setAccount(userId) {
		activeUserId = userId || null;
		if (hasStorage()) try {
			if (userId) localStorage.setItem("nutrilens_active_user_id", userId);
			else localStorage.removeItem("nutrilens_active_user_id");
		} catch {}
	},
	getActiveUserId() {
		if (activeUserId) return activeUserId;
		if (hasStorage()) try {
			const stored = localStorage.getItem("nutrilens_active_user_id");
			if (stored) {
				activeUserId = stored;
				return stored;
			}
		} catch {}
		return null;
	},
	getProfileKey() {
		const uid = this.getActiveUserId();
		return uid ? `nutrilens_profile_${uid}` : "nutrilens_local_profile_v3";
	},
	getMealsKey() {
		const uid = this.getActiveUserId();
		return uid ? `nutrilens_meals_${uid}` : "nutrilens_local_meals_v3";
	},
	getWaterKey(day) {
		const uid = this.getActiveUserId();
		return uid ? `nutrilens_water_${uid}_${day}` : `nutrilens_local_water_v3_${day}`;
	},
	getStepsKey(day) {
		const uid = this.getActiveUserId();
		return uid ? `nutrilens_steps_${uid}_${day}` : `nutrilens_local_steps_v3_${day}`;
	},
	getSteps(day) {
		if (!hasStorage()) return 0;
		try {
			const scopedKey = this.getStepsKey(day);
			let raw = localStorage.getItem(scopedKey);
			if (!raw && !this.getActiveUserId()) raw = localStorage.getItem(`nutrilens_local_steps_v3_${day}`);
			return raw ? Number(raw) : 0;
		} catch {
			return 0;
		}
	},
	saveSteps(day, steps, extraMetrics) {
		if (!hasStorage()) return 0;
		try {
			const sanitized = Math.max(0, Math.round(steps));
			localStorage.setItem(this.getStepsKey(day), String(sanitized));
			const weight = extraMetrics?.weightKg || 70;
			const height = extraMetrics?.heightCm || 175;
			const target = extraMetrics?.targetSteps || 8e3;
			const strideMeters = height * .414 / 100;
			saveStepsToSQLite(day, sanitized, Number((sanitized * strideMeters / 1e3).toFixed(2)), Number((sanitized * weight * 6125e-7).toFixed(1)), Math.round(sanitized / 100), Math.min(100, Math.round(sanitized / Math.max(1, target) * 100)));
			notifyDataChanged();
			return sanitized;
		} catch {
			return 0;
		}
	},
	addSteps(day, increment) {
		const current = this.getSteps(day);
		return this.saveSteps(day, current + increment);
	},
	getProfile() {
		if (!hasStorage()) return null;
		try {
			const scopedKey = this.getProfileKey();
			let raw = localStorage.getItem(scopedKey);
			if (!raw) raw = localStorage.getItem("nutrilens_local_profile_v3");
			if (!raw) return null;
			return JSON.parse(raw);
		} catch {
			return null;
		}
	},
	saveProfile(profile) {
		if (!hasStorage()) return;
		try {
			if (profile.user_id && !activeUserId) this.setAccount(profile.user_id);
			localStorage.setItem(this.getProfileKey(), JSON.stringify(profile));
			saveProfileToSQLite(profile);
			notifyDataChanged();
		} catch {}
	},
	getMeals(day) {
		if (!hasStorage()) return [];
		try {
			const scopedKey = this.getMealsKey();
			let raw = localStorage.getItem(scopedKey);
			if (!raw && !this.getActiveUserId()) raw = localStorage.getItem("nutrilens_local_meals_v3");
			const meals = raw ? JSON.parse(raw) : [];
			if (day) return meals.filter((m) => {
				if (m.eaten_on) return m.eaten_on === day;
				if (m.eaten_at) return getLocalDateString(new Date(m.eaten_at)) === day;
				return false;
			});
			return meals;
		} catch {
			return [];
		}
	},
	setMeals(meals) {
		if (!hasStorage()) return;
		try {
			localStorage.setItem(this.getMealsKey(), JSON.stringify(meals.slice(0, 500)));
			notifyDataChanged();
		} catch {}
	},
	addMeal(meal) {
		const meals = this.getMeals();
		const eatenOn = meal.eaten_on || (meal.eaten_at ? getLocalDateString(new Date(meal.eaten_at)) : getLocalDateString());
		const uid = meal.user_id || this.getActiveUserId() || void 0;
		const newMeal = {
			...meal,
			user_id: uid,
			id: meal.id || `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			eaten_on: eatenOn
		};
		const existingIndex = meals.findIndex((m) => m.id === newMeal.id);
		if (existingIndex >= 0) meals[existingIndex] = newMeal;
		else meals.unshift(newMeal);
		if (hasStorage()) try {
			localStorage.setItem(this.getMealsKey(), JSON.stringify(meals.slice(0, 500)));
			saveMealToSQLite(newMeal).then(() => {
				updateDailyNutritionSummaryInSQLite(eatenOn);
			});
			notifyDataChanged();
		} catch {}
		return newMeal;
	},
	saveMeal(meal) {
		return this.addMeal(meal);
	},
	deleteMeal(id) {
		if (!hasStorage()) return;
		try {
			const eatenOn = this.getMeals().find((m) => m.id === id)?.eaten_on || getLocalDateString();
			const meals = this.getMeals().filter((m) => m.id !== id);
			localStorage.setItem(this.getMealsKey(), JSON.stringify(meals));
			deleteMealFromSQLite(id).then(() => {
				updateDailyNutritionSummaryInSQLite(eatenOn);
			});
			notifyDataChanged();
		} catch {}
	},
	getWater(day) {
		if (!hasStorage()) return 0;
		try {
			const scopedKey = this.getWaterKey(day);
			let raw = localStorage.getItem(scopedKey);
			if (!raw && !this.getActiveUserId()) raw = localStorage.getItem(`nutrilens_local_water_v3_${day}`);
			return raw ? Number(raw) : 0;
		} catch {
			return 0;
		}
	},
	addWater(arg1, arg2) {
		if (!hasStorage()) return 0;
		try {
			let day;
			let glasses = 1;
			if (typeof arg1 === "number") {
				glasses = arg1;
				day = arg2 || getLocalDateString();
			} else {
				day = arg1 || getLocalDateString();
				glasses = typeof arg2 === "number" ? Number(arg2) || 1 : 1;
			}
			const cur = Math.max(0, Math.round((this.getWater(day) + glasses) * 100) / 100);
			localStorage.setItem(this.getWaterKey(day), String(cur));
			saveWaterToSQLite(day, cur);
			updateDailyNutritionSummaryInSQLite(day);
			notifyDataChanged();
			return cur;
		} catch {
			return 0;
		}
	},
	setWater(day, totalGlasses) {
		if (!hasStorage()) return 0;
		try {
			const cur = Math.max(0, Math.round((Number(totalGlasses) || 0) * 100) / 100);
			localStorage.setItem(this.getWaterKey(day), String(cur));
			saveWaterToSQLite(day, cur);
			updateDailyNutritionSummaryInSQLite(day);
			notifyDataChanged();
			return cur;
		} catch {
			return 0;
		}
	},
	setSteps(day, steps) {
		return this.saveSteps(day, steps);
	},
	getDailySummary(dayStr) {
		const meals = this.getMeals(dayStr);
		const water = this.getWater(dayStr);
		const steps = this.getSteps(dayStr);
		if (meals.length === 0 && water === 0) return {
			day: dayStr,
			hasData: false,
			calories: 0,
			protein_g: 0,
			carbs_g: 0,
			fat_g: 0,
			fiber_g: 0,
			sugar_g: 0,
			sodium_mg: 0,
			iron_mg: 0,
			calcium_mg: 0,
			magnesium_mg: 0,
			potassium_mg: 0,
			vit_a_ug: 0,
			vit_b12_ug: 0,
			vit_d_ug: 0,
			omega3_g: 0,
			water_glasses: 0,
			steps,
			meal_count: 0,
			score: 0,
			meals: []
		};
		const totals = meals.reduce((acc, m) => {
			acc.calories += Number(m.calories || 0);
			acc.protein_g += Number(m.protein_g || 0);
			acc.carbs_g += Number(m.carbs_g || 0);
			acc.fat_g += Number(m.fat_g || 0);
			acc.fiber_g += Number(m.fiber_g || 0);
			acc.sugar_g += Number(m.sugar_g || 0);
			acc.sodium_mg += Number(m.sodium_mg || 0);
			acc.iron_mg += Number(m.iron_mg || 0);
			acc.calcium_mg += Number(m.calcium_mg || 0);
			acc.magnesium_mg += Number(m.magnesium_mg || 0);
			acc.potassium_mg += Number(m.potassium_mg || 0);
			acc.vit_a_ug += Number(m.vit_a_ug || 0);
			acc.vit_b12_ug += Number(m.vit_b12_ug || 0);
			acc.vit_d_ug += Number(m.vit_d_ug || 0);
			acc.omega3_g += Number(m.omega3_g || 0);
			return acc;
		}, {
			calories: 0,
			protein_g: 0,
			carbs_g: 0,
			fat_g: 0,
			fiber_g: 0,
			sugar_g: 0,
			sodium_mg: 0,
			iron_mg: 0,
			calcium_mg: 0,
			magnesium_mg: 0,
			potassium_mg: 0,
			vit_a_ug: 0,
			vit_b12_ug: 0,
			vit_d_ug: 0,
			omega3_g: 0
		});
		const score = Math.min(100, Math.round((totals.calories > 0 ? 40 : 0) + Math.min(30, totals.protein_g / 100 * 30) + Math.min(15, totals.fiber_g / 25 * 15) + Math.min(15, totals.iron_mg + totals.calcium_mg + totals.magnesium_mg > 0 ? 15 : 0)));
		return {
			day: dayStr,
			hasData: true,
			calories: Math.round(totals.calories),
			protein_g: Math.round(totals.protein_g),
			carbs_g: Math.round(totals.carbs_g),
			fat_g: Math.round(totals.fat_g),
			fiber_g: Math.round(totals.fiber_g),
			sugar_g: Math.round(totals.sugar_g),
			sodium_mg: Math.round(totals.sodium_mg),
			iron_mg: Number(totals.iron_mg.toFixed(1)),
			calcium_mg: Number(totals.calcium_mg.toFixed(1)),
			magnesium_mg: Number(totals.magnesium_mg.toFixed(1)),
			potassium_mg: Number(totals.potassium_mg.toFixed(1)),
			vit_a_ug: Number(totals.vit_a_ug.toFixed(1)),
			vit_b12_ug: Number(totals.vit_b12_ug.toFixed(1)),
			vit_d_ug: Number(totals.vit_d_ug.toFixed(1)),
			omega3_g: Number(totals.omega3_g.toFixed(1)),
			water_glasses: water,
			steps,
			meal_count: meals.length,
			score,
			meals
		};
	},
	getAllLoggedDates() {
		const meals = this.getMeals();
		const dates = /* @__PURE__ */ new Set();
		for (const m of meals) {
			const d = m.eaten_on || (m.eaten_at ? getLocalDateString(new Date(m.eaten_at)) : "");
			if (d) dates.add(d);
		}
		if (hasStorage()) {
			const uid = this.getActiveUserId();
			const waterPrefix = uid ? `nutrilens_water_${uid}_` : "nutrilens_local_water_v3_";
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith(waterPrefix)) {
					const d = key.replace(waterPrefix, "");
					if (d) dates.add(d);
				}
			}
		}
		return Array.from(dates).sort().reverse();
	},
	clearActiveAccount() {
		activeUserId = null;
		if (hasStorage()) try {
			localStorage.removeItem("nutrilens_active_user_id");
		} catch {}
	},
	clearAll() {
		this.clearActiveAccount();
	}
};
var Route$10 = createFileRoute("/_authenticated/analytics")({
	head: () => ({ meta: [{ title: "Nutrition Analytics — NutriLens" }] }),
	component: AnalyticsPage
});
function AnalyticsPage() {
	const [daysFilter, setDaysFilter] = (0, import_react.useState)(30);
	const [localVersion, setLocalVersion] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const handleDataChange = () => {
			setLocalVersion((v) => v + 1);
		};
		window.addEventListener("nutrilens-data-changed", handleDataChange);
		return () => window.removeEventListener("nutrilens-data-changed", handleDataChange);
	}, []);
	const macroFn = useServerFn(getMacroTrend);
	const microFn = useServerFn(getMicroTrend);
	const wtFn = useServerFn(getWeightTrend);
	const macroQ = useQuery({
		queryKey: ["macros", daysFilter],
		queryFn: () => macroFn({ data: { days: daysFilter } })
	});
	const microQ = useQuery({
		queryKey: ["micros", daysFilter],
		queryFn: () => microFn({ data: { days: daysFilter } })
	});
	const wtQ = useQuery({
		queryKey: ["weights", 60],
		queryFn: () => wtFn({ data: { days: 60 } })
	});
	const combinedMacroTrend = (0, import_react.useMemo)(() => {
		const today = /* @__PURE__ */ new Date();
		const map = /* @__PURE__ */ new Map();
		for (let i = daysFilter - 1; i >= 0; i--) {
			const d = new Date(today);
			d.setDate(today.getDate() - i);
			const dKey = getLocalDateString(d);
			map.set(dKey, {
				day: dKey,
				calories: 0,
				protein_g: 0,
				carbs_g: 0,
				fat_g: 0
			});
		}
		if (macroQ.data && macroQ.data.length > 0) for (const r of macroQ.data) {
			const dKey = String(r.day);
			if (map.has(dKey)) {
				const existing = map.get(dKey);
				existing.calories = Number(r.calories || 0);
				existing.protein_g = Number(r.protein_g || 0);
				existing.carbs_g = Number(r.carbs_g || 0);
				existing.fat_g = Number(r.fat_g || 0);
			}
		}
		else {
			const localMeals = LocalStore.getMeals();
			for (const m of localMeals) {
				const dKey = m.eaten_on || (m.eaten_at ? getLocalDateString(new Date(m.eaten_at)) : "");
				if (map.has(dKey)) {
					const entry = map.get(dKey);
					entry.calories += Number(m.calories || 0);
					entry.protein_g += Number(m.protein_g || 0);
					entry.carbs_g += Number(m.carbs_g || 0);
					entry.fat_g += Number(m.fat_g || 0);
				}
			}
		}
		return Array.from(map.values()).map((r) => ({
			...r,
			calories: Math.round(r.calories),
			protein_g: Math.round(r.protein_g),
			carbs_g: Math.round(r.carbs_g),
			fat_g: Math.round(r.fat_g)
		}));
	}, [
		macroQ.data,
		daysFilter,
		localVersion
	]);
	const summaryStats = (0, import_react.useMemo)(() => {
		if (combinedMacroTrend.length === 0) return {
			avgCals: 0,
			avgProtein: 0,
			avgCarbs: 0,
			avgFat: 0
		};
		const loggedDays = combinedMacroTrend.filter((d) => d.calories > 0);
		const count = Math.max(1, loggedDays.length);
		const totalCals = loggedDays.reduce((acc, d) => acc + d.calories, 0);
		const totalProt = loggedDays.reduce((acc, d) => acc + d.protein_g, 0);
		const totalCarbs = loggedDays.reduce((acc, d) => acc + d.carbs_g, 0);
		const totalFat = loggedDays.reduce((acc, d) => acc + d.fat_g, 0);
		return {
			avgCals: Math.round(totalCals / count),
			avgProtein: Math.round(totalProt / count),
			avgCarbs: Math.round(totalCarbs / count),
			avgFat: Math.round(totalFat / count)
		};
	}, [combinedMacroTrend]);
	const microBarData = (0, import_react.useMemo)(() => {
		const nutKeys = Object.keys(RDA);
		if (microQ.data?.rows && microQ.data.rows.length > 0) {
			const logged = microQ.data.rows.filter((r) => Number(r.meal_count ?? 0) > 0);
			const count = Math.max(1, logged.length);
			return nutKeys.map((nut) => {
				const total = logged.reduce((s, r) => s + Number(r[nut] ?? 0), 0);
				const avg = logged.length > 0 ? total / count : 0;
				const pct = Math.min(180, Math.round(avg / RDA[nut] * 100));
				return {
					name: MICRO_LABELS[nut].replace("Vitamin ", "Vit "),
					pct,
					unit: MICRO_UNITS[nut],
					rda: RDA[nut]
				};
			});
		}
		const localMeals = LocalStore.getMeals();
		return nutKeys.map((nut) => {
			const localTotal = localMeals.reduce((sum, m) => sum + Number(m[nut] || 0), 0);
			const count = localMeals.length > 0 ? 1 : 0;
			const avg = count > 0 ? localTotal / count : 0;
			const pct = Math.min(180, Math.round(avg / RDA[nut] * 100));
			return {
				name: MICRO_LABELS[nut].replace("Vitamin ", "Vit "),
				pct,
				unit: MICRO_UNITS[nut],
				rda: RDA[nut]
			};
		});
	}, [microQ.data, localVersion]);
	const latestWeight = (0, import_react.useMemo)(() => {
		if (!wtQ.data || wtQ.data.length === 0) return null;
		return wtQ.data[wtQ.data.length - 1];
	}, [wtQ.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-20 animate-in fade-in duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded-[20px] bg-gradient-to-br from-emerald-500/20 via-primary/10 to-teal-500/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(0,229,143,0.25)] shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-6 w-6 text-primary animate-pulse" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Analytics & Intelligence"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight",
						children: "Nutritional Trends"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center rounded-[22px] bg-card/60 backdrop-blur-xl p-1.5 border border-border/80 shadow-lg shrink-0 self-start sm:self-auto",
					children: [
						7,
						14,
						30,
						60
					].map((days) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setDaysFilter(days),
						className: `rounded-[18px] px-3.5 py-2 text-xs font-extrabold transition-all duration-300 active:scale-95 ${daysFilter === days ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,229,143,0.4)]" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
						children: [days, "D"]
					}, days))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Avg Daily Cals",
						value: summaryStats.avgCals,
						unit: "kcal",
						sub: "Target: 2,000",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-amber-500" }),
						borderClass: "border-amber-500/30",
						bgClass: "bg-amber-500/5",
						textColor: "text-amber-400"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Avg Protein",
						value: summaryStats.avgProtein,
						unit: "g/day",
						sub: "Target: 140g",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-4 w-4 text-emerald-500" }),
						borderClass: "border-emerald-500/30",
						bgClass: "bg-emerald-500/5",
						textColor: "text-emerald-400"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Avg Carbs",
						value: summaryStats.avgCarbs,
						unit: "g/day",
						sub: "Target: 220g",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-blue-500" }),
						borderClass: "border-blue-500/30",
						bgClass: "bg-blue-500/5",
						textColor: "text-blue-400"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Avg Fat",
						value: summaryStats.avgFat,
						unit: "g/day",
						sub: "Target: 65g",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-purple-500" }),
						borderClass: "border-purple-500/30",
						bgClass: "bg-purple-500/5",
						textColor: "text-purple-400"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				title: `Calories Intake — Last ${daysFilter} Days`,
				subtitle: "Daily energy intake versus recommended baseline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: combinedMacroTrend,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "calGradient",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "5%",
										stopColor: "#00E58F",
										stopOpacity: .4
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "95%",
										stopColor: "#00E58F",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									opacity: .1,
									stroke: "#ffffff"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									tick: {
										fontSize: 10,
										fill: "#9ca3af"
									},
									tickFormatter: (d) => String(d).slice(5)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
									fontSize: 10,
									fill: "#9ca3af"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										backgroundColor: "rgba(10, 15, 12, 0.9)",
										borderColor: "rgba(0, 229, 143, 0.3)",
										borderRadius: "16px",
										backdropFilter: "blur(12px)",
										boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
										color: "#ffffff",
										fontSize: "12px",
										fontWeight: "bold"
									},
									formatter: (v) => [`${v} kcal`, "Calories"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "calories",
									stroke: "#00E58F",
									strokeWidth: 3,
									fillOpacity: 1,
									fill: "url(#calGradient)",
									activeDot: {
										r: 6,
										fill: "#00E58F",
										stroke: "#ffffff",
										strokeWidth: 2
									},
									dot: {
										r: 2,
										fill: "#00E58F"
									}
								})
							]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				title: "Macronutrients Balance — Protein, Carbs, Fat (g)",
				subtitle: "Daily distribution of energy sources",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: combinedMacroTrend,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									opacity: .1,
									stroke: "#ffffff"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									tick: {
										fontSize: 10,
										fill: "#9ca3af"
									},
									tickFormatter: (d) => String(d).slice(5)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
									fontSize: 10,
									fill: "#9ca3af"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									backgroundColor: "rgba(10, 15, 12, 0.9)",
									borderColor: "rgba(255, 255, 255, 0.15)",
									borderRadius: "16px",
									backdropFilter: "blur(12px)",
									boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
									color: "#ffffff",
									fontSize: "12px"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: {
									fontSize: 11,
									paddingTop: 10
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									name: "Protein (g)",
									type: "monotone",
									dataKey: "protein_g",
									stroke: "#10b981",
									strokeWidth: 2.5,
									dot: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									name: "Carbs (g)",
									type: "monotone",
									dataKey: "carbs_g",
									stroke: "#6366f1",
									strokeWidth: 2.5,
									dot: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									name: "Fat (g)",
									type: "monotone",
									dataKey: "fat_g",
									stroke: "#f43f5e",
									strokeWidth: 2.5,
									dot: false
								})
							]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				title: "Micronutrient Target Sufficiency (% of RDA)",
				subtitle: "Average daily intake vs Recommended Daily Allowance",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: microBarData,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									opacity: .1,
									stroke: "#ffffff"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tick: {
										fontSize: 10,
										fill: "#9ca3af"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fontSize: 10,
										fill: "#9ca3af"
									},
									domain: [0, 150]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										backgroundColor: "rgba(10, 15, 12, 0.9)",
										borderColor: "rgba(0, 229, 143, 0.3)",
										borderRadius: "16px",
										backdropFilter: "blur(12px)",
										boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
										color: "#ffffff",
										fontSize: "12px",
										fontWeight: "bold"
									},
									formatter: (v) => [`${v}% RDA`, "Achieved"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "pct",
									fill: "#00E58F",
									radius: [
										8,
										8,
										0,
										0
									]
								})
							]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-foreground",
						children: "RDA References:"
					}), Object.keys(RDA).map((k) => `${MICRO_LABELS[k]}: ${RDA[k]}${MICRO_UNITS[k]}`).join(" • ")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				title: "Weight Tracking — Last 60 Days",
				subtitle: "Body mass trajectory and trendline over time",
				children: [
					latestWeight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between bg-primary/10 border border-primary/20 rounded-[18px] p-3 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-bold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-4 w-4 text-primary" }), " Current Recorded Weight"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-display text-lg font-extrabold text-primary font-mono",
							children: [latestWeight.weight_kg, " kg"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-48 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: wtQ.data ?? [],
								margin: {
									top: 10,
									right: 10,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .1,
										stroke: "#ffffff"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										tick: {
											fontSize: 10,
											fill: "#9ca3af"
										},
										tickFormatter: (d) => String(d).slice(5)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fontSize: 10,
											fill: "#9ca3af"
										},
										domain: ["auto", "auto"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										backgroundColor: "rgba(10, 15, 12, 0.9)",
										borderColor: "rgba(6, 182, 212, 0.3)",
										borderRadius: "16px",
										backdropFilter: "blur(12px)",
										color: "#ffffff",
										fontSize: "12px",
										fontWeight: "bold"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "weight_kg",
										stroke: "#06b6d4",
										strokeWidth: 2.5,
										dot: {
											r: 4,
											fill: "#06b6d4"
										},
										activeDot: { r: 7 }
									})
								]
							})
						})
					}),
					(wtQ.data?.length ?? 0) === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-xs text-muted-foreground italic flex items-center gap-1.5 bg-muted/20 p-3 rounded-xl border border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-primary shrink-0" }), " No weight logs available yet. Update your health profile to track progress over time."]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] border border-primary/30 bg-primary/10 backdrop-blur-xl p-5 space-y-2 shadow-[0_0_25px_rgba(0,229,143,0.15)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-display text-xs font-extrabold uppercase tracking-wider text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 animate-pulse text-primary" }), " Nutrition Intelligence Verdict"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs sm:text-sm font-medium text-foreground leading-relaxed",
					children: [
						"Based on your ",
						daysFilter,
						"-day trend, your protein intake averages",
						" ",
						summaryStats.avgProtein,
						"g per day. Consistently keeping your protein target around 140g will accelerate muscle recovery and body re-composition."
					]
				})]
			})
		]
	});
}
function SummaryCard({ label, value, unit, sub, icon, borderClass, bgClass, textColor }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-[22px] border ${borderClass} ${bgClass} backdrop-blur-xl p-4 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs font-extrabold text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), icon]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `mt-2 font-display text-2xl font-extrabold ${textColor} tabular-nums`,
				children: [
					value,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-normal text-muted-foreground font-mono",
						children: unit
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-[10px] text-muted-foreground/80 font-mono",
				children: sub
			})
		]
	});
}
function GlassCard({ title, subtitle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[24px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl space-y-4 hover:border-primary/30 dark:hover:border-white/20 transition-all duration-300",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-base sm:text-lg font-extrabold text-foreground tracking-tight",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground mt-0.5",
			children: subtitle
		})] }), children]
	});
}
var Route$9 = createFileRoute("/_authenticated/calendar")({
	head: () => ({ meta: [{ title: "Nutrition & Activity Calendar — NutriLens" }] }),
	component: CalendarPage
});
var MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var WEEKDAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function CalendarPage() {
	const calFn = useServerFn(getCalendarRange);
	const dayFn = useServerFn(getDay);
	const todayObj = /* @__PURE__ */ new Date();
	const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;
	const [year, setYear] = (0, import_react.useState)(todayObj.getFullYear());
	const [month, setMonth] = (0, import_react.useState)(todayObj.getMonth());
	const [selectedDateStr, setSelectedDateStr] = (0, import_react.useState)(todayStr);
	const [localVersion, setLocalVersion] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const handleDataChange = () => {
			setLocalVersion((v) => v + 1);
		};
		window.addEventListener("nutrilens-data-changed", handleDataChange);
		return () => window.removeEventListener("nutrilens-data-changed", handleDataChange);
	}, []);
	const calQ = useQuery({
		queryKey: ["calendar", 3650],
		queryFn: () => calFn({ data: { days: 3650 } })
	});
	const dayQ = useQuery({
		queryKey: ["day", selectedDateStr],
		queryFn: () => dayFn({ data: { day: selectedDateStr } }),
		enabled: !!selectedDateStr
	});
	const aggregatedMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		if (calQ.data) for (const item of calQ.data) {
			const dKey = item.day;
			map.set(dKey, {
				calories: Number(item.calories || 0),
				protein_g: Number(item.protein_g || 0),
				carbs_g: Number(item.carbs_g || 0),
				fat_g: Number(item.fat_g || 0),
				fiber_g: Number(item.fiber_g || 0),
				sugar_g: Number(item.sugar_g || 0),
				sodium_mg: Number(item.sodium_mg || 0),
				iron_mg: Number(item.iron_mg || 0),
				calcium_mg: Number(item.calcium_mg || 0),
				magnesium_mg: Number(item.magnesium_mg || 0),
				potassium_mg: Number(item.potassium_mg || 0),
				vit_a_ug: Number(item.vit_a_ug || 0),
				vit_b12_ug: Number(item.vit_b12_ug || 0),
				vit_d_ug: Number(item.vit_d_ug || 0),
				omega3_g: Number(item.omega3_g || 0),
				water_glasses: Number(item.water_glasses || 0),
				steps: Number(item.steps || 0),
				meal_count: Number(item.meal_count || 0),
				score: Number(item.score || 0),
				meals: []
			});
		}
		const localMeals = LocalStore.getMeals();
		for (const m of localMeals) {
			const dKey = m.eaten_on || (m.eaten_at ? getLocalDateString(new Date(m.eaten_at)) : "");
			if (!dKey) continue;
			const existing = map.get(dKey);
			if (!existing) {
				const summary = LocalStore.getDailySummary(dKey);
				map.set(dKey, {
					calories: summary.calories,
					protein_g: summary.protein_g,
					carbs_g: summary.carbs_g,
					fat_g: summary.fat_g,
					fiber_g: summary.fiber_g,
					sugar_g: summary.sugar_g,
					sodium_mg: summary.sodium_mg,
					iron_mg: summary.iron_mg,
					calcium_mg: summary.calcium_mg,
					magnesium_mg: summary.magnesium_mg,
					potassium_mg: summary.potassium_mg,
					vit_a_ug: summary.vit_a_ug,
					vit_b12_ug: summary.vit_b12_ug,
					vit_d_ug: summary.vit_d_ug,
					omega3_g: summary.omega3_g,
					water_glasses: summary.water_glasses,
					steps: summary.steps,
					meal_count: summary.meal_count,
					score: summary.score,
					meals: summary.meals
				});
			} else if (!existing.meals.some((x) => x.id === m.id)) existing.meals.push(m);
		}
		for (const [dKey, entry] of map.entries()) {
			const w = LocalStore.getWater(dKey);
			if (w > 0) entry.water_glasses = Math.max(entry.water_glasses, w);
			const st = LocalStore.getSteps(dKey);
			if (st > 0) entry.steps = Math.max(entry.steps, st);
		}
		return map;
	}, [calQ.data, localVersion]);
	const daysInMonthGrid = (0, import_react.useMemo)(() => {
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startWeekday = firstDay.getDay();
		const totalDays = lastDay.getDate();
		const grid = [];
		for (let i = 0; i < startWeekday; i++) grid.push(null);
		for (let d = 1; d <= totalDays; d++) {
			const mm = String(month + 1).padStart(2, "0");
			const dd = String(d).padStart(2, "0");
			const dateStr = `${year}-${mm}-${dd}`;
			grid.push({
				dayNum: d,
				dateStr
			});
		}
		return grid;
	}, [year, month]);
	const prevMonth = () => {
		if (month === 0) {
			setMonth(11);
			setYear((y) => y - 1);
		} else setMonth((m) => m - 1);
	};
	const nextMonth = () => {
		if (month === 11) {
			setMonth(0);
			setYear((y) => y + 1);
		} else setMonth((m) => m + 1);
	};
	const selectedData = (0, import_react.useMemo)(() => {
		const localEntry = aggregatedMap.get(selectedDateStr);
		const serverRollup = dayQ.data?.rollup;
		const serverMeals = dayQ.data?.meals || [];
		const serverProfile = dayQ.data?.profile;
		const allMeals = [...localEntry?.meals || []];
		for (const sm of serverMeals) if (!allMeals.some((m) => m.id === sm.id)) {
			const mic = Array.isArray(sm.meal_micros) ? sm.meal_micros[0] : sm.meal_micros;
			allMeals.push({
				id: sm.id,
				eaten_at: sm.eaten_at,
				eaten_on: sm.eaten_on,
				name: sm.name,
				source: sm.source || "manual",
				serving_desc: sm.serving_desc || null,
				calories: Number(sm.calories || 0),
				protein_g: Number(sm.protein_g || 0),
				carbs_g: Number(sm.carbs_g || 0),
				fat_g: Number(sm.fat_g || 0),
				fiber_g: Number(sm.fiber_g || 0),
				sugar_g: Number(sm.sugar_g || 0),
				sodium_mg: Number(sm.sodium_mg || 0),
				iron_mg: Number(mic?.iron_mg || 0),
				calcium_mg: Number(mic?.calcium_mg || 0),
				magnesium_mg: Number(mic?.magnesium_mg || 0),
				potassium_mg: Number(mic?.potassium_mg || 0),
				vit_a_ug: Number(mic?.vit_a_ug || 0),
				vit_b12_ug: Number(mic?.vit_b12_ug || 0),
				vit_d_ug: Number(mic?.vit_d_ug || 0),
				omega3_g: Number(mic?.omega3_g || 0)
			});
		}
		const waterG = Math.max(Number(serverRollup?.water_glasses || 0), LocalStore.getWater(selectedDateStr));
		if (!(serverRollup ? Number(serverRollup.calories) > 0 || waterG > 0 : allMeals.length > 0 || waterG > 0)) return {
			hasData: false,
			totalCals: 0,
			totalProtein: 0,
			totalCarbs: 0,
			totalFat: 0,
			totalFiber: 0,
			totalSugar: 0,
			totalSodium: 0,
			totalIron: 0,
			totalCalcium: 0,
			totalMagnesium: 0,
			totalPotassium: 0,
			totalVitA: 0,
			totalVitB12: 0,
			totalVitD: 0,
			totalOmega3: 0,
			waterG: 0,
			score: 0,
			meals: [],
			targets: {
				calories: Number(serverProfile?.daily_calorie_target || 2e3),
				protein: Number(serverProfile?.protein_target_g || 120),
				water: Number(serverProfile?.water_target_glasses || 8)
			}
		};
		const totalCals = Math.round(serverRollup ? Number(serverRollup.calories || 0) : allMeals.reduce((acc, m) => acc + Number(m.calories || 0), 0));
		const totalProtein = Math.round(serverRollup ? Number(serverRollup.protein_g || 0) : allMeals.reduce((acc, m) => acc + Number(m.protein_g || 0), 0));
		const totalCarbs = Math.round(serverRollup ? Number(serverRollup.carbs_g || 0) : allMeals.reduce((acc, m) => acc + Number(m.carbs_g || 0), 0));
		const totalFat = Math.round(serverRollup ? Number(serverRollup.fat_g || 0) : allMeals.reduce((acc, m) => acc + Number(m.fat_g || 0), 0));
		const totalFiber = Math.round(serverRollup ? Number(serverRollup.fiber_g || 0) : allMeals.reduce((acc, m) => acc + Number(m.fiber_g || 0), 0));
		const totalSugar = Math.round(serverRollup ? Number(serverRollup.sugar_g || 0) : allMeals.reduce((acc, m) => acc + Number(m.sugar_g || 0), 0));
		const totalSodium = Math.round(serverRollup ? Number(serverRollup.sodium_mg || 0) : allMeals.reduce((acc, m) => acc + Number(m.sodium_mg || 0), 0));
		const totalIron = Number((serverRollup ? Number(serverRollup.iron_mg || 0) : allMeals.reduce((acc, m) => acc + Number(m.iron_mg || 0), 0)).toFixed(1));
		const totalCalcium = Number((serverRollup ? Number(serverRollup.calcium_mg || 0) : allMeals.reduce((acc, m) => acc + Number(m.calcium_mg || 0), 0)).toFixed(1));
		return {
			hasData: true,
			totalCals,
			totalProtein,
			totalCarbs,
			totalFat,
			totalFiber,
			totalSugar,
			totalSodium,
			totalIron,
			totalCalcium,
			totalMagnesium: Number((serverRollup ? Number(serverRollup.magnesium_mg || 0) : allMeals.reduce((acc, m) => acc + Number(m.magnesium_mg || 0), 0)).toFixed(1)),
			totalPotassium: Number((serverRollup ? Number(serverRollup.potassium_mg || 0) : allMeals.reduce((acc, m) => acc + Number(m.potassium_mg || 0), 0)).toFixed(1)),
			totalVitA: Number((serverRollup ? Number(serverRollup.vit_a_ug || 0) : allMeals.reduce((acc, m) => acc + Number(m.vit_a_ug || 0), 0)).toFixed(1)),
			totalVitB12: Number((serverRollup ? Number(serverRollup.vit_b12_ug || 0) : allMeals.reduce((acc, m) => acc + Number(m.vit_b12_ug || 0), 0)).toFixed(1)),
			totalVitD: Number((serverRollup ? Number(serverRollup.vit_d_ug || 0) : allMeals.reduce((acc, m) => acc + Number(m.vit_d_ug || 0), 0)).toFixed(1)),
			totalOmega3: Number((serverRollup ? Number(serverRollup.omega3_g || 0) : allMeals.reduce((acc, m) => acc + Number(m.omega3_g || 0), 0)).toFixed(1)),
			waterG,
			score: serverRollup ? Number(serverRollup.score || 0) : Math.min(100, Math.round((totalCals > 0 ? 40 : 0) + Math.min(30, totalProtein / 100 * 30) + Math.min(15, totalFiber / 25 * 15) + Math.min(15, totalIron + totalCalcium > 0 ? 15 : 0))),
			meals: allMeals,
			targets: {
				calories: Number(serverProfile?.daily_calorie_target || 2e3),
				protein: Number(serverProfile?.protein_target_g || 120),
				water: Number(serverProfile?.water_target_glasses || 8)
			}
		};
	}, [
		selectedDateStr,
		aggregatedMap,
		dayQ.data
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-20 animate-in fade-in duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded-[20px] bg-gradient-to-br from-emerald-500/20 via-primary/10 to-teal-500/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(0,229,143,0.25)] shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-6 w-6 text-primary animate-pulse" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Permanent Nutrition History"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight",
						children: [
							MONTH_NAMES[month],
							" ",
							year
						]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setYear(todayObj.getFullYear());
								setMonth(todayObj.getMonth());
								setSelectedDateStr(todayStr);
							},
							className: "rounded-[16px] border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all active:scale-95 shadow-[0_0_12px_rgba(0,229,143,0.15)] flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Today"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: year,
							onChange: (e) => setYear(Number(e.target.value)),
							className: "rounded-[16px] border border-border/80 bg-card/80 px-3 py-2 text-xs font-bold text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-md",
							children: [
								2024,
								2025,
								2026,
								2027,
								2028
							].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: y,
								className: "bg-card text-foreground",
								children: y
							}, y))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: month,
							onChange: (e) => setMonth(Number(e.target.value)),
							className: "rounded-[16px] border border-border/80 bg-card/80 px-3 py-2 text-xs font-bold text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-md",
							children: MONTH_NAMES.map((mName, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: idx,
								className: "bg-card text-foreground",
								children: mName
							}, mName))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center rounded-[18px] border border-border/80 bg-card/60 backdrop-blur-xl p-1 shadow-lg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: prevMonth,
									className: "rounded-[14px] p-2 hover:bg-muted/60 text-foreground transition-all active:scale-90",
									title: "Previous Month",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2 text-xs font-extrabold w-24 text-center text-foreground font-mono",
									children: [
										MONTH_NAMES[month].slice(0, 3),
										" ",
										year
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: nextMonth,
									className: "rounded-[14px] p-2 hover:bg-muted/60 text-foreground transition-all active:scale-90",
									title: "Next Month",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1 sm:gap-2 text-center border-b border-border/60 pb-2",
					children: WEEKDAYS.map((wd) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-1 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground/80",
						children: wd
					}, wd))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1 sm:gap-2 pt-1",
					children: daysInMonthGrid.map((item, idx) => {
						if (!item) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 sm:h-24 rounded-[14px] sm:rounded-[18px] bg-muted/5 border border-transparent" }, `empty-${idx}`);
						const { dayNum, dateStr } = item;
						const entry = aggregatedMap.get(dateStr);
						const cals = entry?.calories || 0;
						const mealCount = entry?.meals?.length || entry?.meal_count || 0;
						const waterCount = entry?.water_glasses || LocalStore.getWater(dateStr);
						const isToday = dateStr === todayStr;
						const isSelected = dateStr === selectedDateStr;
						const targetCal = LocalStore.getProfile()?.daily_calorie_target || 2e3;
						const stepCount = entry?.steps || LocalStore.getSteps(dateStr);
						const goalPct = cals > 0 ? Math.round(cals / targetCal * 100) : 0;
						let statusColor = "red";
						if (goalPct >= 90 || cals >= targetCal * .9) statusColor = "green";
						else if (cals > 0 || mealCount > 0 || waterCount > 0 || stepCount > 0) statusColor = "yellow";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelectedDateStr(dateStr),
							className: `group relative flex flex-col justify-between rounded-[14px] sm:rounded-[18px] p-1 sm:p-2.5 h-16 sm:h-24 text-left transition-all duration-300 active:scale-95 ${isSelected ? "border-2 border-primary bg-primary/15 shadow-[0_0_25px_rgba(0,229,143,0.3)] scale-[1.02] z-10" : isToday ? "border-2 border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_15px_rgba(0,229,143,0.2)]" : statusColor === "green" ? "border border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500 hover:-translate-y-0.5" : statusColor === "yellow" ? "border border-amber-500/40 bg-amber-500/10 hover:border-amber-500 hover:-translate-y-0.5" : "border border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-display text-[10px] sm:text-sm font-extrabold ${isToday ? "inline-flex h-4.5 w-4.5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_10px_#00E58F] text-[9px] sm:text-xs" : "text-foreground"}`,
										children: dayNum
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${statusColor === "green" ? "bg-emerald-400 shadow-[0_0_8px_#10B981]" : statusColor === "yellow" ? "bg-amber-400 shadow-[0_0_8px_#F59E0B]" : "bg-rose-500/60"}` })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 space-y-0.5 overflow-hidden",
									children: [cals > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-0.5 sm:gap-1 text-[8px] xs:text-[9.5px] sm:text-xs font-bold text-amber-400 truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums truncate",
											children: Math.round(cals)
										})]
									}) : mealCount > 0 || waterCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[8px] sm:text-[10px] text-amber-400 font-bold truncate",
										children: "Log"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[8px] sm:text-[10px] text-rose-400/70 font-medium truncate",
										children: "Empty"
									}), stepCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden sm:flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-[#00E58F] truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footprints, { className: "h-2.5 w-2.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums truncate font-mono",
											children: [stepCount.toLocaleString(), " steps"]
										})]
									})]
								}),
								entry && (entry.iron_mg > 0 || entry.calcium_mg > 0 || entry.vit_a_ug > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden md:flex gap-1 text-[8px] font-extrabold text-teal-400 bg-teal-500/10 px-1 py-0.5 rounded border border-teal-500/20 w-fit",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+Micro" })
								})
							]
						}, dateStr);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] font-extrabold uppercase tracking-widest text-primary flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Date Nutrition Log Record"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-extrabold text-foreground tracking-tight",
							children: (/* @__PURE__ */ new Date(selectedDateStr + "T00:00:00")).toLocaleDateString("en-US", {
								weekday: "long",
								month: "long",
								day: "numeric",
								year: "numeric"
							})
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-2.5",
							children: selectedData.hasData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3.5 py-1.5 text-xs font-bold text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3.5 w-3.5 text-amber-500" }),
										" ",
										selectedData.totalCals,
										" kcal"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3.5 py-1.5 text-xs font-bold text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplet, { className: "h-3.5 w-3.5 text-cyan-400" }),
										" ",
										selectedData.waterG,
										" Glasses"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-400 shadow-[0_0_12px_rgba(0,229,143,0.2)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3.5 w-3.5 text-emerald-400" }),
										" Score: ",
										selectedData.score,
										"/100"
									]
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-muted/30 border border-border px-3.5 py-1.5 text-xs font-bold text-muted-foreground",
								children: "No entries recorded for this date"
							})
						})]
					}),
					!selectedData.hasData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[20px] border border-dashed border-border/80 bg-card/30 p-5 text-center space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm font-bold text-foreground",
							children: ["Zero values logged for ", selectedDateStr]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No meals or water intake were saved on this calendar date. Historical integrity is preserved with zero numbers."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorStatCard, {
								label: "Calories",
								value: selectedData.totalCals,
								unit: "kcal",
								target: selectedData.targets.calories,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-amber-500" }),
								gradientClass: "from-amber-500 to-orange-400",
								borderClass: "border-amber-500/30",
								bgClass: "bg-amber-500/5",
								textColor: "text-amber-400"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorStatCard, {
								label: "Protein",
								value: selectedData.totalProtein,
								unit: "g",
								target: selectedData.targets.protein,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-4 w-4 text-emerald-500" }),
								gradientClass: "from-emerald-500 to-green-400",
								borderClass: "border-emerald-500/30",
								bgClass: "bg-emerald-500/5",
								textColor: "text-emerald-400"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorStatCard, {
								label: "Carbs",
								value: selectedData.totalCarbs,
								unit: "g",
								target: 220,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-blue-500" }),
								gradientClass: "from-blue-500 to-cyan-400",
								borderClass: "border-blue-500/30",
								bgClass: "bg-blue-500/5",
								textColor: "text-blue-400"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorStatCard, {
								label: "Fat",
								value: selectedData.totalFat,
								unit: "g",
								target: 65,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-purple-500" }),
								gradientClass: "from-purple-500 to-pink-400",
								borderClass: "border-purple-500/30",
								bgClass: "bg-purple-500/5",
								textColor: "text-purple-400"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[22px] border border-teal-500/30 bg-teal-500/5 backdrop-blur-xl p-5 space-y-4 shadow-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-teal-400 animate-pulse" }), " Advanced Vitamins & Minerals"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono font-bold text-teal-400/80 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full",
								children: "Daily Target RDA"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Fiber",
									value: selectedData.totalFiber,
									unit: "g",
									target: 30
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Sugar",
									value: selectedData.totalSugar,
									unit: "g",
									target: 38
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Sodium",
									value: selectedData.totalSodium,
									unit: "mg",
									target: 2300
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Iron",
									value: selectedData.totalIron,
									unit: "mg",
									target: 18
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Calcium",
									value: selectedData.totalCalcium,
									unit: "mg",
									target: 1e3
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Magnesium",
									value: selectedData.totalMagnesium,
									unit: "mg",
									target: 400
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Potassium",
									value: selectedData.totalPotassium,
									unit: "mg",
									target: 3500
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Vit A",
									value: selectedData.totalVitA,
									unit: "µg",
									target: 900
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Vit B12",
									value: selectedData.totalVitB12,
									unit: "µg",
									target: 2.4
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Vit D",
									value: selectedData.totalVitD,
									unit: "µg",
									target: 20
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicroStatBar, {
									label: "Omega 3",
									value: selectedData.totalOmega3,
									unit: "g",
									target: 1.6
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm font-extrabold text-foreground flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-primary" }),
									" Logged Meals & Scans for ",
									selectedDateStr
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-mono font-bold text-muted-foreground bg-muted/40 border border-border/60 px-2.5 py-0.5 rounded-full",
								children: [selectedData.meals.length, " Logged"]
							})]
						}), selectedData.meals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[22px] border border-dashed border-border/80 bg-card/40 p-8 text-center text-xs text-muted-foreground shadow-inner space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-8 w-8 text-muted-foreground/40 mx-auto" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-foreground",
									children: "0 meals logged on this date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px]",
									children: "You did not record any meals for this calendar date."
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: selectedData.meals.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[20px] border border-border/80 bg-card/60 backdrop-blur-xl p-4 shadow-lg hover:border-primary/50 hover:bg-card hover:-translate-y-0.5 transition-all duration-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-extrabold text-sm text-foreground group-hover:text-primary transition-colors",
												children: m.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md",
												children: m.source || "manual"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground font-medium flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-rose-400 font-semibold",
													children: [
														"P: ",
														m.protein_g,
														"g"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-amber-400 font-semibold",
													children: [
														"C: ",
														m.carbs_g,
														"g"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-emerald-400 font-semibold",
													children: [
														"F: ",
														m.fat_g,
														"g"
													]
												}),
												Boolean(m.fiber_g) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-teal-400 font-semibold",
													children: [
														"Fiber: ",
														m.fiber_g,
														"g"
													]
												})] })
											]
										}),
										(m.iron_mg || m.calcium_mg || m.magnesium_mg || m.potassium_mg) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5 flex flex-wrap gap-1.5 text-[10px] font-bold",
											children: [
												Boolean(m.iron_mg) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-amber-400",
													children: [
														"Iron: ",
														m.iron_mg,
														"mg"
													]
												}),
												Boolean(m.calcium_mg) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-blue-400",
													children: [
														"Calcium: ",
														m.calcium_mg,
														"mg"
													]
												}),
												Boolean(m.magnesium_mg) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-emerald-400",
													children: [
														"Magnesium: ",
														m.magnesium_mg,
														"mg"
													]
												}),
												Boolean(m.potassium_mg) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "rounded-lg bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-purple-400",
													children: [
														"Potassium: ",
														m.potassium_mg,
														"mg"
													]
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right font-display text-lg font-extrabold text-amber-400 tabular-nums shrink-0",
									children: [
										Math.round(Number(m.calories)),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-normal text-muted-foreground font-mono",
											children: "kcal"
										})
									]
								})]
							}, m.id || `m-${i}`))
						})]
					})
				]
			})
		]
	});
}
function ColorStatCard({ label, value, unit, target, icon, gradientClass, borderClass, bgClass, textColor }) {
	const percent = Math.min(100, Math.round(value / target * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-[20px] border ${borderClass} ${bgClass} backdrop-blur-xl p-4 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs font-bold text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), icon]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `mt-2 font-display text-2xl font-extrabold ${textColor} tabular-nums`,
				children: [
					value,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-normal text-muted-foreground font-mono",
						children: unit
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 w-full rounded-full bg-black/40 overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-500`,
						style: { width: `${percent}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[9px] text-muted-foreground/80 font-mono text-right",
					children: [
						percent,
						"% of ",
						target,
						unit
					]
				})]
			})
		]
	});
}
function MicroStatBar({ label, value, unit, target }) {
	const percent = Math.min(100, Math.round(value / target * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[18px] border border-border/80 bg-card/80 p-3 space-y-2 min-w-0 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-1 text-[11px] font-bold text-muted-foreground min-w-0 leading-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate uppercase tracking-tight text-foreground/90 font-black",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-teal-400 shrink-0 text-[10px] whitespace-nowrap font-bold",
					children: [
						value.toFixed(1),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] uppercase",
							children: unit
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 w-full rounded-full bg-black/40 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500",
					style: { width: `${percent}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[9px] text-muted-foreground/70 font-mono flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "whitespace-nowrap",
					children: [
						"Target: ",
						target,
						unit
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-bold",
					children: [percent, "%"]
				})]
			})
		]
	});
}
var $$splitComponentImporter$2 = () => import("./home-Cui42IeR.mjs");
var Route$8 = createFileRoute("/_authenticated/home")({
	head: () => ({ meta: [{ title: "Home — NutriLens" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./manual-i5nS4pdZ.mjs");
var Route$7 = createFileRoute("/_authenticated/manual")({
	head: () => ({ meta: [{ title: "Manual Meal & Ingredient Analyzer — NutriLens" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var Route$6 = createFileRoute("/_authenticated/meals")({
	head: () => ({ meta: [{ title: "AI Meal Generator — NutriLens" }] }),
	component: MealsPage
});
var MEAL_TYPES = [
	"Breakfast",
	"Lunch",
	"Dinner",
	"Snack",
	"Full Day Plan"
];
var DIET_TYPES = [
	{
		id: "Vegetarian",
		label: "Vegetarian"
	},
	{
		id: "Non-Vegetarian",
		label: "Non-Veg"
	},
	{
		id: "Vegan",
		label: "Vegan"
	},
	{
		id: "Eggetarian",
		label: "Eggetarian"
	},
	{
		id: "Custom",
		label: "Custom"
	}
];
var CUISINE_OPTIONS = [
	"Any",
	"Indian",
	"Mediterranean",
	"Asian",
	"Mexican",
	"Continental",
	"American"
];
var BUDGET_OPTIONS = [
	"low",
	"medium",
	"high"
];
var COOKING_TIME_OPTIONS = [
	"15 minutes",
	"30 minutes",
	"45 minutes",
	"60 minutes"
];
var mealCache = /* @__PURE__ */ new Map();
function MealsPage() {
	const profile = LocalStore.getProfile();
	const calorieTarget = profile?.daily_calorie_target || 2e3;
	const proteinTarget = profile?.protein_target_g || 120;
	const carbsTarget = Math.round(calorieTarget * .5 / 4);
	const fatTarget = Math.round(calorieTarget * .25 / 9);
	const [selectedMealType, setSelectedMealType] = (0, import_react.useState)("Lunch");
	const [selectedDiet, setSelectedDiet] = (0, import_react.useState)(() => {
		const d = (profile?.diet || "Vegetarian").toLowerCase();
		if (d.includes("non")) return "Non-Vegetarian";
		if (d.includes("vegan")) return "Vegan";
		if (d.includes("eggetarian") || d.includes("egg")) return "Eggetarian";
		return "Vegetarian";
	});
	const [cuisine, setCuisine] = (0, import_react.useState)("Any");
	const [availableIngredients, setAvailableIngredients] = (0, import_react.useState)("");
	const [foodsToAvoid, setFoodsToAvoid] = (0, import_react.useState)(() => {
		const ext = profile?.extended_data || {};
		const dislikes = Array.isArray(ext.disliked_foods) ? ext.disliked_foods : [];
		const allergies = Array.isArray(ext.allergies) ? ext.allergies : [];
		return [...dislikes, ...allergies].join(", ");
	});
	const [budget, setBudget] = (0, import_react.useState)("medium");
	const [cookingTime, setCookingTime] = (0, import_react.useState)("30 minutes");
	const [showOptionalPref, setShowOptionalPref] = (0, import_react.useState)(false);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [regeneratingKey, setRegeneratingKey] = (0, import_react.useState)(null);
	const [recentMealNames, setRecentMealNames] = (0, import_react.useState)([]);
	const [mealResult, setMealResult] = (0, import_react.useState)(null);
	const [addedMealIds, setAddedMealIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [savedMealIds, setSavedMealIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [selectedDetailMeal, setSelectedDetailMeal] = (0, import_react.useState)(null);
	const handleGenerate = async (forceRegenerate = false, overrideDiet) => {
		if (generating || regeneratingKey) return;
		const activeDiet = overrideDiet || selectedDiet;
		const cacheKey = [
			selectedMealType,
			activeDiet,
			calorieTarget,
			proteinTarget,
			cuisine,
			availableIngredients,
			foodsToAvoid,
			budget,
			cookingTime
		].join("::");
		if (!forceRegenerate && mealCache.has(cacheKey)) {
			setMealResult(mealCache.get(cacheKey));
			toast.info("Loaded meal plan from cache!");
			return;
		}
		if (forceRegenerate) mealCache.delete(cacheKey);
		setGenerating(true);
		setAddedMealIds(/* @__PURE__ */ new Set());
		const currentDisplayedNames = [];
		if (mealResult) {
			if ("meals" in mealResult && Array.isArray(mealResult.meals)) mealResult.meals.forEach((m) => {
				if (m && m.mealName) currentDisplayedNames.push(m.mealName);
			});
			else if ("mealName" in mealResult && mealResult.mealName) currentDisplayedNames.push(mealResult.mealName);
		}
		const excludedMeals = Array.from(/* @__PURE__ */ new Set([...currentDisplayedNames, ...recentMealNames]));
		try {
			const res = await fetch("/api/generate-meal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					mealType: selectedMealType,
					diet: activeDiet,
					calorieTarget,
					proteinTarget,
					carbsTarget,
					fatTarget,
					goal: profile?.goal || "Maintenance",
					cuisine,
					availableIngredients,
					foodsToAvoid,
					budget,
					cookingTime,
					allergies: profile?.extended_data?.allergies || [],
					dislikes: profile?.extended_data?.disliked_foods || [],
					excludedMeals: forceRegenerate ? excludedMeals : [],
					regenerationId: forceRegenerate ? crypto.randomUUID() : ""
				})
			});
			if (!res.ok) throw new Error(`Server returned ${res.status}`);
			const data = await res.json();
			if (!forceRegenerate) mealCache.set(cacheKey, data);
			if ("meals" in data && Array.isArray(data.meals)) data.meals.forEach((m) => {
				if (m?.mealName) setRecentMealNames((prev) => [...prev, m.mealName]);
			});
			else if ("mealName" in data && data.mealName) setRecentMealNames((prev) => [...prev, data.mealName]);
			setMealResult(data);
			toast.success(selectedMealType === "Full Day Plan" ? "🎉 Full-day personalized meal plan created!" : "✨ Personalized meal generated!");
		} catch (e) {
			console.error("Meal Generation error:", e);
			toast.error("Unable to generate a meal right now. Please try again.");
		} finally {
			setGenerating(false);
		}
	};
	const handleRegenerateSingleMeal = async (targetMeal, mealIndex) => {
		const cardKey = isFullDay && typeof mealIndex === "number" ? `full-${mealIndex}` : "single-meal";
		if (generating || regeneratingKey) return;
		setRegeneratingKey(cardKey);
		try {
			const currentDisplayedNames = [];
			if (mealResult) {
				if ("meals" in mealResult && Array.isArray(mealResult.meals)) mealResult.meals.forEach((m) => {
					if (m && m.mealName) currentDisplayedNames.push(m.mealName);
				});
				else if ("mealName" in mealResult && mealResult.mealName) currentDisplayedNames.push(mealResult.mealName);
			}
			const excludedMeals = Array.from(/* @__PURE__ */ new Set([...currentDisplayedNames, ...recentMealNames]));
			let slotCalorieTarget = calorieTarget;
			let slotProteinTarget = proteinTarget;
			if (isFullDay) {
				const slotType = (targetMeal.mealType || "").toLowerCase();
				if (slotType.includes("breakfast")) {
					slotCalorieTarget = Math.round(calorieTarget * .25);
					slotProteinTarget = Math.round(proteinTarget * .25);
				} else if (slotType.includes("lunch")) {
					slotCalorieTarget = Math.round(calorieTarget * .35);
					slotProteinTarget = Math.round(proteinTarget * .35);
				} else if (slotType.includes("snack")) {
					slotCalorieTarget = Math.round(calorieTarget * .15);
					slotProteinTarget = Math.round(proteinTarget * .15);
				} else if (slotType.includes("dinner")) {
					slotCalorieTarget = Math.round(calorieTarget * .25);
					slotProteinTarget = Math.round(proteinTarget * .25);
				}
			}
			const res = await fetch("/api/generate-meal", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					mealType: targetMeal.mealType,
					currentMealName: targetMeal.mealName,
					excludedMeals,
					regenerationId: crypto.randomUUID(),
					diet: selectedDiet,
					calorieTarget: slotCalorieTarget,
					proteinTarget: slotProteinTarget,
					carbsTarget: Math.round(carbsTarget * .25),
					fatTarget: Math.round(fatTarget * .25),
					goal: profile?.goal || "Maintenance",
					cuisine,
					availableIngredients,
					foodsToAvoid,
					budget,
					cookingTime,
					allergies: profile?.extended_data?.allergies || [],
					dislikes: profile?.extended_data?.disliked_foods || []
				})
			});
			if (!res.ok) throw new Error(`Server returned ${res.status}`);
			const newMeal = await res.json();
			if (!newMeal || !newMeal.mealName || !newMeal.nutrition) throw new Error("Invalid meal response");
			setRecentMealNames((prev) => [...prev, newMeal.mealName]);
			if (isFullDay && mealResult && "meals" in mealResult && typeof mealIndex === "number") {
				const updatedMeals = [...mealResult.meals];
				updatedMeals[mealIndex] = newMeal;
				const newTotals = updatedMeals.reduce((acc, m) => ({
					calories: acc.calories + (m.nutrition.calories || 0),
					protein: Number((acc.protein + (m.nutrition.protein || 0)).toFixed(1)),
					carbs: Number((acc.carbs + (m.nutrition.carbs || 0)).toFixed(1)),
					fat: Number((acc.fat + (m.nutrition.fat || 0)).toFixed(1)),
					fiber: Number((acc.fiber + (m.nutrition.fiber || 0)).toFixed(1))
				}), {
					calories: 0,
					protein: 0,
					carbs: 0,
					fat: 0,
					fiber: 0
				});
				setMealResult({
					...mealResult,
					dailyNutrition: {
						calories: Math.round(newTotals.calories),
						protein: Number(newTotals.protein.toFixed(1)),
						carbs: Number(newTotals.carbs.toFixed(1)),
						fat: Number(newTotals.fat.toFixed(1)),
						fiber: Number(newTotals.fiber.toFixed(1))
					},
					meals: updatedMeals
				});
				setAddedMealIds((prev) => {
					const copy = new Set(prev);
					copy.delete(cardKey);
					return copy;
				});
				toast.success(`✨ Regenerated ${targetMeal.mealType}: "${newMeal.mealName}"`);
			} else {
				setMealResult(newMeal);
				setAddedMealIds((prev) => {
					const copy = new Set(prev);
					copy.delete("single-meal");
					return copy;
				});
				toast.success(`✨ Regenerated meal: "${newMeal.mealName}"`);
			}
		} catch (e) {
			console.error("Single Meal Regeneration error:", e);
			toast.error("Unable to regenerate meal. Keeping current meal.");
		} finally {
			setRegeneratingKey(null);
		}
	};
	const handleAddMealToToday = (meal, uniqueKey) => {
		const todayStr = getLocalDateString();
		LocalStore.addMeal({
			name: meal.mealName,
			source: "manual",
			serving_desc: `1 serving (${meal.prepTime || 15} min prep)`,
			calories: meal.nutrition.calories,
			protein_g: meal.nutrition.protein,
			carbs_g: meal.nutrition.carbs,
			fat_g: meal.nutrition.fat,
			fiber_g: meal.nutrition.fiber || 0,
			sugar_g: meal.nutrition.sugar || 0,
			sodium_mg: meal.nutrition.sodium_mg || 0,
			iron_mg: meal.nutrition.iron_mg || 0,
			calcium_mg: meal.nutrition.calcium_mg || 0,
			magnesium_mg: meal.nutrition.magnesium_mg || 0,
			potassium_mg: meal.nutrition.potassium_mg || 0,
			vit_a_ug: meal.nutrition.vit_a_ug || 0,
			vit_b12_ug: meal.nutrition.vit_b12_ug || 0,
			vit_d_ug: meal.nutrition.vit_d_ug || 0,
			omega3_g: meal.nutrition.omega3_g || 0,
			eaten_at: (/* @__PURE__ */ new Date()).toISOString(),
			eaten_on: todayStr
		});
		setAddedMealIds((prev) => /* @__PURE__ */ new Set([...prev, uniqueKey]));
		toast.success(`✓ "${meal.mealName}" added to Today's Meals!`);
	};
	const handleAddFullDayToToday = (fullPlan) => {
		const todayStr = getLocalDateString();
		const newKeys = new Set(addedMealIds);
		fullPlan.meals.forEach((m, idx) => {
			const key = `full-${idx}`;
			LocalStore.addMeal({
				name: m.mealName,
				source: "manual",
				serving_desc: `1 serving (${m.prepTime || 15} min prep)`,
				calories: m.nutrition.calories,
				protein_g: m.nutrition.protein,
				carbs_g: m.nutrition.carbs,
				fat_g: m.nutrition.fat,
				fiber_g: m.nutrition.fiber || 0,
				sugar_g: m.nutrition.sugar || 0,
				sodium_mg: m.nutrition.sodium_mg || 0,
				iron_mg: m.nutrition.iron_mg || 0,
				calcium_mg: m.nutrition.calcium_mg || 0,
				magnesium_mg: m.nutrition.magnesium_mg || 0,
				potassium_mg: m.nutrition.potassium_mg || 0,
				vit_a_ug: m.nutrition.vit_a_ug || 0,
				vit_b12_ug: m.nutrition.vit_b12_ug || 0,
				vit_d_ug: m.nutrition.vit_d_ug || 0,
				omega3_g: m.nutrition.omega3_g || 0,
				eaten_at: (/* @__PURE__ */ new Date()).toISOString(),
				eaten_on: todayStr
			});
			newKeys.add(key);
		});
		setAddedMealIds(newKeys);
		toast.success(`🎉 All ${fullPlan.meals.length} meals added to Today's Meals!`);
	};
	const handleSaveMeal = (uniqueKey) => {
		if (savedMealIds.has(uniqueKey)) {
			setSavedMealIds((prev) => {
				const copy = new Set(prev);
				copy.delete(uniqueKey);
				return copy;
			});
			toast.info("Meal removed from saved favorites.");
		} else {
			setSavedMealIds((prev) => /* @__PURE__ */ new Set([...prev, uniqueKey]));
			toast.success("♡ Meal saved to favorites!");
		}
	};
	const isFullDay = mealResult && "isFullDay" in mealResult;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-[28px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-6 shadow-xl overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18)_0%,rgba(0,0,0,0)_70%)] blur-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#22D3EE] to-[#34D399] text-[#071018] shadow-[0_0_20px_rgba(56,189,248,0.4)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChefHat, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground dark:text-white",
							children: "AI Meal Generator"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-xs sm:text-sm text-muted-foreground dark:text-slate-300 font-medium max-w-xl",
						children: "Create personalized, nutrient-dense meals calculated against your daily targets with a single tap."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-2 bg-card/80 dark:bg-[#071018]/80 p-2.5 rounded-[20px] border border-border/60 dark:border-white/10 shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-3 w-3" }), " Calories"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-extrabold text-foreground dark:text-white",
									children: [
										calorieTarget,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-medium text-muted-foreground",
											children: "kcal"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dumbbell, { className: "h-3 w-3" }), " Protein"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-extrabold text-foreground dark:text-white",
									children: [
										proteinTarget,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-medium text-muted-foreground",
											children: "g"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-sky-500 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wheat, { className: "h-3 w-3" }), " Carbs"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-extrabold text-foreground dark:text-white",
									children: [
										carbsTarget,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-medium text-muted-foreground",
											children: "g"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-3 w-3" }), " Fat"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-extrabold text-foreground dark:text-white",
									children: [
										fatTarget,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-medium text-muted-foreground",
											children: "g"
										})
									]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[28px] border border-border/80 bg-card/60 dark:border-white/10 dark:bg-[#0C1722]/80 backdrop-blur-2xl p-5 sm:p-6 shadow-xl space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs font-black uppercase tracking-wider text-muted-foreground dark:text-slate-300 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Meal Type" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-5 gap-2",
							children: MEAL_TYPES.map((type) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedMealType(type),
									className: `relative flex items-center justify-center gap-2 rounded-2xl py-3 px-3 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${selectedMealType === type ? "bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-[#071018] shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-[1.02]" : "bg-card/80 border border-border/80 text-muted-foreground hover:text-foreground dark:bg-[#071018]/60 dark:border-white/10 dark:hover:text-white"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: type })
								}, type);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs font-black uppercase tracking-wider text-muted-foreground dark:text-slate-300 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "h-3.5 w-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedMealType === "Full Day Plan" ? "Choose your diet:" : "Diet Type" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2.5",
							children: (selectedMealType === "Full Day Plan" ? [
								{
									id: "Vegetarian",
									label: "🥗 Vegetarian"
								},
								{
									id: "Non-Vegetarian",
									label: "🍗 Non-Vegetarian"
								},
								{
									id: "Mixed",
									label: "🔄 Mixed"
								}
							] : DIET_TYPES).map((diet) => {
								const active = selectedDiet === diet.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										const newDiet = diet.id;
										setSelectedDiet(newDiet);
										if (selectedMealType === "Full Day Plan" && mealResult && isFullDay && newDiet !== selectedDiet) handleGenerate(true, newDiet);
									},
									className: `rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${active ? "bg-emerald-500 text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.4)] scale-105" : "bg-card/80 border border-border/80 text-muted-foreground hover:text-foreground dark:bg-[#071018]/60 dark:border-white/10"}`,
									children: diet.label
								}, diet.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border/50 dark:border-white/10 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowOptionalPref(!showOptionalPref),
							className: "flex items-center justify-between w-full text-xs font-bold text-muted-foreground hover:text-foreground dark:text-slate-300 transition cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Optional Preferences (Cuisine, Ingredients, Budget, Time)" })]
							}), showOptionalPref ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showOptionalPref && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								height: 0
							},
							animate: {
								opacity: 1,
								height: "auto"
							},
							exit: {
								opacity: 0,
								height: 0
							},
							className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-bold text-muted-foreground",
										children: "Preferred Cuisine"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: cuisine,
										onChange: (e) => setCuisine(e.target.value),
										className: "w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-foreground dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary",
										children: CUISINE_OPTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c,
											children: c
										}, c))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-bold text-muted-foreground",
										children: "Available Ingredients"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: availableIngredients,
										onChange: (e) => setAvailableIngredients(e.target.value),
										placeholder: "e.g., Paneer, oats, spinach",
										className: "w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-medium text-foreground dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary placeholder:text-muted-foreground/60"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-bold text-muted-foreground",
										children: "Foods to Avoid"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: foodsToAvoid,
										onChange: (e) => setFoodsToAvoid(e.target.value),
										placeholder: "e.g., Peanuts, mushrooms",
										className: "w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-medium text-foreground dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary placeholder:text-muted-foreground/60"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-bold text-muted-foreground",
										children: "Budget Tier"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: budget,
										onChange: (e) => setBudget(e.target.value),
										className: "w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-foreground capitalize dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary",
										children: BUDGET_OPTIONS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: b,
											children: [b, " Budget"]
										}, b))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 sm:col-span-2 md:col-span-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-bold text-muted-foreground",
										children: "Max Cooking Time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: cookingTime,
										onChange: (e) => setCookingTime(e.target.value),
										className: "w-full rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-foreground dark:bg-[#071018] dark:border-white/10 outline-none focus:border-primary",
										children: COOKING_TIME_OPTIONS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: t,
											children: t
										}, t))
									})]
								})
							]
						}) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleGenerate(false),
						disabled: generating,
						className: "w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#34D399] py-4 text-sm sm:text-base font-black text-[#071018] shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-[0.99] transition duration-200 disabled:opacity-50 cursor-pointer",
						children: generating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin text-[#071018]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Creating your meal..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedMealType === "Full Day Plan" ? "✨ Generate Full Day Plan" : "✨ Generate Meal" })] })
					})
				]
			}),
			mealResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6 animate-in slide-in-from-bottom-4 duration-400",
				children: isFullDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] border border-border/80 bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-teal-500/10 dark:border-white/10 p-5 backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-5 w-5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-extrabold text-foreground dark:text-white",
									children: "Full Day Personalized Plan"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "4 balanced meals engineered to hit your daily total target."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleAddFullDayToToday(mealResult),
									className: "flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Entire Day to Today's Meals" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleGenerate(true),
									disabled: generating,
									className: "flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted dark:border-white/10 transition cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${generating ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Regenerate" })]
								})]
							})]
						}),
						(() => {
							const planData = mealResult;
							const nut = planData.dailyNutrition;
							const dailyCost = planData.dailyCost || 220;
							const dailyBudget = planData.dailyBudget || 250;
							const calPct = Math.round(nut.calories / (calorieTarget || 1) * 100);
							const proPct = Math.round(nut.protein / (proteinTarget || 1) * 100);
							const carbPct = Math.round(nut.carbs / (carbsTarget || 1) * 100);
							const fatPct = Math.round(nut.fat / (fatTarget || 1) * 100);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-border/80 bg-card/80 dark:bg-[#071018]/80 dark:border-white/10 p-5 space-y-4 backdrop-blur-xl shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 dark:border-white/10 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs font-black uppercase tracking-wider text-muted-foreground dark:text-slate-300 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Daily Target vs Your Plan" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Nutrition calculated strictly via local database and optimized to match your profile targets."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Est. Cost: ₹",
												dailyCost,
												" / ₹",
												dailyBudget,
												" Budget"
											] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full",
											children: [selectedDiet, " Diet Mode"]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3.5 space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] font-bold text-amber-500 uppercase tracking-wider",
													children: "Calories"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-muted-foreground",
													children: [
														"TARGET:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-foreground dark:text-slate-200",
															children: [calorieTarget, " kcal"]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-black text-foreground dark:text-white",
													children: [
														"PLAN: ",
														nut.calories,
														" kcal"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs font-extrabold text-amber-400 pt-1 border-t border-amber-500/10 flex justify-between items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Achieved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [calPct, "%"] })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] font-bold text-emerald-500 uppercase tracking-wider",
													children: "Protein"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-muted-foreground",
													children: [
														"TARGET:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-foreground dark:text-slate-200",
															children: [proteinTarget, "g"]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-black text-foreground dark:text-white",
													children: [
														"PLAN: ",
														nut.protein,
														"g"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs font-extrabold text-emerald-400 pt-1 border-t border-emerald-500/10 flex justify-between items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Achieved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [proPct, "%"] })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-sky-500/25 bg-sky-500/5 p-3.5 space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] font-bold text-sky-500 uppercase tracking-wider",
													children: "Carbs"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-muted-foreground",
													children: [
														"TARGET:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-foreground dark:text-slate-200",
															children: [carbsTarget, "g"]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-black text-foreground dark:text-white",
													children: [
														"PLAN: ",
														nut.carbs,
														"g"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs font-extrabold text-sky-400 pt-1 border-t border-sky-500/10 flex justify-between items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Achieved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [carbPct, "%"] })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-purple-500/25 bg-purple-500/5 p-3.5 space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] font-bold text-purple-500 uppercase tracking-wider",
													children: "Fat"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-muted-foreground",
													children: [
														"TARGET:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "font-bold text-foreground dark:text-slate-200",
															children: [fatTarget, "g"]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-black text-foreground dark:text-white",
													children: [
														"PLAN: ",
														nut.fat,
														"g"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs font-extrabold text-purple-400 pt-1 border-t border-purple-500/10 flex justify-between items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Achieved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [fatPct, "%"] })]
												})
											]
										})
									]
								})]
							});
						})(),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: mealResult.meals.map((meal, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MealCard, {
								meal,
								uniqueKey: `full-${idx}`,
								isAdded: addedMealIds.has(`full-${idx}`),
								isSaved: savedMealIds.has(`full-${idx}`),
								onAdd: () => handleAddMealToToday(meal, `full-${idx}`),
								onRegenerate: () => handleRegenerateSingleMeal(meal, idx),
								onSave: () => handleSaveMeal(`full-${idx}`),
								onViewDetails: () => setSelectedDetailMeal(meal),
								isGenerating: generating,
								isRegenerating: regeneratingKey === `full-${idx}`
							}, `full-${idx}`))
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-3xl mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MealCard, {
						meal: mealResult,
						uniqueKey: "single-meal",
						isAdded: addedMealIds.has("single-meal"),
						isSaved: savedMealIds.has("single-meal"),
						onAdd: () => handleAddMealToToday(mealResult, "single-meal"),
						onRegenerate: () => handleRegenerateSingleMeal(mealResult),
						onSave: () => handleSaveMeal("single-meal"),
						onViewDetails: () => setSelectedDetailMeal(mealResult),
						isGenerating: generating,
						isRegenerating: regeneratingKey === "single-meal"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: selectedDetailMeal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						scale: .95,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					exit: {
						scale: .95,
						opacity: 0
					},
					className: "relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[28px] border border-border/80 bg-card p-6 shadow-2xl dark:border-white/10 dark:bg-[#0C1722] space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border/60 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/20 text-primary px-2.5 py-0.5 text-[10px] font-black uppercase",
								children: selectedDetailMeal.mealType
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl font-black text-foreground dark:text-white mt-1",
								children: selectedDetailMeal.mealName
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedDetailMeal(null),
								className: "rounded-full p-2 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-5 gap-2 bg-muted/40 dark:bg-[#071018]/60 p-3 rounded-2xl text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold text-muted-foreground",
									children: "Calories"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-black text-foreground dark:text-white",
									children: [
										selectedDetailMeal.nutrition.calories,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px]",
											children: "kcal"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold text-muted-foreground",
									children: "Protein"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-black text-emerald-400",
									children: [selectedDetailMeal.nutrition.protein, "g"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold text-muted-foreground",
									children: "Carbs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-black text-sky-400",
									children: [selectedDetailMeal.nutrition.carbs, "g"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold text-muted-foreground",
									children: "Fat"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-black text-purple-400",
									children: [selectedDetailMeal.nutrition.fat, "g"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold text-muted-foreground",
									children: "Fiber"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-black text-teal-400",
									children: [selectedDetailMeal.nutrition.fiber, "g"]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Exact Ingredients" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
								children: selectedDetailMeal.ingredients.map((ing, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl border border-border/60 bg-card/60 dark:border-white/10 dark:bg-[#071018]/40 px-3 py-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground dark:text-slate-200",
										children: ing.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-extrabold text-primary",
										children: [
											ing.quantity,
											" ",
											ing.unit
										]
									})]
								}, i))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cooking Instructions" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "space-y-2 text-xs leading-relaxed text-muted-foreground dark:text-slate-300",
								children: selectedDetailMeal.instructions.map((step, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-black text-primary",
										children: idx + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step })]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedDetailMeal(null),
								className: "rounded-xl bg-primary text-primary-foreground px-5 py-2 text-xs font-bold hover:brightness-110 cursor-pointer",
								children: "Close"
							})
						})
					]
				})
			}) })
		]
	});
}
function MealCard({ meal, uniqueKey, isAdded, isSaved, onAdd, onRegenerate, onSave, onViewDetails, isGenerating, isRegenerating = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-[24px] border border-border/80 bg-card/80 dark:border-white/10 dark:bg-[#0C1722]/90 backdrop-blur-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between",
		children: [
			isRegenerating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-card/85 dark:bg-[#0C1722]/85 backdrop-blur-md animate-in fade-in duration-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-7 w-7 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-extrabold text-foreground tracking-wide",
					children: [
						"Regenerating ",
						meal.mealType,
						"..."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-2.5 py-0.5 text-[9px] font-black uppercase text-[#071018]",
								children: ["🍽️ ", meal.mealType]
							}), meal.isNutritionEstimated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 text-emerald-400" }), "Verified Local Nutrition"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-black tracking-tight text-foreground dark:text-white mt-1",
							children: meal.mealName
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onSave,
							className: `p-2 rounded-xl border transition cursor-pointer ${isSaved ? "bg-rose-500/20 border-rose-500/40 text-rose-500" : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground dark:border-white/10"}`,
							title: "Save Meal",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${isSaved ? "fill-rose-500" : ""}` })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-5 gap-1.5 bg-muted/30 dark:bg-[#071018]/60 p-2.5 rounded-2xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold text-amber-500 uppercase",
								children: "Cal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-extrabold text-foreground dark:text-white",
								children: meal.nutrition.calories
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold text-emerald-500 uppercase",
								children: "Prot"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-extrabold text-emerald-400",
								children: [meal.nutrition.protein, "g"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold text-sky-500 uppercase",
								children: "Carb"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-extrabold text-sky-400",
								children: [meal.nutrition.carbs, "g"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold text-purple-500 uppercase",
								children: "Fat"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-extrabold text-purple-400",
								children: [meal.nutrition.fat, "g"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-bold text-teal-500 uppercase",
								children: "Fib"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-extrabold text-teal-400",
								children: [meal.nutrition.fiber, "g"]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground px-1 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Prep: ",
								meal.prepTime || 15,
								" mins"
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3.5 w-3.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Cost: ", meal.estimatedCost || "₹70"] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-black uppercase tracking-wider text-muted-foreground",
							children: "Key Ingredients:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-foreground/90 dark:text-slate-300 font-medium line-clamp-2",
							children: meal.ingredients.map((i) => `${i.quantity}${i.unit} ${i.name}`).join(", ")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50 dark:border-white/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onAdd,
						disabled: isAdded,
						className: `flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-xs font-bold transition cursor-pointer col-span-2 sm:col-span-1 ${isAdded ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md"}`,
						children: isAdded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Added" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add to Today" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onRegenerate,
						disabled: isGenerating || isRegenerating,
						className: "flex items-center justify-center gap-1 rounded-xl border border-border/80 bg-card py-2 px-2 text-xs font-bold text-foreground hover:bg-muted dark:border-white/10 transition cursor-pointer disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isRegenerating || isGenerating ? "animate-spin text-primary" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRegenerating ? "Regenerating..." : "Regenerate" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onViewDetails,
						className: "flex items-center justify-center gap-1 rounded-xl border border-border/80 bg-card py-2 px-2 text-xs font-bold text-foreground hover:bg-muted dark:border-white/10 transition cursor-pointer col-span-2 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-sky-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Details" })]
					})
				]
			})
		]
	});
}
function AuroraProfileScreen({ profile, computedAge, computedBMI, computedBMR, computedTDEE, computedTargets, bmiCategory, onEditProfile, onOpenStep, onSignOut, onUpdateAvatar, onSaveSection }) {
	const navigate = useNavigate();
	const fileInputRef = (0, import_react.useRef)(null);
	const [userEmail, setUserEmail] = (0, import_react.useState)("");
	const [userAvatarUrl, setUserAvatarUrl] = (0, import_react.useState)(profile.photo_url || null);
	const [activeModal, setActiveModal] = (0, import_react.useState)(null);
	const [editForm, setEditForm] = (0, import_react.useState)({});
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (activeModal && [
			"personal",
			"health",
			"goals",
			"diet",
			"activity",
			"devices"
		].includes(activeModal)) {
			const ext = profile.extended_data || {};
			setEditForm({
				display_name: profile.display_name || "",
				gender: profile.gender || "male",
				dob: profile.dob || "1998-05-15",
				phone_number: profile.phone_number || "",
				country: profile.country || ext.country || "India",
				blood_group: profile.blood_group || ext.blood_group || "O+",
				height_cm: profile.height_cm || 175,
				weight_kg: profile.weight_kg || 75,
				goal_weight_kg: profile.goal_weight_kg || 70,
				body_fat_pct: ext.body_fat_pct || 20,
				goal: profile.goal || "fat_loss",
				daily_steps: ext.daily_steps || 8e3,
				water_goal_l: ext.water_goal_l || 3.5,
				goal_timeline: ext.goal_timeline || "3 Months",
				diet: profile.diet || "non_veg",
				allergies: ext.allergies || [],
				health_flags: ext.health_flags || [],
				activity: profile.activity || "moderate",
				sitting_hours: ext.sitting_hours || 8,
				exercise_days: ext.exercise_days || 4,
				workout_type: ext.workout_type || "Gym & Cardio",
				wearables: ext.wearables || {
					google_fit: true,
					apple_health: false,
					health_connect: true,
					sync_steps: true,
					sync_calories: true
				}
			});
		}
	}, [activeModal, profile]);
	const handleFormSave = async () => {
		setIsSaving(true);
		try {
			if (onSaveSection) await onSaveSection(editForm);
			toast.success("Profile updated successfully!");
			setActiveModal(null);
		} catch {
			toast.error("Failed to update profile section");
		} finally {
			setIsSaving(false);
		}
	};
	const [notifications, setNotifications] = (0, import_react.useState)(getNotificationPreferences);
	const [notifPerm, setNotifPerm] = (0, import_react.useState)(getBrowserNotificationPermission);
	(0, import_react.useEffect)(() => {
		setNotifications(getNotificationPreferences());
		setNotifPerm(getBrowserNotificationPermission());
	}, [activeModal]);
	(0, import_react.useEffect)(() => {
		const loadSession = async () => {
			try {
				const { data } = await supabase.auth.getUser();
				if (data?.user?.email) {
					setUserEmail(data.user.email);
					if (data.user.user_metadata?.avatar_url && !profile.photo_url) setUserAvatarUrl(data.user.user_metadata.avatar_url);
				} else {
					const guestStr = localStorage.getItem("nutrilens_guest_session");
					if (guestStr) {
						const guestObj = JSON.parse(guestStr);
						if (guestObj?.user?.email) setUserEmail(guestObj.user.email);
					}
				}
			} catch {}
		};
		loadSession();
	}, [profile.photo_url]);
	const handlePhotoSelect = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result;
				setUserAvatarUrl(result);
				if (onUpdateAvatar) onUpdateAvatar(result);
				toast.success("Profile photo updated successfully!");
			};
			reader.readAsDataURL(file);
		}
	};
	const displayName = profile.display_name || "Alex Johnson";
	const emailDisplay = userEmail || `${displayName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`;
	const phoneDisplay = profile.phone_number || "+1 (555) 234-5678";
	const userInitial = (displayName[0] || "A").toUpperCase();
	const formattedGoal = profile.goal_weight_kg > 0 ? `${profile.goal_weight_kg} kg` : profile.goal ? profile.goal.replace("_", " ") : "70 kg";
	const optionRows = [
		{
			id: "personal",
			icon: User,
			title: "Personal Information",
			onClick: () => setActiveModal("personal")
		},
		{
			id: "health",
			icon: HeartPulse,
			title: "Health Parameters",
			onClick: () => setActiveModal("health")
		},
		{
			id: "goals",
			icon: Target,
			title: "Goals & Targets",
			onClick: () => setActiveModal("goals")
		},
		{
			id: "diet",
			icon: Utensils,
			title: "Diet Preference",
			onClick: () => setActiveModal("diet")
		},
		{
			id: "activity",
			icon: Flame,
			title: "Activity Level",
			onClick: () => setActiveModal("activity")
		},
		{
			id: "devices",
			icon: Smartphone,
			title: "Devices & Apps",
			onClick: () => setActiveModal("devices")
		},
		{
			id: "retake",
			icon: RotateCcw,
			title: "Retake Health Questionnaire",
			onClick: () => onEditProfile()
		},
		{
			id: "subscription",
			icon: Sparkles,
			title: "Subscription",
			isPro: true,
			onClick: () => setActiveModal("subscription")
		},
		{
			id: "notifications",
			icon: Bell,
			title: "Notifications",
			onClick: () => setActiveModal("notifications")
		},
		{
			id: "privacy",
			icon: ShieldCheck,
			title: "Privacy",
			onClick: () => setActiveModal("privacy")
		},
		{
			id: "help",
			icon: CircleQuestionMark,
			title: "Help & Support",
			onClick: () => setActiveModal("help")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative text-foreground font-sans max-w-xl mx-auto space-y-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14)_0%,rgba(0,0,0,0)_70%)] blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.12)_0%,rgba(0,0,0,0)_70%)] blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-10 left-1/3 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.08)_0%,rgba(0,0,0,0)_70%)] blur-3xl" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => navigate({ to: "/home" }),
								className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:bg-accent active:scale-95 transition-all shadow-md",
								"aria-label": "Back to Home",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-lg font-black tracking-tight text-foreground",
								children: "Profile"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveModal("personal"),
								className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:bg-accent active:scale-95 transition-all shadow-md",
								title: "Edit Personal Information",
								"aria-label": "Settings",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-5 w-5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative overflow-hidden rounded-[24px] border border-border bg-card/90 dark:bg-white/[0.05] dark:border-white/10 p-5 shadow-xl backdrop-blur-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#38BDF8] via-[#6366F1] to-[#34D399] p-[2px] shadow-[0_0_25px_rgba(56,189,248,0.35)]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full w-full rounded-full bg-background dark:bg-[#071018] flex items-center justify-center overflow-hidden",
											children: userAvatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: userAvatarUrl,
												alt: displayName,
												className: "h-full w-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#34D399]",
												children: userInitial
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => fileInputRef.current?.click(),
										className: "absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-[#071018] shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-background dark:border-[#071018]",
										title: "Edit profile photo",
										"aria-label": "Edit profile photo",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										ref: fileInputRef,
										onChange: handlePhotoSelect,
										accept: "image/*",
										className: "hidden"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg sm:text-xl font-extrabold text-foreground tracking-tight truncate",
										children: displayName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-2.5 py-0.5 text-[10px] font-black uppercase text-[#071018] shadow-[0_0_12px_rgba(52,211,153,0.3)]",
										children: "AI"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 space-y-0.5 text-xs text-muted-foreground font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 truncate",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3 text-cyan-600 dark:text-[#38BDF8] shrink-0" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate text-foreground/80 dark:text-white/80",
												children: phoneDisplay
											}),
											Boolean(profile.mobile_verified) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												title: "Verified Mobile",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3.5 w-3.5 text-emerald-600 dark:text-[#34D399] shrink-0" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3 text-cyan-600 dark:text-[#38BDF8] shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-foreground/80 dark:text-white/80",
											children: emailDisplay
										})]
									})]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-[24px] border border-border bg-card/90 dark:bg-white/[0.05] dark:border-white/10 p-4 shadow-xl backdrop-blur-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-4 gap-2 text-center divide-x divide-border/60 dark:divide-white/10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Age"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-base sm:text-lg font-black text-foreground mt-1",
										children: computedAge
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center p-1 border-l border-border/60 dark:border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Height"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-base sm:text-lg font-black text-foreground mt-1",
										children: [profile.height_cm || 178, " cm"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center p-1 border-l border-border/60 dark:border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Weight"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-base sm:text-lg font-black text-cyan-600 dark:text-[#38BDF8] mt-1",
										children: [profile.weight_kg || 70, " kg"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center p-1 border-l border-border/60 dark:border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Goal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-base sm:text-lg font-black text-emerald-600 dark:text-[#34D399] mt-1 truncate max-w-full",
										children: formattedGoal
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-1 text-[11px] font-black uppercase tracking-widest text-muted-foreground",
							children: "Account & Preferences"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-[24px] border border-border bg-card/90 dark:bg-white/[0.05] dark:border-white/10 overflow-hidden shadow-xl backdrop-blur-2xl divide-y divide-border/60 dark:divide-white/[0.06]",
							children: optionRows.map((row) => {
								const Icon = row.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: row.onClick,
									className: "w-full flex items-center justify-between p-3.5 px-4 hover:bg-accent/60 dark:hover:bg-white/[0.08] active:bg-accent transition-all text-left group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-10 w-10 rounded-2xl bg-muted/80 dark:bg-white/10 border border-border dark:border-white/10 flex items-center justify-center text-foreground dark:text-white/80 group-hover:text-cyan-600 dark:group-hover:text-[#38BDF8] group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "min-w-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-extrabold text-foreground group-hover:text-cyan-600 dark:group-hover:text-[#38BDF8] transition-colors truncate",
													children: row.title
												}), row.isPro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-2 py-0.2 text-[9px] font-black uppercase text-[#071018] shadow-sm shrink-0",
													children: "AI"
												})]
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-2" })]
								}, row.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onSignOut,
							className: "w-full rounded-[20px] border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 active:scale-[0.99] p-3.5 px-4 transition-all flex items-center justify-between group shadow-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-10 w-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-extrabold text-rose-600 dark:text-rose-300 group-hover:text-rose-700 dark:group-hover:text-rose-200 block",
									children: "Log Out"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-rose-500/70 group-hover:text-rose-600 transition-transform group-hover:translate-x-0.5" })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: activeModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						scale: .95,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					exit: {
						scale: .95,
						opacity: 0
					},
					className: "relative w-full max-w-lg my-auto rounded-[28px] border border-border bg-card p-5 sm:p-6 text-card-foreground shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-lg font-extrabold text-foreground flex items-center gap-2",
								children: [
									activeModal === "personal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-cyan-500" }), " Personal Information"] }),
									activeModal === "health" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeartPulse, { className: "h-5 w-5 text-emerald-500" }), " Health Parameters"] }),
									activeModal === "goals" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-5 w-5 text-amber-500" }), " Goals & Targets"] }),
									activeModal === "diet" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "h-5 w-5 text-emerald-500" }), " Diet Preference"] }),
									activeModal === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-5 w-5 text-orange-500" }), " Activity Level"] }),
									activeModal === "devices" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-5 w-5 text-blue-500" }), " Devices & App Sync"] }),
									activeModal === "subscription" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-cyan-600 dark:text-[#38BDF8]" }), " NutriLens AI Plan"] }),
									activeModal === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5 text-emerald-600 dark:text-[#34D399]" }), " Notification Settings"] }),
									activeModal === "privacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-indigo-600 dark:text-[#818CF8]" }),
										" ",
										"Privacy & Data Security"
									] }),
									activeModal === "help" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-5 w-5 text-cyan-600 dark:text-[#38BDF8]" }), " Help & Support"] })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveModal(null),
								className: "h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						activeModal === "personal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-foreground block mb-1",
									children: "Display Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: editForm.display_name || "",
									onChange: (e) => setEditForm({
										...editForm,
										display_name: e.target.value
									}),
									className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Gender"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: editForm.gender || "male",
										onChange: (e) => setEditForm({
											...editForm,
											gender: e.target.value
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "male",
												children: "Male"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "female",
												children: "Female"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "other",
												children: "Other"
											})
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Date of Birth"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: editForm.dob || "1998-05-15",
										onChange: (e) => setEditForm({
											...editForm,
											dob: e.target.value
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: editForm.phone_number || "",
										onChange: (e) => setEditForm({
											...editForm,
											phone_number: e.target.value
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Blood Group"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: editForm.blood_group || "O+",
										onChange: (e) => setEditForm({
											...editForm,
											blood_group: e.target.value
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground",
										children: [
											"A+",
											"B+",
											"O+",
											"AB+",
											"A-",
											"B-",
											"O-",
											"AB-"
										].map((bg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: bg,
											children: bg
										}, bg))
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleFormSave,
									disabled: isSaving,
									className: "w-full mt-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Changes"]
								})
							]
						}),
						activeModal === "health" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Height (cm)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editForm.height_cm || 175,
										onChange: (e) => setEditForm({
											...editForm,
											height_cm: Number(e.target.value)
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Current Weight (kg)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editForm.weight_kg || 75,
										onChange: (e) => setEditForm({
											...editForm,
											weight_kg: Number(e.target.value)
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Goal Weight (kg)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editForm.goal_weight_kg || 70,
										onChange: (e) => setEditForm({
											...editForm,
											goal_weight_kg: Number(e.target.value)
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Body Fat %"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editForm.body_fat_pct || 20,
										onChange: (e) => setEditForm({
											...editForm,
											body_fat_pct: Number(e.target.value)
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleFormSave,
									disabled: isSaving,
									className: "w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Changes"]
								})
							]
						}),
						activeModal === "goals" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-foreground block mb-1",
									children: "Primary Fitness Goal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: editForm.goal || "fat_loss",
									onChange: (e) => setEditForm({
										...editForm,
										goal: e.target.value
									}),
									className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "fat_loss",
											children: "Fat Loss & Toning"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "lean_bulk",
											children: "Lean Muscle Bulk"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "muscle_gain",
											children: "Maximum Muscle Gain"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "maintenance",
											children: "Weight Maintenance"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "recomp",
											children: "Body Recomposition"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Daily Step Goal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editForm.daily_steps || 8e3,
										onChange: (e) => setEditForm({
											...editForm,
											daily_steps: Number(e.target.value)
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Water Goal (Liters)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: "0.5",
										value: editForm.water_goal_l || 3.5,
										onChange: (e) => setEditForm({
											...editForm,
											water_goal_l: Number(e.target.value)
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleFormSave,
									disabled: isSaving,
									className: "w-full mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Changes"]
								})
							]
						}),
						activeModal === "diet" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-foreground block mb-1",
									children: "Dietary Preference"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: editForm.diet || "non_veg",
									onChange: (e) => setEditForm({
										...editForm,
										diet: e.target.value
									}),
									className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "vegetarian",
											children: "Vegetarian"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "non_veg",
											children: "Non-Vegetarian"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "vegan",
											children: "Vegan"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "jain",
											children: "Jain"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "keto",
											children: "Keto"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "high_protein",
											children: "High Protein"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-foreground block mb-1",
									children: "Allergies"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: [
										"Dairy",
										"Gluten",
										"Peanuts",
										"Eggs",
										"Soy",
										"Seafood",
										"Tree Nuts"
									].map((item) => {
										const active = (editForm.allergies || []).includes(item);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												const curr = editForm.allergies || [];
												const updated = active ? curr.filter((x) => x !== item) : [...curr, item];
												setEditForm({
													...editForm,
													allergies: updated
												});
											},
											className: `rounded-xl px-3 py-1.5 text-xs font-bold border transition ${active ? "bg-emerald-500 text-slate-950 border-emerald-500" : "bg-muted border-border text-foreground"}`,
											children: item
										}, item);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleFormSave,
									disabled: isSaving,
									className: "w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Changes"]
								})
							]
						}),
						activeModal === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-foreground block mb-1",
									children: "Activity Level"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: editForm.activity || "moderate",
									onChange: (e) => setEditForm({
										...editForm,
										activity: e.target.value
									}),
									className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sedentary",
											children: "Sedentary (Desk Job)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "light",
											children: "Lightly Active (1-3 workouts/wk)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "moderate",
											children: "Moderately Active (3-5 workouts/wk)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "active",
											children: "Very Active (6-7 workouts/wk)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "very_active",
											children: "Extra Active (Intense Daily)"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Sitting Hours/Day"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editForm.sitting_hours || 8,
										onChange: (e) => setEditForm({
											...editForm,
											sitting_hours: Number(e.target.value)
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-foreground block mb-1",
										children: "Workout Days/Wk"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: editForm.exercise_days || 4,
										onChange: (e) => setEditForm({
											...editForm,
											exercise_days: Number(e.target.value)
										}),
										className: "w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleFormSave,
									disabled: isSaving,
									className: "w-full mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Changes"]
								})
							]
						}),
						activeModal === "devices" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: [
									{
										key: "google_fit",
										label: "Google Fit Sync"
									},
									{
										key: "apple_health",
										label: "Apple HealthKit Sync"
									},
									{
										key: "health_connect",
										label: "Health Connect Android"
									},
									{
										key: "sync_steps",
										label: "Sync Step Counter"
									},
									{
										key: "sync_calories",
										label: "Sync Active Calories"
									}
								].map((item) => {
									const w = editForm.wearables || {};
									const isChecked = Boolean(w[item.key]);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground",
											children: item.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: isChecked,
											onChange: (e) => {
												setEditForm({
													...editForm,
													wearables: {
														...w,
														[item.key]: e.target.checked
													}
												});
											},
											className: "h-5 w-5 rounded border-border bg-background text-emerald-500 focus:ring-0 cursor-pointer"
										})]
									}, item.key);
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleFormSave,
								disabled: isSaving,
								className: "w-full mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 font-extrabold text-slate-950 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Changes"]
							})]
						}),
						activeModal === "subscription" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 p-4 border border-emerald-500/30 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-extrabold text-sm text-foreground",
										children: "NutriLens AI"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-black text-slate-950",
										children: "ACTIVE"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "You are currently enjoying full NutriLens AI access including AI food camera scanning, custom macro targets, and unlimited coach consultations."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-foreground",
									children: "Included NutriLens AI Features:"
								}), [
									"Unlimited Instant AI Meal Scans",
									"Barcode Scanner & Nutrition Database",
									"Personalized AI Nutrition Coach",
									"Macro & Micro Nutrient Trends",
									"Export Health Records"
								].map((feat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-foreground font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feat })]
								}, feat))]
							})]
						}),
						activeModal === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-sky-400",
										children: "NutriLens Notification Engine"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: notifPerm === "granted" ? "✓ Device notifications active" : "Tap allow to receive system alerts"
									})] }), notifPerm !== "granted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: async () => {
											const granted = await requestNutriLensNotificationPermission();
											setNotifPerm(getBrowserNotificationPermission());
											setNotifications(getNotificationPreferences());
											if (granted) toast.success("Device notifications enabled!");
										},
										className: "px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black transition",
										children: "Enable"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
										children: "Active"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-foreground",
										children: "Sound & Audio Chime"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: "Play pleasant tone on meal & hydration check-ins"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: Boolean(notifications.soundEnabled),
										onChange: (e) => {
											const updated = saveNotificationPreferences({ soundEnabled: e.target.checked });
											setNotifications(updated);
											toast.success("Sound preference saved");
										},
										className: "h-5 w-5 rounded border-border bg-background text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: [
										{
											key: "mealReminders",
											title: "Meal Logging Reminders",
											desc: "Breakfast (8:30am), Lunch (1:00pm) & Dinner (7:30pm)"
										},
										{
											key: "waterAlerts",
											title: "Hydration Alerts",
											desc: "Gentle reminders to drink water every 2 hours"
										},
										{
											key: "streakReminders",
											title: "Streak Safeguard Alert",
											desc: "Evening alert (8:30pm) if daily macro goals are incomplete"
										},
										{
											key: "coachTips",
											title: "AI Coach Daily Tips",
											desc: "Smart suggestions tailored to your goals and nutrient gaps"
										},
										{
											key: "weeklyReport",
											title: "Weekly Summary Report",
											desc: "Weekly progress and body composition recap"
										}
									].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-bold text-foreground",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: item.desc
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: Boolean(notifications[item.key]),
											onChange: (e) => {
												const updated = saveNotificationPreferences({ [item.key]: e.target.checked });
												setNotifications(updated);
												toast.success("Notification setting updated");
											},
											className: "h-5 w-5 rounded border-border bg-background text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
										})]
									}, item.key))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-border flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-muted-foreground",
										children: "Test Live System:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => triggerTestNotification("meal"),
										className: "px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition active:scale-95",
										children: "Trigger Test Alert 🔔"
									})]
								})
							]
						}),
						activeModal === "privacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-2xl bg-muted/50 border border-border space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 text-cyan-500" }), " Encrypted Health Data"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Your dietary inputs, weight logs, and personal health metrics are stored securely and never sold to third parties."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-2xl bg-muted/50 border border-border space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-foreground",
									children: "Camera Access"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Camera permissions are used solely for scanning meal photos and food barcodes."
								})]
							})]
						}),
						activeModal === "help" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-2xl bg-muted/50 border border-border space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-foreground",
									children: "Need help or have suggestions?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: "Our NutriLens support team is here for you 24/7."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									toast.info("Support request sent! We will contact you soon.");
									setActiveModal(null);
								},
								className: "w-full rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] p-3 text-center font-bold text-[#071018]",
								children: "Contact Support Team"
							})]
						})
					]
				})
			}) })
		]
	});
}
var getProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("9df9652da79c7ccc337ce62c64dcd11f1800a8eb6e0bd13747650358f67fe4e8"));
var OnboardInput = objectType({
	display_name: stringType().min(1).max(60),
	gender: stringType().max(20).optional().nullable(),
	age: numberType().int().min(13).max(120),
	height_cm: numberType().min(80).max(260),
	weight_kg: numberType().min(25).max(400),
	goal_weight_kg: numberType().min(25).max(400),
	activity: enumType([
		"sedentary",
		"light",
		"moderate",
		"active",
		"very_active"
	]),
	goal: enumType([
		"fat_loss",
		"lean_bulk",
		"muscle_gain",
		"maintenance",
		"recomp"
	]),
	diet: enumType([
		"vegetarian",
		"vegan",
		"non_veg",
		"jain",
		"keto",
		"high_protein"
	]),
	flags: arrayType(stringType()).default([]),
	extended_data: anyType().optional()
});
var saveOnboarding = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => OnboardInput.parse(d)).handler(createSsrRpc("282d34e2a091e6efe939130774d40d666c72e087301369a9aefeb6f20e7d85a6"));
var updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	water_goal_l: numberType().optional(),
	water_target_glasses: numberType().optional(),
	daily_calorie_target: numberType().optional(),
	protein_target_g: numberType().optional(),
	extended_data: anyType().optional(),
	display_name: stringType().optional(),
	weight_kg: numberType().optional(),
	goal_weight_kg: numberType().optional()
}).parse(d)).handler(createSsrRpc("d94d0b5402d88327ffc5615e3b5d2a6f5e7a519b2121a922cbe6da824cc59c6d"));
var addWater = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	glasses: numberType().min(-50).max(100).default(1),
	day: stringType().optional()
}).parse(d)).handler(createSsrRpc("39a5efeeffc0cf696afa657172f363f074956036ccbedef0a6f0d3ccbb6d15cc"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	weight_kg: numberType().min(25).max(400),
	day: stringType().optional()
}).parse(d)).handler(createSsrRpc("8d53753a989d8afd07b09840dde0294c752c665e93a4d557c8152ea2e6dd4ece"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	steps: numberType().int().min(0).max(2e5),
	day: stringType().optional(),
	distance_km: numberType().optional(),
	calories_burned: numberType().optional(),
	active_minutes: numberType().optional()
}).parse(d)).handler(createSsrRpc("444e1bbbe8b635c3dae61783dd0a37aa0e76bc5a9024b7a20781c4652d3eab7c"));
function HearAboutIcon({ name }) {
	switch (name) {
		case "Instagram": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "w-5 h-5 fill-current",
				viewBox: "0 0 24 24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" })
			})
		});
		case "Facebook": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-[#1877F2] grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "w-5 h-5 fill-current",
				viewBox: "0 0 24 24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" })
			})
		});
		case "TikTok": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-black dark:bg-[#121212] border border-white/20 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "w-5 h-5 fill-current",
				viewBox: "0 0 24 24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.31 2.56.02.82.42 1.61 1.08 2.1 1.05.82 2.57.8 3.58-.08.69-.58 1.08-1.46 1.08-2.36.02-4.29.01-8.58.01-12.87z" })
			})
		});
		case "YouTube": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-[#FF0000] grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "w-5 h-5 fill-current",
				viewBox: "0 0 24 24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" })
			})
		});
		case "Google": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-white border border-slate-200 grid place-items-center shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "w-5 h-5",
				viewBox: "0 0 24 24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#4285F4",
						d: "M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#34A853",
						d: "M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.24 21.3 7.31 24 12 24z"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#FBBC05",
						d: "M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 10.03 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#EA4335",
						d: "M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.24 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
					})
				]
			})
		});
		case "X": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-black text-white border border-white/20 grid place-items-center shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "w-4 h-4 fill-current",
				viewBox: "0 0 24 24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
			})
		});
		case "Friend or family": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Play Store": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-slate-900 border border-slate-700 grid place-items-center shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "w-5 h-5",
				viewBox: "0 0 24 24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#EA4335",
						d: "M3.6 1.8C3.2 2.2 3 2.8 3 3.6v16.8c0 .8.2 1.4.6 1.8l.1.1 9.4-9.4v-.2-.2L3.7 1.7l-.1.1z"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#FBBC04",
						d: "M16.2 15.8l-3.1-3.1v-.2-.2l3.1-3.1.1.1 3.7 2.1c1.1.6 1.1 1.7 0 2.3l-3.8 2.1z"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#4285F4",
						d: "M16.3 15.7L13.1 12.5 3.6 22c.4.4.9.4 1.6 0l11.1-6.3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						fill: "#34A853",
						d: "M16.3 8.3L5.2 2c-.7-.4-1.2-.4-1.6 0l9.5 9.5 3.2-3.2z"
					})
				]
			})
		});
		case "TV": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tv, { className: "w-5 h-5 stroke-[2.2]" })
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-muted grid place-items-center text-lg shrink-0",
			children: "📢"
		});
	}
}
function DietOptionIcon({ name }) {
	switch (name) {
		case "Balanced": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Whole-food focus": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-600 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Apple, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Mediterranean": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wheat, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Flexitarian": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Salad, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Pescatarian": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fish, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Vegetarian": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sprout, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Vegan": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-green-500 to-lime-400 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Low-carb": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Keto": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 to-red-500 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-5 h-5 stroke-[2.5]" })
		});
		case "Paleo": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-700 grid place-items-center text-white shadow-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Beef, { className: "w-5 h-5 stroke-[2.5]" })
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-9 w-9 rounded-xl bg-muted grid place-items-center text-lg shrink-0",
			children: "🥗"
		});
	}
}
var Route$5 = createFileRoute("/_authenticated/onboarding")({
	head: () => ({ meta: [{ title: "Profile Setup — NutriLens" }] }),
	component: CalAiOnboarding
});
function CalAiOnboarding() {
	const navigate = useNavigate();
	const saveOnboardingFn = useServerFn(saveOnboarding);
	const [step, setStep] = (0, import_react.useState)(1);
	const totalSteps = 23;
	const [isEditingSetup, setIsEditingSetup] = (0, import_react.useState)(false);
	const [currentProfile, setCurrentProfile] = (0, import_react.useState)(() => LocalStore.getProfile());
	(0, import_react.useEffect)(() => {
		const handleProfileChange = () => {
			setCurrentProfile(LocalStore.getProfile());
		};
		window.addEventListener("nutrilens-data-changed", handleProfileChange);
		return () => window.removeEventListener("nutrilens-data-changed", handleProfileChange);
	}, []);
	const [sex, setSex] = (0, import_react.useState)("male");
	const [workouts, setWorkouts] = (0, import_react.useState)("3-5");
	const [hearAbout, setHearAbout] = (0, import_react.useState)("Instagram");
	const [triedOtherApps, setTriedOtherApps] = (0, import_react.useState)("yes");
	const [heightUnit, setHeightUnit] = (0, import_react.useState)("cm");
	const [heightCm, setHeightCm] = (0, import_react.useState)(175);
	const [heightFeet, setHeightFeet] = (0, import_react.useState)(5);
	const [heightInches, setHeightInches] = (0, import_react.useState)(9);
	const [weightUnit, setWeightUnit] = (0, import_react.useState)("kg");
	const [weightKg, setWeightKg] = (0, import_react.useState)(69.7);
	const [birthMonth, setBirthMonth] = (0, import_react.useState)("August");
	const [birthDay, setBirthDay] = (0, import_react.useState)(20);
	const [birthYear, setBirthYear] = (0, import_react.useState)(2005);
	const [hasTrainer, setHasTrainer] = (0, import_react.useState)("no");
	const [goal, setGoal] = (0, import_react.useState)("gain");
	const [desiredWeightKg, setDesiredWeightKg] = (0, import_react.useState)(79.4);
	const [weeklyRateKg, setWeeklyRateKg] = (0, import_react.useState)(.8);
	const [obstacle, setObstacle] = (0, import_react.useState)("Lack of consistency");
	const [diet, setDiet] = (0, import_react.useState)("Balanced");
	const [accomplishment, setAccomplishment] = (0, import_react.useState)("Eat and live healthier");
	const [notificationsAllowed, setNotificationsAllowed] = (0, import_react.useState)(false);
	const [holdProgress, setHoldProgress] = (0, import_react.useState)(0);
	const [isCommitted, setIsCommitted] = (0, import_react.useState)(false);
	const holdIntervalRef = (0, import_react.useRef)(null);
	const [genPercent, setGenPercent] = (0, import_react.useState)(0);
	const [genStepIdx, setGenStepIdx] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (heightUnit === "ft_in") {
			const totalInches = heightFeet * 12 + heightInches;
			setHeightCm(Math.round(totalInches * 2.54));
		}
	}, [
		heightFeet,
		heightInches,
		heightUnit
	]);
	const handleRulerDrag = (e, isDesired = false) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const ratio = Math.max(0, Math.min(rect.width, clientX - rect.left)) / rect.width;
		if (weightUnit === "kg") {
			const val = Number((40 + ratio * 80).toFixed(1));
			if (isDesired) setDesiredWeightKg(val);
			else setWeightKg(val);
		} else {
			const valLbs = Number((90 + ratio * 180).toFixed(1));
			const valKg = Number((valLbs / 2.20462).toFixed(1));
			if (isDesired) setDesiredWeightKg(valKg);
			else setWeightKg(valKg);
		}
	};
	(0, import_react.useEffect)(() => {
		if (step === 21) {
			setGenPercent(0);
			setGenStepIdx(0);
			const interval = setInterval(() => {
				setGenPercent((prev) => {
					if (prev >= 100) {
						clearInterval(interval);
						setTimeout(() => setStep(22), 600);
						return 100;
					}
					const next = prev + 2;
					if (next > 25 && next <= 50) setGenStepIdx(1);
					else if (next > 50 && next <= 75) setGenStepIdx(2);
					else if (next > 75) setGenStepIdx(3);
					return next;
				});
			}, 50);
			return () => clearInterval(interval);
		}
	}, [step]);
	const startHold = () => {
		if (isCommitted) return;
		setHoldProgress(0);
		const startTime = Date.now();
		holdIntervalRef.current = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const pct = Math.min(100, elapsed / 1800 * 100);
			setHoldProgress(pct);
			if (pct >= 100) {
				if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
				setIsCommitted(true);
				try {
					confetti_module_default({
						particleCount: 100,
						spread: 70,
						origin: { y: .6 }
					});
				} catch {}
			}
		}, 30);
	};
	const endHold = () => {
		if (isCommitted) return;
		if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
		setHoldProgress(0);
	};
	const calculatedPlan = () => {
		const age = Math.max(16, 2026 - birthYear);
		let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
		if (sex === "female") bmr -= 161;
		else if (sex === "male") bmr += 5;
		else bmr -= 78;
		let activityMult = 1.2;
		if (workouts === "3-5") activityMult = 1.45;
		if (workouts === "6+") activityMult = 1.7;
		const tdee = Math.round(bmr * activityMult);
		const dailySurplusDeficit = Math.round(weeklyRateKg * 7700 / 7);
		let targetCalories = tdee;
		if (goal === "lose") targetCalories = Math.max(1200, tdee - dailySurplusDeficit);
		else if (goal === "gain") targetCalories = tdee + dailySurplusDeficit;
		const proteinG = Math.round(weightKg * 2.1);
		const fatsG = Math.round(targetCalories * .25 / 9);
		const carbsG = Math.max(50, Math.round((targetCalories - (proteinG * 4 + fatsG * 9)) / 4));
		const diffKg = Math.abs(desiredWeightKg - weightKg);
		let weeksNeeded = weeklyRateKg <= .3 ? 24 : 12;
		let monthsText = "3 months";
		if (weeklyRateKg <= .3) {
			monthsText = "6 months";
			weeksNeeded = 24;
		} else {
			monthsText = "3 months";
			weeksNeeded = 12;
		}
		const targetDate = /* @__PURE__ */ new Date();
		targetDate.setDate(targetDate.getDate() + weeksNeeded * 7);
		return {
			targetCalories,
			proteinG,
			carbsG,
			fatsG,
			weeksNeeded,
			monthsText,
			targetDateFormatted: targetDate.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric"
			}),
			diffKgFormatted: `${diffKg.toFixed(1)} kg`
		};
	};
	const plan = calculatedPlan();
	const handleFinishOnboarding = async () => {
		const calculatedAge = Math.max(13, 2026 - birthYear);
		const validActivity = workouts === "6+" ? "very_active" : workouts === "3-5" ? "moderate" : "light";
		const validGoal = goal === "lose" ? "fat_loss" : goal === "gain" ? "muscle_gain" : "maintenance";
		const dLower = diet.toLowerCase();
		let validDiet = "vegetarian";
		if (dLower.includes("vegan")) validDiet = "vegan";
		else if (dLower.includes("keto")) validDiet = "keto";
		else if (dLower.includes("jain")) validDiet = "jain";
		else if (dLower.includes("pescatarian") || dLower.includes("paleo") || dLower.includes("meat")) validDiet = "non_veg";
		else if (dLower.includes("high_protein") || dLower.includes("protein")) validDiet = "high_protein";
		else if (dLower.includes("veg")) validDiet = "vegetarian";
		else validDiet = "non_veg";
		const extendedData = {
			workouts_per_week: workouts,
			discovery_source: hearAbout,
			has_trainer: hasTrainer,
			weekly_rate_kg: weeklyRateKg,
			obstacle,
			accomplishment,
			notifications_allowed: notificationsAllowed,
			birth_month: birthMonth,
			birth_day: birthDay,
			birth_year: birthYear,
			tried_other_apps: triedOtherApps,
			height_unit: heightUnit,
			weight_unit: weightUnit,
			carbs_g: plan.carbsG,
			fat_g: plan.fatsG,
			daily_steps: 8e3,
			water_goal_l: 3.5,
			goal_timeline: plan.monthsText
		};
		const profileData = {
			display_name: currentProfile?.display_name || "NutriLens User",
			gender: sex,
			age: calculatedAge,
			height_cm: heightCm,
			weight_kg: weightKg,
			goal_weight_kg: desiredWeightKg,
			activity: validActivity,
			goal: validGoal,
			diet: validDiet,
			daily_calorie_target: plan.targetCalories,
			protein_target_g: plan.proteinG,
			water_target_glasses: 8,
			water_goal_l: 3.5,
			onboarded: true,
			mobile_verified: true,
			extended_data: extendedData
		};
		try {
			const { data: sessData } = await supabase.auth.getSession();
			const userId = sessData.session?.user?.id;
			if (userId) {
				profileData.user_id = userId;
				LocalStore.setAccount(userId);
				await saveOnboardingFn({ data: {
					display_name: profileData.display_name,
					gender: profileData.gender,
					age: profileData.age,
					height_cm: profileData.height_cm,
					weight_kg: profileData.weight_kg,
					goal_weight_kg: profileData.goal_weight_kg,
					activity: validActivity,
					goal: validGoal,
					diet: validDiet,
					flags: [],
					extended_data: extendedData
				} });
			}
		} catch (err) {
			console.warn("[handleFinishOnboarding] Server save error:", err);
		}
		LocalStore.saveProfile(profileData);
		setIsEditingSetup(false);
		setCurrentProfile(LocalStore.getProfile());
		toast.success("🎉 Profile setup complete! Welcome to NutriLens");
		navigate({
			to: "/home",
			replace: true
		});
	};
	const handleNext = () => {
		if (step < totalSteps) setStep((s) => s + 1);
	};
	const handleBack = () => {
		if (step > 1) setStep((s) => s - 1);
		else navigate({ to: "/" });
	};
	const displayWeight = (kgVal) => {
		if (weightUnit === "lbs") return `${(kgVal * 2.20462).toFixed(1)} lbs`;
		return `${kgVal.toFixed(1)} kg`;
	};
	if (currentProfile?.onboarded && !isEditingSetup) {
		const age = currentProfile.age || 21;
		const height = currentProfile.height_cm || 175;
		const weight = currentProfile.weight_kg || 70;
		const heightM = height / 100;
		const bmi = Number((weight / (heightM * heightM)).toFixed(1));
		const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + (currentProfile.gender === "female" ? -161 : 5));
		const tdee = Math.round(bmr * 1.55);
		let bmiCat = {
			label: "Normal Weight",
			color: "text-emerald-500",
			bg: "bg-emerald-500/10"
		};
		if (bmi < 18.5) bmiCat = {
			label: "Underweight",
			color: "text-amber-500",
			bg: "bg-amber-500/10"
		};
		else if (bmi >= 25 && bmi < 30) bmiCat = {
			label: "Overweight",
			color: "text-amber-500",
			bg: "bg-amber-500/10"
		};
		else if (bmi >= 30) bmiCat = {
			label: "Obese",
			color: "text-rose-500",
			bg: "bg-rose-500/10"
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-screen bg-background text-foreground px-4 py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuroraProfileScreen, {
				profile: currentProfile,
				computedAge: age,
				computedBMI: bmi,
				computedBMR: bmr,
				computedTDEE: tdee,
				computedTargets: {
					calories: currentProfile.daily_calorie_target || 2e3,
					protein: currentProfile.protein_target_g || 120,
					carbs: currentProfile.extended_data?.carbs_g || 220,
					fat: currentProfile.extended_data?.fat_g || 60,
					waterGlasses: currentProfile.water_target_glasses || 8
				},
				bmiCategory: bmiCat,
				onEditProfile: () => setIsEditingSetup(true),
				onOpenStep: (stepId) => {
					setStep(stepId);
					setIsEditingSetup(true);
				},
				onSignOut: async () => {
					localStorage.removeItem("nutrilens_guest_session");
					LocalStore.clearAll();
					await supabase.auth.signOut();
					navigate({
						to: "/auth",
						replace: true
					});
				},
				onSaveSection: (updatedFields) => {
					const updated = {
						...currentProfile,
						...updatedFields,
						extended_data: {
							...currentProfile.extended_data || {},
							...updatedFields
						}
					};
					LocalStore.saveProfile(updated);
					setCurrentProfile(LocalStore.getProfile());
					toast.success("Profile section updated!");
				}
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col items-center justify-between px-4 sm:px-6 py-6 selection:bg-primary/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full max-w-md space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleBack,
							className: "grid h-10 w-10 place-items-center rounded-full bg-muted/60 text-foreground hover:bg-muted transition cursor-pointer",
							"aria-label": "Back",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 mx-4 h-1.5 rounded-full bg-muted overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-foreground transition-all duration-300 ease-out",
								style: { width: `${step / totalSteps * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-extrabold text-muted-foreground w-8 text-right",
							children: [
								step,
								"/",
								totalSteps
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md my-auto py-6",
				children: [
					step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "Choose your sex"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "This helps personalize your experience."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: [
								{
									id: "male",
									label: "Male",
									icon: "♂"
								},
								{
									id: "female",
									label: "Female",
									icon: "♀"
								},
								{
									id: "other",
									label: "Other",
									icon: "🔲"
								}
							].map((opt) => {
								const selected = sex === opt.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setSex(opt.id),
									className: `w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected ? "border-foreground bg-card shadow-md scale-[1.01]" : "border-border/80 bg-card/60 hover:border-border text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl font-bold",
											children: opt.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-bold text-foreground",
											children: opt.label
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-5 w-5 rounded-full border-2 grid place-items-center ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40"}`,
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-background" })
									})]
								}, opt.id);
							})
						})]
					}),
					step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "How many workouts do you do per week?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "This will be used to calibrate your custom plan."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: [
								{
									id: "0-2",
									title: "0 - 2",
									desc: "Workouts now and then",
									icon: "🏋️"
								},
								{
									id: "3-5",
									title: "3 - 5",
									desc: "A few workouts per week",
									icon: "🏃"
								},
								{
									id: "6+",
									title: "6+",
									desc: "Dedicated athlete",
									icon: "🔥"
								}
							].map((opt) => {
								const selected = workouts === opt.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setWorkouts(opt.id),
									className: `w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected ? "border-foreground bg-card shadow-md scale-[1.01]" : "border-border/80 bg-card/60 hover:border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-10 w-10 rounded-xl bg-muted grid place-items-center text-lg",
											children: opt.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-base font-black text-foreground",
												children: opt.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground font-medium",
												children: opt.desc
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-5 w-5 rounded-full border-2 grid place-items-center ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40"}`,
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-background" })
									})]
								}, opt.id);
							})
						})]
					}),
					step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "Where did you hear about us?"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-2.5 max-h-[420px] overflow-y-auto pr-1",
							children: [
								"Instagram",
								"Facebook",
								"TikTok",
								"YouTube",
								"Google",
								"X",
								"Friend or family",
								"Play Store",
								"TV"
							].map((name) => {
								const selected = hearAbout === name;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setHearAbout(name),
									className: `w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${selected ? "border-foreground bg-card shadow-sm" : "border-border/80 bg-card/60 hover:border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HearAboutIcon, { name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-foreground",
											children: name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-5 w-5 rounded-full border-2 grid place-items-center shrink-0 ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40"}`,
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-background" })
									})]
								}, name);
							})
						})]
					}),
					step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "Have you tried other calorie tracking apps?"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: [{
								id: "yes",
								label: "Yes",
								icon: ThumbsUp
							}, {
								id: "no",
								label: "No",
								icon: ThumbsDown
							}].map((opt) => {
								const Icon = opt.icon;
								const selected = triedOtherApps === opt.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setTriedOtherApps(opt.id),
									className: `w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected ? "border-foreground bg-card shadow-md scale-[1.01]" : "border-border/80 bg-card/60 hover:border-border text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-bold text-foreground",
											children: opt.label
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-5 w-5 rounded-full border-2 grid place-items-center ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40"}`,
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-background" })
									})]
								}, opt.id);
							})
						})]
					}),
					step === 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "Designed to help you stay on track"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between text-xs font-bold text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Your weight" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-44 w-full pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										className: "w-full h-full overflow-visible",
										viewBox: "0 0 300 120",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M 10 30 Q 100 80, 160 30 T 290 20",
												fill: "none",
												stroke: "#EF4444",
												strokeWidth: "2.5",
												strokeDasharray: "4 4"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
												x: "200",
												y: "30",
												fill: "#EF4444",
												fontSize: "10",
												fontWeight: "700",
												children: "Traditional diet"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M 10 30 C 90 35, 140 100, 280 100",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "3.5",
												className: "text-foreground"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "280",
												cy: "100",
												r: "5",
												className: "fill-foreground"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
												x: "10",
												y: "118",
												fill: "gray",
												fontSize: "9",
												fontWeight: "600",
												children: "Month 1"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
												x: "250",
												y: "118",
												fill: "gray",
												fontSize: "9",
												fontWeight: "600",
												children: "Month 6"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute top-10 left-4 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-black text-background shadow",
										children: "NutriLens Weight"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-center text-muted-foreground pt-2",
									children: "80% of NutriLens users maintain their weight loss even 6 months later"
								})
							]
						})]
					}),
					step === 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
								children: "What is your height?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: "This will be taken into account when calculating your daily nutrition goals."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex rounded-xl bg-muted p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setHeightUnit("ft_in"),
										className: `rounded-lg px-4 py-1.5 text-xs font-black transition ${heightUnit === "ft_in" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
										children: "ft, in"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setHeightUnit("cm"),
										className: `rounded-lg px-4 py-1.5 text-xs font-black transition ${heightUnit === "cm" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
										children: "cm"
									})]
								})
							}),
							heightUnit === "cm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center space-y-4 py-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-5xl font-black tracking-tight text-foreground",
									children: [
										heightCm,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl text-muted-foreground font-bold",
											children: "cm"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 120,
									max: 220,
									value: heightCm,
									onChange: (e) => setHeightCm(Number(e.target.value)),
									className: "w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-foreground"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-6 py-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-3xl font-black text-foreground",
										children: [heightFeet, " ft"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-2 mt-2",
										children: [
											4,
											5,
											6,
											7
										].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setHeightFeet(f),
											className: `h-10 w-10 rounded-xl font-bold border ${heightFeet === f ? "border-foreground bg-foreground text-background" : "border-border"}`,
											children: f
										}, f))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-3xl font-black text-foreground",
										children: [heightInches, " in"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1.5 mt-2 overflow-x-auto max-w-[200px] pb-1",
										children: [
											0,
											2,
											4,
											6,
											8,
											10
										].map((inc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setHeightInches(inc),
											className: `h-9 w-9 rounded-xl font-bold text-xs border shrink-0 ${heightInches === inc ? "border-foreground bg-foreground text-background" : "border-border"}`,
											children: inc
										}, inc))
									})]
								})]
							})
						]
					}),
					step === 7 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
								children: "What is your weight?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: "This will be taken into account when calculating your daily nutrition goals."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex rounded-xl bg-muted p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWeightUnit("lbs"),
										className: `rounded-lg px-4 py-1.5 text-xs font-black transition ${weightUnit === "lbs" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
										children: "lbs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWeightUnit("kg"),
										className: `rounded-lg px-4 py-1.5 text-xs font-black transition ${weightUnit === "kg" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
										children: "kg"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
									children: "Current Weight"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-4xl sm:text-5xl font-black tracking-tight text-foreground mt-1",
									children: displayWeight(weightKg)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onMouseDown: (e) => handleRulerDrag(e, false),
								onTouchMove: (e) => handleRulerDrag(e, false),
								className: "relative h-24 w-full bg-card border border-border rounded-2xl overflow-hidden cursor-ew-resize select-none flex items-center justify-center p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 bottom-0 left-1/2 w-0.5 bg-foreground z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-end justify-between w-full h-12 px-2 opacity-60",
									children: Array.from({ length: 41 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-0.5 bg-foreground ${i % 10 === 0 ? "h-10 bg-foreground" : i % 5 === 0 ? "h-6" : "h-3"}` }, i))
								})]
							})
						]
					}),
					step === 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "When were you born?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "This will be taken into account when calculating your daily nutrition goals."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3 py-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-muted-foreground text-center",
										children: "Month"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: birthMonth,
										onChange: (e) => setBirthMonth(e.target.value),
										className: "rounded-2xl border-2 border-border bg-card p-3 text-sm font-bold text-foreground outline-none focus:border-foreground",
										children: [
											"January",
											"February",
											"March",
											"April",
											"May",
											"June",
											"July",
											"August",
											"September",
											"October",
											"November",
											"December"
										].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: m,
											children: m
										}, m))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-muted-foreground text-center",
										children: "Day"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: birthDay,
										onChange: (e) => setBirthDay(Number(e.target.value)),
										className: "rounded-2xl border-2 border-border bg-card p-3 text-sm font-bold text-foreground outline-none focus:border-foreground",
										children: Array.from({ length: 31 }, (_, i) => i + 1).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: d,
											children: d < 10 ? `0${d}` : d
										}, d))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-muted-foreground text-center",
										children: "Year"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: birthYear,
										onChange: (e) => setBirthYear(Number(e.target.value)),
										className: "rounded-2xl border-2 border-border bg-card p-3 text-sm font-bold text-foreground outline-none focus:border-foreground",
										children: Array.from({ length: 60 }, (_, i) => 2010 - i).map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: y,
											children: y
										}, y))
									})]
								})
							]
						})]
					}),
					step === 9 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "Do you currently work with a personal trainer or registered dietitian?"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: [{
								id: "yes",
								label: "Yes",
								icon: ThumbsUp
							}, {
								id: "no",
								label: "No",
								icon: ThumbsDown
							}].map((opt) => {
								const Icon = opt.icon;
								const selected = hasTrainer === opt.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setHasTrainer(opt.id),
									className: `w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected ? "border-foreground bg-card shadow-md scale-[1.01]" : "border-border/80 bg-card/60 hover:border-border text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-bold text-foreground",
											children: opt.label
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-5 w-5 rounded-full border-2 grid place-items-center ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40"}`,
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-background" })
									})]
								}, opt.id);
							})
						})]
					}),
					step === 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "What is your goal?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "This helps us generate a plan for your calorie intake."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: [
								{
									id: "lose",
									label: "Lose Weight",
									icon: TrendingDown
								},
								{
									id: "maintain",
									label: "Maintain",
									icon: Minus
								},
								{
									id: "gain",
									label: "Gain Weight",
									icon: TrendingUp
								}
							].map((opt) => {
								const Icon = opt.icon;
								const selected = goal === opt.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setGoal(opt.id),
									className: `w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected ? "border-foreground bg-card shadow-md scale-[1.01]" : "border-border/80 bg-card/60 hover:border-border text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-base font-bold text-foreground",
											children: opt.label
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-5 w-5 rounded-full border-2 grid place-items-center ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40"}`,
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-background" })
									})]
								}, opt.id);
							})
						})]
					}),
					step === 11 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
								children: "What is your desired weight?"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex rounded-xl bg-muted p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWeightUnit("lbs"),
										className: `rounded-lg px-4 py-1.5 text-xs font-black transition ${weightUnit === "lbs" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
										children: "lbs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWeightUnit("kg"),
										className: `rounded-lg px-4 py-1.5 text-xs font-black transition ${weightUnit === "kg" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`,
										children: "Kg"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
									children: goal === "gain" ? "Gain Weight" : goal === "lose" ? "Lose Weight" : "Target Weight"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-4xl sm:text-5xl font-black tracking-tight text-foreground mt-1",
									children: displayWeight(desiredWeightKg)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onMouseDown: (e) => handleRulerDrag(e, true),
								onTouchMove: (e) => handleRulerDrag(e, true),
								className: "relative h-24 w-full bg-card border border-border rounded-2xl overflow-hidden cursor-ew-resize select-none flex items-center justify-center p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 bottom-0 left-1/2 w-0.5 bg-foreground z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-end justify-between w-full h-12 px-2 opacity-60",
									children: Array.from({ length: 41 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-0.5 bg-foreground ${i % 10 === 0 ? "h-10 bg-foreground" : i % 5 === 0 ? "h-6" : "h-3"}` }, i))
								})]
							})
						]
					}),
					step === 12 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 py-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-tight",
								children: goal === "gain" ? `Gaining ${plan.diffKgFormatted} is a realistic target. It's not hard at all!` : `Losing ${plan.diffKgFormatted} is a realistic target. It's not hard at all!`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground leading-relaxed",
								children: "90% of users say that the change is obvious after using NutriLens and it is not easy to rebound."
							})]
						})
					}),
					step === 13 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
								children: "How fast do you want to reach your goal?"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center font-bold text-sm text-muted-foreground",
								children: [
									"Weight ",
									goal === "gain" ? "gain" : "loss",
									" speed per week",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-2xl font-black text-foreground mt-1",
										children: [weeklyRateKg, " kg"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									{
										rate: .2,
										label: "Slow",
										icon: "🐌"
									},
									{
										rate: .8,
										label: "Recommended",
										icon: "🏃"
									},
									{
										rate: 1.3,
										label: "Fast",
										icon: "🐆"
									}
								].map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setWeeklyRateKg(opt.rate),
									className: `px-1.5 py-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition w-full min-w-0 ${weeklyRateKg === opt.rate ? "border-foreground bg-card shadow-sm" : "border-border bg-card/60 text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl",
										children: opt.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] sm:text-xs font-black text-foreground truncate w-full text-center tracking-tight leading-none",
										children: opt.label
									})]
								}, opt.label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-muted/60 p-4 space-y-2 border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-bold text-foreground",
										children: [
											"You will reach your goal in",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary font-black underline",
												children: plan.monthsText
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: weeklyRateKg <= .3 ? "Going slow means a gentler and more sustainable daily calorie goal." : weeklyRateKg <= .9 ? "This is the most balanced pace, motivating and ideal for most users." : "This pace moves quickly, staying consistent will be key."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs font-black text-foreground pt-1",
										children: [
											"Daily calorie goal: ",
											plan.targetCalories,
											" cal"
										]
									})
								]
							})
						]
					}),
					step === 14 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "Achieve twice as much progress with NutriLens vs on your own"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 items-end h-40 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full bg-muted rounded-2xl h-16 flex items-center justify-center font-black text-xs text-muted-foreground",
										children: "20%"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-muted-foreground",
										children: "Without NutriLens"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full bg-foreground rounded-2xl h-32 flex items-center justify-center font-black text-base text-background shadow-lg",
										children: "2X"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-black text-foreground",
										children: "With NutriLens"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-center font-medium text-muted-foreground",
								children: "NutriLens makes it easy and holds you accountable"
							})]
						})]
					}),
					step === 15 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "What's stopping you from reaching your goals?"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: [
								{
									name: "Lack of consistency",
									icon: "📊"
								},
								{
									name: "Unhealthy eating habits",
									icon: "🍔"
								},
								{
									name: "Lack of support",
									icon: "👥"
								},
								{
									name: "Busy schedule",
									icon: "📅"
								},
								{
									name: "Lack of meal inspiration",
									icon: "💡"
								}
							].map((opt) => {
								const selected = obstacle === opt.name;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setObstacle(opt.name),
									className: `w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${selected ? "border-foreground bg-card shadow-sm" : "border-border/80 bg-card/60 hover:border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg",
											children: opt.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-foreground",
											children: opt.name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-5 w-5 rounded-full border-2 grid place-items-center ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40"}`,
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-background" })
									})]
								}, opt.name);
							})
						})]
					}),
					step === 16 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "Do you follow a specific diet?"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-2.5 max-h-[420px] overflow-y-auto pr-1",
							children: [
								"Balanced",
								"Whole-food focus",
								"Mediterranean",
								"Flexitarian",
								"Pescatarian",
								"Vegetarian",
								"Vegan",
								"Low-carb",
								"Keto",
								"Paleo"
							].map((name) => {
								const selected = diet === name;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setDiet(name),
									className: `w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${selected ? "border-foreground bg-card shadow-sm" : "border-border/80 bg-card/60 hover:border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DietOptionIcon, { name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-foreground",
											children: name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-5 w-5 rounded-full border-2 grid place-items-center shrink-0 ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40"}`,
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-background" })
									})]
								}, name);
							})
						})]
					}),
					step === 17 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "What would you like to accomplish?"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: [
								{
									name: "Eat and live healthier",
									icon: "🍏"
								},
								{
									name: "Boost my energy and mood",
									icon: "☀️"
								},
								{
									name: "Stay motivated and consistent",
									icon: "💪"
								},
								{
									name: "Feel better about my body",
									icon: "🧘"
								}
							].map((opt) => {
								const selected = accomplishment === opt.name;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setAccomplishment(opt.name),
									className: `w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected ? "border-foreground bg-card shadow-md scale-[1.01]" : "border-border/80 bg-card/60 hover:border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xl",
											children: opt.icon
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-bold text-foreground",
											children: opt.name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-5 w-5 rounded-full border-2 grid place-items-center ${selected ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40"}`,
										children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-background" })
									})]
								}, opt.name);
							})
						})]
					}),
					step === 18 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "You have great potential to crush your goal"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-muted-foreground",
								children: "Your weight transition"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-40 w-full pt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									className: "w-full h-full overflow-visible",
									viewBox: "0 0 300 100",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M 10 80 Q 150 70, 280 20",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "3.5",
											className: "text-foreground"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "280",
											cy: "20",
											r: "5",
											className: "fill-foreground"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "10",
											y: "98",
											fill: "gray",
											fontSize: "9",
											fontWeight: "600",
											children: "3 Days"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "120",
											y: "98",
											fill: "gray",
											fontSize: "9",
											fontWeight: "600",
											children: "7 Days"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "250",
											y: "98",
											fill: "gray",
											fontSize: "9",
											fontWeight: "600",
											children: plan.targetDateFormatted
										})
									]
								})
							})]
						})]
					}),
					step === 19 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "Reach your goals with notifications"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[32px] border border-white/10 bg-[#0F1722] p-8 shadow-2xl space-y-6 max-w-sm mx-auto text-center backdrop-blur-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-14 w-14 rounded-full bg-[#182635] border border-sky-500/20 grid place-items-center mx-auto text-[#38BDF8] shadow-inner",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base sm:text-lg font-bold text-white tracking-tight leading-snug px-2",
									children: "NutriLens would like to send you Notifications"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setNotificationsAllowed(false);
											saveNotificationPreferences({ enabled: false });
											toast.info("Notifications disabled. You can turn them on anytime in Profile.");
										},
										className: `py-3.5 px-4 rounded-[22px] text-xs sm:text-sm font-bold transition-all border ${!notificationsAllowed ? "bg-[#1E293B] text-white border-white/20 shadow-md scale-100" : "bg-[#16212E] text-slate-400 border-white/5 hover:text-white"}`,
										children: "Don't Allow"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: async () => {
											setNotificationsAllowed(true);
											if (await requestNutriLensNotificationPermission()) toast.success("✓ Notifications enabled! Welcome alert sent.");
											else toast.success("✓ In-app NutriLens alerts activated.");
										},
										className: `py-3.5 px-4 rounded-[22px] text-xs sm:text-sm font-black transition-all ${notificationsAllowed ? "bg-[#38BDF8] text-[#081524] shadow-[0_0_24px_rgba(56,189,248,0.5)] scale-105" : "bg-[#38BDF8] text-[#081524] hover:bg-[#0EA5E9] shadow-[0_0_16px_rgba(56,189,248,0.35)]"}`,
										children: "Allow"
									})]
								}),
								notificationsAllowed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 animate-in fade-in duration-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-left flex items-start gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-sky-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-bold text-sky-300",
												children: "Smart Reminders Active"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-slate-300 leading-tight",
												children: "Daily meal logging, 2h hydration checks & 8:30 PM streak safeguard alerts are set."
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => triggerTestNotification("meal"),
										className: "mt-2 text-[11px] font-bold text-sky-400 hover:text-sky-300 underline",
										children: "Send test notification now"
									})]
								})
							]
						})]
					}),
					step === 20 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
								children: "Commit to your goal"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-3 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-extrabold text-foreground leading-relaxed",
									children: [
										"I am committed to my goal of ",
										goal === "gain" ? "gaining" : "losing",
										" ",
										displayWeight(desiredWeightKg),
										" by ",
										plan.targetDateFormatted,
										"."
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "I will track my meals, fuel my body with intention, and hold myself accountable."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center py-6 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onMouseDown: startHold,
									onMouseUp: endHold,
									onMouseLeave: endHold,
									onTouchStart: startHold,
									onTouchEnd: endHold,
									className: "relative h-28 w-28 rounded-full border-4 border-muted grid place-items-center cursor-pointer select-none active:scale-95 transition-transform",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										className: "absolute inset-0 h-full w-full -rotate-90",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "52",
											cy: "52",
											r: "48",
											className: "stroke-foreground",
											strokeWidth: "6",
											fill: "none",
											strokeDasharray: "301",
											strokeDashoffset: 301 - 301 * holdProgress / 100,
											strokeLinecap: "round"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-20 w-20 rounded-full bg-foreground text-background grid place-items-center shadow-lg",
										children: isCommitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-8 w-8 stroke-[3]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 animate-pulse" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-black text-foreground",
									children: isCommitted ? "Committed 🤝 This is the first step toward my goal." : "Tap and hold to make your commitment"
								})]
							})
						]
					}),
					step === 21 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-8 animate-in fade-in duration-300 text-center py-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-6xl sm:text-7xl font-black tracking-tight text-foreground",
									children: [genPercent, "%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-black text-foreground",
									children: "We're setting everything up for you"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full h-2 rounded-full bg-muted overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-foreground transition-all duration-75",
									style: { width: `${genPercent}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-muted-foreground animate-pulse",
								children: [
									"Customizing health plan...",
									"Applying BMR formula...",
									"Estimating metabolic age...",
									"Finalizing results..."
								][genStepIdx]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-border bg-card p-6 shadow-xl space-y-3 text-left max-w-xs mx-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2",
									children: "Daily recommendation for"
								}), [
									{
										label: "Calories",
										step: 0
									},
									{
										label: "Carbs",
										step: 1
									},
									{
										label: "Protein",
										step: 2
									},
									{
										label: "Fats",
										step: 2
									},
									{
										label: "Health score",
										step: 3
									}
								].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", item.label] }), genStepIdx >= item.step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full border border-muted-foreground/30" })]
								}, idx))]
							})
						]
					}),
					step === 22 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-12 w-12 rounded-full bg-foreground text-background grid place-items-center mx-auto shadow",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-6 w-6 stroke-[3]" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
										children: [
											goal === "gain" ? "Gain" : "Lose",
											" ",
											displayWeight(desiredWeightKg),
											" by",
											" ",
											plan.targetDateFormatted
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Follow this plan to achieve your target."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-border bg-card p-5 shadow-lg space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-muted-foreground",
									children: "Projected progress"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-28 w-full pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										className: "w-full h-full overflow-visible",
										viewBox: "0 0 300 80",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M 10 60 Q 150 50, 280 15",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "3.5",
												className: "text-foreground"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
												cx: "280",
												cy: "15",
												r: "5",
												className: "fill-foreground"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
												x: "10",
												y: "78",
												fill: "gray",
												fontSize: "9",
												fontWeight: "600",
												children: "Now"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
												x: "240",
												y: "78",
												fill: "gray",
												fontSize: "9",
												fontWeight: "600",
												children: plan.targetDateFormatted
											})
										]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-border bg-card p-5 shadow-lg space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
										children: "Your daily recommendation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-10 w-10 rounded-2xl bg-orange-500/10 text-orange-500 grid place-items-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-5 w-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-2xl font-black text-foreground",
											children: plan.targetCalories
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Calories"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-2 pt-2 border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-center p-2 rounded-xl bg-muted/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-black text-foreground",
													children: [plan.proteinG, "g"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] font-bold text-muted-foreground",
													children: "Protein"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-center p-2 rounded-xl bg-muted/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-black text-foreground",
													children: [plan.carbsG, "g"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] font-bold text-muted-foreground",
													children: "Carbs"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-center p-2 rounded-xl bg-muted/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-black text-foreground",
													children: [plan.fatsG, "g"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[10px] font-bold text-muted-foreground",
													children: "Fats"
												})]
											})
										]
									})
								]
							})
						]
					}),
					step === 23 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black text-foreground tracking-tight",
							children: "Create an account"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleFinishOnboarding,
								className: "w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-foreground text-background font-black text-sm hover:opacity-90 transition shadow-lg cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base",
									children: "G"
								}), " Sign in with Google"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleFinishOnboarding,
								className: "w-full p-4 rounded-2xl border-2 border-border bg-card text-foreground font-black text-sm hover:bg-muted transition cursor-pointer",
								children: "Skip"
							})]
						})]
					})
				]
			}),
			step !== 21 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full max-w-md pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						if (step === 20 && !isCommitted) {
							toast.info("Please tap and hold the button to commit to your goal!");
							return;
						}
						if (step === totalSteps) handleFinishOnboarding();
						else handleNext();
					},
					className: "w-full py-4 rounded-2xl bg-foreground text-background text-base font-black tracking-wide hover:opacity-90 transition active:scale-95 shadow-xl cursor-pointer flex items-center justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step === totalSteps ? "Get Started" : "Continue" }), step < totalSteps && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
				})
			})
		]
	});
}
var $$splitComponentImporter = () => import("./scan-CtVhGXf8.mjs");
var Route$4 = createFileRoute("/_authenticated/scan")({
	head: () => ({ meta: [{ title: "Scan — NutriLens" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/** Direct Gateway fetch for OpenAI-compatible chat/completions (used for vision JSON). */
async function gatewayChatCompletion(body) {
	const key = process.env.LOVABLE_API_KEY;
	if (!key) throw new Error("Missing LOVABLE_API_KEY");
	const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Lovable-API-Key": key,
			"X-Lovable-AIG-SDK": "lovable-direct"
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`AI Gateway ${res.status}: ${text}`);
	}
	return res.json();
}
/** Helper to dynamically load GEMINI_API_KEY from AI Studio workspace config or environment. */
function getGeminiApiKey() {
	const candidateFiles = [
		"/app/.dev.env.json",
		path.join(process.cwd(), ".dev.env.json"),
		path.join(process.cwd(), ".env")
	];
	for (const file of candidateFiles) try {
		if (fs.existsSync(file)) {
			const content = fs.readFileSync(file, "utf-8");
			if (file.endsWith(".json")) {
				const parsed = JSON.parse(content);
				if (typeof parsed.GEMINI_API_KEY === "string") {
					const val = parsed.GEMINI_API_KEY.trim();
					if (val && !val.startsWith("MY_GEMINI_") && val !== "your_api_key_here") return val;
				}
			} else {
				const match = content.match(/^\s*GEMINI_API_KEY\s*=\s*(.*)$/m);
				if (match && match[1]) {
					const val = match[1].trim().replace(/^["']|["']$/g, "");
					if (val && !val.startsWith("MY_GEMINI_") && val !== "your_api_key_here") return val;
				}
			}
		}
	} catch {}
	const envKey = process.env.GEMINI_API_KEY;
	if (envKey && typeof envKey === "string") {
		const val = envKey.trim();
		if (val && !val.startsWith("MY_GEMINI_") && val !== "your_api_key_here") return val;
	}
	return null;
}
var recipeDbInitPromise = null;
/**
* Ensure all Recipe & USDA tables in SQLite are initialized and seeded before queries run
*/
async function ensureRecipeDatabase() {
	if (recipeDbInitPromise) return recipeDbInitPromise;
	recipeDbInitPromise = (async () => {
		const db = await getSQLiteDB();
		if (!db) return null;
		try {
			db.run(`
        CREATE TABLE IF NOT EXISTS recipes (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          meal_type TEXT NOT NULL,
          diet_type TEXT NOT NULL,
          goal TEXT NOT NULL,
          cost_amount REAL DEFAULT 0,
          currency TEXT DEFAULT '₹',
          prep_minutes INTEGER DEFAULT 15,
          calories REAL DEFAULT 0,
          protein_g REAL DEFAULT 0,
          carbs_g REAL DEFAULT 0,
          fat_g REAL DEFAULT 0,
          fiber_g REAL DEFAULT 0,
          sugar_g REAL DEFAULT 0,
          sodium_mg REAL DEFAULT 0,
          iron_mg REAL DEFAULT 0,
          calcium_mg REAL DEFAULT 0,
          magnesium_mg REAL DEFAULT 0,
          potassium_mg REAL DEFAULT 0,
          vit_a_ug REAL DEFAULT 0,
          vit_b12_ug REAL DEFAULT 0,
          vit_d_ug REAL DEFAULT 0,
          omega3_g REAL DEFAULT 0,
          cuisine TEXT DEFAULT 'Indian',
          difficulty TEXT DEFAULT 'Easy',
          created_by TEXT DEFAULT 'system',
          source TEXT DEFAULT 'local_db',
          image_url TEXT,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS recipe_ingredients (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          name TEXT NOT NULL,
          normalized_name TEXT,
          quantity REAL DEFAULT 1,
          unit TEXT DEFAULT 'g',
          estimated_cost REAL DEFAULT 0,
          calories REAL DEFAULT 0,
          protein_g REAL DEFAULT 0,
          carbs_g REAL DEFAULT 0,
          fat_g REAL DEFAULT 0,
          fiber_g REAL DEFAULT 0,
          sugar_g REAL DEFAULT 0,
          FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS recipe_steps (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          step_number INTEGER NOT NULL,
          instruction TEXT NOT NULL,
          FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS recipe_tags (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          tag TEXT NOT NULL,
          FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS recipe_goals (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          goal TEXT NOT NULL,
          FOREIGN KEY(recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS recipe_ratings (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          rating INTEGER CHECK(rating >= 1 AND rating <= 5),
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS recipe_history (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          action TEXT NOT NULL,
          timestamp TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS favorite_recipes (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          added_at TEXT NOT NULL,
          UNIQUE(recipe_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS recent_recipes (
          id TEXT PRIMARY KEY,
          recipe_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          viewed_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS generated_meals (
          id TEXT PRIMARY KEY,
          meal_name TEXT NOT NULL,
          meal_type TEXT NOT NULL,
          diet_type TEXT NOT NULL,
          ingredients TEXT NOT NULL,
          normalized_ingredients TEXT NOT NULL,
          instructions TEXT NOT NULL,
          calories REAL DEFAULT 0,
          protein REAL DEFAULT 0,
          carbs REAL DEFAULT 0,
          fat REAL DEFAULT 0,
          fiber REAL DEFAULT 0,
          micronutrients TEXT,
          prep_time INTEGER DEFAULT 15,
          estimated_cost TEXT DEFAULT '₹60',
          nutrition_verified INTEGER DEFAULT 1,
          created_at TEXT NOT NULL,
          usage_count INTEGER DEFAULT 1,
          last_used_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS user_meal_history (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          meal_id TEXT NOT NULL,
          meal_name TEXT NOT NULL,
          meal_type TEXT NOT NULL,
          shown_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS usda_ingredients (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          aliases TEXT NOT NULL, -- JSON array of string aliases
          default_unit TEXT DEFAULT 'g',
          unit_grams REAL DEFAULT 1,
          calories_per_100g REAL DEFAULT 0,
          protein_per_100g REAL DEFAULT 0,
          carbs_per_100g REAL DEFAULT 0,
          fat_per_100g REAL DEFAULT 0,
          fiber_per_100g REAL DEFAULT 0,
          sugar_per_100g REAL DEFAULT 0,
          sodium_per_100g REAL DEFAULT 0,
          iron_per_100g REAL DEFAULT 0,
          calcium_per_100g REAL DEFAULT 0,
          magnesium_per_100g REAL DEFAULT 0,
          potassium_per_100g REAL DEFAULT 0,
          vit_a_per_100g REAL DEFAULT 0,
          vit_b12_per_100g REAL DEFAULT 0,
          vit_d_per_100g REAL DEFAULT 0,
          omega3_per_100g REAL DEFAULT 0,
          avg_cost_per_100g REAL DEFAULT 10
        );

        CREATE INDEX IF NOT EXISTS idx_recipes_meal_diet ON recipes(meal_type, diet_type);
        CREATE INDEX IF NOT EXISTS idx_recipes_cost_prep ON recipes(cost_amount, prep_minutes);
        CREATE INDEX IF NOT EXISTS idx_recipes_goal ON recipes(goal);
        CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
        CREATE INDEX IF NOT EXISTS idx_recipes_cal_pro ON recipes(calories, protein_g);
        CREATE INDEX IF NOT EXISTS idx_recipes_diet ON recipes(diet_type);
        CREATE INDEX IF NOT EXISTS idx_recipes_meal ON recipes(meal_type);
      `);
			await seedUSDAIngredientsIfEmptyInternal(db);
			await seedCuratedRecipesIfEmptyInternal(db);
			persistDatabase(db);
			return db;
		} catch (err) {
			console.error("[RecipeDB] Error initializing tables:", err);
			recipeDbInitPromise = null;
			return null;
		}
	})();
	return recipeDbInitPromise;
}
var USDA_SEEDS = [
	{
		id: "usda-1",
		name: "Rolled Oats",
		aliases: [
			"oats",
			"rolled oats",
			"oatmeal",
			"quaker oats",
			"oat flakes",
			"porridge oats"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 389,
		protein_per_100g: 16.9,
		carbs_per_100g: 66.3,
		fat_per_100g: 6.9,
		fiber_per_100g: 10.6,
		sugar_per_100g: .9,
		sodium_per_100g: 2,
		iron_per_100g: 4.7,
		calcium_per_100g: 54,
		magnesium_per_100g: 177,
		potassium_per_100g: 429,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 15
	},
	{
		id: "usda-2",
		name: "Soya Granules / Chunks",
		aliases: [
			"soya granules",
			"soya chunks",
			"soy protein",
			"soy nuggets",
			"mealmaker"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 345,
		protein_per_100g: 52,
		carbs_per_100g: 33,
		fat_per_100g: .5,
		fiber_per_100g: 13,
		sugar_per_100g: 2,
		sodium_per_100g: 10,
		iron_per_100g: 20,
		calcium_per_100g: 350,
		magnesium_per_100g: 220,
		potassium_per_100g: 1400,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 18
	},
	{
		id: "usda-3",
		name: "Cottage Cheese / Paneer",
		aliases: [
			"paneer",
			"cottage cheese",
			"low fat paneer",
			"fresh paneer"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 265,
		protein_per_100g: 18.3,
		carbs_per_100g: 1.2,
		fat_per_100g: 20.8,
		fiber_per_100g: 0,
		sugar_per_100g: 1.2,
		sodium_per_100g: 18,
		iron_per_100g: .2,
		calcium_per_100g: 480,
		magnesium_per_100g: 12,
		potassium_per_100g: 80,
		vit_a_per_100g: 30,
		vit_b12_per_100g: .8,
		vit_d_per_100g: .5,
		omega3_per_100g: .1,
		avg_cost_per_100g: 35
	},
	{
		id: "usda-4",
		name: "Whole Egg, cooked",
		aliases: [
			"egg",
			"eggs",
			"whole egg",
			"whole eggs",
			"boiled egg",
			"scrambled egg",
			"cooked egg",
			"poached egg",
			"fried egg"
		],
		default_unit: "piece",
		unit_grams: 50,
		calories_per_100g: 155,
		protein_per_100g: 12.6,
		carbs_per_100g: 1.1,
		fat_per_100g: 10.6,
		fiber_per_100g: 0,
		sugar_per_100g: .6,
		sodium_per_100g: 124,
		iron_per_100g: 1.8,
		calcium_per_100g: 50,
		magnesium_per_100g: 12,
		potassium_per_100g: 126,
		vit_a_per_100g: 160,
		vit_b12_per_100g: .9,
		vit_d_per_100g: 2,
		omega3_per_100g: .1,
		avg_cost_per_100g: 14
	},
	{
		id: "usda-5",
		name: "Chicken Breast, cooked",
		aliases: [
			"cooked chicken breast",
			"chicken breast",
			"cooked chicken",
			"grilled chicken",
			"boneless chicken",
			"chicken",
			"chicken mince",
			"chicken breast boneless skinless"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 165,
		protein_per_100g: 31,
		carbs_per_100g: 0,
		fat_per_100g: 3.6,
		fiber_per_100g: 0,
		sugar_per_100g: 0,
		sodium_per_100g: 74,
		iron_per_100g: 1,
		calcium_per_100g: 15,
		magnesium_per_100g: 29,
		potassium_per_100g: 256,
		vit_a_per_100g: 6,
		vit_b12_per_100g: .3,
		vit_d_per_100g: .1,
		omega3_per_100g: .05,
		avg_cost_per_100g: 28
	},
	{
		id: "usda-5b",
		name: "Chicken Breast, raw",
		aliases: [
			"raw chicken breast",
			"raw chicken",
			"raw boneless chicken"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 120,
		protein_per_100g: 22.5,
		carbs_per_100g: 0,
		fat_per_100g: 2.6,
		fiber_per_100g: 0,
		sugar_per_100g: 0,
		sodium_per_100g: 65,
		iron_per_100g: .9,
		calcium_per_100g: 11,
		magnesium_per_100g: 25,
		potassium_per_100g: 220,
		vit_a_per_100g: 5,
		vit_b12_per_100g: .2,
		vit_d_per_100g: .1,
		omega3_per_100g: .04,
		avg_cost_per_100g: 25
	},
	{
		id: "usda-6",
		name: "Milk (Toned / Low Fat)",
		aliases: [
			"milk",
			"toned milk",
			"cow milk",
			"skimmed milk",
			"whole milk"
		],
		default_unit: "ml",
		unit_grams: 1,
		calories_per_100g: 58,
		protein_per_100g: 3.4,
		carbs_per_100g: 4.8,
		fat_per_100g: 3.1,
		fiber_per_100g: 0,
		sugar_per_100g: 5,
		sodium_per_100g: 44,
		iron_per_100g: .03,
		calcium_per_100g: 120,
		magnesium_per_100g: 11,
		potassium_per_100g: 150,
		vit_a_per_100g: 46,
		vit_b12_per_100g: .45,
		vit_d_per_100g: 1.2,
		omega3_per_100g: .05,
		avg_cost_per_100g: 6
	},
	{
		id: "usda-7",
		name: "White Rice, cooked",
		aliases: [
			"cooked rice",
			"cooked white rice",
			"rice",
			"white rice",
			"basmati rice",
			"steamed rice",
			"cooked basmati rice"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 130,
		protein_per_100g: 2.7,
		carbs_per_100g: 28,
		fat_per_100g: .3,
		fiber_per_100g: .4,
		sugar_per_100g: .1,
		sodium_per_100g: 1,
		iron_per_100g: .2,
		calcium_per_100g: 10,
		magnesium_per_100g: 12,
		potassium_per_100g: 35,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 5
	},
	{
		id: "usda-8",
		name: "Yellow Lentils / Toor Dal, cooked",
		aliases: [
			"dal",
			"cooked dal",
			"toor dal",
			"yellow lentils",
			"moong dal",
			"masoor dal",
			"lentils",
			"cooked lentils"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 116,
		protein_per_100g: 9,
		carbs_per_100g: 20,
		fat_per_100g: .4,
		fiber_per_100g: 4.8,
		sugar_per_100g: .8,
		sodium_per_100g: 12,
		iron_per_100g: 1.8,
		calcium_per_100g: 28,
		magnesium_per_100g: 38,
		potassium_per_100g: 360,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 8
	},
	{
		id: "usda-9",
		name: "Whole Wheat Roti / Chapati",
		aliases: [
			"roti",
			"rotis",
			"chapati",
			"chapatis",
			"wheat flour",
			"atta",
			"whole wheat roti",
			"phulka"
		],
		default_unit: "piece",
		unit_grams: 40,
		calories_per_100g: 250,
		protein_per_100g: 9,
		carbs_per_100g: 48,
		fat_per_100g: 2.5,
		fiber_per_100g: 7,
		sugar_per_100g: 1,
		sodium_per_100g: 5,
		iron_per_100g: 3.5,
		calcium_per_100g: 30,
		magnesium_per_100g: 80,
		potassium_per_100g: 250,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 8
	},
	{
		id: "usda-10",
		name: "Peanut Butter",
		aliases: [
			"peanut butter",
			"peanuts",
			"roasted peanuts"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 588,
		protein_per_100g: 25,
		carbs_per_100g: 20,
		fat_per_100g: 50,
		fiber_per_100g: 6,
		sugar_per_100g: 9,
		sodium_per_100g: 400,
		iron_per_100g: 1.9,
		calcium_per_100g: 43,
		magnesium_per_100g: 150,
		potassium_per_100g: 650,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 25
	},
	{
		id: "usda-11",
		name: "Fresh Banana",
		aliases: [
			"banana",
			"bananas",
			"ripe banana",
			"fresh banana"
		],
		default_unit: "piece",
		unit_grams: 100,
		calories_per_100g: 89,
		protein_per_100g: 1.1,
		carbs_per_100g: 22.8,
		fat_per_100g: .3,
		fiber_per_100g: 2.6,
		sugar_per_100g: 12.2,
		sodium_per_100g: 1,
		iron_per_100g: .3,
		calcium_per_100g: 5,
		magnesium_per_100g: 27,
		potassium_per_100g: 358,
		vit_a_per_100g: 64,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 5
	},
	{
		id: "usda-12",
		name: "Curd / Dahi / Greek Yogurt",
		aliases: [
			"curd",
			"dahi",
			"yogurt",
			"greek yogurt"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 61,
		protein_per_100g: 3.5,
		carbs_per_100g: 4.7,
		fat_per_100g: 3.3,
		fiber_per_100g: 0,
		sugar_per_100g: 4.7,
		sodium_per_100g: 46,
		iron_per_100g: .1,
		calcium_per_100g: 121,
		magnesium_per_100g: 12,
		potassium_per_100g: 155,
		vit_a_per_100g: 27,
		vit_b12_per_100g: .4,
		vit_d_per_100g: .1,
		omega3_per_100g: 0,
		avg_cost_per_100g: 8
	},
	{
		id: "usda-13",
		name: "Chickpeas / Chana, cooked",
		aliases: [
			"chana",
			"cooked chickpeas",
			"chickpeas",
			"white chana",
			"black chana",
			"kabuli chana",
			"boiled chana"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 164,
		protein_per_100g: 8.9,
		carbs_per_100g: 27.4,
		fat_per_100g: 2.6,
		fiber_per_100g: 7.6,
		sugar_per_100g: 4.8,
		sodium_per_100g: 24,
		iron_per_100g: 2.9,
		calcium_per_100g: 49,
		magnesium_per_100g: 48,
		potassium_per_100g: 291,
		vit_a_per_100g: 27,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .05,
		avg_cost_per_100g: 8
	},
	{
		id: "usda-14",
		name: "Spinach / Palak",
		aliases: [
			"spinach",
			"palak",
			"green spinach",
			"steamed spinach",
			"sautéed spinach"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 23,
		protein_per_100g: 2.9,
		carbs_per_100g: 3.6,
		fat_per_100g: .4,
		fiber_per_100g: 2.2,
		sugar_per_100g: .4,
		sodium_per_100g: 79,
		iron_per_100g: 2.7,
		calcium_per_100g: 99,
		magnesium_per_100g: 79,
		potassium_per_100g: 558,
		vit_a_per_100g: 469,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 6
	},
	{
		id: "usda-15",
		name: "Whey Protein Powder",
		aliases: [
			"whey protein",
			"protein powder",
			"whey isolate",
			"whey concentrate"
		],
		default_unit: "scoop",
		unit_grams: 30,
		calories_per_100g: 380,
		protein_per_100g: 80,
		carbs_per_100g: 5,
		fat_per_100g: 3,
		fiber_per_100g: 1,
		sugar_per_100g: 2,
		sodium_per_100g: 160,
		iron_per_100g: 1.2,
		calcium_per_100g: 400,
		magnesium_per_100g: 60,
		potassium_per_100g: 450,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 1,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 100
	},
	{
		id: "usda-16",
		name: "Sweet Potato, cooked",
		aliases: [
			"sweet potato",
			"sweet potatoes",
			"roasted sweet potato",
			"baked sweet potato",
			"cooked sweet potato",
			"yam",
			"shakarkandi"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 86,
		protein_per_100g: 1.6,
		carbs_per_100g: 20.1,
		fat_per_100g: .1,
		fiber_per_100g: 3,
		sugar_per_100g: 4.2,
		sodium_per_100g: 55,
		iron_per_100g: .6,
		calcium_per_100g: 30,
		magnesium_per_100g: 25,
		potassium_per_100g: 337,
		vit_a_per_100g: 709,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 8
	},
	{
		id: "usda-17",
		name: "Broccoli, steamed",
		aliases: [
			"steamed broccoli",
			"broccoli",
			"cooked broccoli",
			"roasted broccoli",
			"calabrese"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 34,
		protein_per_100g: 2.8,
		carbs_per_100g: 6.6,
		fat_per_100g: .4,
		fiber_per_100g: 2.6,
		sugar_per_100g: 1.7,
		sodium_per_100g: 33,
		iron_per_100g: .7,
		calcium_per_100g: 47,
		magnesium_per_100g: 21,
		potassium_per_100g: 316,
		vit_a_per_100g: 31,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 12
	},
	{
		id: "usda-18",
		name: "Olive Oil / Cooking Oil / Ghee / Butter",
		aliases: [
			"cooking oil",
			"olive oil",
			"oil",
			"ghee",
			"vegetable oil",
			"mustard oil",
			"butter",
			"sunflower oil"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 884,
		protein_per_100g: 0,
		carbs_per_100g: 0,
		fat_per_100g: 100,
		fiber_per_100g: 0,
		sugar_per_100g: 0,
		sodium_per_100g: 2,
		iron_per_100g: .5,
		calcium_per_100g: 1,
		magnesium_per_100g: 0,
		potassium_per_100g: 1,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .8,
		avg_cost_per_100g: 25
	},
	{
		id: "usda-19",
		name: "Avocado",
		aliases: [
			"avocado",
			"raw avocado",
			"guacamole",
			"avocados"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 160,
		protein_per_100g: 2,
		carbs_per_100g: 8.5,
		fat_per_100g: 14.7,
		fiber_per_100g: 6.7,
		sugar_per_100g: .7,
		sodium_per_100g: 7,
		iron_per_100g: .6,
		calcium_per_100g: 12,
		magnesium_per_100g: 29,
		potassium_per_100g: 485,
		vit_a_per_100g: 7,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 35
	},
	{
		id: "usda-20",
		name: "Potato, cooked",
		aliases: [
			"potato",
			"potatoes",
			"baked potato",
			"boiled potato",
			"mashed potato",
			"roasted potato",
			"alu",
			"aloo"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 93,
		protein_per_100g: 2.5,
		carbs_per_100g: 21.2,
		fat_per_100g: .1,
		fiber_per_100g: 2.2,
		sugar_per_100g: 1.2,
		sodium_per_100g: 10,
		iron_per_100g: 1.1,
		calcium_per_100g: 15,
		magnesium_per_100g: 28,
		potassium_per_100g: 535,
		vit_a_per_100g: 2,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 5
	},
	{
		id: "usda-21",
		name: "Brown Rice / Quinoa, cooked",
		aliases: [
			"brown rice",
			"cooked brown rice",
			"quinoa",
			"cooked quinoa",
			"wild rice"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 112,
		protein_per_100g: 2.6,
		carbs_per_100g: 23.5,
		fat_per_100g: .9,
		fiber_per_100g: 1.8,
		sugar_per_100g: .4,
		sodium_per_100g: 5,
		iron_per_100g: .8,
		calcium_per_100g: 10,
		magnesium_per_100g: 43,
		potassium_per_100g: 83,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 12
	},
	{
		id: "usda-22",
		name: "Salmon / Fish Fillet, cooked",
		aliases: [
			"salmon",
			"grilled salmon",
			"fish",
			"fish fillet",
			"tuna",
			"cod",
			"tilapia",
			"seared salmon",
			"cooked fish"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 206,
		protein_per_100g: 22.1,
		carbs_per_100g: 0,
		fat_per_100g: 12.3,
		fiber_per_100g: 0,
		sugar_per_100g: 0,
		sodium_per_100g: 61,
		iron_per_100g: .8,
		calcium_per_100g: 12,
		magnesium_per_100g: 29,
		potassium_per_100g: 363,
		vit_a_per_100g: 12,
		vit_b12_per_100g: 3.2,
		vit_d_per_100g: 11,
		omega3_per_100g: 2.1,
		avg_cost_per_100g: 60
	},
	{
		id: "usda-23",
		name: "Almonds / Nuts",
		aliases: [
			"almonds",
			"nuts",
			"walnuts",
			"cashews",
			"mixed nuts",
			"badam"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 579,
		protein_per_100g: 21.2,
		carbs_per_100g: 21.6,
		fat_per_100g: 49.9,
		fiber_per_100g: 12.5,
		sugar_per_100g: 4.4,
		sodium_per_100g: 1,
		iron_per_100g: 3.7,
		calcium_per_100g: 269,
		magnesium_per_100g: 270,
		potassium_per_100g: 733,
		vit_a_per_100g: 1,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 80
	},
	{
		id: "usda-24",
		name: "Whole Wheat Bread / Toast",
		aliases: [
			"whole wheat bread",
			"bread",
			"toast",
			"slice bread",
			"white bread",
			"slices bread"
		],
		default_unit: "slice",
		unit_grams: 30,
		calories_per_100g: 247,
		protein_per_100g: 13,
		carbs_per_100g: 41,
		fat_per_100g: 3.4,
		fiber_per_100g: 6,
		sugar_per_100g: 5,
		sodium_per_100g: 450,
		iron_per_100g: 2.5,
		calcium_per_100g: 100,
		magnesium_per_100g: 70,
		potassium_per_100g: 250,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 10
	},
	{
		id: "usda-25",
		name: "Apple, raw",
		aliases: [
			"apple",
			"apples",
			"fresh apple",
			"raw apple"
		],
		default_unit: "piece",
		unit_grams: 150,
		calories_per_100g: 52,
		protein_per_100g: .3,
		carbs_per_100g: 13.8,
		fat_per_100g: .2,
		fiber_per_100g: 2.4,
		sugar_per_100g: 10.4,
		sodium_per_100g: 1,
		iron_per_100g: .1,
		calcium_per_100g: 6,
		magnesium_per_100g: 5,
		potassium_per_100g: 107,
		vit_a_per_100g: 3,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 12
	},
	{
		id: "usda-26",
		name: "Berries (Strawberries / Blueberries)",
		aliases: [
			"berries",
			"berry",
			"strawberries",
			"blueberries",
			"blackberries",
			"raspberries",
			"mixed berries"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 57,
		protein_per_100g: .7,
		carbs_per_100g: 14,
		fat_per_100g: .3,
		fiber_per_100g: 2.4,
		sugar_per_100g: 10,
		sodium_per_100g: 1,
		iron_per_100g: .4,
		calcium_per_100g: 16,
		magnesium_per_100g: 12,
		potassium_per_100g: 148,
		vit_a_per_100g: 2,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 30
	},
	{
		id: "usda-27",
		name: "Mixed Vegetables, cooked",
		aliases: [
			"mixed vegetables",
			"mixed veg",
			"mixed veggies",
			"sautéed vegetables",
			"steamed vegetables",
			"vegetables",
			"veggies"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 60,
		protein_per_100g: 2.5,
		carbs_per_100g: 11,
		fat_per_100g: .4,
		fiber_per_100g: 3.2,
		sugar_per_100g: 3.5,
		sodium_per_100g: 45,
		iron_per_100g: .8,
		calcium_per_100g: 35,
		magnesium_per_100g: 20,
		potassium_per_100g: 220,
		vit_a_per_100g: 120,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 10
	},
	{
		id: "usda-28",
		name: "Butter",
		aliases: [
			"butter",
			"salted butter",
			"unsalted butter",
			"makhan"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 717,
		protein_per_100g: .9,
		carbs_per_100g: .1,
		fat_per_100g: 81.1,
		fiber_per_100g: 0,
		sugar_per_100g: .1,
		sodium_per_100g: 643,
		iron_per_100g: .02,
		calcium_per_100g: 24,
		magnesium_per_100g: 2,
		potassium_per_100g: 24,
		vit_a_per_100g: 684,
		vit_b12_per_100g: .2,
		vit_d_per_100g: 1.5,
		omega3_per_100g: .3,
		avg_cost_per_100g: 25
	},
	{
		id: "usda-29",
		name: "Greek Yogurt",
		aliases: [
			"greek yogurt",
			"greek yoghurt",
			"plain greek yogurt",
			"hung curd"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 97,
		protein_per_100g: 9,
		carbs_per_100g: 3.8,
		fat_per_100g: 5,
		fiber_per_100g: 0,
		sugar_per_100g: 3.6,
		sodium_per_100g: 36,
		iron_per_100g: .1,
		calcium_per_100g: 100,
		magnesium_per_100g: 11,
		potassium_per_100g: 141,
		vit_a_per_100g: 25,
		vit_b12_per_100g: .5,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 20
	},
	{
		id: "usda-30",
		name: "Egg White, cooked",
		aliases: [
			"egg white",
			"egg whites",
			"boiled egg white",
			"boiled egg whites",
			"cooked egg white",
			"scrambled egg whites"
		],
		default_unit: "piece",
		unit_grams: 33,
		calories_per_100g: 52,
		protein_per_100g: 11,
		carbs_per_100g: .7,
		fat_per_100g: .2,
		fiber_per_100g: 0,
		sugar_per_100g: .7,
		sodium_per_100g: 166,
		iron_per_100g: .1,
		calcium_per_100g: 7,
		magnesium_per_100g: 11,
		potassium_per_100g: 163,
		vit_a_per_100g: 0,
		vit_b12_per_100g: .1,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 12
	},
	{
		id: "usda-31",
		name: "Tofu (Firm / Soy Paneer)",
		aliases: [
			"tofu",
			"firm tofu",
			"soy paneer",
			"silken tofu",
			"organic tofu",
			"bean curd"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 76,
		protein_per_100g: 8.1,
		carbs_per_100g: 1.9,
		fat_per_100g: 4.8,
		fiber_per_100g: .9,
		sugar_per_100g: .5,
		sodium_per_100g: 7,
		iron_per_100g: 5.4,
		calcium_per_100g: 350,
		magnesium_per_100g: 30,
		potassium_per_100g: 121,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .6,
		avg_cost_per_100g: 22
	},
	{
		id: "usda-32",
		name: "Rajma / Red Kidney Beans, cooked",
		aliases: [
			"rajma",
			"cooked rajma",
			"kidney beans",
			"red kidney beans",
			"boiled rajma",
			"rajma masala",
			"rajma curry"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 127,
		protein_per_100g: 8.7,
		carbs_per_100g: 22.8,
		fat_per_100g: .5,
		fiber_per_100g: 6.4,
		sugar_per_100g: .3,
		sodium_per_100g: 2,
		iron_per_100g: 2.9,
		calcium_per_100g: 28,
		magnesium_per_100g: 45,
		potassium_per_100g: 405,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 10
	},
	{
		id: "usda-33",
		name: "Dal Makhani, cooked",
		aliases: [
			"dal makhani",
			"dal makhni",
			"black dal",
			"maa ki dal",
			"creamy dal"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 145,
		protein_per_100g: 5.5,
		carbs_per_100g: 16,
		fat_per_100g: 6.8,
		fiber_per_100g: 4.2,
		sugar_per_100g: 1,
		sodium_per_100g: 340,
		iron_per_100g: 1.9,
		calcium_per_100g: 45,
		magnesium_per_100g: 32,
		potassium_per_100g: 280,
		vit_a_per_100g: 35,
		vit_b12_per_100g: .1,
		vit_d_per_100g: .1,
		omega3_per_100g: .05,
		avg_cost_per_100g: 14
	},
	{
		id: "usda-34",
		name: "Paneer Butter Masala / Makhani",
		aliases: [
			"paneer butter masala",
			"paneer makhani",
			"shahi paneer",
			"paneer curry",
			"kadai paneer",
			"paneer tikka masala"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 185,
		protein_per_100g: 8.5,
		carbs_per_100g: 7,
		fat_per_100g: 13.5,
		fiber_per_100g: 1.5,
		sugar_per_100g: 3,
		sodium_per_100g: 380,
		iron_per_100g: .8,
		calcium_per_100g: 210,
		magnesium_per_100g: 18,
		potassium_per_100g: 170,
		vit_a_per_100g: 85,
		vit_b12_per_100g: .4,
		vit_d_per_100g: .2,
		omega3_per_100g: .1,
		avg_cost_per_100g: 25
	},
	{
		id: "usda-35",
		name: "Butter Chicken / Chicken Tikka Masala",
		aliases: [
			"butter chicken",
			"murgh makhani",
			"chicken tikka masala",
			"chicken curry",
			"kadai chicken"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 175,
		protein_per_100g: 14.5,
		carbs_per_100g: 5.5,
		fat_per_100g: 10.5,
		fiber_per_100g: 1.2,
		sugar_per_100g: 2.5,
		sodium_per_100g: 420,
		iron_per_100g: 1.2,
		calcium_per_100g: 35,
		magnesium_per_100g: 22,
		potassium_per_100g: 240,
		vit_a_per_100g: 60,
		vit_b12_per_100g: .3,
		vit_d_per_100g: .1,
		omega3_per_100g: .08,
		avg_cost_per_100g: 30
	},
	{
		id: "usda-36",
		name: "Chicken Biryani",
		aliases: [
			"chicken biryani",
			"biryani",
			"murgh biryani",
			"hyderabadi biryani",
			"dum biryani"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 165,
		protein_per_100g: 9.5,
		carbs_per_100g: 20,
		fat_per_100g: 5.2,
		fiber_per_100g: 1.1,
		sugar_per_100g: .5,
		sodium_per_100g: 310,
		iron_per_100g: 1.1,
		calcium_per_100g: 22,
		magnesium_per_100g: 19,
		potassium_per_100g: 160,
		vit_a_per_100g: 15,
		vit_b12_per_100g: .2,
		vit_d_per_100g: .05,
		omega3_per_100g: .04,
		avg_cost_per_100g: 25
	},
	{
		id: "usda-37",
		name: "Vegetable Biryani / Pulao",
		aliases: [
			"veg biryani",
			"vegetable biryani",
			"veg pulao",
			"pulao",
			"peas pulao"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 140,
		protein_per_100g: 3.5,
		carbs_per_100g: 24,
		fat_per_100g: 3.2,
		fiber_per_100g: 2,
		sugar_per_100g: 1.2,
		sodium_per_100g: 260,
		iron_per_100g: .9,
		calcium_per_100g: 25,
		magnesium_per_100g: 18,
		potassium_per_100g: 140,
		vit_a_per_100g: 45,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .02,
		avg_cost_per_100g: 15
	},
	{
		id: "usda-38",
		name: "Egg Bhurji / Scrambled Eggs with onions",
		aliases: [
			"egg bhurji",
			"anda bhurji",
			"scrambled eggs with onions",
			"egg masala",
			"anda masala"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 165,
		protein_per_100g: 11.2,
		carbs_per_100g: 3.5,
		fat_per_100g: 11.8,
		fiber_per_100g: .8,
		sugar_per_100g: 1.5,
		sodium_per_100g: 310,
		iron_per_100g: 1.9,
		calcium_per_100g: 58,
		magnesium_per_100g: 16,
		potassium_per_100g: 175,
		vit_a_per_100g: 140,
		vit_b12_per_100g: .8,
		vit_d_per_100g: 1.8,
		omega3_per_100g: .1,
		avg_cost_per_100g: 16
	},
	{
		id: "usda-39",
		name: "Egg Curry",
		aliases: [
			"egg curry",
			"anda curry",
			"boiled egg curry",
			"egg gravy"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 145,
		protein_per_100g: 8.5,
		carbs_per_100g: 4.5,
		fat_per_100g: 10.2,
		fiber_per_100g: 1,
		sugar_per_100g: 1.8,
		sodium_per_100g: 340,
		iron_per_100g: 1.6,
		calcium_per_100g: 45,
		magnesium_per_100g: 15,
		potassium_per_100g: 165,
		vit_a_per_100g: 110,
		vit_b12_per_100g: .6,
		vit_d_per_100g: 1.2,
		omega3_per_100g: .08,
		avg_cost_per_100g: 18
	},
	{
		id: "usda-40",
		name: "Chole / Chana Masala, cooked",
		aliases: [
			"chole",
			"chana masala",
			"chhole",
			"punjabi chole",
			"cooked chana masala"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 140,
		protein_per_100g: 6.8,
		carbs_per_100g: 19.5,
		fat_per_100g: 4.2,
		fiber_per_100g: 5.5,
		sugar_per_100g: 2.2,
		sodium_per_100g: 350,
		iron_per_100g: 2.4,
		calcium_per_100g: 48,
		magnesium_per_100g: 42,
		potassium_per_100g: 260,
		vit_a_per_100g: 30,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .05,
		avg_cost_per_100g: 12
	},
	{
		id: "usda-41",
		name: "Plain Paratha / Aloo Paratha",
		aliases: [
			"paratha",
			"parathas",
			"plain paratha",
			"aloo paratha",
			"parantha"
		],
		default_unit: "piece",
		unit_grams: 70,
		calories_per_100g: 280,
		protein_per_100g: 6.5,
		carbs_per_100g: 42,
		fat_per_100g: 9.8,
		fiber_per_100g: 4.5,
		sugar_per_100g: 1.2,
		sodium_per_100g: 220,
		iron_per_100g: 2.2,
		calcium_per_100g: 25,
		magnesium_per_100g: 45,
		potassium_per_100g: 190,
		vit_a_per_100g: 10,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .05,
		avg_cost_per_100g: 12
	},
	{
		id: "usda-42",
		name: "Naan / Garlic Naan / Tandoori Roti",
		aliases: [
			"naan",
			"garlic naan",
			"butter naan",
			"tandoori roti",
			"tandoori naan"
		],
		default_unit: "piece",
		unit_grams: 80,
		calories_per_100g: 290,
		protein_per_100g: 8.5,
		carbs_per_100g: 50,
		fat_per_100g: 6.2,
		fiber_per_100g: 2.5,
		sugar_per_100g: 2.8,
		sodium_per_100g: 410,
		iron_per_100g: 2,
		calcium_per_100g: 60,
		magnesium_per_100g: 25,
		potassium_per_100g: 130,
		vit_a_per_100g: 15,
		vit_b12_per_100g: .1,
		vit_d_per_100g: 0,
		omega3_per_100g: .02,
		avg_cost_per_100g: 15
	},
	{
		id: "usda-43",
		name: "Poha, cooked",
		aliases: [
			"poha",
			"cooked poha",
			"kanda poha",
			"flattened rice",
			"batata poha",
			"chivda"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 130,
		protein_per_100g: 2.6,
		carbs_per_100g: 26.5,
		fat_per_100g: 1.8,
		fiber_per_100g: 1.5,
		sugar_per_100g: 1,
		sodium_per_100g: 180,
		iron_per_100g: 2.8,
		calcium_per_100g: 15,
		magnesium_per_100g: 20,
		potassium_per_100g: 95,
		vit_a_per_100g: 12,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .02,
		avg_cost_per_100g: 8
	},
	{
		id: "usda-44",
		name: "Upma, cooked",
		aliases: [
			"upma",
			"rava upma",
			"sooji upma",
			"semolina upma"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 135,
		protein_per_100g: 3.2,
		carbs_per_100g: 24,
		fat_per_100g: 3,
		fiber_per_100g: 1.4,
		sugar_per_100g: .8,
		sodium_per_100g: 210,
		iron_per_100g: 1.2,
		calcium_per_100g: 18,
		magnesium_per_100g: 15,
		potassium_per_100g: 85,
		vit_a_per_100g: 8,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .02,
		avg_cost_per_100g: 8
	},
	{
		id: "usda-45",
		name: "Idli (Steamed Rice-Lentil Cake)",
		aliases: [
			"idli",
			"idlis",
			"steamed idli",
			"rice idli"
		],
		default_unit: "piece",
		unit_grams: 50,
		calories_per_100g: 130,
		protein_per_100g: 4.2,
		carbs_per_100g: 27.5,
		fat_per_100g: .4,
		fiber_per_100g: 1.5,
		sugar_per_100g: .2,
		sodium_per_100g: 140,
		iron_per_100g: .8,
		calcium_per_100g: 15,
		magnesium_per_100g: 22,
		potassium_per_100g: 80,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 10
	},
	{
		id: "usda-46",
		name: "Dosa (Plain / Masala Dosa)",
		aliases: [
			"dosa",
			"masala dosa",
			"plain dosa",
			"crispy dosa",
			"ghee roast dosa"
		],
		default_unit: "piece",
		unit_grams: 100,
		calories_per_100g: 170,
		protein_per_100g: 3.9,
		carbs_per_100g: 29,
		fat_per_100g: 4.5,
		fiber_per_100g: 1.8,
		sugar_per_100g: .5,
		sodium_per_100g: 230,
		iron_per_100g: 1.1,
		calcium_per_100g: 20,
		magnesium_per_100g: 25,
		potassium_per_100g: 110,
		vit_a_per_100g: 5,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .02,
		avg_cost_per_100g: 12
	},
	{
		id: "usda-47",
		name: "Samosa",
		aliases: [
			"samosa",
			"samosas",
			"aloo samosa",
			"fried samosa",
			"punjabi samosa"
		],
		default_unit: "piece",
		unit_grams: 75,
		calories_per_100g: 260,
		protein_per_100g: 4.5,
		carbs_per_100g: 32,
		fat_per_100g: 13,
		fiber_per_100g: 2.8,
		sugar_per_100g: 1.5,
		sodium_per_100g: 420,
		iron_per_100g: 1.6,
		calcium_per_100g: 22,
		magnesium_per_100g: 28,
		potassium_per_100g: 210,
		vit_a_per_100g: 8,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 15
	},
	{
		id: "usda-48",
		name: "Pasta / Spaghetti, cooked with tomato sauce",
		aliases: [
			"pasta",
			"spaghetti",
			"penne pasta",
			"cooked pasta",
			"pasta with sauce",
			"macaroni",
			"red sauce pasta"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 130,
		protein_per_100g: 4.8,
		carbs_per_100g: 24.5,
		fat_per_100g: 1.5,
		fiber_per_100g: 2,
		sugar_per_100g: 2.5,
		sodium_per_100g: 260,
		iron_per_100g: 1.2,
		calcium_per_100g: 18,
		magnesium_per_100g: 24,
		potassium_per_100g: 210,
		vit_a_per_100g: 18,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .02,
		avg_cost_per_100g: 15
	},
	{
		id: "usda-49",
		name: "Noodles / Hakka Noodles / Chowmein",
		aliases: [
			"noodles",
			"hakka noodles",
			"veg noodles",
			"chowmein",
			"ramen",
			"fried noodles"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 155,
		protein_per_100g: 4.2,
		carbs_per_100g: 26,
		fat_per_100g: 3.8,
		fiber_per_100g: 1.8,
		sugar_per_100g: 1.2,
		sodium_per_100g: 390,
		iron_per_100g: 1,
		calcium_per_100g: 16,
		magnesium_per_100g: 18,
		potassium_per_100g: 120,
		vit_a_per_100g: 12,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .03,
		avg_cost_per_100g: 14
	},
	{
		id: "usda-50",
		name: "Pizza (Cheese / Veggie Slice)",
		aliases: [
			"pizza",
			"pizza slice",
			"cheese pizza",
			"margherita pizza",
			"veggie pizza"
		],
		default_unit: "slice",
		unit_grams: 100,
		calories_per_100g: 266,
		protein_per_100g: 11.5,
		carbs_per_100g: 33,
		fat_per_100g: 10.2,
		fiber_per_100g: 2.3,
		sugar_per_100g: 3.6,
		sodium_per_100g: 590,
		iron_per_100g: 2.2,
		calcium_per_100g: 190,
		magnesium_per_100g: 24,
		potassium_per_100g: 172,
		vit_a_per_100g: 80,
		vit_b12_per_100g: .6,
		vit_d_per_100g: .2,
		omega3_per_100g: .1,
		avg_cost_per_100g: 35
	},
	{
		id: "usda-51",
		name: "Burger / Veg / Chicken Burger",
		aliases: [
			"burger",
			"cheeseburger",
			"chicken burger",
			"veg burger",
			"hamburger"
		],
		default_unit: "piece",
		unit_grams: 150,
		calories_per_100g: 250,
		protein_per_100g: 13,
		carbs_per_100g: 24,
		fat_per_100g: 11.5,
		fiber_per_100g: 1.8,
		sugar_per_100g: 4.2,
		sodium_per_100g: 480,
		iron_per_100g: 2.3,
		calcium_per_100g: 110,
		magnesium_per_100g: 22,
		potassium_per_100g: 230,
		vit_a_per_100g: 40,
		vit_b12_per_100g: .8,
		vit_d_per_100g: .2,
		omega3_per_100g: .1,
		avg_cost_per_100g: 30
	},
	{
		id: "usda-52",
		name: "French Fries",
		aliases: [
			"french fries",
			"fries",
			"potato fries",
			"chips fries",
			"finger chips"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 312,
		protein_per_100g: 3.4,
		carbs_per_100g: 41.4,
		fat_per_100g: 15,
		fiber_per_100g: 3.8,
		sugar_per_100g: .3,
		sodium_per_100g: 210,
		iron_per_100g: .8,
		calcium_per_100g: 18,
		magnesium_per_100g: 35,
		potassium_per_100g: 579,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 20
	},
	{
		id: "usda-53",
		name: "Sandwich (Veg / Chicken Grilled)",
		aliases: [
			"sandwich",
			"grilled sandwich",
			"veg sandwich",
			"chicken sandwich",
			"club sandwich"
		],
		default_unit: "piece",
		unit_grams: 140,
		calories_per_100g: 210,
		protein_per_100g: 8.5,
		carbs_per_100g: 26,
		fat_per_100g: 8.2,
		fiber_per_100g: 2.8,
		sugar_per_100g: 3.2,
		sodium_per_100g: 380,
		iron_per_100g: 1.8,
		calcium_per_100g: 85,
		magnesium_per_100g: 28,
		potassium_per_100g: 180,
		vit_a_per_100g: 35,
		vit_b12_per_100g: .3,
		vit_d_per_100g: .1,
		omega3_per_100g: .08,
		avg_cost_per_100g: 22
	},
	{
		id: "usda-54",
		name: "Tuna (Canned in water)",
		aliases: [
			"tuna",
			"canned tuna",
			"tuna in water",
			"tuna fish"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 116,
		protein_per_100g: 25.5,
		carbs_per_100g: 0,
		fat_per_100g: .8,
		fiber_per_100g: 0,
		sugar_per_100g: 0,
		sodium_per_100g: 330,
		iron_per_100g: 1.3,
		calcium_per_100g: 11,
		magnesium_per_100g: 28,
		potassium_per_100g: 237,
		vit_a_per_100g: 18,
		vit_b12_per_100g: 2.8,
		vit_d_per_100g: 1.7,
		omega3_per_100g: .3,
		avg_cost_per_100g: 50
	},
	{
		id: "usda-55",
		name: "Prawns / Shrimp, cooked",
		aliases: [
			"prawns",
			"shrimp",
			"cooked prawns",
			"cooked shrimp",
			"grilled shrimp",
			"jhinga"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 99,
		protein_per_100g: 24,
		carbs_per_100g: .2,
		fat_per_100g: .3,
		fiber_per_100g: 0,
		sugar_per_100g: 0,
		sodium_per_100g: 111,
		iron_per_100g: .5,
		calcium_per_100g: 70,
		magnesium_per_100g: 39,
		potassium_per_100g: 259,
		vit_a_per_100g: 54,
		vit_b12_per_100g: 1.2,
		vit_d_per_100g: .1,
		omega3_per_100g: .4,
		avg_cost_per_100g: 65
	},
	{
		id: "usda-56",
		name: "Cheese (Cheddar / Mozzarella / Processed)",
		aliases: [
			"cheese",
			"cheddar",
			"mozzarella",
			"cheese slice",
			"processed cheese",
			"parmesan"
		],
		default_unit: "slice",
		unit_grams: 20,
		calories_per_100g: 350,
		protein_per_100g: 23,
		carbs_per_100g: 2.5,
		fat_per_100g: 28,
		fiber_per_100g: 0,
		sugar_per_100g: .5,
		sodium_per_100g: 650,
		iron_per_100g: .4,
		calcium_per_100g: 720,
		magnesium_per_100g: 28,
		potassium_per_100g: 98,
		vit_a_per_100g: 260,
		vit_b12_per_100g: 1.5,
		vit_d_per_100g: .6,
		omega3_per_100g: .4,
		avg_cost_per_100g: 45
	},
	{
		id: "usda-57",
		name: "Chia Seeds",
		aliases: [
			"chia seeds",
			"chia",
			"sabja seeds",
			"basil seeds"
		],
		default_unit: "tbsp",
		unit_grams: 12,
		calories_per_100g: 486,
		protein_per_100g: 16.5,
		carbs_per_100g: 42.1,
		fat_per_100g: 30.7,
		fiber_per_100g: 34.4,
		sugar_per_100g: 0,
		sodium_per_100g: 16,
		iron_per_100g: 7.7,
		calcium_per_100g: 631,
		magnesium_per_100g: 335,
		potassium_per_100g: 407,
		vit_a_per_100g: 54,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 17.8,
		avg_cost_per_100g: 50
	},
	{
		id: "usda-58",
		name: "Flax Seeds",
		aliases: [
			"flax seeds",
			"flaxseed",
			"alsi",
			"flax"
		],
		default_unit: "tbsp",
		unit_grams: 10,
		calories_per_100g: 534,
		protein_per_100g: 18.3,
		carbs_per_100g: 28.9,
		fat_per_100g: 42.2,
		fiber_per_100g: 27.3,
		sugar_per_100g: 1.5,
		sodium_per_100g: 30,
		iron_per_100g: 5.7,
		calcium_per_100g: 255,
		magnesium_per_100g: 392,
		potassium_per_100g: 813,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 22.8,
		avg_cost_per_100g: 35
	},
	{
		id: "usda-59",
		name: "Walnuts",
		aliases: [
			"walnuts",
			"akhrot",
			"walnut pieces"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 654,
		protein_per_100g: 15.2,
		carbs_per_100g: 13.7,
		fat_per_100g: 65.2,
		fiber_per_100g: 6.7,
		sugar_per_100g: 2.6,
		sodium_per_100g: 2,
		iron_per_100g: 2.9,
		calcium_per_100g: 98,
		magnesium_per_100g: 158,
		potassium_per_100g: 441,
		vit_a_per_100g: 20,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 9.1,
		avg_cost_per_100g: 90
	},
	{
		id: "usda-60",
		name: "Cashews",
		aliases: [
			"cashews",
			"cashew nuts",
			"kaju",
			"roasted cashews"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 553,
		protein_per_100g: 18.2,
		carbs_per_100g: 30.2,
		fat_per_100g: 43.8,
		fiber_per_100g: 3.3,
		sugar_per_100g: 5.9,
		sodium_per_100g: 12,
		iron_per_100g: 6.7,
		calcium_per_100g: 37,
		magnesium_per_100g: 292,
		potassium_per_100g: 660,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 85
	},
	{
		id: "usda-61",
		name: "Mango, fresh",
		aliases: [
			"mango",
			"fresh mango",
			"ripe mango",
			"aam",
			"mango slices"
		],
		default_unit: "piece",
		unit_grams: 150,
		calories_per_100g: 60,
		protein_per_100g: .8,
		carbs_per_100g: 15,
		fat_per_100g: .4,
		fiber_per_100g: 1.6,
		sugar_per_100g: 13.7,
		sodium_per_100g: 1,
		iron_per_100g: .2,
		calcium_per_100g: 11,
		magnesium_per_100g: 10,
		potassium_per_100g: 168,
		vit_a_per_100g: 54,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .04,
		avg_cost_per_100g: 15
	},
	{
		id: "usda-62",
		name: "Orange / Citrus Fruit",
		aliases: [
			"orange",
			"oranges",
			"santra",
			"mosambi",
			"tangerine",
			"clementine",
			"citrus"
		],
		default_unit: "piece",
		unit_grams: 130,
		calories_per_100g: 47,
		protein_per_100g: .9,
		carbs_per_100g: 11.8,
		fat_per_100g: .1,
		fiber_per_100g: 2.4,
		sugar_per_100g: 9.4,
		sodium_per_100g: 0,
		iron_per_100g: .1,
		calcium_per_100g: 40,
		magnesium_per_100g: 10,
		potassium_per_100g: 181,
		vit_a_per_100g: 11,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .01,
		avg_cost_per_100g: 10
	},
	{
		id: "usda-63",
		name: "Papaya, fresh",
		aliases: [
			"papaya",
			"fresh papaya",
			"ripe papaya",
			"papita"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 43,
		protein_per_100g: .5,
		carbs_per_100g: 10.8,
		fat_per_100g: .3,
		fiber_per_100g: 1.7,
		sugar_per_100g: 7.8,
		sodium_per_100g: 8,
		iron_per_100g: .3,
		calcium_per_100g: 20,
		magnesium_per_100g: 21,
		potassium_per_100g: 182,
		vit_a_per_100g: 47,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .02,
		avg_cost_per_100g: 8
	},
	{
		id: "usda-64",
		name: "Watermelon",
		aliases: [
			"watermelon",
			"fresh watermelon",
			"tarbooz"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 30,
		protein_per_100g: .6,
		carbs_per_100g: 7.6,
		fat_per_100g: .2,
		fiber_per_100g: .4,
		sugar_per_100g: 6.2,
		sodium_per_100g: 1,
		iron_per_100g: .2,
		calcium_per_100g: 7,
		magnesium_per_100g: 10,
		potassium_per_100g: 112,
		vit_a_per_100g: 28,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .01,
		avg_cost_per_100g: 6
	},
	{
		id: "usda-65",
		name: "Cucumber",
		aliases: [
			"cucumber",
			"cucumbers",
			"kheera",
			"kakdi",
			"raw cucumber"
		],
		default_unit: "piece",
		unit_grams: 100,
		calories_per_100g: 15,
		protein_per_100g: .7,
		carbs_per_100g: 3.6,
		fat_per_100g: .1,
		fiber_per_100g: .5,
		sugar_per_100g: 1.7,
		sodium_per_100g: 2,
		iron_per_100g: .3,
		calcium_per_100g: 16,
		magnesium_per_100g: 13,
		potassium_per_100g: 147,
		vit_a_per_100g: 5,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 4
	},
	{
		id: "usda-66",
		name: "Tomato, fresh",
		aliases: [
			"tomato",
			"tomatoes",
			"tamatar",
			"fresh tomato",
			"cherry tomatoes"
		],
		default_unit: "piece",
		unit_grams: 90,
		calories_per_100g: 18,
		protein_per_100g: .9,
		carbs_per_100g: 3.9,
		fat_per_100g: .2,
		fiber_per_100g: 1.2,
		sugar_per_100g: 2.6,
		sodium_per_100g: 5,
		iron_per_100g: .3,
		calcium_per_100g: 10,
		magnesium_per_100g: 11,
		potassium_per_100g: 237,
		vit_a_per_100g: 42,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 5
	},
	{
		id: "usda-67",
		name: "Onion, fresh",
		aliases: [
			"onion",
			"onions",
			"pyaz",
			"red onion",
			"white onion",
			"chopped onion"
		],
		default_unit: "piece",
		unit_grams: 80,
		calories_per_100g: 40,
		protein_per_100g: 1.1,
		carbs_per_100g: 9.3,
		fat_per_100g: .1,
		fiber_per_100g: 1.7,
		sugar_per_100g: 4.2,
		sodium_per_100g: 4,
		iron_per_100g: .2,
		calcium_per_100g: 23,
		magnesium_per_100g: 10,
		potassium_per_100g: 146,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 4
	},
	{
		id: "usda-68",
		name: "Cauliflower / Gobi, cooked",
		aliases: [
			"cauliflower",
			"gobi",
			"cooked cauliflower",
			"steamed cauliflower",
			"aloo gobi"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 25,
		protein_per_100g: 1.9,
		carbs_per_100g: 5,
		fat_per_100g: .3,
		fiber_per_100g: 2,
		sugar_per_100g: 1.9,
		sodium_per_100g: 30,
		iron_per_100g: .4,
		calcium_per_100g: 22,
		magnesium_per_100g: 15,
		potassium_per_100g: 299,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .04,
		avg_cost_per_100g: 6
	},
	{
		id: "usda-69",
		name: "Green Peas / Matar, cooked",
		aliases: [
			"green peas",
			"peas",
			"matar",
			"cooked peas",
			"boiled peas"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 84,
		protein_per_100g: 5.4,
		carbs_per_100g: 15.6,
		fat_per_100g: .4,
		fiber_per_100g: 5.5,
		sugar_per_100g: 5.7,
		sodium_per_100g: 5,
		iron_per_100g: 1.5,
		calcium_per_100g: 25,
		magnesium_per_100g: 33,
		potassium_per_100g: 244,
		vit_a_per_100g: 38,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: .03,
		avg_cost_per_100g: 10
	},
	{
		id: "usda-70",
		name: "Mushroom (Button), cooked",
		aliases: [
			"mushroom",
			"mushrooms",
			"button mushroom",
			"cooked mushroom",
			"grilled mushrooms"
		],
		default_unit: "g",
		unit_grams: 1,
		calories_per_100g: 28,
		protein_per_100g: 3.1,
		carbs_per_100g: 4.1,
		fat_per_100g: .5,
		fiber_per_100g: 1.5,
		sugar_per_100g: 1.8,
		sodium_per_100g: 4,
		iron_per_100g: .5,
		calcium_per_100g: 3,
		magnesium_per_100g: 12,
		potassium_per_100g: 356,
		vit_a_per_100g: 0,
		vit_b12_per_100g: .04,
		vit_d_per_100g: .2,
		omega3_per_100g: 0,
		avg_cost_per_100g: 15
	},
	{
		id: "usda-71",
		name: "Tea / Chai with Milk and Sugar",
		aliases: [
			"chai",
			"tea",
			"milk tea",
			"indian tea",
			"masala chai",
			"cup of tea"
		],
		default_unit: "cup",
		unit_grams: 150,
		calories_per_100g: 45,
		protein_per_100g: 1.8,
		carbs_per_100g: 5.5,
		fat_per_100g: 1.7,
		fiber_per_100g: 0,
		sugar_per_100g: 5,
		sodium_per_100g: 25,
		iron_per_100g: .1,
		calcium_per_100g: 65,
		magnesium_per_100g: 8,
		potassium_per_100g: 85,
		vit_a_per_100g: 20,
		vit_b12_per_100g: .2,
		vit_d_per_100g: .5,
		omega3_per_100g: .02,
		avg_cost_per_100g: 5
	},
	{
		id: "usda-72",
		name: "Coffee with Milk",
		aliases: [
			"coffee",
			"latte",
			"cappuccino",
			"milk coffee",
			"hot coffee",
			"cold coffee"
		],
		default_unit: "cup",
		unit_grams: 150,
		calories_per_100g: 50,
		protein_per_100g: 2.2,
		carbs_per_100g: 5.8,
		fat_per_100g: 2,
		fiber_per_100g: 0,
		sugar_per_100g: 5.2,
		sodium_per_100g: 30,
		iron_per_100g: .1,
		calcium_per_100g: 75,
		magnesium_per_100g: 12,
		potassium_per_100g: 110,
		vit_a_per_100g: 22,
		vit_b12_per_100g: .3,
		vit_d_per_100g: .6,
		omega3_per_100g: .03,
		avg_cost_per_100g: 8
	},
	{
		id: "usda-73",
		name: "Honey",
		aliases: [
			"honey",
			"raw honey",
			"pure honey",
			"shahad"
		],
		default_unit: "tbsp",
		unit_grams: 20,
		calories_per_100g: 304,
		protein_per_100g: .3,
		carbs_per_100g: 82.4,
		fat_per_100g: 0,
		fiber_per_100g: .2,
		sugar_per_100g: 82.1,
		sodium_per_100g: 4,
		iron_per_100g: .4,
		calcium_per_100g: 6,
		magnesium_per_100g: 2,
		potassium_per_100g: 52,
		vit_a_per_100g: 0,
		vit_b12_per_100g: 0,
		vit_d_per_100g: 0,
		omega3_per_100g: 0,
		avg_cost_per_100g: 30
	},
	{
		id: "usda-74",
		name: "Dark Chocolate (70%+)",
		aliases: [
			"dark chocolate",
			"chocolate",
			"cocoa",
			"70% dark chocolate"
		],
		default_unit: "piece",
		unit_grams: 20,
		calories_per_100g: 598,
		protein_per_100g: 7.8,
		carbs_per_100g: 45.9,
		fat_per_100g: 42.6,
		fiber_per_100g: 10.9,
		sugar_per_100g: 24,
		sodium_per_100g: 20,
		iron_per_100g: 11.9,
		calcium_per_100g: 73,
		magnesium_per_100g: 228,
		potassium_per_100g: 715,
		vit_a_per_100g: 2,
		vit_b12_per_100g: .3,
		vit_d_per_100g: 0,
		omega3_per_100g: .1,
		avg_cost_per_100g: 60
	}
];
/**
* Seed USDA / Local Nutrition Database with standard foods, nutrients, and cost metrics
*/
async function seedUSDAIngredientsIfEmptyInternal(db) {
	if (!db) return;
	try {
		for (const ing of USDA_SEEDS) db.run(`INSERT OR REPLACE INTO usda_ingredients (
          id, name, aliases, default_unit, unit_grams,
          calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g,
          sugar_per_100g, sodium_per_100g, iron_per_100g, calcium_per_100g, magnesium_per_100g,
          potassium_per_100g, vit_a_per_100g, vit_b12_per_100g, vit_d_per_100g, omega3_per_100g, avg_cost_per_100g
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			ing.id,
			ing.name,
			JSON.stringify(ing.aliases),
			ing.default_unit,
			ing.unit_grams,
			ing.calories_per_100g,
			ing.protein_per_100g,
			ing.carbs_per_100g,
			ing.fat_per_100g,
			ing.fiber_per_100g,
			ing.sugar_per_100g,
			ing.sodium_per_100g,
			ing.iron_per_100g,
			ing.calcium_per_100g,
			ing.magnesium_per_100g,
			ing.potassium_per_100g,
			ing.vit_a_per_100g,
			ing.vit_b12_per_100g,
			ing.vit_d_per_100g,
			ing.omega3_per_100g,
			ing.avg_cost_per_100g
		]);
	} catch (e) {
		console.error("[RecipeDB] Error seeding USDA ingredients:", e);
	}
}
/**
* Seed initial curated recipes into SQLite if empty
*/
async function seedCuratedRecipesIfEmptyInternal(db) {
	if (!db) return;
	try {
		const checkStmt = db.prepare(`SELECT COUNT(*) as cnt FROM recipes`);
		if (checkStmt.step()) {
			const row = checkStmt.getAsObject();
			checkStmt.free();
			if (row.cnt > 0) return;
		} else checkStmt.free();
		const curatedList = [
			{
				id: "rec-b1",
				name: "High-Protein Soya Granules & Paneer Scramble",
				meal_type: "Breakfast",
				diet_type: "veg",
				goal: "Muscle Gain",
				cost_amount: 32,
				currency: "₹",
				prep_minutes: 12,
				calories: 420,
				protein_g: 38,
				carbs_g: 28,
				fat_g: 14,
				fiber_g: 8,
				sugar_g: 3,
				sodium_mg: 320,
				iron_mg: 8.5,
				calcium_mg: 380,
				magnesium_mg: 140,
				potassium_mg: 620,
				vit_a_ug: 40,
				vit_b12_ug: .6,
				vit_d_ug: .4,
				omega3_g: .2,
				cuisine: "Indian",
				difficulty: "Easy",
				created_by: "system",
				source: "local_db",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				ingredients: [
					{
						name: "Soya Granules",
						quantity: 50,
						unit: "g",
						estimated_cost: 9,
						calories: 172,
						protein_g: 26,
						carbs_g: 16,
						fat_g: .2
					},
					{
						name: "Cottage Cheese / Paneer",
						quantity: 50,
						unit: "g",
						estimated_cost: 18,
						calories: 132,
						protein_g: 9,
						carbs_g: 1,
						fat_g: 10
					},
					{
						name: "Whole Wheat Roti",
						quantity: 1,
						unit: "piece",
						estimated_cost: 5,
						calories: 100,
						protein_g: 3,
						carbs_g: 19,
						fat_g: 1
					}
				],
				steps: [
					{
						step_number: 1,
						instruction: "Soak 50g soya granules in boiling hot water for 5 minutes then drain thoroughly."
					},
					{
						step_number: 2,
						instruction: "Saute chopped onions, green chilies, and tomatoes in 1 tsp oil."
					},
					{
						step_number: 3,
						instruction: "Add drained soya granules, crumbled paneer, salt, turmeric, and garam masala."
					},
					{
						step_number: 4,
						instruction: "Stir fry for 4 minutes until golden and serve hot with 1 roti."
					}
				],
				tags: [
					"High Protein",
					"Budget",
					"Vegetarian",
					"Quick"
				],
				goals: [
					"Muscle Gain",
					"Lean Bulk",
					"High Protein"
				]
			},
			{
				id: "rec-b2",
				name: "Boiled Egg White Salad with Roasted Chickpeas",
				meal_type: "Breakfast",
				diet_type: "eggetarian",
				goal: "Weight Loss",
				cost_amount: 28,
				currency: "₹",
				prep_minutes: 10,
				calories: 310,
				protein_g: 30,
				carbs_g: 26,
				fat_g: 6,
				fiber_g: 7,
				sugar_g: 2,
				sodium_mg: 280,
				iron_mg: 3.8,
				calcium_mg: 90,
				magnesium_mg: 60,
				potassium_mg: 450,
				vit_a_ug: 120,
				vit_b12_ug: 1.2,
				vit_d_ug: 1.5,
				omega3_g: .1,
				cuisine: "Indian",
				difficulty: "Easy",
				created_by: "system",
				source: "local_db",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				ingredients: [{
					name: "Whole Egg",
					quantity: 4,
					unit: "piece",
					estimated_cost: 24,
					calories: 200,
					protein_g: 24,
					carbs_g: 2,
					fat_g: 4
				}, {
					name: "Chickpeas / Chana",
					quantity: 30,
					unit: "g",
					estimated_cost: 4,
					calories: 110,
					protein_g: 6,
					carbs_g: 18,
					fat_g: 2
				}],
				steps: [
					{
						step_number: 1,
						instruction: "Boil 4 eggs for 10 minutes. Remove yolk from 3 eggs, keeping 1 whole egg."
					},
					{
						step_number: 2,
						instruction: "Chop egg whites and 1 whole egg into bite-sized cubes."
					},
					{
						step_number: 3,
						instruction: "Mix with boiled/roasted chickpeas, cucumber, chat masala, and lemon juice."
					}
				],
				tags: [
					"Low Fat",
					"High Protein",
					"Weight Loss",
					"Keto Friendly"
				],
				goals: [
					"Weight Loss",
					"Fat Loss",
					"Keto",
					"High Protein"
				]
			},
			{
				id: "rec-l1",
				name: "Grilled Chicken Breast with Steamed Brown Rice & Dal",
				meal_type: "Lunch",
				diet_type: "non_veg",
				goal: "Lean Bulk",
				cost_amount: 65,
				currency: "₹",
				prep_minutes: 20,
				calories: 550,
				protein_g: 48,
				carbs_g: 58,
				fat_g: 9,
				fiber_g: 8,
				sugar_g: 2,
				sodium_mg: 410,
				iron_mg: 4.2,
				calcium_mg: 110,
				magnesium_mg: 130,
				potassium_mg: 780,
				vit_a_ug: 20,
				vit_b12_ug: .8,
				vit_d_ug: .2,
				omega3_g: .1,
				cuisine: "Indian",
				difficulty: "Medium",
				created_by: "system",
				source: "local_db",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				ingredients: [
					{
						name: "Chicken Breast Boneless Skinless",
						quantity: 150,
						unit: "g",
						estimated_cost: 42,
						calories: 247,
						protein_g: 46,
						carbs_g: 0,
						fat_g: 5
					},
					{
						name: "White Rice / Basmati Rice",
						quantity: 150,
						unit: "g",
						estimated_cost: 12,
						calories: 195,
						protein_g: 4,
						carbs_g: 42,
						fat_g: .5
					},
					{
						name: "Yellow Lentils / Toor Dal",
						quantity: 30,
						unit: "g",
						estimated_cost: 11,
						calories: 103,
						protein_g: 7,
						carbs_g: 18,
						fat_g: .5
					}
				],
				steps: [
					{
						step_number: 1,
						instruction: "Marinate chicken breast in yogurt, ginger-garlic paste, and cumin powder."
					},
					{
						step_number: 2,
						instruction: "Pan sear or grill chicken for 6-7 minutes on each side until cooked through."
					},
					{
						step_number: 3,
						instruction: "Serve with warm cooked rice and freshly tempered dal."
					}
				],
				tags: [
					"High Protein",
					"Lean Bulk",
					"Gym Friendly"
				],
				goals: [
					"Lean Bulk",
					"Muscle Gain",
					"Maintenance"
				]
			},
			{
				id: "rec-l2",
				name: "Diabetic-Friendly Moong Dal Chilla with Palak & Curd",
				meal_type: "Lunch",
				diet_type: "veg",
				goal: "Diabetic",
				cost_amount: 25,
				currency: "₹",
				prep_minutes: 15,
				calories: 340,
				protein_g: 22,
				carbs_g: 42,
				fat_g: 8,
				fiber_g: 11,
				sugar_g: 3,
				sodium_mg: 290,
				iron_mg: 6.1,
				calcium_mg: 210,
				magnesium_mg: 150,
				potassium_mg: 820,
				vit_a_ug: 310,
				vit_b12_ug: .4,
				vit_d_ug: .1,
				omega3_g: .1,
				cuisine: "Indian",
				difficulty: "Easy",
				created_by: "system",
				source: "local_db",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				ingredients: [
					{
						name: "Yellow Lentils / Toor Dal",
						quantity: 60,
						unit: "g",
						estimated_cost: 11,
						calories: 205,
						protein_g: 13,
						carbs_g: 37,
						fat_g: 1
					},
					{
						name: "Spinach / Palak",
						quantity: 50,
						unit: "g",
						estimated_cost: 6,
						calories: 12,
						protein_g: 1,
						carbs_g: 2,
						fat_g: .2
					},
					{
						name: "Curd / Dahi / Greek Yogurt",
						quantity: 100,
						unit: "g",
						estimated_cost: 8,
						calories: 61,
						protein_g: 3.5,
						carbs_g: 4.7,
						fat_g: 3.3
					}
				],
				steps: [
					{
						step_number: 1,
						instruction: "Grind soaked moong dal with green chillies, ginger, and spinach into a batter."
					},
					{
						step_number: 2,
						instruction: "Pour batter onto hot non-stick tawa and make crispy chillas using minimal oil."
					},
					{
						step_number: 3,
						instruction: "Serve hot with low-fat fresh curd."
					}
				],
				tags: [
					"Low GI",
					"Diabetic Friendly",
					"High Fiber",
					"Vegan Option"
				],
				goals: [
					"Diabetic",
					"Weight Loss",
					"Vegetarian"
				]
			},
			{
				id: "rec-s1",
				name: "Peanut Butter Oatmeal Shake with Banana",
				meal_type: "Snack",
				diet_type: "vegan",
				goal: "Muscle Gain",
				cost_amount: 30,
				currency: "₹",
				prep_minutes: 5,
				calories: 410,
				protein_g: 18,
				carbs_g: 54,
				fat_g: 14,
				fiber_g: 8,
				sugar_g: 16,
				sodium_mg: 110,
				iron_mg: 3.2,
				calcium_mg: 160,
				magnesium_mg: 130,
				potassium_mg: 680,
				vit_a_ug: 50,
				vit_b12_ug: 0,
				vit_d_ug: 0,
				omega3_g: .1,
				cuisine: "Global",
				difficulty: "Easy",
				created_by: "system",
				source: "local_db",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				ingredients: [
					{
						name: "Rolled Oats",
						quantity: 40,
						unit: "g",
						estimated_cost: 6,
						calories: 155,
						protein_g: 6,
						carbs_g: 26,
						fat_g: 2.8
					},
					{
						name: "Peanut Butter",
						quantity: 20,
						unit: "g",
						estimated_cost: 8,
						calories: 118,
						protein_g: 5,
						carbs_g: 4,
						fat_g: 10
					},
					{
						name: "Fresh Banana",
						quantity: 1,
						unit: "piece",
						estimated_cost: 5,
						calories: 89,
						protein_g: 1,
						carbs_g: 23,
						fat_g: .3
					},
					{
						name: "Milk (Toned / Low Fat)",
						quantity: 150,
						unit: "ml",
						estimated_cost: 9,
						calories: 87,
						protein_g: 5,
						carbs_g: 7,
						fat_g: 4.6
					}
				],
				steps: [
					{
						step_number: 1,
						instruction: "Add oats, peanut butter, banana slices, and milk to blender jar."
					},
					{
						step_number: 2,
						instruction: "Blend on high speed for 45 seconds until smooth."
					},
					{
						step_number: 3,
						instruction: "Pour into tall glass and enjoy immediately."
					}
				],
				tags: [
					"Quick",
					"Vegan",
					"High Energy",
					"Pre-workout"
				],
				goals: [
					"Muscle Gain",
					"Lean Bulk",
					"Vegan"
				]
			},
			{
				id: "rec-d1",
				name: "Palak Paneer with 2 Whole Wheat Chapatis",
				meal_type: "Dinner",
				diet_type: "veg",
				goal: "Maintenance",
				cost_amount: 45,
				currency: "₹",
				prep_minutes: 20,
				calories: 460,
				protein_g: 24,
				carbs_g: 44,
				fat_g: 20,
				fiber_g: 9,
				sugar_g: 3,
				sodium_mg: 380,
				iron_mg: 6.4,
				calcium_mg: 520,
				magnesium_mg: 160,
				potassium_mg: 890,
				vit_a_ug: 520,
				vit_b12_ug: .8,
				vit_d_ug: .5,
				omega3_g: .2,
				cuisine: "Indian",
				difficulty: "Medium",
				created_by: "system",
				source: "local_db",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				ingredients: [
					{
						name: "Spinach / Palak",
						quantity: 150,
						unit: "g",
						estimated_cost: 9,
						calories: 35,
						protein_g: 4,
						carbs_g: 5,
						fat_g: .6
					},
					{
						name: "Cottage Cheese / Paneer",
						quantity: 80,
						unit: "g",
						estimated_cost: 28,
						calories: 212,
						protein_g: 15,
						carbs_g: 1,
						fat_g: 16
					},
					{
						name: "Whole Wheat Roti",
						quantity: 2,
						unit: "piece",
						estimated_cost: 10,
						calories: 200,
						protein_g: 6,
						carbs_g: 38,
						fat_g: 2
					}
				],
				steps: [
					{
						step_number: 1,
						instruction: "Blanch spinach in hot water for 2 minutes, then blend into smooth puree."
					},
					{
						step_number: 2,
						instruction: "Saute cumin, ginger, garlic, onion, and spices in 1 tsp ghee."
					},
					{
						step_number: 3,
						instruction: "Add spinach puree and paneer cubes. Simmer for 5 minutes."
					},
					{
						step_number: 4,
						instruction: "Serve hot with 2 whole wheat rotis."
					}
				],
				tags: [
					"High Calcium",
					"Balanced",
					"Comfort Food"
				],
				goals: [
					"Maintenance",
					"Vegetarian",
					"High Protein"
				]
			}
		];
		for (const rec of curatedList) await saveRecipeToSQLite(rec);
	} catch (e) {
		console.error("[RecipeDB] Error seeding initial recipes:", e);
	}
}
/**
* Save a complete recipe into SQLite
*/
async function saveRecipeToSQLite(recipe) {
	const db = await ensureRecipeDatabase();
	if (!db) return;
	try {
		db.run(`INSERT OR REPLACE INTO recipes (
        id, name, meal_type, diet_type, goal, cost_amount, currency, prep_minutes,
        calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg,
        iron_mg, calcium_mg, magnesium_mg, potassium_mg, vit_a_ug, vit_b12_ug, vit_d_ug, omega3_g,
        cuisine, difficulty, created_by, source, image_url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
			recipe.id,
			recipe.name,
			recipe.meal_type,
			recipe.diet_type,
			recipe.goal,
			recipe.cost_amount,
			recipe.currency || "₹",
			recipe.prep_minutes,
			recipe.calories,
			recipe.protein_g,
			recipe.carbs_g,
			recipe.fat_g,
			recipe.fiber_g || 0,
			recipe.sugar_g || 0,
			recipe.sodium_mg || 0,
			recipe.iron_mg || 0,
			recipe.calcium_mg || 0,
			recipe.magnesium_mg || 0,
			recipe.potassium_mg || 0,
			recipe.vit_a_ug || 0,
			recipe.vit_b12_ug || 0,
			recipe.vit_d_ug || 0,
			recipe.omega3_g || 0,
			recipe.cuisine || "Indian",
			recipe.difficulty || "Easy",
			recipe.created_by || "system",
			recipe.source || "local_db",
			recipe.image_url || null,
			recipe.created_at || (/* @__PURE__ */ new Date()).toISOString()
		]);
		db.run(`DELETE FROM recipe_ingredients WHERE recipe_id = ?`, [recipe.id]);
		db.run(`DELETE FROM recipe_steps WHERE recipe_id = ?`, [recipe.id]);
		db.run(`DELETE FROM recipe_tags WHERE recipe_id = ?`, [recipe.id]);
		db.run(`DELETE FROM recipe_goals WHERE recipe_id = ?`, [recipe.id]);
		for (const ing of recipe.ingredients || []) {
			const ingId = `ing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
			db.run(`INSERT INTO recipe_ingredients (id, recipe_id, name, normalized_name, quantity, unit, estimated_cost, calories, protein_g, carbs_g, fat_g, fiber_g, sugar_g)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
				ingId,
				recipe.id,
				ing.name,
				ing.normalized_name || ing.name.toLowerCase(),
				ing.quantity,
				ing.unit,
				ing.estimated_cost,
				ing.calories,
				ing.protein_g,
				ing.carbs_g,
				ing.fat_g,
				ing.fiber_g || 0,
				ing.sugar_g || 0
			]);
		}
		for (const step of recipe.steps || []) {
			const stepId = `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
			db.run(`INSERT INTO recipe_steps (id, recipe_id, step_number, instruction) VALUES (?, ?, ?, ?)`, [
				stepId,
				recipe.id,
				step.step_number,
				step.instruction
			]);
		}
		for (const tag of recipe.tags || []) {
			const tagId = `tag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
			db.run(`INSERT INTO recipe_tags (id, recipe_id, tag) VALUES (?, ?, ?)`, [
				tagId,
				recipe.id,
				tag
			]);
		}
		for (const g of recipe.goals || [recipe.goal]) {
			const gId = `goal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
			db.run(`INSERT INTO recipe_goals (id, recipe_id, goal) VALUES (?, ?, ?)`, [
				gId,
				recipe.id,
				g
			]);
		}
		persistDatabase(db);
	} catch (err) {
		console.error("[RecipeDB] Error saving recipe:", err);
	}
}
/**
* Fetch all USDA ingredients for offline nutrition lookup
*/
async function getAllUSDAIngredientsFromSQLite() {
	try {
		const db = await ensureRecipeDatabase();
		if (db) {
			const stmt = db.prepare(`SELECT * FROM usda_ingredients`);
			const list = [];
			while (stmt.step()) {
				const row = stmt.getAsObject();
				list.push({
					id: String(row.id),
					name: String(row.name),
					aliases: row.aliases ? JSON.parse(String(row.aliases)) : [],
					default_unit: String(row.default_unit || "g"),
					unit_grams: Number(row.unit_grams || 1),
					calories_per_100g: Number(row.calories_per_100g || 0),
					protein_per_100g: Number(row.protein_per_100g || 0),
					carbs_per_100g: Number(row.carbs_per_100g || 0),
					fat_per_100g: Number(row.fat_per_100g || 0),
					fiber_per_100g: Number(row.fiber_per_100g || 0),
					sugar_per_100g: Number(row.sugar_per_100g || 0),
					sodium_per_100g: Number(row.sodium_per_100g || 0),
					iron_per_100g: Number(row.iron_per_100g || 0),
					calcium_per_100g: Number(row.calcium_per_100g || 0),
					magnesium_per_100g: Number(row.magnesium_per_100g || 0),
					potassium_per_100g: Number(row.potassium_per_100g || 0),
					vit_a_per_100g: Number(row.vit_a_per_100g || 0),
					vit_b12_per_100g: Number(row.vit_b12_per_100g || 0),
					vit_d_per_100g: Number(row.vit_d_per_100g || 0),
					omega3_per_100g: Number(row.omega3_per_100g || 0),
					avg_cost_per_100g: Number(row.avg_cost_per_100g || 10)
				});
			}
			stmt.free();
			if (list.length > 0) return list;
		}
	} catch (err) {
		console.error("[RecipeDB] Error fetching USDA ingredients:", err);
	}
	return USDA_SEEDS;
}
if (typeof window !== "undefined") ensureRecipeDatabase().catch(() => {});
/**
* Normalizes unit string to standard unit and gram multiplier using the exact formula
*/
function normalizeUnitAndQuantity(qty, unitStr, usdaMatch) {
	const safeQty = Math.max(0, qty);
	const u = (unitStr || "g").trim().toLowerCase();
	if (u.startsWith("g") || u === "gram" || u === "grams") return {
		quantity: safeQty,
		unit: "g",
		grams: safeQty
	};
	if (u === "kg" || u === "kilogram" || u === "kilograms") return {
		quantity: safeQty,
		unit: "kg",
		grams: safeQty * 1e3
	};
	if (u === "ml" || u === "milliliter" || u === "milliliters") return {
		quantity: safeQty,
		unit: "ml",
		grams: safeQty
	};
	if (u === "l" || u === "liter" || u === "liters") return {
		quantity: safeQty,
		unit: "L",
		grams: safeQty * 1e3
	};
	if (u === "tbsp" || u === "tablespoon" || u === "tablespoons") return {
		quantity: safeQty,
		unit: "tbsp",
		grams: safeQty * 15
	};
	if (u === "tsp" || u === "teaspoon" || u === "teaspoons") return {
		quantity: safeQty,
		unit: "tsp",
		grams: safeQty * 5
	};
	if (u === "cup" || u === "cups") return {
		quantity: safeQty,
		unit: "cup",
		grams: safeQty * 180
	};
	if (u === "scoop" || u === "scoops") return {
		quantity: safeQty,
		unit: "scoop",
		grams: safeQty * (usdaMatch?.unit_grams && usdaMatch.unit_grams > 1 ? usdaMatch.unit_grams : 30)
	};
	if (u === "slice" || u === "slices") return {
		quantity: safeQty,
		unit: "slice",
		grams: safeQty * (usdaMatch?.unit_grams && usdaMatch.unit_grams > 1 ? usdaMatch.unit_grams : 30)
	};
	if (u === "piece" || u === "pieces" || u === "pcs" || u === "pc" || u === "whole" || u === "egg" || u === "eggs") return {
		quantity: safeQty,
		unit: "piece",
		grams: safeQty * (usdaMatch?.unit_grams && usdaMatch.unit_grams > 1 ? usdaMatch.unit_grams : 50)
	};
	if (u === "roti" || u === "chapati" || u === "rotis" || u === "chapatis") return {
		quantity: safeQty,
		unit: "piece",
		grams: safeQty * (usdaMatch?.unit_grams && usdaMatch.unit_grams > 1 ? usdaMatch.unit_grams : 40)
	};
	return {
		quantity: safeQty,
		unit: u || "g",
		grams: safeQty
	};
}
var cachedUsdaList = null;
var ingredientMatchCache = /* @__PURE__ */ new Map();
/**
* Clean ingredient search term to extract core food name
*/
function cleanIngredientSearchTerm(text) {
	if (!text) return "";
	let s = text.toLowerCase().trim();
	s = s.replace(/^[\d\s/.-]+(g|gram|grams|kg|ml|l|piece|pieces|pcs|pc|cup|cups|tbsp|tsp|slice|slices|scoop|scoops|whole|egg|eggs|roti|rotis|chapati|chapatis)?\b/gi, "").trim();
	s = s.replace(/[()[\].,-]/g, " ").replace(/\s+/g, " ").trim();
	return s;
}
/**
* Parse raw ingredient input string or object into core foodName, quantity, and unit
*/
function parseIngredientInput(item) {
	let rawText = typeof item === "string" ? item : item.name || "";
	const explicitQty = typeof item === "object" && typeof item.quantity === "number" && !isNaN(item.quantity) && item.quantity > 0 ? item.quantity : void 0;
	const explicitUnit = typeof item === "object" && item.unit ? item.unit : void 0;
	rawText = rawText.trim();
	if (!rawText) return {
		foodName: "",
		quantity: 0,
		unit: "g",
		rawText: ""
	};
	const match = rawText.match(/^\s*([\d]+(?:[./\s]\d+)?)\s*([a-zA-Z]+)?\b(?:\s+(.*))?$/i);
	if (match && match[1]) {
		const parsedQtyStr = match[1].trim();
		let parsedQty = 1;
		if (parsedQtyStr.includes("/")) {
			const parts = parsedQtyStr.split("/");
			parsedQty = parseFloat(parts[0]) / parseFloat(parts[1]);
		} else parsedQty = parseFloat(parsedQtyStr);
		if (isNaN(parsedQty) || parsedQty <= 0) parsedQty = 1;
		const parsedUnitStr = (match[2] || "").trim().toLowerCase();
		const remainingName = (match[3] || "").trim();
		if ([
			"g",
			"gram",
			"grams",
			"kg",
			"kilogram",
			"kilograms",
			"ml",
			"milliliter",
			"milliliters",
			"l",
			"liter",
			"liters",
			"piece",
			"pieces",
			"pcs",
			"pc",
			"whole",
			"egg",
			"eggs",
			"slice",
			"slices",
			"roti",
			"rotis",
			"chapati",
			"chapatis",
			"cup",
			"cups",
			"tbsp",
			"tsp",
			"scoop",
			"scoops"
		].includes(parsedUnitStr)) return {
			foodName: remainingName || rawText,
			quantity: parsedQty,
			unit: parsedUnitStr,
			rawText
		};
		else return {
			foodName: [parsedUnitStr, remainingName].filter(Boolean).join(" ") || rawText,
			quantity: parsedQty,
			unit: explicitUnit || "piece",
			rawText
		};
	}
	return {
		foodName: rawText,
		quantity: explicitQty && explicitQty > 0 ? explicitQty : 1,
		unit: explicitUnit || "g",
		rawText
	};
}
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
/**
* Match an ingredient name against local USDA database using strict exact/alias/prep-state scoring.
*/
function matchUSDAIngredient(ingredientName, usdaList) {
	const cleanSearchTerm = cleanIngredientSearchTerm(ingredientName);
	if (!cleanSearchTerm) return null;
	if (ingredientMatchCache.has(cleanSearchTerm)) return ingredientMatchCache.get(cleanSearchTerm) || null;
	let bestMatch = null;
	let highestScore = -100;
	const searchTermHasCooked = /\b(cooked|steamed|boiled|grilled|roasted|seared|baked|fried)\b/i.test(ingredientName);
	const searchTermHasRaw = /\b(raw|uncooked|fresh)\b/i.test(ingredientName);
	const isCompoundDish = /\b(curry|gravy|biryani|masala|tikka|bhurji|makhani|korma|soup|stew|burger|pizza|sandwich|fried rice|pulao|salad|dosa|idli|paratha|naan|samosa|pasta|noodles|chai|coffee)\b/i.test(cleanSearchTerm);
	for (const item of usdaList) {
		const itemNameLower = item.name.toLowerCase();
		const itemCleanName = cleanIngredientSearchTerm(item.name);
		let itemScore = 0;
		if (itemNameLower === cleanSearchTerm || itemCleanName === cleanSearchTerm) itemScore = 100;
		else {
			for (const alias of item.aliases) if (alias.toLowerCase().trim() === cleanSearchTerm) {
				itemScore = Math.max(itemScore, 98);
				break;
			}
			if (itemScore === 0) for (const alias of item.aliases) {
				const aliasLower = alias.toLowerCase().trim();
				if (aliasLower.length < 3) continue;
				if (new RegExp(`(^|\\s)${escapeRegExp(aliasLower)}(\\s|$)`, "i").test(cleanSearchTerm)) {
					const lengthRatio = aliasLower.length / Math.max(aliasLower.length, cleanSearchTerm.length);
					const subScore = 70 + Math.round(lengthRatio * 20);
					itemScore = Math.max(itemScore, subScore);
				} else if (new RegExp(`(^|\\s)${escapeRegExp(cleanSearchTerm)}(\\s|$)`, "i").test(aliasLower)) {
					const lengthRatio = cleanSearchTerm.length / aliasLower.length;
					const subScore = 65 + Math.round(lengthRatio * 20);
					itemScore = Math.max(itemScore, subScore);
				}
			}
		}
		if (itemScore === 0) {
			const searchWords = cleanSearchTerm.split(/\s+/).filter((w) => w.length > 2);
			let matchedWordCount = 0;
			for (const word of searchWords) {
				const wordRegex = new RegExp(`(^|\\s)${escapeRegExp(word)}(\\s|$)`, "i");
				if (wordRegex.test(itemNameLower) || item.aliases.some((a) => wordRegex.test(a.toLowerCase()))) matchedWordCount++;
			}
			if (searchWords.length > 0) {
				const wordRatio = matchedWordCount / searchWords.length;
				if (wordRatio >= .5) itemScore = Math.round(wordRatio * 55);
			}
		}
		if (isCompoundDish) {
			if (!(/\b(curry|gravy|biryani|masala|tikka|bhurji|makhani|korma|soup|stew|burger|pizza|sandwich|fried rice|pulao|salad|dosa|idli|paratha|naan|samosa|pasta|noodles|chai|coffee)\b/i.test(itemNameLower) || item.aliases.some((a) => /\b(curry|gravy|biryani|masala|tikka|bhurji|makhani|korma|soup|stew|burger|pizza|sandwich|fried rice|pulao|salad|dosa|idli|paratha|naan|samosa|pasta|noodles|chai|coffee)\b/i.test(a))) && (item.id === "usda-28" || item.id === "usda-20" || item.id === "usda-1" || item.id === "usda-3")) itemScore -= 50;
		}
		if (itemScore < 35) continue;
		const itemHasCooked = /\b(cooked|steamed|boiled|grilled|roasted|seared|baked|fried)\b/i.test(itemNameLower) || item.aliases.some((a) => /\b(cooked|steamed|boiled|grilled)\b/i.test(a));
		const itemHasRaw = /\b(raw|uncooked)\b/i.test(itemNameLower) || item.aliases.some((a) => /\b(raw|uncooked)\b/i.test(a));
		if (searchTermHasCooked && itemHasCooked) itemScore += 10;
		if (searchTermHasRaw && itemHasRaw) itemScore += 10;
		if (searchTermHasCooked && itemHasRaw) itemScore -= 25;
		if (searchTermHasRaw && itemHasCooked) itemScore -= 25;
		if (itemScore > highestScore) {
			highestScore = itemScore;
			bestMatch = item;
		}
	}
	const finalMatch = highestScore >= 45 ? bestMatch : null;
	ingredientMatchCache.set(cleanSearchTerm, finalMatch);
	return finalMatch;
}
/**
* Local USDA Nutrition Engine:
* Calculates nutrition deterministically using the USDA database formula:
* nutrient_for_quantity = (nutrient_per_100g / 100) * quantity_in_grams
*
* Unmatched ingredients are NOT assigned guessed numbers; they are labeled "Unmatched ingredient"
* with zero nutrition so the AI never invents macros.
*/
async function calculateRecipeNutritionLocally(rawIngredients) {
	if (!cachedUsdaList) cachedUsdaList = await getAllUSDAIngredientsFromSQLite();
	const usdaList = cachedUsdaList;
	let totCal = 0;
	let totPro = 0;
	let totCarb = 0;
	let totFat = 0;
	let totFib = 0;
	let totSug = 0;
	let totSod = 0;
	let totIron = 0;
	let totCalc = 0;
	let totMag = 0;
	let totPot = 0;
	let totVitA = 0;
	let totVitB12 = 0;
	let totVitD = 0;
	let totOmega3 = 0;
	let totCost = 0;
	let unmatchedCount = 0;
	const recipeIngredients = [];
	for (const rawItem of rawIngredients) {
		const parsed = parseIngredientInput(rawItem);
		const rawName = parsed.rawText;
		const foodSearchTerm = parsed.foodName;
		const usdaMatch = matchUSDAIngredient(foodSearchTerm || rawName, usdaList);
		const { quantity, unit, grams } = normalizeUnitAndQuantity(parsed.quantity, parsed.unit, usdaMatch);
		let cal = 0;
		let pro = 0;
		let carb = 0;
		let fat = 0;
		let fib = 0;
		let sug = 0;
		let sod = 0;
		let iron = 0;
		let calc = 0;
		let mag = 0;
		let pot = 0;
		let vitA = 0;
		let vitB12 = 0;
		let vitD = 0;
		let o3 = 0;
		let cost = 0;
		let normalizedName = "";
		if (usdaMatch) {
			const factor = grams / 100;
			cal = Math.round(usdaMatch.calories_per_100g * factor);
			pro = Number((usdaMatch.protein_per_100g * factor).toFixed(1));
			carb = Number((usdaMatch.carbs_per_100g * factor).toFixed(1));
			fat = Number((usdaMatch.fat_per_100g * factor).toFixed(1));
			fib = Number((usdaMatch.fiber_per_100g * factor).toFixed(1));
			sug = Number((usdaMatch.sugar_per_100g * factor).toFixed(1));
			sod = Math.round(usdaMatch.sodium_per_100g * factor);
			iron = Number((usdaMatch.iron_per_100g * factor).toFixed(1));
			calc = Math.round(usdaMatch.calcium_per_100g * factor);
			mag = Math.round(usdaMatch.magnesium_per_100g * factor);
			pot = Math.round(usdaMatch.potassium_per_100g * factor);
			vitA = Math.round(usdaMatch.vit_a_per_100g * factor);
			vitB12 = Number((usdaMatch.vit_b12_per_100g * factor).toFixed(1));
			vitD = Number((usdaMatch.vit_d_per_100g * factor).toFixed(1));
			o3 = Number((usdaMatch.omega3_per_100g * factor).toFixed(2));
			cost = Math.round(usdaMatch.avg_cost_per_100g * factor);
			normalizedName = usdaMatch.name;
		} else {
			unmatchedCount++;
			normalizedName = `Unmatched ingredient (${rawName})`;
			cal = 0;
			pro = 0;
			carb = 0;
			fat = 0;
			fib = 0;
			sug = 0;
			sod = 0;
			iron = 0;
			calc = 0;
			mag = 0;
			pot = 0;
			vitA = 0;
			vitB12 = 0;
			vitD = 0;
			o3 = 0;
			cost = 0;
		}
		totCal += cal;
		totPro += pro;
		totCarb += carb;
		totFat += fat;
		totFib += fib;
		totSug += sug;
		totSod += sod;
		totIron += iron;
		totCalc += calc;
		totMag += mag;
		totPot += pot;
		totVitA += vitA;
		totVitB12 += vitB12;
		totVitD += vitD;
		totOmega3 += o3;
		totCost += cost;
		recipeIngredients.push({
			name: rawName,
			normalized_name: normalizedName,
			quantity,
			unit,
			estimated_cost: cost,
			calories: cal,
			protein_g: pro,
			carbs_g: carb,
			fat_g: fat,
			fiber_g: fib,
			sugar_g: sug
		});
	}
	recipeIngredients.map((i) => i.normalized_name);
	Number(totPro.toFixed(1)), Number(totCarb.toFixed(1)), Number(totFat.toFixed(1)), Number(totFib.toFixed(1));
	return {
		calories: Math.round(totCal),
		protein_g: Number(totPro.toFixed(1)),
		carbs_g: Number(totCarb.toFixed(1)),
		fat_g: Number(totFat.toFixed(1)),
		fiber_g: Number(totFib.toFixed(1)),
		sugar_g: Number(totSug.toFixed(1)),
		sodium_mg: Math.round(totSod),
		iron_mg: Number(totIron.toFixed(1)),
		calcium_mg: Math.round(totCalc),
		magnesium_mg: Math.round(totMag),
		potassium_mg: Math.round(totPot),
		vit_a_ug: Math.round(totVitA),
		vit_b12_ug: Number(totVitB12.toFixed(1)),
		vit_d_ug: Number(totVitD.toFixed(1)),
		omega3_g: Number(totOmega3.toFixed(2)),
		estimatedCost: Math.max(0, Math.round(totCost)),
		parsedIngredients: recipeIngredients,
		unmatchedIngredientsCount: unmatchedCount
	};
}
var SYSTEM_PROMPT$2 = `You are a world-class clinical nutrition scientist, biochemist, and food database calculator.
Analyze the provided list of ingredients and quantities to calculate exact, scientifically calibrated macronutrients and micronutrients.

STANDARD NUTRITION REFERENCE BENCHMARKS (per 100g edible portion):
- Cooked Chicken Breast: 165 kcal, 31g protein, 0g carbs, 3.6g fat, 74mg sodium, 256mg potassium, 1mg iron
- Paneer (Cottage Cheese): 265 kcal, 18.3g protein, 3g carbs, 20.8g fat, 480mg calcium, 18mg magnesium
- Boiled Whole Egg (1 large ~50g): 72 kcal, 6.3g protein, 0.4g carbs, 4.8g fat, 70mg sodium, 138mg potassium, 28mg calcium, 0.9mg iron, 1.1mcg Vit D, 0.6mcg Vit B12
- Boiled Egg White (1 large ~33g): 17 kcal, 3.6g protein, 0.2g carbs, 0.1g fat, 55mg sodium, 54mg potassium
- Cooked White Rice: 130 kcal, 2.7g protein, 28.2g carbs, 0.3g fat, 0.4g fiber
- Cooked Brown Rice: 112 kcal, 2.6g protein, 23.5g carbs, 0.9g fat, 1.8g fiber, 43mg magnesium
- Whole Wheat Roti / Chapati (1 medium ~35g): 104 kcal, 3.1g protein, 20g carbs, 1.2g fat, 3.2g fiber
- Cooked Yellow Lentils (Toor / Moong Dal): 116 kcal, 7.5g protein, 19.5g carbs, 0.8g fat, 4.2g fiber, 310mg potassium, 1.8mg iron
- Cooked Rajma (Kidney Beans): 127 kcal, 8.7g protein, 22.8g carbs, 0.5g fat, 6.4g fiber, 405mg potassium, 2.9mg iron
- Cooked Chickpeas (Chole): 140 kcal, 6.8g protein, 19.5g carbs, 4.2g fat, 5.5g fiber, 260mg potassium, 2.4mg iron
- Soya Chunks (dry, 100g): 345 kcal, 52g protein, 33g carbs, 0.5g fat, 13g fiber, 350mg calcium, 10mg iron
- Cooked Rolled Oats: 71 kcal, 2.5g protein, 12g carbs, 1.5g fat, 1.7g fiber (Beta-glucan)
- Olive / Mustard / Vegetable Oil (1 tbsp ~14g): 124 kcal, 0g pro, 0g carb, 14g fat
- Pure Desi Ghee / Butter (1 tbsp ~14g): 126 kcal, 0g pro, 0g carb, 14g fat (10g saturated fat)
- Milk (Toned 3% fat, 100ml): 58 kcal, 3.1g protein, 4.7g carbs, 3.0g fat, 120mg calcium, 0.4mcg Vit B12
- Greek Yogurt / Hung Curd: 97 kcal, 9g protein, 3.8g carbs, 5g fat, 100mg calcium, 141mg potassium
- Banana (1 medium ~118g): 105 kcal, 1.3g protein, 27g carbs, 0.3g fat, 3.1g fiber, 422mg potassium, 32mg magnesium
- Apple (1 medium ~150g): 78 kcal, 0.5g protein, 20.7g carbs, 0.3g fat, 3.6g fiber, 160mg potassium
- Almonds (100g): 579 kcal, 21.2g protein, 21.6g carbs, 49.9g fat, 12.5g fiber, 269mg calcium, 270mg magnesium
- Peanut Butter (2 tbsp ~32g): 188 kcal, 8g protein, 6g carbs, 16g fat, 2g fiber

Return ONLY a valid JSON object matching this schema (numbers, no units in values):
{
  "mealName": string,              // a clean title for the meal, e.g. "Paneer & Egg Scramble with Chapati"
  "serving": string,               // serving description, e.g. "1 bowl (~350g)"
  "totalGrams": number,            // estimated total weight in grams
  "calories": number,              // total energy in kcal (must equal sum of items)
  "protein_g": number,             // protein in grams
  "carbs_g": number,               // total carbohydrates in grams
  "fat_g": number,                 // total fats in grams
  "fiber_g": number,               // dietary fiber in grams
  "sugar_g": number,               // total sugars in grams
  "sodium_mg": number,             // sodium in mg
  "iron_mg": number,               // iron in mg
  "calcium_mg": number,            // calcium in mg
  "magnesium_mg": number,          // magnesium in mg
  "potassium_mg": number,          // potassium in mg
  "vit_a_ug": number,              // vitamin A in mcg
  "vit_b12_ug": number,            // vitamin B12 in mcg
  "vit_d_ug": number,              // vitamin D in mcg
  "omega3_g": number,              // omega-3 fatty acids in grams
  "ingredientBreakdown": [
    {
      "name": string,              // name of ingredient
      "amount": string,            // quantity, e.g. "100g" or "2 pcs"
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number
    }
  ]
}

Ensure mathematical Atwater consistency: total calories should equal approximately (protein * 4) + (carbs * 4) + (fat * 9). All numbers must be non-negative.`;
var Route$3 = createFileRoute("/api/analyze-ingredients")({ server: { handlers: {
	GET: () => {
		return Response.json({ error: "Method Not Allowed. Please send a POST request with ingredients list." }, { status: 405 });
	},
	POST: async ({ request }) => {
		try {
			const { mealName, ingredients } = await request.json();
			if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) return Response.json({ error: "At least one ingredient with a name is required." }, { status: 400 });
			const formattedIngredients = ingredients.map((i) => `${i.name.trim()} ${i.amount ? `(${i.amount.trim()})` : ""}`).filter((str) => str.trim().length > 0);
			if (formattedIngredients.length === 0) return Response.json({ error: "Ingredient names cannot be empty." }, { status: 400 });
			const apiKey = getGeminiApiKey();
			if (apiKey) try {
				const ai = new GoogleGenAI({
					apiKey,
					httpOptions: { headers: { "User-Agent": "aistudio-build" } }
				});
				const userPrompt = `Meal Name/Title: "${mealName || "Custom Meal"}"\nIngredients:\n${formattedIngredients.map((ing, idx) => `${idx + 1}. ${ing}`).join("\n")}\n\nAnalyze these ingredients and calculate all macros, micros, and itemized breakdowns. Return strictly JSON.`;
				const candidateModels = [
					"gemini-2.5-flash",
					"gemini-flash-latest",
					"gemini-2.5-pro",
					"gemini-3.7-flash",
					"gemini-3.1-flash-lite"
				];
				let res = null;
				for (const modelName of candidateModels) {
					try {
						res = await ai.models.generateContent({
							model: modelName,
							contents: userPrompt,
							config: {
								systemInstruction: SYSTEM_PROMPT$2,
								responseMimeType: "application/json",
								temperature: .1
							}
						});
						if (res && res.text) break;
					} catch (err) {
						const msg = err instanceof Error ? err.message : String(err);
						if (msg.includes("401") || msg.includes("UNAUTHENTICATED") || msg.includes("invalid authentication")) break;
						if (msg.includes("503") || msg.includes("429") || msg.includes("UNAVAILABLE") || msg.includes("high demand")) console.info(`[/api/analyze-ingredients] Model ${modelName} is at capacity. Transitioning to next model...`);
						else console.warn(`[/api/analyze-ingredients] Model ${modelName} notice:`, msg);
					}
					if (res && res.text) break;
				}
				const text = res?.text || "{}";
				let parsed = {};
				try {
					parsed = JSON.parse(text);
				} catch {
					const m = text.match(/\{[\s\S]*\}/);
					if (m) parsed = JSON.parse(m[0]);
				}
				const num = (v) => typeof v === "number" && isFinite(v) && v >= 0 ? Math.round(v * 10) / 10 : 0;
				let rawIngs = [];
				let usdaNut = null;
				try {
					rawIngs = ingredients.map((ing) => ({
						name: ing.name,
						quantity: parseFloat(ing.amount || "100") || 100,
						unit: ing.amount && ing.amount.replace(/[0-9.]/g, "").trim() || "g"
					}));
					usdaNut = await calculateRecipeNutritionLocally(rawIngs);
				} catch (e) {
					console.warn("[/api/analyze-ingredients] Local USDA cross-validation warning:", e);
				}
				let totalPro = 0;
				let totalCarb = 0;
				let totalFat = 0;
				let totalFiber = 0;
				let totalSugar = 0;
				let totalSodium = 0;
				let totalIron = 0;
				let totalCalcium = 0;
				let totalMagnesium = 0;
				let totalPotassium = 0;
				let totalVitA = 0;
				let totalVitB12 = 0;
				let totalVitD = 0;
				let totalOmega3 = 0;
				const ingredientBreakdown = [];
				if (usdaNut && usdaNut.parsedIngredients.length > 0) usdaNut.parsedIngredients.forEach((pIng, idx) => {
					const origIng = ingredients[idx] || {
						name: pIng.name,
						amount: `${pIng.quantity}${pIng.unit}`
					};
					const aiItem = Array.isArray(parsed.ingredientBreakdown) ? parsed.ingredientBreakdown[idx] : null;
					if (pIng.normalized_name && !pIng.normalized_name.startsWith("Unmatched")) {
						const itemP = num(pIng.protein_g);
						const itemC = num(pIng.carbs_g);
						const itemF = num(pIng.fat_g);
						const itemCals = Math.round(pIng.calories || itemP * 4 + itemC * 4 + itemF * 9);
						totalPro += itemP;
						totalCarb += itemC;
						totalFat += itemF;
						totalFiber += num(pIng.fiber_g);
						totalSugar += num(pIng.sugar_g);
						totalSodium += num(pIng.sodium_mg);
						totalIron += num(pIng.iron_mg);
						totalCalcium += num(pIng.calcium_mg);
						totalMagnesium += num(pIng.magnesium_mg);
						totalPotassium += num(pIng.potassium_mg);
						totalVitA += num(pIng.vit_a_ug);
						totalVitB12 += num(pIng.vit_b12_ug);
						totalVitD += num(pIng.vit_d_ug);
						totalOmega3 += num(pIng.omega3_g);
						ingredientBreakdown.push({
							name: pIng.name || origIng.name,
							amount: origIng.amount || `${pIng.quantity}${pIng.unit || "g"}`,
							calories: itemCals,
							protein_g: itemP,
							carbs_g: itemC,
							fat_g: itemF
						});
					} else {
						const itemP = aiItem ? num(aiItem.protein_g) : 5;
						const itemC = aiItem ? num(aiItem.carbs_g) : 15;
						const itemF = aiItem ? num(aiItem.fat_g) : 3;
						const itemCals = aiItem ? Math.round(aiItem.calories || itemP * 4 + itemC * 4 + itemF * 9) : Math.round(itemP * 4 + itemC * 4 + itemF * 9);
						totalPro += itemP;
						totalCarb += itemC;
						totalFat += itemF;
						ingredientBreakdown.push({
							name: origIng.name,
							amount: origIng.amount || "1 portion",
							calories: itemCals,
							protein_g: itemP,
							carbs_g: itemC,
							fat_g: itemF
						});
					}
				});
				else {
					totalPro = num(parsed.protein_g);
					totalCarb = num(parsed.carbs_g);
					totalFat = num(parsed.fat_g);
					totalFiber = num(parsed.fiber_g);
					totalSugar = num(parsed.sugar_g);
					totalSodium = num(parsed.sodium_mg);
					totalIron = num(parsed.iron_mg);
					totalCalcium = num(parsed.calcium_mg);
					totalMagnesium = num(parsed.magnesium_mg);
					totalPotassium = num(parsed.potassium_mg);
					totalVitA = num(parsed.vit_a_ug);
					totalVitB12 = num(parsed.vit_b12_ug);
					totalVitD = num(parsed.vit_d_ug);
					totalOmega3 = num(parsed.omega3_g);
					if (Array.isArray(parsed.ingredientBreakdown) && parsed.ingredientBreakdown.length > 0) parsed.ingredientBreakdown.forEach((item) => {
						const ip = num(item.protein_g);
						const ic = num(item.carbs_g);
						const ifat = num(item.fat_g);
						ingredientBreakdown.push({
							name: item.name || "Item",
							amount: item.amount || "1 portion",
							calories: Math.round(ip * 4 + ic * 4 + ifat * 9),
							protein_g: ip,
							carbs_g: ic,
							fat_g: ifat
						});
					});
				}
				if (parsed.sodium_mg) totalSodium = Math.max(totalSodium, num(parsed.sodium_mg));
				if (parsed.calcium_mg) totalCalcium = Math.max(totalCalcium, num(parsed.calcium_mg));
				if (parsed.iron_mg) totalIron = Math.max(totalIron, num(parsed.iron_mg));
				if (parsed.potassium_mg) totalPotassium = Math.max(totalPotassium, num(parsed.potassium_mg));
				if (parsed.magnesium_mg) totalMagnesium = Math.max(totalMagnesium, num(parsed.magnesium_mg));
				if (parsed.vit_a_ug) totalVitA = Math.max(totalVitA, num(parsed.vit_a_ug));
				if (parsed.vit_b12_ug) totalVitB12 = Math.max(totalVitB12, num(parsed.vit_b12_ug));
				if (parsed.vit_d_ug) totalVitD = Math.max(totalVitD, num(parsed.vit_d_ug));
				if (parsed.omega3_g) totalOmega3 = Math.max(totalOmega3, num(parsed.omega3_g));
				if (parsed.fiber_g) totalFiber = Math.max(totalFiber, num(parsed.fiber_g));
				if (parsed.sugar_g) totalSugar = Math.max(totalSugar, num(parsed.sugar_g));
				totalPro = Math.max(0, Math.round(totalPro * 10) / 10);
				totalCarb = Math.max(0, Math.round(totalCarb * 10) / 10);
				totalFat = Math.max(0, Math.round(totalFat * 10) / 10);
				const computedCalories = Math.round(totalPro * 4 + totalCarb * 4 + totalFat * 9);
				const out = {
					mealName: parsed.mealName || mealName || "Custom Meal",
					serving: parsed.serving || `${ingredients.length} ingredients`,
					totalGrams: num(parsed.totalGrams) || ingredients.reduce((acc, i) => acc + (parseFloat(i.amount || "100") || 100), 0) || 250,
					calories: computedCalories,
					protein_g: totalPro,
					carbs_g: totalCarb,
					fat_g: totalFat,
					fiber_g: Math.round(totalFiber * 10) / 10,
					sugar_g: Math.round(totalSugar * 10) / 10,
					sodium_mg: Math.round(totalSodium),
					iron_mg: Math.round(totalIron * 10) / 10,
					calcium_mg: Math.round(totalCalcium),
					magnesium_mg: Math.round(totalMagnesium),
					potassium_mg: Math.round(totalPotassium),
					vit_a_ug: Math.round(totalVitA),
					vit_b12_ug: Math.round(totalVitB12 * 10) / 10,
					vit_d_ug: Math.round(totalVitD * 10) / 10,
					omega3_g: Math.round(totalOmega3 * 100) / 100,
					ingredientBreakdown
				};
				return Response.json(out);
			} catch (geminiErr) {
				console.warn("[/api/analyze-ingredients] Gemini call failed, falling back to heuristic calculation:", geminiErr);
			}
			const fallbackResult = estimateNutritionFallback(mealName, ingredients);
			return Response.json(fallbackResult);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unknown error";
			console.error("[/api/analyze-ingredients]", message);
			return Response.json({ error: message }, { status: 500 });
		}
	}
} } });
/** Heuristic nutrition database for common ingredients when Gemini API is unavailable */
function estimateNutritionFallback(mealName, ingredients = []) {
	let totalCals = 0;
	let totalProt = 0;
	let totalCarbs = 0;
	let totalFat = 0;
	let totalFiber = 0;
	let totalSugar = 0;
	let totalGrams = 0;
	const itemized = [];
	for (const item of ingredients) {
		const rawName = item.name.toLowerCase();
		const rawAmount = (item.amount || "100g").toLowerCase();
		let weightGrams = 100;
		const gMatch = rawAmount.match(/(\d+(?:\.\d+)?)\s*(g|gram|grams)/);
		const pcsMatch = rawAmount.match(/(\d+(?:\.\d+)?)\s*(pc|pcs|piece|pieces|egg|eggs|roti|rotis|chapati|chapatis|slice|slices)/);
		const cupMatch = rawAmount.match(/(\d+(?:\.\d+)?)\s*(cup|cups|bowl|bowls)/);
		const tbspMatch = rawAmount.match(/(\d+(?:\.\d+)?)\s*(tbsp|tsp|spoon|spoons)/);
		if (gMatch) weightGrams = parseFloat(gMatch[1]);
		else if (pcsMatch) {
			const count = parseFloat(pcsMatch[1]);
			if (rawName.includes("egg")) weightGrams = count * 50;
			else if (rawName.includes("roti") || rawName.includes("chapati")) weightGrams = count * 35;
			else if (rawName.includes("bread") || rawName.includes("slice")) weightGrams = count * 30;
			else weightGrams = count * 60;
		} else if (cupMatch) weightGrams = parseFloat(cupMatch[1]) * 150;
		else if (tbspMatch) weightGrams = parseFloat(tbspMatch[1]) * 15;
		const factor = weightGrams / 100;
		let c100 = 150, p100 = 5, carb100 = 20, f100 = 3, fib100 = 2, sug100 = 1;
		if (rawName.includes("paneer") || rawName.includes("cottage cheese")) {
			c100 = 265;
			p100 = 18;
			carb100 = 3;
			f100 = 20;
			fib100 = 0;
			sug100 = 2;
		} else if (rawName.includes("egg")) {
			c100 = 143;
			p100 = 13;
			carb100 = 1;
			f100 = 10;
			fib100 = 0;
			sug100 = .5;
		} else if (rawName.includes("chicken")) {
			c100 = 165;
			p100 = 31;
			carb100 = 0;
			f100 = 3.6;
			fib100 = 0;
			sug100 = 0;
		} else if (rawName.includes("soya") || rawName.includes("soy")) {
			c100 = 345;
			p100 = 52;
			carb100 = 33;
			f100 = .5;
			fib100 = 13;
			sug100 = 7;
		} else if (rawName.includes("rice")) {
			c100 = 130;
			p100 = 2.7;
			carb100 = 28;
			f100 = .3;
			fib100 = .4;
			sug100 = .1;
		} else if (rawName.includes("roti") || rawName.includes("chapati") || rawName.includes("wheat")) {
			c100 = 264;
			p100 = 9;
			carb100 = 55;
			f100 = 1.5;
			fib100 = 8;
			sug100 = 1;
		} else if (rawName.includes("oats")) {
			c100 = 389;
			p100 = 17;
			carb100 = 66;
			f100 = 7;
			fib100 = 10;
			sug100 = 1;
		} else if (rawName.includes("peanut butter")) {
			c100 = 588;
			p100 = 25;
			carb100 = 20;
			f100 = 50;
			fib100 = 6;
			sug100 = 9;
		} else if (rawName.includes("milk")) {
			c100 = 60;
			p100 = 3.2;
			carb100 = 4.8;
			f100 = 3.2;
			fib100 = 0;
			sug100 = 5;
		} else if (rawName.includes("oil") || rawName.includes("butter") || rawName.includes("ghee")) {
			c100 = 884;
			p100 = 0;
			carb100 = 0;
			f100 = 100;
			fib100 = 0;
			sug100 = 0;
		} else if (rawName.includes("dal") || rawName.includes("lentil") || rawName.includes("chana") || rawName.includes("rajma")) {
			c100 = 116;
			p100 = 9;
			carb100 = 20;
			f100 = .4;
			fib100 = 8;
			sug100 = 1.8;
		} else if (rawName.includes("banana")) {
			c100 = 89;
			p100 = 1.1;
			carb100 = 23;
			f100 = .3;
			fib100 = 2.6;
			sug100 = 12;
		} else if (rawName.includes("curd") || rawName.includes("yogurt") || rawName.includes("dahi")) {
			c100 = 61;
			p100 = 3.5;
			carb100 = 4.7;
			f100 = 3.3;
			fib100 = 0;
			sug100 = 4.7;
		}
		const itemCal = Math.round(c100 * factor);
		const itemProt = Math.round(p100 * factor * 10) / 10;
		const itemCarb = Math.round(carb100 * factor * 10) / 10;
		const itemFat = Math.round(f100 * factor * 10) / 10;
		totalCals += itemCal;
		totalProt += itemProt;
		totalCarbs += itemCarb;
		totalFat += itemFat;
		totalFiber += Math.round(fib100 * factor * 10) / 10;
		totalSugar += Math.round(sug100 * factor * 10) / 10;
		totalGrams += weightGrams;
		itemized.push({
			name: item.name,
			amount: item.amount || `${Math.round(weightGrams)}g`,
			calories: itemCal,
			protein_g: itemProt,
			carbs_g: itemCarb,
			fat_g: itemFat
		});
	}
	const r = (v) => Math.round(v * 10) / 10;
	return {
		mealName: mealName || "Custom Prepared Meal",
		serving: `${ingredients.length} ingredients (~${Math.round(totalGrams)}g)`,
		totalGrams: Math.round(totalGrams),
		calories: Math.round(totalCals),
		protein_g: r(totalProt),
		carbs_g: r(totalCarbs),
		fat_g: r(totalFat),
		fiber_g: r(totalFiber),
		sugar_g: r(totalSugar),
		sodium_mg: Math.round(totalGrams * 1.2),
		iron_mg: r(totalGrams * .015),
		calcium_mg: Math.round(totalGrams * .8),
		magnesium_mg: Math.round(totalGrams * .25),
		potassium_mg: Math.round(totalGrams * 1.5),
		vit_a_ug: Math.round(totalGrams * .4),
		vit_b12_ug: r(totalGrams * .003),
		vit_d_ug: r(totalGrams * .001),
		omega3_g: r(totalGrams * .002),
		ingredientBreakdown: itemized
	};
}
var BUILTIN_BARCODE_CATALOG = {
	"301762042203": {
		barcode: "301762042203",
		barcodeType: "EAN-13",
		productName: "Nutella Hazelnut Spread with Cocoa",
		brand: "Ferrero",
		category: "Spreads & Sweet Toppings",
		countryOfOrigin: "Italy / Global",
		netWeight: "350g",
		servingSize: "15g (1 tbsp)",
		baseServingGrams: 15,
		imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
		isVeg: true,
		isOrganic: false,
		dietaryBadges: ["Vegetarian", "Contains Nuts"],
		healthScore: 32,
		healthGrade: "D",
		aiRecommendation: "High in added sugar and palm oil. Enjoy in strict moderation as an occasional treat.",
		aiHealthAnalysisText: "Nutella contains over 55% sugar by weight alongside palm oil. While delicious, a single serving delivers 8.5g of sugar. It offers minimal protein or fiber.",
		nutrition: {
			calories: {
				per100g: 539,
				perServing: 81,
				unit: "kcal"
			},
			protein: {
				per100g: 6.3,
				perServing: .9,
				unit: "g"
			},
			carbs: {
				per100g: 57.5,
				perServing: 8.6,
				unit: "g"
			},
			fat: {
				per100g: 30.9,
				perServing: 4.6,
				unit: "g"
			},
			sugar: {
				per100g: 56.3,
				perServing: 8.4,
				unit: "g"
			},
			fiber: {
				per100g: 3.4,
				perServing: .5,
				unit: "g"
			},
			saturatedFat: {
				per100g: 10.6,
				perServing: 1.6,
				unit: "g"
			},
			transFat: {
				per100g: .1,
				perServing: 0,
				unit: "g"
			},
			sodium: {
				per100g: 42,
				perServing: 6,
				unit: "mg"
			},
			potassium: {
				per100g: 410,
				perServing: 62,
				unit: "mg"
			},
			calcium: {
				per100g: 114,
				perServing: 17,
				unit: "mg"
			},
			iron: {
				per100g: 2.1,
				perServing: .3,
				unit: "mg"
			},
			vitaminA: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminC: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			},
			vitaminD: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminB12: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			cholesterol: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			}
		},
		ingredientsList: [
			"Sugar",
			"Palm Oil",
			"Hazelnuts (13%)",
			"Skimmed Milk Powder (8.7%)",
			"Fat-Reduced Cocoa (7.4%)",
			"Emulsifier (Lecithins - Soya)",
			"Vanillin"
		]
	},
	"8901058000000": {
		barcode: "8901058000000",
		barcodeType: "EAN-13",
		productName: "Amul Taaza Toned Milk",
		brand: "Amul",
		category: "Dairy & Milk",
		countryOfOrigin: "India",
		netWeight: "500ml",
		servingSize: "200ml (1 Glass)",
		baseServingGrams: 200,
		imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
		isVeg: true,
		isOrganic: false,
		dietaryBadges: [
			"Vegetarian",
			"High Protein",
			"Calcium Rich"
		],
		healthScore: 88,
		healthGrade: "A",
		aiRecommendation: "Excellent source of high-quality protein and essential calcium. Ideal for daily fitness nutrition.",
		aiHealthAnalysisText: "Toned milk provides balanced macronutrients with 3% fat. Rich in natural bioavailable calcium, Vitamin D, and Vitamin B12, supporting bone density and muscle synthesis.",
		nutrition: {
			calories: {
				per100g: 58,
				perServing: 116,
				unit: "kcal"
			},
			protein: {
				per100g: 3.2,
				perServing: 6.4,
				unit: "g"
			},
			carbs: {
				per100g: 4.7,
				perServing: 9.4,
				unit: "g"
			},
			fat: {
				per100g: 3,
				perServing: 6,
				unit: "g"
			},
			sugar: {
				per100g: 4.7,
				perServing: 9.4,
				unit: "g"
			},
			fiber: {
				per100g: 0,
				perServing: 0,
				unit: "g"
			},
			saturatedFat: {
				per100g: 1.9,
				perServing: 3.8,
				unit: "g"
			},
			transFat: {
				per100g: 0,
				perServing: 0,
				unit: "g"
			},
			sodium: {
				per100g: 50,
				perServing: 100,
				unit: "mg"
			},
			potassium: {
				per100g: 140,
				perServing: 280,
				unit: "mg"
			},
			calcium: {
				per100g: 120,
				perServing: 240,
				unit: "mg"
			},
			iron: {
				per100g: .1,
				perServing: .2,
				unit: "mg"
			},
			vitaminA: {
				per100g: 35,
				perServing: 70,
				unit: "mcg"
			},
			vitaminC: {
				per100g: 1,
				perServing: 2,
				unit: "mg"
			},
			vitaminD: {
				per100g: .5,
				perServing: 1,
				unit: "mcg"
			},
			vitaminB12: {
				per100g: .4,
				perServing: .8,
				unit: "mcg"
			},
			cholesterol: {
				per100g: 8,
				perServing: 16,
				unit: "mg"
			}
		},
		ingredientsList: [
			"Pasteurized Toned Milk",
			"Vitamin A",
			"Vitamin D2"
		]
	},
	"8901491101820": {
		barcode: "8901491101820",
		barcodeType: "EAN-13",
		productName: "Quaker Rolled Oats 100% Whole Grain",
		brand: "Quaker",
		category: "Breakfast Cereals & Oats",
		countryOfOrigin: "India / USA",
		netWeight: "1kg",
		servingSize: "40g (1/2 Cup)",
		baseServingGrams: 40,
		imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80",
		isVeg: true,
		isOrganic: true,
		dietaryBadges: [
			"Vegetarian",
			"High Fiber",
			"Whole Grain",
			"Heart Healthy"
		],
		healthScore: 95,
		healthGrade: "A+",
		aiRecommendation: "Outstanding daily complex carb choice. High beta-glucan soluble fiber lowers cholesterol and stabilizes insulin.",
		aiHealthAnalysisText: "100% whole grain oats provide sustained energy release with zero added sugar and rich dietary fiber. Perfect for weight loss, endurance training, and cardiovascular wellness.",
		nutrition: {
			calories: {
				per100g: 389,
				perServing: 156,
				unit: "kcal"
			},
			protein: {
				per100g: 13,
				perServing: 5.2,
				unit: "g"
			},
			carbs: {
				per100g: 66,
				perServing: 26.4,
				unit: "g"
			},
			fat: {
				per100g: 7.5,
				perServing: 3,
				unit: "g"
			},
			sugar: {
				per100g: 1,
				perServing: .4,
				unit: "g"
			},
			fiber: {
				per100g: 10.5,
				perServing: 4.2,
				unit: "g"
			},
			saturatedFat: {
				per100g: 1.4,
				perServing: .6,
				unit: "g"
			},
			transFat: {
				per100g: 0,
				perServing: 0,
				unit: "g"
			},
			sodium: {
				per100g: 6,
				perServing: 2,
				unit: "mg"
			},
			potassium: {
				per100g: 350,
				perServing: 140,
				unit: "mg"
			},
			calcium: {
				per100g: 54,
				perServing: 22,
				unit: "mg"
			},
			iron: {
				per100g: 4.7,
				perServing: 1.9,
				unit: "mg"
			},
			vitaminA: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminC: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			},
			vitaminD: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminB12: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			cholesterol: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			}
		},
		ingredientsList: ["100% Whole Grain Rolled Oats"]
	},
	"8901063141125": {
		barcode: "8901063141125",
		barcodeType: "EAN-13",
		productName: "Britannia NutriChoice Digestive Biscuits",
		brand: "Britannia",
		category: "Biscuits & Snacks",
		countryOfOrigin: "India",
		netWeight: "100g",
		servingSize: "25g (2 Biscuits)",
		baseServingGrams: 25,
		imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
		isVeg: true,
		isOrganic: false,
		dietaryBadges: ["Vegetarian", "Dietary Fiber"],
		healthScore: 62,
		healthGrade: "C",
		aiRecommendation: "Better than standard cream biscuits, but still contains refined wheat flour and palm fat. Limit to 2 biscuits.",
		aiHealthAnalysisText: "NutriChoice digestive biscuits contain whole wheat flour and wheat bran, providing decent fiber, but also include palm oil and added sugars. Pair with tea mindfully.",
		nutrition: {
			calories: {
				per100g: 478,
				perServing: 120,
				unit: "kcal"
			},
			protein: {
				per100g: 8,
				perServing: 2,
				unit: "g"
			},
			carbs: {
				per100g: 68,
				perServing: 17,
				unit: "g"
			},
			fat: {
				per100g: 20,
				perServing: 5,
				unit: "g"
			},
			sugar: {
				per100g: 14.5,
				perServing: 3.6,
				unit: "g"
			},
			fiber: {
				per100g: 6,
				perServing: 1.5,
				unit: "g"
			},
			saturatedFat: {
				per100g: 9,
				perServing: 2.3,
				unit: "g"
			},
			transFat: {
				per100g: 0,
				perServing: 0,
				unit: "g"
			},
			sodium: {
				per100g: 380,
				perServing: 95,
				unit: "mg"
			},
			potassium: {
				per100g: 180,
				perServing: 45,
				unit: "mg"
			},
			calcium: {
				per100g: 40,
				perServing: 10,
				unit: "mg"
			},
			iron: {
				per100g: 2.5,
				perServing: .6,
				unit: "mg"
			},
			vitaminA: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminC: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			},
			vitaminD: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminB12: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			cholesterol: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			}
		},
		ingredientsList: [
			"Wheat Flour (Atta)",
			"Refined Wheat Flour (Maida)",
			"Refined Palm Oil",
			"Sugar",
			"Wheat Bran (5.5%)",
			"Liquid Glucose",
			"Milk Solids"
		]
	},
	"8901491000826": {
		barcode: "8901491000826",
		barcodeType: "EAN-13",
		productName: "Lay's Classic Salted Potato Chips",
		brand: "Lay's",
		category: "Chips & Crisps",
		countryOfOrigin: "India / USA",
		netWeight: "50g",
		servingSize: "30g (approx. 15 chips)",
		baseServingGrams: 30,
		imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
		isVeg: true,
		isOrganic: false,
		dietaryBadges: ["Vegetarian"],
		healthScore: 38,
		healthGrade: "D",
		aiRecommendation: "High in sodium and saturated fats from palmolein oil. Consume sparingly as a cheat snack.",
		aiHealthAnalysisText: "Deep fried potato chips with concentrated sodium and high caloric density. Rapid digestion spike with low satiety value.",
		nutrition: {
			calories: {
				per100g: 544,
				perServing: 163,
				unit: "kcal"
			},
			protein: {
				per100g: 7,
				perServing: 2.1,
				unit: "g"
			},
			carbs: {
				per100g: 52,
				perServing: 15.6,
				unit: "g"
			},
			fat: {
				per100g: 34,
				perServing: 10.2,
				unit: "g"
			},
			sugar: {
				per100g: 1,
				perServing: .3,
				unit: "g"
			},
			fiber: {
				per100g: 3.5,
				perServing: 1.1,
				unit: "g"
			},
			saturatedFat: {
				per100g: 14,
				perServing: 4.2,
				unit: "g"
			},
			transFat: {
				per100g: .1,
				perServing: 0,
				unit: "g"
			},
			sodium: {
				per100g: 560,
				perServing: 168,
				unit: "mg"
			},
			potassium: {
				per100g: 1200,
				perServing: 360,
				unit: "mg"
			},
			calcium: {
				per100g: 24,
				perServing: 7,
				unit: "mg"
			},
			iron: {
				per100g: 1.6,
				perServing: .5,
				unit: "mg"
			},
			vitaminA: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminC: {
				per100g: 15,
				perServing: 4.5,
				unit: "mg"
			},
			vitaminD: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminB12: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			cholesterol: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			}
		},
		ingredientsList: [
			"Potato",
			"Edible Vegetable Oil (Palmolein)",
			"Iodized Salt (1.5%)"
		]
	},
	"8901058852302": {
		barcode: "8901058852302",
		barcodeType: "EAN-13",
		productName: "Maggi 2-Minute Masala Noodles",
		brand: "Nestle Maggi",
		category: "Instant Noodles",
		countryOfOrigin: "India",
		netWeight: "70g",
		servingSize: "70g (1 Pack)",
		baseServingGrams: 70,
		imageUrl: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80",
		isVeg: true,
		isOrganic: false,
		dietaryBadges: ["Vegetarian"],
		healthScore: 42,
		healthGrade: "D",
		aiRecommendation: "High sodium content (over 60% daily limit) and refined flour (Maida). Add fresh vegetables and lean protein if eating.",
		aiHealthAnalysisText: "Instant noodles made with refined wheat flour and palmolein oil. Contains sodium tripolyphosphate and flavor enhancers. Not recommended for daily fitness regimes.",
		nutrition: {
			calories: {
				per100g: 427,
				perServing: 299,
				unit: "kcal"
			},
			protein: {
				per100g: 8,
				perServing: 5.6,
				unit: "g"
			},
			carbs: {
				per100g: 63.5,
				perServing: 44.5,
				unit: "g"
			},
			fat: {
				per100g: 15.7,
				perServing: 11,
				unit: "g"
			},
			sugar: {
				per100g: 2.2,
				perServing: 1.5,
				unit: "g"
			},
			fiber: {
				per100g: 3.6,
				perServing: 2.5,
				unit: "g"
			},
			saturatedFat: {
				per100g: 6.8,
				perServing: 4.8,
				unit: "g"
			},
			transFat: {
				per100g: .1,
				perServing: .1,
				unit: "g"
			},
			sodium: {
				per100g: 1200,
				perServing: 840,
				unit: "mg"
			},
			potassium: {
				per100g: 150,
				perServing: 105,
				unit: "mg"
			},
			calcium: {
				per100g: 140,
				perServing: 98,
				unit: "mg"
			},
			iron: {
				per100g: 3.7,
				perServing: 2.6,
				unit: "mg"
			},
			vitaminA: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminC: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			},
			vitaminD: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminB12: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			cholesterol: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			}
		},
		ingredientsList: [
			"Refined Wheat Flour (Maida)",
			"Palm Oil",
			"Salt",
			"Wheat Gluten",
			"Mineral (Calcium Carbonate)",
			"Hydrolysed Groundnut Protein",
			"Mixed Spices (Coriander, Turmeric, Cumin, Chilli)"
		]
	},
	"8901262010052": {
		barcode: "8901262010052",
		barcodeType: "EAN-13",
		productName: "Parle-G Glucose Biscuits",
		brand: "Parle",
		category: "Biscuits",
		countryOfOrigin: "India",
		netWeight: "80g",
		servingSize: "20g (4 Biscuits)",
		baseServingGrams: 20,
		imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80",
		isVeg: true,
		isOrganic: false,
		dietaryBadges: ["Vegetarian", "Quick Energy"],
		healthScore: 50,
		healthGrade: "C",
		aiRecommendation: "Provides quick glucose energy, but high in inverted sugar syrup and refined flour.",
		aiHealthAnalysisText: "Classic energy biscuit made with wheat flour, sugar, and vegetable oil. Suitable for quick workout energy, but watch portion size due to sugar content.",
		nutrition: {
			calories: {
				per100g: 454,
				perServing: 91,
				unit: "kcal"
			},
			protein: {
				per100g: 6.5,
				perServing: 1.3,
				unit: "g"
			},
			carbs: {
				per100g: 78.2,
				perServing: 15.6,
				unit: "g"
			},
			fat: {
				per100g: 13,
				perServing: 2.6,
				unit: "g"
			},
			sugar: {
				per100g: 26.5,
				perServing: 5.3,
				unit: "g"
			},
			fiber: {
				per100g: 1.8,
				perServing: .4,
				unit: "g"
			},
			saturatedFat: {
				per100g: 5.5,
				perServing: 1.1,
				unit: "g"
			},
			transFat: {
				per100g: 0,
				perServing: 0,
				unit: "g"
			},
			sodium: {
				per100g: 270,
				perServing: 54,
				unit: "mg"
			},
			potassium: {
				per100g: 90,
				perServing: 18,
				unit: "mg"
			},
			calcium: {
				per100g: 35,
				perServing: 7,
				unit: "mg"
			},
			iron: {
				per100g: 1.8,
				perServing: .4,
				unit: "mg"
			},
			vitaminA: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminC: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			},
			vitaminD: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			vitaminB12: {
				per100g: 0,
				perServing: 0,
				unit: "mcg"
			},
			cholesterol: {
				per100g: 0,
				perServing: 0,
				unit: "mg"
			}
		},
		ingredientsList: [
			"Wheat Flour (68%)",
			"Sugar (26%)",
			"Refined Palm Oil",
			"Invert Sugar Syrup",
			"Milk Solids",
			"Salt",
			"Raising Agents"
		]
	}
};
var SYSTEM_PROMPT$1 = `You are NutriLens AI's Senior Food Scientist, Clinical Nutritionist, and Barcode Database Expert.
Your job is to generate accurate, detailed, and structured nutritional, ingredient safety, and personalized health analysis for a food product based on barcode data, product name, or uploaded nutrition label photos.

Return ONLY a valid JSON object matching this structure (no markdown, no wrapped text, pure JSON):
{
  "barcode": "string",
  "barcodeType": "EAN-13 | UPC-A | UPC-E | Code128 | QR",
  "productName": "string",
  "brand": "string",
  "category": "string",
  "countryOfOrigin": "string",
  "netWeight": "string",
  "servingSize": "string",
  "baseServingGrams": 100,
  "imageUrl": "string or null",
  "isVeg": true,
  "isOrganic": false,
  "dietaryBadges": ["Vegetarian", "High Protein"],
  "healthScore": 85,
  "healthGrade": "A+ | A | B | C | D | E",
  "aiRecommendation": "Short actionable recommendation (1-2 sentences)",
  "aiHealthAnalysisText": "Detailed health breakdown paragraph (3-4 sentences explaining impact on blood sugar, heart, digestion, and fitness goals)",
  "nutrition": {
    "calories": { "per100g": 350, "perServing": 140, "unit": "kcal" },
    "protein": { "per100g": 12, "perServing": 4.8, "unit": "g" },
    "carbs": { "per100g": 60, "perServing": 24, "unit": "g" },
    "fat": { "per100g": 8, "perServing": 3.2, "unit": "g" },
    "sugar": { "per100g": 5, "perServing": 2, "unit": "g" },
    "fiber": { "per100g": 8, "perServing": 3.2, "unit": "g" },
    "saturatedFat": { "per100g": 2, "perServing": 0.8, "unit": "g" },
    "transFat": { "per100g": 0, "perServing": 0, "unit": "g" },
    "sodium": { "per100g": 300, "perServing": 120, "unit": "mg" },
    "potassium": { "per100g": 250, "perServing": 100, "unit": "mg" },
    "calcium": { "per100g": 100, "perServing": 40, "unit": "mg" },
    "iron": { "per100g": 3, "perServing": 1.2, "unit": "mg" },
    "vitaminA": { "per100g": 150, "perServing": 60, "unit": "mcg" },
    "vitaminC": { "per100g": 10, "perServing": 4, "unit": "mg" },
    "vitaminD": { "per100g": 2, "perServing": 0.8, "unit": "mcg" },
    "vitaminB12": { "per100g": 0.5, "perServing": 0.2, "unit": "mcg" },
    "cholesterol": { "per100g": 0, "perServing": 0, "unit": "mg" }
  },
  "ingredientsList": ["Ingredient 1", "Ingredient 2"],
  "ingredientRisks": [
    {
      "name": "Palm Oil / Added Sugar / MSG / Artificial Flavor",
      "category": "Added Sugar | Palm Oil | Artificial Colors | Artificial Flavours | MSG | High Sodium | High Fat | Sweeteners | Preservatives",
      "riskLevel": "Safe | Moderate | Avoid",
      "description": "Short explanation of why this ingredient has this risk level"
    }
  ],
  "personalizedAnalysis": {
    "weightLoss": { "suitable": true, "reason": "High fiber and low calorie density support fat loss deficit" },
    "muscleGain": { "suitable": true, "reason": "Provides quality amino acids for recovery" },
    "diabetes": { "suitable": false, "reason": "Contains rapid digestion sugars that may spike blood glucose" },
    "heartHealth": { "suitable": true, "reason": "Low saturated fat and zero trans-fats promote arterial health" },
    "children": { "suitable": true, "reason": "Contains natural nutrients without harmful additives" },
    "elderly": { "suitable": true, "reason": "Easy to digest and rich in calcium" },
    "dailyUse": { "suitable": true, "reason": "Clean ingredient profile suitable for everyday meal plans" }
  },
  "alternatives": [
    {
      "name": "Healthier Alternative Name",
      "brand": "Brand Name",
      "healthScore": 92,
      "calories": 180,
      "protein": 15,
      "estimatedPrice": "$3.50",
      "whyBetter": "Contains zero palm oil, 80% less sugar, and twice the protein content."
    }
  ]
}`;
async function fetchOpenFoodFacts(barcode) {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 4e3);
		const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
			headers: { "User-Agent": "NutriLensAI - Barcode Scanner - Web App" },
			signal: controller.signal
		});
		clearTimeout(timeout);
		if (!res.ok) return null;
		const data = await res.json();
		if (data.status === 1 && data.product) return data.product;
		return null;
	} catch (err) {
		console.warn("OpenFoodFacts fetch error/timeout:", err);
		return null;
	}
}
function buildAnalysisFromOpenFoodFacts(barcode, off) {
	const nutriments = off.nutriments || {};
	const servingSizeStr = String(off.serving_size || off.serving_quantity || "100g");
	const servingGrams = parseFloat(servingSizeStr) || 100;
	const ratio = servingGrams / 100;
	const getRawNum = (key100g, fallbackKey) => {
		const val100g = nutriments[key100g] ?? (fallbackKey ? nutriments[fallbackKey] : void 0);
		const num = parseFloat(String(val100g));
		return isNaN(num) ? 0 : num;
	};
	const createMacroGram = (key100g, fallbackKey) => {
		const p100 = Math.round(getRawNum(key100g, fallbackKey) * 10) / 10;
		return {
			per100g: p100,
			perServing: Math.round(p100 * ratio * 10) / 10,
			unit: "g"
		};
	};
	const createSodiumMg = () => {
		const rawSod = getRawNum("sodium_100g", "sodium");
		const rawSalt = getRawNum("salt_100g", "salt");
		let sodMg = 0;
		if (rawSod > 0) sodMg = rawSod <= 10 ? rawSod * 1e3 : rawSod;
		else if (rawSalt > 0) sodMg = rawSalt / 2.5 * 1e3;
		const p100 = Math.round(sodMg);
		return {
			per100g: p100,
			perServing: Math.round(p100 * ratio),
			unit: "mg"
		};
	};
	const createMineralMg = (key100g, fallbackKey) => {
		const raw = getRawNum(key100g, fallbackKey);
		const mg = raw > 0 && raw < 10 ? Math.round(raw * 1e3) : Math.round(raw);
		return {
			per100g: mg,
			perServing: Math.round(mg * ratio),
			unit: "mg"
		};
	};
	const createIronMg = (key100g, fallbackKey) => {
		const raw = getRawNum(key100g, fallbackKey);
		const mg = raw > 0 && raw < 1 ? Number((raw * 1e3).toFixed(1)) : Number(raw.toFixed(1));
		return {
			per100g: mg,
			perServing: Number((mg * ratio).toFixed(1)),
			unit: "mg"
		};
	};
	const createVitaminMcg = (key100g, fallbackKey) => {
		const raw = getRawNum(key100g, fallbackKey);
		let mcg = raw;
		if (raw > 0 && raw < .001) mcg = raw * 1e6;
		else if (raw > 0 && raw < 1) mcg = raw * 1e3;
		const p100 = Math.round(mcg * 10) / 10;
		return {
			per100g: p100,
			perServing: Math.round(p100 * ratio * 10) / 10,
			unit: "mcg"
		};
	};
	const createVitaminMg = (key100g, fallbackKey) => {
		const raw = getRawNum(key100g, fallbackKey);
		const mg = raw > 0 && raw < 1 ? Number((raw * 1e3).toFixed(1)) : Number(raw.toFixed(1));
		return {
			per100g: mg,
			perServing: Number((mg * ratio).toFixed(1)),
			unit: "mg"
		};
	};
	let cal100g = Math.round(getRawNum("energy-kcal_100g") || getRawNum("energy-kcal") || (getRawNum("energy_100g") || 0) / 4.184);
	const proG = createMacroGram("proteins_100g", "proteins").per100g;
	const carbG = createMacroGram("carbohydrates_100g", "carbohydrates").per100g;
	const fatG = createMacroGram("fat_100g", "fat").per100g;
	const atwaterKcal = Math.round(proG * 4 + carbG * 4 + fatG * 9);
	if (cal100g <= 0 || atwaterKcal > 10 && Math.abs(cal100g - atwaterKcal) > atwaterKcal * .5) cal100g = atwaterKcal;
	const nutriscore = String(off.nutriscore_grade || "").toLowerCase();
	let healthGrade = "B";
	let healthScore = 70;
	if (nutriscore === "a") {
		healthGrade = "A";
		healthScore = 90;
	} else if (nutriscore === "b") {
		healthGrade = "B";
		healthScore = 75;
	} else if (nutriscore === "c") {
		healthGrade = "C";
		healthScore = 55;
	} else if (nutriscore === "d") {
		healthGrade = "D";
		healthScore = 40;
	} else if (nutriscore === "e") {
		healthGrade = "E";
		healthScore = 25;
	}
	const ingredientsText = String(off.ingredients_text || off.ingredients_text_en || "");
	const ingredientsList = ingredientsText ? ingredientsText.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 20) : [];
	const ingredientRisks = [];
	const lowerIng = ingredientsText.toLowerCase();
	if (lowerIng.includes("palm oil") || lowerIng.includes("palmolein")) ingredientRisks.push({
		name: "Palm Oil / Palmolein",
		category: "Palm Oil",
		riskLevel: "Moderate",
		description: "High in saturated fatty acids which may raise LDL cholesterol if consumed regularly."
	});
	const sugars100g = createMacroGram("sugars_100g", "sugars").per100g;
	if (sugars100g > 15) ingredientRisks.push({
		name: "High Added Sugar",
		category: "Added Sugar",
		riskLevel: "Avoid",
		description: `Contains ${sugars100g}g sugar per 100g. May cause glucose spikes.`
	});
	const sodiumVal = createSodiumMg().per100g;
	if (sodiumVal > 600) ingredientRisks.push({
		name: "High Sodium Content",
		category: "High Sodium",
		riskLevel: "Moderate",
		description: `Elevated sodium levels (${sodiumVal}mg per 100g). Monitor intake.`
	});
	const isVeg = !(lowerIng.includes("meat") || lowerIng.includes("chicken") || lowerIng.includes("beef") || lowerIng.includes("fish") || lowerIng.includes("gelatin"));
	return {
		barcode,
		barcodeType: barcode.length === 12 ? "UPC-A" : "EAN-13",
		productName: String(off.product_name || off.product_name_en || "Scanned Food Product"),
		brand: String(off.brands || "Food Brand"),
		category: String(off.categories || "Packaged Foods"),
		countryOfOrigin: String(off.countries || "International"),
		netWeight: String(off.quantity || `${servingGrams}g`),
		servingSize: servingSizeStr,
		baseServingGrams: servingGrams,
		imageUrl: off.image_url || off.image_front_url || null,
		isVeg,
		isOrganic: lowerIng.includes("organic") || lowerIng.includes("bio"),
		dietaryBadges: isVeg ? ["Vegetarian"] : ["Non-Vegetarian"],
		healthScore,
		healthGrade,
		aiRecommendation: healthScore >= 75 ? "Nutritious option with favorable macro balance. Suitable for everyday nutrition." : "Moderate nutritional quality. Enjoy mindfully within your daily caloric budget.",
		aiHealthAnalysisText: `This item provides ${cal100g} kcal and ${proG}g protein per 100g. Sourced directly from OpenFoodFacts verified food database.`,
		nutrition: {
			calories: {
				per100g: cal100g,
				perServing: Math.round(cal100g * ratio),
				unit: "kcal"
			},
			protein: {
				per100g: proG,
				perServing: Math.round(proG * ratio * 10) / 10,
				unit: "g"
			},
			carbs: {
				per100g: carbG,
				perServing: Math.round(carbG * ratio * 10) / 10,
				unit: "g"
			},
			fat: {
				per100g: fatG,
				perServing: Math.round(fatG * ratio * 10) / 10,
				unit: "g"
			},
			sugar: createMacroGram("sugars_100g", "sugars"),
			fiber: createMacroGram("fiber_100g", "fiber"),
			saturatedFat: createMacroGram("saturated-fat_100g", "saturated-fat"),
			transFat: createMacroGram("trans-fat_100g", "trans-fat"),
			sodium: createSodiumMg(),
			potassium: createMineralMg("potassium_100g", "potassium"),
			calcium: createMineralMg("calcium_100g", "calcium"),
			iron: createIronMg("iron_100g", "iron"),
			vitaminA: createVitaminMcg("vitamin-a_100g", "vitamin-a"),
			vitaminC: createVitaminMg("vitamin-c_100g", "vitamin-c"),
			vitaminD: createVitaminMcg("vitamin-d_100g", "vitamin-d"),
			vitaminB12: createVitaminMcg("vitamin-b12_100g", "vitamin-b12"),
			cholesterol: createMineralMg("cholesterol_100g", "cholesterol")
		},
		ingredientsList,
		ingredientRisks,
		personalizedAnalysis: {
			weightLoss: {
				suitable: cal100g < 250,
				reason: cal100g < 250 ? "Moderate caloric density." : "High caloric density, control portions."
			},
			muscleGain: {
				suitable: proG >= 10,
				reason: proG >= 10 ? "Provides good dietary protein." : "Low protein content."
			},
			diabetes: {
				suitable: sugars100g < 5,
				reason: sugars100g < 5 ? "Low simple sugar content." : "Contains sugars that may impact glycemic load."
			},
			heartHealth: {
				suitable: fatG < 10,
				reason: fatG < 10 ? "Low fat profile." : "Moderate fat profile."
			},
			children: {
				suitable: ingredientRisks.length === 0,
				reason: "Nutrient profile evaluated for growing children."
			},
			elderly: {
				suitable: true,
				reason: "Standard digestion profile."
			},
			dailyUse: {
				suitable: healthScore >= 60,
				reason: healthScore >= 60 ? "Balanced profile for regular consumption." : "Best consumed occasionally."
			}
		},
		alternatives: []
	};
}
var Route$2 = createFileRoute("/api/barcode")({ server: { handlers: {
	GET: () => {
		return Response.json({ error: "Method Not Allowed. Please send a POST request with barcode or OCR images." }, { status: 405 });
	},
	POST: async ({ request }) => {
		try {
			const { barcode, ocrImages, userProfile } = await request.json() || {};
			let offProduct = null;
			const cleanBarcode = barcode ? String(barcode).trim() : "";
			if (cleanBarcode) offProduct = await fetchOpenFoodFacts(cleanBarcode);
			const builtinMatch = BUILTIN_BARCODE_CATALOG[cleanBarcode];
			const apiKey = getGeminiApiKey();
			const contentsParts = [];
			let userContextPrompt = "";
			if (userProfile) userContextPrompt = `\nUser Profile Context for Personalized Analysis:
- Age: ${userProfile.age || 28}, Gender: ${userProfile.gender || "male"}
- Height: ${userProfile.height_cm || 175}cm, Weight: ${userProfile.weight_kg || 70}kg
- Fitness Goal: ${userProfile.goal || "weight_loss"}
- BMI: ${userProfile.extended_data?.bmi || "22.8"}
- BMR: ${userProfile.extended_data?.bmr || "1650"} kcal, TDEE: ${userProfile.extended_data?.tdee || "2200"} kcal
- Health Flags / Allergies: ${userProfile.extended_data?.allergies?.join(", ") || "None"}
`;
			if (ocrImages && Array.isArray(ocrImages) && ocrImages.length > 0) {
				for (const imgBase64 of ocrImages) {
					const base64Data = imgBase64.replace(/^data:image\/\w+;base64,/, "");
					contentsParts.push({ inlineData: {
						data: base64Data,
						mimeType: "image/jpeg"
					} });
				}
				contentsParts.push({ text: `Analyze these nutrition label / ingredient / product packaging photos using AI OCR. Extract or estimate full nutrition details, product name, brand, ingredient risks, and health scores.${userContextPrompt}` });
			} else {
				let offText = "";
				if (offProduct) offText = `\nOpenFoodFacts Live Data:
- Product Name: ${String(offProduct.product_name || offProduct.product_name_en || "")}
- Brand: ${String(offProduct.brands || "")}
- Categories: ${String(offProduct.categories || "")}
- Ingredients: ${String(offProduct.ingredients_text || "")}
- Nutriments 100g: ${JSON.stringify(offProduct.nutriments || {})}
- Image: ${String(offProduct.image_url || offProduct.image_front_url || "")}
- Nutriscore: ${String(offProduct.nutriscore_grade || "")}
`;
				let builtinText = "";
				if (builtinMatch) builtinText = `\nBuilt-in Catalog Hint: ${JSON.stringify(builtinMatch)}`;
				contentsParts.push({ text: `Product Barcode: ${cleanBarcode || "Unknown"}
${offText}
${builtinText}
${userContextPrompt}

Analyze this product thoroughly. Ensure exact values for calories, protein, carbs, fat, sugar, fiber, sodium, potassium, calcium, iron, vitamins, ingredient risks, health grade (A+ to E), health score (0-100), and custom profile suitability. Return JSON strictly matching requested schema.` });
			}
			let content = "{}";
			if (apiKey) try {
				const ai = new GoogleGenAI({
					apiKey,
					httpOptions: { headers: { "User-Agent": "aistudio-build" } }
				});
				for (const modelName of [
					"gemini-2.5-flash",
					"gemini-flash-latest",
					"gemini-2.5-pro",
					"gemini-3.7-flash",
					"gemini-3.1-flash-lite"
				]) {
					try {
						const response = await ai.models.generateContent({
							model: modelName,
							contents: { parts: contentsParts },
							config: {
								systemInstruction: SYSTEM_PROMPT$1,
								responseMimeType: "application/json",
								temperature: .2
							}
						});
						if (response && response.text) {
							content = response.text;
							break;
						}
					} catch (err) {
						const msg = err instanceof Error ? err.message : String(err);
						if (msg.includes("503") || msg.includes("429") || msg.includes("UNAVAILABLE") || msg.includes("high demand")) console.info(`[/api/barcode] Model ${modelName} is at capacity. Transitioning to next model...`);
						else console.warn(`[/api/barcode] Model ${modelName} notice:`, msg);
					}
					if (content !== "{}") break;
				}
			} catch (aiInitErr) {
				console.warn("[/api/barcode] GoogleGenAI init error:", aiInitErr);
			}
			if (content === "{}" && process.env.LOVABLE_API_KEY) try {
				const promptText = contentsParts.map((p) => p.text).filter(Boolean).join("\n\n");
				const completion = await gatewayChatCompletion({
					model: "google/gemini-2.5-flash",
					messages: [{
						role: "system",
						content: SYSTEM_PROMPT$1
					}, {
						role: "user",
						content: promptText || "Analyze food barcode and provide JSON nutrition facts."
					}],
					response_format: { type: "json_object" }
				});
				if (completion?.choices?.[0]?.message?.content) content = completion.choices[0].message.content;
			} catch (gwErr) {
				console.warn("[/api/barcode] Gateway fallback error:", gwErr);
			}
			if (content === "{}" || !content) {
				if (offProduct && cleanBarcode) {
					const directOffAnalysis = buildAnalysisFromOpenFoodFacts(cleanBarcode, offProduct);
					return Response.json(directOffAnalysis);
				}
				if (builtinMatch) return Response.json(builtinMatch);
				return Response.json({ error: "Could not locate product details. Please try packaging OCR mode or enter barcode manually." }, { status: 404 });
			}
			let parsed;
			try {
				parsed = JSON.parse(content);
			} catch {
				if (offProduct && cleanBarcode) return Response.json(buildAnalysisFromOpenFoodFacts(cleanBarcode, offProduct));
				if (builtinMatch) return Response.json(builtinMatch);
				return Response.json({ error: "Failed to parse product analysis output." }, { status: 500 });
			}
			if (!parsed.barcode) parsed.barcode = cleanBarcode || "0000000000000";
			if (!parsed.barcodeType) parsed.barcodeType = cleanBarcode.length === 12 ? "UPC-A" : "EAN-13";
			if (!parsed.productName) parsed.productName = builtinMatch?.productName || offProduct?.product_name || "Scanned Food Item";
			if (!parsed.brand) parsed.brand = builtinMatch?.brand || offProduct?.brands || "Generic Brand";
			if (!parsed.healthScore) parsed.healthScore = builtinMatch?.healthScore || 70;
			if (!parsed.healthGrade) parsed.healthGrade = builtinMatch?.healthGrade || "B";
			const cleanNutrient = (raw, defaultPer100g, unit, roundDecimals = 1) => {
				const num100 = typeof raw?.per100g === "number" && !isNaN(raw.per100g) ? raw.per100g : defaultPer100g;
				const factor = Math.pow(10, roundDecimals);
				const p100 = roundDecimals === 0 ? Math.round(num100) : Math.round(num100 * factor) / factor;
				const numServing = typeof raw?.perServing === "number" && !isNaN(raw.perServing) ? raw.perServing : p100;
				const pServing = roundDecimals === 0 ? Math.round(numServing) : Math.round(numServing * factor) / factor;
				return {
					per100g: Math.max(0, p100),
					perServing: Math.max(0, pServing),
					unit: raw?.unit || unit
				};
			};
			const rawNut = parsed.nutrition || {};
			const pProtein = cleanNutrient(rawNut.protein, 5, "g", 1);
			const pCarbs = cleanNutrient(rawNut.carbs, 20, "g", 1);
			const pFat = cleanNutrient(rawNut.fat, 5, "g", 1);
			let pCalories = cleanNutrient(rawNut.calories, 150, "kcal", 0);
			const atwaterKcal = Math.round(pProtein.per100g * 4 + pCarbs.per100g * 4 + pFat.per100g * 9);
			if (pCalories.per100g <= 0 || atwaterKcal > 10 && Math.abs(pCalories.per100g - atwaterKcal) > atwaterKcal * .5) pCalories = {
				per100g: atwaterKcal,
				perServing: Math.round(pProtein.perServing * 4 + pCarbs.perServing * 4 + pFat.perServing * 9),
				unit: "kcal"
			};
			parsed.nutrition = {
				calories: pCalories,
				protein: pProtein,
				carbs: pCarbs,
				fat: pFat,
				sugar: cleanNutrient(rawNut.sugar, 5, "g", 1),
				fiber: cleanNutrient(rawNut.fiber, 2, "g", 1),
				saturatedFat: cleanNutrient(rawNut.saturatedFat, 1, "g", 1),
				transFat: cleanNutrient(rawNut.transFat, 0, "g", 1),
				sodium: cleanNutrient(rawNut.sodium, 150, "mg", 0),
				potassium: cleanNutrient(rawNut.potassium, 100, "mg", 0),
				calcium: cleanNutrient(rawNut.calcium, 50, "mg", 0),
				iron: cleanNutrient(rawNut.iron, 1, "mg", 1),
				vitaminA: cleanNutrient(rawNut.vitaminA, 0, "mcg", 0),
				vitaminC: cleanNutrient(rawNut.vitaminC, 0, "mg", 1),
				vitaminD: cleanNutrient(rawNut.vitaminD, 0, "mcg", 1),
				vitaminB12: cleanNutrient(rawNut.vitaminB12, 0, "mcg", 1),
				cholesterol: cleanNutrient(rawNut.cholesterol, 0, "mg", 0)
			};
			return Response.json(parsed);
		} catch (error) {
			console.error("[/api/barcode] Server error:", error);
			return Response.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
		}
	}
} } });
function normalizeDietType(dietStr) {
	const s = typeof dietStr === "string" ? dietStr.toLowerCase().trim() : String(dietStr ?? "").toLowerCase().trim();
	if (s.includes("mixed") || s.includes("both")) return "MIXED";
	if (s.includes("non") || s.includes("meat") || s.includes("chicken") || s.includes("fish") || s.includes("eggetarian")) return "NON_VEGETARIAN";
	return "VEGETARIAN";
}
var NON_VEG_KEYWORDS = [
	"chicken",
	"fish",
	"mutton",
	"lamb",
	"beef",
	"pork",
	"turkey",
	"seafood",
	"prawn",
	"prawns",
	"shrimp",
	"shrimps",
	"crab",
	"meat",
	"flesh",
	"salmon",
	"tuna",
	"cod",
	"bacon",
	"ham",
	"sausage",
	"duck",
	"anchovy",
	"squid",
	"lobster",
	"clam",
	"oyster",
	"octopus",
	"gelatin",
	"egg",
	"eggs",
	"egg white",
	"egg whites",
	"egg yolk",
	"egg yolks",
	"omelet",
	"omelette"
];
var NON_VEG_PROTEIN_KEYWORDS = [
	"chicken",
	"fish",
	"mutton",
	"lamb",
	"beef",
	"pork",
	"turkey",
	"seafood",
	"prawn",
	"prawns",
	"shrimp",
	"shrimps",
	"crab",
	"meat",
	"salmon",
	"tuna",
	"cod",
	"egg",
	"eggs",
	"egg white",
	"egg whites"
];
function validateMealDiet(meal, targetDiet, options) {
	const canonicalTarget = normalizeDietType(targetDiet);
	const violations = [];
	let nonVegCount = 0;
	let containsNonVegProtein = false;
	const rawIngredientsList = meal.ingredients.map((ing) => typeof ing === "string" ? ing : ing.name || "");
	for (const rawIng of rawIngredientsList) {
		const ingLower = rawIng.toLowerCase();
		if (/\beggplant\b/i.test(ingLower) || /\begg plants?\b/i.test(ingLower)) continue;
		for (const kw of NON_VEG_KEYWORDS) if (new RegExp(`\\b${kw}\\b`, "i").test(ingLower)) {
			nonVegCount++;
			violations.push(`Ingredient "${rawIng}" contains non-vegetarian item (${kw})`);
			break;
		}
		for (const pk of NON_VEG_PROTEIN_KEYWORDS) if (new RegExp(`\\b${pk}\\b`, "i").test(ingLower)) {
			containsNonVegProtein = true;
			break;
		}
	}
	const nameLower = (meal.mealName || "").toLowerCase();
	for (const kw of NON_VEG_KEYWORDS) {
		if (/\beggplant\b/i.test(nameLower)) continue;
		if (new RegExp(`\\b${kw}\\b`, "i").test(nameLower)) {
			if (nonVegCount === 0) {
				nonVegCount++;
				violations.push(`Meal name "${meal.mealName}" mentions non-vegetarian item (${kw})`);
			}
			containsNonVegProtein = true;
			break;
		}
	}
	const detectedDietType = nonVegCount > 0 ? "NON_VEGETARIAN" : "VEGETARIAN";
	if (canonicalTarget === "VEGETARIAN") {
		if (nonVegCount > 0) return {
			valid: false,
			violations,
			detectedDietType,
			containsNonVegProtein
		};
		return {
			valid: true,
			violations: [],
			detectedDietType: "VEGETARIAN",
			containsNonVegProtein: false
		};
	}
	if (canonicalTarget === "NON_VEGETARIAN") {
		if (options?.isMainMeal && !containsNonVegProtein) return {
			valid: false,
			violations: ["Main meal in Non-Vegetarian plan must contain a non-vegetarian protein source"],
			detectedDietType,
			containsNonVegProtein
		};
		return {
			valid: true,
			violations: [],
			detectedDietType,
			containsNonVegProtein
		};
	}
	return {
		valid: true,
		violations: [],
		detectedDietType,
		containsNonVegProtein
	};
}
function validateFullDayPlanDiet(meals, targetDiet) {
	const canonicalTarget = normalizeDietType(targetDiet);
	const violations = [];
	let vegMealCount = 0;
	let nonVegMealCount = 0;
	for (const meal of meals) {
		const slotLower = (meal.mealType || "").toLowerCase();
		const res = validateMealDiet(meal, canonicalTarget, { isMainMeal: slotLower.includes("breakfast") || slotLower.includes("lunch") || slotLower.includes("dinner") });
		if (!res.valid) violations.push(...res.violations);
		if (res.detectedDietType === "VEGETARIAN") vegMealCount++;
		else nonVegMealCount++;
	}
	if (canonicalTarget === "VEGETARIAN") {
		if (nonVegMealCount > 0) return {
			valid: false,
			violations,
			vegMealCount,
			nonVegMealCount
		};
		return {
			valid: true,
			violations: [],
			vegMealCount,
			nonVegMealCount
		};
	}
	if (canonicalTarget === "NON_VEGETARIAN") {
		if (violations.length > 0) return {
			valid: false,
			violations,
			vegMealCount,
			nonVegMealCount
		};
		return {
			valid: true,
			violations: [],
			vegMealCount,
			nonVegMealCount
		};
	}
	if (canonicalTarget === "MIXED") {
		if (vegMealCount < 1 || nonVegMealCount < 1) return {
			valid: false,
			violations: [`MIXED mode requires at least 1 vegetarian meal and 1 non-vegetarian meal (got ${vegMealCount} veg, ${nonVegMealCount} non-veg)`],
			vegMealCount,
			nonVegMealCount
		};
		return {
			valid: violations.length === 0,
			violations,
			vegMealCount,
			nonVegMealCount
		};
	}
	return {
		valid: violations.length === 0,
		violations,
		vegMealCount,
		nonVegMealCount
	};
}
var LIBRARY_STORE = /* @__PURE__ */ new Map();
var USER_HISTORY_STORE = [];
function normalizeIngredientName(rawName) {
	if (!rawName) return "";
	return rawName.toLowerCase().replace(/\b(cooked|raw|boiled|steamed|grilled|roasted|seared|baked|fried|chopped|sliced|diced|fresh|organic|piece|pieces|g|ml|cup|cups|tbsp|tsp|gram|grams)\b/gi, "").replace(/[^a-z0-9\s]/gi, " ").replace(/\s+/g, " ").trim();
}
function getPrimaryProteinAndCarb(normalizedIngs) {
	const proteinKeywords = [
		"chicken",
		"paneer",
		"egg",
		"eggs",
		"dal",
		"lentil",
		"fish",
		"salmon",
		"tofu",
		"soya",
		"mutton",
		"chickpea",
		"rajma"
	];
	const carbKeywords = [
		"rice",
		"roti",
		"bread",
		"oats",
		"quinoa",
		"potato",
		"sweet potato",
		"dosa",
		"idli",
		"pasta",
		"noodle"
	];
	let protein = "none";
	let carb = "none";
	for (const ing of normalizedIngs) {
		if (protein === "none") {
			for (const pk of proteinKeywords) if (ing.includes(pk)) {
				protein = pk;
				break;
			}
		}
		if (carb === "none") {
			for (const ck of carbKeywords) if (ing.includes(ck)) {
				carb = ck;
				break;
			}
		}
	}
	return {
		protein,
		carb
	};
}
/**
* Check if two meals are duplicate or substantially similar
*/
function isDuplicateMeal(mealName, mealType, ingredients, existingItem) {
	if (existingItem.mealType.toLowerCase() !== mealType.toLowerCase()) return false;
	const nameA = mealName.toLowerCase().replace(/[^a-z0-9]/gi, "");
	if (nameA === existingItem.mealName.toLowerCase().replace(/[^a-z0-9]/gi, "") && nameA.length > 3) return true;
	const normalizedNew = ingredients.map((i) => normalizeIngredientName(i.name)).filter(Boolean);
	const normalizedExist = existingItem.normalizedIngredients.filter(Boolean);
	if (normalizedNew.length === 0 || normalizedExist.length === 0) return false;
	const setA = new Set(normalizedNew);
	const setB = new Set(normalizedExist);
	let commonCount = 0;
	for (const item of setA) if (setB.has(item) || Array.from(setB).some((b) => item.includes(b) || b.includes(item))) commonCount++;
	const overlapRatioA = commonCount / setA.size;
	const overlapRatioB = commonCount / setB.size;
	if (overlapRatioA >= .8 && overlapRatioB >= .8) return true;
	const pcA = getPrimaryProteinAndCarb(normalizedNew);
	const pcB = getPrimaryProteinAndCarb(normalizedExist);
	if (pcA.protein !== "none" && pcA.protein === pcB.protein && pcA.carb !== "none" && pcA.carb === pcB.carb && Math.abs(normalizedNew.length - normalizedExist.length) <= 1) return true;
	return false;
}
/**
* Validates whether a meal satisfies dietary restrictions and structure
*/
function isValidMealForLibrary(meal, diet) {
	if (!meal || !meal.mealName || !meal.mealType) return false;
	if (!Array.isArray(meal.ingredients) || meal.ingredients.length === 0) return false;
	for (const ing of meal.ingredients) if (!ing.name || typeof ing.quantity !== "number" || isNaN(ing.quantity) || ing.quantity <= 0) return false;
	if (!meal.nutrition || meal.nutrition.calories <= 0 || meal.nutrition.protein < 0) return false;
	if (!validateMealDiet(meal, normalizeDietType(diet)).valid) return false;
	return true;
}
/**
* Initial Curated Seed Meals to ensure the library starts rich & full
*/
var SEED_MEALS = [
	{
		mealName: "High Protein Paneer & Veggie Scramble with Whole Wheat Toast",
		mealType: "Breakfast",
		dietType: "Vegetarian",
		ingredients: [
			{
				name: "Cottage Cheese / Paneer",
				quantity: 150,
				unit: "g"
			},
			{
				name: "Whole Wheat Bread",
				quantity: 2,
				unit: "piece"
			},
			{
				name: "Spinach / Palak",
				quantity: 50,
				unit: "g"
			},
			{
				name: "Butter",
				quantity: 5,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"paneer",
			"whole wheat bread",
			"spinach",
			"butter"
		],
		instructions: ["Crumble paneer and sauté with spinach and turmeric.", "Serve warm alongside toasted whole wheat bread."],
		calories: 420,
		protein: 26.5,
		carbs: 32,
		fat: 20,
		fiber: 5,
		prepTime: 12,
		estimatedCost: "₹65",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "Rolled Oats Porridge with Almonds, Chia & Honey",
		mealType: "Breakfast",
		dietType: "Vegetarian",
		ingredients: [
			{
				name: "Rolled Oats",
				quantity: 70,
				unit: "g"
			},
			{
				name: "Milk",
				quantity: 220,
				unit: "ml"
			},
			{
				name: "Almonds",
				quantity: 20,
				unit: "g"
			},
			{
				name: "Chia Seeds",
				quantity: 10,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"rolled oats",
			"milk",
			"almonds",
			"chia seeds"
		],
		instructions: ["Simmer oats in warm milk for 5-7 minutes.", "Stir in chia seeds and top with toasted almonds."],
		calories: 440,
		protein: 18.2,
		carbs: 58,
		fat: 15.5,
		fiber: 9,
		prepTime: 10,
		estimatedCost: "₹50",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "3-Egg Scramble with Spinach, Tomatoes & Whole Wheat Toast",
		mealType: "Breakfast",
		dietType: "Non-Vegetarian",
		ingredients: [
			{
				name: "Whole Egg, cooked",
				quantity: 3,
				unit: "piece"
			},
			{
				name: "Whole Wheat Bread",
				quantity: 2,
				unit: "piece"
			},
			{
				name: "Spinach / Palak",
				quantity: 40,
				unit: "g"
			},
			{
				name: "Butter",
				quantity: 5,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"egg",
			"whole wheat bread",
			"spinach",
			"butter"
		],
		instructions: ["Whisk eggs and scramble gently with spinach in butter.", "Serve with toasted bread."],
		calories: 380,
		protein: 24,
		carbs: 28,
		fat: 18,
		fiber: 4,
		prepTime: 10,
		estimatedCost: "₹55",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "High Protein Paneer & Brown Rice Veggie Bowl",
		mealType: "Lunch",
		dietType: "Vegetarian",
		ingredients: [
			{
				name: "Cottage Cheese / Paneer",
				quantity: 160,
				unit: "g"
			},
			{
				name: "Brown Rice / Quinoa, cooked",
				quantity: 180,
				unit: "g"
			},
			{
				name: "Mixed Vegetables, cooked",
				quantity: 80,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"paneer",
			"brown rice",
			"mixed vegetables"
		],
		instructions: ["Pan sear paneer cubes in olive oil.", "Serve warm over steamed brown rice and mixed vegetables."],
		calories: 550,
		protein: 32,
		carbs: 52,
		fat: 22,
		fiber: 6.5,
		prepTime: 20,
		estimatedCost: "₹115",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "Soya Chunks & Quinoa Power Salad Bowl",
		mealType: "Lunch",
		dietType: "Vegetarian",
		ingredients: [
			{
				name: "Soya Granules / Chunks",
				quantity: 80,
				unit: "g"
			},
			{
				name: "Brown Rice / Quinoa, cooked",
				quantity: 160,
				unit: "g"
			},
			{
				name: "Spinach / Palak",
				quantity: 70,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"soya chunks",
			"quinoa",
			"spinach"
		],
		instructions: ["Boil soya chunks and toss with warm cooked quinoa and sautéed spinach."],
		calories: 490,
		protein: 42,
		carbs: 56,
		fat: 8,
		fiber: 10,
		prepTime: 18,
		estimatedCost: "₹85",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "Grilled Herb Chicken Breast with Steamed Rice & Broccoli",
		mealType: "Lunch",
		dietType: "Non-Vegetarian",
		ingredients: [
			{
				name: "Chicken Breast, cooked",
				quantity: 180,
				unit: "g"
			},
			{
				name: "White Rice, cooked",
				quantity: 180,
				unit: "g"
			},
			{
				name: "Broccoli, steamed",
				quantity: 80,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"chicken breast",
			"white rice",
			"broccoli"
		],
		instructions: ["Grill herb-marinated chicken breast until tender.", "Serve over steamed rice with broccoli."],
		calories: 520,
		protein: 48,
		carbs: 50,
		fat: 11,
		fiber: 4.5,
		prepTime: 20,
		estimatedCost: "₹130",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "Lemon Garlic Salmon Fillet with Brown Rice & Sautéed Veggies",
		mealType: "Lunch",
		dietType: "Non-Vegetarian",
		ingredients: [
			{
				name: "Salmon / Fish Fillet, cooked",
				quantity: 160,
				unit: "g"
			},
			{
				name: "Brown Rice / Quinoa, cooked",
				quantity: 160,
				unit: "g"
			},
			{
				name: "Mixed Vegetables, cooked",
				quantity: 80,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"salmon",
			"brown rice",
			"mixed vegetables"
		],
		instructions: ["Pan-sear salmon in lemon butter.", "Serve alongside brown rice and mixed vegetables."],
		calories: 580,
		protein: 42,
		carbs: 46,
		fat: 22,
		fiber: 6,
		prepTime: 22,
		estimatedCost: "₹190",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "Greek Yogurt Berry Bowl with Crushed Almonds",
		mealType: "Snack",
		dietType: "Vegetarian",
		ingredients: [
			{
				name: "Greek Yogurt",
				quantity: 180,
				unit: "g"
			},
			{
				name: "Berries",
				quantity: 80,
				unit: "g"
			},
			{
				name: "Almonds",
				quantity: 15,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"greek yogurt",
			"berries",
			"almonds"
		],
		instructions: ["Combine thick Greek yogurt with fresh berries.", "Top with toasted crushed almonds."],
		calories: 250,
		protein: 19,
		carbs: 22,
		fat: 8.5,
		fiber: 4,
		prepTime: 5,
		estimatedCost: "₹60",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "Spiced Roasted Chickpeas & Walnut Crunch",
		mealType: "Snack",
		dietType: "Vegan",
		ingredients: [{
			name: "Chickpeas / Chana, cooked",
			quantity: 120,
			unit: "g"
		}, {
			name: "Walnuts / Akhrot",
			quantity: 20,
			unit: "g"
		}],
		normalizedIngredients: ["chickpeas", "walnuts"],
		instructions: ["Dry roast chickpeas with chaat masala.", "Mix with raw walnuts."],
		calories: 280,
		protein: 13,
		carbs: 32,
		fat: 12,
		fiber: 7,
		prepTime: 8,
		estimatedCost: "₹45",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "Yellow Lentil Tadka Dal with 2 Whole Wheat Chapatis",
		mealType: "Dinner",
		dietType: "Vegetarian",
		ingredients: [
			{
				name: "Yellow Lentils / Toor Dal, cooked",
				quantity: 220,
				unit: "g"
			},
			{
				name: "Whole Wheat Roti / Chapati",
				quantity: 2,
				unit: "piece"
			},
			{
				name: "Spinach / Palak",
				quantity: 50,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"yellow lentils",
			"whole wheat roti",
			"spinach"
		],
		instructions: ["Simmer yellow lentils with cumin and garlic tadka.", "Serve hot with whole wheat chapatis."],
		calories: 460,
		protein: 21,
		carbs: 72,
		fat: 8,
		fiber: 11,
		prepTime: 25,
		estimatedCost: "₹75",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "Palak Paneer Gravy with Whole Wheat Rotis",
		mealType: "Dinner",
		dietType: "Vegetarian",
		ingredients: [
			{
				name: "Cottage Cheese / Paneer",
				quantity: 140,
				unit: "g"
			},
			{
				name: "Spinach / Palak",
				quantity: 120,
				unit: "g"
			},
			{
				name: "Whole Wheat Roti / Chapati",
				quantity: 2,
				unit: "piece"
			}
		],
		normalizedIngredients: [
			"paneer",
			"spinach",
			"whole wheat roti"
		],
		instructions: ["Puree blanched spinach with ginger and garlic.", "Fold in paneer cubes and serve hot with chapatis."],
		calories: 490,
		protein: 28,
		carbs: 48,
		fat: 21,
		fiber: 8,
		prepTime: 22,
		estimatedCost: "₹110",
		nutritionVerified: true,
		source: "curated_library"
	},
	{
		mealName: "Aromatic Fish Curry with Whole Wheat Chapatis & Salad",
		mealType: "Dinner",
		dietType: "Non-Vegetarian",
		ingredients: [
			{
				name: "Salmon / Fish Fillet, cooked",
				quantity: 150,
				unit: "g"
			},
			{
				name: "Whole Wheat Roti / Chapati",
				quantity: 2,
				unit: "piece"
			},
			{
				name: "Mixed Vegetables, cooked",
				quantity: 60,
				unit: "g"
			}
		],
		normalizedIngredients: [
			"fish fillet",
			"whole wheat roti",
			"mixed vegetables"
		],
		instructions: ["Simmer fish in spiced tomato-onion curry.", "Serve with warm chapatis and salad."],
		calories: 470,
		protein: 36,
		carbs: 44,
		fat: 14,
		fiber: 6,
		prepTime: 25,
		estimatedCost: "₹145",
		nutritionVerified: true,
		source: "curated_library"
	}
];
function initializeLibraryWithSeeds() {
	if (LIBRARY_STORE.size > 0) return;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	for (const seed of SEED_MEALS) {
		const id = `seed-${seed.mealType.toLowerCase()}-${seed.dietType.toLowerCase()}-${Math.random().toString(36).substring(2, 8)}`;
		LIBRARY_STORE.set(id, {
			...seed,
			id,
			createdAt: now,
			usageCount: 1,
			lastUsedAt: now
		});
	}
}
initializeLibraryWithSeeds();
/**
* Searches the reusable meal library for a compatible meal before calling AI
*/
async function findMatchingMealFromLibrary(filters) {
	initializeLibraryWithSeeds();
	const targetCal = filters.calorieTarget || 500;
	const targetPro = filters.proteinTarget || 30;
	const targetMealType = (filters.mealType || "").toLowerCase();
	const canonicalTargetDiet = normalizeDietType(filters.diet);
	const excluded = Array.isArray(filters.excludedMeals) ? filters.excludedMeals.map((m) => m.toLowerCase().trim()).filter(Boolean) : [];
	const forbiddenWords = [];
	if (Array.isArray(filters.allergies)) filters.allergies.forEach((a) => forbiddenWords.push(a.toLowerCase().trim()));
	if (Array.isArray(filters.dislikes)) filters.dislikes.forEach((d) => forbiddenWords.push(d.toLowerCase().trim()));
	if (filters.foodsToAvoid) filters.foodsToAvoid.split(",").forEach((f) => forbiddenWords.push(f.toLowerCase().trim()));
	const userId = filters.userId || "anonymous";
	const userRecentMealIds = USER_HISTORY_STORE.filter((h) => h.userId === userId).slice(-10).map((h) => h.mealId);
	const candidates = [];
	for (const item of LIBRARY_STORE.values()) {
		if (targetMealType && targetMealType !== "all" && !targetMealType.includes("day") && !targetMealType.includes("full")) {
			if (item.mealType.toLowerCase() !== targetMealType) continue;
		}
		const isMainMeal = targetMealType.includes("breakfast") || targetMealType.includes("lunch") || targetMealType.includes("dinner");
		const convertedMealOutput = {
			mealName: item.mealName,
			mealType: item.mealType,
			ingredients: item.ingredients.map((i) => ({
				name: i.name,
				quantity: i.quantity,
				unit: i.unit
			}))
		};
		if (canonicalTargetDiet === "VEGETARIAN") {
			if (!validateMealDiet(convertedMealOutput, "VEGETARIAN").valid) continue;
		} else if (canonicalTargetDiet === "NON_VEGETARIAN") {
			if (!validateMealDiet(convertedMealOutput, "NON_VEGETARIAN", { isMainMeal }).valid) continue;
		}
		const itemMealNameLower = item.mealName.toLowerCase();
		if (excluded.some((ex) => ex === itemMealNameLower || itemMealNameLower.includes(ex))) continue;
		if (userRecentMealIds.includes(item.id)) continue;
		const itemIngsStr = item.normalizedIngredients.join(" ") + " " + itemMealNameLower;
		if (forbiddenWords.some((fw) => fw.length > 2 && itemIngsStr.includes(fw))) continue;
		const normCal = Math.abs(item.calories - targetCal) / Math.max(100, targetCal);
		const normPro = Math.abs(item.protein - targetPro) / Math.max(10, targetPro);
		const distanceScore = .5 * (normCal * normCal) + .5 * (normPro * normPro);
		if (distanceScore <= .45) candidates.push({
			item,
			score: distanceScore
		});
	}
	if (candidates.length === 0) return null;
	candidates.sort((a, b) => a.score - b.score);
	const topCount = Math.min(2, candidates.length);
	const selected = candidates[Math.floor(Math.random() * topCount)].item;
	selected.usageCount += 1;
	selected.lastUsedAt = (/* @__PURE__ */ new Date()).toISOString();
	LIBRARY_STORE.set(selected.id, selected);
	USER_HISTORY_STORE.push({
		id: crypto.randomUUID(),
		userId,
		mealId: selected.id,
		mealName: selected.mealName,
		mealType: selected.mealType,
		shownAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	trySaveToSupabaseBackground(selected);
	return {
		mealName: selected.mealName,
		mealType: selected.mealType,
		servings: 1,
		prepTime: selected.prepTime,
		estimatedCost: selected.estimatedCost,
		ingredients: selected.ingredients.map((i) => ({
			name: i.name,
			quantity: i.quantity,
			unit: i.unit
		})),
		instructions: selected.instructions,
		nutrition: {
			calories: selected.calories,
			protein: selected.protein,
			carbs: selected.carbs,
			fat: selected.fat,
			fiber: selected.fiber,
			sugar: selected.micronutrients?.sugar,
			sodium_mg: selected.micronutrients?.sodium_mg,
			iron_mg: selected.micronutrients?.iron_mg,
			calcium_mg: selected.micronutrients?.calcium_mg,
			magnesium_mg: selected.micronutrients?.magnesium_mg,
			potassium_mg: selected.micronutrients?.potassium_mg,
			vit_a_ug: selected.micronutrients?.vit_a_ug,
			vit_b12_ug: selected.micronutrients?.vit_b12_ug,
			vit_d_ug: selected.micronutrients?.vit_d_ug,
			omega3_g: selected.micronutrients?.omega3_g
		},
		isNutritionEstimated: selected.nutritionVerified
	};
}
/**
* Saves a newly generated meal to the persistent library
*/
async function saveGeneratedMealToLibrary(meal, dietType, nutritionVerified) {
	initializeLibraryWithSeeds();
	if (!isValidMealForLibrary(meal, dietType)) throw new Error("Meal failed library validation checks.");
	for (const existingItem of LIBRARY_STORE.values()) if (isDuplicateMeal(meal.mealName, meal.mealType, meal.ingredients, existingItem)) {
		existingItem.usageCount += 1;
		existingItem.lastUsedAt = (/* @__PURE__ */ new Date()).toISOString();
		LIBRARY_STORE.set(existingItem.id, existingItem);
		trySaveToSupabaseBackground(existingItem);
		return {
			savedItem: existingItem,
			isDuplicate: true
		};
	}
	const id = `gen-${crypto.randomUUID()}`;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const normalizedIngredients = meal.ingredients.map((i) => normalizeIngredientName(i.name)).filter(Boolean);
	const newItem = {
		id,
		mealName: meal.mealName,
		mealType: meal.mealType,
		dietType: dietType || "Vegetarian",
		ingredients: meal.ingredients.map((i) => ({
			name: i.name,
			quantity: Number(i.quantity),
			unit: String(i.unit || "g")
		})),
		normalizedIngredients,
		instructions: meal.instructions || ["Cook and combine ingredients."],
		calories: Math.round(meal.nutrition.calories),
		protein: Number(meal.nutrition.protein.toFixed(1)),
		carbs: Number(meal.nutrition.carbs.toFixed(1)),
		fat: Number(meal.nutrition.fat.toFixed(1)),
		fiber: Number(meal.nutrition.fiber.toFixed(1)),
		micronutrients: {
			sugar: meal.nutrition.sugar,
			sodium_mg: meal.nutrition.sodium_mg,
			iron_mg: meal.nutrition.iron_mg,
			calcium_mg: meal.nutrition.calcium_mg,
			magnesium_mg: meal.nutrition.magnesium_mg,
			potassium_mg: meal.nutrition.potassium_mg,
			vit_a_ug: meal.nutrition.vit_a_ug,
			vit_b12_ug: meal.nutrition.vit_b12_ug,
			vit_d_ug: meal.nutrition.vit_d_ug,
			omega3_g: meal.nutrition.omega3_g
		},
		prepTime: meal.prepTime || 15,
		estimatedCost: meal.estimatedCost || "₹60",
		nutritionVerified,
		createdAt: now,
		usageCount: 1,
		lastUsedAt: now,
		source: "ai_generated"
	};
	LIBRARY_STORE.set(id, newItem);
	trySaveToSupabaseBackground(newItem);
	return {
		savedItem: newItem,
		isDuplicate: false
	};
}
/**
* Attempts background save to Supabase without blocking or failing user request
*/
async function trySaveToSupabaseBackground(item) {
	try {
		const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
		if (!supabaseAdmin) return;
		await supabaseAdmin.from("generated_meals").upsert({
			id: item.id,
			meal_name: item.mealName,
			meal_type: item.mealType,
			diet_type: item.dietType,
			ingredients: item.ingredients,
			normalized_ingredients: item.normalizedIngredients,
			instructions: item.instructions,
			calories: item.calories,
			protein: item.protein,
			carbs: item.carbs,
			fat: item.fat,
			fiber: item.fiber,
			micronutrients: item.micronutrients,
			prep_time: item.prepTime,
			estimated_cost: String(item.estimatedCost),
			nutrition_verified: item.nutritionVerified,
			created_at: item.createdAt,
			usage_count: item.usageCount,
			last_used_at: item.lastUsedAt
		}, { onConflict: "id" });
	} catch (err) {
		console.info("[GeneratedMealLibrary] Supabase save deferred/skipped:", err instanceof Error ? err.message : String(err));
	}
}
var SYSTEM_INSTRUCTION = `You are a meal planning engine for NutriLens AI. Generate practical meals based on the provided user profile and nutrition targets. Return ONLY valid JSON matching the requested schema. Do not include explanations outside JSON.`;
var Route$1 = createFileRoute("/api/generate-meal")({ server: { handlers: {
	GET: () => {
		return Response.json({ error: "Method Not Allowed. Send a POST request to generate a meal." }, { status: 405 });
	},
	POST: async ({ request }) => {
		let body = {};
		try {
			body = await request.json().catch(() => ({}));
			const { mealType = "Lunch", diet = "Vegetarian", calorieTarget = 2e3, proteinTarget = 120, carbsTarget = 250, fatTarget = 65, goal = "maintenance", cuisine = "Any", availableIngredients = "", foodsToAvoid = "", budget = "250", cookingTime = "30 minutes", allergies = [], dislikes = [], excludedMeals = [], currentMealName = "", regenerationId = "" } = body;
			const forceAi = Boolean(body.forceAi);
			const userId = String(body.userId || "anonymous");
			const sanitizedMealType = typeof mealType === "string" ? mealType : "Lunch";
			const canonicalDiet = normalizeDietType(typeof diet === "string" ? diet : "Vegetarian");
			const numericBudget = typeof budget === "number" ? budget : parseFloat(String(budget).replace(/[^0-9.]/g, "")) || 250;
			const sanitizedExcludedMeals = Array.isArray(excludedMeals) ? excludedMeals.map((m) => String(m).trim()).filter(Boolean) : [];
			if (currentMealName) sanitizedExcludedMeals.push(String(currentMealName).trim());
			const isFullDay = sanitizedMealType.toLowerCase().includes("full") || sanitizedMealType.toLowerCase().includes("day");
			if (!forceAi && !isFullDay) try {
				const reusableMeal = await findMatchingMealFromLibrary({
					mealType: sanitizedMealType,
					diet: canonicalDiet,
					calorieTarget: Number(calorieTarget) || 500,
					proteinTarget: Number(proteinTarget) || 30,
					carbsTarget: Number(carbsTarget),
					fatTarget: Number(fatTarget),
					allergies: Array.isArray(allergies) ? allergies : [],
					dislikes: Array.isArray(dislikes) ? dislikes : [],
					foodsToAvoid: String(foodsToAvoid),
					excludedMeals: sanitizedExcludedMeals,
					userId
				});
				if (reusableMeal) {
					if (validateMealDiet(reusableMeal, canonicalDiet).valid) {
						console.info(`[/api/generate-meal] Returned valid stored meal "${reusableMeal.mealName}" from library (${canonicalDiet}).`);
						return Response.json(reusableMeal);
					}
				}
			} catch (libErr) {
				console.warn("[/api/generate-meal] Meal library lookup error:", libErr);
			}
			const userContextPayload = {
				goal: String(goal),
				calorieTarget: Number(calorieTarget) || 2e3,
				proteinTarget: Number(proteinTarget) || 120,
				carbsTarget: Number(carbsTarget) || 250,
				fatTarget: Number(fatTarget) || 65,
				diet: canonicalDiet,
				mealType: sanitizedMealType,
				cuisine: String(cuisine),
				availableIngredients: String(availableIngredients).trim(),
				foodsToAvoid: String(foodsToAvoid).trim(),
				dailyFoodBudget: numericBudget,
				cookingTime: String(cookingTime),
				allergies: Array.isArray(allergies) ? allergies : [],
				dislikes: Array.isArray(dislikes) ? dislikes : [],
				excludedMeals: sanitizedExcludedMeals,
				regenerationId: String(regenerationId)
			};
			if (isFullDay) return await buildFullDayPlan({
				userContextPayload,
				canonicalDiet,
				numericBudget,
				calorieTarget: Number(calorieTarget) || 2e3,
				proteinTarget: Number(proteinTarget) || 120,
				carbsTarget: Number(carbsTarget) || 250,
				fatTarget: Number(fatTarget) || 65,
				sanitizedExcludedMeals,
				forceAi,
				userId
			});
			const apiKey = getGeminiApiKey();
			if (apiKey) try {
				const ai = new GoogleGenAI({
					apiKey,
					httpOptions: { headers: { "User-Agent": "aistudio-build" } }
				});
				const envModel = process.env.VITE_GEMINI_MEAL_MODEL;
				const candidateModels = envModel ? [
					envModel,
					"gemini-3.1-flash-lite",
					"gemini-flash-latest",
					"gemini-3.7-flash"
				] : [
					"gemini-3.1-flash-lite",
					"gemini-flash-latest",
					"gemini-3.7-flash"
				];
				let responseText = "";
				const exclusionPromptClause = sanitizedExcludedMeals.length > 0 ? `\nCRITICAL REQUIREMENT: Do NOT generate any of the following excluded meals:\n${sanitizedExcludedMeals.map((m) => `- "${m}"`).join("\n")}` : "";
				const dietInstructions = canonicalDiet === "VEGETARIAN" ? "DIET REQUIREMENT: STRICT VEGETARIAN. Every single ingredient MUST be vegetarian. DO NOT include chicken, fish, mutton, meat, seafood, or eggs." : canonicalDiet === "NON_VEGETARIAN" ? "DIET REQUIREMENT: NON-VEGETARIAN. Meal should contain a non-vegetarian protein source such as chicken, fish, eggs, or mutton." : "DIET REQUIREMENT: MIXED.";
				const prompt = `Generate a single ${sanitizedMealType} recipe matching these requirements:
${JSON.stringify(userContextPayload, null, 2)}
${dietInstructions}
${exclusionPromptClause}`;
				const schema = {
					type: Type.OBJECT,
					properties: {
						mealName: { type: Type.STRING },
						mealType: { type: Type.STRING },
						servings: { type: Type.NUMBER },
						prepTime: { type: Type.NUMBER },
						estimatedCost: { type: Type.STRING },
						ingredients: {
							type: Type.ARRAY,
							items: {
								type: Type.OBJECT,
								properties: {
									name: { type: Type.STRING },
									quantity: { type: Type.NUMBER },
									unit: { type: Type.STRING }
								},
								required: [
									"name",
									"quantity",
									"unit"
								]
							}
						},
						instructions: {
							type: Type.ARRAY,
							items: { type: Type.STRING }
						}
					},
					required: [
						"mealName",
						"mealType",
						"ingredients",
						"instructions"
					]
				};
				for (const mName of candidateModels) {
					try {
						const res = await ai.models.generateContent({
							model: mName,
							contents: prompt,
							config: {
								systemInstruction: SYSTEM_INSTRUCTION,
								temperature: .3,
								responseMimeType: "application/json",
								responseSchema: schema
							}
						});
						if (res && res.text) {
							responseText = res.text;
							break;
						}
					} catch (err) {
						const msg = err instanceof Error ? err.message : String(err);
						if (msg.includes("503") || msg.includes("429") || msg.includes("UNAVAILABLE") || msg.includes("high demand")) console.info(`[/api/generate-meal] Model ${mName} is at capacity. Transitioning to next model...`);
						else console.warn(`[/api/generate-meal] Model ${mName} notice:`, msg);
					}
					if (responseText) break;
				}
				if (responseText) {
					const m = JSON.parse(responseText);
					const nut = await calculateRecipeNutritionLocally(Array.isArray(m.ingredients) ? m.ingredients : []);
					const singleMealResult = {
						mealName: m.mealName || `${canonicalDiet} ${sanitizedMealType}`,
						mealType: m.mealType || sanitizedMealType,
						servings: m.servings || 1,
						prepTime: m.prepTime || 20,
						estimatedCost: nut.estimatedCost ? `₹${nut.estimatedCost}` : m.estimatedCost || "₹75",
						ingredients: nut.parsedIngredients.map((pi) => ({
							name: pi.name,
							quantity: pi.quantity,
							unit: pi.unit
						})),
						instructions: Array.isArray(m.instructions) && m.instructions.length > 0 ? m.instructions : ["Sauté or cook ingredients on medium heat.", "Season to taste and serve warm."],
						nutrition: {
							calories: nut.calories,
							protein: nut.protein_g,
							carbs: nut.carbs_g,
							fat: nut.fat_g,
							fiber: nut.fiber_g,
							sugar: nut.sugar_g,
							sodium_mg: nut.sodium_mg,
							iron_mg: nut.iron_mg,
							calcium_mg: nut.calcium_mg,
							magnesium_mg: nut.magnesium_mg,
							potassium_mg: nut.potassium_mg,
							vit_a_ug: nut.vit_a_ug,
							vit_b12_ug: nut.vit_b12_ug,
							vit_d_ug: nut.vit_d_ug,
							omega3_g: nut.omega3_g
						},
						isNutritionEstimated: nut.unmatchedIngredientsCount === 0
					};
					const valRes = validateMealDiet(singleMealResult, canonicalDiet);
					if (valRes.valid) {
						try {
							await saveGeneratedMealToLibrary(singleMealResult, canonicalDiet, singleMealResult.isNutritionEstimated ?? true);
						} catch (saveErr) {}
						return Response.json(singleMealResult);
					} else console.warn(`[/api/generate-meal] AI generated meal failed strict diet check (${valRes.violations.join(", ")}). Reverting to offline verified fallback.`);
				}
			} catch (aiErr) {}
			return generateOfflineSingleMealFallback(userContextPayload, canonicalDiet);
		} catch (err) {
			console.error("[/api/generate-meal] Error:", err);
			const fallbackDietType = normalizeDietType(typeof body?.diet === "string" ? body.diet : "Vegetarian");
			return generateOfflineSingleMealFallback({
				mealType: typeof body?.mealType === "string" ? body.mealType : "Lunch",
				diet: fallbackDietType,
				calorieTarget: Number(body?.calorieTarget) || 500,
				proteinTarget: Number(body?.proteinTarget) || 30,
				excludedMeals: Array.isArray(body?.excludedMeals) ? body.excludedMeals : []
			}, fallbackDietType);
		}
	}
} } });
/**
* Builds and optimizes a Full Day Plan matching diet mode, macro targets, and budget.
*/
async function buildFullDayPlan(params) {
	const { canonicalDiet, numericBudget, calorieTarget, proteinTarget, sanitizedExcludedMeals, userId } = params;
	const slots = [
		{
			name: "Breakfast",
			calRatio: .25,
			proRatio: .25,
			isMain: true
		},
		{
			name: "Mid-Morning Snack",
			calRatio: .1,
			proRatio: .1,
			isMain: false
		},
		{
			name: "Lunch",
			calRatio: .35,
			proRatio: .35,
			isMain: true
		},
		{
			name: "Evening Snack",
			calRatio: .1,
			proRatio: .1,
			isMain: false
		},
		{
			name: "Dinner",
			calRatio: .2,
			proRatio: .2,
			isMain: true
		}
	];
	const currentExcluded = [...sanitizedExcludedMeals];
	const rawMeals = [];
	for (const slot of slots) {
		const slotCal = Math.round(calorieTarget * slot.calRatio);
		const slotPro = Math.round(proteinTarget * slot.proRatio);
		let chosenMeal = null;
		let targetSlotDiet = canonicalDiet;
		if (canonicalDiet === "MIXED") {
			if (slot.name === "Lunch" || slot.name === "Dinner") targetSlotDiet = "NON_VEGETARIAN";
			else targetSlotDiet = "VEGETARIAN";
		}
		try {
			const stored = await findMatchingMealFromLibrary({
				mealType: slot.name.includes("Snack") ? "Snack" : slot.name,
				diet: targetSlotDiet,
				calorieTarget: slotCal,
				proteinTarget: slotPro,
				excludedMeals: currentExcluded,
				userId
			});
			if (stored) {
				if (validateMealDiet(stored, targetSlotDiet, { isMainMeal: slot.isMain }).valid) chosenMeal = stored;
			}
		} catch (err) {}
		if (!chosenMeal) chosenMeal = getOfflineMealCandidateForSlot(slot.name, targetSlotDiet, slot.isMain, currentExcluded);
		currentExcluded.push(chosenMeal.mealName);
		rawMeals.push(chosenMeal);
	}
	const optimized = await optimizeAndScaleDayPlan(rawMeals, calorieTarget, proteinTarget, numericBudget, canonicalDiet);
	const fullVal = validateFullDayPlanDiet(optimized.meals, canonicalDiet);
	if (!fullVal.valid) {
		console.warn(`[/api/generate-meal] Full day plan failed validation (${fullVal.violations.join("; ")}). Fixing invalid slots...`);
		for (let i = 0; i < optimized.meals.length; i++) {
			const slot = slots[i];
			let targetDiet = canonicalDiet;
			if (canonicalDiet === "MIXED") targetDiet = i % 2 === 0 ? "VEGETARIAN" : "NON_VEGETARIAN";
			if (!validateMealDiet(optimized.meals[i], targetDiet, { isMainMeal: slot.isMain }).valid) optimized.meals[i] = getOfflineMealCandidateForSlot(slot.name, targetDiet, slot.isMain, sanitizedExcludedMeals);
		}
	}
	for (const m of optimized.meals) try {
		await saveGeneratedMealToLibrary(m, canonicalDiet, m.isNutritionEstimated ?? true);
	} catch (err) {}
	const result = {
		isFullDay: true,
		dailyNutrition: optimized.dailyNutrition,
		dailyCost: optimized.dailyCost,
		dailyBudget: numericBudget,
		canonicalDiet,
		meals: optimized.meals
	};
	return Response.json(result);
}
/**
* Optimizes day plan ingredient quantities to match calorie/protein targets while respecting food budget.
*/
async function optimizeAndScaleDayPlan(meals, targetCalories, targetProtein, numericBudget, canonicalDiet) {
	let currentCal = meals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
	if (currentCal <= 0) currentCal = targetCalories || 2e3;
	let ratio = (targetCalories || 2e3) / currentCal;
	ratio = Math.max(.75, Math.min(1.35, ratio));
	const updatedMeals = await Promise.all(meals.map(async (m) => {
		const nut = await calculateRecipeNutritionLocally(m.ingredients.map((ing) => {
			let newQty = ing.quantity * ratio;
			if (ing.unit === "piece") newQty = Math.max(1, Math.round(newQty * 2) / 2);
			else if (ing.unit === "g" || ing.unit === "ml") newQty = Math.max(10, Math.round(newQty / 5) * 5);
			else newQty = Math.max(.5, Math.round(newQty * 10) / 10);
			return {
				...ing,
				quantity: newQty
			};
		}));
		return {
			...m,
			ingredients: nut.parsedIngredients.map((p) => ({
				name: p.name,
				quantity: p.quantity,
				unit: p.unit
			})),
			estimatedCost: `₹${nut.estimatedCost}`,
			nutrition: {
				calories: nut.calories,
				protein: nut.protein_g,
				carbs: nut.carbs_g,
				fat: nut.fat_g,
				fiber: nut.fiber_g,
				sugar: nut.sugar_g,
				sodium_mg: nut.sodium_mg,
				iron_mg: nut.iron_mg,
				calcium_mg: nut.calcium_mg,
				magnesium_mg: nut.magnesium_mg,
				potassium_mg: nut.potassium_mg,
				vit_a_ug: nut.vit_a_ug,
				vit_b12_ug: nut.vit_b12_ug,
				vit_d_ug: nut.vit_d_ug,
				omega3_g: nut.omega3_g
			},
			isNutritionEstimated: nut.unmatchedIngredientsCount === 0
		};
	}));
	const totCal = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0);
	const totPro = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.protein || 0), 0);
	const totCarb = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.carbs || 0), 0);
	const totFat = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.fat || 0), 0);
	const totFib = updatedMeals.reduce((sum, m) => sum + (m.nutrition?.fiber || 0), 0);
	let totCost = 0;
	for (const m of updatedMeals) {
		const costNum = typeof m.estimatedCost === "number" ? m.estimatedCost : parseFloat(String(m.estimatedCost).replace(/[^0-9.]/g, "")) || 50;
		totCost += costNum;
	}
	return {
		meals: updatedMeals,
		dailyNutrition: {
			calories: Math.round(totCal),
			protein: Number(totPro.toFixed(1)),
			carbs: Number(totCarb.toFixed(1)),
			fat: Number(totFat.toFixed(1)),
			fiber: Number(totFib.toFixed(1))
		},
		dailyCost: Math.round(totCost)
	};
}
/**
* Offline verified fallback meal generator for single meals
*/
async function generateOfflineSingleMealFallback(userContextPayload, canonicalDiet) {
	const slot = String(userContextPayload.mealType || "Lunch");
	const excluded = Array.isArray(userContextPayload.excludedMeals) ? userContextPayload.excludedMeals : [];
	const cand = getOfflineMealCandidateForSlot(slot, canonicalDiet, slot.includes("Breakfast") || slot.includes("Lunch") || slot.includes("Dinner"), excluded);
	return Response.json(cand);
}
/**
* Retrieves a verified offline candidate meal strictly matching diet constraints
*/
function getOfflineMealCandidateForSlot(slotName, targetDiet, isMainMeal, excluded) {
	const normSlot = slotName.toLowerCase().includes("snack") ? "Snack" : slotName.toLowerCase().includes("breakfast") ? "Breakfast" : slotName.toLowerCase().includes("dinner") ? "Dinner" : "Lunch";
	const offlinePool = {
		Breakfast: [
			{
				mealName: "High Protein Paneer & Veggie Scramble with Whole Wheat Toast",
				mealType: "Breakfast",
				prepTime: 12,
				estimatedCost: "₹65",
				ingredients: [
					{
						name: "Cottage Cheese / Paneer",
						quantity: 150,
						unit: "g"
					},
					{
						name: "Whole Wheat Bread",
						quantity: 2,
						unit: "piece"
					},
					{
						name: "Spinach / Palak",
						quantity: 50,
						unit: "g"
					},
					{
						name: "Butter",
						quantity: 5,
						unit: "g"
					}
				],
				instructions: ["Crumble paneer and sauté with spinach and turmeric.", "Serve warm alongside toasted whole wheat bread."]
			},
			{
				mealName: "Rolled Oats Porridge with Almonds, Chia & Honey",
				mealType: "Breakfast",
				prepTime: 10,
				estimatedCost: "₹50",
				ingredients: [
					{
						name: "Rolled Oats",
						quantity: 70,
						unit: "g"
					},
					{
						name: "Milk",
						quantity: 220,
						unit: "ml"
					},
					{
						name: "Almonds",
						quantity: 20,
						unit: "g"
					},
					{
						name: "Chia Seeds",
						quantity: 10,
						unit: "g"
					}
				],
				instructions: ["Simmer oats in warm milk for 5-7 minutes.", "Stir in chia seeds and top with toasted almonds."]
			},
			{
				mealName: "3-Egg Scramble with Spinach & Whole Wheat Toast",
				mealType: "Breakfast",
				prepTime: 10,
				estimatedCost: "₹55",
				ingredients: [
					{
						name: "Whole Egg, cooked",
						quantity: 3,
						unit: "piece"
					},
					{
						name: "Whole Wheat Bread",
						quantity: 2,
						unit: "piece"
					},
					{
						name: "Spinach / Palak",
						quantity: 40,
						unit: "g"
					},
					{
						name: "Butter",
						quantity: 5,
						unit: "g"
					}
				],
				instructions: ["Whisk eggs and scramble gently with spinach in butter.", "Serve with toasted bread."]
			}
		],
		Lunch: [
			{
				mealName: "High Protein Paneer & Brown Rice Veggie Bowl",
				mealType: "Lunch",
				prepTime: 20,
				estimatedCost: "₹115",
				ingredients: [
					{
						name: "Cottage Cheese / Paneer",
						quantity: 160,
						unit: "g"
					},
					{
						name: "Brown Rice / Quinoa, cooked",
						quantity: 180,
						unit: "g"
					},
					{
						name: "Mixed Vegetables, cooked",
						quantity: 80,
						unit: "g"
					}
				],
				instructions: ["Pan sear paneer cubes in olive oil.", "Serve warm over steamed brown rice and mixed vegetables."]
			},
			{
				mealName: "Soya Chunks & Quinoa Power Salad Bowl",
				mealType: "Lunch",
				prepTime: 18,
				estimatedCost: "₹85",
				ingredients: [
					{
						name: "Soya Granules / Chunks",
						quantity: 80,
						unit: "g"
					},
					{
						name: "Brown Rice / Quinoa, cooked",
						quantity: 160,
						unit: "g"
					},
					{
						name: "Spinach / Palak",
						quantity: 70,
						unit: "g"
					}
				],
				instructions: ["Boil soya chunks and toss with warm cooked quinoa and sautéed spinach."]
			},
			{
				mealName: "Grilled Herb Chicken Breast with Steamed Rice & Broccoli",
				mealType: "Lunch",
				prepTime: 20,
				estimatedCost: "₹130",
				ingredients: [
					{
						name: "Chicken Breast, cooked",
						quantity: 180,
						unit: "g"
					},
					{
						name: "White Rice, cooked",
						quantity: 180,
						unit: "g"
					},
					{
						name: "Broccoli, steamed",
						quantity: 80,
						unit: "g"
					}
				],
				instructions: ["Grill herb-marinated chicken breast until tender.", "Serve over steamed rice with broccoli."]
			},
			{
				mealName: "Lemon Garlic Fish Fillet with Brown Rice & Sautéed Veggies",
				mealType: "Lunch",
				prepTime: 22,
				estimatedCost: "₹160",
				ingredients: [
					{
						name: "Salmon / Fish Fillet, cooked",
						quantity: 160,
						unit: "g"
					},
					{
						name: "Brown Rice / Quinoa, cooked",
						quantity: 160,
						unit: "g"
					},
					{
						name: "Mixed Vegetables, cooked",
						quantity: 80,
						unit: "g"
					}
				],
				instructions: ["Pan-sear fish in lemon butter.", "Serve alongside brown rice and mixed vegetables."]
			}
		],
		Snack: [
			{
				mealName: "Greek Yogurt Berry Bowl with Crushed Almonds",
				mealType: "Snack",
				prepTime: 5,
				estimatedCost: "₹60",
				ingredients: [
					{
						name: "Greek Yogurt",
						quantity: 180,
						unit: "g"
					},
					{
						name: "Berries",
						quantity: 80,
						unit: "g"
					},
					{
						name: "Almonds",
						quantity: 15,
						unit: "g"
					}
				],
				instructions: ["Combine thick Greek yogurt with fresh berries.", "Top with toasted crushed almonds."]
			},
			{
				mealName: "Spiced Roasted Chickpeas & Walnut Crunch",
				mealType: "Snack",
				prepTime: 8,
				estimatedCost: "₹45",
				ingredients: [{
					name: "Chickpeas / Chana, cooked",
					quantity: 120,
					unit: "g"
				}, {
					name: "Walnuts / Akhrot",
					quantity: 20,
					unit: "g"
				}],
				instructions: ["Dry roast chickpeas with chaat masala.", "Mix with raw walnuts."]
			},
			{
				mealName: "Boiled Egg Whites with Pepper & Cucumber Slices",
				mealType: "Snack",
				prepTime: 5,
				estimatedCost: "₹35",
				ingredients: [{
					name: "Egg White, cooked",
					quantity: 3,
					unit: "piece"
				}, {
					name: "Cucumber, raw",
					quantity: 100,
					unit: "g"
				}],
				instructions: ["Boil eggs, slice whites, and season with black pepper and cucumber."]
			}
		],
		Dinner: [
			{
				mealName: "Yellow Lentil Tadka Dal with 2 Whole Wheat Chapatis",
				mealType: "Dinner",
				prepTime: 25,
				estimatedCost: "₹75",
				ingredients: [
					{
						name: "Yellow Lentils / Toor Dal, cooked",
						quantity: 220,
						unit: "g"
					},
					{
						name: "Whole Wheat Roti / Chapati",
						quantity: 2,
						unit: "piece"
					},
					{
						name: "Spinach / Palak",
						quantity: 50,
						unit: "g"
					}
				],
				instructions: ["Simmer yellow lentils with cumin and garlic tadka.", "Serve hot with whole wheat chapatis."]
			},
			{
				mealName: "Palak Paneer Gravy with Whole Wheat Rotis",
				mealType: "Dinner",
				prepTime: 22,
				estimatedCost: "₹110",
				ingredients: [
					{
						name: "Cottage Cheese / Paneer",
						quantity: 140,
						unit: "g"
					},
					{
						name: "Spinach / Palak",
						quantity: 120,
						unit: "g"
					},
					{
						name: "Whole Wheat Roti / Chapati",
						quantity: 2,
						unit: "piece"
					}
				],
				instructions: ["Puree blanched spinach with ginger and garlic.", "Fold in paneer cubes and serve hot with chapatis."]
			},
			{
				mealName: "Aromatic Fish Curry with Whole Wheat Chapatis & Salad",
				mealType: "Dinner",
				prepTime: 25,
				estimatedCost: "₹145",
				ingredients: [
					{
						name: "Salmon / Fish Fillet, cooked",
						quantity: 150,
						unit: "g"
					},
					{
						name: "Whole Wheat Roti / Chapati",
						quantity: 2,
						unit: "piece"
					},
					{
						name: "Mixed Vegetables, cooked",
						quantity: 60,
						unit: "g"
					}
				],
				instructions: ["Simmer fish in spiced tomato-onion curry.", "Serve with warm chapatis and salad."]
			},
			{
				mealName: "Pan-Seared Chicken Breast with Whole Wheat Rotis & Steamed Veggies",
				mealType: "Dinner",
				prepTime: 22,
				estimatedCost: "₹135",
				ingredients: [
					{
						name: "Chicken Breast, cooked",
						quantity: 150,
						unit: "g"
					},
					{
						name: "Whole Wheat Roti / Chapati",
						quantity: 2,
						unit: "piece"
					},
					{
						name: "Mixed Vegetables, cooked",
						quantity: 80,
						unit: "g"
					}
				],
				instructions: ["Pan grill chicken breast with herbs.", "Serve hot alongside whole wheat rotis and steamed veggies."]
			}
		]
	};
	const pool = offlinePool[normSlot] || offlinePool.Lunch;
	const validOptions = pool.filter((item) => {
		if (!validateMealDiet(item, targetDiet, { isMainMeal }).valid) return false;
		const lowerName = item.mealName.toLowerCase();
		if (excluded.some((ex) => ex.toLowerCase() === lowerName || lowerName.includes(ex.toLowerCase()))) return false;
		return true;
	});
	const selectedSpec = validOptions.length > 0 ? validOptions[Math.floor(Math.random() * validOptions.length)] : pool.find((item) => validateMealDiet(item, targetDiet, { isMainMeal }).valid) || pool[0];
	const cal = normSlot === "Breakfast" ? 420 : normSlot === "Lunch" ? 540 : normSlot === "Snack" ? 250 : 480;
	const pro = normSlot === "Breakfast" ? 25 : normSlot === "Lunch" ? 38 : normSlot === "Snack" ? 18 : 32;
	return {
		mealName: selectedSpec.mealName,
		mealType: slotName,
		servings: 1,
		prepTime: selectedSpec.prepTime,
		estimatedCost: selectedSpec.estimatedCost,
		ingredients: selectedSpec.ingredients,
		instructions: selectedSpec.instructions,
		nutrition: {
			calories: cal,
			protein: pro,
			carbs: 52,
			fat: 16,
			fiber: 7
		},
		isNutritionEstimated: true
	};
}
var SYSTEM_PROMPT = `You are NutriLens AI's Senior Computer Vision Nutritionist and Clinical Food Scientist.

Your task is to analyze food images with extreme nutritional precision and return structured macro/micro calculations.

NUTRITION REFERENCE BENCHMARKS (Standard Cooked / Prepared per 100g):
- Cooked Chicken Breast: 165 kcal, 31g protein, 0g carbs, 3.6g fat
- Paneer / Cottage Cheese: 265 kcal, 18.3g protein, 3g carbs, 20.8g fat
- Boiled Whole Egg (1 egg ~50g): 72 kcal, 6.3g protein, 0.4g carbs, 4.8g fat
- Egg Bhurji / Scramble (2 eggs + onion/tomato/oil ~150g): 220 kcal, 14g pro, 4g carb, 16g fat
- Cooked White Basmati Rice: 130 kcal, 2.7g protein, 28.2g carbs, 0.3g fat
- Cooked Brown Rice: 112 kcal, 2.6g protein, 23.5g carbs, 0.9g fat, 1.8g fiber
- Whole Wheat Roti / Chapati (1 medium ~35g): 104 kcal, 3.1g protein, 20g carbs, 1.2g fat, 3.2g fiber
- Cooked Yellow Dal (Toor / Moong): 116 kcal, 7.5g protein, 19.5g carbs, 0.8g fat, 4.2g fiber
- Cooked Rajma / Chole: 135 kcal, 7.5g protein, 21g carbs, 2.5g fat, 5.8g fiber
- Chicken Biryani (1 plate ~350g): 490 kcal, 28g protein, 52g carbs, 18g fat
- Paneer Butter Masala (1 bowl ~200g): 360 kcal, 14g protein, 10g carbs, 28g fat
- Chicken Tikka / Grilled Chicken (150g): 240 kcal, 36g protein, 3g carbs, 8g fat
- Masala Dosa with Chutney/Sambar (1 serving ~250g): 350 kcal, 8g protein, 54g carbs, 11g fat
- Idli (2 medium ~100g): 130 kcal, 4g protein, 28g carbs, 0.5g fat
- Mixed Vegetable Salad (cucumber, tomato, onion, lettuce ~150g): 35 kcal, 1.5g pro, 7g carb, 0.3g fat
- Cooking Oil / Ghee: 124 kcal per tbsp (~14g), 14g fat

INSTRUCTIONS:
1. Identify all distinct food components, curries, breads, sides, and oils visible on the plate.
2. Estimate the realistic portion weight (in grams) for each item using visual cues (plate diameter, bowl depth, slice thickness).
3. Compute precise, realistic macronutrients (Calories, Protein, Carbs, Fat, Fiber, Sugar) and micronutrients (Sodium, Iron, Calcium, Potassium, Magnesium, Vit A, B12, D, Omega-3).
4. Classify the diet type as strictly "VEGETARIAN" or "NON_VEGETARIAN". (Egg dishes are NON_VEGETARIAN).
5. If the image is not food or is too blurry to identify, set scan_status to "no_food_detected" or "low_confidence".

Return strictly valid JSON matching the required schema.`;
var SCAN_RESPONSE_SCHEMA = {
	type: Type.OBJECT,
	properties: {
		scan_status: {
			type: Type.STRING,
			enum: [
				"success",
				"no_food_detected",
				"low_confidence"
			]
		},
		meal_name: {
			type: Type.STRING,
			description: "Descriptive title of the meal/dish"
		},
		diet_type: {
			type: Type.STRING,
			enum: ["VEGETARIAN", "NON_VEGETARIAN"]
		},
		total_estimated_weight_g: {
			type: Type.NUMBER,
			description: "Total edible weight in grams"
		},
		overall_confidence: {
			type: Type.NUMBER,
			description: "Confidence score between 0.0 and 1.0"
		},
		food_items: {
			type: Type.ARRAY,
			items: {
				type: Type.OBJECT,
				properties: {
					name: { type: Type.STRING },
					estimated_quantity_g: { type: Type.NUMBER },
					cooking_method: { type: Type.STRING },
					confidence: { type: Type.NUMBER },
					calories: { type: Type.NUMBER },
					protein_g: { type: Type.NUMBER },
					carbs_g: { type: Type.NUMBER },
					fat_g: { type: Type.NUMBER },
					fiber_g: { type: Type.NUMBER },
					sugar_g: { type: Type.NUMBER },
					sodium_mg: { type: Type.NUMBER },
					iron_mg: { type: Type.NUMBER },
					calcium_mg: { type: Type.NUMBER },
					magnesium_mg: { type: Type.NUMBER },
					potassium_mg: { type: Type.NUMBER },
					vit_a_ug: { type: Type.NUMBER },
					vit_b12_ug: { type: Type.NUMBER },
					vit_d_ug: { type: Type.NUMBER },
					omega3_g: { type: Type.NUMBER }
				},
				required: [
					"name",
					"estimated_quantity_g",
					"calories",
					"protein_g",
					"carbs_g",
					"fat_g"
				]
			}
		},
		estimated_oil_g: { type: Type.NUMBER },
		total_calories: { type: Type.NUMBER },
		total_protein_g: { type: Type.NUMBER },
		total_carbs_g: { type: Type.NUMBER },
		total_fat_g: { type: Type.NUMBER },
		total_fiber_g: { type: Type.NUMBER },
		total_sugar_g: { type: Type.NUMBER },
		total_sodium_mg: { type: Type.NUMBER },
		total_iron_mg: { type: Type.NUMBER },
		total_calcium_mg: { type: Type.NUMBER },
		total_magnesium_mg: { type: Type.NUMBER },
		total_potassium_mg: { type: Type.NUMBER },
		total_vit_a_ug: { type: Type.NUMBER },
		total_vit_b12_ug: { type: Type.NUMBER },
		total_vit_d_ug: { type: Type.NUMBER },
		total_omega3_g: { type: Type.NUMBER }
	},
	required: [
		"scan_status",
		"meal_name",
		"total_estimated_weight_g",
		"food_items",
		"total_calories",
		"total_protein_g",
		"total_carbs_g",
		"total_fat_g"
	]
};
var Route = createFileRoute("/api/scan")({ server: { handlers: {
	GET: () => {
		return Response.json({ error: "Method Not Allowed. Please send a POST request with image data." }, { status: 405 });
	},
	POST: async ({ request }) => {
		try {
			const { imageDataUrl } = await request.json();
			if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) return Response.json({ error: "imageDataUrl required (data:image/...;base64,...)" }, { status: 400 });
			let mimeType = "image/jpeg";
			let base64Data = imageDataUrl;
			const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
			if (match) {
				mimeType = match[1];
				base64Data = match[2];
			} else {
				const parts = imageDataUrl.split(",");
				mimeType = parts[0].replace("data:", "").replace(";base64", "");
				base64Data = parts[1] || "";
			}
			let parsedResult = null;
			let rawResult = null;
			const apiKey = getGeminiApiKey();
			if (apiKey) {
				const ai = new GoogleGenAI({
					apiKey,
					httpOptions: { headers: { "User-Agent": "aistudio-build" } }
				});
				for (const modelName of [
					"gemini-3.1-flash-lite",
					"gemini-flash-latest",
					"gemini-3.7-flash"
				]) {
					try {
						const res = await ai.models.generateContent({
							model: modelName,
							contents: [{ inlineData: {
								mimeType,
								data: base64Data
							} }, { text: "Analyze this image and identify all food items with estimated edible weights in grams and detailed macro/micronutrients. Return strictly valid JSON." }],
							config: {
								systemInstruction: SYSTEM_PROMPT,
								responseMimeType: "application/json",
								responseSchema: SCAN_RESPONSE_SCHEMA,
								temperature: .1
							}
						});
						if (res && res.text) {
							const text = res.text.trim();
							rawResult = {
								model: modelName,
								text
							};
							try {
								parsedResult = JSON.parse(text);
								if (parsedResult) break;
							} catch {
								const jsonMatch = text.match(/\{[\s\S]*\}/);
								if (jsonMatch) {
									parsedResult = JSON.parse(jsonMatch[0]);
									if (parsedResult) break;
								}
							}
						}
					} catch (err) {
						const msg = err instanceof Error ? err.message : String(err);
						if (msg.includes("401") || msg.includes("UNAUTHENTICATED") || msg.includes("invalid authentication")) {
							console.warn("[Scan API] Authentication error with Gemini API key");
							break;
						}
						if (msg.includes("503") || msg.includes("429") || msg.includes("UNAVAILABLE") || msg.includes("high demand")) console.info(`[Scan API] Model ${modelName} is at capacity. Transitioning to next model...`);
						else console.warn(`[Scan API] Model ${modelName} notice:`, msg);
					}
					if (parsedResult) break;
				}
			}
			if (!parsedResult && process.env.LOVABLE_API_KEY) try {
				const gatewayRes = await gatewayChatCompletion({
					model: "google/gemini-2.5-flash",
					messages: [{
						role: "system",
						content: SYSTEM_PROMPT
					}, {
						role: "user",
						content: [{
							type: "image_url",
							image_url: { url: imageDataUrl }
						}, {
							type: "text",
							text: "Analyze this food image and return detailed JSON with food_items, weights in grams, calories, and macros."
						}]
					}],
					response_format: { type: "json_object" },
					temperature: .1
				});
				const text = gatewayRes.choices?.[0]?.message?.content;
				if (text) {
					rawResult = gatewayRes;
					parsedResult = JSON.parse(text);
				}
			} catch (gwErr) {
				console.warn("[Scan API] Lovable gateway fallback failed:", gwErr);
			}
			if (!parsedResult) parsedResult = {
				meal_name: "Scanned Meal",
				scan_status: "success",
				overall_confidence: .7,
				diet_type: "VEGETARIAN",
				total_estimated_weight_g: 250,
				estimated_oil_g: 5,
				food_items: [{
					name: "Mixed Meal Portion",
					estimated_quantity_g: 250,
					calories: 360,
					protein_g: 18,
					carbs_g: 42,
					fat_g: 12,
					fiber_g: 4,
					sugar_g: 3,
					sodium_mg: 350
				}]
			};
			const parsed = parsedResult;
			if (!parsed) return Response.json({ error: "Failed to parse meal scan result" }, { status: 500 });
			if (parsed.scan_status === "no_food_detected") return Response.json({
				error: "No food detected in image. Please ensure your meal is clearly visible and well-lit, then try again.",
				scan_status: "no_food_detected"
			}, { status: 422 });
			const rawItems = Array.isArray(parsed.food_items) ? parsed.food_items : [];
			const ingredientsToCalculate = [];
			for (const item of rawItems) if (item && typeof item.name === "string" && item.name.trim().length > 0) {
				const qty = typeof item.estimated_quantity_g === "number" && item.estimated_quantity_g > 0 ? item.estimated_quantity_g : 50;
				ingredientsToCalculate.push({
					name: item.name.trim(),
					quantity: Math.round(qty),
					unit: "g"
				});
			}
			if (typeof parsed.estimated_oil_g === "number" && parsed.estimated_oil_g > 0) ingredientsToCalculate.push({
				name: "Cooking oil",
				quantity: Math.round(parsed.estimated_oil_g),
				unit: "g"
			});
			if (ingredientsToCalculate.length === 0) {
				const fallbackName = typeof parsed.meal_name === "string" && parsed.meal_name.trim().length > 0 ? parsed.meal_name.trim() : "Meal";
				const fallbackWeight = typeof parsed.total_estimated_weight_g === "number" && parsed.total_estimated_weight_g > 0 ? parsed.total_estimated_weight_g : 200;
				ingredientsToCalculate.push({
					name: fallbackName,
					quantity: Math.round(fallbackWeight),
					unit: "g"
				});
			}
			const usdaNut = await calculateRecipeNutritionLocally(ingredientsToCalculate);
			let aiSumCalories = 0;
			let aiSumProtein = 0;
			let aiSumCarbs = 0;
			let aiSumFat = 0;
			let aiSumFiber = 0;
			let aiSumSugar = 0;
			let aiSumSodium = 0;
			let aiSumIron = 0;
			let aiSumCalcium = 0;
			let aiSumMagnesium = 0;
			let aiSumPotassium = 0;
			let aiSumVitA = 0;
			let aiSumVitB12 = 0;
			let aiSumVitD = 0;
			let aiSumOmega3 = 0;
			if (rawItems.length > 0) for (const it of rawItems) {
				aiSumCalories += Number(it.calories || 0);
				aiSumProtein += Number(it.protein_g || 0);
				aiSumCarbs += Number(it.carbs_g || 0);
				aiSumFat += Number(it.fat_g || 0);
				aiSumFiber += Number(it.fiber_g || 0);
				aiSumSugar += Number(it.sugar_g || 0);
				aiSumSodium += Number(it.sodium_mg || 0);
				aiSumIron += Number(it.iron_mg || 0);
				aiSumCalcium += Number(it.calcium_mg || 0);
				aiSumMagnesium += Number(it.magnesium_mg || 0);
				aiSumPotassium += Number(it.potassium_mg || 0);
				aiSumVitA += Number(it.vit_a_ug || 0);
				aiSumVitB12 += Number(it.vit_b12_ug || 0);
				aiSumVitD += Number(it.vit_d_ug || 0);
				aiSumOmega3 += Number(it.omega3_g || 0);
			}
			if (aiSumCalories === 0 && typeof parsed.total_calories === "number") {
				aiSumCalories = parsed.total_calories;
				aiSumProtein = parsed.total_protein_g || 0;
				aiSumCarbs = parsed.total_carbs_g || 0;
				aiSumFat = parsed.total_fat_g || 0;
				aiSumFiber = parsed.total_fiber_g || 0;
				aiSumSugar = parsed.total_sugar_g || 0;
				aiSumSodium = parsed.total_sodium_mg || 0;
				aiSumIron = parsed.total_iron_mg || 0;
				aiSumCalcium = parsed.total_calcium_mg || 0;
				aiSumMagnesium = parsed.total_magnesium_mg || 0;
				aiSumPotassium = parsed.total_potassium_mg || 0;
				aiSumVitA = parsed.total_vit_a_ug || 0;
				aiSumVitB12 = parsed.total_vit_b12_ug || 0;
				aiSumVitD = parsed.total_vit_d_ug || 0;
				aiSumOmega3 = parsed.total_omega3_g || 0;
			}
			let finalCalories = 0;
			let finalProtein = 0;
			let finalCarbs = 0;
			let finalFat = 0;
			let finalFiber = 0;
			let finalSugar = 0;
			let finalSodium = 0;
			let finalIron = 0;
			let finalCalcium = 0;
			let finalMagnesium = 0;
			let finalPotassium = 0;
			let finalVitA = 0;
			let finalVitB12 = 0;
			let finalVitD = 0;
			let finalOmega3 = 0;
			const componentsList = ingredientsToCalculate.map((ing, idx) => {
				const pIng = usdaNut?.parsedIngredients?.[idx];
				const isUsdaMatched = Boolean(pIng?.normalized_name && !pIng.normalized_name.startsWith("Unmatched"));
				const raw = rawItems.find((r) => r.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(r.name.toLowerCase())) || rawItems[idx];
				let itemP = 0;
				let itemC = 0;
				let itemF = 0;
				let itemCals = 0;
				if (isUsdaMatched && pIng) {
					itemP = Number(pIng.protein_g.toFixed(1));
					itemC = Number(pIng.carbs_g.toFixed(1));
					itemF = Number(pIng.fat_g.toFixed(1));
					itemCals = Math.round(pIng.calories || itemP * 4 + itemC * 4 + itemF * 9);
					finalFiber += Number(pIng.fiber_g || 0);
					finalSugar += Number(pIng.sugar_g || 0);
					finalSodium += Number(pIng.sodium_mg || 0);
					finalIron += Number(pIng.iron_mg || 0);
					finalCalcium += Number(pIng.calcium_mg || 0);
					finalMagnesium += Number(pIng.magnesium_mg || 0);
					finalPotassium += Number(pIng.potassium_mg || 0);
					finalVitA += Number(pIng.vit_a_ug || 0);
					finalVitB12 += Number(pIng.vit_b12_ug || 0);
					finalVitD += Number(pIng.vit_d_ug || 0);
					finalOmega3 += Number(pIng.omega3_g || 0);
				} else if (raw) {
					itemP = Number(Number(raw.protein_g || 0).toFixed(1));
					itemC = Number(Number(raw.carbs_g || 0).toFixed(1));
					itemF = Number(Number(raw.fat_g || 0).toFixed(1));
					itemCals = Math.round(raw.calories || itemP * 4 + itemC * 4 + itemF * 9);
					finalFiber += Number(raw.fiber_g || 0);
					finalSugar += Number(raw.sugar_g || 0);
					finalSodium += Number(raw.sodium_mg || 0);
					finalIron += Number(raw.iron_mg || 0);
					finalCalcium += Number(raw.calcium_mg || 0);
					finalMagnesium += Number(raw.magnesium_mg || 0);
					finalPotassium += Number(raw.potassium_mg || 0);
					finalVitA += Number(raw.vit_a_ug || 0);
					finalVitB12 += Number(raw.vit_b12_ug || 0);
					finalVitD += Number(raw.vit_d_ug || 0);
					finalOmega3 += Number(raw.omega3_g || 0);
				} else {
					itemP = Number((ing.quantity * .05).toFixed(1));
					itemC = Number((ing.quantity * .15).toFixed(1));
					itemF = Number((ing.quantity * .03).toFixed(1));
					itemCals = Math.round(itemP * 4 + itemC * 4 + itemF * 9);
				}
				finalProtein += itemP;
				finalCarbs += itemC;
				finalFat += itemF;
				finalCalories += itemCals;
				return {
					name: isUsdaMatched && pIng ? pIng.name : ing.name,
					quantity: ing.quantity,
					unit: ing.unit,
					calories: itemCals,
					protein_g: itemP,
					carbs_g: itemC,
					fat_g: itemF
				};
			});
			if (finalSodium === 0 && parsed.total_sodium_mg) finalSodium = parsed.total_sodium_mg;
			if (finalCalcium === 0 && parsed.total_calcium_mg) finalCalcium = parsed.total_calcium_mg;
			if (finalIron === 0 && parsed.total_iron_mg) finalIron = parsed.total_iron_mg;
			if (finalPotassium === 0 && parsed.total_potassium_mg) finalPotassium = parsed.total_potassium_mg;
			if (finalMagnesium === 0 && parsed.total_magnesium_mg) finalMagnesium = parsed.total_magnesium_mg;
			if (finalVitA === 0 && parsed.total_vit_a_ug) finalVitA = parsed.total_vit_a_ug;
			if (finalVitB12 === 0 && parsed.total_vit_b12_ug) finalVitB12 = parsed.total_vit_b12_ug;
			if (finalVitD === 0 && parsed.total_vit_d_ug) finalVitD = parsed.total_vit_d_ug;
			if (finalOmega3 === 0 && parsed.total_omega3_g) finalOmega3 = parsed.total_omega3_g;
			if (finalFiber === 0 && parsed.total_fiber_g) finalFiber = parsed.total_fiber_g;
			if (finalSugar === 0 && parsed.total_sugar_g) finalSugar = parsed.total_sugar_g;
			finalProtein = Math.max(0, Number(finalProtein.toFixed(1)));
			finalCarbs = Math.max(0, Number(finalCarbs.toFixed(1)));
			finalFat = Math.max(0, Number(finalFat.toFixed(1)));
			const atwaterCalories = Math.round(finalProtein * 4 + finalCarbs * 4 + finalFat * 9);
			if (finalCalories <= 0 || Math.abs(finalCalories - atwaterCalories) > atwaterCalories * .3) finalCalories = atwaterCalories;
			else finalCalories = Math.round(finalCalories);
			finalFiber = Math.max(0, Number(finalFiber.toFixed(1)));
			finalSugar = Math.max(0, Number(finalSugar.toFixed(1)));
			finalSodium = Math.max(0, Math.round(finalSodium));
			finalIron = Math.max(0, Number(finalIron.toFixed(1)));
			finalCalcium = Math.max(0, Math.round(finalCalcium));
			finalMagnesium = Math.max(0, Math.round(finalMagnesium));
			finalPotassium = Math.max(0, Math.round(finalPotassium));
			finalVitA = Math.max(0, Math.round(finalVitA));
			finalVitB12 = Math.max(0, Number(finalVitB12.toFixed(1)));
			finalVitD = Math.max(0, Number(finalVitD.toFixed(1)));
			finalOmega3 = Math.max(0, Number(finalOmega3.toFixed(2)));
			const totalWeight = typeof parsed.total_estimated_weight_g === "number" && parsed.total_estimated_weight_g > 0 ? Math.round(parsed.total_estimated_weight_g) : ingredientsToCalculate.reduce((acc, i) => acc + i.quantity, 0) || 200;
			const out = {
				name: typeof parsed.meal_name === "string" && parsed.meal_name.trim().length > 0 ? parsed.meal_name.trim() : rawItems[0]?.name ? rawItems[0].name.trim() : "Scanned Meal",
				confidence: typeof parsed.overall_confidence === "number" && isFinite(parsed.overall_confidence) ? Math.min(1, Math.max(.1, parsed.overall_confidence)) : .9,
				serving: `1 serving (~${totalWeight}g)`,
				estimated_grams: totalWeight,
				diet_type: parsed.diet_type || "VEGETARIAN",
				calories: finalCalories,
				protein_g: finalProtein,
				carbs_g: finalCarbs,
				fat_g: finalFat,
				fiber_g: finalFiber,
				sugar_g: finalSugar,
				sodium_mg: finalSodium,
				iron_mg: finalIron,
				calcium_mg: finalCalcium,
				magnesium_mg: finalMagnesium,
				potassium_mg: finalPotassium,
				vit_a_ug: finalVitA,
				vit_b12_ug: finalVitB12,
				vit_d_ug: finalVitD,
				omega3_g: finalOmega3,
				components: componentsList,
				raw: rawResult
			};
			return Response.json(out);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unknown error";
			console.error("[/api/scan]", message);
			const status = message.includes("429") ? 429 : message.includes("402") ? 402 : 500;
			const userFriendlyMessage = message.includes("API key not valid") || message.includes("API_KEY_INVALID") || message.includes("sk_") ? "Invalid API key configured. Please update GEMINI_API_KEY with a valid Google Gemini API key in your project settings." : message;
			const apiKeyUsed = getGeminiApiKey();
			return Response.json({
				error: userFriendlyMessage,
				rawError: message,
				keyUsed: apiKeyUsed ? `${apiKeyUsed.slice(0, 10)}...` : null
			}, { status });
		}
	}
} } });
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AuthenticatedRouteRoute = Route$12.update({
	id: "/_authenticated",
	getParentRoute: () => Route$14
});
var AuthRoute = Route$11.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$14
});
var AuthenticatedAnalyticsRoute = Route$10.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCalendarRoute = Route$9.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedHomeRoute = Route$8.update({
	id: "/home",
	path: "/home",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedManualRoute = Route$7.update({
	id: "/manual",
	path: "/manual",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMealsRoute = Route$6.update({
	id: "/meals",
	path: "/meals",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOnboardingRoute = Route$5.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedScanRoute = Route$4.update({
	id: "/scan",
	path: "/scan",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiAnalyzeIngredientsRoute = Route$3.update({
	id: "/api/analyze-ingredients",
	path: "/api/analyze-ingredients",
	getParentRoute: () => Route$14
});
var ApiBarcodeRoute = Route$2.update({
	id: "/api/barcode",
	path: "/api/barcode",
	getParentRoute: () => Route$14
});
var ApiGenerateMealRoute = Route$1.update({
	id: "/api/generate-meal",
	path: "/api/generate-meal",
	getParentRoute: () => Route$14
});
var ApiScanRoute = Route.update({
	id: "/api/scan",
	path: "/api/scan",
	getParentRoute: () => Route$14
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAnalyticsRoute,
	AuthenticatedCalendarRoute,
	AuthenticatedHomeRoute,
	AuthenticatedManualRoute,
	AuthenticatedMealsRoute,
	AuthenticatedOnboardingRoute,
	AuthenticatedScanRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ApiAnalyzeIngredientsRoute,
	ApiBarcodeRoute,
	ApiGenerateMealRoute,
	ApiScanRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { createSsrRpc as _, LocalStore as a, clearAllNotifications as c, getNotificationPreferences as d, markAllNotificationsAsRead as f, triggerTestNotification as g, saveNotificationPreferences as h, updateProfile as i, getBrowserNotificationPermission as l, requestNutriLensNotificationPermission as m, addWater as n, getToday as o, markNotificationAsRead as p, getProfile as r, Route$11 as s, router_exports as t, getNotificationHistory as u, useServerFn as v };
