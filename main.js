const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, Message, MessageFlags, EmbedBuilder } = require('discord.js');
const { token, clientId, prefix } = require('./config.json');
const SQLite = require("better-sqlite3");
const sql = new SQLite("./scores.sqlite");

// Create a new Client instance
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,  GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions ]});


client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Bot Starter 
client.once(Events.ClientReady, c => {

	// Starts the bot and alerts in log
    console.log(`Bot Ready and online\nLogged in as ${c.user.tag}`);
	client.user.setActivity('with the Whores.', {type: ActivityType.Playing });
	console.log("Status Set.");
	
	/*--- LEVEL SYSTEM TABLE ---*/
	// Check if the table "points" exists.
	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
	if (!table['count(*)']) {
	  // If the table isn't there, create it and setup the database correctly.
	  sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, rank INTEGER, level INTEGER);").run();
	  // Ensure that the "id" row is always unique and indexed.
	  sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
	  sql.pragma("synchronous = 1");
	  sql.pragma("journal_mode = wal");
	}

	// And then we have two prepared statements to get and set the score data.
	client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
	client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, rank, level) VALUES (@id, @user, @guild, @points, @rank, @level);");
	/*--- END OF LEVEL SYSTEM TABLE ---*/ 
	
});


// Slash command handler
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


// Response commands handler
client.on("messageCreate", async(message) => {

	let score; // for level system
	
	if (message.author.bot) return;
	if (message.guild) {

		/*--- LEVEL SYSTEM HANDLER ---*/
		score = client.getScore.get(message.author.id, message.guild.id);
		
		// Sets score if none already
		if(!score){
			score = {
				id: `${message.guild.id}-${message.author.id}`,
				user: message.author.id,
				guild: message.guild.id,
				points: 0,
				rank: 0,
				level: 0
			}
		}

		var xpAdd =  Math.floor(Math.random() * 10);

		if(message.content.indexOf(prefix) == 0){
			xpAdd = 0;
		}

		const curxp = score.points;
		const curlvl = score.level;
		score.points = curxp + xpAdd;
		const nxtlvl = Math.pow(curlvl + 1, 3); 

		// sets level
		if(score.points >= nxtlvl){
			score.level = curlvl + 1;
			message.reply({ content:`You have leveled up to level **${score.level}**!`, ephemeral: true });
		}

		// sets rank
		const allRanks = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points").all(message.guild.id);

		// Array of users
		var rankUsers = [];
		for (const data of allRanks){
			let user = await client.users.fetch(`${data.user}`);
			rankUsers.push(user.id);
		}
		rankUsers.reverse();
		//console.log(rankUsers);

		// Array of points
		var rankPoints = [];
		for (const data of allRanks){
			rankPoints.push(data.points);
		}
		rankPoints.reverse();
		//console.log(rankPoints);

		// Update rank of everyone
		for (var i = 0; i < rankUsers.length; i++){
			let userScore = client.getScore.get(rankUsers[i], message.guild.id);
			if (userScore.points == rankPoints[i]){
				// updates table
				if(rankUsers[i] == message.author.id){
					score.rank = i + 1;
					client.setScore.run(score);
				}else{
					userScore.rank =  i + 1;
					client.setScore.run(userScore);
				}
			}else{
				console.log(`ERROR\nuser: ${userScore.user}\npoints: ${userScore.points}\nrank: ${userScore}\ni: ${i}\nERROR`);
			}
		}
		
		/*--- END OF LEVEL SYSTEM HANDLER ---*/

		/*--- AUTO RESPONSE HANDLER ---*/
		// "Crazy" auto-response
		if (message.content.includes('crazy')) {
			message.channel.send("Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy.");
		};

		// "69" auto-response
		if (message.content.includes('69')) {
			message.channel.send("nice");
		};
		/*--- END OF AUTO RESPONSE HANDLER ---*/

		/*--- PREFIX COMMAND HANDLER --*/
		if(message.content.indexOf(prefix) !== 0) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		/*--- END OF PREFIX COMMAND HANDLER ---*/
	};
});


client.login(token); 
