"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { CommandMenu } from "@/components/CommandMenu";
import { Footer } from "@/components/layout/Footer";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export function LayoutContent({ children }: { children: React.ReactNode }) {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [commandMenuOpen, setCommandMenuOpen] = useState(false);

	// Keyboard shortcut listener for Cmd+K / Ctrl+K
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setCommandMenuOpen(true);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{/* Mobile Header (fixed at top, outside flex container) */}
			<MobileHeader
				onMenuClick={() => setMobileNavOpen(true)}
				onSearchClick={() => setCommandMenuOpen(true)}
			/>

			<div className="min-h-screen flex flex-col">
				{/* Main Content (uses pt-16 on mobile for header clearance) */}
				<div className="flex-1 lg:ml-60 pt-16 lg:pt-0">
					<main className="min-h-[calc(100vh-4rem)]">{children}</main>
					<Footer />
				</div>

				{/* Desktop Sidebar (positioned left via fixed positioning) */}
				<Sidebar onSearchClick={() => setCommandMenuOpen(true)} />

				{/* Mobile Nav Overlay (at end since it's a modal) */}
				<MobileNav
					isOpen={mobileNavOpen}
					onClose={() => setMobileNavOpen(false)}
				/>

				{/* Command Menu */}
				<CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
			</div>
			<Toaster />
		</ThemeProvider>
	);
}
