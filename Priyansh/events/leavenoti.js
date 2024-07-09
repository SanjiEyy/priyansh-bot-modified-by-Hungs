module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩",
	description: "Ipa-notify ang Bot o ang tao nga mibiya sa grupo gamit ang random nga gif/photo/video",
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.onLoad = function () {
    return;
}

module.exports.run = async function({ api, event, Users, Threads }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
	const { createReadStream } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];
	const { threadID } = event;
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Manila").format("DD/MM/YYYY || HH:mm:ss");
    const hours = moment.tz("Asia/Manila").format("HH");
	const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
	const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
	const type = (event.author == event.logMessageData.leftParticipantFbId) ? "mibiya" : "gipahawa";
    const memberlength = (await api.getThreadInfo(threadID)).participantIDs.length;
	var msg, formPush;

	(typeof data.customLeave == "undefined") ? msg = "senpai {name} mibiya {type} pag-amping sa imong {session} senpai🥺 karon ang miembro kay {memberlength}" : msg = data.customLeave;
	msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type).replace(/\{session}/g, hours <= 10 ? "𝙈𝙤𝙧𝙣𝙞𝙣𝙜" : 
    hours > 10 && hours <= 12 ? "𝘼𝙛𝙩𝙚𝙧𝙣𝙤𝙤𝙣" :
    hours > 12 && hours <= 18 ? "𝙀𝙫𝙚𝙣𝙞𝙣𝙜" : "𝙉𝙞𝙜𝙝𝙩").replace(/\{time}/g, time).replace(/\{memberlength}/g, memberlength);  

	const gifUrl = "https://i.imgur.com/X3ZAKXW.gif";

	formPush = { body: msg, attachment: await global.utils.getStream(gifUrl) };

	return api.sendMessage(formPush, threadID);
};
