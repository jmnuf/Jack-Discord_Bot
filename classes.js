module.exports = function (bot) {
    let classes = {} // Load all classes into a JSON object
    classes.NPC = require('./classes/npc');
    classes.Player = require('./classes/player');
    classes.battle_system = require('./classes/battle_system');
    // classes.database_handler = require('./classes/database_handler');

    // Get a database connection for the bot to hold onto
    // bot.db = new classes.database_handler();
    // bot.db.connect();

    // save the classes for future use
    bot.classes = classes;
};