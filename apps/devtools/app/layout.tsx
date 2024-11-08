import CodeIcon from '@mui/icons-material/Code'
import { blue, pink } from '@mui/material/colors'
import type { BaseRootLayoutProps } from '@repo/ui/base-root-layout'
import { BaseRootLayout } from '@repo/ui/base-root-layout'
import type { Metadata } from 'next'
import {
  FORMATTERS,
  getFormatterSlugById,
} from './(formatters)/[slug]/formatters'

export const metadata: Metadata = {
  description: 'Generated by create next app',
  title: 'Free Developer Tools',
}

const THEME_OPTIONS: BaseRootLayoutProps['themeOptions'] = {
  palette: {
    primary: pink,
    secondary: blue,
  },
}

const NAV_MENU_ITEMS: BaseRootLayoutProps['navMenuItems'] = [
  {
    Icon: CodeIcon,
    href: '/formatters',
    items: Object.values(FORMATTERS).map(({ id, pageTitle }) => ({
      href: `/${getFormatterSlugById(id)}`,
      label: pageTitle,
    })),
    label: 'Formatters',
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <BaseRootLayout navMenuItems={NAV_MENU_ITEMS} themeOptions={THEME_OPTIONS}>
      {children}
    </BaseRootLayout>
  )
}
