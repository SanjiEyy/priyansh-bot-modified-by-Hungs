const axios = require("axios");
const { getPrefix, getStreamFromURL, uploadImgbb } = global.utils;

module.exports.config = {
  name: "ai",
  credits: "Jun",
  version: "1.6",
  cooldowns: 5,
  hasPermmision: 0,
  description: "An AI that can do various tasks",
  commandCategory: "AI",
  usages: "{p}ai <query>",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

async function ai({ message: m, event: e, args: a, usersData: u }) {
  const p = [
    `${await getPrefix(e.threadID)}${this.config.name}`,
    `${this.config.name}`
    /*"ai"
    *you can add more prefix here
    */
  ];

  if (p.some(b => a[0].toLowerCase().startsWith(b))) {
    try {
      let prompt = "";
      if (e.type === "message_reply" && e.messageReply.attachments && e.messageReply.attachments[0]?.type === "photo") {
        const b = await uploadImgbb(e.messageReply.attachments[0].url);
        prompt = a.slice(1).join(" ") + ' ' + b.image.url;
      } else {
        prompt = a.slice(1).join(" ");
      }

      const __ = [{ id: e.senderID, tag: await u.getName(e.senderID) }];
      const r = await axios.post(`https://test-ai-ihc6.onrender.com/api`, {
        prompt: prompt,
        apikey: "GayKey-oWHmMb1t8ASljhpgSSUI",
        name: __[0]['tag'],
        id: __[0]['id'],
      });

      let _ = r.data.result.replace(/{name}/g, __[0]['tag']).replace(/{pn}/g, p[0]);
      if (r.data.av) {
        if (Array.isArray(r.data.av)) {
          const avs = r.data.av.map(url => getStreamFromURL(url));
          const avss = await Promise.all(avs);
          m.reply({
            body: _,
            mentions: __,
            attachment: avss
          });
        } else {
          m.reply({
            body: _,
            mentions: __,
            attachment: await getStreamFromURL(r.data.av)
          });
        }
      } else {
        m.reply({
          body: _,
          mentions: __
        });
      }
    } catch (error) {
      m.reply("Error " + error);
    }
  }
}

module.exports.run = ai;
