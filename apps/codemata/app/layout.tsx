import CompressIcon from '@mui/icons-material/Compress'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import { blue, pink } from '@mui/material/colors'
import type { BaseRootLayoutProps } from '@repo/ui/base-root-layout'
import { BaseRootLayout } from '@repo/ui/base-root-layout'
import type { Metadata } from 'next'
import { FORMATTERS_INFO, FORMATTER_SECTION_TITLE } from './formatters/info'
import { MINIFIERS_INFO, MINIFIER_SECTION_TITLE } from './minifiers/info'

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
    Icon: FormatAlignCenterIcon,
    items: Object.values(FORMATTERS_INFO).map(({ pageTitle, url }) => ({
      href: url,
      label: pageTitle,
    })),
    label: FORMATTER_SECTION_TITLE,
  },
  {
    Icon: CompressIcon,
    items: Object.values(MINIFIERS_INFO).map(({ pageTitle, url }) => ({
      href: url,
      label: pageTitle,
    })),
    label: MINIFIER_SECTION_TITLE,
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
