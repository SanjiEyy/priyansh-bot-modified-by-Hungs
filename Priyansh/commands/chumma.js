const fs = require("fs");

module.exports.config = {
    name: "chumma",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
    description: "Responds with a kiss emoji when specific triggers are detected.",
    commandCategory: "no prefix",
    usages: "🙂",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
    var { threadID, messageID, senderID } = event;

    // Check if the message starts with any of the trigger words or emojis
    if (event.body.indexOf("😘") == 0 || event.body.indexOf("kiss") == 0 || event.body.indexOf("chumma") == 0 || event.body.indexOf("chumu") == 0) {
        var msg = {
            body: `Ummmmmmaaaahhhhhh 😘😘 Baby 😘 - @${senderID}`,
        };

        // Send the response message
        api.sendMessage(msg, threadID, messageID, (error, info) => {
            if (!error) {
                // Set a reaction emoji on the triggering message
                api.setMessageReaction("😘", info.messageID, (err) => {
                    if (err) console.error("Error setting reaction:", err);
                }, true);
            } else {
                console.error("Error sending message:", error);
            }
        });
    }
};

module.exports.run = function({ api, event, client, __GLOBAL }) {
    // This function is intentionally left empty for this command.
};
