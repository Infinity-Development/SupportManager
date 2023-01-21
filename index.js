/**
 * @name InfinityTickets
 * @author TheRealToxicDev <contact@toxicdev.me>
 */

 const { Client, Collection } = require ('discord.js');
 const { cpuUsage } = require('process');
 const config = require ('./config/index');
 
 const client = new Client({
     disableMentions: 'everyone',
     disabledEvents: ['TYPING_START'],
     autoReconnect: true,
     partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
 });
 
 client.commands = new Collection();
 client.aliases = new Collection();
 
 client.limits = new Map();
 client.queue = new Map();
 
 client.config = config;
 client.token = process.env.TOKEN;
 
 /** SNIPE MAP FOR DELETED MESSAGES 😍 */
 client.snipeMap = new Map();
 
 const commands = require ('./structures/commands');
 commands.run(client);
 
 const events = require ('./structures/events');
 events.run(client);
 
 client.login(config.token);
