import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Moni - Financial Calculators",
		short_name: "Moni",
		description:
			"Free financial calculators and planning tools. Make informed decisions about budgeting, investing, debt, and more.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#16a34a",
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
