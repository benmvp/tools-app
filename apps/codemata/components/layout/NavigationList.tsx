"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { ALL_ENCODERS, ALL_FORMATTERS, ALL_MINIFIERS } from "@/lib/tools-data";
import { shouldPrefetch } from "@/lib/utils";

interface NavigationListProps {
  onItemClick?: () => void; // For mobile to close menu
}

export function NavigationList({ onItemClick }: NavigationListProps) {
  const pathname = usePathname();
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  // Scroll to active item on mount
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data-driven categories configuration
  const categories = [
    {
      name: "Formatters",
      singular: "Formatter",
      href: "/formatters",
      tools: ALL_FORMATTERS,
    },
    {
      name: "Minifiers",
      singular: "Minifier",
      href: "/minifiers",
      tools: ALL_MINIFIERS,
    },
    {
      name: "Encoders",
      singular: "Encoder",
      href: "/encoders",
      tools: ALL_ENCODERS,
    },
  ];

  return (
    <div className="space-y-6">
      {categories.map(({ name, singular, href, tools }) => (
        <div key={name}>
          <Link
            href={href}
            prefetch={shouldPrefetch()}
            onClick={onItemClick}
            className="mb-2 text-xs font-semibold uppercase text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors block"
          >
            {name}
          </Link>
          <ul className="space-y-1">
            {tools.map((tool) => (
              <li key={tool.id}>
                <Link
                  ref={pathname === tool.url ? activeItemRef : null}
                  href={tool.url}
                  prefetch={shouldPrefetch()}
                  title={`${tool.name} ${singular}`}
                  onClick={(e) => {
                    if (tool.comingSoon) {
                      e.preventDefault();
                    } else {
                      onItemClick?.();
                    }
                  }}
                  className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    pathname === tool.url
                      ? "bg-slate-100 font-medium dark:bg-slate-800"
                      : ""
                  } ${tool.comingSoon ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <span>{tool.name}</span>
                  {tool.comingSoon && (
                    <Badge variant="secondary" className="text-xs">
                      Soon
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
