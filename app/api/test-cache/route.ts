import { NextResponse } from "next/server"
import { analysisCache } from "../analyze/route"

export async function GET() {
  try {
    // Check if the cache is available
    if (!analysisCache) {
      return NextResponse.json({
        status: "error",
        message: "Cache is not available"
      }, { status: 500 });
    }
    
    // Create a test entry
    const testId = `test_${Date.now()}`;
    analysisCache.set(testId, {
      status: "test",
      timestamp: Date.now()
    });
    
    // Get the size of the cache
    const cacheSize = analysisCache.size;
    
    // Get all keys in the cache
    const cacheKeys = Array.from(analysisCache.keys());
    
    return NextResponse.json({
      status: "success",
      message: "Cache test successful",
      cacheSize,
      testId,
      cacheKeys: cacheKeys.slice(0, 10) // Show up to 10 keys
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Cache test failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 