module.exports = async (bot, server) => {
	const presUpdtChnl = bot.config.presenceUpdaterChannel;
	if (presUpdtChnl)
		bot.channels.fetch(presUpdtChnl).then(chn => {
			bot.presenceUpdaterChannel = chn;
		}).catch(console.error);
    bot.user.setActivity("corpses burn", { type: "WATCHING"});
    console.log("Bot is currently up and running!");
    require('../server/server.js').initiate(bot);
};
