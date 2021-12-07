import { readFileSync } from 'fs';

const start = Date.now();

// parse the input
const crabPositions = readFileSync('input', 'utf-8')
    .split(',')
    .map(n => parseInt(n, 10));

// the idea is that the true number should be close enough to the average, so we shouldn't have to go to far. i made this up. it's not based on any real science that smart people do.
const averagePosition = Math.round(crabPositions.reduce((p, c) => p + c, 0) / crabPositions.length);
const maxPosition = Math.max(...crabPositions);
const goodEnoughIterations = maxPosition * 0.25;

// determine the range at which we need to iterate
const lower = Math.max(0, averagePosition - goodEnoughIterations);
const upper = Math.min(maxPosition, averagePosition + goodEnoughIterations);

// maintain a hash of needed movement to fuelCost
const movementHash = {};

// the new algorithm for determining fuel cost
const calculateFuelCost = (requiredMovement) => {
    let total = 0;
    for (let i = 1; i <= requiredMovement; i += 1) {
        total += i;
    }
    return total;
};

for (let i = lower; i < upper; i += 1) {
    for (const position of crabPositions) {
        movementHash[i] = movementHash[i] || 0;
        const movement = Math.abs(position - i);
        const fuelCost = calculateFuelCost(movement);

        movementHash[i] += fuelCost;
    }
}

// determine the least cost (while abandoning which horizontal position is the most optimal 😅)
const fuelCost = Math.min(...Object.values(movementHash));

console.log(`The crabs must spend ${fuelCost} fuel to align.`);
console.log(`This took ${Date.now() - start}ms.`);
