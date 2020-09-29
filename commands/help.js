const aliases = ['help', 'h', 'ayuda'];
const { MessageEmbed } = require('discord.js');

exports.run = (bot, message, args = []) => {
    let embed;
    const cmds = bot.commands.keyArray();
    if (args.length < 1) {
        embed = display_cmd_list(bot, cmds);
    } else {
    }
    console.log(embed);
    if (embed)
        message.channel.send(embed);
};

function display_cmd_list(bot, cmds) {
    let fields = [];
    const e = new MessageEmbed();
    e.setTitle('Commands list')
    for (let cmd of cmds) {
        let command = bot.commands.get(cmd);
        if (command.help) {
            let helpField = command.help();
            if (helpField.createrOnly && message.author.id != bot.creatorID) continue;
            let field = helpField.name.split(' - ');
            console.log(field, field[0]);
            // field[0] = field[0].replaceAll(/\*/g, '');
            // fields.push({
            //     name: field[0],
            //     value: field[1]
            // });
            try {
                e.addField(`${field[0]}`, `${field[1]}`);
            } catch (err) {
                console.error('Failed to load field ' + field[0]);
            }
        }
    }

    return e//{
    //     embed: {
    //         title: 'Commands List',
    //         description: '',
    //         fields: fields
    //     }
    // };
}

function get_cmd(bot, cmd_str, msg) {
    const cmd = bot.commands.get(cmd_str);
    const help = cmd.help();
    if (help.createrOnly && message.author.id != bot.creatorID) {
        msg.delete()
            .then(_=>console.log('Unauthorized request of command, ' + cmd_str + ', deleted'))
            .catch(console.error);
        return { embed: {
            title: 'Unauthorized Request',
            description: 'You don\'t have access to this command. Help cannot be provided'
        } };
    }
    return { embed: {
        title: help.name,
        description: '_If words are surrounded by the symbols `<` `>` they are required parameters_\n' +
            '_If words are surronded by the symbols `[` `]` they are optional parameters_\n' +
            '_If the symbol `|` appears that means that only one of the parameters can be used_\n' + 
            help.value
    } };
}

exports.help = () => {
    return {
        name: '**help** - Displays the current menu',
        value: '`*` - display a list of all commands\n' +
            '`* <command-name>` - display the details of the given command',
        creatorOnly: false
    }
}

exports.isAlias = (arg) => {
    return aliases.includes(arg);
}

exports.aliases = () => {
    return JSON.parse(JSON.stringify(aliases));
}
