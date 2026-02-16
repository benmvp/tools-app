"use client";

import { Menu, Moon, Search, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";

interface MobileHeaderProps {
	onMenuClick: () => void;
	onSearchClick: () => void;
}

export function MobileHeader({
	onMenuClick,
	onSearchClick,
}: MobileHeaderProps) {
	const { theme, setTheme } = useTheme();

	return (
		<header className="lg:hidden sticky top-0 z-50 border-b bg-background">
			<div className="flex items-center justify-between p-4">
				{/* Menu Button + Brand */}
				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon-touch"
						onClick={onMenuClick}
						aria-label="Open navigation menu"
					>
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

				{/* Right side: Search + Theme Toggle */}
				<div className="flex items-center gap-2">
					{/* Search Button */}
					<Button
						variant="ghost"
						size="icon-touch"
						onClick={onSearchClick}
						aria-label="Search tools"
					>
						<Search className="h-5 w-5" />
					</Button>

					{/* Theme Toggle */}
					<Button
						variant="ghost"
						size="icon-touch"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						aria-label="Toggle theme"
					>
						<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					</Button>
				</div>
			</div>
		</header>
	);
}
