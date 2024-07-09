const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "photoleap",
  credits: "yourname",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Get a generated photo based on a prompt",
  commandCategory: "media",
  usages: "{p}photoleap <prompt>",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

module.exports.run = async function ({ event, api, args }) {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    return api.sendMessage("Please provide a prompt for the image generation.", threadID, messageID);
  }

  const prompt = args.join(" ");
  const apiUrl = `https://joshweb.click/aigen?prompt=${encodeURIComponent(prompt)}`;

  api.sendMessage("Generating your image, please wait...", threadID);

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
          body: `Generated image for prompt: "${prompt}"`,
          attachment: stream
        }, threadID, (err) => {
          if (err) console.error(err);
          fs.unlink(cacheFilePath, (err) => {
            if (err) console.error(err);
            console.log(`Deleted ${cacheFilePath}`);
          });
        });
      } else {
        api.sendMessage("Error generating the image.", threadID, messageID);
      }
    } else {
      api.sendMessage("Error fetching data from the API.", threadID, messageID);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("An error occurred while generating the image.", threadID, messageID);
  }
};
