const defaultScoreboardIco = 'https://i.pinimg.com/originals/03/e2/60/03e260747d115a128284343c45716de6.png';
const aliases = ['sb']

exports.run = (bot, message, args = []) => {
    if (args.length < 1) return client.send('Misuse of command');
    let client = message.channel;
    let boards = bot.scoreboards;
    let boardName, bName;
    const cmd = args.shift().toLowerCase();
    let boardEditor = false;
    let perms = message.member.permissions;
    if (perms.has("ADMINISTRATOR") || message.member.roles
            .some(r => ["admin", "Score Dealer", "Score Robber"].includes(r.name) || r.name.includes('admin')) ||
            message.author.id == bot.creatorID) {
        boardEditor = true;
    }
    let user, subcmd, url;
    // console.log(boards);
    switch (cmd) {
        case 'create': case '-c': case '+sb': // Create new score board
            if (!boardEditor) return client.send('You don\'t have enough power to create a scoreboard!\n' +
                'You need to be admin or have the `Score Dealer` role');
            if (args.length < 1) return client.send('When creating a board a name must be given');
            bName = args.join('-').toLowerCase();
            boards = createBoard(client, boards, `${message.guild.id}-${bName}`, bName);
            break;
        case 'adduser': case '+u': // add user to score board
            if (args.length < 2) return client.send('Must give the board name and a user');
            boardName = `${message.guild.id}-${args.shift().toLowerCase()}`;
            if (!boards[boardName]) return client.send('Scoreboard doesn\'t exist');
            user = getUser(message, args.join(' '));
            if (user) {
                boards[boardName][user.id] = 0;
                client.send('User **'+user.username+'** has been added');
            } else {
                client.send('Unable to find user');
            }
            break;
        case 'addself': case 'addme': case '+me':
            if (args.length < 1) return client.send('Must give the board name to enter');
            boardName = `${message.guild.id}-${args.shift().toLowerCase()}`;
            if (!boards[boardName]) return client.send('Scoreboard doesn\'t exist');
            user = message.author;
            boards[boardName][user.id] = 0;
            client.send('You have been added to ');
            break;
        case 'score': case 'scoreof': case '-sc':
            if (args.length < 2) return client.send('Invalid use of command');
            subcmd = args.shift().toLowerCase();
            bName = args.shift().toLowerCase();
            boardName = `${message.guild.id}-${bName}`;
            if (!boards[boardName]) return client.send('Scoreboard doesn\'t exist');
            user = getUser(message, args[0]);
            let amount;
            if (args[1]) {
                try {
                    amount = parseInt(args[1]);
                    if (amount == 0) amount = 1;
                } catch (err) {
                    amount = 1;
                }
            } else {
                amount = 1;
            }
            switch (subcmd) {
                case '++': case 'increase': case 'add':
                    if (!boardEditor) return client.send('You don\'t have enough power to change scores!\n' +
                        'You need to be admin or have the `Score Dealer` role');
                    if (boards[boardName][user.id] == undefined) {
                        boards[boardName][user.id] = 0;
                        // return client.send('This user isn\'t registered onto the scoreboard.' +
                        //     '\nAdd them with `j.scoreboard adduser <scoreboard-name> <user>`');
                    }
                    boards[boardName][user.id] += amount;
                    client.send(`New score for **${user.username}**: ${boards[boardName][user.id]}`);
                    break;
                case '--': case 'decrease': case 'sub':
                    if (!boardEditor) return client.send('You don\'t have enough power to change scores!\n' +
                        'You need to be admin or have the `Score Dealer` role');
                    if (boards[boardName][user.id] == undefined) {
                        boards[boardName][user.id] = 0;
                        // return client.send('This user isn\'t registered onto the scoreboard.' +
                        //     '\nAdd them with `j.scoreboard adduser <scoreboard-name> <user>`');
                    }
                    boards[boardName][user.id] -= amount;
                    client.send(`New score for **${user.username}**: ${boards[boardName][user.id]}`);
                    break;
                case 'top': case 'topof': case '-t':
                    if (args[0] && /\d+/.test(args[0])) {
                        topListing(boards[boardName], bName, message, parseInt(args[0]));
                    } else {
                        topListing(boards[boardName], bName, message);
                    }
                    break;
                case 'mine': case 'self': case '-s':
                    if (boards[boardName][message.author.id] == undefined)
                        return client.send('You are not in the table __' + bName + '__');
                    client.send('Your score is of **' + boards[boardName][message.author.id] + '**' + 
                        ' in the table __' + bName + '__');
                    break;
                case 'check': case '-c': case 'spyon': case 'spy':
                    // if (!args[1]) return client.send('You need to say who\'s score you want to view');
                    // user = getUser(message, args[1]);
                    client.send('**' + user.username + '**\'s score is of `' + 
                        boards[boardName][message.author.id] + '`' + 
                        ' in the table __' + bName + '__');
                    break;
            }
            break;
        case 'save': case '--s':
            if (!boardEditor) return client.send('You don\'t have enough power to save the scoreboards!\n' +
                'You need to be admin or have the `Score Dealer` role');
            try {
                bot.saveScoreboards();
                client.send('Scoreboards have been saved');
            } catch (err) {
                console.error(err);
                client.send('Unable to save the data!')
                client.send(`${err}`);
            }
            break;
        case 'configs': case '--c':
            if (!boardEditor) return client.send('You don\'t have enough power to edit a scoreboard!\n' +
                'You need to be admin or have the `Score Dealer` role');
            if (args.length < 2) return client.send('Invalid use of command');
            subcmd = args.shift().toLowerCase();
            bName = args.shift().toLowerCase();
            boardName = `${message.guild.id}-${bName}`;
            if (!boards[boardName]) return client.send('Scoreboard doesn\'t exist');
            switch(subcmd) {
                case '--ico':
                    url = getImageUrl(message, args[0]);
                    if (url) {
                        boards[boardName]['--ico'] = url;
                        (bot.commands.get('sb')).run(bot, message, ['-sc', '-t', bName, '5']);
                    } else {
                        client.send('Failed to changed table icon');
                    }
                    break;
            }
            break;
    }
    bot.scoreboards = boards;
};

exports.help = () => {
    return {
        name: '**scoreboard** - Used to manage scoreboards.',
        value: '' +
            '* `create <scoreboard-name>` - create a new scoreboard with the given name\n' +
            '* `adduser <scoreboard-name> <username>` - add a user with a score of 0 to a scoreboard\n' +
            '* `addself <scoreboard-name>` - add yourself to a scoreboard\n' +
            '* `score <add|sub> <scoreboard-name> <user> [quantity]` - change the score of a user\n' +
            '* `score top <scoreboard-name> [quantity]` - display the highest positions (default is 10)\n' +
            '* `configs --ico <scoreboard-name> [url|embed-image]` - set the scoreboard\'s icon'
        ,
        creatorOnly: false
    }
}

exports.isAlias = (arg) => {
    return aliases.includes(arg);
}

exports.aliases = () => {
    return JSON.parse(JSON.stringify(aliases));
}

function createBoard(client, boards, boardID, title) {
    if (boards[boardID]) {
        client.send('Scoreboard `' + title + '` already exists!');
    } else {
        boards[boardID] = {};
        boards[boardID]['--ico'] = defaultScoreboardIco;
        client.send('Scoreboard `' + title + '` has been created!');
    }
    return boards;
}

function topListing(board, bName, message, amount = 10) {
    let client = message.channel;
    let members = message.guild.members;
    let players = Object.keys(board);
    let boardScoreArr = [];
    let body = '', title = `Top ${amount} Players in ${bName.toUpperCase()}`;

    if (players.length == 1) return client.send('There aren\'t any players registered');

    if (amount < 3) {
        amount = 3;
        client.send('Amount can\'t be lower than 3...');
    } else if (amount > 25) {
        amount = 50;
        client.send('Amount can\'t be higher than 25...');
    }

    for (let pId_i in players) {
        let pId = players[pId_i];
        let member;
        if (pId_i.startsWith('--') || pId.startsWith('--')) continue;
        for (let m of members) {
            if (m[0] == pId) {
                member = m[1];
                break;
            }
        }
        try {
            let playerData = [ board[pId], member.displayName ];
            boardScoreArr.push( playerData );
        } catch (err) {
            console.error(`${pId}: was not found`);
        }
    }

    // let table = '***TOP ' + amount +'***\n```\n';

    if (amount >= boardScoreArr.length) amount = boardScoreArr.length;

    // console.log(Object.keys(board));

    // console.log(boardScoreArr);

    // Duplicating the array
    let sortedScores = JSON.parse(JSON.stringify(boardScoreArr));
    // Sorting duplicate
    sortedScores.sort((a, b) => { return b[0]-a[0] });

    for (let i = 0; i < amount; i++) {
        let playerScore = sortedScores[i];
        // table += `${i + 1}) ${playerScore[1]}: ${playerScore[0]}\n`;
        body +=  `**${i + 1})** ${playerScore[1]}: ${playerScore[0]}`;
        if (i + 1 != amount) body += '\n';
    }

    if (!board['--ico'] || board['--ico'] == '') {
        board['--ico'] = defaultScoreboardIco;
    }

    // table += '```';

    // client.send(table);
    client.send({ embed: {
        title: title,
        description: body,
        thumbnail: { url: board['--ico'] },
        color: 16711680
    } });
}

function getUser(message, arg) {
    let user = message.mentions.users.first();
    if (user) {
        return user;
    } else {
        arg = `${arg}`.toLowerCase();
        for (let m of message.guild.members) {
            let mem = m[1];
            user = mem.user;
            if (`${mem.displayName}`.toLowerCase().includes(arg)
                || `${user.username}`.toLowerCase().includes(arg)) {
                return user;
            }
        }
    }
    return null;
}

function getImageUrl(message, link) {
    let attached = message.attachments;
    let url;
    
    if (attached) {
        // console.log(attached.map((a) => a.url));
        let attachmentUrl = attached.map((a) => a.url)[0];
        try {
            let testUrl = attachmentUrl.toLowerCase();
            if (testUrl.endsWith('.png') || testUrl.endsWith('.jpg') || testUrl.endsWith('.gif')) {
                url = attachmentUrl;
            } else {
                url = false;
                message.channel.send('Unsopported file type');
            }
            if (testUrl.endsWith(".gif"))
                message.channel.send('Animations won\'t be present on the player profile');
            
            return url;
        } catch (err) {
            message.channel.send("Unable to get the url of the attached" +
                    " image. Try using a link for the image");
            return false;
        }
    } else if (link) {
        let imageUrl = link.trim().toLowerCase();
        if (imageUrl.startsWith("http") && (imageUrl.endsWith(".png") ||
                imageUrl.endsWith(".jpg"))) {
            url = link.trim();
        } else if (imageUrl.startsWith("http") && imageUrl.endsWith(".gif")) {
            message.channel.send('Animations will not be displayed');
            url = link.trim();
        } else {
            url = false;
        }
        return url;
    } else {
        return false;
    }
}