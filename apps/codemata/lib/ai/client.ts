import { GoogleGenerativeAI, type Schema } from "@google/generative-ai";

import { buildGeminiSchema } from "./gemini-schema";

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
 */
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

/**
 * Call Gemini API with retry logic and exponential backoff
 */
export async function callGeminiWithRetry<T>(
  systemMessage: string,
  userMessage: string,
): Promise<T | undefined> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = getGeminiModel();

      // Combine system and user messages (Gemini doesn't have separate system role)
      const prompt = `${systemMessage}\n\n${userMessage}`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse JSON response
      return JSON.parse(text) as T;
    } catch (error) {
      lastError = error as Error;
      console.error(
        `Gemini API call failed (attempt ${attempt}/${MAX_RETRIES}):`,
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
  console.error(
    "All Gemini API retry attempts failed:",
    lastError?.message || "Unknown error",
  );
  return undefined;
}
