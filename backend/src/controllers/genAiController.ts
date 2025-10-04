// src/controllers/creativeController.ts
import { Request, Response } from "express";
import { genAi } from "../utils/genAI"; // your existing AI service

const rewriteMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        // Prompt instruction to AI 
        const prompt = `
You are a highly creative writer. Rewrite the following note in a single, concise, and engaging sentence.
Keep the original meaning intact, but also add a helpful suggestion or tip related to the note.
Return only the rewritten message with the suggestion. 
Do NOT give multiple options, explanations, or extra text and please be formal and funny.

Note: "${message}"
`;


        const suggestions = await genAi(prompt);

        if (!suggestions) {
            return res.status(500).json({
                success: false,
                message: "Failed to generate creative rewrite",
            });
        }

        return res.status(200).json({
            success: true,
            original: message,
            suggestions: suggestions.trim(), // trim extra whitespace
        });
    } catch (error: any) {
        console.error("Error in rewriteMessage:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export { rewriteMessage };
