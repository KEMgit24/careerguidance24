import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export function getGeminiModel(modelName: string = 'gemini-2.0-flash') {
  return genAI.getGenerativeModel({ model: modelName })
}
