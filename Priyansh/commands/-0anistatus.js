const axios = require('axios');

module.exports.config = {
    name: "anistatus",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Your Name",
    description: "Get a random anime status video.",
    commandCategory: "Media",
    usages: "",
    cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
    try {
        const response = await axios.get('https://ani-status.vercel.app/kshitiz');
        const videoUrl = response.data.url;

        // Send the video URL as a message
        api.sendMessage(videoUrl, event.threadID, async (err, info) => {
            if (err) {
                console.error('Error sending anime status video URL:', err);
                return api.sendMessage("An error occurred while sending the anime status video URL.", event.threadID);
            }

            // Add reactions after sending the message
            try {
                await api.react('⏰', info.messageID); // React with ⏰ emoji
                await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for 2 seconds
                await api.react('✅', info.messageID); // React with ✅ emoji
            } catch (reactError) {
                console.error('Error adding reaction:', reactError);
            }
        });
    } catch (error) {
        console.error('Error fetching anime status video:', error);
        return api.sendMessage("An error occurred while fetching the anime status video.", event.threadID);
    }
};
