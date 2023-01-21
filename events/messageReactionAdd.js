const { MessageEmbed } = require("discord.js");
const { ticketInfo } = require("../config/index");
const tickets = require("../database/tickets");

module.exports = async (client, reaction, user) => {
  const rm = reaction.message;
  const rolemessage = "793132803096838184";
  // If it is rocket emoji
  if (user.id === client.user.id) return;
  if (rm.id === rolemessage && reaction.emoji.name === "🚀") {
    var rocketrole = rm.guild.roles.cache.find(
      (rocket) => rocket.id === "792914421311602739"
    );
    rm.guild.members.cache.get(user.id).roles.add(rocketrole);
  }
  // If it is poll emoji
  if (rm.id === rolemessage && reaction.emoji.name === "📊") {
    var pollrole = rm.guild.roles.cache.find(
      (poll) => poll.id === "792914697241362453"
    );
    rm.guild.members.cache.get(user.id).roles.add(pollrole);
  }
  // If it is announcement emoji
  if (rm.id === rolemessage && reaction.emoji.name === "🚨") {
    var announcerole = rm.guild.roles.cache.find(
      (announce) => announce.id === "792914884890722316"
    );
    rm.guild.members.cache.get(user.id).roles.add(announcerole);
  }
  // If it the ticket emoji
  if (rm.id === ticketInfo.messageID && reaction.emoji.name === "🎟") {
    rm.reactions.cache.find((r) => r.emoji.name == "🎟").users.remove(user.id);
    tickets.findOne({ open: true, userID: user.id }, (err, res) => {
      if (!res) {
        tickets.countDocuments().then(async (numDocs) => {
          let channel = await rm.guild.channels.create(
            `ticket-${numDocs + 1}`,
            {
              parent: ticketInfo.category,
              permissionOverwrites: [
                {
                  id: user.id,
                  allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                },
                {
                  id: rm.guild.id,
                  deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                },
                {
                  id: ticketInfo.staffRole,
                  allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
                },
              ],
            }
          );
          let embed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription("Hey there, thanks for contacting the Infinity Bot List Support Team. We are happy to help you and have notified our support staff.\n\n**While you wait, please write down your inquiry and check out our Help Center: https://support.infinitybots.gg/.**")
            .addField('Close the Ticket', '`sb!close <reason>`')
          channel.send({
            content: `${user.toString()} <@&805761849601294336>`,
            embed: embed,
          });
          const newTicket = new tickets({
            userID: user.id,
            ticketID: Math.random().toString().substr(2, 8),
            channelID: channel.id,
          });
          newTicket.save().catch((e) => console.error(e));
        });
      } else {
        client.channels.cache.get(res.channelID).send(`${user.toString()} Your ticket is here.`).then(msg => {
          msg.delete({timeout: 60000})
        })
      }
    });
  }
};
