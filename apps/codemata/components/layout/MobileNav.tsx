"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationList } from "./NavigationList";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
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
          <nav className="flex-1 overflow-y-auto p-4">
            <NavigationList onItemClick={onClose} />
          </nav>
        </div>
      </aside>
    </>
  );
}
