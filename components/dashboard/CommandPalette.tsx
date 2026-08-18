"use client";

import { useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, LogOut, CornerDownLeft, type LucideIcon } from "lucide-react";
import { DASHBOARD_NAV, ADMIN_NAV_ITEM } from "@/lib/dashboard-nav";
import { useAuth } from "@/lib/auth-context";

interface Command {
  label: string;
  icon: LucideIcon;
  href?: string;
  action?: () => void | Promise<void>;
}

/**
 * Listens for the shared "vs:open-command-palette" event (dispatched by
 * both the marketing Navbar and the dashboard Topbar) plus Ctrl/Cmd+K
 * itself, so it works whether or not the Navbar happens to be mounted.
 * Built to be extended with more commands/results by future phases.
 */
export function CommandPalette({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { logout } = useAuth();

  const commands: Command[] = useMemo(() => {
    const navCommands: Command[] = DASHBOARD_NAV.flatMap((section) => section.items).map((item) => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
    }));
    if (isAdmin) {
      navCommands.push({ label: ADMIN_NAV_ITEM.label, href: ADMIN_NAV_ITEM.href, icon: ADMIN_NAV_ITEM.icon });
    }
    navCommands.push({
      label: "Logout",
      icon: LogOut,
      action: async () => {
        await logout();
        router.push("/login");
      },
    });
    return navCommands;
  }, [isAdmin, logout, router]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((command) => command.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    function handleOpenEvent() {
      setOpen(true);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("vs:open-command-palette", handleOpenEvent);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("vs:open-command-palette", handleOpenEvent);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function runCommand(command: Command) {
    setOpen(false);
    if (command.href) router.push(command.href);
    else command.action?.();
  }

  function handleInputKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && filtered[activeIndex]) {
      runCommand(filtered[activeIndex]);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed left-1/2 top-24 z-[71] w-full max-w-lg -translate-x-1/2 px-4"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="vs-panel overflow-hidden rounded-xl2 shadow-card">
              <div className="flex items-center gap-3 border-b border-white/10 px-4">
                <Search size={16} className="text-white/40" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search Visual Studio..."
                  className="h-12 flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
                  ESC
                </kbd>
              </div>
              <div className="no-scrollbar max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm text-white/30">No results found.</p>
                )}
                {filtered.map((command, i) => (
                  <button
                    key={command.label}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => runCommand(command)}
                    className={`vs-focus flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      i === activeIndex ? "bg-white/[0.07] text-white" : "text-white/60"
                    }`}
                  >
                    <command.icon size={15} />
                    <span className="flex-1">{command.label}</span>
                    {i === activeIndex && <CornerDownLeft size={13} className="text-white/30" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
