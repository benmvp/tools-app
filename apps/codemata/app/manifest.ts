import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Codemata - Code Formatting & Minification Tools",
		short_name: "Codemata",
		description:
			"Free online code formatters and minifiers for TypeScript, JavaScript, JSON, CSS, HTML, and more. Format and optimize your code instantly.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#2563eb",
		icons: [
			{
				src: "/icon?size=192",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon?size=512",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
