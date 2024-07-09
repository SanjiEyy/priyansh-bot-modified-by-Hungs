module.exports.config = {
    name: "antiout",
    eventType: ["log:unsubscribe"],
    version: "0.0.1",
    credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
    description: "Maminaw sa mga hitabo"
};

module.exports.run = async({ event, api, Threads, Users }) => {
    let data = (await Threads.getData(event.threadID)).data || {};
    if (data.antiout == false) return;
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
    const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
    const type = (event.author == event.logMessageData.leftParticipantFbId) ? "pagbulag sa kaugalingon" : "Kinsay nagpitikpitik sa likod?";
    if (type == "pagbulag sa kaugalingon") {
        api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
            if (error) {
                api.sendMessage(`Dili nako mapabalik pag-add si ${name} sa group :( `, event.threadID);
            } else api.sendMessage(`Ayaw ug lakaw, ${name}, gibalik tika sa group`, event.threadID);
        });
    }
}
