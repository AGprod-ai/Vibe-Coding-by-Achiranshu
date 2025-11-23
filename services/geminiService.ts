import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    timeline: {
      type: Type.ARRAY,
      description: "A chronological list of sentiment scores extracted or inferred from the reviews. If specific dates are missing, distribute them over a relevant past period (e.g., last 30 days).",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "Date in YYYY-MM-DD format." },
          sentiment: { type: Type.NUMBER, description: "Sentiment score from -1.0 (negative) to 1.0 (positive)." },
          volume: { type: Type.NUMBER, description: "Number of reviews aggregated for this point/day." }
        },
        required: ["date", "sentiment", "volume"]
      }
    },
    wordCloud: {
      type: Type.ARRAY,
      description: "Most frequent and significant keywords or phrases representing complaints and praises.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          value: { type: Type.NUMBER, description: "Frequency or importance score (1-100)." },
          type: { type: Type.STRING, enum: ["complaint", "praise", "neutral"] }
        },
        required: ["text", "value", "type"]
      }
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        overview: { type: Type.STRING, description: "A brief executive overview of the general sentiment." },
        actionableAreas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            },
            required: ["title", "description", "impact"]
          }
        }
      },
      required: ["overview", "actionableAreas"]
    }
  },
  required: ["timeline", "wordCloud", "summary"]
};

export const analyzeReviews = async (rawText: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert Customer Experience Analyst. Analyze the following raw customer reviews. 
              
              Raw Reviews:
              """
              ${rawText}
              """

              Tasks:
              1. Analyze the sentiment trend over time. If dates are not explicitly present in the text, infer a logical sequence or distribute the data points across a simulated 30-day timeline to show the trend of the provided batch.
              2. Extract key themes for a word cloud, categorizing them as complaints or praises.
              3. Write a high-level executive summary and identify exactly 3 key actionable areas for improvement.
              `
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        // High thinking budget for deep analysis of large text batches
        thinkingConfig: {
            thinkingBudget: 32768
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing reviews:", error);
    throw error;
  }
};

export const createChatSession = (contextData: AnalysisResult) => {
  const contextString = JSON.stringify(contextData);
  
  return ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: `You are a helpful assistant embedded in a Customer Sentiment Dashboard. 
      You have access to the following analysis result of customer reviews:
      ${contextString}
      
      Answer the user's questions based on this data. Be concise, professional, and insightful.
      If the answer isn't explicitly in the data, use your reasoning capabilities to infer potential insights based on the provided summary and themes.`,
    }
  });
};
