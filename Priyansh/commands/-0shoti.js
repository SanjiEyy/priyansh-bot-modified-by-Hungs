const axios = require('axios');
const fs = require('fs');
const path = require('path');
const request = require('request');

module.exports.config = {
    name: "shoti",
    version: "1.0",
    hasPermssion: 0,
    credits: "Kshitiz",
    description: "Sends a shawty toktik video",
    commandCategory: "fun",
    usages: "",
    cooldowns: 28,
};

module.exports.handleEvent = async function ({ event, api, command }) {
    const { threadID, messageID, senderID, body } = event;

    // Check if the message is a command trigger
    const prefix = command.prefix; // Assuming a prefix is defined somewhere
    if (!body.startsWith(prefix + this.config.name)) return; // Exit if not triggered by the command

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

        api.sendMessage(msg1, threadID, messageID);
        setTimeout(() => {
            api.sendMessage(msg2, threadID, messageID);
            fs.unlink(tempVideoPath, (err) => {
                if (err) console.error(err);
                console.log(`Deleted ${tempVideoPath}`);
            });
        }, 2000);

    } catch (error) {
        console.error(error);
        api.sendMessage(`${error}`, threadID, messageID);
    }
};

module.exports.run = async function ({ event, api }) {
    return api.sendMessage("This command is meant to be triggered by an event.", event.threadID);
};
