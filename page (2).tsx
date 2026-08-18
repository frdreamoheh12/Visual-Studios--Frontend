"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth, ApiClientError } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { register, user, isLoading: authLoading } = useAuth();
  const { push } = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Already signed in? Skip straight to the dashboard instead of the form.
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (username.trim().length < 3) errors.username = "Username must be at least 3 characters.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address.";
    if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(username, email, password, confirmPassword);
      push({ title: "Account created", description: `Welcome to Visual Studio, ${username}.`, variant: "success" });
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Something went wrong.";
      setFormError(message);
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
    <AuthShell title="Create your account" subtitle="Start building on Visual Studio in minutes.">
      <OAuthButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/30">or continue with email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={fieldErrors.username}
          autoComplete="username"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          autoComplete="email"
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            autoComplete="new-password"
            required
          />
          <div className="mt-2">
            <PasswordStrength password={password} />
          </div>
        </div>
        <Input
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          required
        />

        {formError && (
          <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
            {formError}
          </p>
        )}

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full" magnetic={false}>
          Create Account
        </Button>

        <p className="text-center text-xs text-white/30">
          By continuing you agree to Visual Studio&apos;s Terms and Privacy Policy.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link href="/login" className="vs-focus text-white hover:text-accent-violet">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
