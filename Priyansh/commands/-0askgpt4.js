const axios = require('axios');

module.exports.config = {
    name: "askgpt4",
    version: "1.0",
    hasPermssion: 0,
    credits: 'https://nemory-project.vercel.app/',
    description: "Ask the GPT-4 a question (conversational)",
    commandCategory: "utilities",
    usages: "[question]",
    cooldowns: 8,
};

module.exports.handleEvent = async function ({ event, api }) {
    const { threadID, messageID, body } = event;
    
    const args = body.trim().split(" ").slice(1); // Extracting arguments from the message

    if (args.length === 0) {
        api.sendMessage("Please provide a question.", threadID, messageID);
        api.setMessageReaction('❤️', messageID);
        return;
    }

    const question = args.join(" ");
    const searchMessage = `Looking for an answer for "${question}"...`;
    api.sendMessage(searchMessage, threadID, messageID);

    const apiUrl = `https://ai-1stclass-nemory-project.vercel.app/api/llama?ask=${encodeURIComponent(question)}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        const message = data.response || "Sorry, I couldn't understand the question.";

        setTimeout(() => {
            api.sendMessage(message, threadID, messageID);
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("Sorry, an error occurred while processing your request.", threadID);
    }
};

module.exports.run = async function ({ event, api }) {
    return api.sendMessage("error", event.threadID); // Placeholder response, adjust as needed
};
