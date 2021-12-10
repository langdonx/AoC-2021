import { readFileSync } from 'fs';

const lines = readFileSync('input', 'utf-8')
    .split('\n');

const openChars = '([{<';
const closeChars = ')]}>';
const points = [3, 57, 1197, 25137];

let score = 0;

for (const line of lines) {
    process.stdout.write(line);

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
                    // log the error
                    const lastCharIndex = openChars.indexOf(lastChar);
                    process.stdout.write(` - Expected ${closeChars[lastCharIndex]}, but found ${char} instead.`);

                    // increment the score
                    score += points[closeChars.indexOf(char)];

                    break;
                }
            }
        }
    }

    process.stdout.write('\n');
}

console.log(`The total syntax error score is ${score}.`);
