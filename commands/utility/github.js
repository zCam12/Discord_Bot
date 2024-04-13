const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('Receive link to the GitHub repository for the bot.'),
	async execute(interaction) {
		return interaction.reply({ content: `https://github.com/zCam12/Discord_Bot`, ephemeral: true });
	},
};