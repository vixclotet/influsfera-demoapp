import { perplexity } from "./perplexity-config"

// New function to scrape website content
async function scrapeWebsite(url: string) {
  try {
    console.log(`Scraping website: ${url}`)
    
    // Fetch the website content with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
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
      textContent: textContent.substring(0, 5000), // Limit text content length to 5000 chars
      links: links.slice(0, 20) // Limit number of links to 20
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

    // Prepare a more concise prompt that includes only essential scraped data
    const websiteContent = `
Website URL: ${scrapedData.url}
Website Title: ${scrapedData.title}

Meta Tags:
${Object.entries(scrapedData.metaTags)
  .slice(0, 5) // Limit to 5 most important meta tags
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Website Content Summary:
${scrapedData.textContent.substring(0, 3000)} // Further limit content

Important Links:
${scrapedData.links
  .slice(0, 10) // Limit to 10 most important links
  .map(link => `- ${link.text}: ${link.url}`)
  .join('\n')}
`;

    // Use a more efficient prompt with a simpler response schema
    const response = await perplexity.chat.completions.create({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "You are an expert business analyst specializing in competitive research. Provide concise analysis of websites and their competitors. Return your response as a valid JSON object without any markdown formatting or code blocks.",
        },
        {
          role: "user",
          content: `Analyze the following website content and provide key information about:
          1. Similar companies and competitors (max 3)
          2. Their pricing strategies
          3. Social media presence
          4. Partnerships and integrations
          5. Product/service offerings
          
          Here is the scraped content from ${url}:
          
          ${websiteContent}
          
          Format the response as a structured JSON object with the following simplified schema:
          {
            "websiteUrl": string,
            "summary": string,
            "competitors": Array<{
              "name": string,
              "url": string,
              "description": string
            }>,
            "pricing": {
              "summary": string,
              "competitors": Array<{
                "name": string,
                "plans": Array<{
                  "name": string,
                  "price": string
                }>
              }>
            },
            "socialMedia": {
              "summary": string,
              "platforms": Array<{
                "name": string,
                "url": string
              }>
            },
            "partnerships": {
              "summary": string,
              "recommendations": Array<{
                "company": string,
                "type": string
              }>
            },
            "offerings": {
              "summary": string,
              "offerings": Array<{
                "name": string,
                "description": string
              }>
            }
          }`,
        },
      ],
      max_tokens: 1500, // Limit token usage
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

