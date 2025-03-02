import OpenAI from "openai";

if (!process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY) {
  console.error("NEXT_PUBLIC_PERPLEXITY_API_KEY is not set in the environment variables")
  throw new Error("NEXT_PUBLIC_PERPLEXITY_API_KEY is not set in the environment variables")
}

export const perplexity = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

// Test function to check if the Perplexity API is accessible
export async function testPerplexityAPI() {
  try {
    console.log("Testing Perplexity API accessibility...")
    console.log("API Key exists:", !!process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY)
    console.log("API Key length:", process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY?.length)

    const response = await perplexity.chat.completions.create({
      model: "sonar",
      messages: [{ role: "user", content: "Hello, are you accessible?" }],
    });

    console.log("Perplexity API response:", response)
    return true
  } catch (error) {
    console.error("Error accessing Perplexity API:", error)
    return false
  }
}

