import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { syncUserDataFromSupabase } from "@/lib/user-sync";
import { LocalStore } from "@/lib/local-store";
import { toast } from "sonner";
import { Sparkles, Loader2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — NutriLens" }] }),
  validateSearch: (search: Record<string, unknown>): { mode?: "sign_in" | "sign_up" } => {
    return {
      mode:
        search.mode === "sign_up" ? "sign_up" : search.mode === "sign_in" ? "sign_in" : undefined,
    };
  },
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    const guestSession = localStorage.getItem("nutrilens_guest_session");
    if (data.session || guestSession) throw redirect({ to: "/home" });
  },
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign_in" | "sign_up">(search?.mode || "sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) {
        localStorage.removeItem("nutrilens_guest_session");
        const profile = await syncUserDataFromSupabase(session.user.id);
        if (profile?.onboarded) {
          navigate({ to: "/home", replace: true });
        } else {
          navigate({ to: "/onboarding", replace: true });
        }
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
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
            data: { display_name: displayName },
          },
        });

        if (error) {
          const lowerMsg = error.message.toLowerCase();
          if (
            lowerMsg.includes("already registered") ||
            lowerMsg.includes("already exists") ||
            lowerMsg.includes("already in use")
          ) {
            // User already registered, attempt sign in
            const loginRes = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password,
            });
            if (loginRes.data?.session?.user) {
              localStorage.removeItem("nutrilens_guest_session");
              const profile = await syncUserDataFromSupabase(loginRes.data.session.user.id);
              if (profile?.onboarded) {
                toast.success(`Account already exists. Logged in as ${profile.display_name}!`);
                navigate({ to: "/home", replace: true });
              } else {
                toast.info("Account logged in. Please complete your health profile.");
                navigate({ to: "/onboarding", replace: true });
              }
              return;
            } else {
              toast.error(
                "An account with this email already exists. Incorrect password or unable to log in.",
              );
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
                onboarded: false,
              });
            } catch {
              // ignore initial profile insert error
            }
            await syncUserDataFromSupabase(user.id);
            toast.success("Account created successfully! Let's set up your health profile.");
            navigate({ to: "/onboarding", replace: true });
          } else {
            toast.success(
              "Account created! Check your email to confirm your account or sign in now.",
            );
            setMode("sign_in");
          }
        } else {
          toast.info("Sign up request submitted. Please try signing in.");
          setMode("sign_in");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error || !data?.session?.user) {
          if (error?.message?.toLowerCase().includes("invalid login credentials")) {
            toast.error(
              "Invalid email or password. Please check your credentials or create an account.",
            );
          } else if (error?.message?.toLowerCase().includes("email not confirmed")) {
            toast.error("Please confirm your email address before signing in.");
          } else {
            toast.error(error?.message || "Invalid login credentials.");
          }
        } else {
          localStorage.removeItem("nutrilens_guest_session");
          const userId = data.session.user.id;
          const profile = await syncUserDataFromSupabase(userId);

          if (profile?.onboarded) {
            toast.success(
              `Welcome back, ${profile.display_name || "User"}! All your data is synced.`,
            );
            navigate({ to: "/home", replace: true });
          } else {
            toast.info("Welcome! Please complete your health profile.");
            navigate({ to: "/onboarding", replace: true });
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
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
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

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#071018] px-4 py-10 text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-[#38BDF8]/20 via-[#22D3EE]/15 to-[#34D399]/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <a href="/" className="flex items-center justify-center gap-2.5 group">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#38BDF8] via-[#22D3EE] to-[#34D399] text-[#071018] shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="font-display text-2xl font-black tracking-tight text-white">
            NutriLens
          </div>
        </a>

        <div
          className="rounded-3xl border border-white/10 bg-[#0C1722]/90 p-8 shadow-2xl backdrop-blur-2xl"
          suppressHydrationWarning
        >
          <h1 className="font-display text-2xl font-black text-white">
            {mode === "sign_in" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {mode === "sign_in"
              ? "Sign in to track today's nutrition"
              : "Track calories & macros effortlessly."}
          </p>

          <button
            type="button"
            suppressHydrationWarning
            onClick={google}
            disabled={googleLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100 active:scale-95 disabled:opacity-50 transition cursor-pointer shadow-sm"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
            ) : (
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.2-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.8 6.3 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.8 6.8 29.2 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 43c5.1 0 9.7-1.7 13.3-4.7l-6.2-5.1c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3-11.3-7.4l-6.6 5.1C9.5 38.6 16.2 43 24 43z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.4 5.7l6.2 5.1c-.4.4 6.4-4.7 6.4-14.8 0-1.2-.1-2.3-.4-3.5z"
                />
              </svg>
            )}
            <span className="text-slate-900">Continue with Google</span>
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-white/15" /> or with email{" "}
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <form onSubmit={submit} className="space-y-3.5" suppressHydrationWarning>
            {mode === "sign_up" && (
              <div>
                <label className="text-xs font-bold text-slate-300">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/20 bg-[#071018] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
                  placeholder="Your name"
                  suppressHydrationWarning
                />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-[#071018] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
                placeholder="you@gmail.com"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300">Password</label>
              <div className="relative mt-1 flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-[#071018] pl-3.5 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition"
                  placeholder="••••••••"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 text-slate-400 hover:text-white transition p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#22D3EE] to-[#34D399] px-4 py-3 text-sm font-black text-[#071018] shadow-lg shadow-[#38BDF8]/25 hover:opacity-95 active:scale-95 disabled:opacity-50 transition cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin text-[#071018]" />}
              {mode === "sign_in" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-400">
            {mode === "sign_in" ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "sign_in" ? "sign_up" : "sign_in")}
              suppressHydrationWarning
              className="font-bold text-[#38BDF8] hover:underline cursor-pointer"
            >
              {mode === "sign_in" ? "Create an account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
