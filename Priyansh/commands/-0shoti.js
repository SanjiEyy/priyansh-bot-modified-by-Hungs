const axios = require('axios');
const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports.config = {
    name: "shawtytoktik",
    version: "1.0",
    hasPermssion: 0,
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

        const { data } = await axios.post(apiUrl, {
            apikey: "$shoti-1ho3b41uiohngdbrgk8",
        });

        const { url: videoUrl, user: { username, nickname } } = data.data;

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

        api.sendMessage(msg1, threadID, (err) => {
            if (err) return console.error(err);

            setTimeout(() => {
                api.sendMessage(msg2, threadID, (err) => {
                    if (err) return console.error(err);
                    
                    fs.unlink(tempVideoPath, (err) => {
                        if (err) console.error(err);
                        console.log(`Deleted ${tempVideoPath}`);
                    });
                });
            }, 2000);
        });

    } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error.message}`, threadID, messageID);
    }
};

module.exports.run = async function ({ event, api }) {
    return api.sendMessage("error", event.threadID); // Placeholder response, adjust as needed
};
