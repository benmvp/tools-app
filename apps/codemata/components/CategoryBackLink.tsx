import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CategoryBackLinkProps {
  href: string;
  label: string;
}

export function CategoryBackLink({ href, label }: CategoryBackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-6 rounded-full bg-muted text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-muted/80 transition-all hover:scale-105 order-[-1] self-start"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  );
}
