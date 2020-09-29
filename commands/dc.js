exports.run = (bot, message) => {
	if (bot.musicConnection) {
		bot.musicConnection.disconnect();
	}
}