module.exports = (bot, oldPresence, newPresence) => {
	// if (oldPresence && oldPresence.status === newPresence.status) return;
	const user = newPresence.user;
	let msg = `<[${new Date()}]> **${user.username}**(${newPresence.userID}): `;
	let oldActs = '';
	let pastPres = '';
	if (oldPresence) {
		pastPres += `${oldPresence.status}`;
		oldActs += '[';
		for(let i = 0; i < oldPresence.activities.length; i++) {
			const act = oldPresence.activities[i];
			oldActs += `${act.name}`;
			if (act.state) {
				oldActs += `{${act.state}}`;
			} else {
				oldActs += `{undefined}`;
			}
			if (i + 1 < oldPresence.activities.length) {
				oldActs += ', ';
			}
		}
		oldActs += ']';
	} else {
		pastPres += 'undefined';
	}
	msg += `${pastPres}${oldActs} => **${newPresence.status}**`;
	msg += '[';
	for(let i = 0; i < newPresence.activities.length; i++) {
		const act = newPresence.activities[i];
		msg += `${act.name}`;
		if (act.state) {
			msg += `{${act.state}}`;
		} else {
			msg += `{Stateless}`;
		}
		if (i + 1 < newPresence.activities.length) {
			msg += ', ';
		}
	}
	msg += ']';

	// console.log(msg);

	if (bot.presenceUpdaterChannel) {
		bot.presenceUpdaterChannel.send(msg);
	} else {
		console.log(msg);
	}

}