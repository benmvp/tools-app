'use client'

import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import type { TransformerAction, TransformerConfig } from '../types'
import { GeneratedCode } from './generated-code'

interface TransformerProps {
  action: TransformerAction
  actionLabel: string
  configs?: TransformerConfig[]
  displayName: string
  stateLabel: string
}

export function TransformerUi({
  action,
  actionLabel,
  configs,
  displayName,
  stateLabel,
}: TransformerProps) {
  const [transformedCode, setTransformedCode] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const updateTransformedCode = async () => {
      const formData = new FormData(e.currentTarget)

      setTransformedCode(await action(formData))
    }

    void updateTransformedCode()
  }

  return (
    <>
      <TransformerForm
        actionLabel={actionLabel}
        configs={configs}
        name={displayName}
        onSubmit={handleSubmit}
      />
      <GeneratedCode
        code={transformedCode}
        title={`${stateLabel} ${displayName}`}
      />
    </>
  )
}

function TransformerForm({
  actionLabel,
  configs,
  name,
  onSubmit,
}: {
  actionLabel: string
  configs?: TransformerConfig[]
  name: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Stack action="post" component="form" onSubmit={onSubmit} spacing={3}>
      <TextField
        label={name}
        maxRows={20}
        minRows={10}
        multiline
        name="code"
        placeholder={`Paste ${name} here`}
        required
        sx={{
          '& .MuiInputBase-root': {
            // Target the input element within the TextField
            fontFamily: 'Consolas, Monaco, monospace',
            fontSize: '0.75rem',
          },
        }}
      />

      {configs?.map((config) => (
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
        {actionLabel} {name}
      </Button>
    </Stack>
  )
}
