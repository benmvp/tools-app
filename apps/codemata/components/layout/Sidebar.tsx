'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Code2, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FORMATTER_TOOLS, MINIFIER_TOOLS } from '@/lib/tools-data'

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-60 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="border-b p-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="h-6 w-6 text-blue-600" />
            <span>Codemata</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Formatters */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
              Formatters
            </h3>
            <ul className="space-y-1">
              {FORMATTER_TOOLS.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.url}
                    className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      pathname === tool.url
                        ? 'bg-slate-100 font-medium dark:bg-slate-800'
                        : ''
                    } ${tool.comingSoon ? 'cursor-not-allowed opacity-60' : ''}`}
                    onClick={(e) => tool.comingSoon && e.preventDefault()}
                  >
                    <span>{tool.name}</span>
                    {tool.comingSoon && (
                      <Badge variant="secondary" className="text-xs">
                        Soon
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Minifiers */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">
              Minifiers
            </h3>
            <ul className="space-y-1">
              {MINIFIER_TOOLS.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.url}
                    className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      pathname === tool.url
                        ? 'bg-slate-100 font-medium dark:bg-slate-800'
                        : ''
                    } ${tool.comingSoon ? 'cursor-not-allowed opacity-60' : ''}`}
                    onClick={(e) => tool.comingSoon && e.preventDefault()}
                  >
                    <span>{tool.name}</span>
                    {tool.comingSoon && (
                      <Badge variant="secondary" className="text-xs">
                        Soon
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full justify-start"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-2">Toggle theme</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
