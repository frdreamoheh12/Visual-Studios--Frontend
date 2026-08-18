"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Coins, CalendarDays, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import { api, ApiClientError } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const { push } = useToast();

  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await api.put("/users/me", { username, bio, avatarUrl: avatarUrl || undefined });
      await refresh();
      push({ variant: "success", title: "Profile updated" });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">Profile</h1>
        <p className="mt-2 text-sm text-white/50">Manage your public profile and account details.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="vs-panel flex flex-col items-center gap-4 rounded-xl2 p-6 text-center lg:col-span-1">
          <Avatar src={avatarUrl || user.avatarUrl} username={user.username} size={72} />
          <div>
            <p className="font-display text-lg font-semibold text-white">{user.username}</p>
            <p className="text-xs text-white/40">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge tone={user.role === "admin" ? "violet" : "neutral"}>{user.role}</Badge>
            {user.emailVerified && (
              <Badge tone="green">
                <ShieldCheck size={11} className="mr-1 inline" /> Verified
              </Badge>
            )}
          </div>
          <div className="mt-2 flex w-full flex-col gap-2 border-t border-white/5 pt-4 text-left text-xs text-white/50">
            <span className="flex items-center gap-2">
              <Coins size={13} className="text-amber-400" /> {user.credits.toLocaleString()} credits
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays size={13} />
              Joined {new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
            </span>
          </div>
        </div>

        <div className="vs-panel rounded-xl2 p-6 lg:col-span-2">
          <h2 className="font-display text-sm font-semibold text-white">Edit Profile</h2>
          <div className="mt-5 flex flex-col gap-4">
            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} maxLength={24} />
            <Input
              label="Avatar URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/80">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 280))}
                rows={4}
                placeholder="Tell the community a bit about yourself..."
                className="vs-focus w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/30 focus:border-accent-violet/60"
              />
              <p className="text-right text-[11px] text-white/30">{bio.length}/280</p>
            </div>

            {error && <p className="text-xs text-rose-400">{error}</p>}

            <Button onClick={handleSave} isLoading={saving} magnetic={false} className="w-fit">
              <Save size={15} /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
