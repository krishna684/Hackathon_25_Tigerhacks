
import { GoogleGenAI, Type } from "@google/genai";
import { StructuredData } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. The app may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const structuredDataSchema = {
    type: Type.OBJECT,
    properties: {
        text: {
            type: Type.STRING,
            description: "A refined, concise summary of the user's intent based on the context."
        },
        image: {
            type: Type.STRING,
            description: "A 2-5 word keyword phrase for generating a relevant image. Example: 'futuristic cityscape'."
        },
        news: {
            type: Type.STRING,
            description: "A 2-5 word search query for finding recent news articles. Example: 'latest AI breakthroughs'."
        },
        paper: {
            type: Type.STRING,
            description: "A 2-5 word search query for academic papers. Example: 'quantum computing research'."
        },
        video: {
            type: Type.STRING,
            description: "A 2-5 word search query for educational videos. Example: 'how black holes work'."
        },
    },
    required: ["text", "image", "news", "paper", "video"],
};


export const geminiService = {
  interpretRequest: async (userInput: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are Agent₁, an expert request interpreter. Analyze the following user request and provide an initial, concise interpretation of their intent in one or two sentences. User request: "${userInput}"`,
      });
      return response.text;
    } catch (error) {
      console.error("Error in interpretRequest:", error);
      throw new Error("Failed to get interpretation from Agent₁.");
    }
  },

  reasonAndStructure: async (context: string, iteration: number): Promise<StructuredData> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a collaborative AI system of Agent₂ (Context Refiner) and Agent₃ (Keyword Extractor). This is refinement loop ${iteration} of 3. Your goal is to refine the context and extract precise keywords to populate a JSON object. Based on the following context, generate the required JSON.
            Context: "${context}"
            Respond ONLY with the JSON object. Do not add any other text or markdown formatting.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: structuredDataSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as StructuredData;
    } catch (error) {
      console.error("Error in reasonAndStructure:", error);
      throw new Error(`Failed to get structured data in loop ${iteration}.`);
    }
  },
};
