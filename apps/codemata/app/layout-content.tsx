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
      {/* Mobile Header (fixed at top, outside flex container) */}
      <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />

      <div className="min-h-screen flex flex-col">
        {/* Main Content (uses pt-16 on mobile for header clearance) */}
        <div className="flex-1 lg:ml-60 pt-16 lg:pt-0">
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </div>

        {/* Desktop Sidebar (positioned left via fixed positioning) */}
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
