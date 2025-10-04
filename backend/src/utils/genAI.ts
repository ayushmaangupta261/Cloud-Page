
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") }); // adjusting path to  .env



// Initialize Generative AI
const apiKey: string = process.env.GEN_AI_API_KEY || ""; 

console.log("API key -> ", apiKey);


const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Function to generate AI content
const genAi = async (message: string) => {
    if (!message) return "Message prompt is required";

    try {
        const result = await model.generateContent(message);
        return result.response.text();
    } catch (error) {
        console.error("AI Error ->", error);
        return "Error from AI model";
    }
};

export { genAi };
