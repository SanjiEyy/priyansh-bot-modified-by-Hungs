const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "emi",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Requested",
    description: "Generate an image based on a prompt using the EMI API",
    commandCategory: "image",
    usages: "[prompt]",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    let prompt = args.join(" "); // Join all arguments to form the prompt
    if (!prompt) {
        return api.sendMessage("Please provide a prompt to generate the photo.", event.threadID);
    }

    const apiUrl = `https://joshweb.click/emi?prompt=${encodeURIComponent(prompt)}`;

    try {
        const response = await axios.get(apiUrl, {
            responseType: "stream"
        });

        if (response.status === 200) {
            const fileName = `emi_${Date.now()}.jpg`; // Generate a unique filename
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
