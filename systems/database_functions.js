const table_name = 'jack_users';
const MySQL = require('mysql');
const connection =  (function() {
    let c = MySQL.createConnection({
        host: "localhost",
        user: "jackbot",
        password: "DiscordB0TPass",
        database: 'nglr_discord_bots'
      });
    
    c.connect( (err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to \'mydiscordbot_userdata\' database!');
    });
    
    return c;
})();

module.exports = (bot) => {
    bot.db = {};

    bot.db.allPlayers = function (fnx = defSearchFnx) {
        return connection.query(`SELECT * FROM ${table_name}`, fnx);
    };

    bot.db.findPlayer = function(id, fnx = defSearchFnx) {
        return connection.query(`SELECT * FROM ${table_name} WHERE id="${id}"`, fnx);
    };

    bot.db.addPlayer = function(id, fnx = defAddPlayerFnx, name = "nameless") {
                    //  id, respect, agi, str, int, name, d_name, bio, titles, title_c, a_title, avatar, banner
        let values = `("${id}", "${name}", "${name}")`;
        return connection.query(`INSERT INTO ${table_name} (user_id, name, display_name) VALUES ${values}`, fnx);
    };

    bot.db.editPlayer = function(data, fnx = defEditPlayerFnx) {
        let id = data.id;
        let set = '';
        return connection.query(`UPDATE ${table_name} SET ${set} WHERE id="${id}"`, fnx);
    }
}

function defSearchFnx(err, result, fields) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(result);
}

function defAddPlayerFnx(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`${result.affectedRows} player has been added to the database!`);
}

function defEditPlayerFnx(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`${result.affectedRows} player has been updated`);
}
