
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const versions = ["v1beta", "v1"];
    let output = "";

    for (const version of versions) {
        output += `\n--- Checking ${version} ---\n`;
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`);
            if (!response.ok) {
                output += `Failed to fetch models for ${version}: ${response.status} ${response.statusText}\n`;
                const text = await response.text();
                output += text + "\n";
                // Don't continue, let's see what failed
            } else {
                const data = await response.json();
                const models = data.models || [];
                output += `Found ${models.length} models.\n`;

                const generateModels = models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"));

                output += "Models supporting generateContent:\n";
                generateModels.forEach(m => output += ` - ${m.name} (${m.displayName})\n`);
            }
        } catch (error) {
            output += `Error checking ${version}: ${error}\n`;
        }
    }

    // Write explicitly as utf8
    fs.writeFileSync(path.resolve(__dirname, '../../models_list_utf8.txt'), output, { encoding: 'utf8' });
    console.log("Output written to models_list_utf8.txt");
}

listModels();
