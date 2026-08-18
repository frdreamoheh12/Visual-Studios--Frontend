"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api, ApiClientError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email on your account and we'll send you a reset link."
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="vs-panel flex flex-col items-center gap-3 rounded-xl2 px-6 py-8 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-violet/10 text-accent-violet">
              <MailCheck size={22} />
            </div>
            <p className="text-sm font-medium text-white">Check your inbox</p>
            <p className="text-sm text-white/50">
              If an account exists for <span className="text-white/80">{email}</span>, a reset link is on its
              way.
            </p>
            <Link href="/login" className="vs-focus mt-2 text-sm text-accent-violet hover:text-accent-blue">
              Back to sign in
            </Link>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            {error && (
              <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
                {error}
              </p>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full" magnetic={false}>
              Send reset link
            </Button>

            <Link
              href="/login"
              className="vs-focus text-center text-sm text-white/40 hover:text-white/70"
            >
              Back to sign in
            </Link>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
