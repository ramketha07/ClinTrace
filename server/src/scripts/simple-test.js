
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        console.log("Testing gemini-1.5-flash...");
        const result = await model.generateContent("Hello");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("gemini-1.5-flash failed:", e.message);

        try {
            console.log("Testing gemini-pro...");
            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model2.generateContent("Hello");
            console.log("Success:", result2.response.text());
        } catch (e2) {
            console.error("gemini-pro failed:", e2.message);
        }
    }
}
test();
