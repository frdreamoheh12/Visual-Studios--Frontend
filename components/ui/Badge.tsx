import clsx from "clsx";
import { HTMLAttributes } from "react";

type Tone = "violet" | "green" | "neutral" | "amber" | "rose";

const TONE_CLASSES: Record<Tone, string> = {
  violet: "bg-accent-violet/10 text-accent-violet border-accent-violet/30",
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  neutral: "bg-white/5 text-white/60 border-white/10",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    />
  );
}
