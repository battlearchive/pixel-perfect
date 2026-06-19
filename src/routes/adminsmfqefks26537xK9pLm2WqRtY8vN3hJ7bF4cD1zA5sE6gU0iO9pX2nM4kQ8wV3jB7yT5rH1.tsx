import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/adminsmfqefks26537xK9pLm2WqRtY8vN3hJ7bF4cD1zA5sE6gU0iO9pX2nM4kQ8wV3jB7yT5rH1")({
  // Supabase session lives in localStorage, so this gate runs on the client.
  ssr: false,
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      throw redirect({ to: "/login" });
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile || profile.role !== "admin") {
      await supabase.auth.signOut();
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
