import { NextResponse } from "next/server"

// Import the analysis cache from the analyze route
// This is a reference to the same Map object
import { analysisCache } from "../analyze/route"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const analysisId = url.searchParams.get('id');
    
    if (!analysisId) {
      return NextResponse.json({ 
        status: "error",
        error: "Analysis ID is required" 
      }, { status: 400 });
    }
    
    // Check if analysisCache is defined
    if (!analysisCache) {
      console.error("Analysis cache is not available");
      return NextResponse.json({ 
        status: "error",
        error: "Analysis service is not initialized properly" 
      }, { status: 500 });
    }
    
    console.log(`Checking status for analysis ID: ${analysisId}`);
    console.log(`Cache size: ${analysisCache.size}`);
    console.log(`Cache has this ID: ${analysisCache.has(analysisId)}`);
    
    // List a few keys from the cache for debugging
    if (analysisCache.size > 0) {
      const keys = Array.from(analysisCache.keys()).slice(0, 5);
      console.log(`Some cache keys: ${keys.join(', ')}`);
    }
    
    const result = analysisCache.get(analysisId);
    
    if (!result) {
      console.log(`Analysis not found for ID: ${analysisId}`);
      return NextResponse.json({ 
        status: "not_found",
        message: "Analysis not found. It may have expired or never existed."
      }, { status: 404 });
    }
    
    console.log(`Found result with status: ${result.status}`);
    
    // If analysis is complete or has error/timeout, return the data
    if (result.status === "completed") {
      return NextResponse.json(result.data || {
        status: "error",
        error: "Result marked as completed but no data found"
      });
    } else if (result.status === "timeout") {
      return NextResponse.json(result.data || {
        status: "timeout",
        error: "Analysis timed out",
        isPartialResult: true
      });
    } else if (result.status === "error") {
      return NextResponse.json({
        status: "error",
        error: "Failed to analyze website",
        details: result.error || "Unknown error"
      }, { status: 500 });
    }
    
    // If still processing
    return NextResponse.json({
      status: "processing",
      message: "Analysis is still in progress. Please check again in a few seconds."
    });
  } catch (error) {
    console.error("Error in analysis-status endpoint:", error);
    return NextResponse.json({
      status: "error",
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 