const Discord = require('discord.js');
const Enmap = require("enmap");
const fs = require("fs");

const bot = new Discord.Client();
const config = require('./archives/config.json');

bot.config = config;

JSON.duplicate = (obj) => { return JSON.parse(JSON.stringify(obj)); };

require('./classes')(bot);

const scoreboards = require('./archives/scoreboards.json');

bot.scoreboards = scoreboards;

// bot.battlers = playerData;
// bot.peace_zones = peace_zones;
bot.creatorID = config.CreatorID;
bot.botID = config.BotID;
bot.prefixes = config.prefix;
bot.suffix = config.suffix;
const { Player } = require('discord-player');
const discordPlayer = new Player(bot);
const userMusic = require('./archives/user-music.json');
bot.music = {
    player: discordPlayer,
    playlists: userMusic.playlists,
    favorites: userMusic.favorites,
};

bot.playerInstance = function (id, data) {
    return new bot.classes.Player(id, bot, data);
}

bot.npcInstance = function (client, name) {
    return new bot.classes.NPC(client, bot, name);
};

bot.fs = fs;
bot.commands = new Enmap();
bot.battle_system = new Enmap();
bot.speach_system = new Enmap();

require('./systems/commandLoader.js')(bot);
require('./systems/functions.js')(bot);
// require('./systems/database_functions.js')(bot);

function init() {
    fs.readdir("./events/", (err, files) => {
        if (err) return console.error(err);
        files.forEach( async file => {
            if (!file.endsWith(".js")) return;
            const event = require(`./events/${file}`);
            let eventName = file.split(".")[0];
            bot.on(eventName, event.bind(null, bot));
            delete require.cache[require.resolve(`./events/${file}`)];
        });
    });

    fs.readdir("./commands/", (err, files) => {
        if (err) return console.error(err);
        files.forEach( async file => {
            if (!file.endsWith(".js")) return;
            let cmd = file.split(".")[0];
            const response = bot.loadCommand(cmd);
            if (response) { console.log(response); }
        });
    });

    // TO-DO: Battle System
    // fs.readdir("./systems/battle_system/", (err, files) => {
    //     if (err) return console.error(err);
    //     files.forEach( async file => {
    //         if (!file.endsWith(".js")) return;
    //         let sysName = file.split(".")[0];
    //         bot.onloader('battle_system', sysName);
    //     });
    // });

    // TO-DO: Speach System
    // fs.readdir("./systems/speach_system/", (err, files) => {
    //     if (err) return console.error(err);
    //     files.forEach( async file => {
    //         if (!file.endsWith(".js")) return;
    //         let sysName = file.split(".")[0];
    //         bot.onloader('speach_system', sysName);
    //     });
    // });
    
    bot.login(config.token);
}

init();
