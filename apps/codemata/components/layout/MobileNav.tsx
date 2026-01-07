"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ALL_FORMATTERS, ALL_MINIFIERS } from "@/lib/tools-data";
import { shouldPrefetch } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useSemanticElements: backdrop overlay, not a button */}
      <div
        role="button"
        tabIndex={0}
        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-[60%] max-w-xs border-r bg-background lg:hidden">
        <div className="flex h-full flex-col">
          {/* Close Button */}
          <div className="flex items-center justify-between border-b p-4">
            <span className="font-bold">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Formatters */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
                Formatters
              </h3>
              <ul className="space-y-1">
                {ALL_FORMATTERS.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.url}
                      prefetch={shouldPrefetch()}
                      onClick={() => !tool.comingSoon && onClose()}
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

            {/* Minifiers */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
                Minifiers
              </h3>
              <ul className="space-y-1">
                {ALL_MINIFIERS.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.url}
                      prefetch={shouldPrefetch()}
                      onClick={() => !tool.comingSoon && onClose()}
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
          </nav>
        </div>
      </aside>
    </>
  );
}
