"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, ApiClientError } from "./api";
import { DashboardSummary } from "./types";

interface DashboardContextValue {
  data: DashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

/**
 * Fetches /dashboard/summary once and shares it across every route inside
 * the authenticated app shell (dashboard home, topbar notification count,
 * etc) so navigating between sections doesn't refetch on every page.
 */
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<{ success: boolean; data: DashboardSummary }>("/dashboard/summary");
      setData(res.data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "We couldn't load your dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardContext.Provider value={{ data, isLoading, error, reload: load }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboardData must be used within a DashboardProvider");
  return ctx;
}
