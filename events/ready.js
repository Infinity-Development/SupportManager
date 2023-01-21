const { readdirSync } = require("fs");
const { join } = require("path");
const filePath2 = join(__dirname, "..", "events");
const eventFiles2 = readdirSync(filePath2);
const timers = require("timers");
const mongoose = require("mongoose");
const { ticketInfo } = require("../config/index");

mongoose.connect(
  'mongodb://staff:npLIShervAnIuMeRSonewo@127.0.0.1:27017/infinity',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Database is Online and Ready!");
  }
);

module.exports = async (client) => {
console.log(`${client.user.tag} is online.`);
client.user.setActivity(`${client.config.prefix}help | InfinityTickets`, {type: "WATCHING"});

 
 client.channels.cache
    .get(ticketInfo.channelID)
    .messages.fetch(ticketInfo.messageID)
    .then(async (message) => {
      if (message.reactions.resolve("🎟")) {
        message.reactions
          .resolve("🎟")
          .users.fetch()
          .then((userList) => {
            if (
              userList.map((user) => user.id === client.user.id).includes(true)
            ) {
              message.reactions.cache
                .find((r) => r.emoji.name == "🎟")
                .users.remove(client.user.id);
              message.react("🎟");
            }
          });
      } else {
        message.react("🎟");
      }
    });
};
