"use client";

import { useEffect } from "react";
import { addRecentTool } from "@/lib/recent-tools";

/**
 * Hook to track tool page visits in localStorage
 * Call this in tool page components
 */
export function useTrackVisit(toolUrl: string) {
  useEffect(() => {
    // Track visit on mount
    addRecentTool(toolUrl);
  }, [toolUrl]);
}
