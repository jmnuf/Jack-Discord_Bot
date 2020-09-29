function jCopy(json) {
	return JSON.parse(JSON.stringify(json));
}

function api_link(url = '') {
	return `/nglr/jm/discordbots-api/jack/${url}`;
}

function web_link(url = '') {
	return `/nglr/jm/discordbots/jack/${url}`;
}

module.exports = (app, bot) => {
	app.get(api_link('servers'), (req, res) => {
		let guilds = bot.guilds.cache.map((g) => {
			let obj = { name: g.name, id: g.id, owner: g.ownerID };
			obj.icon = g.iconURL({ format: 'png', dynamic: true, size: 64 });
			return obj;
		});
		res.json(guilds);
	});
	bot.guilds.cache.forEach((g) => {
		// console.log(api_link(`servers/${g.id}`));
		app.get(api_link(`servers/${g.id}`), async (req, res) => {
			let obj = jCopy(g);
			// Getting the icon url
			obj.iconURL = undefined;
			obj.icon = g.iconURL({ format: 'png', dynamic: true, size: 128 });
			// Getting the list of all channels
			obj.channels = await get_channels_arr(g);
			// Getting the list of all emojis
			obj.emojis = await get_emojis_arr(g);
			// Getting who is the owner
			obj.owner = await get_owner_obj(bot, g);
			obj.ownerID = undefined;

			// console.log('obj.owner:')
			// console.log(obj.owner);
			res.json(obj);
		});

		app.get(web_link(`servers/${g.id}`), (req, res) => {
			read_html(bot, 'server_data', (err, dat) => {
				if (err) {
					console.log(err);
					res.status(404)
					return res.send('Error 404 Page not found');
				}
				res.status(200);
				return res.send(`${dat}`);
			});
		});

		app.get(api_link(`servers/${g.id}/channels`), (req, res) => {
			res.json(get_channels_arr(g));
		});

		app.post(api_link(`servers/${g.id}/channels/:channel`), (req, res) => {
			let ch_id = req.params.channel;
			let msg = req.body.message;
			let ch = g.channels.cache.map((c) => {if (c.id == ch_id) return c});
			ch = clean_arr(ch);
			if (ch.length === 0)
				return res.status(404).send(`Channel ${ch_id} wasn't found`);
			ch = ch[0];
			ch.send(msg)
				.then(() => {
					console.log(arguments);
					res.send('Message succesfully delivered');
				})
				.catch((err) => {
					console.error(err);
					res.status(500).send('Failed to send the message');
				});
		});
	});
};

function read_html(bot, html, fnx) {
	bot.fs.readFile(`./website/html/${html}.html`, fnx);
}

function get_channels_arr(guild) {
	return guild.channels.cache.map((ch) => {
		let channel = { name: ch.name, id: ch.id, deleted: ch.deleted };
		let type = ch.type;
		channel.type = type;
		if (type == 'text') {
			channel.string = ch.toString();
			channel.nsfw = ch.nsfw;
			channel.topic = ch.topic;
			channel.rateLimit = ch.rateLimitPerUser;
		} else if (type == 'voice') {
			channel.limit = ch.userLimit;
		}
		return channel;
	});
}

function get_owner_obj(bot, guild) {
	let o = {};
	let owner_g = guild.owner;
	let owner_u = bot.users.fetch(guild.ownerID);
	o.displayName = owner_g.displayName;
	if (owner_u instanceof Promise) {
		return Promise.resolve(owner_u).then((user) => {
			o.id = user.id;
			o.discriminator = user.discriminator;
			o.username = user.username;
			o.avatar = user.displayAvatarURL({format: 'png', dynamic: true, size: 256});
			console.log(o.avatar);
			return o;
		});
	} else {
		o.id = owner_u.id;
		o.discriminator = owner_u.discriminator;
		o.username = owner_u.username;
	}
	// o.avatar = owner_u.avatarURL({format: 'png', dynamic: true, size: 256});
	return o;
}

function get_emojis_arr(guild) {
	return guild.emojis.cache.map((e) => {
		return { name: e.name, id: e.id, gif: e.animated, url: e.url };
	});
}

function clean_arr(ucArr) {
	let cleanArr = [];
	for (let obj of ucArr) {
		if (obj !== undefined) cleanArr.push(obj);
	}
	return cleanArr;
}