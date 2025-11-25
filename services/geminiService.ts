import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY || '';

const getAiClient = () => {
  if (!API_KEY) {
    console.warn("No API_KEY found in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const streamChatResponse = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (text: string) => void
) => {
  const ai = getAiClient();
  if (!ai) {
    onChunk("Error: API Key is missing. Please check your configuration.");
    return;
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are a supportive, empathetic, and knowledgeable sobriety assistant for an app called "End Of Ash". 
        Your goal is to help the user overcome addiction (e.g., smoking, drugs, self-harm).
        - Be encouraging but realistic.
        - Provide science-backed advice on withdrawal, triggers, and healthy alternatives.
        - If asked about app features, guide them: "Tracker" shows progress, "Urges" logs cravings, "Alternatives" gives substitutes.
        - Keep responses concise and easy to read on a mobile device.
        - Maintain a calm, professional, yet warm tone.`,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    
    for await (const chunk of result) {
       // chunk is GenerateContentResponse
       if (chunk.text) {
         onChunk(chunk.text);
       }
    }
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    onChunk("I'm having trouble connecting right now. Please try again later.");
  }
};

export const generateDailyQuote = async (addiction: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Stay strong. One day at a time.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, powerful, minimalist motivational quote for someone quitting ${addiction}. Do not include quotes ("") in the output string. Maximum 20 words.`,
    });
    return response.text || "Believe you can and you're halfway there.";
  } catch (e) {
    return "Recovery is a process. It takes time. It takes patience. It takes everything you've got.";
  }
};

export const getSmartAlternatives = async (addiction: string, intensity: number): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "No suggestions available offline.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Suggest 3 specific, actionable alternative coping mechanisms or substitutes for a heavy user (intensity ${intensity}/10) of ${addiction}. Return as a simple bulleted list.`
        });
        return response.text || "Try deep breathing, drinking water, or going for a walk.";
    } catch (e) {
        return "Try deep breathing, drinking water, or going for a walk.";
    }
}

export const generateJournalPrompt = async (mood: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "What is on your mind today?";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate one thoughtful, deep journal reflection prompt for someone in recovery who is feeling ${mood} today. Short and open-ended.`
        });
        return response.text || "Write about a moment you felt proud of yourself recently.";
    } catch (e) {
        return "How are you really feeling right now?";
    }
}