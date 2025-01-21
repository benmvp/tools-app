import { dirname, resolve } from 'node:path'
import { ensureDir, readJson, writeJson } from 'fs-extra'
import { default as OpenAI } from 'openai'

const CACHE_DIR = 'app/.ai-cache'

export async function getCachedContent<T = string>(cacheKey: string) {
  if (process.env.USE_TOOL_CONTENT_CACHE !== 'true') {
    return undefined
  }

  try {
    const cachePath = getCachePath(cacheKey)

    const cachedData = (await readJson(cachePath)) as T

    // console.log(`Cache hit for ${cacheKey}`)

    return cachedData
  } catch {
    return undefined
  }
}

export async function saveCachedContent(cacheKey: string, content: unknown) {
  if (process.env.USE_TOOL_CONTENT_CACHE !== 'true') {
    return
  }

  const cachePath = getCachePath(cacheKey)

  await ensureDir(dirname(cachePath))
  await writeJson(cachePath, content)

  // console.log(`Cached ${cacheKey}`)
}

function getCachePath(cacheKey: string) {
  return resolve(process.cwd(), CACHE_DIR, `${cacheKey}.json`)
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
    // apiKey: process.env.GEMINI_API_KEY,
    // baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const response = await client.chat.completions.create({
      ...options,
      messages: [
        { content: systemMessage, role: 'system' },
        {
          content: userMessage,
          role: 'user',
        },
      ],
      // model: 'gemini-1.5-pro',
      model: 'gpt-4o',
      n: 1,
    })

    const responseContent = response.choices[0]?.message.content

    return responseContent ? (JSON.parse(responseContent) as T) : undefined
  } catch (error) {
    // console.error('AI request failed', error)
  }
}
