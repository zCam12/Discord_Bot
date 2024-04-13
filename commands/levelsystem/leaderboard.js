const { SlashCommandBuilder, EmbedBuilder, Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('View the levels leaderboard'),
	async execute(interaction) {

        const guild = interaction.client.guilds.cache.get(interaction.guildId);
        await guild.members.fetch();
        const listOfMembers = Array.from(guild.members.cache.values());

        // removes bots
        for (var i = 0; i < listOfMembers.length; i++){
            if(listOfMembers[i].user.bot){
                listOfMembers.splice(i, 1);
            }
        }

        let score;
        // remove people with no data
        for (var i = 0; i < listOfMembers.length; i++){
            score = interaction.client.getScore.get(listOfMembers[i].user.id, interaction.guildId);

            // removes people with no data
            if(!score){
                listOfMembers.splice(i, 1);
            }
        }

        // remove rank 0 and anyone not top 5
        for (var i = 0; i < listOfMembers.length; i++){
            score = interaction.client.getScore.get(listOfMembers[i].user.id, interaction.guildId);

            if ((score.rank > 5 ) || (score.rank == 0)){
                listOfMembers.splice(i, 1);
            }
            //console.log(`${listOfMembers}`);
        }

        // set array of top 5
        var listOfRanks = [];
        for (var i = 0; i < listOfMembers.length; i++){
            score = await interaction.client.getScore.get(listOfMembers[i].user.id, interaction.guildId);

            listOfRanks.push(score.rank); // adds rank of person to array
        }

        // create leaderboard embed
        const leaderboardEmbed = new EmbedBuilder()
			  .setTitle(`**${interaction.guild.name}'s Top 5 Whores**`)
			  .setColor(0xd62165)
			  .setThumbnail(interaction.guild.iconURL({ size: 512 }));
		
        
        // Loops through and adds each rank in order to the embed\
        //console.log(listOfRanks);
        //console.log(`${listOfMembers}`);
        for (var i = 1; i <= listOfRanks.length; i++){
            for (var j = 0; j < listOfMembers.length; j++){
                score = await interaction.client.getScore.get(listOfMembers[j].user.id, interaction.guildId);
                if(score.rank == i){
                    let user = await interaction.client.users.fetch(`${score.user}`);
                    leaderboardEmbed.addFields({ name: `${score.rank}. ${user.username}`, value: `\`\`\`Experience: ${score.points}\tLevel ${score.level} \`\`\``, inline: false});
                }
            }
        }

        await interaction.reply({ embeds: [leaderboardEmbed] });
    },
};