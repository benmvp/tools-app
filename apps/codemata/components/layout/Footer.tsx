export function Footer() {
  const currentYear = new Date().getFullYear();
  const yearRange = currentYear > 2025 ? `2025-${currentYear}` : "2025";

  return (
    <footer className="border-t py-6 text-center text-sm text-slate-600 dark:text-slate-400">
      <p className="mb-2">
        © {yearRange}
        {", "}
        <a
          href="https://benmvp.com"
          target="_blank"
          className="hover:text-blue-600 transition-colors"
          rel="noopener"
        >
          Ben Ilegbodu
        </a>
        . All rights reserved.{" "}
        <a
          href="https://www.biblegateway.com/passage/?search=2%20cor%205%3A17&version=NLT;NTV"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          2 Cor 5:17
        </a>
        .
      </p>
      <p className="text-xs mb-2">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
          <span className="text-xs">⌘</span>K
        </kbd>{" "}
        to search
      </p>
      <p className="text-xs">
        Built using{" "}
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          Next.js
        </a>{" "}
        and{" "}
        <a
          href="https://ai.google.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          Gemini AI API
        </a>
        , deployed to{" "}
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          Vercel
        </a>
        .
      </p>
    </footer>
  );
}
