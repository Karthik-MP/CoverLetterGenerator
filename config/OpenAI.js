const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey:
    "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",
});

module.exports = openai;
