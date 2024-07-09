const axios = require("axios");

module.exports.config = {
  name: "tempmail",
  credits: "yourname",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Generate a temporary email address",
  commandCategory: "utility",
  usages: "{p}tempmail",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID } = event;

  let createApiUrl = "https://joshweb.click/tempmail/create";
  let getApiUrl = "https://global-sprak.onrender.com/api/tempmail/get";
  let tempMail = "";

  try {
    // Attempt to create a temporary email using the first API
    const createResponse = await axios.get(createApiUrl);

    if (createResponse.status === 200 && createResponse.data && createResponse.data.email) {
      tempMail = createResponse.data.email;
    } else {
      // Fallback to the second API if the first one fails
      const getResponse = await axios.get(getApiUrl);

      if (getResponse.status === 200 && getResponse.data && getResponse.data.email) {
        tempMail = getResponse.data.email;
      } else {
        throw new Error("Failed to generate temporary email from both APIs");
      }
    }

    api.sendMessage(`Temporary Email Address:\n${tempMail}`, threadID);
  } catch (err) {
    console.error(err);
    api.sendMessage("Failed to generate temporary email address.", threadID, messageID);
  }
};
