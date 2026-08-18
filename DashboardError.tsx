"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl2 border border-rose-500/20 bg-rose-500/[0.03] px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
        <AlertTriangle size={26} />
      </div>
      <div>
        <p className="font-display text-lg font-semibold text-white">Something went wrong.</p>
        <p className="mt-1 text-sm text-white/40">We couldn&apos;t load your dashboard.</p>
      </div>
      <Button variant="secondary" onClick={onRetry} magnetic={false}>
        Try Again
      </Button>
    </div>
  );
}
