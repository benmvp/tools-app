import { dirname, resolve } from 'node:path'
import { ensureDir, readJson, writeJson } from 'fs-extra'
import { default as OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import pLimit from 'p-limit'
import { z } from 'zod'
import { contentSectionSchema } from '../components/content-section-ui'

const toolContentSchema = z.object({
  faq: contentSectionSchema.describe(
    'The frequently asked questions of the tool.',
  ),
  features: contentSectionSchema.describe(
    'The features and benefits of the tool.',
  ),
  howToUse: contentSectionSchema.describe(
    'The instruction steps to use the tool.',
  ),
  integrate: contentSectionSchema.describe(
    "How to integrate the tool into the user's workflow.",
  ),
  intro: z.string().describe('The introductory paragraph of the tool.'),
  purpose: contentSectionSchema.describe(
    'Explains the language the tool is designed.',
  ),
  rationale: contentSectionSchema.describe(
    'Why using an online tool for this language is beneficial.',
  ),
  recommendations: contentSectionSchema.describe(
    'Links to other relevant tools.',
  ),
  resources: contentSectionSchema.describe('Links to external resources.'),
  seo: z
    .object({
      description: z.string(),
      keywords: z.string(),
      title: z.string().describe('The title of the HTML document.'),
    })
    .describe('SEO meta tags.'),
})

export type ToolContent = z.infer<typeof toolContentSchema>

// Limit the number of requests to the AI API to avoid rate limiting.
const limit = pLimit(1)

// Production request cache to avoid duplicate requests
const REQUEST_CACHE = new Map<string, unknown>()

// Development file-system cache across file changes
const CACHE_DIR = 'app/.ai-cache'

export async function getCachedToolContent<T>(
  cacheKey: string,
  systemMessage: string,
  userMessage: string,
  options?: Omit<
    OpenAI.ChatCompletionCreateParams.ChatCompletionCreateParamsNonStreaming,
    'messages' | 'model'
  >,
) {
  return limit(async () => {
    const cachedContent = await getCachedContent<T>(cacheKey)

    if (cachedContent) {
      return cachedContent
    }

    const content = await getToolContent<T>(systemMessage, userMessage, options)

    await saveCachedContent(cacheKey, content)

    return content
  })
}

export async function getToolContent<T>(
  systemMessage: string,
  userMessage: string,
  options?: Omit<
    OpenAI.ChatCompletionCreateParams.ChatCompletionCreateParamsNonStreaming,
    'messages' | 'model'
  >,
): Promise<T | undefined> {
  const client = new OpenAI({
    apiKey: process.env.AI_API_KEY || undefined,
    baseURL: process.env.AI_BASE_URL,
  })

  try {
    const response = await client.beta.chat.completions.parse({
      ...options,
      messages: [
        { content: systemMessage, role: 'system' },
        {
          content: userMessage,
          role: 'user',
        },
      ],
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      n: 1,
      response_format: zodResponseFormat(toolContentSchema, 'content'),
    })

    const responseContent = response.choices[0]?.message.content

    return responseContent ? (JSON.parse(responseContent) as T) : undefined
  } catch (error) {
    // eslint-disable-next-line no-console -- testing
    console.error('AI request failed', (error as Error).message)
    // throw for Next.js handling
    throw error
  }
}

export async function getCachedContent<T = string>(
  cacheKey: string,
): Promise<T | undefined> {
  if (process.env.NODE_ENV === 'production' && REQUEST_CACHE.has(cacheKey)) {
    // in-memory cache hit for production
    return REQUEST_CACHE.get(cacheKey) as T
  }

  if (process.env.NODE_ENV !== 'development') {
    return undefined
  }

  try {
    const cachePath = getCachePath(cacheKey)
    const cachedData = (await readJson(cachePath)) as T

    // file-system cache hit for development

    return cachedData
  } catch {
    return undefined
  }
}

export async function saveCachedContent(cacheKey: string, content: unknown) {
  if (process.env.NODE_ENV === 'production') {
    REQUEST_CACHE.set(cacheKey, content)
    return
  }

  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const cachePath = getCachePath(cacheKey)

  await ensureDir(dirname(cachePath))
  await writeJson(cachePath, content)
}

function getCachePath(cacheKey: string) {
  return resolve(process.cwd(), CACHE_DIR, `${cacheKey}.json`)
}
