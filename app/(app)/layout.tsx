import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardProvider } from "@/lib/dashboard-context";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

/**
 * Route group (no URL segment) shared by every authenticated top-level
 * section — /dashboard, /marketplace, /resources, /plugins, /builds,
 * /services, /downloads, /orders, /favorites, /profile, /settings,
 * /admin — so they all share the same sidebar/topbar chrome and a single
 * dashboard-summary fetch, without nesting their routes under /dashboard.
 */
export default function AuthenticatedAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <DashboardProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </DashboardProvider>
    </RequireAuth>
  );
}
