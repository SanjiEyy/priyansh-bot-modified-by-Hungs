const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "anipic",
  credits: "kshitiz",
  version: "1.0",
  cooldowns: 5,
  hasPermission: 0,
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
  const imagePath = path.join(cacheFolderPath, "anipic_image.png");

  try {
    // Ensure cache folder exists
    if (!fs.existsSync(cacheFolderPath)) {
      fs.mkdirSync(cacheFolderPath, { recursive: true });
    }

    const response = await axios({
      method: "get",
      url: "https://pic.re/image",
      responseType: "stream",
    });

    const writeStream = fs.createWriteStream(imagePath);
    response.data.pipe(writeStream);

    writeStream.on("finish", () => {
      const stream = fs.createReadStream(imagePath);
      api.sendMessage({ attachment: stream }, threadID, (err) => {
        if (err) {
          console.error("Failed to send message:", err);
          cleanupAndReact("❌");
        } else {
          cleanupAndReact("✅");
        }
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error writing stream:", err);
      cleanupAndReact("❌");
    });

  } catch (error) {
    console.error("Error fetching anime picture:", error);
    cleanupAndReact("❌");
  }

  function cleanupAndReact(reaction) {
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting image file:", err);
      console.log(`Deleted ${imagePath}`);
    });

    api.setMessageReaction(reaction, messageID, (err) => {
      if (err) console.error("Error reacting to message:", err);
    }, true);
  }
};

module.exports.run = async function ({ event, api }) {
  try {
    await api.sendMessage("Fetching a random anime picture...", event.threadID);
  } catch (error) {
    console.error("Error sending initial message:", error);
  }
};
