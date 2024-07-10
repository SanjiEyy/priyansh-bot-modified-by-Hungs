const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "emi",
  credits: "Vex_Kshitiz",
  version: "2.0",
  cooldowns: 20,
  hasPermmision: 0,
  description: "Generate an image",
  commandCategory: "fun",
  usages: "{p}anigen <prompt>",
};

module.exports.handleEvent = async function ({ event, api, args }) {
  const { threadID, messageID } = event;

  api.setMessageReaction("🕐", messageID, (err) => {
    if (err) console.error(err);
  }, true);

  try {
    const prompt = args.join(" ");
    const emiApiUrl = "https://emi-gen-j0rj.onrender.com/emi";

    const emiResponse = await axios.get(emiApiUrl, {
      params: { prompt: prompt },
      responseType: "arraybuffer"
    });

    const cacheFolderPath = path.resolve(__dirname, "cache");
    if (!fs.existsSync(cacheFolderPath)) {
      fs.mkdirSync(cacheFolderPath, { recursive: true });
    }

    const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
    fs.writeFileSync(imagePath, Buffer.from(emiResponse.data, "binary"));

    const stream = fs.createReadStream(imagePath);
    api.sendMessage({
      body: "",
      attachment: stream
    }, threadID, (err) => {
      if (err) {
        console.error(err);
      }
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err);
        }
        console.log(`Deleted ${imagePath}`);
      });
    });

    api.setMessageReaction("✅", messageID, (err) => {
      if (err) console.error(err);
    }, true);
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage("❌ | An error occurred. Please try again later.", threadID, messageID);
    api.setMessageReaction("❌", messageID, (err) => {
      if (err) console.error(err);
    }, true);
  }
};

module.exports.handleEvent = async function ({ event, api, args }) {
  const { threadID, messageID } = event;
  if (!args.length) {
    return api.sendMessage("Please provide a prompt for the image generation.", threadID, messageID);
  }
  return module.exports.handleEvent({ event, api, args });
};
