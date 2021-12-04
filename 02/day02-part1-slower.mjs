import { readFileSync } from 'fs';

const result = readFileSync('input', 'utf-8')
    .split('\n')
    .reduce((tally, current) => {
        const instruction = current.split(' ');
        const value = parseInt(instruction[1], 10);

        switch (instruction[0]) {
            case 'up':
                tally.depth -= value;
                break;
            case 'down':
                tally.depth += value;
                break;
            case 'forward':
                tally.horizontalPosition += value;
                break;
        }

        return tally;
    }, {
        depth: 0,
        horizontalPosition: 0,
    });

console.log(`The ship's final destination will be ${result.depth * result.horizontalPosition}.`);

// this one is slower at least according to my benchmark: https://jsbench.me/71kwp9g0ju/1
