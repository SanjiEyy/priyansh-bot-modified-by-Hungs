const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "aniwall",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Requested",
    description: "Fetches random anime wallpapers from different categories",
    commandCategory: "image",
    usages: "",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const categories = ["random", "wedding", "valentine"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]; // Randomly select a category

    let apiUrl = "";
    switch (randomCategory) {
        case "random":
            apiUrl = "https://aniwall-kshtiz.vercel.app/random";
            break;
        case "wedding":
            apiUrl = "https://aniwall-kshtiz.vercel.app/wedding";
            break;
        case "valentine":
            apiUrl = "https://aniwall-kshtiz.vercel.app/valentine";
            break;
        default:
            apiUrl = "https://aniwall-kshtiz.vercel.app/random";
            break;
    }

    try {
        const response = await axios.get(apiUrl, {
            responseType: "stream"
        });

        if (response.status === 200) {
            const fileName = `aniwall_${randomCategory}_${Date.now()}.jpg`; // Generate a unique filename
            const filePath = path.resolve(__dirname, "cache", fileName); // Path to save the file

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            writer.on("finish", () => {
                // File saved, send it as an attachment
                api.sendMessage({ attachment: fs.createReadStream(filePath) }, event.threadID, () => {
                    fs.unlinkSync(filePath); // Delete the temporary file after sending
                });
            });

            writer.on("error", (err) => {
                console.error("Error saving file:", err);
                api.sendMessage("An error occurred while processing the image request.", event.threadID);
            });
        } else {
            api.sendMessage("Failed to fetch image from the API.", event.threadID);
        }
    } catch (error) {
        console.error("API request error:", error);
        api.sendMessage("An error occurred while fetching the image.", event.threadID);
    }
};
