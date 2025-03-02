import { perplexity } from "./perplexity-config"

export async function analyzeWebsite(url: string) {
  try {
    console.log(`Analyzing website: ${url}`)

    const response = await perplexity.chat.completions.create({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "You are an expert business analyst specializing in competitive research. Provide detailed, accurate analysis of websites and their competitors. Return your response as a valid JSON object without any markdown formatting or code blocks. When recommending partnerships, be very specific and include concrete company names, their value proposition, and why they would be a good fit. Don't use generic recommendations - name actual companies that exist in the real world. When analyzing offerings, provide detailed information about competitor offerings, including specific features, pricing, and unique aspects of their products/services. For social media analysis, include detailed comparisons of the main company's social media presence with all identified competitors across different platforms.",
        },
        {
          role: "user",
          content: `Analyze the website ${url} and provide detailed information about:
          1. Similar companies and competitors
          2. Their pricing strategies
          3. Social media presence and strategies
          4. Partnerships and integrations
          5. Product/service offerings
          
          Format the response as a structured JSON object with the following schema:
          {
            "websiteUrl": string,
            "summary": string,
            "competitors": Array<{
              "name": string,
              "url": string,
              "description": string,
              "strengths": string[],
              "weaknesses": string[]
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
            }
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

