const fs = require('fs-extra');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

module.exports.config = {
    name: "music",
    version: "1.0",
    hasPermssion: 0,
    credits: "Author",
    description: "Play a music",
    commandCategory: "entertainment",
    usages: "[music name]",
    cooldowns: 15,
};

module.exports.handleEvent = async function ({ event, api, args }) {
    const { threadID, messageID } = event;
    const musicName = args.join(' ');

    if (!musicName) {
        api.sendMessage(`To get started, type music and the title of the song you want.`, threadID, messageID);
        return;
    }

    try {
        api.sendMessage(`Searching for "${musicName}"...`, threadID, messageID);
        const searchResults = await yts(musicName);
        
        if (!searchResults.videos.length) {
            return api.sendMessage("Can't find the search.", threadID, messageID);
        } else {
            const music = searchResults.videos[0];
            const musicUrl = music.url;
            const stream = ytdl(musicUrl, { filter: "audioonly" });
            const time = new Date();
            const timestamp = time.toISOString().replace(/[:.]/g, "-");
            const filePath = `cache/${timestamp}_music.mp3`;

            stream.pipe(fs.createWriteStream(filePath));
            stream.on('end', () => {
                if (fs.statSync(filePath).size > 26214400) { // 25MB limit
                    fs.unlinkSync(filePath);
                    return api.sendMessage('The file could not be sent because it is larger than 25MB.', threadID);
                }

                const message = {
                    body: `${music.title}`,
                    attachment: fs.createReadStream(filePath)
                };

                api.sendMessage(message, threadID, () => {
                    fs.unlinkSync(filePath);
                }, messageID);
            });
        }
    } catch (error) {
        console.error(error);
        api.sendMessage('An error occurred while processing your request.', threadID, messageID);
    }
};

module.exports.run = async function ({ event, api }) {
    return api.sendMessage("error", event.threadID); // Placeholder response, adjust as needed
};
