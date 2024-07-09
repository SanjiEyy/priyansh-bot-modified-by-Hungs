const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "anistatus",
  credits: "kshitiz",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Get a random anime status video",
  commandCategory: "media",
  usages: "{p}anistatus",
};

module.exports.handleEvent = async function ({ event, api }) {
  const { threadID, messageID } = event;

  if (!this.threadStates) {
    this.threadStates = {};
  }

  if (!this.threadStates[threadID]) {
    this.threadStates[threadID] = {};
  }

  api.setMessageReaction("🕐", messageID, (err) => {}, true);

  const cacheFolderPath = path.resolve(__dirname, "cache");
  const cacheFilePath = path.resolve(cacheFolderPath, `${Date.now()}.mp4`);

  try {
    const apiUrl = "https://ani-status.vercel.app/kshitiz";
    const response = await axios.get(apiUrl);

    if (response.data.url) {
      const tikTokUrl = response.data.url;
      console.log(`TikTok Video URL: ${tikTokUrl}`);

      const lado = `https://tikdl-video.vercel.app/tiktok?url=${encodeURIComponent(tikTokUrl)}`;
      const puti = await axios.get(lado);

      if (puti.data.videoUrl) {
        const videoUrl = puti.data.videoUrl;
        console.log(`Downloadable Video URL: ${videoUrl}`);

        await downloadVideo(videoUrl, cacheFilePath);

        if (fs.existsSync(cacheFilePath)) {
          const stream = fs.createReadStream(cacheFilePath);
          api.sendMessage({
            body: "Random anime status video.",
            attachment: stream
          }, threadID, (err) => {
            if (err) console.error(err);
            fs.unlink(cacheFilePath, (err) => {
              if (err) console.error(err);
              console.log(`Deleted ${cacheFilePath}`);
            });
          });

          api.setMessageReaction("✅", messageID, (err) => {}, true);
        } else {
          api.sendMessage("Error downloading the video.", threadID, messageID);
          api.setMessageReaction("❌", messageID, (err) => {}, true);
        }
      } else {
        api.sendMessage("Error fetching video URL.", threadID, messageID);
        api.setMessageReaction("❌", messageID, (err) => {}, true);
      }
    } else {
      api.sendMessage("Error fetching data from external API.", threadID, messageID);
      api.setMessageReaction("❌", messageID, (err) => {}, true);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("An error occurred while processing the anistatus command.", threadID, messageID);
    api.setMessageReaction("❌", messageID, (err) => {}, true);
  }
};

module.exports.run = async function ({ event, api }) {
  return api.sendMessage("Fetching a random anime status video...", event.threadID);
};

async function downloadVideo(url, cacheFilePath) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "arraybuffer"
    });

    const cacheFolderPath = path.resolve(__dirname, "cache");

    // Ensure cache folder exists
    if (!fs.existsSync(cacheFolderPath)) {
      fs.mkdirSync(cacheFolderPath);
    }

    fs.writeFileSync(cacheFilePath, Buffer.from(response.data, "utf-8"));
  } catch (err) {
    console.error(err);
  }
}
