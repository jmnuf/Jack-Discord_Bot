exports.run = async (bot, message, args) => {
	const voiceChannel = message.member.voice.channel;
	const client = message.channel;
	if (!voiceChannel) {
		client.send('You need to be in a voice channel to use this command');
		return false;
	}
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		client.send('I need permissions to be able to both join and speak in your VC, genius');
		return false;
	}
	const player = bot.music.player;
	const req = args.join(' ').trim();
	console.log(`>>${req}<<`);
	if (!player.isPlaying(message.guild.id)) {
		const result = await player.play(voiceChannel, req);
		if (!result) {
			return message.channel.send('Cannot play your song, too bad');
		}

		if(result.type === 'playlist'){
			message.channel.send(`${result.tracks.length} songs added to the queue...\nNow playing \`${result.tracks[0].name}\``);
		} else {
			message.channel.send(`Now playing \`${result.name}\``);
		}

		const queue = (await player.getQueue(message.guild.id))
			.on('end', () => {
				message.channel.send('Queue has died');
			})
			.on('trackChanged', (oldTrack, newTrack) => {
				message.channel.send(`Now playing \`${newTrack.name}\`...`);
			})
			;
	} else {
		const result = await player.addToQueue(message.guild.id, req).catch(console.error);
		if (!result) {
			return message.channel.send('Cannot play your song, too bad');
		}

		if (result.type === 'playlist') {
			message.channel.send(`${result.tracks.length} songs added to the queue...\nNow playing ${result.tracks[0].name}`);
		} else {
			message.channel.send(`\`${result.name}\` has been added to the queue`);
		}

	}
};