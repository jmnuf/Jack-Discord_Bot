exports.run = async (bot, message, args) => {
    if (message.author.id !== bot.creatorID) return;
    await console.log('Resetting commands...');
    await resetCommands(bot, message);
    await console.log('\n');
    message.channel.send('Commands have been reloaded!');
    // if (!args[0]) {
    //     return resetAll(bot);
    // } else {
    //     switch (args[0]) {
    //         case 'commands':
    //         case 'cmds':
    //             return await resetCommands(bot, message);
    //         case 'battle_system':
    //         case 'bs':
    //         case 'battle':
    //             return await resetBattleSystem(bot, message);
    //         case 'ss':
    //         case 'speach':
    //         case 'speach_system':
    //             return await resetSpeachSystem(bot, message);
    //         default:
    //             return await resetAll(bot, message);
    //     }
    // }
};

exports.help = () => {
    return {
        name: '**reset** - Unloads all commands and reloads them',
        value: '.',
        creatorOnly: true
    }
}

async function resetAll(bot, message) {
    await console.log('===============================');
    await console.log('Resetting everything');
    await console.log('-------------------------------');
    await console.log('Commands:');
    await resetCommands(bot, message);
    await console.log('--------Battle System--------');
    await resetBattleSystem(bot, message);
    await console.log('--------Speach System--------');
    await resetSpeachSystem(bot, message);
    try {
        await console.log('--------Player DataBase--------');
        await console.log('Trying to reload the player database...');
        await delete require.cache[require.resolve(`../archives/playerData.json`)];
        const data = await require('../archives/playerData.json');
        bot.playerData = JSON.parse( JSON.stringify(data) );
        await console.log('The player database has been reloaded');
    } catch (err) {
        await console.error(`Unable to reload the player database! ${err}`);
    }
    await console.log('===============================');
    await console.log('^Reset complete^');
}

async function resetCommands(bot, message) {
    const cmds = await bot.commands.keyArray();
    let cmd;
    for (var i in cmds) {
        cmd = await cmds[i];
        let response = await bot.unloadCommand(cmd);
        if (response) {
            await console.error(`Error Unloading: ${await response}`);
            continue;
        }
        // response = await bot.loadCommand(cmd);
        // if (response) {
        //     await console.error(`Error Loading: ${await response}`);
        //     continue;
        // }
    }
    await bot.fs.readdir("./commands/", (err, files) => {
        if (err) return console.error(err);
        files.forEach( async file => {
            if (!file.endsWith(".js")) return;
            let cmd = file.split(".")[0];
            const response = bot.loadCommand(cmd);
            if (response) {
                console.error(`Error Loading: ${await response}`);
            } else {
                await console.log(`The command \`${cmd}\` has been reloaded`);
            }
        });
    });
    await console.log('------------------------------' + '\nAll commands have been reloaded!');
}

async function resetBattleSystem(bot, message) {
    const bs = await bot.battle_system.keyArray();
    let cmd;
    for (var i in bs) {
        cmd = await bs[i];
        let response = await bot.unloader('battle_system',cmd);
        if (response) {
            await console.error(`Error Unloading: ${await response}`);
            continue;
        }
        response = await bot.onloader('battle_system', cmd);
        if (response) {
            await console.error(`Error Loading: ${await response}`);
            continue;
        }
        await console.log(`The command \`${cmd}\` from the battle system has been reloaded`);
    }
}

async function resetSpeachSystem(bot, message) {
    const ss = await bot.speach_system.keyArray();
    let cmd;
    for (var i in ss) {
        cmd = await ss[i];
        let response = await bot.unloader('speach_system', cmd);
        if (response) {
            await console.error(`Error Unloading: ${await response}`);
            continue;
        }
        response = await bot.onloader('speach_system', cmd);
        if (response) {
            await console.error(`Error Loading: ${await response}`);
            continue;
        }
        await console.log(`The command \`${cmd}\` from the speach system has been reloaded`);
    }
}
