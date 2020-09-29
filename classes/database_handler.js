const MySql = require('mysql');

module.exports = class DatabaseHandler {
    constructor() {
        this.connection;
    }

    /**
     * A function to connect towards the database. Only call once per instance of the class!
     */
    connect() {
        this.connection = (function() {
            let c = MySql.createConnection({
                host: 'localhost',
                user: 'jackbot',
                password: "DiscordB0TPass",
                database: 'nglr_discord_bots'
            });

            c.connect(function (err) {
                if (err) throw err;
                console.log('Connected to the database!');
            });

            return c;
        })();
    }

    /**
     * Ends the connection to the database. Use when instance is about to be destroyed 
     * or is done querying the database
     */
    disconnect() {
        this.connection.end();
    }

    /**
     * A function to query into the nglr_discord_bots database and do something with the results
     * 
     * @param {String} q the SQL query that will be executed
     * @param {Function} fnx the function that receives the result object (and fields object if it's a SELECT)
     */
    query(q, fnx) {
        if (!this.connection || this.connection == null) {
            throw new Error('No connection has been established!');
        }
        this.connection.query(q, (err, results, fields) => {
            if (err) throw err;
            if (fnx) fnx(results, fields);
        });
    }

    /**
     * Returns an object with all the players currently in the battle system that are saved in the database of
     * active players
     * 
     * @param {Object} bot The object where the 'playerInstance' function is stored to 
     * instantiate player objects
     * @param {JSON} players The JSON object that will store all the players, if none is provided then
     * one is automatically created and this will always be returned
     * @returns {JSON} JSON object with all the players saved onto the database
     */
    async queryPlayers(bot, players = {}) {
        
        await this.query('SELECT * FROM jack_users', (results) => {
            for(let player of results) {
                players[player.user_id] = bot.playerInstance(player.user_id, player);
            }
        });

        return players;
    }
}