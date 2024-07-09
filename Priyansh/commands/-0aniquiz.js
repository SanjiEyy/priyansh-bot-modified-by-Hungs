const animeQuizzes = [
  { question: "In 'Naruto', who is Naruto's father?", answer: "Minato Namikaze" },
  { question: "In 'Attack on Titan', what is Eren Yeager's Titan form called?", answer: "Attack Titan" },
  { question: "In 'One Piece', who is the captain of the Straw Hat Pirates?", answer: "Monkey D. Luffy" },
  { question: "In 'Dragon Ball', what is Goku's Saiyan name?", answer: "Kakarot" },
  { question: "In 'My Hero Academia', what is All Might's real name?", answer: "Toshinori Yagi" },
  { question: "In 'Fullmetal Alchemist', what are the names of the Elric brothers?", answer: "Edward and Alphonse" },
  { question: "In 'Sword Art Online', what is Kirito's real name?", answer: "Kazuto Kirigaya" },
  { question: "In 'Death Note', what is the name of the Shinigami who drops the Death Note?", answer: "Ryuk" },
  { question: "In 'Fairy Tail', who is the dragon that raised Natsu Dragneel?", answer: "Igneel" },
  { question: "In 'Bleach', what is Ichigo Kurosaki's Zanpakuto called?", answer: "Zangetsu" },
  { question: "In 'Hunter x Hunter', who is Gon Freecss' father?", answer: "Ging Freecss" },
  { question: "In 'One Punch Man', what is Saitama's hero name?", answer: "One Punch Man" },
  { question: "In 'Tokyo Ghoul', what is Kaneki's ghoul mask designed to look like?", answer: "A smiling mouth" },
  { question: "In 'Demon Slayer', what is the name of Tanjiro Kamado's sister?", answer: "Nezuko Kamado" },
  { question: "In 'Black Clover', what is the name of Asta's rival?", answer: "Yuno" },
  { question: "In 'JoJo's Bizarre Adventure', who is the first JoJo?", answer: "Jonathan Joestar" },
  { question: "In 'Re:Zero', what is the name of the witch who cursed Subaru Natsuki?", answer: "Satella" },
  { question: "In 'No Game No Life', what are the names of the main sibling duo?", answer: "Sora and Shiro" },
  { question: "In 'Sword Art Online', what is Asuna's real name?", answer: "Asuna Yuuki" },
  { question: "In 'Attack on Titan', what is the name of the military group Eren joins?", answer: "Survey Corps" }
];

module.exports.config = {
  name: "aniquiz",
  credits: "kshitiz",
  version: "1.0",
  cooldowns: 5,
  hasPermmision: 0,
  description: "Anime quiz game",
  commandCategory: "games",
  usages: "{p}aniquiz",
};

module.exports.handleEvent = async function ({ event, api }) {
  const { threadID, messageID, body } = event;

  if (!this.quizState) {
    this.quizState = {};
  }

  if (this.quizState[threadID] && this.quizState[threadID].question) {
    const correctAnswer = this.quizState[threadID].answer;
    const userName = event.senderName || "User";

    if (body.toLowerCase() === correctAnswer.toLowerCase()) {
      api.setMessageReaction("👍🏻", messageID, (err) => {}, true);
      api.sendMessage(`${userName}, you guessed it right! You're a genius! 😜`, threadID);
    } else {
      api.setMessageReaction("😢", messageID, (err) => {}, true);
      api.sendMessage(`${userName}, better luck next time! You better watch the anime 😉`, threadID);
    }
    delete this.quizState[threadID];
  }
};

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID } = event;

  const randomQuiz = animeQuizzes[Math.floor(Math.random() * animeQuizzes.length)];

  if (!this.quizState) {
    this.quizState = {};
  }

  this.quizState[threadID] = {
    question: randomQuiz.question,
    answer: randomQuiz.answer
  };

  return api.sendMessage(`Anime Quiz: ${randomQuiz.question}`, threadID, messageID);
};
