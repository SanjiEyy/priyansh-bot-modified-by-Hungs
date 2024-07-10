const axios = require('axios');

module.exports.config = {
    name: "shoti",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Your Name",
    description: "Get a random shoti image.",
    commandCategory: "Media",
    usages: "",
    cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
    try {
        const apiKey = '$shoti-1ho3b41uiohngdbrgk8';
        const apiUrl = `https://shoti-srv1.onrender.com/api/v1/get?key=${apiKey}`;

        const response = await axios.get(apiUrl);
        const imageUrl = response.data.url;

        // Send the image URL as a message
        return api.sendMessage({ attachment: imageUrl }, event.threadID);
    } catch (error) {
        console.error('Error fetching shoti image:', error);
        return api.sendMessage("An error occurred while fetching the shoti image.", event.threadID);
    }
};
