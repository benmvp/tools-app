import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { SITE_CONFIG } from "@/lib/site-config";

// Edge Runtime for optimal performance
export const runtime = "edge";

/**
 * Dynamic OG Image Generation API
 *
 * Generates social media preview images (1200x630px) with a simple title + description layout.
 *
 * Query Parameters:
 * - title: Main heading text (e.g., "14 Free Developer Tools", "JSON Formatter")
 * - description: Supporting description text
 * - v: Optional version/cache-busting parameter (not rendered, just affects URL)
 *
 * Cache Strategy:
 * - Pages with dynamic counts: Pass count as v param → URL changes when tools added
 * - Static tool pages: No v param → stable URL, cached indefinitely
 * - Design changes: Increment OG_IMAGE_VERSION in utils.ts
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const title = searchParams.get("title") || SITE_CONFIG.name;
		const description =
			searchParams.get("description") || SITE_CONFIG.description;

		return new ImageResponse(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					position: "relative",
					background: "linear-gradient(135deg, #BFDBFE 0%, #FFFFFF 100%)",
					overflow: "hidden",
				}}
			>
				{/* Decorative accent bar - top */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: 12,
						background: "linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)",
					}}
				/>

				{/* Decorative geometric shapes - background */}
				<div
					style={{
						position: "absolute",
						top: 200,
						right: -100,
						width: 400,
						height: 400,
						borderRadius: "50%",
						background: "rgba(96, 165, 250, 0.12)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: -150,
						left: -150,
						width: 500,
						height: 500,
						borderRadius: "50%",
						background: "rgba(147, 197, 253, 0.15)",
					}}
				/>

				{/* Logo section - top left */}
				<div
					style={{
						position: "absolute",
						top: 50,
						left: 60,
						display: "flex",
						alignItems: "center",
					}}
				>
					{/* </> symbol */}
					<div
						style={{
							display: "flex",
							fontSize: 40,
							color: "#3B82F6",
							fontWeight: "bold",
							fontFamily: "monospace",
						}}
					>
						&lt;/&gt;
					</div>

					{/* CODEMATA text */}
					<div
						style={{
							marginLeft: 16,
							fontSize: 40,
							fontWeight: 700,
							color: "#1E40AF",
							letterSpacing: "-0.02em",
						}}
					>
						CODEMATA
					</div>
				</div>

				{/* Main content - left-aligned, vertically centered */}
				<div
					style={{
						position: "absolute",
						left: 60,
						top: "50%",
						transform: "translateY(-50%)",
						display: "flex",
						flexDirection: "column",
						maxWidth: 1080,
					}}
				>
					{/* Accent bar beside main text */}
					<div
						style={{
							width: 8,
							height: 140,
							background: "linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)",
							position: "absolute",
							left: -30,
							borderRadius: 4,
						}}
					/>

					{/* Main text - MUCH LARGER */}
					<div
						style={{
							fontSize: 110,
							fontWeight: 900,
							color: "#0F172A",
							lineHeight: 1.1,
							letterSpacing: "-0.03em",
							textShadow: "0 2px 4px rgba(0, 0, 0, 0.04)",
						}}
					>
						{title}
					</div>

					{/* Description text - useful context */}
					{description && (
						<div
							style={{
								marginTop: 32,
								fontSize: 36,
								color: "#334155",
								fontWeight: 500,
								letterSpacing: "-0.01em",
								lineHeight: 1.4,
								maxWidth: 1000,
							}}
						>
							{description}
						</div>
					)}
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
				headers: {
					"Cache-Control":
						"public, max-age=31536000, stale-while-revalidate=86400",
				},
			},
		);
	} catch (error) {
		console.error("Error generating OG image:", error);

		// Fallback to simple error image
		return new ImageResponse(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)",
				}}
			>
				<div style={{ fontSize: 48, color: "#1E293B" }}>
					Codemata - Developer Tools
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);
	}
}
