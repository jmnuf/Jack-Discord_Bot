exports.run = async (bot, message, args) => {
	if(!message.member.voice.channel) return message.channel.send(`Can't skip if you're not in the vc`);
	const player = bot.music.player;
	if (!player.isPlaying(message.guild.id)) return message.channel.send('Not playing any music to skip, genius');

	const track = await player.skip(message.guild.id);

	message.channel.send(`Song \`${track.name}\` skipped...`);
}