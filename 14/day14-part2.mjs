import { readFileSync } from 'fs';

const start = new Date();

const input = readFileSync('input', 'utf-8').split('\n\n');
const [templateInput, rulesInput] = input;

const decrementMap = (map, key, decrementBy = 1) => map.set(key, (map.get(key) || decrementBy) - decrementBy);
const incrementMap = (map, key, incrementBy = 1) => map.set(key, (map.get(key) || 0) + incrementBy);

// build a map of rules
const rulesMap = new Map();
for (const rule of rulesInput.split('\n')) {
    rulesMap.set(...rule.split(' -> '));
}

// build a map of pairs
const pairsMap = new Map();
for (let i = 0; i < templateInput.length - 1; i += 1) {
    const pair = templateInput[i] + templateInput[i + 1];
    incrementMap(pairsMap, pair);
}

// keep track of the final pair for counting
let lastPair = templateInput[templateInput.length - 2] + templateInput[templateInput.length - 1];

const step = () => {
    // iterate through all pairs, splitting them as necessary
    [...pairsMap.entries()].forEach((pair) => {
        const [pairKey, pairValue] = pair;
        const newChar = rulesMap.get(pairKey);
        if (newChar) {
            // build new pairs by injecting newChar in between (pairKey=AB, newChar=C, becomes [AC, CB])
            const newPair1 = pairKey[0] + newChar;
            const newPair2 = newChar + pairKey[1];

            // if the existing pair still exists after the split, no need to bother with it
            if (pairKey !== newPair1 && pairKey !== newPair2) {
                decrementMap(pairsMap, pairKey, pairValue);
            }

            // if the first new pair is unique, increment the count by the number of occurrences of the original pair
            if (pairKey !== newPair1) {
                incrementMap(pairsMap, newPair1, pairValue);
            }

            // same for the second new pair ^
            if (pairKey !== newPair2) {
                incrementMap(pairsMap, newPair2, pairValue);
            }
        }
    });

    // maintain the last pair
    const lastPairRule = rulesMap.get(lastPair);
    if (lastPairRule) {
        lastPair = lastPairRule + lastPair[1];
    }
};

// go through 40 steps
for (let i = 0; i < 40; i += 1) {
    step();
}

// using the pairs, determine the number of characters
const charMap = new Map();
[...pairsMap.keys()].forEach((pair) => {
    // only consider the first character of the pair (since the second character is the first part of another pair)
    incrementMap(charMap, pair[0], pairsMap.get(pair));
});
// include the final character, which is not a part of any pair
incrementMap(charMap, lastPair[1]);

// sort the character occurrences
const sortedLengths = [...charMap.values()].sort((a, b) => a - b);

// most frequenty - least frequent
console.log(sortedLengths[sortedLengths.length - 1] - sortedLengths[0]);
console.log(`This took ${Date.now() - start}ms.`);
