"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ResearchResults } from "@/components/research-results"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

// Entertaining loading messages
const loadingMessages = [
  "Stalking competitors on social media...",
  "Hacking into their pricing database... (just kidding, it's public info)",
  "Sending spies to their headquarters... (virtually, of course)",
  "Analyzing their website with a magnifying glass...",
  "Interviewing their ex-employees... (in our imagination)",
  "Decoding their marketing strategy...",
  "Calculating how many coffees their team drinks...",
  "Counting the number of stock photos on their website...",
  "Measuring the exact shade of blue in their logo...",
  "Checking if they actually respond to their contact form...",
  "Reading all 50 pages of their terms and conditions...",
  "Translating their mission statement from corporate-speak...",
  "Analyzing their font choices with extreme prejudice...",
  "Judging their website's mobile responsiveness...",
  "Counting how many times they say 'innovative' and 'disruptive'...",
];

function formatUrl(input: string): string {
  // Remove any leading or trailing whitespace
  let url = input.trim()

  // Check if the URL starts with http:// or https://
  if (!/^https?:\/\//i.test(url)) {
    // If it doesn't, add https://
    url = "https://" + url
  }

  // Check if the URL has a valid domain structure
  const domainRegex = /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+/
  if (!domainRegex.test(url)) {
    throw new Error("Invalid URL format")
  }

  return url
}

export function ResearchForm() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState("")

  // Effect to handle the progress bar and loading messages
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let messageInterval: NodeJS.Timeout;
    
    if (isLoading) {
      // Reset progress
      setProgress(0);
      
      // Set initial loading message
      setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      
      // Progress bar animation
      progressInterval = setInterval(() => {
        setProgress(prev => {
          // Slow down as we approach 90%
          if (prev < 90) {
            return prev + (90 - prev) / 50;
          }
          return prev;
        });
      }, 300);
      
      // Change loading message every 3 seconds
      messageInterval = setInterval(() => {
        setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
      }, 3000);
    } else if (progress > 0) {
      // When loading completes, fill the progress bar to 100%
      setProgress(100);
    }
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    try {
      const formattedUrl = formatUrl(url)
      setIsLoading(true)
      setResults(null)

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formattedUrl }),
      })

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`)
        }
        console.log("Received data from API:", data)
        
        // Check if it's a partial result due to timeout
        if (data.isPartialResult) {
          toast({
            title: "Analysis Timeout",
            description: "The analysis took too long to complete. Showing partial results.",
            variant: "warning",
          })
        } else {
          toast({
            title: "Analysis Complete",
            description: "Website analysis has been successfully completed.",
          })
        }
        
        setResults(data)
      } else {
        // If the response is not JSON, read it as text
        const text = await response.text()
        console.error("Received non-JSON response:", text)
        
        // Handle Vercel timeout errors specifically
        if (text.includes("FUNCTION_INVOCATION_TIMEOUT")) {
          toast({
            title: "Analysis Timeout",
            description: "The analysis took too long to complete. Please try a simpler website.",
            variant: "destructive",
          })
          setError({ 
            message: "The analysis took too long to complete. Please try a simpler website or try again later.",
            details: "This can happen with complex websites or during high server load."
          })
        } else {
          setError({ message: `Received non-JSON response: ${text.substring(0, 100)}...` })
        }
      }
    } catch (err: any) {
      console.error("Error in handleSubmit:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError({ message: errorMessage, details: err.details })
      toast({
        title: "Error",
        description: `Failed to analyze website: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-8">
      <Card className="p-6 theme-transition">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Enter your website URL
            </label>
            <div className="flex w-full items-center space-x-2">
              <Input
                id="url"
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Research</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {isLoading && (
        <Card className="p-6 theme-transition">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Researching your competitors...</h3>
            <Progress value={progress} className="h-2 w-full" />
            <p className="text-sm text-muted-foreground animate-pulse">{loadingMessage}</p>
            <p className="text-xs text-muted-foreground">This might take a minute or two. We're gathering comprehensive data.</p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800">Error</h3>
          <p className="text-red-600">{error.message}</p>
          {error.details && <p className="text-red-600">Details: {error.details}</p>}
        </Card>
      )}

      {results && <ResearchResults results={results} />}
    </div>
  )
}

