const axios = require("axios");

const metaAiApi = axios.create({
  baseURL: "https://api.meta.ai/",
  headers: {
    Authorization: process.env.META_AI_KEY,
    "Content-Type": "application/json",
  },
});
module.exports = metaAiApi;
