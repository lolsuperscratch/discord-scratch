(function(ext) {
    // Add the Discord.JS API
    ScratchExtensions.loadExternalJS('https://raw.githubusercontent.com/discordjs/discord.js/webpack/discord.11.3.1.min.js');
    const bot = new Discord.Client()
    var messagecontent = "";
    var messagechannel = "";
    var botready = false;
    var disconnected = false;
    var botlisten = false;
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {bot.destroy()};
    bot.on('ready',function() {botready = true;})
    bot.on('disconnect',function() {disconnected = true;})
    bot.on('resume',function() {disconnected = false;})
    bot.on("message",function (message) {botlisten = true;messagecontent = message.content;messagechannel = message.channel.id;})
    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        if (!botready) return {status: 1, msg: 'bot not ready'};
        if (disconnected) return {status: 0, msg: 'DISCONNECTED'};
        return {status: 2, msg: 'Ready'};
    };
    ext.send_message = function (user,reply) {
        bot.on('message',function (message) {
        if (message.content == user) {message.channel.send(reply)}
        messagecontent = message.content
        messagechannel = message.channel.id
        });
    }
    ext.get_ping = function () {
       return bot.ping;
    }
    ext.get_discord_message = function () {
       return messagecontent;
    }
    ext.get_discord_channel = function () {
       return messagechannel;
    }
    ext.when_discord = function () {
       
       if (botlisten) {botlisten = false;return true;}
       return false;
    }
    ext.connect_d = function (a) {
       bot.login(a);
    }
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
        [' ', 'auto-reply if message is %s then %s', 'send_message', 'hi bot!','hi i am the bot nice to meet'],
        ['h', 'on message', 'when_discord'],
        ['r', 'discord message', 'get_discord_message'],
        ['r', 'discord channel id', 'get_discord_channel'],
        ['r', 'ping', 'get_ping'],
        [' ', 'login bot %s', 'connect_d', ''],
        ]
    };
    // Register the extension
    ScratchExtensions.register('Discord', descriptor, ext);
})({});
