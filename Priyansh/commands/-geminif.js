const axios = require("axios");

module.exports.config = {
  name: "geminif",
  credits: "yourname",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Chat with AI and describe an image",
  commandCategory: "ai",
  usages: "{p}geminiF <input>",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

module.exports.run = async function ({ event, api, args }) {
  const { threadID, messageID, senderID } = event;

  if (args.length === 0) {
    return api.sendMessage("Please provide a prompt or an image URL.", threadID, messageID);
  }

  const input = args.join(" ");
  const prompt = encodeURIComponent(input);
  const apiUrl = `https://joshweb.click/gemini?q=${prompt}&uid=${senderID}`;

  api.sendMessage("Processing your request, please wait...", threadID);

  try {
    const response = await axios.get(apiUrl);

    if (response.status === 200 && response.data) {
      const aiResponse = response.data;

      api.sendMessage({
        body: `AI Response:\n${aiResponse}`,
      }, threadID);

      if (input.startsWith("http")) {
        const describeUrl = `https://joshweb.click/gemini?prompt=describe%20this%20photo&url=${encodeURIComponent(input)}`;
        const describeResponse = await axios.get(describeUrl);

        if (describeResponse.status === 200 && describeResponse.data) {
          const description = describeResponse.data;

          api.sendMessage({
            body: `Image Description:\n${description}`,
          }, threadID);
        } else {
          api.sendMessage("Error describing the image.", threadID);
        }
      }
    } else {
      api.sendMessage("Error fetching or processing AI response.", threadID);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("An error occurred while processing your request.", threadID);
  }
};
