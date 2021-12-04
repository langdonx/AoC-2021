import { readFileSync } from 'fs';

const result = readFileSync('input', 'utf-8')
    .split('\n')
    .map(n => parseInt(n, 10)) // convert input to numbers to avoid string comparison
    .reduce((tally, current, index, parsedLines) => {
        // only do the math if (a) we've passed the first index and (b) there are enough values left for a full "three-measurement sliding window"
        if (index > 0 && index <= parsedLines.length - 3) {
            const next = parsedLines[index + 1];

            // calculate sliding sums for comparison
            const previousValue = parsedLines[index - 1] + current + next;
            const currentValue = current + next + parsedLines[index + 2];

            if (previousValue < currentValue) {
                tally.counter += 1;
            }
        }

        return tally;
    }, { counter: 0 });

console.log(`The sliding sums increased ${result.counter} times.`);

// i iteratively wrote the code (write some, run it, etc). no silly mistakes were made this time.
