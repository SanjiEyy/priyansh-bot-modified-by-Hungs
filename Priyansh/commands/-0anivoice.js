const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "anivoice",
  credits: "Kshitiz",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Get anime voice",
  commandCategory: "anime",
  usages: "{p}anivoice animeName",
};

module.exports.handleEvent = async function ({ event, api, args, message }) {
  const { threadID, messageID } = event;
  const categories = ["jjk", "naruto", "ds", "aot", "bleach", "onepiece"];

  api.setMessageReaction("🕐", messageID, (err) => {}, true);

  if (args.length !== 1 || !categories.includes(args[0].toLowerCase())) {
    return api.sendMessage(`Please specify a valid category. Available categories: ${categories.join(", ")}`, threadID, messageID);
  }

  try {
    const category = args[0].toLowerCase();
    const response = await axios.get(`https://anivoice-mdlx.onrender.com/kshitiz/${category}`, { responseType: "arraybuffer" });

    const cacheFolderPath = path.resolve(__dirname, 'cache');
    const tempVoicePath = path.join(cacheFolderPath, `${Date.now()}.mp3`);

    // Ensure cache folder exists
    if (!fs.existsSync(cacheFolderPath)) {
      fs.mkdirSync(cacheFolderPath);
    }

    fs.writeFileSync(tempVoicePath, Buffer.from(response.data, 'binary'));

    const stream = fs.createReadStream(tempVoicePath);
    await api.sendMessage({ attachment: stream }, threadID, (err) => {
      if (err) console.error(err);
      fs.unlink(tempVoicePath, (err) => {
        if (err) console.error(err);
        console.log(`Deleted ${tempVoicePath}`);
      });
    });

    api.setMessageReaction("✅", messageID, (err) => {}, true);
  } catch (error) {
    console.error(error);
    api.sendMessage("Sorry, an error occurred while processing your request.", threadID, messageID);
  }
};

module.exports.run = async function ({ event, api }) {
  return api.sendMessage("Please use the command with a valid anime name.", event.threadID);
};
