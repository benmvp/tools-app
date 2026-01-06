import {
  CheckCircle2,
  Lightbulb,
  type LucideIcon,
  Sparkles,
} from "lucide-react";

interface TipCardProps {
  type: "tip" | "fact" | "bestPractice";
  content: string;
}

const TIP_CONFIG: Record<
  "tip" | "fact" | "bestPractice",
  {
    icon: LucideIcon;
    label: string;
    colorClasses: string;
    iconColorClasses: string;
  }
> = {
  tip: {
    icon: Lightbulb,
    label: "Tip",
    colorClasses:
      "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/50",
    iconColorClasses: "text-blue-600 dark:text-blue-400",
  },
  fact: {
    icon: Sparkles,
    label: "Did You Know?",
    colorClasses:
      "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950/50",
    iconColorClasses: "text-purple-600 dark:text-purple-400",
  },
  bestPractice: {
    icon: CheckCircle2,
    label: "Best Practice",
    colorClasses:
      "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/50",
    iconColorClasses: "text-green-600 dark:text-green-400",
  },
};

/**
 * Floating tip card component
 * Displays contextual tips, facts, and best practices
 * Interspersed between content sections
 */
export function TipCard({ type, content }: TipCardProps) {
  const config = TIP_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className={`my-6 rounded-r-lg border-l-4 p-4 ${config.colorClasses}`}>
      <div className="flex items-start gap-3">
        <Icon
          className={`mt-0.5 h-5 w-5 flex-shrink-0 ${config.iconColorClasses}`}
        />
        <div>
          <p className="mb-1 text-sm font-semibold">{config.label}</p>
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
}
