const admin = require('firebase-admin');
const { GoogleGenAI } = require('@google/genai');

// Setting up advanced Google Services integration
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const genAI = new GoogleGenAI({});

async function generateInsight(crowdData) {
  try {
    const prompt = `Analyze this venue crowd data and suggest mitigations: ${JSON.stringify(crowdData)}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (err) {
    return "Standard mitigation: Increase staff at congested gates.";
  }
}

module.exports = { admin, generateInsight };
