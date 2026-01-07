"use client";

import { Menu, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="lg:hidden sticky top-0 z-50 border-b bg-background">
      <div className="flex items-center justify-between p-4">
        {/* Menu Button + Brand */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center">
            <Image
              src={
                theme === "dark"
                  ? "/img/logos/wordmark-dark.svg"
                  : "/img/logos/wordmark.svg"
              }
              alt={SITE_CONFIG.name}
              width={140}
              height={30}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}
