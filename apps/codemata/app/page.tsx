import { getAppUrl, getOgImageUrl } from "@repo/shared";
import type { Metadata } from "next";
import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { SITE_CONFIG } from "@/lib/site-config";
import { getCategoriesByOrder, getTotalToolCount } from "@/lib/tools-data";

const totalCount = getTotalToolCount();

const ogImageUrl = getOgImageUrl(
	`${totalCount} Free Developer Tools`,
	SITE_CONFIG.pages.home.description,
);

export const metadata: Metadata = {
	title: SITE_CONFIG.pages.home.title,
	description: SITE_CONFIG.pages.home.description,
	keywords: SITE_CONFIG.keywords as unknown as string[],
	openGraph: {
		title: SITE_CONFIG.pages.home.title,
		description: SITE_CONFIG.pages.home.description,
		type: SITE_CONFIG.openGraph.type,
		url: getAppUrl(),
		images: [
			{
				url: ogImageUrl,
				width: 1200,
				height: 630,
				alt: `${SITE_CONFIG.name} - ${totalCount} Free Developer Tools`,
			},
		],
	},
	twitter: {
		card: SITE_CONFIG.twitter.card,
		title: SITE_CONFIG.pages.home.title,
		description: SITE_CONFIG.pages.home.description,
		images: [ogImageUrl],
	},
	alternates: {
		canonical: getAppUrl(),
	},
};

export default function HomePage() {
	return (
		<div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
			{/* Hero */}
			<section className="text-center py-8 md:py-20">
				<h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
					{SITE_CONFIG.tagline}
				</h1>
				<p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
					Format, minify, encode, and decode your code instantly with our free
					online tools. No sign-up required.
				</p>
			</section>

			{getCategoriesByOrder().map((category) => (
				<section key={category.id} className="mb-16">
					<Link href={category.url}>
						<h2 className="text-3xl font-bold mb-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
							{category.label}
						</h2>
					</Link>
					<p className="text-slate-600 dark:text-slate-400 mb-6">
						{category.description}
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{category.tools.map((tool) => (
							<ToolCard key={tool.id} {...tool} />
						))}
					</div>
				</section>
			))}
		</div>
	);
}
