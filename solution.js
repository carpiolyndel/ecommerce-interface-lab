// Laboratory 4: JavaScript Fundamentals - solution.js

// ================================================
// PROBLEM 1: The Strict Type Checker
// ================================================
function checkVariable(input) {
    switch (typeof input) {
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'bigint':
            return 'bigint';
        case 'undefined':
            return 'undefined';
        case 'object':
            if (input === null) {
                return 'object';
            }
            return 'object';
        default:
            return 'object';
    }
}

// ================================================
// PROBLEM 2: Secure ID Generator
// ================================================
function generateIDs(count) {
    const ids = [];
    
    for (let i = 0; i < count; i++) {
        if (i === 5) {
            continue;
        }
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
    const topPlayers = playerList.filter(player => player.score > 8);
    const topNames = topPlayers.map(player => player.name);
    return topNames.join(', ');
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
        if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        return a / b;
    } catch (error) {
        return error.message;
    } finally {
        console.log('Operation attempted');
    }
}

// ================================================
// TESTING ALL PROBLEMS
// Run with: node solution.js
// ================================================

console.log('========================================');
console.log('LABORATORY 4: JAVASCRIPT FUNDAMENTALS');
console.log('========================================\n');

// ================================================
// Test Problem 1
// ================================================
console.log('PROBLEM 1: The Strict Type Checker');
console.log('checkVariable("hello"):', checkVariable("hello"));
console.log('checkVariable(42):', checkVariable(42));
console.log('checkVariable(true):', checkVariable(true));
console.log('checkVariable(123n):', checkVariable(123n));
console.log('checkVariable(undefined):', checkVariable(undefined));
console.log('checkVariable({}):', checkVariable({}));
console.log('checkVariable(null):', checkVariable(null));
console.log('---\n');

// ================================================
// Test Problem 2
// ================================================
console.log('PROBLEM 2: Secure ID Generator');
console.log('generateIDs(7):', generateIDs(7));
console.log('generateIDs(10):', generateIDs(10));
console.log('---\n');

// ================================================
// Test Problem 3
// ================================================
console.log('PROBLEM 3: The Functional Sum');
try {
    console.log('calculateTotal(1, 2, 3, 4, 5):', calculateTotal(1, 2, 3, 4, 5));
    console.log('calculateTotal(10, 20, 30):', calculateTotal(10, 20, 30));
    
    // This should throw an error
    console.log('calculateTotal(1, 2, "3", 4):', calculateTotal(1, 2, "3", 4));
} catch (error) {
    console.log('Error:', error.message);
}
console.log('---\n');

// ================================================
// Test Problem 4
// ================================================
console.log('PROBLEM 4: Leaderboard Filter');
const players = [
    { name: 'Alice', score: 10 },
    { name: 'Bob', score: 5 },
    { name: 'Charlie', score: 9 },
    { name: 'David', score: 7 },
    { name: 'Eve', score: 12 },
    { name: 'Frank', score: 4 },
    { name: 'Grace', score: 11 },
    { name: 'Henry', score: 8 },
    { name: 'Ivy', score: 6 },
    { name: 'Jack', score: 9 }
];
console.log('Players with score > 8:', getTopScorers(players));
console.log('---\n');

// ================================================
// Test Problem 5
// ================================================
console.log('PROBLEM 5: The Private Inventory');
const item1 = new Item('Laptop', 50000);
const item2 = new Item('Mouse', 500);

console.log('Item 1:', item1.name);
console.log('Original Price: ₱' + item1.price);
console.log('Final Price (with 10% discount): ₱' + item1.finalPrice);
console.log('');
console.log('Item 2:', item2.name);
console.log('Original Price: ₱' + item2.price);
console.log('Final Price (with 10% discount): ₱' + item2.finalPrice);
console.log('---\n');

// ================================================
// Test Problem 6
// ================================================
console.log('PROBLEM 6: Robust Division');
console.log('safeDivide(10, 2):', safeDivide(10, 2));
console.log('safeDivide(10, 0):', safeDivide(10, 0));
console.log('safeDivide(15, 3):', safeDivide(15, 3));
console.log('---\n');

console.log('========================================');
console.log('✅ All problems completed successfully!');
console.log('========================================');