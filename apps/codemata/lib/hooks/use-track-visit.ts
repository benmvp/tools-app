"use client";

import { addRecentTool } from "@repo/shared";
import { useEffect } from "react";

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
