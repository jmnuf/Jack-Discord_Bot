module.exports = (bot) => {
    bot.loadCommand = (commandName) => {
        try {
            bot.log(`Loading Command: ${commandName}`);
            const props = require(`../commands/${commandName}.js`);
            bot.commands.set(commandName, props);
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    };

    bot.unloadCommand = async (commandName) => {
        let command;
        if (bot.commands.has(commandName)) {
            command = bot.commands.get(commandName);
        }
        if (!command)
            return `The command \`${commandName}\` doesn"t seem to exist. Try again!`;

        if (command.shutdown) {
            await command.shutdown(bot);
        }
        delete require.cache[require.resolve(`../commands/${commandName}.js`)];
        return false;
    };
    
    bot.unloader = async (sysName, cmdName) => {
        let command;
        if (bot[sysName].has(cmdName)) {
            command = bot[sysName].get(cmdName);
        }
        if (!command)
            return `The command \`${cmdName}\` doesn"t seem to exist. Try again!`;

        if (command.shutdown) {
            await command.shutdown(bot);
        }
        delete require.cache[require.resolve(`../systems/${sysName}/${cmdName}.js`)];
        return false;
    };
    
    bot.onloader = async (sysName, cdmName) => {
        try {
            bot.log(`Loading ${sysName} command: ${cdmName}`);
            const props = require(`../systems/${sysName}/${cdmName}.js`);
            bot[sysName].set(cdmName, props);
            return false;
        } catch (e) {
            return `Unable to load command ${cdmName}: ${e}`;
        }
    };
};
