// WORK IN PROGRESS

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('btd')
        .setDescription('Play Beat the Deck'),
    async execute(interaction) {
        let DECK = ['A','K','Q','J','T','9','8','7','6','5','4','3','2',
                      'A','K','Q','J','T','9','8','7','6','5','4','3','2',
                      'A','K','Q','J','T','9','8','7','6','5','4','3','2',
                      'A','K','Q','J','T','9','8','7','6','5','4','3','2'];

        interaction.reply({ content: `Game of beat the deck started!`});

        var msg = '';
        var openHands = 9;
        var openSpots = [1,2,3,
                         4,5,6,
                         7,8,9];
        var cardSpots = ['N','N','N',
                         'N','N','N',
                         'N','N','N',];

        // Shuffle deck
        shuffle(DECK);

        // Set card spots
        for(let i = 0; i < 9; i++){
            cardSpots[i] = DECK[0];
            DECK.shift();
        }

        // Print original hands
        msg = printHand(cardSpots);
        const message = await interaction.channel.send(msg);

        // Add reactions
        message.react('1️⃣');
        message.react('2️⃣');
        message.react('3️⃣');
        message.react('4️⃣');
        message.react('5️⃣');
        message.react('6️⃣');
        message.react('7️⃣');
        message.react('8️⃣');
        message.react('9️⃣');
        message.react('⬆️');
        message.react('⬇️');

        let userReactions = [];
            // get user reactions here
        message.reactions.cache.forEach(async(reaction) => {
            const emojiName = reaction._emoji.name;
            const emojiCount = reaction.count;
            const reactionUsers = await reaction.users.fetch();
            console.log(emojiName + ", " + emojiCount + ", " + reactionUsers);
        });

        // Manage game
        while(openHands != 0){

            let userReactions = [];
            // get user reactions here
            message.reactions.cache.forEach(async(reaction) => {
                const emojiName = reaction._emoji.name;
                const emojiCount = reaction.count;
                const reactionUsers = await reaction.users.fetch();
                console.log(emojiName + ", " + emojiCount + ", " + reactionUsers);
            });

            if(userReactions[0] == '⬆️' || userReactions[1] == '⬆️'){ // Higher case

            }else if(userReactions[0]  == '⬇️' || userReactions[1] == '⬇️'){ // Lower case

            }else{
                //error
                break;
            }

            openHands = 0;
        }


        function shuffle(deck){
            currIndex = deck.length;

            while(currIndex != 0){
                let randIndex = Math.floor(Math.random() * currIndex);
                currIndex--;

                [deck[currIndex],deck[randIndex]] = [deck[randIndex], deck[currIndex]];
            }
        }

        function printHand(cardSpots){
            let handString = "";
            for(let i = 0; i < 9; i++){
                handString += cardSpots[i] + "\t";
                if(i == 2 || i == 5){
                    handString += "\n";
                }
            }
            return handString;
        }
    },
};
