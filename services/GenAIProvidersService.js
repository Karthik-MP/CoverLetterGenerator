const openai = require("../config/openai"); // Assuming openai is the module you are using for OpenAI API interactions
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Assuming llama is another API you're using. You need to define it.
// const llama = require("llama-api-module"); // This is just an example, you need to import the real module.

const chatgpt = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.CHATGPT_MODEL,
      messages: [{ role: "user", content: prompt }],
    });
    return response;
  } catch (error) {
    console.error("Error with ChatGPT:", error);
    throw error;
  }
};

const geminiModel = async (prompt) => {
  // console.log(prompt);
  try {
    const gemini_api_key = process.env.GEMINI_API;
    const googleAI = new GoogleGenerativeAI(gemini_api_key);
    const geminiConfig = {
      temperature: 0.9,
      topP: 1,
      topK: 1,
      maxOutputTokens: 4096,
    };

    const model = googleAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      geminiConfig,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error with Gemini:", error);
    throw error;
  }
};

// const llamaModel = async (prompt) => {
//   try {
//     const response = await llama.chat.completions.create({
//       model: process.env.LLAMA_MODEL, // Ensure you have the environment variable for Llama model
//       messages: [{ role: "user", content: prompt }],
//     });
//     return response;
//   } catch (error) {
//     console.error("Error with Llama:", error);
//     throw error;
//   }
// };

module.exports = {
  chatgpt,
  geminiModel,
  // llamaModel,
};
