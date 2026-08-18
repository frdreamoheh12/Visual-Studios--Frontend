"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const LABELS = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
const COLORS = ["bg-rose-500", "bg-orange-500", "bg-amber-400", "bg-emerald-400", "bg-emerald-400"];

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = scorePassword(password);

  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: i < score ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
              className={clsx("h-full", COLORS[score])}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-white/40">{LABELS[score]}</p>
    </div>
  );
}
