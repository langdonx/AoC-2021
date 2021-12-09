import { readFileSync } from 'fs';

//   a
// b   c
//   d
// e   f
//   g

//   1
// 2   4
//   8
// 16  32
//   64

// built via isValidSevenSegmentDigit('abcdefg', sevenDigitSegments.map(p => p.standardArrangement));
const sevenDigitSegments = [
    { checksum: 119, length: 6, standardArrangement: 'abcefg', }, //  0
    { checksum: 36, length: 2, standardArrangement: 'cf', }, //       1 * unique length
    { checksum: 93, length: 5, standardArrangement: 'acdeg', }, //    2
    { checksum: 109, length: 5, standardArrangement: 'acdfg', }, //   3
    { checksum: 46, length: 4, standardArrangement: 'bcdf', }, //     4 * unique length
    { checksum: 107, length: 5, standardArrangement: 'abdfg', }, //   5
    { checksum: 123, length: 6, standardArrangement: 'abdefg', }, //  6
    { checksum: 37, length: 3, standardArrangement: 'acf', }, //      7 * unique length
    { checksum: 127, length: 7, standardArrangement: 'abcdefg', }, // 8 * unique length
    { checksum: 111, length: 6, standardArrangement: 'abcdfg', }, //  9
];

const uniqueLengths = [sevenDigitSegments[1].length, sevenDigitSegments[4].length, sevenDigitSegments[7].length, sevenDigitSegments[8].length];
const validChecksums = sevenDigitSegments.map(p => p.checksum);

const buildFlags = (segmentOrder) => {
    return [...segmentOrder]
        .reduce((hash, char) => {
            hash[char] = (hash.counter);
            hash.counter *= 2;
            return hash;
        }, { counter: 1 });
}

const getChecksum = (flags, segment) => {
    return [...segment]
        .reduce((sum, char) => {
            return sum += flags[char];
        }, 0);
};

const isValidSevenSegmentDigit = (segmentOrder, segmentsToTry) => {
    const flags = buildFlags(segmentOrder);

    for (const segment of segmentsToTry) {
        const checksum = getChecksum(flags, segment);

        // console.log(segment, checksum, sevenDigitSegments.findIndex(p => p.checksum === checksum));

        if (validChecksums.includes(checksum) === false) {
            return false;
        }
    }

    return true;
};

const lines = readFileSync('input', 'utf-8')
    .split('\n');

const outputSegmentDigits = [];

lines.forEach((line) => {
    const allSegments = line.replace('| ', '').split(' ');
    const [signalPattern, output] = line.split(' | ');
    const signalPatternSegments = signalPattern.split(' ');
    const outputSegments = output.split(' ');

    const calculatedPermutations = [];

    const segmentFor1 = allSegments.find(p => p.length == 2);
    const segmentFor4 = allSegments.find(p => p.length == 4);
    const segmentFor7 = allSegments.find(p => p.length == 3);

    // 1. we can be sure of the top by removing 1's digits from 7
    const topValue = [...segmentFor1].reduce((prev, curr) => prev.replace(curr, ''), segmentFor7);
    calculatedPermutations.push([topValue]);

    // 2. we can narrow down top left, middle by removing 1's digits from 4
    const topLeftAndMiddleValues = [...segmentFor1].reduce((prev, curr) => prev.replace(curr, ''), segmentFor4);
    calculatedPermutations.push([...topLeftAndMiddleValues]);

    // 3. we can narrow down top right, bottom right from 1
    const rightSideValues = [...segmentFor1];
    calculatedPermutations.push(rightSideValues);

    // handle middle values calculated previously (lol)
    calculatedPermutations.push([...topLeftAndMiddleValues]);

    // 4. we can narrow down bottom right, bottom by using the remaining unused digits
    const remainingValues = [...[...segmentFor1, ...segmentFor4, ...segmentFor7].reduce((prev, curr) => prev.replace(curr, ''), 'abcdefg')];
    calculatedPermutations.push(remainingValues);

    // handle bottom right values calculated previously (lol)
    calculatedPermutations.push(rightSideValues);

    // handle bottom values calculated previously (lol)
    calculatedPermutations.push(remainingValues);

    // extremely inefficient because it uses dupes
    let results = [''];

    const discoverPermutations = (remainingPermutations) => {
        // console.log('execution', recursed++, results);

        if (remainingPermutations.length > 0) {
            const possibilities = remainingPermutations[0];

            if (possibilities.length === 1) {
                results.forEach((_, index) => results[index] += possibilities[0]);
            }
            else {
                // duplicate all the entries
                const clonedResults = [...results];
                // append char1 to all existing entries
                results.forEach((_, index) => results[index] += possibilities[0]);
                // append char2 to all duplicated entries
                clonedResults.forEach((_, index) => clonedResults[index] += possibilities[1]);
                results.push.apply(results, [...clonedResults]);
            }

            // recurse
            const rest = remainingPermutations.slice(1);
            if (rest.length > 0) {
                discoverPermutations(rest);
            }
        }
    }

    discoverPermutations(calculatedPermutations);

    for (const segmentOrder of results) {
        if (isValidSevenSegmentDigit(segmentOrder, allSegments) === true) {
            const flags = buildFlags(segmentOrder);

            const digits = parseInt(outputSegments.reduce((d, segment) => {
                // get checksum of segment
                const checksum = getChecksum(flags, segment);

                // find the checksum and the index will be the digit's value
                const digitValue = sevenDigitSegments.findIndex(p => p.checksum === checksum);

                return d += digitValue.toString();
            }, ''), 10);

            console.log(`${segmentOrder}: ${digits}`);
            outputSegmentDigits.push(digits);
            break;
        }
    }
});

console.log(outputSegmentDigits.reduce((p,c)=>p + c, 0));
