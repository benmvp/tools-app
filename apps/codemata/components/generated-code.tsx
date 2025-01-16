'use client'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
  Chip,
  Divider,
  TextField,
  IconButton,
  Box,
  Tooltip,
  Snackbar,
} from '@mui/material'
import { useState } from 'react'

interface GeneratedCodeProps {
  code: string
  title: string
}

export function GeneratedCode({ code, title }: GeneratedCodeProps) {
  const [copied, setCopied] = useState(false)

  if (!code) {
    return null
  }

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      // failed to copy to clipboard
    }
  }

  return (
    <>
      <Divider>
        <Chip label={title} size="medium" />
      </Divider>

      <Box sx={{ position: 'relative' }}>
        <TextField
          autoComplete="off"
          fullWidth
          maxRows={15}
          minRows={5}
          multiline
          name="generatedCode"
          sx={{
            '& .MuiInputBase-root': {
              // Target the input element within the TextField
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '0.75rem',
            },
          }}
          value={code}
          variant="filled"
        />
        <Tooltip title="Copy code">
          <IconButton
            aria-label="Copy code"
            onClick={() => void handleCopyClick()}
            size="large"
            sx={(theme) => ({
              position: 'absolute',
              right: theme.spacing(1),
              top: theme.spacing(1),
            })}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        autoHideDuration={2000}
        message="Code copied to clipboard"
        onClose={() => {
          setCopied(false)
        }}
        open={copied}
      />
    </>
  )
}
