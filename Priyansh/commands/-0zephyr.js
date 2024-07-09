const axios = require("axios");

module.exports.config = {
  name: "zephyr",
  credits: "yourname",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Interact with an AI",
  commandCategory: "ai",
  usages: "{p}zephyr <question>",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

module.exports.run = async function ({ event, api, args }) {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    return api.sendMessage("Please provide a question for the AI.", threadID, messageID);
  }

  const question = args.join(" ");
  const apiUrl = `https://joshweb.click/ai/zephyr-7b?q=${encodeURIComponent(question)}&uid=`;

  api.sendMessage("Interacting with AI, please wait...", threadID);

  try {
    const response = await axios.get(apiUrl);

    if (response.status === 200 && response.data) {
      const aiResponse = response.data;

      api.sendMessage({
        body: `AI Response:\n${aiResponse}`,
      }, threadID);
    } else {
      api.sendMessage("Error fetching or processing AI response.", threadID, messageID);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("An error occurred while interacting with AI.", threadID, messageID);
  }
};
