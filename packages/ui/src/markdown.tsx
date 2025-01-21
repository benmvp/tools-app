'use client'

import { styled } from '@mui/material'
import ReactMarkdown from 'react-markdown'

export const Markdown = styled(ReactMarkdown)(({ theme }) => ({
  '& a:not(.anchor)': {
    color: theme.palette.primary.main,
  },
  '& p, & h2, & h3, & h4, & h5, & h6, & ul, & ol': {
    margin: 0,
  },
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))
