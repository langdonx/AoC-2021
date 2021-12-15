import { readFileSync } from 'fs';

const start = new Date();

const input = readFileSync('input', 'utf-8').split('\n\n');
const [templateInput, rulesInput] = input;

const decrementMap = (map, key, decrementBy = 1) => {
    const v = (map.get(key) || decrementBy) - decrementBy;
    if (v === 0) {
        map.delete(key);
    }
    else {
        map.set(key, v);
    }
};

const incrementMap = (map, key, incrementBy = 1) => map.set(key, (map.get(key) || 0) + incrementBy);

// const dumpCharMapForPairMap = (pairsMap, lastPair) => {
//     const charMap = new Map();
//     [...pairsMap.keys()].forEach((pair) => {
//         // console.log(pair, pair[0], pair[1], pairsMap.get(pair));
//         incrementMap(charMap, pair[0], pairsMap.get(pair));
//     // incrementMap(charMap, pair[1], pairsMap.get(pair));
//     });
//     incrementMap(charMap, lastPair[1]);

//     console.log(charMap);
// };

// const dumpCharMapForString = (s) => {
//     const charMap = new Map();
//     for (let i = 0; i < s.length; i += 1) {
//         const len = charMap.get(s[i]) || 0;
//         charMap.set(s[i], len + 1);
//     }

//     console.log(s);
//     console.log(charMap);
// };

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

// keep track of the final pairs for counting
let lastPair = templateInput[templateInput.length - 2] + templateInput[templateInput.length - 1];

const step = () => {
    [...pairsMap.entries()].forEach((pair) => {
        const [pairKey, pairValue] = pair;
        const newChar = rulesMap.get(pairKey);
        if (newChar) {
            const newPair1 = pairKey[0] + newChar;
            const newPair2 = newChar + pairKey[1];
            if (pairKey !== newPair1 && pairKey !== newPair2) {
                decrementMap(pairsMap, pairKey, pairValue);
            }
            if (pairKey !== newPair1) {
                incrementMap(pairsMap, newPair1, pairValue);
            }
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

for (let i = 0; i < 40; i += 1) {
    step();

    // console.log(`step ${i + 1}`);
}

const charMap = new Map();
[...pairsMap.keys()].forEach((pair) => {
    incrementMap(charMap, pair[0], pairsMap.get(pair));
});
incrementMap(charMap, lastPair[1]);

const sortedLengths = [...charMap.values()].sort((a, b) => a - b);
console.log(sortedLengths[sortedLengths.length - 1] - sortedLengths[0]);
console.log(`This took ${Date.now() - start}ms.`);
