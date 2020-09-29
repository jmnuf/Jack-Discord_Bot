const fs = require('fs');
module.exports = (bot) => {
    bot.log = function (obj) { console.log(obj); };
    bot.err = function (obj) { console.error(obj); };
    
    // bot.players = bot.playerData.users;

    bot.random = function (max, min = 0) {
        return Math.floor( Math.random()*(max-min) + min );
    };

    bot.getEmoji = function (name) {
        return bot.emojis.cache.find(emoji => emoji.name.toLowerCase().includes(name.toLowerCase()));
    };

    bot.getAllEmojis = function () {
        var emojis = {};
        bot.emojis.cache.tap((value, key) => {
            emojis[key] = value;
        });
        return emojis;
    };
    
    bot.getEmojisArray = function () {
        var emojis = bot.emojis.cache.map((e) => e);
        return emojis;
    };

    bot.saveScoreboards = function() {
        let data = JSON.stringify(bot.scoreboards);
        fs.writeFile('./archives/scoreboards.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log('Saved scoreboards!');
        });
    }

    // bot.checkUserExistence = async function (id, addExistence = false) {
    //     if (!bot.playerData.users[id]) {
    //         if (addExistence) {
    //             const def = bot.playerData.default;
    //             bot.playerData.users[id] = JSON.parse(JSON.stringify(def));
    //             bot.playerData.users[id].id = `${id}`;
    //             let guild;
    //             bot.guilds.tap((g)=>{
    //                 if ( g.members[id] && g.members[bot.BotID]
    //                     && g.roles.find((r)=>r.name.toLowerCase() === 'player') ) {
    //                     guild = g;
    //                 }
    //             });
    //             if (guild) {
    //                 let user = guild.members[id];
    //                 user.addRole( guild.roles.find((r)=>r.name.toLowerCase() === 'player'),
    //                 "Player in the battle system");
    //             }
    //         }
    //         return false;
    //     } else {
    //         return true;
    //     }
    // };

    // bot.saveUserData = function () {
    //     fs.writeFile('./archives/playerData.json', JSON.stringify(bot.playerData), (err)=>{
    //         if (err) throw err;
    //         console.log("Player data succesfully saved");
    //     });
    // };

    // bot.eraseUserExistence = function (id) {
    //     if ( bot.checkUserExistence(id) ) {
    //         let guild = bot.guilds.find((g)=>g.members[id] && g.members[bot.BotID]
    //                 && g.roles.find((r)=>r.name.toLowerCase() === 'player'));
    //         let user = guild.members[id];
    //         user.removeRole( guild.roles.find((r)=>r.name.toLowerCase() === 'player'),
    //             "Player left the battle system");
    //         delete bot.playerData.users[id];
    //         return true;
    //     } else {
    //         return false;
    //     }
    // };

    // bot.getPlayer = function (id) {
    //     if (bot.checkUserExistence(id, false)) return bot.playerData.users[id];
    //     else return null;
    // };
    
    // bot.NPC = function (name) {
    //     const npcs = bot.playerData["npcs"];
    //     for (var i in npcs) {
    //         if (`${i}` === `${name}`) {
    //             return npcs[i];
    //         }
    //         if (`${npcs[i].name}` === `${name}`) {
    //             return npcs[i];
    //         }
    //     }
    //     return null;
    // };

    // bot.getPlayerTitles = function (id) {
    //     var player = bot.getPlayer(id);
    //     if (!player) return bot.errorEmbed;

    //     var bullets = " - ";
    //     var str = "";

    //     for (var i  in player.titles) {
    //         str += bullets + player.titles[i].name + "\n";
    //     }

    //     return str;
    // };

    // bot.getNPCTitles = function (name) {
    //     let npc = bot.getNPC(name);
    //     if (!npc) return bot.errorEmbed;

    //     var bullets = " - ";
    //     var str = "";

    //     for (var i  in npc.titles) {
    //         str += bullets + npc.titles[i].name + "\n";
    //     }

    //     return str;
    // };

    // bot.getBTitles = function () {
    //     let npc = bot.getPBot();

    //     var bullets = " - ";
    //     var str = "";

    //     for (var i  in npc.titles) {
    //         str += bullets + npc.titles[i].name + "\n";
    //     }

    //     return str;
    // };

    // bot.getActiveTitleString = function (player) {
    //     var bullets = ' - ';
    //     var str = '';
    //     let active = player.titles[player.active_title];

    //     for (var i in active) {
    //         str += `${bullets}${i}: ${active[i]}\n`;
    //     }

    //     return str;
    // };

    // bot.getPlayerSheet = function (user, id, is_public) {
    //     const player = bot.getPlayer(id);
    //     if ( !bot.checkUserExistence(id, false) ) return bot.errorEmbed;
    //     bot.checkPlayerDisplayName(player);
    //     var data = "";
    //     data += "```\nCurrent title: " + player.titles[player.active_title].name + "\n";
    //     if ( is_public ) {
    //         data += "Agility: Class "+ bot.getSkillGrade(player.stats["AGI"]) + "\n";
    //         data += "Strength: Class "+ bot.getSkillGrade(player.stats["STR"]) + "\n";
    //         data += "Inteligence: Class "+ bot.getSkillGrade(player.stats["INT"]) + "\n";
    //     } else {
    //         data += "Titles: \n" + bot.getPlayerTitles(id) + "\n";
    //         data += "Agility: " + player.stats["AGI"] + "\n";
    //         data += "Strength: " + player.stats["STR"] + "\n";
    //         data += "Inteligence: " + player.stats["INT"] + "\n";
    //     }
    //     data += "```";
    //     return {
    //         embed: {
    //             url: "",
    //             title: `${player.display_name}`,
    //             description: `${user.username}'s Player Sheet:\n${data}`,
    //             thumbnail: { url: "https://static.zerochan.net/Chara.(Undertale).full.1982046.jpg" },
    //             image: { url: `${user.avatarURL}` },
    //             author: { name: "", url: "", icon_url: "" },
    //             color: 16711680
    //         }
    //     };
    // };

    // bot.getPlayerProfile = function (id, playerURL = '') {
    //     const player = bot.getPlayer(id);
    //     if ( !bot.checkUserExistence(id, false) ) return bot.errorEmbed;
    //     bot.checkPlayerDisplayName(player);
    //     var data = "";
    //     data += "```\nCurrent title: " + player.titles[player.active_title].name + "\n";
    //     data += "Agility: Class "+ bot.getSkillGrade(player.stats["AGI"]) + "\n";
    //     data += "Strength: Class "+ bot.getSkillGrade(player.stats["STR"]) + "\n";
    //     data += "Inteligence: Class "+ bot.getSkillGrade(player.stats["INT"]) + "\n";
    //     data += "```";
    //     return {
    //         embed: {
    //             url: "",
    //             title: `${player.display_name}`,
    //             description: `${player.name}'s Player Sheet:\n${data}`,
    //             thumbnail: { url: "https://media.discordapp.net/attachments/426118273973616642/638008428442419240/JackBSThumbnail.png" },
    //             image: { url: `${player.avatarURL || playerURL || ''}` },
    //             author: { name: "", url: "", icon_url: `` },
    //             color: 16711680
    //         }
    //     };
    // };

    // bot.getNPCProfile = function (npc) {
    //     let player = npc;
    //     if (!player) return null;
    //     bot.checkPlayerDisplayName(player);
    //     var data = "";
    //     data += "```\nCurrent title: " + player.titles[player.active_title].name + "\n";
    //     data += "Agility: Class "+ bot.getSkillGrade(player.stats["AGI"]) + "\n";
    //     data += "Strength: Class "+ bot.getSkillGrade(player.stats["STR"]) + "\n";
    //     data += "Inteligence: Class "+ bot.getSkillGrade(player.stats["INT"]) + "\n";
    //     data += "```";
    //     return {
    //         embed: {
    //             url: "",
    //             title: `${player.display_name}`,
    //             description: `${player.name}'s Player Sheet:\n${data}`,
    //             thumbnail: { url: "https://static.zerochan.net/Chara.(Undertale).full.1982046.jpg" },
    //             image: { url: `${player.avatarURL || ""}` },
    //             author: { name: "", url: "", icon_url: "" },
    //             color: 16711680
    //         }
    //     };
    // };

    // bot.getBotProfile = function () {
    //     let player = bot.getPBot();
    //     bot.checkPlayerDisplayName(player);
    //     var data = "";
    //     data += "```\nCurrent title: " + player.titles[player.active_title].name + "\n";
    //     data += "Agility: Class "+ bot.getSkillGrade(player.stats["AGI"]) + "\n";
    //     data += "Strength: Class "+ bot.getSkillGrade(player.stats["STR"]) + "\n";
    //     data += "Inteligence: Class "+ bot.getSkillGrade(player.stats["INT"]) + "\n";
    //     data += "```";
    //     return {
    //         embed: {
    //             url: "",
    //             title: `${player.display_name}`,
    //             description: `${player.name}'s Player Sheet:\n${data}`,
    //             thumbnail: { url: "https://static.zerochan.net/Chara.(Undertale).full.1982046.jpg" },
    //             image: { url: `${bot.user.avatarURL || ""}` },
    //             author: { name: "", url: "", icon_url: "" },
    //             color: 16711680
    //         }
    //     };
    // };

    // bot.checkPlayerDisplayName = function (player) {
    //     if ( player.titles[player.active_title].name === null ) {
    //         player.display_name = player.name;
    //     } else {
    //         player.display_name = player.titles[player.active_title].name+ " " + player.name;
    //     }
    // };

    // bot.getSkillGrade = function (skill_stat) {
    //     if ( skill_stat <= 10 ) {
    //         return "F";
    //     } else if ( skill_stat <= 25 ) {
    //         return "E";
    //     } else if ( skill_stat <= 45 ) {
    //         return "D";
    //     } else if ( skill_stat <= 70 ) {
    //         return "C";
    //     } else if ( skill_stat <= 90 ) {
    //         return "B";
    //     } else if ( skill_stat <= 120 ) {
    //         return "A";
    //     } else if ( skill_stat <= 190 ) {
    //         return "S";
    //     } else if ( skill_stat <= 299 ) {
    //         return "SS";
    //     } else return "SSS";
    // };

    // bot.getPlayerAvg = function (player) {
    //     return bot.getSkillGrade( (player.stats["AGI"]+player.stats["STR"]+player.stats["INT"])/3 );
    // };

    // bot.getPBot = function () {
    //     return bot.playerData["Jack"];
    // };

    // bot.getNPC = function (name) {
    //     const string = '';
    //     let npcs = bot.playerData.npcs;
    //     for (var i in npcs) {
    //         if (i === name) {
    //             return npcs[i];
    //         }
    //         if (`${typeof name}` === `${typeof string}`) {
    //             if (npcs[i].name.toLowerCase() === name.toLowerCase()) {
    //                 return npcs[i];
    //             }
    //         }
    //     }
    //     return null;
    // };

    bot.getBotAvg = function () {
        var jk = bot.getPBot();
        if ( !jk )
            return console.log("'bot.getPBot()' is not working");
        else {
            console.log(jk.stats);
            return bot.getSkillGrade( (jk.stats["AGI"]+jk.stats["STR"]+jk.stats["INT"])/3 );
        }
    };

    bot.compareGrades = function(player1_avg, player2_avg) {
        var result = ["equal", "lesser", "greater"]; 
        var result_index = 1;
        if ( player1_avg === player2_avg )
            return "equal";
        switch (player1_avg) {
            case 'F':
                switch (player2_avg) {
                    case 'F':
                        result_index = 0;
                        break;
                    case 'E':
                        result_index = 1;
                        break;
                    case 'D':
                        result_index = 1;
                        break;
                    case 'C':
                        result_index = 1;
                        break;
                    case 'B':
                        result_index = 1;
                        break;
                    case 'A':
                        result_index = 1;
                        break;
                    case 'S':
                        result_index = 1;
                        break;
                    case 'SS':
                        result_index = 1;
                        break;
                    case 'SSS':
                        result_index = 1;
                        break;
                }
                break;
            case 'E':
                switch (player2_avg) {
                    case 'F':
                        result_index = 2;
                        break;
                    case 'E':
                        result_index = 0;
                        break;
                    case 'D':
                        result_index = 1;
                        break;
                    case 'C':
                        result_index = 1;
                        break;
                    case 'B':
                        result_index = 1;
                        break;
                    case 'A':
                        result_index = 1;
                        break;
                    case 'S':
                        result_index = 1;
                        break;
                    case 'SS':
                        result_index = 1;
                        break;
                    case 'SSS':
                        result_index = 1;
                        break;
                }
                break;
            case 'D':
                switch (player2_avg) {
                    case 'F':
                        result_index = 2;
                        break;
                    case 'E':
                        result_index = 2;
                        break;
                    case 'D':
                        result_index = 0;
                        break;
                    case 'C':
                        result_index = 1;
                        break;
                    case 'B':
                        result_index = 1;
                        break;
                    case 'A':
                        result_index = 1;
                        break;
                    case 'S':
                        result_index = 1;
                        break;
                    case 'SS':
                        result_index = 1;
                        break;
                    case 'SSS':
                        result_index = 1;
                        break;
                }
                break;
            case 'C':
                switch (player2_avg) {
                    case 'F':
                        result_index = 2;
                        break;
                    case 'E':
                        result_index = 2;
                        break;
                    case 'D':
                        result_index = 2;
                        break;
                    case 'C':
                        result_index = 0;
                        break;
                    case 'B':
                        result_index = 1;
                        break;
                    case 'A':
                        result_index = 1;
                        break;
                    case 'S':
                        result_index = 1;
                        break;
                    case 'SS':
                        result_index = 1;
                        break;
                    case 'SSS':
                        result_index = 1;
                        break;
                }
                break;
            case 'B':
                switch (player2_avg) {
                    case 'F':
                        result_index = 2;
                        break;
                    case 'E':
                        result_index = 2;
                        break;
                    case 'D':
                        result_index = 2;
                        break;
                    case 'C':
                        result_index = 2;
                        break;
                    case 'B':
                        result_index = 0;
                        break;
                    case 'A':
                        result_index = 1;
                        break;
                    case 'S':
                        result_index = 1;
                        break;
                    case 'SS':
                        result_index = 1;
                        break;
                    case 'SSS':
                        result_index = 1;
                        break;
                }
                break;
            case 'A':
                switch (player2_avg) {
                    case 'F':
                        result_index = 2;
                        break;
                    case 'E':
                        result_index = 2;
                        break;
                    case 'D':
                        result_index = 2;
                        break;
                    case 'C':
                        result_index = 2;
                        break;
                    case 'B':
                        result_index = 0;
                        break;
                    case 'A':
                        result_index = 1;
                        break;
                    case 'S':
                        result_index = 1;
                        break;
                    case 'SS':
                        result_index = 1;
                        break;
                    case 'SSS':
                        result_index = 1;
                        break;
                }
                break;
            case 'S':
                switch (player2_avg) {
                    case 'F':
                        result_index = 2;
                        break;
                    case 'E':
                        result_index = 2;
                        break;
                    case 'D':
                        result_index = 2;
                        break;
                    case 'C':
                        result_index = 2;
                        break;
                    case 'B':
                        result_index = 2;
                        break;
                    case 'A':
                        result_index = 2;
                        break;
                    case 'S':
                        result_index = 0;
                        break;
                    case 'SS':
                        result_index = 1;
                        break;
                    case 'SSS':
                        result_index = 1;
                        break;
                }
                break;
            case 'SS':
                switch (player2_avg) {
                    case 'F':
                        result_index = 2;
                        break;
                    case 'E':
                        result_index = 2;
                        break;
                    case 'D':
                        result_index = 2;
                        break;
                    case 'C':
                        result_index = 2;
                        break;
                    case 'B':
                        result_index = 2;
                        break;
                    case 'A':
                        result_index = 2;
                        break;
                    case 'S':
                        result_index = 2;
                        break;
                    case 'SS':
                        result_index = 0;
                        break;
                    case 'SSS':
                        result_index = 1;
                    break;
                }
                break;
            case 'SSS':
                switch (player2_avg) {
                    case 'F':
                        result_index = 2;
                        break;
                    case 'E':
                        result_index = 2;
                        break;
                    case 'D':
                        result_index = 2;
                        break;
                    case 'C':
                        result_index = 2;
                        break;
                    case 'B':
                        result_index = 2;
                        break;
                    case 'A':
                        result_index = 2;
                        break;
                    case 'S':
                        result_index = 2;
                        break;
                    case 'SS':
                        result_index = 2;
                        break;
                    case 'SSS':
                        result_index = 0;
                break;
            } 
                break;
        }

        return result[result_index];
    };

    bot.errorEmbed = {
        embed: {
            url: "",
            title: `Error`,
            description: `Unable to retrieve the information to run the desired result`,
            thumbnail: { url: "https://static.zerochan.net/Chara.(Undertale).full.1982046.jpg" },
            image: { url: `` },
            author: { name: "", url: "", icon_url: "" },
            color: 16711680
        }
    };
};
