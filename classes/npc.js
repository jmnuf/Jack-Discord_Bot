module.exports = class NPC {
    constructor(client, bot, name) {
        this.id = '613710711104995336';
        this.client = client;
        this.raw = bot.battlers.npcs[name];
        if (!this.raw) throw new Error('Non-existent NPC!');
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
        this.displayName = this.raw.display_name;
        this.stats = [ Number(this.raw.stats["STR"]), Number(this.raw.stats["AGI"]), Number(this.raw.stats["INT"]) ];
        this.bio = this.raw.bio;
        this.avatarURL = this.raw.avatarURL;
        this.bannerURL = this.raw.bannerURL;
        this.check_display_name = function () {
            if (this.titles[this.activeTitle]) {
                this.displayName = this.titles[this.activeTitle].name + ' ';
            } else {
                this.displayName = '';
            }
            this.displayName += this.name;
        };
        this.make_fields = function(name, value) {
            return { name:name, value: value };
        };
    }
    
    getId() {
        return this.id;
    }
    
    sendDM( obj ) {
        this.dmClient.send( obj );
    }
    
    send( obj ) {
        this.client.send( obj );
    }
    
    getDmClient() {
        return this.dmClient;
    }
    
    getClient() {
        return this.client;
    }
    
    setClient(client) {
        this.client = client;
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
        return this.raw["respect"];
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
                    str += `${this.bullets}${i}: ${j}::${active[i][j]}`;
                }
            } else {
                str += `${this.bullets}${i}: ${active[i]}\n`;
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
            str += prepend + this.bullets + this.titles[i].name + "\n";
        }

        return str;
    }
    
    getTitle(pos) {
        return this.titles[pos];
    }
    
    getTitlesStringArr(prepend = '') {
        let str = [];
    
        for (var i  in this.titles) {
            str.push( prepend + this.bullets + this.titles[i].name );
        }

        return str;
    }
    
    getTitlesSize() {
        return this.titles.length;
    }
    
    getSkillGrade (skill_stat) {
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
        this.raw.stats["STR"] = this.getStr();
        this.raw.stats["AGI"] = this.getAgi();
        this.raw.stats["INT"] = this.getInt();
        this.raw["respect"] = this.getRespect();
        this.raw.titles = this.titles;
        this.raw.active_title = `${this.activeTitle}`;
    }
};