const axios = require('axios');

module.exports = {
    config: {
        name: "waifu",
        version: "1.0",
        credits: "Fahim_Noob",
        cooldown: 5,
        hasPermmision: 0,
        Description: "Fetches a random waifu image or specific waifu category (waifu, neko, shinobu, megumin, bully, cuddle, cry, kiss, lick, hug, awoo, pat, smug, bonk, yeet, blush, smile, wave, highfive, handhold, nom, bite, glomp, slap, kill, kick, happy, wink, poke, dance, cringe).",
        commandCategory: "anime",
        usage: "{prefix}waifu [category]"
    },

    onStart: async function ({ message, args }) {
        try {
            let apiUrl = 'https://smfahim.onrender.com/fetch/waifu';
            if (args.length > 0) {
                apiUrl += `/${args.join(" ")}`;
            }

            const response = await axios.get(apiUrl);
            const img = response.data.url;

            if (!img) {
                return message.reply('No image found.');
            }

            const form = {
                body: `   「 𝔀𝓪𝓲𝓯𝓾 」   `,
                attachment: await global.utils.getStreamFromURL(img)
            };

            message.reply(form);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                message.reply('No waifu found for the specified category.');
            } else {
                console.error('Error fetching waifu:', error);
                message.reply('An error occurred while fetching the waifu image.');
            }
        }
    }
};
