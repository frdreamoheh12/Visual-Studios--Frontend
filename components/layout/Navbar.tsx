"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search, Coins, LayoutDashboard, Box } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Resources", href: "/resources" },
  { label: "Plugins", href: "/plugins" },
  { label: "Builds", href: "/builds" },
  { label: "Services", href: "/services" },
];

export function Navbar() {
  const { user, isLoading } = useAuth();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("vs:open-command-palette"));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 flex justify-center px-4 pt-4"
    >
      <div
        className={`flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-base-950/80 shadow-card backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 vs-focus rounded-full px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vs-gradient">
            <Box size={16} className="text-white" />
          </div>
          <span className="font-display text-base font-semibold tracking-tight text-white">
            Visual Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="vs-focus rounded-full px-3.5 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("vs:open-command-palette"))}
            aria-label="Search (Ctrl+K)"
            className="vs-focus hidden items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/40 hover:border-white/20 hover:text-white/70 sm:flex"
          >
            <Search size={14} />
            <span>Search</span>
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>

          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-white/5" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-amber-300 sm:flex">
                <Coins size={13} />
                {user.credits.toLocaleString()}
              </div>
              <Link href="/dashboard">
                <Button size="sm" variant="secondary" className="gap-1.5">
                  <LayoutDashboard size={14} />
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile" aria-label="Your profile" className="vs-focus rounded-full">
                <Avatar username={user.username} src={user.avatarUrl} size={34} />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" variant="primary">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
