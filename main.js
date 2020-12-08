const config = require("./config.json")
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require('fs');
client.commands = new Discord.Collection();

const prefix = config.prefix
const version = '1.0.0'

// Read Commands Callback
fs.readdir("./commands/", (err, files) => {
    // Let Variables
    let jsfile = files.filter(f => f.split(".").pop() === "js")

    // If Commands
    if (err) console.log(err);
    if (jsfile.length <= 0) {
        console.log("Can't find commands.");
        return;
    } jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`Loaded ${f}`);
        client.commands.set(props.help.name, props);
    });
});

// Discord/Client Callbacks
client.on("ready", () => {
    console.log(`\x1b[44mDiscord Bot:\x1b[0m Client is on ${client.user.username}`);
    client.user.setActivity(`This Bot ${client.user.username} Is Online`, { type: 'WATCHING' });
});

client.on("message", async (message, member) => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;


    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(client, message, args);
})

client.login(config.token);