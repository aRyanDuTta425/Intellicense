import { GoogleGenerativeAI } from "@google/generative-ai";
import { Env } from "../types";

let genAI: GoogleGenerativeAI;

export function initializeGenAI(env: Env) {
  if (!env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables.");
  }
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
}

// Maximum number of retries for rate limits
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Helper function to introduce delay
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to call Gemini API with retry logic
export async function callGeminiAPI(prompt: string, maxRetries = MAX_RETRIES): Promise<string> {
  if (!genAI) {
    throw new Error("GenAI not initialized. Call initializeGenAI first.");
  }

  let retryCount = 0;
  let retryDelay = INITIAL_RETRY_DELAY;

  while (retryCount < maxRetries) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }); // Ensure correct model name
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      console.error(`Error calling Gemini API: ${error.message}`);

      if (error?.response?.status === 429) { // Rate limit error handling
        retryCount++;
        if (retryCount >= maxRetries) break;

        console.log(`Rate limited! Retrying after ${retryDelay / 1000} seconds...`);
        await delay(retryDelay);
        retryDelay *= 2; // Exponential backoff
      } else {
        return "Error: Unable to process request due to API failure.";
      }
    }
  }

  return "Error: Unable to process request due to rate limits. Try again later.";
}

// Function to calculate risk score based on response content
function calculateRiskScore(response: string): number {
  const highRiskKeywords = ["infringement", "unauthorized", "lawsuit", "DMCA", "copyright violation"];
  const mediumRiskKeywords = ["license required", "attribution", "restricted use", "permission needed"];

  let score = 10; // Minimum risk score

  for (const keyword of highRiskKeywords) {
    if (response.toLowerCase().includes(keyword)) score += 40;
  }

  for (const keyword of mediumRiskKeywords) {
    if (response.toLowerCase().includes(keyword)) score += 20;
  }

  return Math.min(score, 100); // Cap risk at 100
}

// Function to analyze licensing and return structured response
export async function analyzeLicensing(content: string): Promise<{
  licensingInfo: string;
  licensingSummary: string;
  riskScore: number;
}> {
  try {
    console.log(`Analyzing content: ${content.substring(0, 100)}...`);

    const prompt = `Analyze the licensing of the following content:\n${content}\nProvide a structured summary, risk assessment, and recommendations.`;

    const response = await callGeminiAPI(prompt);
    const riskScore = calculateRiskScore(response);

    return {
      licensingInfo: response,
      licensingSummary: response.split('\n')[0] || "No summary available.",
      riskScore,
    };
  } catch (error) {
    console.error("Error in license analysis:", error);
    return {
      licensingInfo: "API Error: Unable to analyze licensing at this time.",
      licensingSummary: "Analysis failed due to API limitations.",
      riskScore: 0,
    };
  }
}

export const generateLegalAnswer = async (question: string, context?: string): Promise<string> => {
  // Mock responses based on question keywords
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('fair use')) {
    return `Fair use is a legal doctrine that allows limited use of copyrighted material without requiring permission from the rights holders. It's determined by four factors:
1. Purpose and character of use (commercial vs. educational)
2. Nature of the copyrighted work
3. Amount and substantiality of the portion used
4. Effect on the potential market

In your case, ${context ? `given the context of ${context}, ` : ''}the use would likely be considered fair use if it's for educational or transformative purposes, and doesn't significantly impact the market value of the original work.`;
  }
  
  if (lowerQuestion.includes('creative commons')) {
    return `Creative Commons licenses provide a standardized way to grant permissions for using creative works. There are six main types:
- CC BY: Attribution only
- CC BY-SA: Attribution + Share Alike
- CC BY-NC: Attribution + Non-Commercial
- CC BY-ND: Attribution + No Derivatives
- CC BY-NC-SA: Attribution + Non-Commercial + Share Alike
- CC BY-NC-ND: Attribution + Non-Commercial + No Derivatives

${context ? `For your specific content (${context}), ` : ''}you should check the exact license terms to ensure compliance with the attribution and usage requirements.`;
  }
  
  if (lowerQuestion.includes('commercial') || lowerQuestion.includes('business')) {
    return `Commercial use of copyrighted content typically requires explicit permission or a license. Key considerations include:
1. Purpose: Is it for profit or business use?
2. Scope: How widely will it be distributed?
3. Duration: How long will it be used?
4. Territory: In which regions will it be used?

${context ? `Based on your content (${context}), ` : ''}you would need to obtain proper licensing or permissions for commercial use.`;
  }
  
  if (lowerQuestion.includes('public domain')) {
    return `Public domain works are not protected by copyright and can be freely used. Works enter the public domain through:
1. Expiration of copyright term
2. Failure to meet formal requirements
3. Dedication by the copyright holder
4. Works created by the U.S. government

${context ? `Regarding your content (${context}), ` : ''}you should verify its public domain status before using it freely.`;
  }
  
  // Default response for other questions
  return `Based on copyright law and best practices, ${context ? `considering your content (${context}), ` : ''}here's what you need to know:

1. Always verify the copyright status of content before use
2. Obtain proper permissions or licenses when required
3. Provide appropriate attribution when using licensed content
4. Consider fair use exceptions for educational or transformative purposes
5. Document your rights and permissions for future reference

For specific guidance, consult with a legal professional or refer to official copyright guidelines.`;
};
