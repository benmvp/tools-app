import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { ToolWithIcon } from '@/lib/tools-data'

export function ToolCard({ name, description, url, icon: Icon, comingSoon }: ToolWithIcon) {
  const CardContent = (
    <div
      className={`group h-full rounded-lg border bg-card p-6 transition-all hover:shadow-lg ${
        comingSoon ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon className="h-8 w-8 text-blue-600" />
        {comingSoon && (
          <Badge variant="secondary" className="text-xs">
            Coming Soon
          </Badge>
        )}
      </div>
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  )

  if (comingSoon) {
    return <div>{CardContent}</div>
  }

  return <Link href={url}>{CardContent}</Link>
}
