module.exports.config = {
  name: "sendnoti3",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "announcement from admin",
  commandCategory: "Admin",
  usages: "[Text]",
  cooldowns: 5
};

module.exports.languages = {
  "vi": {
    "sendSuccess": "Đã gửi thông báo tới %1 nhóm",
    "sendFail": "Không thể gửi thông báo tới %1 nhóm"
  },
  "en": {
    "sendSuccess": "Sent message to %1 thread!",
    "sendFail": "[!] Can't send message to %1 thread"
  }
};

module.exports.run = async ({ api, event, args, getText, Users }) => {
  const name = await Users.getNameUser(event.senderID);
  const moment = require("moment-timezone");
  var time = moment.tz("Asia/Manila").format("HH:mm:ss");
  var date = moment.tz("Asia/Manila").format("DD/MM/YYYY");
  var day = moment.tz("Asia/Manila").format("dddd");
  const header = `from Admin: ${name}\nDate: ${date} || Time: ${time} || Day: ${day}`;
  
  if (event.type == "message_reply") {
    const request = global.nodemodule["request"];
    const fs = require('fs');
    const axios = require('axios');
    var getURL = await request.get(event.messageReply.attachments[0].url);
    var pathname = getURL.uri.pathname;
    var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
    var path = __dirname + `/cache/snoti.${ext}`;
    var abc = event.messageReply.attachments[0].url;
    let getdata = (await axios.get(`${abc}`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));

    var allThread = global.data.allThreadID || [];
    var count = 1, cantSend = [];
    for (const idThread of allThread) {
      if (isNaN(parseInt(idThread)) || idThread == event.threadID) continue;
      else {
        api.sendMessage({
          body: `${args.join(' ')}\n\n${header}`,
          attachment: fs.createReadStream(path)
        }, idThread, (error, info) => {
          if (error) cantSend.push(idThread);
        });
        count++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    return api.sendMessage(getText("sendSuccess", count), event.threadID, () => (cantSend.length > 0) ? api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID) : "", event.messageID);
  } else {
    var allThread = global.data.allThreadID || [];
    var count = 1, cantSend = [];
    for (const idThread of allThread) {
      if (isNaN(parseInt(idThread)) || idThread == event.threadID) continue;
      else {
        api.sendMessage(`${args.join(' ')}\n\n${header}`, idThread, (error, info) => {
          if (error) cantSend.push(idThread);
        });
        count++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    return api.sendMessage(getText("sendSuccess", count), event.threadID, () => (cantSend.length > 0) ? api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID) : "", event.messageID);
  }
};
