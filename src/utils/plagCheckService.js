import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction:
    "You are a code plagiarism checker. Your task is to analyze code snippets written in various programming languages and determine if there is a high likelihood that one code was copied or derived from another. Respond with: A plagiarism score from 0 to 100 (where 0 means completely original and 100 means identical/copy). Be language-agnostic and support popular programming languages like Python, JavaScript, Java, C++, and more. Your response should be of one word and it should only contain the plagiarism score and nothing else. You can be a bit lenient while giving the score. Do not consider the main function as their code because the user gets that code pre-written and he has to write the logic function only.",
});

export async function generatePlagScore(prompt) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}
