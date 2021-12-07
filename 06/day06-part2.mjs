import { readFileSync } from 'fs';
import LanterfishSchool from './LanterfishSchool.part2.mjs';

const daysToPass = 256;

// parse the input
const input = readFileSync('input', 'utf-8')
    .split(',')
    .map(n => parseInt(n, 10));

// create a school of fish
const school = new LanterfishSchool(input);

// pass the required number of days
for (let i = 0; i < daysToPass; i += 1) {
    school.passDay();
}

console.log(`After ${daysToPass} days, there are ${school.size} lanternfish`);
