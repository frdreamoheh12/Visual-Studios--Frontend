import Link from "next/link";
import { Github, Youtube, Twitter, MessageCircle, Box } from "lucide-react";

const COLUMNS = [
  {
    title: "Visual Studio",
    links: [
      { label: "About", href: "/" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Plugins", href: "/plugins" },
      { label: "Builds", href: "/builds" },
      { label: "All Resources", href: "/resources" },
      { label: "Downloads", href: "/downloads" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/signup" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Upload a Resource", href: "/dashboard" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Discord Community", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-vs-gradient">
                <Box size={14} className="text-white" />
              </div>
              <span className="font-display text-sm font-semibold text-white">Visual Studio</span>
            </Link>
            <p className="mt-3 text-sm text-white/40">Build. Create. Upgrade.</p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: MessageCircle, label: "Discord" },
                { icon: Github, label: "GitHub" },
                { icon: Youtube, label: "YouTube" },
                { icon: Twitter, label: "X" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="vs-focus flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-accent-violet/40 hover:text-white"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="vs-focus text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-white/30 sm:flex-row">
          <p>© 2026 Visual Studio. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-white/60">
              Terms
            </Link>
            <Link href="#" className="hover:text-white/60">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
