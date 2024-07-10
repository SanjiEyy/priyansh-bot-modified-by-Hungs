const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "aniwall",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kshitiz",
  description: "Search for anime wallpapers",
  commandCategory: "image",
  usages: "{prefix}aniwall <subcommand> -<number of images>",
  cooldowns: 10,
};

module.exports.handleEvent = async function ({ event, api, args, message }) {
  const { threadID, messageID } = event;

  try {
    if (args.length === 0) {
      return api.sendMessage(this.config.usages, threadID, messageID);
    }

    let apiUrl = "";
    let numberSearch = 1;

    const subCommand = args.shift();

    switch (subCommand) {
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
        return api.sendMessage("Invalid subcommand.", threadID, messageID);
    }

    if (args.length > 0) {
      const arg = args[0];
      if (arg.startsWith("-")) {
        numberSearch = parseInt(arg.substring(1)) || 1;
      } else {
        return api.sendMessage("Invalid argument format.", threadID, messageID);
      }
    }

    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data || !data.urls || data.urls.length === 0) {
      return api.sendMessage("No wallpapers found.", threadID, messageID);
    }

    const imgData = [];
    const cacheFolderPath = path.resolve(__dirname, 'cache');

    if (!fs.existsSync(cacheFolderPath)) {
      fs.mkdirSync(cacheFolderPath);
    }

    for (let i = 0; i < Math.min(numberSearch, data.urls.length); i++) {
      const imageUrl = data.urls[i];

      try {
        const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imgPath = path.join(cacheFolderPath, `${i + 1}.jpg`);
        await fs.promises.writeFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      } catch (error) {
        console.error(error);
      }
    }

    await api.sendMessage({
      attachment: imgData,
      body: data.animeName || "- Wallpaper for you -"
    }, threadID, (err) => {
      if (err) console.error(err);
      fs.promises.readdir(cacheFolderPath).then(files => {
        for (const file of files) {
          fs.unlink(path.join(cacheFolderPath, file), err => {
            if (err) console.error(err);
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
    return api.sendMessage("An error occurred. Please try again later.", threadID, messageID);
  }
};

module.exports.run = async function ({ event, api }) {
  return api.sendMessage("Please use the command with a subcommand and arguments.", event.threadID);
};
