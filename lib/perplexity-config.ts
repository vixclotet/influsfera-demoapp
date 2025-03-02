import OpenAI from "openai";

// Check for API key with a warning instead of an error
const apiKey = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;
if (!apiKey) {
  console.warn("Warning: NEXT_PUBLIC_PERPLEXITY_API_KEY is not set in the environment variables. API calls will fail.");
}

export const perplexity = new OpenAI({
  apiKey: apiKey || "dummy-key", // Use a dummy key to prevent initialization errors
  baseURL: "https://api.perplexity.ai",
});

// Test function to check if the Perplexity API is accessible
export async function testPerplexityAPI() {
  try {
    console.log("Testing Perplexity API accessibility...")
    console.log("API Key exists:", !!process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY)
    
    if (!process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY) {
      console.warn("Cannot test Perplexity API: No API key provided");
      return false;
    }

    const response = await perplexity.chat.completions.create({
      model: "sonar",
      messages: [{ role: "user", content: "Hello, are you accessible?" }],
    });

    console.log("Perplexity API response received");
    return true
  } catch (error) {
    console.error("Error accessing Perplexity API:", error)
    return false
  }
}

