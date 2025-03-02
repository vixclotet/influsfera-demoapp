import { perplexity } from "./perplexity-config"

// New function to scrape website content
async function scrapeWebsite(url: string) {
  try {
    console.log(`Scraping website: ${url}`)
    
    // Fetch the website content with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduce to 3 second timeout
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }
    
    // Get the HTML content
    const html = await response.text();
    
    // Extract text content (basic extraction)
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Extract meta tags for additional context (limit to important ones)
    const metaTags: Record<string, string> = {};
    const importantMetaTags = ['description', 'keywords', 'og:title', 'og:description', 'twitter:title', 'twitter:description'];
    const metaMatches = html.matchAll(/<meta\s+(?:name|property)=["']([^"']+)["']\s+content=["']([^"']+)["']/gi);
    for (const match of metaMatches) {
      if (match[1] && match[2] && importantMetaTags.some(tag => match[1].toLowerCase().includes(tag))) {
        metaTags[match[1]] = match[2];
      }
    }
    
    // Extract only a few important links
    const links: Array<{url: string, text: string}> = [];
    const linkMatches = html.matchAll(/<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi);
    let linkCount = 0;
    for (const match of linkMatches) {
      if (linkCount >= 20) break; // Limit to 20 links
      
      if (match[1] && !match[1].startsWith('#') && !match[1].startsWith('javascript:')) {
        // Resolve relative URLs
        let linkUrl = match[1];
        if (linkUrl.startsWith('/')) {
          const urlObj = new URL(url);
          linkUrl = `${urlObj.protocol}//${urlObj.host}${linkUrl}`;
        } else if (!linkUrl.startsWith('http')) {
          if (!url.endsWith('/')) url += '/';
          linkUrl = url + linkUrl;
        }
        
        // Clean the link text
        const linkText = match[2].replace(/<[^>]*>/g, '').trim();
        if (linkText && linkText.length > 3) { // Only include meaningful link text
          links.push({url: linkUrl, text: linkText});
          linkCount++;
        }
      }
    }
    
    return {
      url,
      title: html.match(/<title>(.*?)<\/title>/i)?.[1] || '',
      metaTags,
      textContent: textContent.substring(0, 3000), // Reduce to 3000 chars
      links: links.slice(0, 10) // Reduce to 10 links
    };
  } catch (error) {
    console.error("Error scraping website:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to scrape website: ${error.message}`);
    } else {
      throw new Error("Failed to scrape website: Unknown error");
    }
  }
}

export async function analyzeWebsite(url: string) {
  try {
    console.log(`Analyzing website: ${url}`)

    // First, scrape the website to get actual content
    const scrapedData = await scrapeWebsite(url);
    console.log(`Successfully scraped website: ${url}`);

    // Prepare a minimal prompt with only essential data
    const websiteContent = `
Website URL: ${scrapedData.url}
Website Title: ${scrapedData.title}
Content: ${scrapedData.textContent.substring(0, 1500)}
`;

    // Use a much simpler prompt and response schema
    const response = await perplexity.chat.completions.create({
      model: "sonar",
      messages: [
        {
          role: "system",
          content: "You are a business analyst. Provide a brief analysis of websites. Return your response as a valid JSON object."
        },
        {
          role: "user",
          content: `Analyze this website and provide basic information about:
          1. What the website is about (2-3 sentences)
          2. Main competitors (just names)
          3. Basic pricing info if available
          
          Website: ${url}
          
          ${websiteContent}
          
          Format as JSON:
          {
            "websiteUrl": "${url}",
            "summary": "Brief description of what the site is about",
            "competitors": ["Competitor 1", "Competitor 2"],
            "pricing": "Brief pricing summary or 'Not available'"
          }`
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    })

    console.log("Received response from Perplexity")
    
    // Extract JSON from the response content
    const content = response.choices[0].message.content;
    console.log("Raw response content:", content.substring(0, 200) + "..."); 
    
    // Function to extract JSON from markdown code blocks or plain text
    const extractJSON = (text: string) => {
      // Try to extract JSON from markdown code blocks
      const jsonCodeBlockRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
      const match = text.match(jsonCodeBlockRegex);
      
      if (match && match[1]) {
        return match[1]; // Return the content inside the code block
      }
      
      // If no code block, try to find JSON object directly
      const jsonObjectRegex = /(\{[\s\S]*\})/;
      const directMatch = text.match(jsonObjectRegex);
      
      if (directMatch && directMatch[1]) {
        return directMatch[1];
      }
      
      // If we can't extract JSON, return a fallback JSON
      return `{
        "websiteUrl": "${url}",
        "summary": "Analysis could not be completed in time",
        "competitors": ["Analysis timed out"],
        "pricing": "Not available due to timeout"
      }`;
    };
    
    const jsonContent = extractJSON(content);
    console.log("Extracted JSON content:", jsonContent.substring(0, 200) + "...");
    
    try {
      // Parse the extracted JSON
      const parsedData = JSON.parse(jsonContent);
      console.log("Successfully parsed Perplexity response");
      
      // Expand the response to match the expected format in the frontend
      const expandedData = {
        websiteUrl: parsedData.websiteUrl || url,
        summary: parsedData.summary || "Analysis was limited due to time constraints",
        competitors: Array.isArray(parsedData.competitors) 
          ? parsedData.competitors.map((name: string) => ({ 
              name, 
              url: "", 
              description: "" 
            }))
          : [],
        pricing: {
          summary: typeof parsedData.pricing === 'string' ? parsedData.pricing : "Not available",
          competitors: []
        },
        socialMedia: {
          summary: "Limited analysis available",
          platforms: []
        },
        partnerships: {
          summary: "Limited analysis available",
          recommendations: []
        },
        offerings: {
          summary: "Limited analysis available",
          offerings: []
        }
      };
      
      return expandedData;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      throw new Error(`Failed to parse JSON response: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error analyzing website:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to analyze website: ${error.message}`)
    } else {
      throw new Error("Failed to analyze website: Unknown error")
    }
  }
}

