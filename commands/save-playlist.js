exports.run = async (bot, message, args = []) => {
	const player = bot.music.player;
	if (!player.isPlaying(message.guild.id)) {
		return message.channel.send('There is no playlist running right now to save');
	}

	if (!bot.music.playlists[message.author.id])
		bot.music.playlists[message.author.id] = {};

	let pl_name;
	
	if (args.length > 0) {
		pl_name = args.join(' ');
	} else {
		pl_name = `Playlist-${Object.keys(bot.music.playlists[message.author.id])}`;
	}
	
	bot.music.playlists[message.author.id][`${pl_name}`] = (await player.getQueue(message.guild.id)).tracks.map(track => {return {title: `${track.name}`, url: `${track.url}`}});
	

	await bot.fs.writeFile('./archives/user-music.json', JSON.stringify({ playlists: bot.music.playlists, favorites: bot.music.favorites }), console.error);
	message.channel.send('Playlist saved');
}