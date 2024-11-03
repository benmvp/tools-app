import { green, yellow } from '@mui/material/colors'
import type { BaseRootLayoutProps } from '@repo/ui/base-root-layout'
import { BaseRootLayout } from '@repo/ui/base-root-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'Generated by create next app',
  title: 'Free Money Tools',
}

const THEME_OPTIONS: BaseRootLayoutProps['themeOptions'] = {
  palette: {
    primary: green,
    secondary: yellow,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <BaseRootLayout navMenuItems={[]} themeOptions={THEME_OPTIONS}>
      {children}
    </BaseRootLayout>
  )
}
