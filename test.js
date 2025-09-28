import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent("Hello");
    const reply = result.response.text();
    console.log(reply);
  } catch (error) {
    console.error('Gemini API Error:', error);
  }
}

run();