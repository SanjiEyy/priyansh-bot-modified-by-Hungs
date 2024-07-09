const fs = require("fs-extra");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

module.exports.config = {
    name: "musicvideo",
    version: "1.0",
    hasPermssion: 0,
    credits: "Author",
    description: "Play a music video",
    commandCategory: "entertainment",
    usages: "[video name]",
    cooldowns: 15,
};

module.exports.handleEvent = async function ({ event, api, args }) {
    const { threadID, messageID } = event;
    const videoName = args.join(' ');

    if (!videoName) {
        api.sendMessage(`To get started, type "music video" followed by the title of the video you want to play.`, threadID, messageID);
        return;
    }

    try {
        api.sendMessage(`Searching for "${videoName}"...`, threadID, messageID);
        const searchResults = await yts(videoName);

        if (!searchResults.videos.length) {
            return api.sendMessage("Can't find the video you searched for.", threadID, messageID);
        } else {
            const video = searchResults.videos[0];
            const videoUrl = video.url;
            const stream = ytdl(videoUrl, { filter: "audioandvideo" });
            const time = new Date();
            const timestamp = time.toISOString().replace(/[:.]/g, "-");
            const filePath = `cache/${timestamp}_music_video.mp4`;

            stream.pipe(fs.createWriteStream(filePath));
            stream.on('end', () => {
                if (fs.statSync(filePath).size > 26214400) { // 25MB limit
                    fs.unlinkSync(filePath);
                    return api.sendMessage('The video could not be sent because it is larger than 25MB.', threadID);
                }

                const message = {
                    body: `${video.title}`,
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
