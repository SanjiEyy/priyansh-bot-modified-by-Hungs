module.exports.config = {
  name: "callad",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Report a bug of your bot to admin or comment",
  commandCategory: "Admin",
  usages: "[msg]",
  cooldowns: 5,
};

module.exports.handleReply = async function ({ api, args, event, handleReply, Users }) {
  try {
    const fs = require('fs-extra');
    const { join } = require('path');
    const axios = require('axios');

    // Function to generate random characters
    function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }

    // Process attachments from reply
    const attachments = event.messageReply.attachments || [];
    const attachmentPromises = attachments.map(async (attachment) => {
      const extension = attachment.type.split('_')[0]; // Extract file extension from attachment type
      const randomFileName = generateRandomString(10) + '.' + extension;
      const filePath = join(__dirname, 'cache', randomFileName);
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      await fs.writeFile(filePath, Buffer.from(response.data, 'binary'));
      return { path: filePath, name: randomFileName };
    });

    const attachmentResults = await Promise.all(attachmentPromises);

    const name = (await Users.getData(event.senderID)).name;
    const threadInfo = await api.getThreadInfo(event.threadID);
    const threadName = threadInfo.threadName || 'Unknown Thread';
    const userId = event.senderID;

    const moment = require('moment-timezone');
    const timeNow = moment().tz('Asia/Manila').format('HH:mm:ss D/MM/YYYY');

    const adminThreadId = '7729634530417299'; // Direct thread ID for admin

    let messageContent = `[📱 CALL ADMIN 📱]\n\n`;
    messageContent += `[👤] Report from: ${name}\n`;
    messageContent += `[❗] User ID: ${userId}\n`;
    messageContent += `[🗣️] Thread Name: ${threadName}\n`;
    messageContent += `[🔰] Thread ID: ${event.threadID}\n`;
    messageContent += `[💌] Message: ${args.join(' ') || 'No message provided'}\n`;
    messageContent += `[⏰] Time: ${timeNow}`;

    if (attachmentResults.length > 0) {
      const attachmentStreams = attachmentResults.map((result) => fs.createReadStream(result.path));
      await api.sendMessage({
        body: messageContent,
        attachment: attachmentStreams,
        mentions: [{ id: event.senderID, tag: name }],
      }, adminThreadId);
      attachmentResults.forEach((result) => fs.unlinkSync(result.path));
    } else {
      await api.sendMessage({
        body: messageContent,
        mentions: [{ id: event.senderID, tag: name }],
      }, adminThreadId);
    }

    // Push the message information to handleReply for tracking purposes
    global.client.handleReply.push({
      name: this.config.name,
      messageID: event.messageID,
      author: event.senderID,
      messID: event.messageID,
      id: event.threadID,
      type: 'calladmin',
    });
  } catch (error) {
    console.error('Error in handleReply:', error);
  }
};

module.exports.run = async function ({ api, event, Threads, args, Users }) {
  try {
    const fs = require('fs-extra');
    const { join } = require('path');
    const axios = require('axios');

    // Function to generate random characters
    function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }

    // Process attachments from messageReply
    const attachments = event.messageReply.attachments || [];
    const attachmentPromises = attachments.map(async (attachment) => {
      const extension = attachment.type.split('_')[0]; // Extract file extension from attachment type
      const randomFileName = generateRandomString(10) + '.' + extension;
      const filePath = join(__dirname, 'cache', randomFileName);
      const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
      await fs.writeFile(filePath, Buffer.from(response.data, 'binary'));
      return { path: filePath, name: randomFileName };
    });

    const attachmentResults = await Promise.all(attachmentPromises);

    const name = (await Users.getData(event.senderID)).name;
    const threadInfo = await api.getThreadInfo(event.threadID);
    const threadName = threadInfo.threadName || 'Unknown Thread';
    const userId = event.senderID;

    const moment = require('moment-timezone');
    const timeNow = moment().tz('Asia/Manila').format('HH:mm:ss D/MM/YYYY');

    const adminThreadId = '7729634530417299'; // Direct thread ID for admin

    let messageContent = `[🤖] - Bot has successfully sent your message to my owner 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 🍄 \n`;
    messageContent += `[⏰] - Time: ${timeNow}`;

    if (attachmentResults.length > 0) {
      const attachmentStreams = attachmentResults.map((result) => fs.createReadStream(result.path));
      await api.sendMessage({
        body: messageContent,
        attachment: attachmentStreams,
      }, event.threadID);
      attachmentResults.forEach((result) => fs.unlinkSync(result.path));
    } else {
      await api.sendMessage(messageContent, event.threadID);
    }
  } catch (error) {
    console.error('Error in run:', error);
  }
};
