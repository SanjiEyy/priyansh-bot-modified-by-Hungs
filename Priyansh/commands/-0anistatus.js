const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "anistatus",
  credits: "kshitiz",
  version: "1.0",
  cooldowns: 5,
  hasPermission: 0,
  description: "Get a random anime status video",
  commandCategory: "media",
  usages: "{p}anistatus",
};

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID } = event;

  try {
    const cacheFolderPath = path.resolve(__dirname, "cache");
    const cacheFilePath = path.resolve(cacheFolderPath, `${Date.now()}.mp4`);

    // Ensure cache folder exists
    if (!fs.existsSync(cacheFolderPath)) {
      fs.mkdirSync(cacheFolderPath, { recursive: true });
    }

    const apiUrl = "https://ani-status.vercel.app/kshitiz";
    const response = await axios.get(apiUrl);

    if (response.data.url) {
      const tikTokUrl = response.data.url;
      console.log(`TikTok Video URL: ${tikTokUrl}`);

      const downloadUrl = `https://tikdl-video.vercel.app/tiktok?url=${encodeURIComponent(tikTokUrl)}`;
      const downloadResponse = await axios.get(downloadUrl, { responseType: "json" });

      if (downloadResponse.data.videoUrl) {
        const videoUrl = downloadResponse.data.videoUrl;
        console.log(`Downloadable Video URL: ${videoUrl}`);

        await downloadVideo(videoUrl, cacheFilePath);

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

        api.setMessageReaction("✅", messageID, (err) => {
          if (err) console.error(err);
        }, true);

      } else {
        throw new Error("Failed to fetch video URL.");
      }

    } else {
      throw new Error("Failed to fetch TikTok URL from external API.");
    }

  } catch (err) {
    console.error("Error:", err.message);
    api.sendMessage(`An error occurred: ${err.message}`, threadID, messageID);
    api.setMessageReaction("❌", messageID, (err) => {
      if (err) console.error(err);
    }, true);
  }
};

async function downloadVideo(url, cacheFilePath) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(cacheFilePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

  } catch (err) {
    console.error("Download error:", err.message);
    throw new Error("Failed to download video.");
  }
}
