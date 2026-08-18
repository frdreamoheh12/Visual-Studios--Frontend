"use client";

import { useEffect, useState } from "react";

/**
 * Same API as useState, but persists to localStorage after hydration.
 * Reads happen client-side only, so the initial render always uses
 * initialValue and never mismatches the server-rendered markup.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {
      // Ignore malformed/unavailable storage.
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore malformed/unavailable storage.
    }
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
