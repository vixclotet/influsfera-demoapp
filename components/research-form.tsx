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
  "Researching their social media engagement metrics...",
  "Analyzing their SEO strategy with a fine-tooth comb...",
  "Investigating their customer service response times...",
  "Evaluating their product feature set against industry standards...",
  "Checking if their CEO has any interesting tweets...",
  "Comparing their pricing strategy to market averages...",
  "Analyzing their content marketing approach...",
  "Evaluating their user experience design choices...",
  "Researching their partnership ecosystem...",
  "This is taking a bit longer than expected, but we're still working on it...",
  "Complex websites require more analysis time, thanks for your patience...",
  "Almost there! Finalizing the competitive analysis...",
  "Gathering the last bits of information...",
  "Putting the finishing touches on your report...",
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
  const [loadingMessage, setLoadingMessage] = useState<string>("Starting analysis...")
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [retryCount, setRetryCount] = useState<number>(0)
  const MAX_RETRIES = 5
  const RETRY_DELAY = 3000 // 3 seconds

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

  // Update loading message based on elapsed time
  useEffect(() => {
    if (!isLoading) return;
    
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setLoadingProgress(Math.min(95, elapsedSeconds * 3)); // Cap at 95%
      
      if (elapsedSeconds < 5) {
        setLoadingMessage("Starting analysis and gathering website data...");
      } else if (elapsedSeconds < 10) {
        setLoadingMessage("Analyzing website content...");
      } else if (elapsedSeconds < 15) {
        setLoadingMessage("Identifying competitors and pricing information...");
      } else if (elapsedSeconds < 20) {
        setLoadingMessage("Analyzing social media presence and partnerships...");
      } else if (elapsedSeconds < 25) {
        setLoadingMessage("Finalizing analysis and preparing results...");
      } else {
        setLoadingMessage("This is taking longer than expected. Still working on your analysis...");
      }
    }, 1000);
    
    return () => clearInterval(progressInterval);
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

      // Step 1: Start the analysis
      try {
        const startResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: formattedUrl }),
        })

        if (!startResponse.ok) {
          const errorData = await startResponse.json();
          throw new Error(errorData.error || `HTTP error! status: ${startResponse.status}`);
        }

        // Get the response text first to debug
        const responseText = await startResponse.text();
        console.log("Raw analyze response:", responseText.substring(0, 200) + "...");
        
        // If empty response, throw error
        if (!responseText.trim()) {
          throw new Error("Empty response received from server");
        }
        
        // Parse the JSON
        let startData;
        try {
          startData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON parse error:", parseError, "Response was:", responseText);
          throw new Error("Failed to parse server response");
        }
        
        // Check if we got a synchronous result
        if (startData.processingMethod === "synchronous") {
          console.log("Received synchronous analysis result");
          setResults(startData);
          setIsLoading(false);
          toast({
            title: "Analysis Complete",
            description: "Website analysis has been successfully completed.",
          });
          return;
        }
        
        // Otherwise, we need to poll for results
        const analysisId = startData.analysisId;
        
        if (!analysisId) {
          throw new Error("No analysis ID returned from server");
        }
        
        // Step 2: Poll for results
        await pollForResults(analysisId);
        
      } catch (error: any) {
        console.error("Error in analysis:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        setError({ message: errorMessage });
        toast({
          title: "Error",
          description: `Failed to analyze website: ${errorMessage}`,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError({ message: errorMessage, details: err.details });
      toast({
        title: "Error",
        description: `Failed to analyze website: ${errorMessage}`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  const pollForResults = async (analysisId: string) => {
    try {
      setLoadingMessage("Checking for analysis results...");
      
      // Encode the analysis ID to ensure it's URL-safe
      const encodedAnalysisId = encodeURIComponent(analysisId);
      const response = await fetch(`/api/analysis-status?id=${encodedAnalysisId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // If we get a 404, the analysis ID might not be found
          // Try to debug the cache and retry with the most recent entry
          if (retryCount < MAX_RETRIES) {
            setLoadingMessage(`Analysis ID not found. Attempting retry ${retryCount + 1}/${MAX_RETRIES}...`);
            setRetryCount(prev => prev + 1);
            
            // Try to debug the cache
            const debugResponse = await fetch(`/api/analysis-status?debug=true`);
            if (debugResponse.ok) {
              const debugData = await debugResponse.json();
              console.log("Cache debug data:", debugData);
              
              // If we have cache entries, try to use the most recent one
              if (debugData.cacheEntries && debugData.cacheEntries.length > 0) {
                // Sort by timestamp (newest first)
                const sortedEntries = [...debugData.cacheEntries].sort((a, b) => b.timestamp - a.timestamp);
                const mostRecentEntry = sortedEntries[0];
                
                if (mostRecentEntry) {
                  setLoadingMessage(`Retrying with most recent cache entry from ${new Date(mostRecentEntry.timestamp).toLocaleTimeString()}...`);
                  
                  // Wait a moment before retrying
                  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                  
                  // Try to fetch the most recent entry
                  return pollForResults(mostRecentEntry.id);
                }
              }
            }
            
            // If we couldn't find a better entry, just retry after a delay
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return pollForResults(analysisId);
          } else {
            throw new Error("Analysis not found after multiple retries. Please try again.");
          }
        } else {
          throw new Error(`Error checking analysis status: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      
      // Check if the response contains an error
      if (data.error) {
        console.warn("Analysis returned with error:", data.error);
        
        // If we have structured data with an error, still show the results
        if (data.websiteUrl && data.summary) {
          setLoadingMessage("Analysis completed with some errors. Showing available results...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          setResults(data);
          setIsLoading(false);
          
          // Show a toast with the error
          toast({
            title: "Analysis Completed with Errors",
            description: data.error,
            variant: "warning",
          });
          return;
        }
        
        // Otherwise, treat it as a regular error
        throw new Error(data.error);
      }
      
      if (data.status === "processing") {
        // If still processing, poll again after a delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return pollForResults(analysisId);
      } else if (data.status === "timeout") {
        // If the analysis timed out, we still want to show the partial results
        setLoadingMessage("Analysis timed out, but we have partial results to show you.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        setResults(data.data);
        setIsLoading(false);
        
        // Show a toast with the timeout message
        toast({
          title: "Analysis Timed Out",
          description: "The analysis took longer than expected. Showing partial results.",
          variant: "warning",
        });
      } else if (data.status === "completed") {
        // Analysis is complete
        setLoadingMessage("Analysis complete! Preparing your results...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        setResults(data.data);
        setIsLoading(false);
        
        // Show a success toast
        toast({
          title: "Analysis Complete",
          description: "Website analysis has been successfully completed.",
        });
      } else if (data.status === "error") {
        throw new Error(data.error || "Unknown error during analysis");
      } else {
        throw new Error(`Unknown status: ${data.status}`);
      }
    } catch (error) {
      console.error("Error polling for results:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      setIsLoading(false);
      
      // Show an error toast
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

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

      <div className="space-y-8 mt-8">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <p className="text-center text-muted-foreground">{loadingMessage}</p>
            <Progress value={loadingProgress} className="w-full" />
            <p className="text-center text-xs text-muted-foreground">
              {loadingProgress < 95 
                ? `Analysis in progress (${loadingProgress}%)` 
                : "Almost done! Finalizing results..."}
            </p>
          </div>
        ) : (
          <Card className="p-6 theme-transition">
            {error && (
              <Card className="p-6 bg-red-50 border-red-200">
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-600">{error.message}</p>
                {error.details && <p className="text-red-600">Details: {error.details}</p>}
              </Card>
            )}

            {results && <ResearchResults results={results} />}
          </Card>
        )}
      </div>
    </div>
  )
}

