
import { GoogleGenAI, Type } from "@google/genai";
import { Course } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const streamCourseAdvice = async (
  userMessage: string, 
  history: {role: string, text: string}[],
  courses: Course[]
) => {
  
  const courseContext = JSON.stringify(courses.map(c => ({
    title: c.title,
    description: c.description,
    level: c.level,
    tags: c.tags,
    price: c.price,
    instructor: c.instructor
  })));

  const systemInstruction = `
    You are an expert Academic Advisor at Deepmetric Analytics Institute.
    Your goal is to help potential students find the perfect course for their career goals.
    The currency for all courses is GHC (Ghanaian Cedi).
    
    Here is our CURRENT Course Catalog (prices and details may have changed recently): ${courseContext}
    
    Rules:
    1. Only recommend courses from the catalog provided above.
    2. Be encouraging, professional, and concise.
    3. If a user asks about pricing, mention the specific price from the catalog in GHC.
    4. If a user is unsure, ask them about their current skill level (Beginner, Intermediate, Advanced).
    5. Keep responses under 100 words unless detailed analysis is requested.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const resultStream = await chat.sendMessageStream({
      message: userMessage
    });

    return resultStream;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateTagsForCourse = async (title: string, description: string): Promise<string[]> => {
  if (!title && !description) return [];

  const prompt = `
    Generate 5 relevant, concise, and professional tags (single words or short phrases) for a data analytics/programming course with the following details:
    Title: ${title}
    Description: ${description}
    
    Return ONLY a JSON array of strings. Example: ["Python", "Data Science", "Statistics"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Tag Generation Error:", error);
    return [];
  }
};
