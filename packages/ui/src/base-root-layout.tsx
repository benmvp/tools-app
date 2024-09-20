'use client'
import {
  Box,
  Container,
  CssBaseline,
  Link as MuiLink,
  useMediaQuery,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { Roboto } from 'next/font/google'
import { useMemo } from 'react'

const roboto = Roboto({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
})

export interface BaseRootLayoutProps {
  children: React.ReactNode
  themeOptions: Parameters<typeof createTheme>[0]
}

export function BaseRootLayout({
  children,
  themeOptions,
}: BaseRootLayoutProps) {
  const theme = useTheme(themeOptions)

  return (
    <html lang="en">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <Box component="section">
              <MuiLink
                height="1px"
                href="#skip-heading"
                left="-10000px"
                overflow="hidden"
                position="absolute"
                top="auto"
                width="1px"
              >
                Skip Main Navigation
              </MuiLink>

              {/* TODO: Header here */}

              {/* <Toolbar id="back-to-top-anchor" sx={{ height: HEADER_HEIGHT }} /> */}

              <Container
                id="skip-heading"
                maxWidth="lg"
                sx={{
                  marginTop: 2,
                  minHeight: '100vh',
                }}
              >
                <Box component="main">{children}</Box>
              </Container>

              {/* Footer here */}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

function useTheme(themeOptions: BaseRootLayoutProps['themeOptions']) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  return useMemo(() => {
    return createTheme({
      ...themeOptions,

      palette: {
        ...themeOptions?.palette,
        mode: prefersDarkMode ? 'dark' : 'light',
      },
      typography: {
        ...themeOptions?.typography,
        fontFamily: `var(--font-roboto)`,
      },
    })
  }, [themeOptions, prefersDarkMode])
}
