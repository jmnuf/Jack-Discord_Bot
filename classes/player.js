module.exports = class Player {
    constructor(id, bot, data = Player.newPlayerDataPacket()) {
        this.id = id;
        this.bot = bot;
        this.user = bot.users.find((user) => `${user.id}` === `${id}`);
        this.dm = this.user.createDM();
        this.raw = data;
        this.bullets = this.raw.bullets || "-";
        this.titles = [];
        for (var i in this.raw.titles) {
            this.titles.push(this.raw.titles[i]);
        }
        if (!this.raw.active_title || this.raw.active_title === null){
            this.activeTitle = -1;
        } else {
            this.activeTitle = Number(this.raw.active_title);
        }
        this.respect = this.raw.respect;
        this.name = this.raw.name;
        this.displayName = this.name;
        this.check_display_name();
        this.stats = [ Number(this.raw.strength), Number(this.raw.agility), Number(this.raw.intelligence) ];
        this.bio = this.raw.bio;
        this.avatarURL = this.raw.avatarURL;
        this.bannerURL = this.raw.bannerURL;
    }

    static newPlayerDataPacket() {
        return {
            bullets: '-',
            titles: [],
            activeTitle: null,
            respect: 0,
            name: 'nameless',
            strength: 3,
            agility: 3,
            intelligence: 3,
            bio: '. . .',
            avatarURL: null,
            bannerURL: null
        }
    }

    check_display_name() {
        if (this.titles[this.activeTitle]) {
            this.displayName = this.titles[this.activeTitle].name + ' ';
        } else {
            this.displayName = '';
        }
        this.displayName += this.name;
    }

    make_fields(name, value) {
        return { 'name': name, 'value': value };
    }
    
    getId() {
        return this.id;
    }
    
    getUser() {
        return this.user;
    }
    
    getBio() {
        return this.bio;
    }
    
    getName() {
        return this.name;
    }
    
    getDisplayName() {
        this.check_display_name();
        return this.displayName;
    }
    
    sendDM( obj ) {
        return this.user.send(obj);
    }
    
    getStr() {
        return this.stats[0];
    }
    addStr(val) {
        this.stats[0] += Number(val);
    }
    setStr(val) {
        this.stats[0] = Number(val);
    }
    
    getAgi() {
        return this.stats[1];
    }
    addAgi(val) {
        this.stats[1] += Number(val);
    }
    setAgi(val) {
        this.stats[1] = Number(val);
    }
    
    getInt() {
        return this.stats[2];
    }
    addInt(val) {
        this.stats[2] += Number(val);
    }
    setInt(val) {
        this.stats[2] = Number(val);
    }
    
    getRespect() {
        return this.raw.respect;
    }
    
    setAvatarUrl(new_url) {
        this.avatarURL = new_url;
    }
    
    getAvatarUrl() {
        return `${this.avatarURL || this.user.avatarURL}`;
    }
    
    setBannerUrl(new_url) {
        this.bannerURL = new_url;
    }
    
    getBannerUrl() {
        return this.bannerURL;
    }
    
    getActiveTitleString() {
        var str = "";
        let active = this.titles[this.activeTitle];
        for(var i in active) {
            if (typeof active[i] === 'object') {
                for (var j in active[i]) {
                    str += ` ${this.bullets} ${i}: ${j}::${active[i][j]}`;
                }
            } else {
                str += ` ${this.bullets} ${i}: ${active[i]}\n`;
            }
        }
        return str;
    }
    
    setActiveTitlePos(pos) {
        this.activeTitle = pos;
    }
    
    getActiveTitlePos() {
        return this.activeTitle;
    }
    
    getActiveTitleName() {
        try {
            return this.titles[this.activeTitle].name || '';
        } catch (err) {
            return '';
        }
    }
    
    getActiveTitleSize() {
        var count = 0;
        let active = this.titles[this.activeTitle];
        for(var i in active) {
            if (typeof active[i] === 'object') {
                for (var j in active[i]) {
                    count += 1;
                }
            } else {
                count += 1;
            }
        }
        return count;
    }
    
    getTitlesNumbered() {
        var str = "";
    
        for (var i in this.titles) {
            str += `${(Number(i)+1)}${this.bullets}${this.titles[i].name}\n`;
        }

        return str;
    }
    
    getTitlesStringList(prepend = '') {
        var str = "";
    
        for (var i  in this.titles) {
            str += prepend + ' ' + this.bullets + ' ' + this.titles[i].name + "\n";
        }

        return str;
    }
    
    getTitle(pos) {
        return this.titles[pos];
    }
    
    getTitlesStringArr(prepend = '') {
        let str = [];
    
        for (var i  in this.titles) {
            str.push( prepend + ' ' + this.bullets + ' ' + this.titles[i].name );
        }

        return str;
    }
    
    getTitlesSize() {
        return this.titles.length;
    }
    
    getPublicProfileEmbed() {
        this.check_display_name();
        var data = "```\n";
        data += ` ${this.bullets} Respect around town: ${this.respect}\n`;
        data += ` ${this.bullets} Current title: ${this.titles[this.activeTitle].name}\n`;
        data += ` ${this.bullets} Titles in posetion: ${this.titles.length}\n`;
        data += ` ${this.bullets} Agility: Class ${this.getSkillGrade( this.getAgi() )}\n`;
        data += ` ${this.bullets} Strength: Class ${this.getSkillGrade( this.getStr() )}\n`;
        data += ` ${this.bullets} Intelligence: Class ${this.getSkillGrade( this.getInt() )}\n`;
        data += "```";
        return {
            embed:{
                title:`${this.displayName}`,
                description: `${this.name}'s Player Sheet:\n${data}`,
                thumbnail: { url: "https://media.discordapp.net/attachments/426118273973616642/638008428442419240/JackBSThumbnail.png" },
                image: { url: `${this.avatarURL || this.user.avatarURL || ''}` },
                author: { name: `${this.user.username}`, url: "", icon_url: `${this.user.avatarURL}` },
                color: 16711680
            }
        };
    }
    
    getFullProfileEmbed() {
        this.check_display_name();
        var data = "```\n";
        data += `${this.bullets}Respect around town: ${this.respect}\n`;
        data += `${this.bullets}Current title: ${this.titles[this.activeTitle].name}\n`;
        data += `${this.bullets}Titles in posetion:\n${this.getTitlesStringList(this.bullets)}\n`;
        data += `${this.bullets}Agility: ${this.getAgi()} Class ${this.getSkillGrade( this.getAgi() )}\n`;
        data += `${this.bullets}Strength: ${this.getStr()} Class ${this.getSkillGrade( this.getStr() )}\n`;
        data += `${this.bullets}Intelligence: ${this.getInt()} Class ${this.getSkillGrade( this.getInt() )}\n`;
        data += "```";
        return {
            embed:{
                title:`${this.displayName}`,
                description: `${this.name}'s Player Sheet:\n${data}`,
                thumbnail: { url: "https://static.zerochan.net/Chara.(Undertale).full.1982046.jpg" },
                image: { url: `${this.avatarURL || this.user.avatarURL || ''}` },
                author: { name: `${this.user.username}`, url: "", icon_url: `${this.user.avatarURL}` },
                color: 16711680
            }
        };
    }
    
    getSkillGrade (skill_stat) {
        return Player.checkSkillGrade(skill_stat)
    }

    static checkSkillGrade(stat) {
        if ( skill_stat <= 10 ) {
            return "F";
        } else if ( skill_stat <= 25 ) {
            return "E";
        } else if ( skill_stat <= 45 ) {
            return "D";
        } else if ( skill_stat <= 70 ) {
            return "C";
        } else if ( skill_stat <= 90 ) {
            return "B";
        } else if ( skill_stat <= 120 ) {
            return "A";
        } else if ( skill_stat <= 190 ) {
            return "S";
        } else if ( skill_stat <= 299 ) {
            return "SS";
        } else return "SSS";
    }
    
    getAgiGrade() {
        return this.getSkillGrade(this.getAgi());
    }
    getStrGrade() {
        return this.getSkillGrade(this.getStr());
    }
    getIntGrade() {
        return this.getSkillGrade(this.getInt());
    }
    
    finalize() {
        this.raw.strength = this.getStr();
        this.raw.agility = this.getAgi();
        this.raw.intelligence = this.getInt();
        this.raw.respect = this.getRespect();
        this.raw.titles = this.titles;
        this.raw.bullets = this.bullets;
        this.raw.active_title = `${this.activeTitle}`;
    }
};
