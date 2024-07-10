const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "removebg2",
  credits: "yourname",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Remove background from an image",
  commandCategory: "media",
  usages: "{p}removebg <reply to an image>",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, messageReply } = event;

  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("Please reply to an image to remove the background.", threadID, messageID);
  }

  const imageUrl = messageReply.attachments[0].url;
  const apiUrl = `https://global-sprak.onrender.com/api/removebg?url=${encodeURIComponent(imageUrl)}`;

  api.sendMessage("Removing background from your image, please wait...", threadID);

  const cacheFolderPath = path.resolve(__dirname, "cache");
  const cacheFilePath = path.resolve(cacheFolderPath, `${Date.now()}.png`);

  try {
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (response.status === 200) {
      // Ensure cache folder exists
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }

      fs.writeFileSync(cacheFilePath, response.data);

      if (fs.existsSync(cacheFilePath)) {
        const stream = fs.createReadStream(cacheFilePath);
        api.sendMessage({
          body: "Here is your image with the background removed.",
          attachment: stream
        }, threadID, (err) => {
          if (err) console.error(err);
          fs.unlink(cacheFilePath, (err) => {
            if (err) console.error(err);
            console.log(`Deleted ${cacheFilePath}`);
          });
        });
      } else {
        api.sendMessage("Error processing the image.", threadID, messageID);
      }
    } else {
      api.sendMessage("Error fetching data from the API.", threadID, messageID);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("An error occurred while processing your request.", threadID, messageID);
  }
};
