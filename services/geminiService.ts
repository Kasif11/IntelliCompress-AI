import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from '../utils/fileUtils';

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
    // In a real app, you'd handle this more gracefully.
    // For this environment, we assume it's set.
    console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function analyzeFile(file: File, targetSize: number): Promise<string> {
  const base64Data = await fileToBase64(file);
  const imagePart = {
    inlineData: {
      mimeType: file.type,
      data: base64Data,
    },
  };

  const textPart = {
    text: `Analyze this image. The user has just compressed it to a target size of approximately ${targetSize} KB. Provide a brief, one-paragraph visual description of the image. Then, provide a bulleted list of 3-4 points explaining the techniques that were likely used to achieve this compression (e.g., JPEG quality reduction, dimension scaling) and comment on the potential trade-offs (e.g., loss of fine detail, color banding). Make the tone informative and professional. Use simple hyphens or asterisks for bullet points.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI service is currently unavailable. Please try again later.");
  }
}