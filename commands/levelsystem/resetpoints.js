const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetpoints')
        .setDescription('reset points of a user')
        .addMentionableOption(option => option.setName('person').setDescription("person who's points you are resetting"))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {

        let score;
        const person = interaction.options.getMentionable('person');

        if(person){
            score = {
                id: `${interaction.guildId}-${person.user.id}`,
                user: person.user.id,
                guild: interaction.guildId,
                points: 0,
                rank: 0,
                level: 0
            }

            interaction.client.setScore.run(score);
        }else{
            score = {
                id: `${interaction.guildId}-${interaction.user.id}`,
                user: interaction.user.id,
                guild: interaction.guildId,
                points: 0,
                rank: 0,
                level: 0
            }

            interaction.client.setScore.run(score);
        }

        await interaction.reply({ content: "Points have been reset", ephemeral: true })
    },
};