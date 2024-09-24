'use client'

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
} from '@mui/material'
import type { Options } from 'prettier'
import htmlParser from 'prettier/parser-html'
import { format } from 'prettier/standalone'
import { useState } from 'react'

type Indentation = 'two-spaces' | 'four-spaces' | 'tabs'

export default function HtmlFormatter() {
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
      <Typography variant="h1">HTML Formatter</Typography>

      <Stack spacing={5}>
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
  if (!code) {
    return null
  }

  return (
    <>
      <Divider>
        <Chip label={title} size="medium" />
      </Divider>
      <TextField
        autoComplete="off"
        maxRows={15}
        multiline
        name="formattedCode"
        value={code}
      />
    </>
  )
}
