import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { LocalStore } from "@/lib/local-store";
import { syncUserDataFromSupabase } from "@/lib/user-sync";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    const guestSession = localStorage.getItem("nutrilens_guest_session");
    if (!data.session && !guestSession) throw redirect({ to: "/auth" });
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const guestSession = localStorage.getItem("nutrilens_guest_session");
      if (!data.session && !guestSession) {
        navigate({ to: "/auth", replace: true });
        return;
      }

      if (data.session?.user?.id) {
        await syncUserDataFromSupabase(data.session.user.id);
      }

      const profile = LocalStore.getProfile();
      const isComplete = Boolean(profile?.onboarded);

      // If mobile OTP verification or health profile is incomplete, force onboarding screen
      if (!isComplete && pathname !== "/onboarding") {
        navigate({ to: "/onboarding", replace: true });
        return;
      }

      setReady(true);
    };
    checkAuth();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("nutrilens_guest_session");
        LocalStore.clearAll();
        navigate({ to: "/auth", replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, pathname]);

  if (!ready) return null;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
