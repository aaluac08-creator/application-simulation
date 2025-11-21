import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API client
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateFeedback(questionText, responseText, type) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let prompt = "";
        if (type === 'video') {
            prompt = `
        You are an expert university admissions coach. 
        A student has provided a video response (transcribed below) to the following interview question.
        
        Question: "${questionText}"
        
        Student's Transcript: "${responseText}"
        
        Please provide constructive feedback in the following format:
        1. **Strengths**: What did they do well?
        2. **Areas for Improvement**: What could be better?
        3. **Sample Improved Answer**: A brief example of how to phrase a stronger response.
        
        Keep the tone encouraging but professional. Keep the response concise (under 200 words).
      `;
        } else {
            prompt = `
        You are an expert university admissions coach.
        A student has written the following response to an essay question.
        
        Question: "${questionText}"
        
        Student's Response: "${responseText}"
        
        Please provide constructive feedback in the following format:
        1. **Strengths**: What did they do well?
        2. **Areas for Improvement**: What could be better?
        3. **Refinement**: One specific suggestion to make the writing more impactful.
        
        Keep the tone encouraging but professional. Keep the response concise (under 200 words).
      `;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating feedback:", error);
        return "Unable to generate feedback at this time. Please try again later.";
    }
}
