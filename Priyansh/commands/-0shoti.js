const axios = require('axios');
const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports.config = {
    name: "shawtytoktik",
    version: "1.0",
    hasPermission: 0,
    credits: "Kshitiz",
    description: "Sends a shawty toktik video",
    commandCategory: "fun",
    usages: "",
    cooldowns: 28,
};

module.exports.handleEvent = async function ({ event, api }) {
    const { threadID, messageID } = event;

    try {
        const msg1 = {
            body: "Sending Babes...😘"
        };

        const apiUrl = "https://shoti-srv1.onrender.com/api/v1/get";

        const response = await axios.post(apiUrl, {
            apikey: "shoti-1ho3b41uiohngdbrgk8", // Corrected API key format
        });

        const { url: videoUrl, user: { username, nickname } } = response.data.data;

        const cacheFolderPath = path.resolve(__dirname, 'cache');
        const tempVideoPath = path.join(cacheFolderPath, 'shoti.mp4');

        // Ensure cache folder exists
        if (!fs.existsSync(cacheFolderPath)) {
            fs.mkdirSync(cacheFolderPath);
        }

        const videoStream = fs.createWriteStream(tempVideoPath);
        await new Promise((resolve, reject) => {
            const rqs = request(encodeURI(videoUrl));
            rqs.pipe(videoStream);
            rqs.on('end', resolve);
            rqs.on('error', reject);
        });

        const msg2 = {
            body: `ToktikUser: ${username} (${nickname})`,
            attachment: fs.createReadStream(tempVideoPath)
        };

        api.sendMessage(msg1, threadID, async (err) => {
            if (err) {
                console.error(err);
                return api.sendMessage("Failed to send Babes. Please try again later.", threadID, messageID);
            }

            setTimeout(async () => {
                try {
                    await api.sendMessage(msg2, threadID);
                    fs.unlink(tempVideoPath, (err) => {
                        if (err) console.error(err);
                        console.log(`Deleted ${tempVideoPath}`);
                    });
                } catch (error) {
                    console.error(error);
                    api.sendMessage("Failed to send Toktik video. Please try again later.", threadID, messageID);
                }
            }, 2000);
        });

    } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error.message}`, threadID, messageID);
    }
};

module.exports.run = async function ({ event, api }) {
    return api.sendMessage("This command can only be triggered by an event.", event.threadID);
};
