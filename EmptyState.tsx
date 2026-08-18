import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/40">
        <Icon size={22} />
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-white/40">{description}</p>
      </div>
      {action}
    </div>
  );
}
