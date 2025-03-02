import { NextResponse } from "next/server"
import { analyzeWebsite } from "@/lib/research-service"

// Set a timeout for the analysis process
const ANALYSIS_TIMEOUT = 8000; // 8 seconds (to stay under Vercel's 10s limit)

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Analysis timed out"));
      }, ANALYSIS_TIMEOUT);
    });

    try {
      // Race the analysis against the timeout
      const result = await Promise.race([
        analyzeWebsite(url),
        timeoutPromise
      ]) as any;
      
      return NextResponse.json(result);
    } catch (analysisError: any) {
      console.error("Error during website analysis:", analysisError);
      
      // If it's a timeout error, return a partial response
      if (analysisError.message === "Analysis timed out") {
        return NextResponse.json({
          websiteUrl: url,
          summary: "Analysis was started but couldn't be completed within the time limit. Try again with a simpler website or contact support for assistance.",
          isPartialResult: true,
          error: "Analysis timed out"
        }, { status: 200 }); // Return 200 with partial data instead of error
      }
      
      return NextResponse.json(
        {
          error: "Failed to analyze website",
          details: analysisError.message,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

