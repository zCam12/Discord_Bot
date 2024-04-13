const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Shows current level')
        .addMentionableOption(option => option.setName('person').setDescription("person who's level youd like to view")),
    async execute(interaction) {

        let score;
        var person = interaction.options.getMentionable('person');

        if(person){
            score = interaction.client.getScore.get(person.user.id, interaction.guildId);
            
            // Sets score for person if none already
            if(!score){
                score = {
                    id: `${interaction.guildId}-${person.user.id}`,
                    user: person.user.id,
                    guild: interaction.guildId,
                    points: 0,
                    rank: 0,
                    level: 0
                }

                interaction.client.setScore.run(score);
            }

            //await interaction.reply(`${person} currently has ${score.points} points and is level ${score.level}!`);
        }else{
            score = interaction.client.getScore.get(interaction.user.id, interaction.guildId);

            // Sets  your score if none already
            if(!score){
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

            person = interaction.member;

            //await interaction.reply(`You currently have ${score.points} points and are level ${score.level}!`);
        }

        // Find color role
        var color = null;
        var colorRole = null;
        const userRoles = person._roles;
        const rolesLength = person._roles.length;

        for(var i = 0; i <= rolesLength - 1; i++){
            if(interaction.guild.roles.cache.get(userRoles[i]).hoist == true){
                colorRole = userRoles[i];
                color = interaction.guild.roles.cache.get(userRoles[i]).hexColor;
            }
        };

        // Get time
        var dateNTime = interaction.createdAt.toString().split(" ");
        var date = dateNTime[1] + ' ' + dateNTime[2] + ', ' + dateNTime[3];
        var time = dateNTime[4].split(':');
        time = time[0] + ":" + time[1];

        // Get avatar
        const avatarURL = person.displayAvatarURL({ size: 512 });

        // Get next level
        const nxtlvl = Math.pow(score.level + 1, 3); 

        // Creates Level embed
        const levelEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`**Level ${score.level}\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ Rank ${score.rank}**`)
        .setDescription(`**${person.user.username}: ${score.points} xp\n\n ${nxtlvl - score.points} xp needed to level up to level ${score.level + 1}**`)
        .setThumbnail(`${avatarURL}`)
        .setFooter(footer = { text: (`Requested by ${interaction.user.username} at ${time}.`) });
       
        await interaction.reply({ embeds: [levelEmbed] });
    },
};