"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import clsx from "clsx";

type Tone = "violet" | "blue" | "cyan" | "amber";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
  tone?: Tone;
}

const TONE_CLASSES: Record<Tone, { glow: string; icon: string }> = {
  violet: { glow: "from-accent-violet/25", icon: "text-accent-violet" },
  blue: { glow: "from-accent-blue/25", icon: "text-accent-blue" },
  cyan: { glow: "from-accent-cyan/25", icon: "text-accent-cyan" },
  amber: { glow: "from-amber-500/25", icon: "text-amber-400" },
};

export function StatCard({ icon: Icon, label, value, change, tone = "violet" }: StatCardProps) {
  const toneClasses = TONE_CLASSES[tone];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="vs-panel vs-panel-hover group relative overflow-hidden rounded-xl2 p-5"
    >
      <div
        className={clsx(
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
          toneClasses.glow
        )}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        <div
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-transform duration-300 group-hover:scale-110",
            toneClasses.icon
          )}
        >
          <Icon size={18} />
        </div>
        {typeof change === "number" && (
          <span
            className={clsx(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
              change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            )}
          >
            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <p className="relative mt-4 font-display text-2xl font-semibold text-white">{value}</p>
      <p className="relative mt-1 text-xs text-white/40">{label}</p>
    </motion.div>
  );
}
