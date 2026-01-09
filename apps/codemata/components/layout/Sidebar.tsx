"use client";

import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";
import { NavigationList } from "./NavigationList";

export function Sidebar() {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-60 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="border-b p-6">
          <Link href="/" className="flex items-center">
            <Image
              src={
                theme === "dark"
                  ? "/img/logos/wordmark-dark.svg"
                  : "/img/logos/wordmark.svg"
              }
              alt={SITE_CONFIG.name}
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <NavigationList />
        </nav>

        {/* Theme Toggle */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full justify-start"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-2">Toggle theme</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
