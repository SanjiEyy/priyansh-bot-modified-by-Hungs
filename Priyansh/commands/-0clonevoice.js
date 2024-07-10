const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports.config = {
  name: "clonevoice",
  credits: "Arfan",
  version: "1.0",
  cooldowns: 5,
  hasPermission: 0,
  description: "Instantly clone your voice",
  commandCategory: "AI",
  usages: "{p}clonevoice <audio reply> <text>",
};

module.exports.handleEvent = async function ({ event, api }) {
  // This function is typically used for event handling (not directly used in this example)
};

module.exports.run = async function ({ event, message, args, api }) {
  try {
    const audioUrl = event.messageReply?.attachments[0]?.url;
    const prompt = args.join(" ");

    if (!audioUrl) {
      return message.reply('Please reply to an audio.');
    } else {
      const waitMessage = await message.reply("Please wait...");

      try {
        const response = await axios.get(
          `https://ts-ai-api-shuddho.onrender.com/api/clonevoice?speaker_url=${encodeURIComponent(audioUrl)}&text=${encodeURIComponent(prompt)}`
        );

        const respUrl = response.data.url;
        if (respUrl) {
          message.reply({
            body: `Here is your cloned voice:`,
            attachment: await global.utils.getStreamFromURL(respUrl)
          });
        } else {
          message.reply("Failed to clone voice!");
        }
      } catch (error) {
        console.error(error);
        message.reply("An error occurred while cloning voice.");
      }

      // Unsend the wait message
      api.unsendMessage(waitMessage.messageID);
    }
  } catch (error) {
    console.error(error);
    message.reply("An error occurred.");
  }
};
