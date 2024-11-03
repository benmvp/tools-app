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
  IconButton,
  Box,
  Tooltip,
  Snackbar,
} from '@mui/material'
import { useState } from 'react'
import { getFormatterById } from './formatters'
import type { FormatterId } from './formatters'

interface FormatterProps {
  id: FormatterId
}

export function Formatter({ id }: FormatterProps) {
  const formatter = getFormatterById(id)
  const [formattedCode, setFormattedCode] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const updateFormattedCode = async () => {
      const formData = new FormData(e.currentTarget)

      setFormattedCode(await formatter.format(formData))
    }

    void updateFormattedCode()
  }

  return (
    <>
      <FormatterForm id={id} onSubmit={handleSubmit} />
      <FormattedCode
        code={formattedCode}
        title={`Formatted ${formatter.display}`}
      />
    </>
  )
}

function FormatterForm({
  id,
  onSubmit,
}: {
  id: FormatterId
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  const formatter = getFormatterById(id)

  return (
    <Stack action="post" component="form" onSubmit={onSubmit} spacing={3}>
      <TextField
        label={`Copy & paste your ${formatter.display}`}
        maxRows={20}
        minRows={10}
        multiline
        name="code"
        placeholder={`Copy & paste your ${formatter.display} here`}
        required
        sx={{
          '& .MuiInputBase-root': {
            // Target the input element within the TextField
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: '0.75rem',
          },
        }}
      />

      {formatter.configs.map((config) => (
        <FormControl key={config.id}>
          <FormLabel id="indentation-label">{config.label}</FormLabel>
          <RadioGroup
            aria-labelledby="indentation-label"
            defaultValue={config.options[0]?.value}
            name={config.id}
            row
          >
            {config.options.map(({ label, value }) => (
              <FormControlLabel
                control={<Radio />}
                key={value}
                label={label}
                value={value}
              />
            ))}
          </RadioGroup>
        </FormControl>
      ))}

      <Button
        sx={{ alignSelf: 'flex-start' }}
        type="submit"
        variant="contained"
      >
        Format {formatter.display}
      </Button>
    </Stack>
  )
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
