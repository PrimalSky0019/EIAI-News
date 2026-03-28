import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    try {
        const result = await genAI.getGenerativeModel({ model: "gemini-pro" }); // placeholder
        // There isn't a direct listModels in the high-level SDK easily, 
        // but we can try common ones or use the REST API.
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

listModels();
