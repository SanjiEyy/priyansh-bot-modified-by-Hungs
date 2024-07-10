const axios = require('axios');

module.exports.config = {
    name: "ai3",
    description: "Ask GPT-4 a conversational question",
    credits: 'https://nemory-project.vercel.app/',
    commandCategory: "user",
    cooldowns: 3,
    usages: "[question]",
};

module.exports.run = async ({ api, event, args }) => {
    if (args.length === 0) {
        return api.sendMessage("Please provide a question.", event.threadID, event.messageID);
    }
    
    const question = args.join(" ");
    const searchMessage = `Looking for an answer for "${question}"...`;
    api.sendMessage(searchMessage, event.threadID, event.messageID);

    const apiUrl = `https://ai-1stclass-nemory-project.vercel.app/api/llama?ask=${encodeURIComponent(question)}`;

    try {
        const response = await axios.get(apiUrl);
        const message = response.data.response || "Sorry, I couldn't understand the question.";

        // Delayed response to simulate processing
        setTimeout(() => {
            api.sendMessage(message, event.threadID);
        }, 3000);
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("Sorry, an error occurred while processing your request.", event.threadID);
    }
};
