const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
    name: "help",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "Priyansh Rajput",
    description: "Beginner's Guide",
    commandCategory: "system",
    usages: "[Module Name | Page Number]",
    cooldowns: 1,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 300
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "✾══━━─✷꥟✷─━━══✾\n%1👑\n✾══━━─✷꥟✷─━━══✾\n%2\nUsage: %3\nRole: %4 🆓\nTotal Commands: %5\n✾══━━─✷꥟✷─━━══✾",
        "commandList": "✾══━━─✷꥟✷─━━══✾\n%1: %2 %3\nDescription: %4\nUsage: %5\nRole: %6 %7\n✾══━━─✷꥟✷─━━══✾",
        "randomFact": "Random fact (%1)\n%2",
        "dateTime": "Time and date 📅 timezone is Manila\n%1\n%2\n%3"
    }
};

const minecraftFacts = [
    "Minecraft was created by Markus Persson, also known as 'Notch'.",
    "Creepers were a coding error, intended to be pigs.",
    "Minecraft's world is approximately eight times the size of Earth.",
    "Minecraft was inspired by games like Dwarf Fortress, RollerCoaster Tycoon, and Dungeon Keeper.",
    "The Ender Dragon is the first official boss in Minecraft.",
    "You can play Minecraft in 'Peaceful' mode to avoid hostile mobs.",
    "Minecraft's first version was created in just six days.",
    "The rarest item in Minecraft is the Dragon Egg.",
    "Steve and Alex are the default character skins in Minecraft.",
    "Minecraft is used in education to teach subjects like math and history."
];

const codFacts = [
    "The first Call of Duty game was released in 2003.",
    "Call of Duty has been set in various historical and fictional settings.",
    "The franchise has sold over 300 million copies worldwide.",
    "Call of Duty: Modern Warfare 3 grossed $1 billion in 16 days.",
    "Call of Duty: Black Ops is the best-selling game in the franchise.",
    "The series has won numerous awards, including Game of the Year.",
    "Call of Duty features both single-player and multiplayer modes.",
    "The games often include realistic and historical weapons.",
    "Call of Duty: Warzone is a popular free-to-play battle royale game.",
    "The franchise has a loyal fan base and competitive esports scene."
];

const sciFiFacts = [
    "The term 'robot' originated from the 1920 Czech play 'R.U.R.' (Rossum's Universal Robots).",
    "'Blade Runner' was adapted from Philip K. Dick's novel 'Do Androids Dream of Electric Sheep?'.",
    "The Millennium Falcon set for 'Star Wars' was built using airplane scrap parts.",
    "The voice of E.T. in 'E.T. the Extra-Terrestrial' was created by combining recordings of raccoons, otters, and horses.",
    "'The Matrix' code is actually made up of Japanese sushi recipes.",
    "The light sabers in 'Star Wars' are made from camera flash handles.",
    "The inspiration for the look of the Xenomorph in 'Alien' came from H.R. Giger's painting 'Necronom IV'.",
    "'Avatar' was originally planned to be released in 1999 but was postponed due to the technology not being advanced enough.",
    "The 1982 film 'Tron' was one of the first to use extensive computer-generated imagery (CGI).",
    "The iconic 'I am your father' line from 'Star Wars: Episode V - The Empire Strikes Back' was kept a secret from the cast until filming."
];

function getRandomFact() {
    const allFacts = [
        { fact: minecraftFacts[Math.floor(Math.random() * minecraftFacts.length)], topic: "Minecraft" },
        { fact: codFacts[Math.floor(Math.random() * codFacts.length)], topic: "Call of Duty" },
        { fact: sciFiFacts[Math.floor(Math.random() * sciFiFacts.length)], topic: "Science Fiction" }
    ];
    return allFacts[Math.floor(Math.random() * allFacts.length)];
}

function getCurrentDateTime() {
    return moment().tz("Asia/Manila").format("h:mm A\nMMMM\ndddd");
}

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body == "undefined" || !body.startsWith("!help")) return;

    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
    if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;

    const command = commands.get(splitBody[1].toLowerCase());
    const prefix = global.config.PREFIX; // Assuming global config is accessible here

    const randomFactData = getRandomFact();
    const dateTime = getCurrentDateTime();
    const [time, month, day] = dateTime.split("\n");

    const formattedMessage = getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, getPermissionText(command.config.hasPermssion, getText), commands.size);
    const finalMessage = `${formattedMessage}\n${getText("randomFact", randomFactData.topic, randomFactData.fact)}\n${getText("dateTime", time, month, day)}`;

    return api.sendMessage(finalMessage, threadID, messageID);
};

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    if (!args[0]) {
        // List all commands in a structured format with pagination
        const arrayInfo = Array.from(commands.values())
            .sort((a, b) => a.config.name.localeCompare(b.config.name))
            .map((command, index) => getText("commandList", index + 1, command.config.name, getCommandMarker(command.config.hasPermssion), command.config.description, `${global.config.PREFIX}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, getPermissionText(command.config.hasPermssion, getText), getRoleIcon(command.config.hasPermssion)));

        // Pagination logic
        const numberOfOnePage = 10;
        const page = parseInt(args[0]) || 1;
        const startIdx = (page - 1) * numberOfOnePage;
        const endIdx = startIdx + numberOfOnePage;
        const commandsPage = arrayInfo.slice(startIdx, endIdx);

        const pageInfo = `✾══━━─✷꥟✷─━━══✾\n⚙ Total Pages: ${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)}\nTime and date 📅 timezone is Manila\n${getCurrentDateTime()}\n${getText("randomFact", getRandomFact().topic, getRandomFact().fact)}`;

        const messageToSend = commandsPage.join("\n") + `\n${pageInfo}`;

        return api.sendMessage(messageToSend, threadID, messageID);
    }

    const command = commands.get(args[0].toLowerCase());
    if (!command) return;

    const randomFactData = getRandomFact();
    const dateTime = getCurrentDateTime();
    const [time, month, day] = dateTime.split("\n");

    const formattedMessage = getText("moduleInfo", command.config.name, command.config.description, `${global.config.PREFIX}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, getPermissionText(command.config.hasPermssion, getText), commands.size);
    const finalMessage = `${formattedMessage}\n${getText("randomFact", randomFactData.topic, randomFactData.fact)}\n${getText("dateTime", time, month, day)}`;

    return api.sendMessage(finalMessage, threadID, messageID);
};

function getPermissionText(permissionLevel, getText) {
    switch (permissionLevel) {
        case 0:
            return "Users";
        case 1:
            return "Admin group";
        case 2:
            return "Admin bot";
        default:
            return "Users";
    }
}

function getCommandMarker(permissionLevel) {
    switch (permissionLevel) {
        case 0:
            return "🟩";
        case 1:
        case 2:
            return "👑";
        default:
            return "🟩";
    }
}

function getRoleIcon(permissionLevel) {
    switch (permissionLevel) {
        case 0:
            return "🆓";
        case 1:
        case 2:
            return "🔰";
        default:
            return "🆓";
    }
}
