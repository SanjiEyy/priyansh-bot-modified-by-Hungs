const axios = require('axios');

module.exports.config = {
    name: "rantwall",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Your Name",
    description: "Posts a message on the Rant Wall.",//inspired by @maxi rue rant wall
    commandCategory: "general",
    usages: "[To: recipient]\n📃 Message: your message\nFrom: your name",
    cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event, args }) {
    const threadID = event.threadID;

    // Extracting recipient, message, and sender from arguments
    const regex = /(?:\[To: )(.+)(?:\]\n📃 Message: )(.+)(?:\nFrom: )(.+)/s;
    const matches = args.join(" ").match(regex);

    if (!matches || matches.length !== 4) {
        return api.sendMessage(`Invalid format! Use it like this:\n\n[To: recipient]\n📃 Message: your message\nFrom: your name`, threadID);
    }

    const recipient = matches[1].trim();
    const message = matches[2].trim();
    const sender = matches[3].trim();

    const formattedMessage = `🧱 | Rant Wall\n\nTo: ${recipient}\n\n📃 | Message:\n      — ${message}\n\nFrom: ${sender}`;

    try {
        // Example: Posting to Facebook API (replace with your actual Facebook API integration)
        const response = await axios.post('https://your-facebook-api-url.com/post', {
            message: formattedMessage,
            threadID: threadID  // Optionally pass threadID or other necessary identifiers
        });

        console.log('Facebook Post Response:', response.data);

        return api.sendMessage(`Message posted on Facebook successfully!`, threadID);
    } catch (error) {
        console.error('Error posting to Facebook:', error);
        return api.sendMessage(`Failed to post message on Facebook. Please try again later.`, threadID);
    }
};
