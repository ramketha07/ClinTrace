import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

console.log("Gemini API Key Loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");

// Safety settings map: Relaxing filters for clinical context where "harmful" terms might appear (e.g. "blood", "illness")
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings
});

export const generateRationale = async (rawNotes: string) => {
    const prompt = `
        System Instruction: You are a clinical documentation assistant.
        You are strictly prohibited from diagnosing or recommending treatment.
        You only convert clinician reasoning into structured rationale.
        Do not introduce new medical decisions.

        User Input: ${rawNotes}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Gemini AI Error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));

        let errorMessage = "Unknown AI Error";
        if (error.response?.candidates?.[0]?.finishReason === "SAFETY") {
            errorMessage = "AI flagged content as unsafe. This is likely a false positive with medical terms.";
        } else if (error.message) {
            errorMessage = error.message;
        }

        return `Failed: ${errorMessage}`;
    }
};
