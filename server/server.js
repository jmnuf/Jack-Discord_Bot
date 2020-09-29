const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const opn = require('opn');
const app = express();
const port = 42069;

// Basic Links
const site_base_link = '/nglr/jm/discordbots/jack/';
const css_base_link = '/nglr/jm/res/css/';
const js_base_link = '/nglr/jm/res/js/';
const home_link = site_base_link + 'home';

let bot;

app.use(cors());
app.use(bodyParser.json());

app.use(css_base_link, express.static('./website/css'));
app.use(js_base_link, express.static('./website/js'));

app.get(home_link, (req, res) => {
	fs.readFile('./website/index.html', (err, data) => {
		if (err) {
			console.error(err);
			res.status(404);
			return res.send('Error 404 Page not found');
		}
		res.status(200);
		return res.send(`${data}`);
	})
});


function initiate(discord_client) {
	bot = discord_client;
	if (bot) require('../server/jack_api')(app, bot);
	app.listen(port, () => {
		console.log('Server is online');
		// opn(`http://localhost:${port}${home_link}`);
	});
}

module.exports = {
	initiate
}