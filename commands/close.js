
const { MessageEmbed } = require("discord.js");
const tickets = require("../database/tickets");
const transcripts = require('../database/transcripts');
const { ticketInfo } = require("../config/index");
let reason = "No reason provided.";
let failed = "Successful sent close information to user."

module.exports.run = async (client, message, args) => {
  tickets.findOne({ channelID: message.channel.id }, async (err, db) => {
    if (!db)
      return message.channel.send( "This channel is not a support ticket. If you feel this is a mistake, please contact Toxic Dev.")
      ;
    if (db.open === false) return message.channel.send( "Oops! This ticket is already scheduled to be closed.");

    console.log(message.guild.members.cache.get(db.userID))

    if (args[0]) reason = args.join(" ");
    message.channel.send( `Thank you for contacting the Infinity Bot List Support Team. Ticket is being closed because: **${reason}** `);

    message.channel.messages.fetch().then(async (messages) => {

      const output = messages
        .array()
        .reverse()
        .map(
          (m) => {
            return {
              author: m.author.id,
              username: m.author.username,
              attachments: [m.attachments.map((attachment) => attachment.proxyURL)],
              time: new Date(m.createdAt).toLocaleString("en-US"),
              content: m.content,
              avatar: m.author.displayAvatarURL({format: "png"}),
              embeds: m.embeds
            };

          }
        );

      
      await new transcripts({
        closedBy: {
          username: message.author.username,
          id: message.author.id
        },
        openedBy: {
          username: message.guild.members.cache.get(db.userID).user.username,
          id: db.userID
        },
        data: output,
        ticketID: db.ticketID
      }).save();

      db.open = false;
      db.closeUserID = message.author.id;
      db.logURL = `https://tickets.botlist.site/t/${db.ticketID}`;
      db.save().catch((e) => console.log(e));
      try {
        let user = client.users.cache.get(db.userID);
        let userClose = new MessageEmbed()
        .setColor("RED")
        .setTitle("Ticket Close Notification")
        .setDescription(
          `**${message.author.username}** recently closed your ticket because: **${reason}**\nIf you need a log of your recent ticket you can find one [here](https://tickets.botlist.site/t/${db.ticketID}) you may share this link at **YOUR OWN RISK**`
        )
        .addField("Ticket Information", `**Ticket ID:** \`${db.ticketID}\``);
      client.users.cache
        .get(db.userID)
        .send(userClose)
        .catch(() => {
          failed = "Failed to send message to user."
        });
        let logEmbed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`Closed Ticket #${db.ticketID}`)
          .setDescription(
            `**Ticket Closed by:** ${message.author.toString()}\n**Ticket Opened by** ${user.toString()}\n**Ticket Link:** [Ticket #${
              db.ticketID
            }](${db.logURL})`
          ).setFooter(failed);
        client.channels.cache.get(ticketInfo.logTickets).send(logEmbed);
        setTimeout(() => {
          message.channel.delete();
        }, 30000);
      } catch (e) {
        return message.channel.send("An error occurred, please try again!");
      }
    });
  });
};

module.exports.help = {
  name: "close",
  category: "management",
  aliases: [],
  description: "Close a Ticket",
  example: "close <reason>",
};

module.exports.requirements = {
  userPerms: [],
  clientPerms: ["EMBED_LINKS"],
  staffOnly: false,
};

module.exports.limits = {
  rateLimit: 2,
  cooldown: 1e4,
};
