const { SlashCommandBuilder, EmbedBuilder, Message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Quote a person, Requires a channel called "quotes"')
		.addMentionableOption(option => option.setName('person').setDescription('The person you are quoting.'))
        .addStringOption(option => option.setName('quote').setDescription('The quote of the person.')),
	async execute(interaction) {
		const person = interaction.options.getMentionable('person');
        const quote = interaction.options.getString('quote');
        const user = interaction.user;
        const channel = interaction.guild.channels.cache.find(channel => channel.name === 'quotes');
        // quote channel 1121630128800284722
        // test channel 1122405269624864769

        /* WIP DOESNT WORK WITH NEW USERNAME SYSTEM YET
        // Find user display name
        const interactionUser = await interaction.guild.members.fetch(interaction.user.id);
        const userDisplayName = interactionUser.displayName;
        console.log(userDisplayName);
        console.log(".......");
        console.log(interactionUser);
        */

        // Find date and the time
        var dateNTime = interaction.createdAt.toString().split(" ");
        var date = dateNTime[1] + ' ' + dateNTime[2] + ', ' + dateNTime[3];
        var time = dateNTime[4].split(':');
        time = time[0] + ":" + time[1];

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

        // Create Quote Embed

        const quoteEmbed = new EmbedBuilder()
            .setColor(color)
            .setDescription(`"${quote}" - ${person} on ${date}`)
            .setFooter(footer = { text: (`Quoted by ${user.username} at ${time}.`) });

        channel.send({ embeds: [quoteEmbed] });
        return interaction.reply({ content: "It has been quoted.", ephemeral: true });
	},
};