// TODO: FIX - doesn't work anymore unknown error

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear up to 99 messages.')
		.addStringOption(option => option.setName('amount').setDescription('Number of messages to clear.')),
	async execute(interaction) {
		var amount = interaction.options.getString('amount');
		amount = parseInt(amount);

		if (amount < 1 || amount > 99) {
			return interaction.reply({ content: 'You need to input a number between 1 and 99.', ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
		});

		return interaction.reply({ content: `Successfully pruned \`${amount}\` messages.`, ephemeral: true });
	},
};
