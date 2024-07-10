const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "anipic",
  credits: "kshitiz",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Get a random anime picture",
  commandCategory: "media",
  usages: "{p}anipic",
};

module.exports.handleEvent = async function ({ event, api }) {
  const { threadID, messageID } = event;

  api.setMessageReaction("🕐", messageID, (err) => {
    if (err) console.error(err);
  }, true);

  const cacheFolderPath = path.resolve(__dirname, "cache");
  const imagePath = path.resolve(cacheFolderPath, "anipic_image.png");

  // Ensure cache folder exists
  if (!fs.existsSync(cacheFolderPath)) {
    fs.mkdirSync(cacheFolderPath, { recursive: true });
  }

  try {
    const response = await axios.get("https://pic.re/image", { responseType: "stream" });

    const writeStream = fs.createWriteStream(imagePath);
    response.data.pipe(writeStream);

    writeStream.on("finish", () => {
      const stream = fs.createReadStream(imagePath);
      api.sendMessage({ attachment: stream }, threadID, (err) => {
        if (err) console.error(err);
        fs.unlink(imagePath, (err) => {
          if (err) console.error(err);
          console.log(`Deleted ${imagePath}`);
        });
      });

      api.setMessageReaction("✅", messageID, (err) => {
        if (err) console.error(err);
      }, true);
    });

    writeStream.on("error", (err) => {
      console.error(err);
      api.sendMessage("Failed to fetch random anime picture. Please try again.", threadID, messageID);
      api.setMessageReaction("❌", messageID, (err) => {
        if (err) console.error(err);
      }, true);
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while fetching the anime picture.", threadID, messageID);
    api.setMessageReaction("❌", messageID, (err) => {
      if (err) console.error(err);
    }, true);
  }
};

module.exports.run = async function ({ event, api }) {
  return api.sendMessage("Fetching a random anime picture...", event.threadID);
};
