import { readFileSync } from 'fs';

const result = readFileSync('input', 'utf-8')
    .split('\n')
    .reduce((tally, current) => {
        // extract the numeric value from the instruction
        const value = parseInt(current.match(/\d+/)[0], 10);

        // move based on the instruction
        if (current.startsWith('up') === true) {
            tally.depth -= value;
        }
        else if (current.startsWith('down') === true) {
            tally.depth += value;
        }
        else if (current.startsWith('forward') === true) {
            tally.horizontalPosition += value;
        }

        return tally;
    }, {
        depth: 0,
        horizontalPosition: 0,
    });

console.log(`The ship's final destination will be ${result.depth * result.horizontalPosition}.`);
