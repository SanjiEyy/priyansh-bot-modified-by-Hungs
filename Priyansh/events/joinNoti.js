const { existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
const { join } = global.nodemodule["path"];
const moment = require("moment-timezone");

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
    description: "Notification of bots or people entering groups with random gif/photo/video",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": "",
        "axios": "^0.24.0",
        "form-data": "^4.0.0"
    }
};

module.exports.onLoad = function () {
    // Ensure directories for cache are created if they don't exist
    const path = join(__dirname, "cache", "joinvideo");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    const pathRandomGif = join(__dirname, "cache", "joinvideo", "randomgif");
    if (!existsSync(pathRandomGif)) mkdirSync(pathRandomGif, { recursive: true });

    return;
}

module.exports.run = async function ({ api, event }) {
    const { createReadStream } = global.nodemodule["fs-extra"];
    const { threadID } = event;

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        // Bot's name and prefix settings
        const botName = global.config.BOTNAME || "YourBotName";
        const prefix = global.config.PREFIX || "!";

        // Change bot's nickname in the thread
        api.changeNickname(`[ ${prefix} ] • ${botName}`, threadID, api.getCurrentUserID());

        // Custom message when bot joins the thread
        const gifUrl = "https://imgur.com/a/ddaxdFw"; // Replace with your gif URL for bot join notification
        const joinMessage = `
            ✾══━━─✷꥟✷─━━══✾
            {adderofthebot} thank you for adding {botName} to the {threadName}
            ✾══━━─✷꥟✷─━━══✾
            Time and date 📅 bot joined
            ${moment.tz("Asia/Manila").format("HH:mm:ss")} ${moment.tz("Asia/Manila").format("DD/MM/YYYY dddd")} timezone is Manila
            ✾══━━─✷꥟✷─━━══✾
            Info about admin
            His fb {www.facebook.com/100080008820985}
            YOU CAN CALL HIM SENPAI
            ✾══━━─✷꥟✷─━━══✾
        `;
        
        return api.sendMessage({
            body: joinMessage.replace("{botName}", botName).replace("{threadName}", event.threadName),
            attachment: createReadStream(__dirname + "/cache/botjoin.mp4"),
        }, threadID);
    } else {
        try {
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
            const path = join(__dirname, "cache", "joinvideo");
            const pathGif = join(path, `${threadID}.video`);

            let mentions = [];
            let memLength = [];
            let nameArray = [];
            let i = 0;

            for (const id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }

            memLength.sort((a, b) => a - b);

            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const customJoinMessage = threadData.customJoin || `
                senpai {name}\n─────────────────\nHAS {type} the {threadName}\n ─────────────────\nYou are the {soThanhVien}th member\n─────────────────\nPlease Enjoy Your Stay\n─────────────────\nAnd Make Lots Of Friends..
            `;

            const msg = customJoinMessage
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, memLength.length > 1 ? 'Friends' : 'Friend')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            if (existsSync(pathGif)) {
                return api.sendMessage({
                    body: msg,
                    attachment: createReadStream(pathGif),
                    mentions,
                }, threadID);
            } else {
                const randomPath = join(__dirname, "cache", "joinGif", "randomgif");
                const randomFiles = existsSync(randomPath) ? readdirSync(randomPath) : [];

                if (randomFiles.length > 0) {
                    const randomFile = randomFiles[Math.floor(Math.random() * randomFiles.length)];
                    const pathRandom = join(randomPath, randomFile);
                    
                    return api.sendMessage({
                        body: msg,
                        attachment: createReadStream(pathRandom),
                        mentions,
                    }, threadID);
                } else {
                    return api.sendMessage({
                        body: msg,
                        mentions,
                    }, threadID);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
}

async function sendCanvasWelcomeMessage(name, groupName, groupIcon, memberCount, uid, backgroundUrl) {
    const FormData = require("form-data");
    const axios = require("axios");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("groupname", groupName);
    formData.append("groupicon", groupIcon);
    formData.append("member", memberCount);
    formData.append("uid", uid);
    formData.append("background", backgroundUrl);

    try {
        const response = await axios.post("https://joshweb.click/canvas/welcome", formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log("Canvas API response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending Canvas API request:", error);
        throw error;
    }
}
