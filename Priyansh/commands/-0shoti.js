const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "shoti",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Requested",
    description: "Fetches a video from the Shoti API and stores it in cache",
    commandCategory: "system",
    usages: "",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    try {
        const apiKey = "shoti-1ho3b41uiohngdbrgk8";
        const apiUrl = "https://shoti-srv1.onrender.com/api/v1/get";

        const response = await axios.get(apiUrl, {
            responseType: "arraybuffer", // Response type set to arraybuffer to handle binary data (video)
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        if (response.status === 200) {
            const videoData = response.data;

            // Save video data to cache
            const cacheDir = path.resolve(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir);
            }
            const fileName = `shoti_video_${Date.now()}.mp4`; // Generate a unique filename
            const filePath = path.join(cacheDir, fileName);
            fs.writeFileSync(filePath, Buffer.from(videoData, "binary"));

            api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID, () => {
                fs.unlinkSync(filePath); // Delete the temporary file after sending
            });
        } else {
            api.sendMessage("Failed to fetch video from the Shoti API.", event.threadID);
        }
    } catch (error) {
        console.error("API request error:", error);
        api.sendMessage("An error occurred while fetching video from the Shoti API.", event.threadID);
    }
};
