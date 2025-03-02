import { NextResponse } from "next/server"
import { analyzeWebsite } from "@/lib/research-service"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    try {
      const result = await analyzeWebsite(url)
      return NextResponse.json(result)
    } catch (analysisError: any) {
      console.error("Error during website analysis:", analysisError)
      return NextResponse.json(
        {
          error: "Failed to analyze website",
          details: analysisError.message,
          stack: analysisError.stack,
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
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}

