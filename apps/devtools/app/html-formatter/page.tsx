'use client'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Snackbar,
} from '@mui/material'
import type { Options } from 'prettier'
import htmlParser from 'prettier/parser-html'
import { format } from 'prettier/standalone'
import { useState } from 'react'

type Indentation = 'two-spaces' | 'four-spaces' | 'tabs'

export default function HtmlFormatterPage() {
  const [formattedHtml, setFormattedHtml] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const updateFormattedHtml = async () => {
      const formData = new FormData(e.currentTarget)
      const rawHtml = formData.get('html')?.toString()
      const indentation = formData.get('indentation')?.toString() as
        | Indentation
        | undefined

      setFormattedHtml(await getPrettyHtml(rawHtml, indentation))
    }

    void updateFormattedHtml()
  }

  return (
    <>
      <Typography component="h1" variant="h6">
        HTML Formatter
      </Typography>

      <Stack spacing={5} useFlexGap>
        <Typography mb={4} variant="body1">
          Description here
        </Typography>

        <Stack
          action="post"
          component="form"
          onSubmit={handleSubmit}
          spacing={3}
        >
          <TextField
            label="Copy & paste your HTML"
            maxRows={20}
            minRows={10}
            multiline
            name="html"
            placeholder="Copy & paste your HTML here"
            required
          />

          <FormControl>
            <FormLabel id="indentation-label">Indentation</FormLabel>
            <RadioGroup
              aria-labelledby="indentation-label"
              defaultValue="two-spaces"
              name="indentation"
              row
            >
              <FormControlLabel
                control={<Radio />}
                label="2 spaces"
                value="two-spaces"
              />
              <FormControlLabel
                control={<Radio />}
                label="4 spaces"
                value="four-spaces"
              />
              <FormControlLabel control={<Radio />} label="Tabs" value="tabs" />
            </RadioGroup>
          </FormControl>

          <Button
            sx={{ alignSelf: 'flex-start' }}
            type="submit"
            variant="contained"
          >
            Format HTML
          </Button>
        </Stack>

        <FormattedCode code={formattedHtml} title="Formatted HTML" />
      </Stack>
    </>
  )
}

function getPrettyHtml(rawHtml?: string, indentation?: Indentation) {
  if (!rawHtml) {
    return ''
  }

  const prettierOptions: Options = {
    parser: 'html',
    plugins: [htmlParser],
  }

  if (indentation === 'tabs') {
    prettierOptions.useTabs = true
  } else {
    prettierOptions.tabWidth = indentation === 'four-spaces' ? 4 : 2
  }

  return format(rawHtml, prettierOptions)
}

function FormattedCode({ code, title }: { code: string; title: string }) {
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
          multiline
          name="formattedCode"
          value={code}
          variant="filled"
        />
        <Tooltip title="Copy formatted code">
          <IconButton
            aria-label="Copy formatted code"
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
        message="Formatted code copied to clipboard"
        onClose={() => {
          setCopied(false)
        }}
        open={copied}
      />
    </>
  )
}
