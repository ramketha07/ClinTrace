
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load env from one level up (since this script is in src/scripts)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function listModels() {
    try {
        console.log('Fetching available models...');
        console.log('Using API Key:', process.env.GEMINI_API_KEY ? '****' + process.env.GEMINI_API_KEY.slice(-4) : 'MISSING');
        // For some versions of the SDK, listModels is not directly on genAI, but it should be?
        // Actually, in the newer SDK, you might just have to try a model.
        // But usually, there is a way to get model info.
        // Let's just try running a simple prompt on gemini-1.5-flash to verify it works.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you there?");
        console.log('gemini-1.5-flash response:', result.response.text());
        console.log('SUCCESS: gemini-1.5-flash is working.');
    } catch (error: any) {
        console.error('Error testing gemini-1.5-flash:', error.message);

        try {
            console.log('Trying gemini-pro...');
            const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
            const resultPro = await modelPro.generateContent("Hello?");
            console.log('gemini-pro response:', resultPro.response.text());
            console.log('SUCCESS: gemini-pro is working.');
        } catch (err: any) {
            console.error('Error testing gemini-pro:', err.message);
        }
    }
}

listModels();
