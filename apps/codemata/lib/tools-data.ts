import {
  Braces,
  Database,
  FileCode,
  FileCode2,
  FileText,
  Globe,
  Image as ImageIcon,
  type LucideIcon,
  Palette,
  Settings,
} from "lucide-react";
import type { Tool } from "./types";

export interface ToolWithIcon extends Tool {
  icon: LucideIcon;
}

export const FORMATTER_TOOLS: ToolWithIcon[] = [
  {
    id: "typescript",
    name: "TypeScript & JavaScript",
    description: "Format JS, TS, JSX, and TSX code",
    url: "/formatters/typescript-formatter",
    icon: FileCode2,
    comingSoon: false,
  },
  {
    id: "json",
    name: "JSON",
    description: "Format and beautify JSON",
    url: "/formatters/json-formatter",
    icon: Braces,
    comingSoon: false,
  },
  {
    id: "css",
    name: "CSS/SCSS",
    description: "Format CSS and SCSS stylesheets",
    url: "/formatters/css-formatter",
    icon: Palette,
    comingSoon: false,
  },
  {
    id: "html",
    name: "HTML",
    description: "Format and beautify HTML",
    url: "/formatters/html-formatter",
    icon: Globe,
    comingSoon: false,
  },
  {
    id: "graphql",
    name: "GraphQL",
    description: "Format GraphQL queries and schemas",
    url: "/formatters/graphql-formatter",
    icon: Database,
    comingSoon: false,
  },
  {
    id: "markdown",
    name: "Markdown/MDX",
    description: "Format Markdown and MDX files",
    url: "/formatters/markdown-formatter",
    icon: FileText,
    comingSoon: false,
  },
  {
    id: "xml",
    name: "XML",
    description: "Format and beautify XML",
    url: "/formatters/xml-formatter",
    icon: FileCode,
    comingSoon: false,
  },
  {
    id: "yaml",
    name: "YAML",
    description: "Format YAML configuration files",
    url: "/formatters/yaml-formatter",
    icon: Settings,
    comingSoon: false,
  },
];

export const MINIFIER_TOOLS: ToolWithIcon[] = [
  {
    id: "typescript-min",
    name: "TypeScript & JavaScript Minifier",
    description: "Minify JS and TS",
    url: "/minifiers/typescript-minifier",
    icon: FileCode2,
    comingSoon: false,
  },
  {
    id: "json-min",
    name: "JSON Minifier",
    description: "Compress JSON",
    url: "/minifiers/json-minifier",
    icon: Braces,
    comingSoon: false,
  },
  {
    id: "css-min",
    name: "CSS Minifier",
    description: "Minify CSS",
    url: "/minifiers/css-minifier",
    icon: Palette,
    comingSoon: false,
  },
  {
    id: "html-min",
    name: "HTML Minifier",
    description: "Compress HTML",
    url: "/minifiers/html-minifier",
    icon: Globe,
    comingSoon: false,
  },
  {
    id: "svg-min",
    name: "SVG Minifier",
    description: "Optimize and compress SVG",
    url: "/minifiers/svg-minifier",
    icon: ImageIcon,
    comingSoon: false,
  },
  {
    id: "xml-min",
    name: "XML Minifier",
    description: "Compress XML",
    url: "/minifiers/xml-minifier",
    icon: FileCode,
    comingSoon: false,
  },
];
