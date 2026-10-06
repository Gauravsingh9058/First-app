import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-gnngM_Y9.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as Sparkles, Q as LoaderCircle, mt as EyeOff, pt as Eye } from "../_libs/lucide-react.mjs";
import { s as Route$11 } from "./router-BBaCA5Zn.mjs";
import { t as syncUserDataFromSupabase } from "./user-sync-BoIz-JMx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Bnhq_BhY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const search = Route$11.useSearch();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)(search?.mode || "sign_in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [googleLoading, setGoogleLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
			if (session?.user) {
				localStorage.removeItem("nutrilens_guest_session");
				if ((await syncUserDataFromSupabase(session.user.id))?.onboarded) navigate({
					to: "/home",
					replace: true
				});
				else navigate({
					to: "/onboarding",
					replace: true
				});
			}
		});
		return () => sub.subscription.unsubscribe();
	}, [navigate]);
	const submit = async (e) => {
		e.preventDefault();
		const cleanEmail = email.trim().toLowerCase();
		if (!cleanEmail) {
			toast.error("Please enter a valid email address.");
			return;
		}
		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long.");
			return;
		}
		setLoading(true);
		try {
			if (mode === "sign_up") {
				const displayName = name.trim() || cleanEmail.split("@")[0] || "User";
				const { data, error } = await supabase.auth.signUp({
					email: cleanEmail,
					password,
					options: {
						emailRedirectTo: `${window.location.origin}/auth`,
						data: { display_name: displayName }
					}
				});
				if (error) {
					const lowerMsg = error.message.toLowerCase();
					if (lowerMsg.includes("already registered") || lowerMsg.includes("already exists") || lowerMsg.includes("already in use")) {
						const loginRes = await supabase.auth.signInWithPassword({
							email: cleanEmail,
							password
						});
						if (loginRes.data?.session?.user) {
							localStorage.removeItem("nutrilens_guest_session");
							const profile = await syncUserDataFromSupabase(loginRes.data.session.user.id);
							if (profile?.onboarded) {
								toast.success(`Account already exists. Logged in as ${profile.display_name}!`);
								navigate({
									to: "/home",
									replace: true
								});
							} else {
								toast.info("Account logged in. Please complete your health profile.");
								navigate({
									to: "/onboarding",
									replace: true
								});
							}
							return;
						} else {
							toast.error("An account with this email already exists. Incorrect password or unable to log in.");
							return;
						}
					}
					toast.error(error.message);
					return;
				}
				const user = data?.user || data?.session?.user;
				if (user) {
					localStorage.removeItem("nutrilens_guest_session");
					if (data.session) {
						try {
							await supabase.from("profiles").upsert({
								user_id: user.id,
								display_name: displayName,
								onboarded: false
							});
						} catch {}
						await syncUserDataFromSupabase(user.id);
						toast.success("Account created successfully! Let's set up your health profile.");
						navigate({
							to: "/onboarding",
							replace: true
						});
					} else {
						toast.success("Account created! Check your email to confirm your account or sign in now.");
						setMode("sign_in");
					}
				} else {
					toast.info("Sign up request submitted. Please try signing in.");
					setMode("sign_in");
				}
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({
					email: cleanEmail,
					password
				});
				if (error || !data?.session?.user) {
					if (error?.message?.toLowerCase().includes("invalid login credentials")) toast.error("Invalid email or password. Please check your credentials or create an account.");
					else if (error?.message?.toLowerCase().includes("email not confirmed")) toast.error("Please confirm your email address before signing in.");
					else toast.error(error?.message || "Invalid login credentials.");
				} else {
					localStorage.removeItem("nutrilens_guest_session");
					const userId = data.session.user.id;
					const profile = await syncUserDataFromSupabase(userId);
					if (profile?.onboarded) {
						toast.success(`Welcome back, ${profile.display_name || "User"}! All your data is synced.`);
						navigate({
							to: "/home",
							replace: true
						});
					} else {
						toast.info("Welcome! Please complete your health profile.");
						navigate({
							to: "/onboarding",
							replace: true
						});
					}
				}
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Authentication error");
		} finally {
			setLoading(false);
		}
	};
	const google = async () => {
		setGoogleLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: `${window.location.origin}/auth` }
			});
			if (error) {
				toast.error(error.message);
				setGoogleLoading(false);
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed");
			setGoogleLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen items-center justify-center bg-[#071018] px-4 py-10 text-white overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-[#38BDF8]/20 via-[#22D3EE]/15 to-[#34D399]/20 blur-3xl" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 w-full max-w-md space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "/",
				className: "flex items-center justify-center gap-2.5 group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#38BDF8] via-[#22D3EE] to-[#34D399] text-[#071018] shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-105 transition-transform",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-2xl font-black tracking-tight text-white",
					children: "NutriLens"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-white/10 bg-[#0C1722]/90 p-8 shadow-2xl backdrop-blur-2xl",
				suppressHydrationWarning: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-black text-white",
						children: mode === "sign_in" ? "Welcome back" : "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-slate-400",
						children: mode === "sign_in" ? "Sign in to track today's nutrition" : "Track calories & macros effortlessly."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						suppressHydrationWarning: true,
						onClick: google,
						disabled: googleLoading,
						className: "mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100 active:scale-95 disabled:opacity-50 transition cursor-pointer shadow-sm",
						children: [googleLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-slate-900" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "h-4 w-4 shrink-0",
							viewBox: "0 0 48 48",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#FFC107",
									d: "M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.2-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.8 6.3 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#FF3D00",
									d: "M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.8 6.8 29.2 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#4CAF50",
									d: "M24 43c5.1 0 9.7-1.7 13.3-4.7l-6.2-5.1c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3-11.3-7.4l-6.6 5.1C9.5 38.6 16.2 43 24 43z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#1976D2",
									d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.4 5.7l6.2 5.1c-.4.4 6.4-4.7 6.4-14.8 0-1.2-.1-2.3-.4-3.5z"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-slate-900",
							children: "Continue with Google"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-5 flex items-center gap-3 text-xs text-slate-400",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-white/15" }),
							" or with email",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-white/15" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-3.5",
						suppressHydrationWarning: true,
						children: [
							mode === "sign_up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-slate-300",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "mt-1 w-full rounded-xl border border-white/20 bg-[#071018] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition",
								placeholder: "Your name",
								suppressHydrationWarning: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-slate-300",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "mt-1 w-full rounded-xl border border-white/20 bg-[#071018] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition",
								placeholder: "you@gmail.com",
								suppressHydrationWarning: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-slate-300",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1 flex items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: showPassword ? "text" : "password",
									required: true,
									minLength: 6,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									className: "w-full rounded-xl border border-white/20 bg-[#071018] pl-3.5 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition",
									placeholder: "••••••••",
									suppressHydrationWarning: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									suppressHydrationWarning: true,
									onClick: () => setShowPassword(!showPassword),
									"aria-label": showPassword ? "Hide password" : "Show password",
									className: "absolute right-3 text-slate-400 hover:text-white transition p-1 cursor-pointer",
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: loading,
								suppressHydrationWarning: true,
								className: "mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#34D399] px-4 py-3 text-sm font-black text-[#071018] shadow-lg shadow-[#38BDF8]/25 hover:opacity-95 active:scale-95 disabled:opacity-50 transition cursor-pointer",
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-[#071018]" }), mode === "sign_in" ? "Sign in" : "Create account"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 text-center text-sm text-slate-400",
						children: [
							mode === "sign_in" ? "New here?" : "Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMode(mode === "sign_in" ? "sign_up" : "sign_in"),
								suppressHydrationWarning: true,
								className: "font-bold text-[#38BDF8] hover:underline cursor-pointer",
								children: mode === "sign_in" ? "Create an account" : "Sign in"
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { AuthPage as component };
