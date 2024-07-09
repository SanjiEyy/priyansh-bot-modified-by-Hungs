const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "roseai",
  credits: "yourname",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Interact with an AI based on a prompt",
  commandCategory: "ai",
  usages: "{p}roseai <prompt>",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

module.exports.run = async function ({ event, api, args }) {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    return api.sendMessage("Please provide a prompt for the AI interaction.", threadID, messageID);
  }

  const prompt = args.join(" ");
  const apiUrl = `https://global-sprak.onrender.com/api/rose?prompt=${encodeURIComponent(prompt)}`;

  api.sendMessage("Interacting with AI, please wait...", threadID);

  try {
    const response = await axios.get(apiUrl);

    if (response.status === 200 && response.data && response.data.response) {
      const aiResponse = response.data.response;

      api.sendMessage({
        body: `AI Response for prompt "${prompt}":\n${aiResponse}`,
      }, threadID);
    } else {
      api.sendMessage("Error fetching or processing AI response.", threadID, messageID);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("An error occurred while interacting with AI.", threadID, messageID);
  }
};
