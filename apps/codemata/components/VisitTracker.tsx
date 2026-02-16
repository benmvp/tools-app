"use client";

import { useEffect } from "react";
import { addRecentTool } from "@/lib/recent-tools";

/**
 * Client component that tracks tool page visits
 * Use this in server component pages to track visits
 */
export function VisitTracker({ url }: { url: string }) {
  useEffect(() => {
    addRecentTool(url);
  }, [url]);

  return null;
}
