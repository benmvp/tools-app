'use client'

import CodeIcon from '@mui/icons-material/Code'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Link as ExternalLink,
  Toolbar,
  Typography,
  useMediaQuery,
  styled,
  Paper,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { Roboto } from 'next/font/google'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

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
  const [isNavOpen, setIsNavOpen] = useState(false)

  const handleNavToggle = () => {
    setIsNavOpen((prevIsNavOpen) => !prevIsNavOpen)
  }

  return (
    <html lang="en">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <ExternalLink
              height="1px"
              href="#skip-nav"
              left="-10000px"
              overflow="hidden"
              position="absolute"
              top="auto"
              width="1px"
            >
              Skip Main Navigation
            </ExternalLink>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  position: 'relative',
                }}
              >
                <Container id="skip-nav" maxWidth="lg" sx={{ flex: 1 }}>
                  <Box component="main" sx={{ py: 2 }}>
                    {children}
                  </Box>
                  <Footer />
                </Container>
                <Nav isNavOpen={isNavOpen} />
              </Box>

              <Header onNavToggle={handleNavToggle} />
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
        mode: prefersDarkMode ? 'dark' : 'light',
        ...themeOptions?.palette,
      },
      typography: {
        fontFamily: `var(--font-roboto)`,
        ...themeOptions?.typography,
      },
    })
  }, [themeOptions, prefersDarkMode])
}

const MenuIconButton = styled(IconButton)(({ theme }) => ({
  display: 'block',
  marginRight: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}))

interface HeaderProps {
  onNavToggle: () => void
}

function Header({ onNavToggle }: HeaderProps) {
  return (
    <AppBar
      color="primary"
      enableColorOnDark
      position="static"
      sx={{ order: -1, zIndex: 2 }}
    >
      <Toolbar>
        <MenuIconButton
          aria-label="Toggle side menu"
          color="inherit"
          edge="start"
          onClick={onNavToggle}
          size="large"
        >
          <MenuIcon />
        </MenuIconButton>
        <Typography component="span" noWrap variant="h6">
          devtools.benmvp.com
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

interface NavProps {
  isNavOpen: boolean
}

const StyledNav = styled(Paper)<NavProps>(({ isNavOpen, theme }) => ({
  background: theme.palette.background.paper,
  display: isNavOpen ? undefined : 'none',
  height: '100%',
  left: 0,
  minWidth: 250,
  order: -1,
  padding: theme.spacing(2),
  position: 'absolute',
  top: 0,
  zIndex: 1,
  [theme.breakpoints.up('md')]: {
    display: 'block',
    height: 'auto',
    position: 'relative',
  },
}))

function Nav({ isNavOpen }: NavProps) {
  const pathname = usePathname()

  return (
    <StyledNav
      isNavOpen={isNavOpen}
      square
      variant={isNavOpen ? 'elevation' : 'outlined'}
    >
      <Typography
        component="span"
        sx={{ alignItems: 'center', display: 'flex' }}
        variant="subtitle2"
      >
        <CodeIcon fontSize="large" sx={{ pr: 1 }} />
        Formatters
      </Typography>
      <List>
        <ListItemButton
          component={NextLink}
          href="/html-formatter"
          selected={pathname === '/html-formatter'}
        >
          <ListItemText primary="HTML Formatter" />
        </ListItemButton>
      </List>
    </StyledNav>
  )
}

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 2,
      }}
      textAlign="center"
    >
      Built with ♥️ by{' '}
      <ExternalLink href="https://benmvp.com">Ben Ilegbodu</ExternalLink> using{' '}
      <ExternalLink
        color="inherit"
        href="https://nextjs.org/"
        rel="noopener noreferrer"
        target="_blank"
        underline="always"
      >
        Next.js
      </ExternalLink>{' '}
      &amp;{' '}
      <ExternalLink
        color="inherit"
        href="https://mui.com/"
        rel="noopener noreferrer"
        target="_blank"
        underline="always"
      >
        MUI
      </ExternalLink>
      , deployed to{' '}
      <ExternalLink
        color="inherit"
        href="https://vercel.com/"
        rel="noopener noreferrer"
        target="_blank"
        underline="always"
      >
        Vercel
      </ExternalLink>
      .
    </Box>
  )
}
