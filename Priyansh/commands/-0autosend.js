const schedule = require('node-schedule');
const moment = require('moment-timezone');

module.exports.config = {
  name: "autosend",
  credits: "YourName",
  version: "1.0",
  cooldowns: 0,
  hasPermmision: 0,
  description: "Auto greets every hour based on Manila timezone with dynamic messages.",
  commandCategory: "utility",
  usages: "{p}autosend",
};

module.exports.handleEvent = async function ({ event, api }) {
  // No event handling needed for this command
};

module.exports.run = async function ({ api }) {
  // Define an array of dynamic greetings based on the current time
  const dynamicGreetings = [
    "Good morning! It's now {time} in Manila.",
    "Hello everyone! The time in Manila is {time}.",
    "Greetings! It's {time} right now in Manila.",
    "Hi there! Current time in Manila: {time}.",
    "Good day! It's {time} in Manila.",
    "Hello! The time is {time} in Manila.",
    "Greetings from Manila! It's {time} now.",
    "Hi everyone! It's currently {time} in Manila.",
    "Good afternoon! The time in Manila is {time}.",
    "Hello friends! It's {time} in Manila right now.",
    "Good evening! It's {time} in Manila.",
    "Hi there! The time is {time} in Manila.",
    "Good night! It's {time} in Manila.",
    "Hello folks! It's {time} now in Manila.",
    "Greetings! It's {time} in Manila.",
    "Hi everyone! The time in Manila is {time}.",
    "Good morning! It's {time} in Manila right now.",
    "Hello! It's {time} in Manila.",
    "Greetings from Manila! It's {time} now.",
    "Hi there! It's {time} in Manila.",
    "Good afternoon! The time is {time} in Manila.",
    "Hello friends! It's {time} in Manila.",
    "Good evening! It's {time} in Manila right now.",
    "Hi there! The time in Manila is {time}."
  ];

  // Define the schedule rule to run every hour
  const rule = new schedule.RecurrenceRule();
  rule.minute = 0; // Run at the beginning of every hour

  // Schedule the job to run based on Manila timezone (GMT+8)
  const job = schedule.scheduleJob({ tz: 'Asia/Manila', rule }, async function () {
    // Get the current time in Manila timezone
    const now = moment().tz('Asia/Manila');
    const formattedTime = now.format('HH:mm'); // Format time as "HH:mm"

    // Determine the index based on the current hour (0-23)
    const hourIndex = now.hour();

    // Select the greeting message corresponding to the current hour
    const greeting = dynamicGreetings[hourIndex].replace('{time}', formattedTime);

    // Send the greeting message to the thread where the bot is active
    const botUserID = await api.getCurrentUserID();
    api.sendMessage(greeting, botUserID); // Sends to the thread where the bot is active
  });

  console.log(`Auto greeting scheduled every hour based on Manila timezone.`);
};
