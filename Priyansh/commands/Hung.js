const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "Hung",
    version: "1.0",
    hasPermssion: 0,
    credits: "Author",
    description: "Trigger and send a video",
    commandCategory: "media",
    usages: "",
    cooldowns: 5,
};

module.exports.handleEvent = function({ event, api }) {
    const { messageID, threadID, body, senderID } = event;

    const keywords = ["hung", "hung sai", "hung sai shing", "Hung", "Hung sai", "Hung sai shing"];
    const lowerCaseBody = body.toLowerCase();

    for (let keyword of keywords) {
        if (lowerCaseBody.includes(keyword)) {
            const filePath = path.join(__dirname, 'cache', 'Hung.mp4');
            if (fs.existsSync(filePath)) {
                const userName = api.getThreadInfo(threadID).participantNames[senderID];
                const message = {
                    body: `${userName} Gwapo si Hung 💩 Here's the video you requested:`,
                    attachment: fs.createReadStream(filePath)
                };
                return api.sendMessage(message, threadID, () => {
                    fs.unlinkSync(filePath); // Optionally remove the file after sending
                }, messageID);
            } else {
                return api.sendMessage("Sorry, the video file is not available.", threadID, messageID);
            }
        }
    }
};

module.exports.run = async function({ event, api }) {
    return api.sendMessage("error", event.threadID); // Placeholder response, adjust as needed
};
