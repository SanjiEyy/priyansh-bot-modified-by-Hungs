const axios = require("axios");

module.exports.config = {
  name: "mailbox",
  credits: "yourname",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Fetch emails from a temporary mailbox",
  commandCategory: "utility",
  usages: "{p}mailbox <email>",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

module.exports.run = async function ({ event, api, args }) {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    return api.sendMessage("Please provide a temporary email address.", threadID, messageID);
  }

  const email = args[0];
  let inboxApiUrl1 = `https://joshweb.click/tempmail/inbox?email=${encodeURIComponent(email)}`;
  let inboxApiUrl2 = `https://global-sprak.onrender.com/api/tempmail/inbox?email=${encodeURIComponent(email)}`;

  try {
    // Attempt to fetch emails from the first API
    const response1 = await axios.get(inboxApiUrl1);

    if (response1.status === 200 && response1.data) {
      api.sendMessage(`Inbox Emails:\n${JSON.stringify(response1.data)}`, threadID);
      return;
    }

    // If the first API fails, attempt to fetch emails from the second API
    const response2 = await axios.get(inboxApiUrl2);

    if (response2.status === 200 && response2.data) {
      api.sendMessage(`Inbox Emails:\n${JSON.stringify(response2.data)}`, threadID);
      return;
    }

    throw new Error("Failed to fetch emails from both APIs");
  } catch (err) {
    console.error(err);
    api.sendMessage("Failed to fetch emails from temporary mailbox.", threadID, messageID);
  }
};
