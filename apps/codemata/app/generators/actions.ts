"use server";

import { GITIGNORE_TEMPLATES } from "@/lib/gitignore-templates";

export async function generateGitignore(
  templateIds: string[],
): Promise<string> {
  if (templateIds.length === 0) {
    return "";
  }

  const templates = templateIds
    .map((id) => GITIGNORE_TEMPLATES[id])
    .filter(Boolean);

  if (templates.length === 0) {
    return "";
  }

  // Combine templates with section headers
  const sections = templates.map((template) => {
    const header = `# ${template.name}`;
    const divider = "#".repeat(header.length);
    return `${divider}\n${header}\n${divider}\n\n${template.content}`;
  });

  return sections.join("\n\n");
}
