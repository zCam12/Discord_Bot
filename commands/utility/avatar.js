const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Displays avatar of mnetioned user or your own')
        .addMentionableOption(option => option.setName('person').setDescription('The person\'s whos avatar you\'d like.')),
	async execute(interaction) {
	
		var target = interaction.options.getMentionable('person') || interaction;
		target = target.user;
	
		// Find color role
	        var color = null;
	        var colorRole = null;
	        const userRoles = interaction.member._roles;
	        const rolesLength = interaction.member._roles.length;
	
	        for(var i = 0; i <= rolesLength - 1; i++){
	            if(interaction.guild.roles.cache.get(userRoles[i]).hoist == true){
	                colorRole = userRoles[i];
	                color = interaction.guild.roles.cache.get(userRoles[i]).hexColor;
	            }
	        };
	
		// Create embed
		const embed = new EmbedBuilder()
			.setColor(color)
			.setTitle(`${target.username}'s avatar`)
			.setImage(target.displayAvatarURL({ dynamic: true }))
			.setFooter(footer = { text: (`Requested by ${interaction.user.username}`) });


		return interaction.reply({ embeds: [embed] });
	},
};
