import { describe, expect, it } from "vitest";
import { generateGitignore } from "../app/generators/actions";

describe(".gitignore Generator", () => {
	it("generates gitignore from single template", async () => {
		const result = await generateGitignore(["node"]);
		expect(result).toContain("# Node");
		expect(result).toContain("node_modules/");
	});

	it("generates gitignore from multiple templates", async () => {
		const result = await generateGitignore(["node", "python"]);
		expect(result).toContain("# Node");
		expect(result).toContain("node_modules/");
		expect(result).toContain("# Python");
		expect(result).toContain("__pycache__/");
	});

	it("returns empty string when no templates selected", async () => {
		const result = await generateGitignore([]);
		expect(result).toBe("");
	});

	it("ignores invalid template IDs", async () => {
		const result = await generateGitignore(["invalid-id"]);
		expect(result).toBe("");
	});

	it("handles mix of valid and invalid template IDs", async () => {
		const result = await generateGitignore(["node", "invalid-id"]);
		expect(result).toContain("# Node");
		expect(result).toContain("node_modules/");
	});
});
