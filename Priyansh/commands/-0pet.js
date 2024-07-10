const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "pet",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Requested",
    description: "Fetches pet images from an API and sends them as attachments",
    commandCategory: "image",
    usages: "",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    try {
        // Fetch pet image from the API
        const petResponse = await axios.get("https://samirxpikachu.onrender.com/pet", {
            responseType: "stream"
        });

        if (petResponse.status === 200) {
            const petFileName = `pet_${Date.now()}.jpg`; // Generate a unique filename
            const petFilePath = path.resolve(__dirname, "cache", petFileName); // Path to save the pet image file

            const petWriter = fs.createWriteStream(petFilePath);
            petResponse.data.pipe(petWriter);

            petWriter.on("finish", async () => {
                // File saved, now fetch user's profile picture
                const id = event.senderID;
                const profilePicUrl = `https://api-turtle.vercel.app/api/facebook/pfp?uid=${id}`;

                const profilePicResponse = await axios.get(profilePicUrl, {
                    responseType: "stream"
                });

                if (profilePicResponse.status === 200) {
                    const profilePicFileName = `profile_pic_${Date.now()}.jpg`; // Generate a unique filename
                    const profilePicFilePath = path.resolve(__dirname, "cache", profilePicFileName); // Path to save the profile picture file

                    const profilePicWriter = fs.createWriteStream(profilePicFilePath);
                    profilePicResponse.data.pipe(profilePicWriter);

                    profilePicWriter.on("finish", () => {
                        // Profile picture saved, send both pet image and profile picture as attachments
                        api.sendMessage(
                            {
                                body: "Here is your pet image and profile picture:",
                                attachment: [
                                    fs.createReadStream(petFilePath),
                                    fs.createReadStream(profilePicFilePath)
                                ]
                            },
                            event.threadID,
                            () => {
                                // Delete temporary files after sending
                                fs.unlinkSync(petFilePath);
                                fs.unlinkSync(profilePicFilePath);
                            }
                        );
                    });

                    profilePicWriter.on("error", (err) => {
                        console.error("Error saving profile picture:", err);
                        api.sendMessage("An error occurred while processing the request.", event.threadID);
                    });
                } else {
                    api.sendMessage("Failed to fetch profile picture.", event.threadID);
                }
            });

            petWriter.on("error", (err) => {
                console.error("Error saving pet image:", err);
                api.sendMessage("An error occurred while processing the request.", event.threadID);
            });
        } else {
            api.sendMessage("Failed to fetch pet image.", event.threadID);
        }
    } catch (error) {
        console.error("API request error:", error);
        api.sendMessage("An error occurred while fetching the image.", event.threadID);
    }
};
