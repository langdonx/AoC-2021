import { readFileSync } from 'fs';

const result = readFileSync('input', 'utf-8')
    .split('\n')
    .reduce((tally, current) => {
        // get a number to avoid string comparison
        const currentInt = parseInt(current, 10);

        // only increment the counter if (a) we have a previous value and (b) the current value is greater than the previous
        if (tally.previousValue !== null && tally.previousValue < currentInt) {
            tally.counter += 1;
        }

        // keep track of the previous value for comparison on the next iteration
        tally.previousValue = currentInt;

        return tally;
    }, {
        counter: 0,
        previousValue: null,
    });

console.log(`The depth increased ${result.counter} times.`);

// 1st attempt 1852, too high because i wasn't assigning tally.previousValue so it was 156 every time, hehe
// 2nd attempt 1392, too low because i didn't parseInt like an idiot
