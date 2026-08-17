import {
  LayoutDashboard,
  Store,
  BookOpen,
  Puzzle,
  Hammer,
  Wrench,
  Download,
  ShoppingBag,
  Heart,
  User,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Single source of truth for dashboard navigation. Used by the sidebar,
 * the command palette, and the topbar's page-title lookup, so a route
 * only ever needs to be added here once.
 */
export const DASHBOARD_NAV: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Marketplace", href: "/marketplace", icon: Store },
      { label: "Resources", href: "/resources", icon: BookOpen },
      { label: "Plugins", href: "/plugins", icon: Puzzle },
      { label: "Builds", href: "/builds", icon: Hammer },
      { label: "Services", href: "/services", icon: Wrench },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Downloads", href: "/downloads", icon: Download },
      { label: "Orders", href: "/orders", icon: ShoppingBag },
      { label: "Favorites", href: "/favorites", icon: Heart },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const ADMIN_NAV_ITEM: NavItem = {
  label: "Admin Dashboard",
  href: "/admin",
  icon: Shield,
};

export function getPageTitle(pathname: string): string {
  const all = [...DASHBOARD_NAV.flatMap((section) => section.items), ADMIN_NAV_ITEM];
  const match = all.find((item) => item.href === pathname);
  return match?.label ?? "Dashboard";
}
