exports.run = (bot, message, args) => {
    let patted = [];
    let patter = message.member.displayName;
    let guild = message.guild;
    let members = guild.members.cache;
    let msg, p_args, e_indx;
    if (!message.mentions.everyone) {
        if (!args || args.length < 1) {
            return message.channel.send(`You have to say who you're patting, I'm not gonna pat you!`);
        }
        if (args[0].toLowerCase() == 'everyone') {
            patted = atEveryone(members, message.member.id, args);
        } else {
            for (let m of message.mentions.members) {
                patted.push(m[1].displayName);
            }
            
            if (patted.length == 0) {
                p_args = '' + args.join(' ');
                e_indx = p_args.indexOf('except');
                if (e_indx != -1) {
                    p_args = p_args.substr(0, e_indx).trim();
                }
                p_args = p_args.split(',');
                for(let arg of p_args) {
                    let a = arg.toLowerCase().trim();
                    for(let mem of members) {
                        let m = mem[1];
                        let username = m.user.username.toLowerCase();
                        let displayed = m.displayName.toLowerCase();
                        if(username.includes(a) || displayed.includes(a)) {
                            patted.push(m.displayName);
                            break;
                        }
                    }
                }
            }
        }
    } else {
        patted = atEveryone(members, message.member.id, args);
    }
    if (args && (args.includes('except') || args.includes('---'))) {
        let index = args.indexOf('---') != -1 ? args.indexOf('---') : args.indexOf('except');
        index ++;
        let excluded = [];
        // p_args = '' + args.join(' ');
        p_args = JSON.parse(JSON.stringify(args)).slice(index, args.length).join(' ');
        e_indx = p_args.indexOf('except');
        if (e_indx != -1) {
            p_args = p_args.substr(e_indx).trim();
        }
        p_args = p_args.split(',');
        for (let i = 0; i < p_args.length; i++) {
            let q = `${p_args[i]}`.toLowerCase().trim();
            for (let m of members) {
                let name = m[1].displayName;
                let user = m[1].user;
                if (`${name}`.toLowerCase().includes(q) 
                        || `${user.username}`.toLowerCase().includes(q)) {
                    if (patted.includes(`${user}`) || patted.includes(`${name}`)) {
                        excluded.push(m[1]);
                        break;
                    }
                }
            }
        }
        patted = eliminateNotWanted(patted, excluded);
    }
    if (patted.length > 0) {
        msg = `**${patter}** has patted **${pattedStr(patted)}**`;
        msg = patEmbed(msg, bot.random);
    } else {
        msg = 'Failed to load members';
        
    }
    message.channel.send(msg);
};

exports.help = () => {
    return {
        name: '**pat** - command for patting people or bots, don\'t judge',
        value: '' +
            '`* <username>` - Pat a user or set of users seperated by `,`s\n' +
            '`* everyone` - pat everyone on the server'
        ,
        creatorOnly: false
    }
}

exports.isAlias = (arg) => {
    return ['pat'].includes(arg);
}

function patEmbed(msg, randInt) {
    let pattingUrls = JSON.parse(JSON.stringify(require('../archives/pattingGifs.json')));
    delete require.cache[require.resolve(`../archives/pattingGifs.json`)];
    let url = pattingUrls[ randInt(pattingUrls.length) ];
    return {
        embed: {
            title: 'Pat pat',
            description: msg,
            image: { url: url }
        }
    };
}

function pattedStr(patted) {
    if (patted.length > 1) {
        let last = patted.pop();
        let msg = patted.join(', ');
        return `${msg} and ${last}`;
    } else {
        return `${patted[0]}`;
    }
}

function atEveryone(members, senderID, args) {
    let arr = [];
    for (let m of members) {
        if (args && args.length > 0 && args.includes('--mention')) {
            // Insensible thought
            if (senderID != m[0]) arr.push(`${m[1].user}`);
        } else {
            // Sensible thought
            if (senderID != m[0]) arr.push(`${m[1].displayName}`);
        }
    }
    return arr;
}

function eliminateNotWanted(pattedArr, excludedArr) {
    let included = pattedArr.map((pat) => {
        let excluded = false;
        for(let ex of excludedArr) {
            if (`${pat}` == `${ex.user}` || `${pat}` == `${ex.displayName}`) {
                excluded = true;
            }
        }
        if (!excluded) return pat;
    });

    for (let i = included.length - 1; i >= 0; i--) {
        if (included[i] == undefined || included[i].trim() == '') {
            included.splice(i, 1);
        }
    }

    return included;
}
