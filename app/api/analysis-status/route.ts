import { NextResponse } from "next/server"

// Import the analysis cache from the analyze route
// This is a reference to the same Map object
import { analysisCache } from "../analyze/route"

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