//           To run the project on the terminal type in "node project.js" in the terminal 

// 1.  Deposit some money
// 2. Determine number of lines to bet on 
// 3. Colect a bet amount  
// 4. Spin the slot machine -- randomize the lines 
// 5.  check if the user won  -- check to see if what was spinned was correct 
// 6. give the user their winnings/prize -- deposit into their overall deposits 
// 7.  Play again -- while loop untill users says no 


const prompt = require("prompt-sync") (); // the "()" after gives access to the const as a function 



// These constants define the number of rows and columns in the slot machine and the count and values associated with each symbol.
const SYMBOLS_COUNT = {    
    "A": 2,
    "B": 4,     //keys map with different values SYMBOLS_COUNT["A"] --> 2
    "C": 6,
    "D": 8,
} 

const SYMBOLS_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,

}

//This function prompts the user to enter a deposit amount and validates if it is a valid positive number
const deposit= () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ")
        const numberDepositAmount = parseFloat(depositAmount);  // "parseFloat() converts the string into a int"
    
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Please enter a valid amount");
        } else {
            console.log(`You have deposited ${numberDepositAmount} into your account`)
            return numberDepositAmount
        }
    }
    
};


//This function prompts the user to enter the number of lines they want to bet on and validates if it is a valid number within the range of 1-3.
const getNumberOfLines= () => {
    while (true) {
        const lines= prompt("Enter the number of lines you want to bet on (1-3): ")
        const numberOfLines = parseFloat(lines);  // "parseFloat() converts the string into a int"
    
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid numbers of lines, try again!");
        } else {
            console.log(`You have bet on ${numberOfLines} lines`)
            return numberOfLines
        }
    }
    
};


//This function prompts the user to enter the bet amount per line and validates if it is a valid positive number within the available balance.
const getBet= (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line ")
        const numberBet= parseFloat(bet);  // "parseFloat() converts the string into a int"
    
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {  // " isNaN() " checks if whats in the fucntion is a number or not  
            console.log("Invalid bet, try again ");
        } else {
            console.log(`You have bet ${numberBet} amount`)
            return numberBet
        }
    }
}

const spin = () => { 
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){ // loops through all of the entries in the SYMBOLS_COUNT map
        for (let i = 0; i < count; i ++) {
            symbols.push(symbol); // push the symbol into the symbols array 
        };
    };


    const reels = [[], [], []];  
    for (let i = 0; i < ROWS; i++) {
        const reelSymbol = [...symbols]
        for (let j = 0; j < COLS; j ++){
            const randomIndex = Math.floor(Math.random() * reelSymbol.length);
            const selectedSymbol = reelSymbol[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbol.splice(randomIndex, 1);

        }
    }

    return reels; 


};


const transpose = (reels) => {
    const rows = []

    for (let i = 0; i < ROWS; i ++) {
        rows.push([])
        for (let j = 0; j < COLS; j ++) {
            rows[i].push(reels[j][i])
        }
    }

    return rows
}


const printRows = (rows) => {
    for (const row of rows) { 
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != rows.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString)
    }
    

}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += SYMBOLS_VALUES[symbols[0]] * bet;
        }
    }
    return winnings
}




const game = () => {

    let balance = deposit();

    while(true) {

        console.log(`You have a balnce of $ ${balance}`)

        const numberOfLines = getNumberOfLines();
    
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        
        const reels = spin()
        
        const rows = transpose(reels)
        
        printRows(rows)
        
        const winnings = getWinnings(rows, bet , numberOfLines)
        balance += winnings;
        
        console.log(`You won,$${winnings}`)

        if (balance <= 0) {
            console.log("You ran out of money")
            break;
        }

        const playAgain = prompt("Do you want to play agin (y/n)? ")

        if (playAgain != "y") {
            break; 
        }

    }
}


game()