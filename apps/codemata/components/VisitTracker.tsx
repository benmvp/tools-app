"use client";

import { addRecentTool } from "@repo/shared";
import { useEffect } from "react";

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
