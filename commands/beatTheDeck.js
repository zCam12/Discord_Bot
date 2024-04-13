console.log(`Game of beat the deck started!`);

let DECK = ['A','K','Q','J','T','9','8','7','6','5','4','3','2',
            'A','K','Q','J','T','9','8','7','6','5','4','3','2',
            'A','K','Q','J','T','9','8','7','6','5','4','3','2',
            'A','K','Q','J','T','9','8','7','6','5','4','3','2'];
var msg = '';
var openHands = 9;
var openSpots = [1,2,3,
                 4,5,6,
                 7,8,9];
var cardSpots = ['N','N','N',
                 'N','N','N',
                 'N','N','N',];

// Set number of decks
var numOfDecks = prompt("How many decks would you like to use?");

for(var i = 0; i < numOfDecks; i++){
    DECK += DECK;
}

// Shuffle deck
shuffle(DECK);

// Set card spots
for(let i = 0; i < 9; i++){
    cardSpots[i] = DECK[0];
    DECK.shift();
}

// Print original hands
console.log(printHand(cardSpots));

// Manage game
while(openHands != 0){

    // Get position TODO: check if spot is open
    do{
        var spot = prompt("Which spot would you like to place a card?");

        if(spot < 1 || spot > 9){
            console.log("Invalid choice must be a number 1-9.");
        }
    }while(spot < 1 || spot > 9);
    
    // Get higher or lower
    do{
        var HorL = prompt("Higher or Lower?");
        HorL.toLowerCase();

        if(HorL != "higher" || HorL != "lower" || HorL != "h" || HorL != "l"){
            console.log("Must choose; higher (h) or lower (l)");
        }
    }while(HorL != "higher" || HorL != "lower" || HorL != "h" || HorL != "l");

    // Set new spot
    var curCard = cardSpots[spot];
    var nextCard = DECK[0];
    DECK.shift();
    cardSpots[spot] = nextCard;

    // print new hands
    console.log(printHand(cardSpots));
    
    // Check if user correct

    if(){}

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
