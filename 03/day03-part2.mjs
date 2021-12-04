import { readFileSync } from 'fs';

const allBinaryValues = readFileSync('input', 'utf-8')
    .split('\n');

// they're intended to all be the same
const binaryValueLength = allBinaryValues[0].length;

const buildBitChecksumForPosition = (binaryValues, arrayPosition) => {
    return binaryValues.reduce((tally, binaryValue) => {
        // keep track of occurrences of 0 and 1 for the requested position in the array
        tally[binaryValue[arrayPosition]] += 1;

        return tally;
    }, [0, 0]);
};

const filterBinaryValues = (binaryValuesToFilter, comparisonFn) => {
    let filteredBinaryValues = Array.from(binaryValuesToFilter);

    for (let i = 0; i < binaryValueLength; i += 1) {
        // get the count of zeroes/ones for the position (i)
        const bitChecksumEntry = buildBitChecksumForPosition(filteredBinaryValues, i);

        // filter out any binary values that don't match the comparison function provided
        filteredBinaryValues = filteredBinaryValues.filter((binaryValue) => {
            // use the provided comparisonFn to determine which bit to use
            const bitToFavor = comparisonFn(bitChecksumEntry[0], bitChecksumEntry[1]) ? '0' : '1';
            return binaryValue[i] === bitToFavor;
        });

        // if we only have 1 value left, give up
        if (filteredBinaryValues.length === 1) {
            break;
        }
    }

    return filteredBinaryValues;
};

const generatorValues = filterBinaryValues(allBinaryValues, (zeroesCount, onesCount) => zeroesCount > onesCount);
const scrubberValues = filterBinaryValues(allBinaryValues, (zeroesCount, onesCount) => zeroesCount <= onesCount);

const lifeSupportRating = parseInt(generatorValues[0], 2) * parseInt(scrubberValues[0], 2);
console.log(`The life support rating of the submarine is ${lifeSupportRating}.`);
