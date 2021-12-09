import { readFileSync } from 'fs';

const input = readFileSync('input', 'utf-8');

const matrixHeight = input.match(/\n/g).length + 1;
const matrixWidth = input.match(/^\d+/)[0].length;
const heights = [...input.replace(/\n/g, '')].map(h => parseInt(h, 10));

const isLowPoint = (x, y) => {
    const currentValue = heights[x + y * matrixWidth];
    const surroundingNumbers = [];

    const hasBottom = (y < matrixHeight - 1);
    const hasLeft = x - 1 >= 0;
    const hasRight = (x + 1 < matrixWidth);
    const hasTop = (y > 0);

    const yValue = y * matrixWidth;

    // top
    if (hasTop) {
        surroundingNumbers.push(heights[x + (yValue - matrixWidth)]);
    }

    // left
    if (hasLeft) {
        surroundingNumbers.push(heights[(x - 1) + yValue]);
    }

    // right
    if (hasRight) {
        surroundingNumbers.push(heights[(x + 1) + yValue]);
    }

    // bottom
    if (hasBottom) {
        surroundingNumbers.push(heights[x + (yValue + matrixWidth)]);
    }

    // if any values are less than or equal to the currentValue, give up and return false
    // a bit too clever, this caused me a lot of trouble because i forgot the equals
    return !surroundingNumbers.some(sn => sn <= currentValue);
};

const lowPoints = [];

for (let yValue = 0; yValue < heights.length; yValue += matrixWidth) {
    for (let x = 0; x < matrixWidth; x += 1) {
        const y = yValue / matrixWidth;
        if (isLowPoint(x, y) === true) {
            lowPoints.push(heights[yValue + x]);
        }
    }
}

const riskLevelSum = lowPoints.reduce((sum, lowPoint) => sum + lowPoint + 1, 0);

console.log(`The sum of low point risk levels is ${riskLevelSum}.`);
