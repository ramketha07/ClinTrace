
const https = require('https');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API Key found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else {
                console.log("Available Models:");
                json.models.forEach(model => {
                    console.log(`- ${model.name} (${model.supportedGenerationMethods.join(', ')})`);
                });
            }
        } catch (e) {
            console.error("Error parsing response:", e);
            console.log("Raw response:", data);
        }
    });

}).on('error', (err) => {
    console.error("Network Error:", err);
});
