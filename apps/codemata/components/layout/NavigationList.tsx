"use client";

import { shouldPrefetch } from "@repo/shared";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { getCategoriesByOrder } from "@/lib/tools-data";

interface NavigationListProps {
	onItemClick?: () => void; // For mobile to close menu
}

export function NavigationList({ onItemClick }: NavigationListProps) {
	const pathname = usePathname();
	const activeItemRef = useRef<HTMLAnchorElement>(null);
	const hasScrolledRef = useRef<string | null>(null);

	// Scroll to active item when pathname changes (but only once per pathname)
	useEffect(() => {
		// Only scroll if pathname has changed and we haven't scrolled to this path yet
		if (activeItemRef.current && hasScrolledRef.current !== pathname) {
			// Small delay to ensure sidebar is fully rendered before scrolling
			const timeoutId = setTimeout(() => {
				activeItemRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}, 100);
			hasScrolledRef.current = pathname;
			return () => clearTimeout(timeoutId);
		}
	}, [pathname]);

	return (
		<div className="space-y-6">
			{getCategoriesByOrder().map((category) => (
				<div key={category.id}>
					<Link
						href={category.url}
						prefetch={shouldPrefetch()}
						onClick={onItemClick}
						className="mb-2 text-xs font-semibold uppercase text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors block"
					>
						{category.label}
					</Link>
					<ul className="space-y-1">
						{category.tools.map((tool) => (
							<li key={tool.id}>
								<Link
									ref={pathname === tool.url ? activeItemRef : null}
									href={tool.url}
									prefetch={shouldPrefetch()}
									title={tool.name}
									onClick={(e) => {
										if (tool.comingSoon) {
											e.preventDefault();
										} else {
											onItemClick?.();
										}
									}}
									className={`block px-3 py-2 text-sm rounded-md transition-all ${
										pathname === tool.url
											? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
											: tool.comingSoon
												? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
												: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
									}`}
								>
									{tool.name}
									{tool.comingSoon && (
										<Badge variant="secondary" className="ml-2 text-xs">
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
