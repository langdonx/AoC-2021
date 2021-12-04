import { readFileSync } from 'fs';

const binaryValues = readFileSync('input', 'utf-8')
    .split('\n');

// create a checksum representing how many zeros/ones are in each position
const bitChecksumSeed = [...binaryValues[0]].map(() => [0, 0]);

const result = binaryValues
    .reduce((bitChecksum, binaryString) => {
        // iterate through the binary string increment bitChecksum as necessary
        for (let bitIndex = 0; bitIndex < binaryString.length; bitIndex += 1) {
            // keep track of occurrences of 0 and 1 (coercing string->int here but it works fine)
            bitChecksum[bitIndex][binaryString[bitIndex]] += 1;
        }

        return bitChecksum;
    }, bitChecksumSeed)
    .reduce((tally, bitChecksumEntry) => {
        // determine the frequency of each bit from the bitChecksum
        const isZeroMoreCommonThanOne = (bitChecksumEntry[0] > bitChecksumEntry[1]);

        // epsilon rate uses the least common bit
        tally.epsilonRate += isZeroMoreCommonThanOne ? '1' : '0';

        // gamma rate uses the most common bit
        tally.gammaRate += isZeroMoreCommonThanOne ? '0' : '1';

        return tally;
    }, {
        epsilonRate: '',
        gammaRate: '',
    });

const powerConsumption = parseInt(result.gammaRate, 2) * parseInt(result.epsilonRate, 2);
console.log(`The power consumption of the submarine is ${powerConsumption}.`);
