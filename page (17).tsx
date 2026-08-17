"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth, ApiClientError } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();
  const { push } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Already signed in? Skip straight to the dashboard instead of the form.
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      push({ title: "Welcome back", description: "Signed in successfully.", variant: "success" });
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-950">
        <Loader2 className="animate-spin text-white/40" size={28} />
      </div>
    );
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue building.">
      <OAuthButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/30">or continue with email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-white/50">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="vs-focus h-4 w-4 rounded border-white/20 bg-transparent accent-accent-violet"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="vs-focus text-accent-violet hover:text-accent-blue">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
            {error}
          </p>
        )}

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full" magnetic={false}>
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-white/40">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="vs-focus text-white hover:text-accent-violet">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}
