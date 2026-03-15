// ================================================
// LABORATORY 4: JAVASCRIPT FUNDAMENTALS
// SOLUTION.JS WITH TESTING
// ================================================

// ================================================
// PROBLEM 1: The Strict Type Checker
// ================================================
function checkVariable(input) {
    switch (typeof input) {
        case 'string': return 'string';
        case 'number': return 'number';
        case 'boolean': return 'boolean';
        case 'bigint': return 'bigint';
        case 'undefined': return 'undefined';
        case 'object': return 'object';
        default: return 'object';
    }
}

// ================================================
// PROBLEM 2: Secure ID Generator
// ================================================
function generateIDs(count) {
    const ids = [];
    for (let i = 0; i < count; i++) {
        if (i === 5) continue;
        ids.push(`ID-${i}`);
    }
    return ids;
}

// ================================================
// PROBLEM 3: The Functional Sum
// ================================================
function calculateTotal(...numbers) {
    for (let num of numbers) {
        if (typeof num !== 'number') {
            throw new TypeError('Invalid input: All arguments must be numbers');
        }
    }
    return numbers.reduce((total, current) => total + current, 0);
}

// ================================================
// PROBLEM 4: Leaderboard Filter
// ================================================
function getTopScorers(playerList) {
    return playerList
        .filter(player => player.score > 8)
        .map(player => player.name)
        .join(', ');
}

// ================================================
// PROBLEM 5: The Private Inventory
// ================================================
class Item {
    #discount = 0.1;
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    get finalPrice() {
        return this.price - (this.price * this.#discount);
    }
}

// ================================================
// PROBLEM 6: Robust Division
// ================================================
function safeDivide(a, b) {
    try {
        if (b === 0) throw new Error('Cannot divide by zero');
        return a / b;
    } catch (error) {
        return error.message;
    } finally {
        console.log('Operation attempted');
    }
}

// ================================================
// TESTING SECTION
// ================================================
console.log('');
console.log('=== TESTING PROBLEM 1 ===');
console.log(checkVariable('hello'));
console.log(checkVariable(42));
console.log(checkVariable(true));
console.log(checkVariable(undefined));
console.log(checkVariable(null));
console.log(checkVariable({}));
console.log(checkVariable(100n));

console.log('');
console.log('=== TESTING PROBLEM 2 ===');
console.log(generateIDs(7));
console.log(generateIDs(10));
console.log(generateIDs(3));

console.log('');
console.log('=== TESTING PROBLEM 3 ===');
console.log(calculateTotal(1, 2, 3, 4, 5));
console.log(calculateTotal(10, 20, 30));
console.log(calculateTotal(2.5, 3.7, 1.8));

console.log('');
console.log('=== TESTING PROBLEM 4 ===');
const players = [
    { name: 'Alice', score: 10 },
    { name: 'Bob', score: 5 },
    { name: 'Charlie', score: 9 },
    { name: 'David', score: 12 },
    { name: 'Eve', score: 7 },
    { name: 'Frank', score: 8 },
    { name: 'Grace', score: 15 },
    { name: 'Henry', score: 6 },
    { name: 'Ivy', score: 11 },
    { name: 'Jack', score: 4 }
];
console.log(getTopScorers(players));

const smallPlayers = [
    { name: 'Alice', score: 10 },
    { name: 'Bob', score: 5 },
    { name: 'Charlie', score: 9 }
];
console.log(getTopScorers(smallPlayers));

const edgePlayers = [
    { name: 'Test1', score: 9 },
    { name: 'Test2', score: 8 },
    { name: 'Test3', score: 8.5 }
];
console.log(getTopScorers(edgePlayers));

console.log('');
console.log('=== TESTING PROBLEM 5 ===');
const item1 = new Item('OFF! Overtime', 250);
console.log(item1.name);
console.log(item1.price);
console.log(item1.finalPrice);

const item2 = new Item('OFF! Baby', 320);
console.log(item2.name);
console.log(item2.finalPrice);

const item3 = new Item('Test Product', 100);
console.log(item3.finalPrice);

console.log('');
console.log('=== TESTING PROBLEM 6 ===');
console.log(safeDivide(10, 2));
console.log(safeDivide(10, 0));
console.log(safeDivide(15, 3));
console.log(safeDivide(100, 4));
console.log(safeDivide(0, 5));
console.log(safeDivide(-10, 2));
console.log(safeDivide(7, 3));