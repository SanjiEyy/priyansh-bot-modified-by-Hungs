const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "pet",
  credits: "MILAN",
  version: "1.1",
  cooldowns: 10,
  hasPermmision: 0,
  description: "Pet someone.",
  commandCategory: "tools",
  usages: "{p} [blank | reply | mention | uid]"
};

module.exports.handleEvent = async function ({ event, api }) {
  const { threadID, messageID, senderID, body } = event;
  let id;
  
  if (body.indexOf('@') !== -1) {
    id = Object.keys(event.mentions);
  } else {
    id = body.split(' ')[1] || senderID;
  }

  if (event.type === "message_reply") {
    id = event.messageReply.senderID;
  }

  const tempFilePath = path.resolve(__dirname, "temp.png");

  try {
    const response = await axios.get(`https://samirxpikachu.onrender.com/pet?url=https://api-turtle.vercel.app/api/facebook/pfp?uid=${id}`, { responseType: 'stream' });

    const writeStream = fs.createWriteStream(tempFilePath);
    response.data.pipe(writeStream);

    writeStream.on('finish', () => {
      const stream = fs.createReadStream(tempFilePath);
      api.sendMessage({ body: "My Pet", attachment: stream }, threadID, messageID, (err) => {
        if (err) console.error(err);
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error(err);
          console.log(`Deleted ${tempFilePath}`);
        });
      });
    });

    writeStream.on('error', (err) => {
      console.error(err);
      api.sendMessage("Failed to pet someone. Please try again.", threadID, messageID);
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while attempting to pet someone.", threadID, messageID);
  }
};

module.exports.run = async function ({ event, api }) {
  return api.sendMessage("Preparing to pet someone...", event.threadID);
};
