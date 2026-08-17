"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Link2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { api, ApiClientError } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface Connections {
  google: boolean;
  discord: boolean;
  hasPassword: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { push } = useToast();

  const [connections, setConnections] = useState<Connections | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get<{ success: boolean; data: Connections }>("/users/me/connections")
      .then((res) => setConnections(res.data))
      .catch(() => setConnections(null));
  }, []);

  async function handleChangePassword() {
    setError(null);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      await api.put("/users/me/password", {
        currentPassword: currentPassword || undefined,
        newPassword,
      });
      push({ variant: "success", title: "Password updated" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-white/50">Account security and connected sign-in methods.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="vs-panel rounded-xl2 p-6">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
            <KeyRound size={16} className="text-accent-violet" /> Change Password
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            {connections?.hasPassword !== false && (
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            )}
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              hint="At least 8 characters, with an uppercase letter and a number."
            />
            {error && <p className="text-xs text-rose-400">{error}</p>}
            <Button onClick={handleChangePassword} isLoading={saving} magnetic={false} className="w-fit">
              Update Password
            </Button>
          </div>
        </div>

        <div className="vs-panel rounded-xl2 p-6">
          <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
            <Link2 size={16} className="text-accent-violet" /> Connected Accounts
          </h2>
          <div className="mt-5 flex flex-col gap-3">
            {!connections ? (
              <>
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                  <span className="text-sm text-white/70">Google</span>
                  {connections.google ? (
                    <Badge tone="green">
                      <CheckCircle2 size={11} className="mr-1 inline" /> Connected
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Not connected</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                  <span className="text-sm text-white/70">Discord</span>
                  {connections.discord ? (
                    <Badge tone="green">
                      <CheckCircle2 size={11} className="mr-1 inline" /> Connected
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Not connected</Badge>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
