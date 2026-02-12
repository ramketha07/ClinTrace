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
let activeModel: any = null;

// Function to fetch available models and select the best one
const getBestModel = async (): Promise<string> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

    const preferredModels = ["gemini-1.5-flash", "gemini-1.5-pro"];
    const versions = ["v1beta", "v1"];

    let availableModels: any[] = [];

    // Try fetching models from v1beta first, then v1
    for (const version of versions) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`);
            if (response.ok) {
                const data = await response.json();
                availableModels = data.models || [];
                if (availableModels.length > 0) break; // Found models, stop checking versions
            }
        } catch (error) {
            console.warn(`Failed to list models for version ${version}`, error);
        }
    }

    if (availableModels.length === 0) {
        console.warn("Could not retrieve model list from API. Defaulting to 'gemini-1.5-flash'.");
        return "gemini-1.5-flash";
    }

    // 1. Check for preferred models in order
    for (const priority of preferredModels) {
        const found = availableModels.find(m =>
            m.name === `models/${priority}` || m.name === priority
        );
        if (found) return priority;
    }

    // 2. Fallback: Check for any model that supports 'generateContent'
    const fallback = availableModels.find(m =>
        m.supportedGenerationMethods?.includes("generateContent")
    );

    if (fallback) {
        // Return model name without 'models/' prefix if present, though SDK handles both
        return fallback.name.replace(/^models\//, "");
    }

    // Absolute fallback
    return "gemini-1.5-flash";
};

// Lazy initialization function
const getModel = async () => {
    if (activeModel) return activeModel;

    try {
        const modelName = await getBestModel();
        console.log(`Using Gemini Model: ${modelName}`);
        activeModel = genAI.getGenerativeModel({
            model: modelName,
            safetySettings
        });
        return activeModel;
    } catch (error) {
        console.error("Error initializing Gemini model:", error);
        // Fallback to static initialization if dynamic fails completely
        return genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings
        });
    }
};

export const generateRationale = async (rawNotes: string) => {
    const prompt = `
        System Instruction: You are a clinical documentation assistant.
        You are strictly prohibited from diagnosing or recommending treatment.
        You only convert clinician reasoning into a clear, professional narrative paragraph.
        Do not introduce new medical decisions.
        Output the rationale as a plain text paragraph. Do not use JSON, Markdown code blocks, or bullet points.

        User Input: ${rawNotes}
    `;

    try {
        const model = await getModel();
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
