import { readFileSync } from 'fs';

const openChars = '([{<';
const closeChars = ')]}>';

const isCorrupt = (line) => {
    const charStack = [];

    for (const char of [...line]) {
        // push all opening characters onto the stack
        if (openChars.includes(char) === true) {
            charStack.push(char);
        }
        else {
            const closeCharIndex = closeChars.indexOf(char);

            // if it's a close character
            if (closeCharIndex > -1) {
                // pop off the last opening character
                const lastChar = charStack.pop();
                const anticipatedLastCharacter = openChars[closeCharIndex];

                // if the last opening character isn't the one we expect (based on the current closing character) then we have a problem
                if (lastChar !== anticipatedLastCharacter) {
                    return true;
                }
            }
        }
    }

    return false;
};

const autoCompleteAndGetScore = (line) => {
    let workingLine = line;

    // extremely inefficient algorithm, but lol
    const pairs = ['()', '[]', '{}', '<>'];
    const lineIncludesPair = pair => workingLine.includes(pair);
    while (pairs.some(lineIncludesPair)) {
        for (const pair of pairs) {
            workingLine = workingLine.replace(pair, '');
        }
    }

    // don't even need to actually do the autocomplete to find the score
    const score = [...workingLine]
        .reverse()
        .reduce((sum, char) => {
            const point = openChars.indexOf(char) + 1;

            return sum * 5 + point;
        }, 0);

    return score;
};

// unnecessary comment, but read lines, remove corrupt lines, get scores, sort scores
const scores = readFileSync('input', 'utf-8')
    .split('\n')
    .filter(l => isCorrupt(l) === false)
    .map(l => autoCompleteAndGetScore(l))
    .sort((a, b) => a - b);

const middleScore = scores[Math.floor(scores.length / 2)];
console.log(`The middle score is ${middleScore}.`);
