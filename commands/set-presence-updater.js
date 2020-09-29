exports.run = (bot, message) => {
	if (message.author.id != bot.creatorID) {
		return client.send('You don\'t have the power for this settings!');
	}
	bot.presenceUpdaterChannel = message.channel;
}