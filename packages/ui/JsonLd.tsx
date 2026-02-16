/**
 * JsonLd Component
 *
 * Safely renders JSON-LD structured data for SEO.
 * Uses dangerouslySetInnerHTML as required by the JSON-LD spec.
 * The data is serialized via JSON.stringify, which is safe for this use case.
 */

interface JsonLdProps {
	data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data spec
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
