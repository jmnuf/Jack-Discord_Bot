const api_link = '../../../discordbots-api/jack/';
const server_node = document.getElementById('server-data');
let server_id = document.URL.substr(document.URL.lastIndexOf('/') + 1);
let server;

function q(a, b) {
	if (arguments.length === 1) return document.querySelector(a);
	return a.querySelector(b);
}

function qAll(a, b) {
	if (arguments.length === 1) return document.querySelectorAll(a);
	return a.querySelectorAll(b);
}

function display_server() {
	if (!server) return console.error('No server set!');
	q('title').innerHTML += ' | ' + server.name;
	q(server_node, '#server-icon').setAttribute('src', server.icon);
	q(server_node, '#server-name').innerHTML = server.name;
	q(server_node, '#server-id').innerHTML = 'ID: ' + server.id;
	if (server.description) {
		q(server_node, '#server-desc').innerHTML = 'Description: ' + server.description;
	} else {
		q(server_node, '#server-desc').innerHTML = 'No description available';
	}
	if (server.channels && server.channels.length > 0) {
		q(server_node, '#channels-title').innerHTML = 'Channels:';
		for (var i = 0; i < server.channels.length; i++) {
			list_channel(server.channels[i]);
		}
	}
	if (server.emojis && server.emojis.length > 0) {
		q(server_node, '#emojis-title').innerHTML = 'Emojis:';
		for (var i = 0; i < server.emojis.length; i++) {
			list_emoji(server.emojis[i]);
		}
	}
	let o = server.owner;
	q(server_node, '#owner-avatar').setAttribute('src', o.avatar);
	q(server_node, '#owner-name').innerHTML = 'Owner: ' + o.username + '#' + o.discriminator;
	q(server_node, '#owner-id').innerHTML = 'ID: ' + o.id;
	q(server_node, '#owner-nick').innerHTML = 'Server Display Name: ' + o.displayName;
}

function list_channel(channel) {
	if (!server) return console.error('No server set!');
	if (!channel) return console.error('Need a channel!');
	let placement = document.getElementById('channels');
	if (!placement) return console.error('Desired destination to place the channel doesn\'t exist!');
	let div = document.createElement('div');
	div.setAttribute('class', 'rounded-block dark-bg-a hover-light border-white bmodal-open');
	div.setAttribute('bmodal', 'channel-modal');
	div.appendChild(document.createElement('h3'));
	q(div, 'h3').innerHTML = `${channel.name} <br><h6>Type: <i>${channel.type}</i></h6>`;
	if (channel.type === 'text') {
		if (channel.nsfw) {
			div.appendChild(document.createElement('strong'));
			q(div, 'strong').innerHTML = 'NSFW';
		}
	} else if (channel.type === 'voice') {
		div.appendChild(document.createElement('strong'));
		if (channel.limit > 0) {
			q(div, 'strong').innerHTML = 'User Limit: ' + channel.limit;
		} else {
			q(div, 'strong').innerHTML = 'No User Limit';
		}
	} else if (channel.type === 'category') {
		console.log('Ignoring categories');
		return;
	}
	placement.appendChild(div);
	div.onclick = () => {
		let m = q('#channel-modal');
		q(m, '#ch-head').innerHTML = channel.name;
		let ul = q(m, '#ch-attr');
		ul.innerHTML = '';
		for(let attr of Object.keys(channel)) {
			if (attr === 'name') continue;
			ul.innerHTML += `<li><b>${attr}:</b> ${channel[attr]}</li>`
		}
		if (channel.type === 'text') {
			let f = q(m, '#ch-msg');
			let msg_inp = document.createElement('textarea');
			msg_inp.setAttribute('class', 'form-control');
			msg_inp.setAttribute('id', 'msg-cnt');
			f.appendChild(msg_inp);
			let snd_btn = document.createElement('div');
			snd_btn.setAttribute('class', 'btn btn-primary m-1');
			snd_btn.setAttribute('id', 'msg-snd');
			snd_btn.innerHTML = 'Send message';
			f.appendChild(snd_btn);
		}
	}
}

function list_emoji(e) {
	if (!server) return console.error('No server set!');
	if (!e) return console.error('Need an emoji!');
	let placement = document.getElementById('emojis');
	if (!placement) return console.error('Desired destination to place the emoji doesn\'t exist!');
	let emoji = document.createElement('img');
	emoji.setAttribute('class', 'emoji pad-3 mar-8');
	emoji.setAttribute('src', e.url);
	emoji.setAttribute('title', e.name);
	emoji.setAttribute('alt', e.name + '::' + e.id);
	placement.appendChild(emoji);
}

let xhttp = new XMLHttpRequest();

xhttp.open('GET', `${api_link}servers/${server_id}`);

xhttp.onreadystatechange = function () {
	if (this.readyState == 4) {
		if (this.status == 200) {
			let txt = this.responseText;
			server = JSON.parse(txt);
			display_server();
			if (_bmodal_open_buttons) _bmodal_open_buttons();
		}
	}
}

xhttp.send()
