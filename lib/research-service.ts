import { perplexity } from "./perplexity-config"

// New function to scrape website content
async function scrapeWebsite(url: string) {
  try {
    console.log(`Scraping website: ${url}`)
    
    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }
    
    // Get the HTML content
    const html = await response.text();
    
    // Extract text content (basic extraction)
    // This is a simple extraction - for production, consider using a library like cheerio or puppeteer
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ') // Remove scripts
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')   // Remove styles
      .replace(/<[^>]*>/g, ' ')                                           // Remove HTML tags
      .replace(/\s+/g, ' ')                                               // Normalize whitespace
      .trim();
    
    // Extract meta tags for additional context
    const metaTags: Record<string, string> = {};
    const metaMatches = html.matchAll(/<meta\s+(?:name|property)=["']([^"']+)["']\s+content=["']([^"']+)["']/gi);
    for (const match of metaMatches) {
      if (match[1] && match[2]) {
        metaTags[match[1]] = match[2];
      }
    }
    
    // Extract links for additional analysis
    const links: Array<{url: string, text: string}> = [];
    const linkMatches = html.matchAll(/<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi);
    for (const match of linkMatches) {
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
        if (linkText) {
          links.push({url: linkUrl, text: linkText});
        }
      }
    }
    
    return {
      url,
      title: html.match(/<title>(.*?)<\/title>/i)?.[1] || '',
      metaTags,
      textContent: textContent.substring(0, 10000), // Limit text content length
      links: links.slice(0, 50) // Limit number of links
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

    // Prepare a prompt that includes the scraped data
    const websiteContent = `
Website URL: ${scrapedData.url}
Website Title: ${scrapedData.title}

Meta Tags:
${Object.entries(scrapedData.metaTags)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Website Content:
${scrapedData.textContent}

Website Links:
${scrapedData.links
  .map(link => `- ${link.text}: ${link.url}`)
  .join('\n')}
`;

    const response = await perplexity.chat.completions.create({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "You are an expert business analyst specializing in competitive research. Provide detailed, accurate analysis of websites and their competitors. Return your response as a valid JSON object without any markdown formatting or code blocks. When recommending partnerships, be very specific and include concrete company names, their value proposition, and why they would be a good fit. Don't use generic recommendations - name actual companies that exist in the real world. When analyzing offerings, provide detailed information about competitor offerings, including specific features, pricing, and unique aspects of their products/services. For social media analysis, include detailed comparisons of the main company's social media presence with all identified competitors across different platforms. Also include information about recent product, service, or partnership launches from competitors with specific dates, descriptions, and URLs.",
        },
        {
          role: "user",
          content: `Analyze the following website content and provide detailed information about:
          1. Similar companies and competitors
          2. Their pricing strategies
          3. Social media presence and strategies
          4. Partnerships and integrations
          5. Product/service offerings
          6. Recent product, service, or partnership launches from competitors
          
          Here is the scraped content from ${url}:
          
          ${websiteContent}
          
          Format the response as a structured JSON object with the following schema:
          {
            "websiteUrl": string,
            "summary": string,
            "competitors": Array<{
              "name": string,
              "url": string,
              "description": string,
              "strengths": string[],
              "weaknesses": string[],
              "importantUrls": Array<{
                "title": string,
                "url": string,
                "description": string
              }>
            }>,
            "pricing": {
              "summary": string,
              "competitors": Array<{
                "name": string,
                "plans": Array<{
                  "name": string,
                  "price": string,
                  "features": string[]
                }>
              }>
            },
            "socialMedia": {
              "summary": string,
              "mainCompany": {
                "name": string,
                "platforms": Array<{
                  "name": string,
                  "url": string,
                  "followers": number,
                  "engagement": number,
                  "postFrequency": string,
                  "topPosts": Array<{
                    "title": string,
                    "engagement": number,
                    "url": string
                  }>
                }>
              },
              "competitorProfiles": Array<{
                "name": string,
                "platforms": Array<{
                  "name": string,
                  "url": string,
                  "followers": number,
                  "engagement": number,
                  "postFrequency": string,
                  "strategy": string
                }>
              }>,
              "platformComparisons": Array<{
                "platform": string,
                "companies": Array<{
                  "name": string,
                  "followers": number,
                  "engagement": number,
                  "postFrequency": string,
                  "contentType": string,
                  "strengths": string[],
                  "weaknesses": string[]
                }>
              }>,
              "insights": string[]
            },
            "partnerships": {
              "summary": string,
              "partnerships": Array<{
                "company": string,
                "type": string,
                "description": string,
                "benefits": string[]
              }>,
              "recommendations": Array<{
                "company": string,
                "website": string,
                "type": string,
                "rationale": string,
                "potentialBenefits": string[]
              }>
            },
            "offerings": {
              "summary": string,
              "offerings": Array<{
                "name": string,
                "description": string,
                "uniqueSellingPoints": string[],
                "competitors": Array<{
                  "name": string,
                  "hasFeature": boolean,
                  "notes": string,
                  "offeringDetails": {
                    "description": string,
                    "keyFeatures": string[],
                    "uniqueAspects": string[],
                    "limitations": string[]
                  }
                }>
              }>,
              "competitorUniqueOfferings": Array<{
                "competitor": string,
                "offerings": Array<{
                  "name": string,
                  "description": string,
                  "keyFeatures": string[],
                  "targetAudience": string
                }>
              }>,
              "trends": string[],
              "gaps": string[]
            },
            "recentLaunches": Array<{
              "company": string,
              "launchType": string,
              "name": string,
              "date": string,
              "description": string,
              "url": string,
              "impact": string,
              "targetAudience": string
            }>
          }`,
        },
      ],
    })

    console.log("Received response from Perplexity")
    
    // Extract JSON from the response content
    const content = response.choices[0].message.content;
    console.log("Raw response content:", content.substring(0, 200) + "..."); // Log the first 200 chars for debugging
    
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
      
      // If we can't extract JSON, return the original text
      return text;
    };
    
    const jsonContent = extractJSON(content);
    console.log("Extracted JSON content:", jsonContent.substring(0, 200) + "...");
    
    try {
      // Parse the extracted JSON
      const parsedData = JSON.parse(jsonContent);
      console.log("Successfully parsed Perplexity response");
      return parsedData;
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

