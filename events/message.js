const fs = require("fs");
module.exports = (bot, message) => {
    // Ignore all bots
    if(message.author.bot) return;

    //Ignore Direct Messages
    if (!message.guild) {
        // TO-DO: Direct Messages handling
        // if (message.author.id !== bot.creatorID) return;
        // fs.writeFile('./archives/dm_channel.n_dc', message.channel, (err) => {
        //     if (err) throw err;
        //     console.log("saved channel data");
        // });
        // message.channel.send("😑");
        return;
    }
    const contents = message.content.trim();
    let commandRan = false;
    for (let prefix of bot.prefixes) { // run through all the possible prefixes
        if (contents.toLowerCase().startsWith(prefix)) {//Starts with the prefix
            const args = contents.slice(prefix.length).trim().split(/ +/g);
            if (args[0] === ",") args.shift();
            else if (args[0].startsWith(',')) args[0].substring(1);
            const command = args.shift().toLowerCase();
            // Get all the commands plus their aliases
            const aliases = commandAliases(bot.commands);
            // If that command doesn't exist, silently exit and do nothing
            if (!aliases.includes(command)) return;

            callCommand(bot, command, message, args);

            commandRan = true;

            break;
        }
    }
    if (!commandRan) {// runs if no command was run before
        if (contents.toLowerCase().endsWith(bot.suffix)) {//ends with suffix
            const args = contents.slice(0, -bot.suffix.length).trim().split(/ +/g);

            while (args[args.length - 1] === '' || args[args.length - 1] === '\n') args.pop();
            if (args[args.length - 1] === ",") args.pop();
            if (args[args.length - 1].endsWith(",")) {
                args[args.length - 1] = args[args.length - 1].substring(0, args.length - 3);
            }
            const command = args.shift().toLowerCase();
            // Get all the commands plus their aliases
            const aliases = commandAliases(bot.commands);
            // Check if the command doesn't exist as an alias or actual command name
            if (!aliases.includes(command)) {
                return; // doesn't exist leave silently
            } else {
                callCommand(bot, command, message, args);
            }
        } else if (/emoji:.*[^\s] */igm.test(contents)) {
            var args = contents.trim().split(/ +/gm);
            const user = message.author;
            let mem = message.member;
            var emoji;
            if (!args[1]) {
                emoji = bot.getEmoji(args[0].substring("emoji:".length));
                if (emoji) {
                    message.delete({ timeout:1, reason: 'emoji request' });
                    return message.channel.send(`${emoji}`);
                } else {
                    return message.channel.send("Emoji not found");
                }
            }
            for (var i in args) {
                if (args[i].toLowerCase().startsWith("emoji:")) {
                    var line;
                    args[i] = args[i].substring("emoji:".length);
                    if (args[i].includes('\n')) {
                        line = '\n';
                    } else {
                        line = '';
                    }
                    emoji = bot.getEmoji(args[i]);
                    if (emoji) {
                        args[i] = `${emoji}${line}`;
                    } else {
                        args[i] = '';
                    }
                }
            }
            args.filter((val) => {
                return (val !== null || val !== undefined || val !== '');
            });
            message.delete({ timeout:1 });
            message.channel.send(
                embedObj(`${mem.nickname || user.username} says:`, `${args.join(" ")}`,
                    { name: `${user.username}`, icon_url: `${user.avatarURL}` })
            );
        }
    }
};

function commandAliases(commands) {
    let aliases = [];
    const cmds = commands.keyArray();

    for(let cmd of cmds) {
        aliases.push(cmd);
        let com = commands.get(cmd);
        let cmdAliases = com.aliases;
        
        if (cmdAliases) {
            let a = cmdAliases();
            for(let alias of a) {
                aliases.push(alias);
            }
        }
    }

    return aliases;
}

function callCommand(bot, command, message, args) {
    // Grab the command data from the client.commands Enmap
    let cmd = bot.commands.get(command);
    // If that command name doesn't exist, look for the command that uses this alias
    if (!cmd) {
        const cmds = bot.commands.keyArray();
        for (let c of cmds) {
            let isAlias = (bot.commands.get(c)).isAlias;
            if (isAlias) {
                if ( isAlias(command) ) {
                    cmd = bot.commands.get(c);
                    break;
                }
            }
        }
    }
    try { // Run the command
        cmd.run(bot, message, args);
    } catch (err) { // Catch any errors that may appear
        console.error(err);
    }
}

function embedObj(title, description, author) {
    return {
        embed: {
            title: `${title}`,
            description: `${description}`,
            author: author
        }
    };
}
