const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "anivid",
    version: "1.0",
    hasPermssion: 0,
    credits: "Kshitiz",
    description: "Get random anime video",
    commandCategory: "fun",
    usages: "",
    cooldowns: 10,
};

module.exports.handleEvent = async function ({ event, api, args, message }) {
    const { threadID, messageID } = event;

    api.setMessageReaction("🕐", messageID, (err) => {}, true);

    try {
        const response = await axios.get("https://ani-vid-0kr2.onrender.com/kshitiz");
        const postData = response.data.posts;
        const randomIndex = Math.floor(Math.random() * postData.length);
        const randomPost = postData[randomIndex];

        const videoUrls = randomPost.map(url => url.replace(/\\/g, "/"));
        const selectedUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

        const videoResponse = await axios.get(selectedUrl, { responseType: "stream" });

        const cacheFolderPath = path.resolve(__dirname, 'cache');
        const tempVideoPath = path.join(cacheFolderPath, `${Date.now()}.mp4`);

        // Ensure cache folder exists
        if (!fs.existsSync(cacheFolderPath)) {
            fs.mkdirSync(cacheFolderPath);
        }

        const writer = fs.createWriteStream(tempVideoPath);
        videoResponse.data.pipe(writer);

        writer.on("finish", async () => {
            const stream = fs.createReadStream(tempVideoPath);
            const user = response.data.user || "@user_unknown";
            await api.sendMessage({
                body: `Random anime Video.`,
                attachment: stream,
            }, threadID, (err) => {
                if (err) console.error(err);
                fs.unlink(tempVideoPath, (err) => {
                    if (err) console.error(err);
                    console.log(`Deleted ${tempVideoPath}`);
                });
            });
            api.setMessageReaction("✅", messageID, (err) => {}, true);
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("Sorry, an error occurred while processing your request.", threadID, messageID);
    }
};

module.exports.run = async function ({ event, api }) {
    return api.sendMessage("error", event.threadID); // Placeholder response, adjust as needed
};
