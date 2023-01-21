const { MessageEmbed } = require ('discord.js');

module.exports.run = async (client, message, args) => {

    let prefix = client.config.prefix;

    if(args[0] && client.commands.has(args[0])){
        const cmd = client.commands.get(args[0]);
        let cmdname = cmd.help.name.charAt(0).toUpperCase() + cmd.help.name.slice(1)
        let aliases = "No aliases for that command"
        if(cmd.help.aliases.length === 0){
            aliases = "No aliases for that command"
        }else{
            aliases = cmd.help.aliases.join("\n")
        }
        const embed = new MessageEmbed()
        .setAuthor(`${cmdname} Command`)
        .setColor("GREEN")
        .setDescription(`**Prefix:** ${prefix}\n**Name:** ${cmd.help.name}\n**Example:** ${cmd.help.example}\n**Category:** ${cmd.help.category}`)
        .addField("Description", `\`${cmd.help.description}\``)
        .addField("Aliases", `**${aliases}**`)
        .setFooter(`Syntax: <> = required, [] = optional`)
        return message.channel.send(embed)
    }

    let management = client.commands.filter(cmd => cmd.help.category.toLowerCase() == "management")
    let info = client.commands.filter(cmd => cmd.help.category.toLowerCase() == "info")

  const embed = new MessageEmbed()
  .setAuthor(`Commands List`, client.user.displayAvatarURL())
  .setThumbnail(message.guild.iconURL({dynamic: true}))
  .setColor("BLUE")
  .addField(`Information`, info.map(cmd => `\`${cmd.help.name}\``).join("**, **"))
  .addField(`Management`, management.map(cmd => `\`${cmd.help.name}\``).join("**, **"))
  .setFooter(`for more information do ${client.config.prefix}help <command_name>`)

  return message.channel.send(embed);
}

module.exports.help = {
    name: "help",
    category: "info",
    aliases: ['commands', 'cmds'],
    description: "Sends you a list of all commands!",
    example: "``help <command_name>``"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ["EMBED_LINKS"],
    ownerOnly: false,
    dm_only: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}
