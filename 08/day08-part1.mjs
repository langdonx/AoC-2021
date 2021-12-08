import { readFileSync } from 'fs';

const sevenDigitSegmentLengths = [
    6, // abcefg
    2, // cf      * unique
    5, // acdeg
    5, // acdfg
    4, // bcdf    * unique
    5, // abdfg
    6, // abdefg
    3, // acf     * unique
    7, // abcdefg * unique
    6, // abcdfg
];

const input = [...readFileSync('input', 'utf-8')
    .matchAll(/ \| (.*)/g)]
    .map(p => p[1])
    .join(' ')
    .split(' ');

// In the output values, how many times do digits 1, 4, 7, or 8 appear?
const lengths = [sevenDigitSegmentLengths[1], sevenDigitSegmentLengths[4], sevenDigitSegmentLengths[7], sevenDigitSegmentLengths[8]];
const sevenDigitSegmentValues = input
    .filter(s => lengths.includes(s.length));

console.log(sevenDigitSegmentValues);
console.log(sevenDigitSegmentValues.length);
