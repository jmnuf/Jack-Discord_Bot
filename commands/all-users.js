exports.run = (bot, message) => {
	const client = message.channel;
	if (message.author.id != bot.creatorID) {
		return client.send('You don\'t have the power for this suicidal tactic!');
	}
	const users = bot.users.cache.map(u => {
		return { username: u.username, id: u.id };
	});
	// const ids = users.keyArray();
	for (let user of users) {
		client.send(`${user.username} => ${user.id}`);
	}
	client.send('Total users: ' + users.length);
};