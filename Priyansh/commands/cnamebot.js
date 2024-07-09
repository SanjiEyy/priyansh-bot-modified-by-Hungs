const { PREFIX, BOTNAME } = global.config;

let originalNickname = ''; // Global variable to store the original nickname

module.exports.config = {
    name: "cnamebot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Your Name",
    description: `Set bot's nickname to 》 ${PREFIX} 《 ❃ ➠ ${BOTNAME} and revert if changed`,
    commandCategory: "Admin",
    usages: `${PREFIX}cnamebot`,
    cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
    const threadID = event.threadID;
    const botID = api.getCurrentUserID();

    try {
        // Get current thread info to fetch original nickname
        const threadInfo = await api.getThreadInfo(threadID);
        originalNickname = threadInfo.threadName;

        // Set the new nickname
        await api.changeNickname(`》 ${PREFIX} 《 ❃ ➠ ${BOTNAME}`, botID, threadID);

        // Listen for nickname changes
        api.listenMqtt(threadID, async (error, event) => {
            if (error) return; // Ignore and handle errors silently
            if (event.type === "change_nickname" && event.author == botID) {
                // If nickname changed by the bot, ignore
                return;
            }

            // If someone else changes the nickname, revert it
            await api.changeNickname(`》 ${PREFIX} 《 ❃ ➠ ${BOTNAME}`, botID, threadID);
        });

        // No additional messages sent upon success, per your request
        return;
    } catch (error) {
        // Handle errors silently, no additional messages sent
        return;
    }
};
