import type { Tool } from "@repo/shared";
import { shouldPrefetch } from "@repo/shared";
import Link from "next/link";
import { Badge } from "@repo/ui";

export function ToolCard({
	name,
	description,
	url,
	icon: Icon,
	comingSoon,
}: Tool) {
	const CardContent = (
		<div
			className={`group h-full rounded-lg border bg-card p-6 transition-all duration-300 ${
				comingSoon
					? "cursor-not-allowed"
					: "hover:scale-[1.02] hover:shadow-xl hover:border-green-300 dark:hover:border-green-700"
			}`}
		>
			<div className="flex items-start justify-between mb-4">
				<div
					className={`p-2 rounded-lg bg-green-100 dark:bg-green-950 ${
						!comingSoon &&
						"group-hover:bg-green-200 dark:group-hover:bg-green-900 transition-colors"
					}`}
				>
					<Icon
						className={`h-6 w-6 text-green-600 dark:text-green-400 ${
							!comingSoon && "group-hover:scale-110 transition-transform"
						}`}
					/>
				</div>
				{comingSoon && (
					<Badge variant="destructive" className="text-xs">
						Coming Soon
					</Badge>
				)}
			</div>
			<h3 className="font-bold text-lg mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
				{name}
			</h3>
			<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
				{description}
			</p>
		</div>
	);

	if (comingSoon) {
		return <div>{CardContent}</div>;
	}

	return (
		<Link href={url} prefetch={shouldPrefetch()}>
			{CardContent}
		</Link>
	);
}
