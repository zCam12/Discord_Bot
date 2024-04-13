const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('call')
        .setDescription('Make the bot say something directed at someone, Example: \'@{person} is {words}.\'')
        .addMentionableOption(option => option.setName('person').setDescription('People to say something at.'))
        .addStringOption(option => option.setName('words').setDescription('Whatever you want the bot to say.')),
    async execute(interaction) {
        const person = interaction.options.getMentionable('person');
        const words = interaction.options.getString('words');

		await interaction.reply({ content: `${person} is ${words}`});
    },
};