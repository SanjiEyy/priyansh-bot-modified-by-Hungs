const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "sdxl",
  credits: "yourname",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Generate an image based on a prompt and model",
  commandCategory: "media",
  usages: "{p}sdxl <prompt> <model>",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

module.exports.run = async function ({ event, api, args }) {
  const { threadID, messageID } = event;

  if (args.length < 2) {
    return api.sendMessage("Please provide a prompt and model number (1-13) for the image generation.", threadID, messageID);
  }

  const prompt = args.slice(0, -1).join(" ");
  const model = args[args.length - 1];

  if (isNaN(model) || model < 1 || model > 13) {
    return api.sendMessage("Please provide a valid model number (1-13).", threadID, messageID);
  }

  const apiUrl = `https://global-sprak.onrender.com/api/sdxl?prompt=${encodeURIComponent(prompt)}&model=${model}`;

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
          body: `Generated image for prompt: "${prompt}" with model ${model}`,
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
