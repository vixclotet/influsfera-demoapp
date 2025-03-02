import { NextResponse } from "next/server"
import { analyzeWebsite } from "@/lib/research-service"

// In-memory cache for storing analysis results
// Note: This will be cleared on serverless function cold starts
const analysisCache = new Map<string, any>();

// Set a timeout for the analysis process
const ANALYSIS_TIMEOUT = 9500; // Just under Vercel's 10s limit

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Generate a unique ID for this analysis
    const analysisId = `${url}_${Date.now()}`;
    
    // Start the analysis in the background without awaiting it
    // This allows us to return quickly while the analysis continues
    startAnalysisInBackground(url, analysisId);
    
    // Return immediately with the analysis ID
    return NextResponse.json({
      analysisId,
      status: "processing",
      message: "Analysis started. Use the /api/analysis-status endpoint to check for results.",
      websiteUrl: url
    });
    
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

// Function to start analysis in background
async function startAnalysisInBackground(url: string, analysisId: string) {
  try {
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
      
      // Store the result in the cache
      analysisCache.set(analysisId, {
        status: "completed",
        data: result,
        timestamp: Date.now()
      });
      
      console.log(`Analysis completed for ${url} with ID ${analysisId}`);
      
    } catch (analysisError: any) {
      console.error("Error during website analysis:", analysisError);
      
      // If it's a timeout error, store a partial response
      if (analysisError.message === "Analysis timed out") {
        analysisCache.set(analysisId, {
          status: "timeout",
          data: {
            websiteUrl: url,
            summary: "Analysis was started but couldn't be completed within the time limit. Try again with a simpler website or contact support for assistance.",
            isPartialResult: true,
            error: "Analysis timed out"
          },
          timestamp: Date.now()
        });
      } else {
        // Store the error
        analysisCache.set(analysisId, {
          status: "error",
          error: analysisError.message,
          timestamp: Date.now()
        });
      }
    }
  } catch (error) {
    console.error("Error in background analysis:", error);
    analysisCache.set(analysisId, {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: Date.now()
    });
  }
}

// Endpoint to check analysis status
export async function GET(req: Request) {
  const url = new URL(req.url);
  const analysisId = url.searchParams.get('id');
  
  if (!analysisId) {
    return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 });
  }
  
  const result = analysisCache.get(analysisId);
  
  if (!result) {
    return NextResponse.json({ 
      status: "not_found",
      message: "Analysis not found. It may have expired or never existed."
    }, { status: 404 });
  }
  
  // If analysis is complete or has error/timeout, return the data
  if (result.status === "completed") {
    return NextResponse.json(result.data);
  } else if (result.status === "timeout") {
    return NextResponse.json(result.data);
  } else if (result.status === "error") {
    return NextResponse.json({
      error: "Failed to analyze website",
      details: result.error
    }, { status: 500 });
  }
  
  // If still processing
  return NextResponse.json({
    status: "processing",
    message: "Analysis is still in progress. Please check again in a few seconds."
  });
}

