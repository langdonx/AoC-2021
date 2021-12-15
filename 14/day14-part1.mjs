import { readFileSync } from 'fs';

const start = new Date();

const input = readFileSync('input', 'utf-8').split('\n\n');
const [templateInput, rulesInput] = input;

// build a map of rules
const rulesMap = new Map();
for (const rule of rulesInput.split('\n')) {
    rulesMap.set(...rule.split(' -> '));
}

const step = (template) => {
    let result = '';

    for (let i = 0; i < template.length - 1; i += 1) {
        const pair = template[i] + template[i + 1];
        const rule = rulesMap.get(pair);
        if (rule) {
            result += template[i] + rule;
        }
        else {
            result += template[i];
        }
    }

    return result + template[template.length - 1];
};

let t = templateInput;
for (let i = 0; i < 10; i += 1) {
    t = step(t);
}

const charMap = new Map();
for (let i = 0; i < t.length; i += 1) {
    const len = charMap.get(t[i]) || 0;
    charMap.set(t[i], len + 1);
}

const sortedLengths = [...charMap.values()].sort((a, b) => a - b);
console.log(sortedLengths[sortedLengths.length - 1] - sortedLengths[0]);
console.log(`This took ${Date.now() - start}ms.`);
