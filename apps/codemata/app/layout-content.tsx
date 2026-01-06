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
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Header */}
        <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />

        {/* Mobile Nav Overlay */}
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-60">
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
