import { perplexity } from "./perplexity-config"
import * as cheerio from "cheerio"

// Helper function to normalize URLs
function normalizeUrl(url: string): string {
  // Add https:// if no protocol is specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  return url;
}

// New function to scrape website content
export async function scrapeWebsite(url: string): Promise<string> {
  console.log(`Scraping website: ${url}`);
  
  try {
    // Validate and normalize the URL
    const normalizedUrl = normalizeUrl(url);
    
    // Set a timeout for the entire scraping process
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // Increase to 45 second timeout
    
    // Fetch the main page
    let response;
    try {
      response = await fetch(normalizedUrl, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        clearTimeout(timeoutId);
        throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error(`Error fetching website ${url}:`, fetchError);
      throw new Error(`Failed to fetch website: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
    }
    
    // Get the HTML content
    let html;
    try {
      html = await response.text();
      clearTimeout(timeoutId);
      
      if (!html || html.trim().length === 0) {
        throw new Error('Empty HTML content received');
      }
    } catch (textError) {
      clearTimeout(timeoutId);
      console.error(`Error getting text from response for ${url}:`, textError);
      throw new Error(`Failed to get HTML content: ${textError instanceof Error ? textError.message : String(textError)}`);
    }
    
    // Use cheerio to parse the HTML
    try {
      // Check if html is valid before parsing
      if (!html || typeof html !== 'string') {
        throw new Error('Invalid HTML content received');
      }
      
      const $ = cheerio.load(html);
      
      // Remove script tags, style tags, and other non-content elements
      $('script, style, iframe, noscript, svg, path, img, video, audio, canvas, code, pre').remove();
      
      // Focus on the most important content sections
      let importantContent = '';
      
      // Prioritize content in this order:
      // 1. Main content areas
      // 2. Pricing pages
      // 3. About pages
      // 4. Product/service descriptions
      
      // Get main content
      const mainContent = $('main, article, .content, #content, .main, #main').text().trim();
      if (mainContent) {
        importantContent += `MAIN CONTENT:\n${mainContent}\n\n`;
      }
      
      // Get pricing information
      const pricingLinks = $('a[href*="pricing"], a[href*="plans"], a:contains("Pricing"), a:contains("Plans")');
      if (pricingLinks.length > 0) {
        importantContent += "PRICING LINKS:\n";
        pricingLinks.each((i, el) => {
          const href = $(el).attr('href');
          const text = $(el).text().trim();
          if (href && text) {
            importantContent += `${text}: ${href}\n`;
          }
        });
        importantContent += "\n";
      }
      
      // Get about information
      const aboutContent = $('section:contains("About"), div:contains("About Us"), #about, .about').text().trim();
      if (aboutContent) {
        importantContent += `ABOUT CONTENT:\n${aboutContent}\n\n`;
      }
      
      // Get header and footer content (often contains important navigation and links)
      const headerContent = $('header, .header, #header').text().trim();
      const footerContent = $('footer, .footer, #footer').text().trim();
      
      if (headerContent) {
        importantContent += `HEADER CONTENT:\n${headerContent}\n\n`;
      }
      
      if (footerContent) {
        importantContent += `FOOTER CONTENT:\n${footerContent}\n\n`;
      }
      
      // If we haven't found much content, fall back to the body text
      if (importantContent.length < 1000) {
        const bodyText = $('body').text().trim()
          .replace(/\s+/g, ' ')
          .substring(0, 15000);
        
        return bodyText;
      }
      
      return importantContent;
    } catch (cheerioError) {
      console.error(`Error parsing HTML with cheerio: ${cheerioError}`);
      
      // Fallback to basic text extraction if cheerio fails
      const basicText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 15000);
      
      return basicText;
    }
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error);
    // Return a minimal text so the analysis can still proceed
    return `Failed to scrape website ${url} due to error: ${error instanceof Error ? error.message : String(error)}. Please check the URL and try again.`;
  }
}

// Create a default response structure for when analysis fails
function createDefaultResponse(url: string, errorMessage: string) {
  return {
    websiteUrl: url,
    summary: `Could not fully analyze this website. Error: ${errorMessage}`,
    competitors: [
      { 
        name: "Not available", 
        url: "", 
        description: "Could not retrieve competitor information due to analysis limitations." 
      },
      { 
        name: "Not available", 
        url: "", 
        description: "Could not retrieve competitor information due to analysis limitations." 
      },
      { 
        name: "Not available", 
        url: "", 
        description: "Could not retrieve competitor information due to analysis limitations." 
      },
      { 
        name: "Not available", 
        url: "", 
        description: "Could not retrieve competitor information due to analysis limitations." 
      }
    ],
    pricing: { 
      summary: "Not available due to analysis limitations", 
      competitors: [] 
    },
    socialMedia: { 
      summary: "Not available due to analysis limitations", 
      platforms: [] 
    },
    partnerships: { 
      summary: "Not available due to analysis limitations", 
      existingPartnerships: [],
      recommendations: [
        {
          potentialPartner: "Not available",
          rationale: "Could not analyze potential partnerships due to analysis limitations",
          growthPotential: "Not available"
        }
      ]
    },
    offerings: { 
      summary: "Not available due to analysis limitations", 
      offerings: [] 
    }
  };
}

export async function analyzeWebsite(url: string): Promise<CompetitorAnalysis> {
  console.log(`Starting analysis for ${url}`);
  
  try {
    // Validate URL format
    if (!url.match(/^https?:\/\/.+\..+/i)) {
      console.error(`Invalid URL format: ${url}`);
      return createDefaultResponse(url, "Invalid URL format. Please provide a valid URL starting with http:// or https://");
    }
    
    // Normalize the URL
    const normalizedUrl = normalizeUrl(url);
    
    try {
      // Scrape the website
      const scrapedContent = await scrapeWebsite(normalizedUrl);
      
      // Check if scraping returned an error message
      if (scrapedContent.includes("Error scraping website:")) {
        console.warn(`Scraping warning: ${scrapedContent}`);
        // Continue with analysis but note the error
      }
      
      // Prepare the message for the API
      const message = `
      You are a business analyst specializing in competitive analysis. Analyze the following website content and provide a detailed competitive analysis.
      
      Website URL: ${normalizedUrl}
      
      Website Content:
      ${scrapedContent.substring(0, 100000)}
      
      Provide a comprehensive analysis with the following sections:
      
      1. Summary: A brief overview of the company, its industry, and its main value proposition.
      
      2. Competitors: Identify at least 4 main competitors based on the website content. For each competitor, provide:
         - Name
         - URL (if available)
         - Brief description
         - Market share (if you can estimate it)
         - Target audience
         - Key strengths and weaknesses
         - Opportunities and threats
         - Key differentiators
         - Marketing channels they use
      
      3. Pricing Analysis:
         - Summary of the pricing strategy
         - Market positioning
         - Value proposition
         - For each competitor, include:
           * Name
           * Pricing strategy (e.g., premium, value, freemium)
           * Value perception
           * Detailed pricing plans with:
             - Plan name
             - Price
             - Billing cycle
             - Target customer
             - Key features
             - Limitations
             - Comparison notes
         - Strategic pricing recommendations
      
      4. Social Media Analysis:
         - Summary of social media presence
         - For each platform:
           * Platform name
           * URL
           * Estimated follower count
           * Comparison to competitors
           * Strategic notes
      
      5. Partnership Analysis:
         - Summary of existing and potential partnerships
         - Existing partnerships:
           * Partner name
           * Description of the partnership
           * URL (if available)
         - Recommended partnerships:
           * Specific companies to partner with (provide at least 5 specific company names)
           * Detailed rationale for each partnership
           * Growth potential for each partnership
      
      6. Offerings Analysis:
         - Summary of products/services
         - For each offering:
           * Name
           * Description
           * Unique selling points
           * Pricing information
           * Target audience
           * Competitor comparison
         - Market trends
         - Market gaps
         - Strategic recommendations
      
      Format your response as a JSON object with the following structure:
      {
        "websiteUrl": "the analyzed website URL",
        "summary": "overall summary",
        "competitors": [
          {
            "name": "competitor name",
            "url": "competitor URL",
            "description": "brief description",
            "marketShare": "estimated market share",
            "targetAudience": "target audience description",
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "opportunities": ["opportunity1", "opportunity2"],
            "threats": ["threat1", "threat2"],
            "differentiators": ["differentiator1", "differentiator2"],
            "marketingChannels": ["channel1", "channel2"]
          }
        ],
        "pricing": {
          "summary": "pricing summary",
          "marketPositioning": "market positioning description",
          "valueProposition": "value proposition description",
          "competitors": [
            {
              "name": "competitor name",
              "pricingStrategy": "pricing strategy description",
              "valuePerception": "value perception description",
              "plans": [
                {
                  "name": "plan name",
                  "price": "price",
                  "billingCycle": "billing cycle",
                  "targetCustomer": "target customer",
                  "features": ["feature1", "feature2"],
                  "limitations": ["limitation1", "limitation2"],
                  "comparisonNotes": "comparison notes"
                }
              ]
            }
          ],
          "recommendations": ["recommendation1", "recommendation2"]
        },
        "socialMedia": {
          "summary": "social media summary",
          "platforms": [
            {
              "platform": "platform name",
              "url": "platform URL",
              "followerCount": "estimated follower count",
              "comparisonToCompetitors": "comparison description",
              "notes": "strategic notes"
            }
          ]
        },
        "partnerships": {
          "summary": "partnerships summary",
          "existingPartnerships": [
            {
              "partner": "partner name",
              "description": "partnership description",
              "url": "partnership URL"
            }
          ],
          "recommendations": [
            {
              "potentialPartner": "specific company name",
              "rationale": "detailed rationale",
              "growthPotential": "growth potential description"
            }
          ]
        },
        "offerings": {
          "summary": "offerings summary",
          "offerings": [
            {
              "name": "offering name",
              "description": "offering description",
              "uniqueSellingPoints": "unique selling points",
              "pricing": "pricing information",
              "targetAudience": "target audience",
              "competitorComparison": "competitor comparison"
            }
          ],
          "trends": ["trend1", "trend2"],
          "gaps": ["gap1", "gap2"],
          "recommendations": ["recommendation1", "recommendation2"]
        }
      }
      
      Ensure your analysis is data-driven, insightful, and actionable. Focus on providing specific, concrete details rather than generic observations.
      `;
      
      try {
        // Use the perplexity client instead of fetch
        const response = await perplexity.chat.completions.create({
          model: "sonar",
          messages: [{ role: "user", content: message }],
          temperature: 0.2,
          max_tokens: 4000
        });
        
        // Extract the content from the API response
        const content = response.choices[0].message.content;
        
        // Try to parse the JSON response
        try {
          // Find JSON in the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.error("No JSON found in API response");
            throw new Error("No JSON found in API response");
          }
          
          const jsonStr = jsonMatch[0];
          const result = JSON.parse(jsonStr);
          
          // Ensure the result has the expected structure
          if (!result.websiteUrl || !result.summary) {
            console.error("API response missing required fields");
            throw new Error("API response missing required fields");
          }
          
          return result;
        } catch (parseError) {
          console.error("Error parsing API response:", parseError);
          
          // Try to extract JSON more aggressively
          try {
            const jsonRegex = /\{[\s\S]*?\}(?=\s*$)/;
            const match = content.match(jsonRegex);
            if (match) {
              const result = JSON.parse(match[0]);
              console.log("Successfully parsed JSON with alternative method");
              return result;
            }
          } catch (secondParseError) {
            console.error("Second attempt to parse JSON failed:", secondParseError);
          }
          
          // Return a default response with the error
          return createDefaultResponse(
            url, 
            `Error parsing analysis results: ${parseError.message}`
          );
        }
      } catch (apiError) {
        console.error("Error calling Perplexity API:", apiError);
        return createDefaultResponse(
          url, 
          `Error calling Perplexity API: ${apiError instanceof Error ? apiError.message : "Unknown API error"}`
        );
      }
    } catch (scrapingError) {
      console.error(`Error during scraping or analysis: ${scrapingError.message}`);
      
      // Return a default response with the error
      return createDefaultResponse(
        url, 
        `Error analyzing website: ${scrapingError.message}`
      );
    }
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    return createDefaultResponse(url, `Unexpected error: ${error.message}`);
  }
}

// Define the CompetitorAnalysis type
export interface CompetitorAnalysis {
  websiteUrl: string;
  summary: string;
  error?: string;
  isPartialResult?: boolean;
  competitors: Array<{
    name: string;
    url: string;
    description: string;
  }>;
  pricing: {
    summary: string;
    competitors: Array<{
      name: string;
      pricingDetails?: string;
      pricingUrl?: string;
    }>;
  };
  socialMedia: {
    summary: string;
    platforms: Array<{
      platform: string;
      url: string;
      followerCount?: string;
      comparisonToCompetitors?: string;
      notes?: string;
    }>;
  };
  partnerships: {
    summary: string;
    existingPartnerships: Array<{
      partner: string;
      description: string;
      url?: string;
    }>;
    recommendations: Array<{
      potentialPartner: string;
      rationale: string;
      growthPotential: string;
    }>;
  };
  offerings: {
    summary: string;
    offerings: Array<{
      name: string;
      description: string;
      uniqueSellingPoints?: string;
      competitorComparison?: string;
      url?: string;
    }>;
  };
}

