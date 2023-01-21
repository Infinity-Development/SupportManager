const config = require("../config/index")
const ms = require('parse-ms');
const { MessageEmbed } = require("discord.js");
const ratetime = new Set()

module.exports = async (client, message) => {
    
   if(message.author.bot) return;
    
    const prefix = "sb!";
    const args = message.content.split(/ +/g);
    const commands = args.shift().slice(prefix.length).toLowerCase();
    const cmd = client.commands.get(commands) || client.aliases.get(commands);
   
    if(!message.content.toLowerCase().startsWith(prefix)) return;
    if(!cmd) return;


if(message.channel.type == "dm" && cmd.requirements.dm_only == false){
    return message.channel.send("You can use this command at servers only!")
}

if(message.channel.type !== "dm" && cmd.requirements.dm_only == true){
    return message.channel.send("You can use this command at dm only!")
}

if(message.channel.type !== "dm"){

if(!message.channel.permissionsFor(message.guild.me).toArray().includes("SEND_MESSAGES")) return;


    if(cmd.requirements.staffOnly && !client.config.staff_team.includes(message.author.id))
    return message.reply("Only my Staff/Dev team can use this command :x:")

    let embed = new MessageEmbed()
    .setAuthor("Lacking Permissions", message.author.displayAvatarURL())
    .addField(`You are missing those permissions`, missingPerms(message.member, cmd.requirements.userPerms))
    .setFooter(client.user.tag)
    if(cmd.requirements.userPerms && !message.member.permissions.has(cmd.requirements.userPerms)) return message.channel.send(embed)
    
    let embed1 = new MessageEmbed()
    .setAuthor("Lacking Permissions", client.user.displayAvatarURL())
    .addField(`I am missing those permissions`, missingPerms(message.guild.me, cmd.requirements.clientPerms))
    .setFooter(client.user.tag)
    if(cmd.requirements.clientPerms && !message.guild.me.permissions.has(cmd.requirements.clientPerms)) return message.channel.send(embed1)
}  
    
    if(cmd.limits) {
        const current = client.limits.get(`${commands}-${message.author.id}`);     
        if(!current) client.limits.set(`${commands}-${message.author.id}`, 1);    
        else{
            if(current >= cmd.limits.rateLimit) {
                let timeout = ms(cmd.limits.cooldown - (Date.now() - ratetime[message.author.id + commands].times));
                return message.reply("Ratelimit , You need to wait " + "``" + `${timeout.hours}h ${timeout.minutes}m ${timeout.seconds}s`+ "``")
            }
            client.limits.set(`${commands}-${message.author.id}`, current + 1);
            ratetime.add(message.author.id + commands)
            ratetime[message.author.id + commands] = {
                times: Date.now()
            }
        }
        setTimeout(() => {
            client.limits.delete(`${commands}-${message.author.id}`);
            ratetime.delete(message.author.id + commands)
        }, cmd.limits.cooldown);
    }
cmd.run(client, message, args)
}
const missingPerms = (member, perms) => {
    const missingPerms = member.permissions.missing(perms)
    .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);

    return missingPerms.length > 1 ? 
    `${missingPerms.slice(0, -1).join(", ")}, ${missingPerms.slice(-1)[0]}` :
    missingPerms[0];
}
