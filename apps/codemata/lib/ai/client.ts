import { GoogleGenerativeAI, type Schema } from "@google/generative-ai";

import { buildGeminiSchema } from "./gemini-schema";

/**
 * Maximum timeout for the entire API call sequence (including retries)
 * Set to 28 seconds based on observed API response times (14-26s typical)
 * Leaves 2s buffer before the 30s maxDuration limit
 */
const API_TIMEOUT_MS = 28000;

/**
 * Timeout wrapper for async operations
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    ),
  ]);
}

// Get API key from environment
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is required");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(API_KEY);

// Get model name from environment or use default
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";

/**
 * Get Gemini model configured for JSON output with schema
 */
export function getGeminiModel() {
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: buildGeminiSchema() as Schema,
    },
  });
}

/**
 * Retry configuration for API calls
 * With 25s timeout budget, we can afford 3 retries with exponential backoff
 */
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

/**
 * Call Gemini API with retry logic and exponential backoff
 * Wrapped in a timeout to prevent exceeding Vercel's serverless function limits
 */
export async function callGeminiWithRetry<T>(
  systemMessage: string,
  userMessage: string,
): Promise<T | undefined> {
  const startTime = Date.now();

  try {
    return await withTimeout(
      (async () => {
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          const attemptStart = Date.now();
          try {
            const model = getGeminiModel();

            // Combine system and user messages (Gemini doesn't have separate system role)
            const prompt = `${systemMessage}\n\n${userMessage}`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Parse JSON response
            const parsed = JSON.parse(text) as T;
            const elapsed = Date.now() - startTime;
            console.log(
              `Gemini API success (attempt ${attempt}, ${elapsed}ms total)`,
            );
            return parsed;
          } catch (error) {
            lastError = error as Error;
            const attemptElapsed = Date.now() - attemptStart;
            console.error(
              `Gemini API call failed (attempt ${attempt}/${MAX_RETRIES}, ${attemptElapsed}ms):`,
              lastError.message,
            );

            // Don't retry on last attempt
            if (attempt < MAX_RETRIES) {
              // Exponential backoff: 1s, 2s, 4s
              const delay = INITIAL_DELAY_MS * 2 ** (attempt - 1);
              console.log(`Retrying in ${delay}ms...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        }

        // All retries failed
        const totalElapsed = Date.now() - startTime;
        console.error(
          `All Gemini API retry attempts failed (${totalElapsed}ms total):`,
          lastError?.message || "Unknown error",
        );
        return undefined;
      })(),
      API_TIMEOUT_MS,
    );
  } catch (error) {
    const totalElapsed = Date.now() - startTime;
    console.error(
      `Gemini API timed out after ${totalElapsed}ms:`,
      (error as Error).message,
    );
    return undefined;
  }
}
