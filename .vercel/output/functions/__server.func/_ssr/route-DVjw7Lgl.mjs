import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate, f as useRouterState, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-gnngM_Y9.mjs";
import { At as ChartColumn, Nt as CalendarDays, O as Sparkles, X as LogOut, at as House, c as Utensils, f as UserCog, jt as Camera, q as Moon, tt as Laptop, w as Sun } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as LocalStore } from "./router-BBaCA5Zn.mjs";
import { t as syncUserDataFromSupabase } from "./user-sync-BoIz-JMx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DVjw7Lgl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/home",
		label: "Home",
		icon: House
	},
	{
		to: "/scan",
		label: "Scan",
		icon: Camera
	},
	{
		to: "/calendar",
		label: "Calendar",
		icon: CalendarDays
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/meals",
		label: "Meal Planner",
		icon: Utensils
	},
	{
		to: "/onboarding",
		label: "Profile",
		icon: UserCog
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [theme, setTheme] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return localStorage.getItem("nutrilens_theme") || "dark";
		return "dark";
	});
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		const applyTheme = (t) => {
			root.classList.remove("light", "dark");
			if (t === "dark") root.classList.add("dark");
			else if (t === "light") root.classList.remove("dark");
			else if (window.matchMedia("(prefers-color-scheme: dark)").matches) root.classList.add("dark");
			else root.classList.remove("dark");
		};
		applyTheme(theme);
		localStorage.setItem("nutrilens_theme", theme);
		if (theme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleChange = () => applyTheme("system");
			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, [theme]);
	const signOut = async () => {
		localStorage.removeItem("nutrilens_guest_session");
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-background text-foreground dark:bg-[#071018] transition-colors duration-300 overflow-x-hidden selection:bg-[#38BDF8] selection:text-[#071018]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-300",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-ambient-breathing absolute -left-32 -top-32 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14)_0%,rgba(0,0,0,0)_70%)] blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-ambient-breathing absolute -right-32 top-1/3 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.12)_0%,rgba(0,0,0,0)_70%)] blur-3xl [animation-delay:4s]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-ambient-breathing absolute bottom-0 left-1/4 h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.08)_0%,rgba(0,0,0,0)_70%)] blur-3xl [animation-delay:8s]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-float-particle absolute left-[15%] top-[20%] h-1.5 w-1.5 rounded-full bg-[#38BDF8]/40 blur-[1px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-float-particle absolute left-[75%] top-[15%] h-2 w-2 rounded-full bg-[#34D399]/35 blur-[1px] [animation-delay:3s]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-float-particle absolute left-[85%] top-[65%] h-1.5 w-1.5 rounded-full bg-[#818CF8]/40 blur-[1px] [animation-delay:6s]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-float-particle absolute left-[25%] top-[80%] h-2.5 w-2.5 rounded-full bg-[#38BDF8]/30 blur-[1px] [animation-delay:9s]" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-40 hidden w-56 lg:w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground dark:border-white/10 dark:bg-[#0C1722]/90 backdrop-blur-2xl px-3.5 sm:px-4 py-6 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 px-2 flex flex-col gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/home",
							className: "flex items-center gap-3 group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#22D3EE] to-[#34D399] text-[#071018] shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-105 transition-transform duration-300",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-lg font-black tracking-tight text-foreground dark:text-white flex items-center gap-1.5",
								children: ["NutriLens", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#071018] shadow-sm",
									children: "AI"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-widest text-muted-foreground dark:text-slate-400 font-semibold",
								children: "Health Intelligence"
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-1.5",
						children: nav.map((n) => {
							const active = pathname === n.to || pathname.startsWith(n.to + "/");
							const Icon = n.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: n.to,
								className: `relative flex items-center gap-3.5 rounded-[18px] px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${active ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-sm dark:bg-[#0C1722] dark:text-[#38BDF8] dark:border-[#38BDF8]/30 dark:shadow-[0_0_15px_rgba(56,189,248,0.15)]" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground dark:text-slate-400 dark:hover:bg-[#0C1722]/60 dark:hover:text-white"}`,
								children: [
									active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										layoutId: "desktopSidebarActivePill",
										className: "absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-gradient-to-b from-[#38BDF8] to-[#34D399] shadow-[0_0_10px_#38BDF8]",
										transition: {
											type: "spring",
											stiffness: 380,
											damping: 30
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4.5 w-4.5 ${active ? "text-[#38BDF8]" : "text-muted-foreground dark:text-slate-400"}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label })
								]
							}, n.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 rounded-[22px] border border-border bg-card/80 dark:border-white/10 dark:bg-[#0C1722]/80 p-2 space-y-1.5 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-slate-400",
								children: "Interface Mode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "group cursor-pointer p-1 transition-transform duration-300 hover:rotate-15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3.5 w-3.5 text-[#38BDF8]" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setTheme("dark"),
									title: "Dark Mode",
									className: `flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition-all ${theme === "dark" ? "bg-muted text-foreground border border-border dark:bg-gradient-to-r dark:from-[#38BDF8] dark:to-[#34D399] dark:text-[#071018] dark:border-none dark:shadow-[0_0_12px_rgba(56,189,248,0.3)]" : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3.5 w-3.5" }), "Dark"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setTheme("light"),
									title: "Light Mode",
									className: `flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition-all ${theme === "light" ? "bg-card text-foreground shadow-sm border border-border dark:bg-white dark:text-[#071018]" : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3.5 w-3.5" }), "Light"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setTheme("system"),
									title: "System Default",
									className: `flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition-all ${theme === "system" ? "bg-card text-foreground border border-border dark:bg-[#0F2130] dark:text-white dark:border-white/10" : "text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-white"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-3.5 w-3.5" }), "Auto"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: signOut,
						className: "flex items-center gap-3 rounded-[18px] px-3.5 py-3 text-sm font-semibold text-muted-foreground hover:bg-sidebar-accent hover:text-foreground dark:text-slate-400 dark:hover:bg-[#0C1722] dark:hover:text-white transition-all active:scale-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4.5 w-4.5" }), "Sign out"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-0 z-30 flex items-center justify-between border-b border-border/40 bg-card/80 dark:border-white/10 dark:bg-[#071018]/85 px-4 py-3 backdrop-blur-2xl md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/home",
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#38BDF8] via-[#22D3EE] to-[#34D399] text-[#071018] shadow-[0_0_15px_rgba(56,189,248,0.3)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4.5 w-4.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-extrabold text-base tracking-tight text-foreground dark:text-white",
						children: "NutriLens"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1.5 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-2 py-0.5 text-[9px] font-black uppercase text-[#071018] shadow-sm",
						children: "AI"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center rounded-full border border-border bg-muted/40 dark:border-white/10 dark:bg-[#0C1722]/90 p-1 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTheme("dark"),
							title: "Dark Mode",
							className: `flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold transition-all duration-200 ${theme === "dark" ? "bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-[#071018] shadow-[0_0_15px_rgba(56,189,248,0.4)]" : "text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dark" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTheme("light"),
							title: "Light Mode",
							className: `flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold transition-all duration-200 ${theme === "light" ? "bg-card text-foreground shadow-md border border-border" : "text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Light" })]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative z-10 pb-24 md:pb-0 md:pl-56 lg:pl-64 min-w-0 w-full overflow-x-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 w-full min-w-0",
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-2.5 bottom-2.5 z-40 grid grid-cols-6 rounded-[22px] border border-border/60 bg-card/90 shadow-xl dark:border-white/10 dark:bg-[#0C1722]/90 dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)] p-1 backdrop-blur-2xl md:hidden",
				children: nav.map((n) => {
					const active = pathname === n.to || pathname.startsWith(n.to + "/");
					const Icon = n.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.to,
						className: `relative flex flex-col items-center justify-center rounded-[16px] py-2 px-1 transition-all duration-200 ${active ? "text-primary dark:text-[#071018] font-black" : "text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white active:scale-95"}`,
						children: [
							active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								layoutId: "mobileActiveTabPill",
								className: "absolute inset-0 rounded-[16px] bg-primary/15 border border-primary/30 dark:border-none dark:bg-gradient-to-r dark:from-[#38BDF8] dark:to-[#34D399] dark:shadow-[0_0_25px_rgba(56,189,248,0.45)]",
								transition: {
									type: "spring",
									stiffness: 400,
									damping: 32
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `relative z-10 h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform duration-200 ${active ? "scale-110 text-primary dark:text-[#071018]" : ""}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `relative z-10 mt-1 truncate max-w-full text-[8px] xs:text-[9px] tracking-tight transition-opacity duration-200 ${active ? "font-black text-primary dark:text-[#071018]" : "font-semibold text-muted-foreground dark:text-slate-400"}`,
								children: n.label
							})
						]
					}, n.to);
				})
			})
		]
	});
}
function AuthedLayout() {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const checkAuth = async () => {
			const { data } = await supabase.auth.getSession();
			const guestSession = localStorage.getItem("nutrilens_guest_session");
			if (!data.session && !guestSession) {
				navigate({
					to: "/auth",
					replace: true
				});
				return;
			}
			if (data.session?.user?.id) await syncUserDataFromSupabase(data.session.user.id);
			const profile = LocalStore.getProfile();
			if (!Boolean(profile?.onboarded) && pathname !== "/onboarding") {
				navigate({
					to: "/onboarding",
					replace: true
				});
				return;
			}
			setReady(true);
		};
		checkAuth();
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_OUT") {
				localStorage.removeItem("nutrilens_guest_session");
				LocalStore.clearAll();
				navigate({
					to: "/auth",
					replace: true
				});
			}
		});
		return () => sub.subscription.unsubscribe();
	}, [navigate, pathname]);
	if (!ready) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { AuthedLayout as component };
