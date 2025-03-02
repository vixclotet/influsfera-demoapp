import { NextResponse } from "next/server"
import { analyzeWebsite } from "@/lib/research-service"

// In-memory cache for storing analysis results
// Note: This will be cleared on serverless function cold starts
export const analysisCache = new Map<string, any>();

// Set a timeout for the analysis process
const ANALYSIS_TIMEOUT = 60000; // Increase to 60 seconds (1 minute) to give more time for analysis

// Maximum URL length for synchronous processing
const MAX_SYNC_URL_LENGTH = 100;

// Helper function to generate a consistent analysis ID
function generateAnalysisId(url: string) {
  // Remove query parameters and hash to create a more consistent ID
  try {
    const urlObj = new URL(url);
    // Create a simpler ID format that will be consistent between client and server
    // Use only the hostname and a timestamp, and ensure it's URL-safe
    return `${urlObj.hostname.replace(/\./g, '_')}_${Date.now()}`;
  } catch (e) {
    // If URL parsing fails, use a sanitized version of the original URL
    const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, '_');
    return `${sanitizedUrl}_${Date.now()}`;
  }
}

// Debug function to log cache state
function logCacheState(message: string, analysisId?: string) {
  console.log(`${message} - Cache size: ${analysisCache.size}`);
  if (analysisId) {
    console.log(`Cache has ID ${analysisId}: ${analysisCache.has(analysisId)}`);
    if (analysisCache.has(analysisId)) {
      console.log(`Cache entry status: ${analysisCache.get(analysisId).status}`);
    }
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Generate a unique ID for this analysis
    const analysisId = generateAnalysisId(url);
    logCacheState("Starting analysis", analysisId);
    
    // For simple URLs, try to process synchronously
    // This helps with cold starts since we don't rely on the cache
    if (url.length <= MAX_SYNC_URL_LENGTH && !url.includes(',') && !url.includes(';')) {
      try {
        console.log(`Processing simple URL synchronously: ${url}`);
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Analysis timed out")), ANALYSIS_TIMEOUT);
        });
        
        // Race the analysis against the timeout
        let result;
        try {
          result = await Promise.race([
            analyzeWebsite(url),
            timeoutPromise
          ]) as any;
          
          // Check if the result indicates a scraping error
          if (result.error && result.summary && result.summary.includes("Could not fully analyze this website")) {
            console.warn(`Synchronous analysis returned an error: ${result.error}`);
            // We'll still return the result, but it will contain error information
          }
        } catch (analysisError) {
          console.error("Error during synchronous analysis:", analysisError);
          // Create a default error response
          result = {
            websiteUrl: url,
            summary: `Analysis failed: ${analysisError instanceof Error ? analysisError.message : "Unknown error"}`,
            error: analysisError instanceof Error ? analysisError.message : "Unknown error",
            competitors: [],
            pricing: { summary: "Not available due to analysis error", competitors: [] },
            socialMedia: { summary: "Not available due to analysis error", platforms: [] },
            partnerships: { summary: "Not available due to analysis error", partnerships: [], recommendations: [] },
            offerings: { summary: "Not available due to analysis error", offerings: [] }
          };
        }
        
        // Store in cache for potential future requests
        try {
          analysisCache.set(analysisId, {
            status: "completed",
            data: result,
            timestamp: Date.now()
          });
          logCacheState("Completed synchronous analysis", analysisId);
        } catch (cacheError) {
          console.error("Error storing in cache:", cacheError);
          // Continue even if caching fails
        }
        
        // Return the result immediately
        return NextResponse.json({
          ...result,
          analysisId, // Include the ID in case client wants to reference it
          processingMethod: "synchronous"
        });
      } catch (syncError) {
        console.error("Synchronous processing failed, falling back to background:", syncError);
        // Fall back to background processing
      }
    }
    
    // Start the analysis in the background without awaiting it
    // This allows us to return quickly while the analysis continues
    try {
      startAnalysisInBackground(url, analysisId);
      logCacheState("Started background analysis", analysisId);
    } catch (backgroundError) {
      console.error("Error starting background analysis:", backgroundError);
      // Continue and return the ID anyway so client can check status
    }
    
    // Return immediately with the analysis ID
    return NextResponse.json({
      analysisId,
      status: "processing",
      message: "Analysis started. Use the /api/analysis-status endpoint to check for results.",
      websiteUrl: url,
      processingMethod: "background"
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
  // First, mark as processing in the cache
  try {
    analysisCache.set(analysisId, {
      status: "processing",
      timestamp: Date.now()
    });
    
    logCacheState("Set initial processing status", analysisId);
  } catch (cacheError) {
    console.error("Error setting initial cache status:", cacheError);
    // Continue even if initial caching fails
  }
  
  try {
    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Analysis timed out"));
      }, ANALYSIS_TIMEOUT);
    });

    try {
      // Race the analysis against the timeout
      let result;
      try {
        result = await Promise.race([
          analyzeWebsite(url),
          timeoutPromise
        ]) as any;
        
        // Check if the result indicates a scraping error
        if (result.error && result.summary && result.summary.includes("Could not fully analyze this website")) {
          console.warn(`Background analysis returned a scraping error: ${result.error}`);
          // We'll still store the result, but it will contain error information
        }
        
        // Store the result in the cache
        try {
          analysisCache.set(analysisId, {
            status: "completed",
            data: result,
            timestamp: Date.now()
          });
          
          logCacheState("Analysis completed successfully", analysisId);
          console.log(`Analysis completed for ${url} with ID ${analysisId}`);
        } catch (cacheError) {
          console.error("Error storing completed result in cache:", cacheError);
        }
      } catch (analysisError: any) {
        console.error("Error during website analysis:", analysisError);
        
        try {
          // If it's a timeout error, store a partial response
          if (analysisError.message === "Analysis timed out") {
            // Create a more informative timeout response
            const timeoutResponse = {
              websiteUrl: url,
              summary: "The analysis was started but couldn't be completed within the time limit. The information below represents what we were able to gather before the timeout.",
              isPartialResult: true,
              error: "Analysis timed out",
              competitors: [
                { 
                  name: "Competitor information may be incomplete", 
                  url: "", 
                  description: "The analysis timed out before complete competitor information could be gathered. Try analyzing the website again or try a different website." 
                },
                { 
                  name: "Competitor information may be incomplete", 
                  url: "", 
                  description: "The analysis timed out before complete competitor information could be gathered." 
                },
                { 
                  name: "Competitor information may be incomplete", 
                  url: "", 
                  description: "The analysis timed out before complete competitor information could be gathered." 
                },
                { 
                  name: "Competitor information may be incomplete", 
                  url: "", 
                  description: "The analysis timed out before complete competitor information could be gathered." 
                }
              ],
              pricing: { 
                summary: "Analysis timed out before complete pricing information could be gathered. The website may have complex pricing structures that require more time to analyze.", 
                competitors: [] 
              },
              socialMedia: { 
                summary: "Analysis timed out before complete social media information could be gathered.", 
                platforms: [] 
              },
              partnerships: { 
                summary: "Analysis timed out before complete partnership information could be gathered.", 
                existingPartnerships: [],
                recommendations: [
                  {
                    potentialPartner: "Analysis incomplete",
                    rationale: "Consider a manual review of the website to identify potential partnerships.",
                    growthPotential: "Unable to determine due to timeout"
                  }
                ]
              },
              offerings: { 
                summary: "Analysis timed out before complete offering information could be gathered.", 
                offerings: [] 
              }
            };
            
            analysisCache.set(analysisId, {
              status: "timeout",
              data: timeoutResponse,
              timestamp: Date.now()
            });
            
            logCacheState("Analysis timed out, stored partial response", analysisId);
          } else if (analysisError.message && analysisError.message.includes("Failed to scrape website")) {
            // Handle scraping errors specifically
            const scrapingErrorResponse = {
              websiteUrl: url,
              summary: `Could not analyze this website. Error: ${analysisError.message}`,
              error: analysisError.message,
              isPartialResult: true,
              competitors: [
                { 
                  name: "Not available", 
                  url: "", 
                  description: "Could not retrieve competitor information due to website scraping error." 
                },
                { 
                  name: "Not available", 
                  url: "", 
                  description: "Could not retrieve competitor information due to website scraping error." 
                },
                { 
                  name: "Not available", 
                  url: "", 
                  description: "Could not retrieve competitor information due to website scraping error." 
                },
                { 
                  name: "Not available", 
                  url: "", 
                  description: "Could not retrieve competitor information due to website scraping error." 
                }
              ],
              pricing: { 
                summary: "Not available due to website scraping error", 
                competitors: [] 
              },
              socialMedia: { 
                summary: "Not available due to website scraping error", 
                platforms: [] 
              },
              partnerships: { 
                summary: "Not available due to website scraping error", 
                existingPartnerships: [],
                recommendations: [
                  {
                    potentialPartner: "Not available",
                    rationale: "Try analyzing a different website or check if the URL is correct.",
                    growthPotential: "Not available due to scraping error"
                  }
                ]
              },
              offerings: { 
                summary: "Not available due to website scraping error", 
                offerings: [] 
              }
            };
            
            analysisCache.set(analysisId, {
              status: "error",
              data: scrapingErrorResponse,
              error: analysisError.message,
              timestamp: Date.now()
            });
            
            logCacheState("Analysis failed due to scraping error", analysisId);
          } else {
            // Store the error
            analysisCache.set(analysisId, {
              status: "error",
              error: analysisError.message,
              timestamp: Date.now()
            });
            
            logCacheState("Analysis error", analysisId);
          }
        } catch (cacheError) {
          console.error("Error storing error result in cache:", cacheError);
        }
      }
    } catch (error) {
      console.error("Error in background analysis:", error);
      try {
        analysisCache.set(analysisId, {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: Date.now()
        });
        
        logCacheState("Background analysis error", analysisId);
      } catch (cacheError) {
        console.error("Error storing background error in cache:", cacheError);
      }
    }
  } catch (error) {
    console.error("Error in background analysis:", error);
    try {
      analysisCache.set(analysisId, {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now()
      });
      
      logCacheState("Background analysis error", analysisId);
    } catch (cacheError) {
      console.error("Error storing background error in cache:", cacheError);
    }
  }
}

// Endpoint to check analysis status
export async function GET(req: Request) {
  const url = new URL(req.url);
  const analysisId = url.searchParams.get('id');
  const debugCache = url.searchParams.get('debug') === 'true';
  
  // If debug mode is enabled, return cache information
  if (debugCache) {
    const cacheEntries = Array.from(analysisCache.entries()).map(([key, value]) => ({
      id: key,
      status: value.status,
      timestamp: value.timestamp,
    }));
    
    return NextResponse.json({
      cacheSize: analysisCache.size,
      cacheEntries: cacheEntries,
    });
  }
  
  if (!analysisId) {
    return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 });
  }
  
  console.log(`Checking status for analysis ID: ${analysisId}`);
  logCacheState("Checking analysis status", analysisId);
  
  // Try to find the analysis in the cache
  // First try exact match
  let result = analysisCache.get(analysisId);
  
  // If not found, try to find by partial match (in case of encoding issues)
  if (!result) {
    console.log(`Exact match not found, trying partial match for: ${analysisId}`);
    // Look for entries that might match the base part of the ID
    const baseIdParts = analysisId.split('_');
    if (baseIdParts.length > 0) {
      const baseId = baseIdParts[0];
      for (const [key, value] of analysisCache.entries()) {
        if (key.includes(baseId)) {
          console.log(`Found potential match: ${key}`);
          result = value;
          break;
        }
      }
    }
  }
  
  if (!result) {
    console.log(`Analysis not found for ID: ${analysisId}`);
    return NextResponse.json({ 
      status: "not_found",
      message: "Analysis not found. It may have expired or never existed.",
      cacheSize: analysisCache.size,
      requestedId: analysisId
    }, { status: 404 });
  }
  
  // If analysis is complete or has error/timeout, return the data
  if (result.status === "completed") {
    console.log(`Returning completed analysis for ID: ${analysisId}`);
    return NextResponse.json(result.data);
  } else if (result.status === "timeout") {
    console.log(`Returning timeout result for ID: ${analysisId}`);
    return NextResponse.json(result.data);
  } else if (result.status === "error") {
    console.log(`Returning error for ID: ${analysisId}`);
    
    // Check if we have structured error data
    if (result.data) {
      return NextResponse.json(result.data);
    }
    
    // Otherwise return a generic error response
    return NextResponse.json({
      error: "Failed to analyze website",
      details: result.error || "Unknown error",
      websiteUrl: url.searchParams.get('url') || "Unknown URL",
      status: "error"
    }, { status: 500 });
  }
  
  // If still processing
  console.log(`Analysis still processing for ID: ${analysisId}`);
  return NextResponse.json({
    status: "processing",
    message: "Analysis is still in progress. Please check again in a few seconds."
  });
}

