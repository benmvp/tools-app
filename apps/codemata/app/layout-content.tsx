"use client";

import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen flex flex-col">
        {/* Main Content (first in DOM for SEO/A11y) */}
        <div className="flex-1 lg:ml-60">
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </div>

        {/* Mobile Header (after main, positioned at top via fixed/sticky) */}
        <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />

        {/* Desktop Sidebar (after main in DOM, positioned left via fixed positioning) */}
        <Sidebar />

        {/* Mobile Nav Overlay (at end since it's a modal) */}
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
