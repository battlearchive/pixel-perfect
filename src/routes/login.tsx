import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin login" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInErr || !data.session) {
        setError(signInErr?.message ?? "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Verify the signed-in user has the 'admin' role before sending them in.
      const { data: profile, error: profErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profErr || !profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }

      await router.navigate({ to: "/adminsmfqefks26537xK9pLm2WqRtY8vN3hJ7bF4cD1zA5sE6gU0iO9pX2nM4kQ8wV3jB7yT5rH1" });
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-display text-3xl tracking-tight">Admin login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with your admin email and password.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          type="email"
          autoComplete="email"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full rounded-sm border border-accent bg-accent px-6 py-3 text-xs uppercase tracking-[0.25em] font-semibold text-accent-foreground transition-all hover:shadow-[0_10px_30px_-10px_rgba(201,168,76,0.6)] disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
