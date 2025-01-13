import type { LinkProps as MuiLinkProps } from '@mui/material'
import { Link as MuiLink } from '@mui/material'
import type { LinkProps as NextLinkProps } from 'next/link'
import NextLink from 'next/link'
import { forwardRef } from 'react'

// `LinkProps` is the combination of the MUI `LinkProps` and the Next `LinkProps`
// We wanna use the `href` prop from `next/link` so we omit it from MUI's.
export type LinkProps = Omit<MuiLinkProps, 'href'> &
  Omit<NextLinkProps, 'as' | 'passHref' | 'children'>

/**
 * A convenience component that wraps the MUI `Link` component that provides
 * our look & feel with Next's router `Link`
 *
 * @see https://next.js.org/docs/api-reference/next/link
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, locale, prefetch, replace, scroll, shallow, ...muiProps },
  ref,
) {
  return (
    <NextLink
      href={href}
      legacyBehavior
      locale={locale}
      passHref
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
    >
      <MuiLink ref={ref} {...muiProps} />
    </NextLink>
  )
})
