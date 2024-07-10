const axios = require('axios');
const fs = require('fs');
const request = require('request');
const path = require('path');

module.exports.config = {
    name: "shoti",
    description: "Sends a short TikTok video",
    role: "user",
    cooldown: 28,
    commandCategory: "media",
    usages: "",
};

module.exports.run = async ({ api, event }) => {
    try {
        const message1 = { body: "Sending Babes...😘" };
        api.sendMessage(message1, event.threadID, event.messageID);

        const apiUrl = "https://shoti-srv1.onrender.com/api/v1/get";
        const apiKey = "shoti-1ho3b41uiohngdbrgk8";

        const response = await axios.post(apiUrl, {
            apikey: apiKey,
        });

        const { url: videoUrl, user: { username, nickname } } = response.data.data;

        const cacheDir = path.resolve(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir);
        }

        const filePath = path.join(cacheDir, 'shoti.mp4');
        const videoStream = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
            const rqs = request(encodeURI(videoUrl));
            rqs.pipe(videoStream);
            rqs.on('end', resolve);
            rqs.on('error', reject);
        });

        const message2 = {
            body: `ToktikUser: ${username} (${nickname})`,
            attachment: fs.createReadStream(filePath)
        };

        setTimeout(() => {
            api.sendMessage(message2, event.threadID);
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
    }
};
