
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeLegalQuery = async (query: string) => {
  try {
    // Initialize GoogleGenAI directly with the pre-configured process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this legal query and categorize it into a practice area and urgency level.
      Query: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPracticeArea: { type: Type.STRING },
            urgency: { type: Type.STRING, description: "Low, Medium, or High" },
            briefAdvice: { type: Type.STRING, description: "One sentence of general guidance" }
          },
          required: ["suggestedPracticeArea", "urgency", "briefAdvice"]
        }
      }
    });
    
    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Error analyzing query:", error);
    return null;
  }
};

export const parseResume = async (base64Data: string, mimeType: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Ensure we strip the data URL prefix if present (e.g., "data:application/pdf;base64,")
    const dataParts = base64Data.split(',');
    const rawBase64 = dataParts.length > 1 ? dataParts[1] : dataParts[0];

    const response = await ai.models.generateContent({
      // Updated to gemini-3-flash-preview for better compliance and reliability
      model: "gemini-3-flash-preview",
      // Fixed: Use object with parts array format for contents
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: rawBase64
            }
          },
          {
            text: "Extract the following details from this resume document: Name, Email, Mobile Number, Education Summary, Professional Experience Summary, and Interests. Return as JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            mobile: { type: Type.STRING },
            education: { type: Type.STRING },
            experience: { type: Type.STRING },
            interests: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text.trim());
  } catch (error) {
    console.error("AI Resume Parsing failed:", error);
    return null;
  }
};
