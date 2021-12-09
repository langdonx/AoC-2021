import { readFileSync } from 'fs';

const input = readFileSync('input', 'utf-8');

const matrixHeight = input.match(/\n/g).length + 1;
const matrixWidth = input.match(/^\d+/)[0].length;
const basins = [...input.replace(/9/g, ' ').replace(/\n/g, '')];

const discoverCountAndClearBasin = (x, yValue) => {
    let size = 0;

    if (basins[x + yValue] !== ' ') {
        const y = yValue / matrixWidth;

        // clear out this cell so we don't reprocess it
        basins[x + yValue] = ' ';

        // keep track of this cell as part of the basin
        size += 1;

        // figure out where to go
        const hasEast = (x + 1 < matrixWidth) && basins[x + 1 + yValue] !== ' ';
        const hasNorth = (y > 0) && basins[x + yValue - matrixWidth] !== ' ';
        const hasSouth = (y < matrixHeight - 1) && basins[x + yValue + matrixWidth] !== ' ';
        const hasWest = (x - 1 >= 0) && basins[x - 1 + yValue] !== ' ';

        // go east
        if (hasEast) {
            size += discoverCountAndClearBasin(x + 1, yValue);
        }

        // go north
        if (hasNorth) {
            size += discoverCountAndClearBasin(x, yValue - matrixWidth);
        }

        // go south
        if (hasSouth) {
            size += discoverCountAndClearBasin(x, yValue + matrixWidth);
        }

        // go west
        if (hasWest) {
            size += discoverCountAndClearBasin(x - 1, yValue);
        }
    }

    return size;
};

const basinSizes = [];

for (let yValue = 0; yValue < basins.length; yValue += matrixWidth) {
    for (let x = 0; x < matrixWidth; x += 1) {
        // when you encounter a value that's not empty (because it was 9 or had already been cleared)
        // then call a method that recursively walks in all 4 directions (recursion) while clearing each cell and maintaining the size
        basinSizes.push(discoverCountAndClearBasin(x, yValue));
    }
}

const size = basinSizes
    .filter(p => p > 0)
    .map(p => parseInt(p, 10))
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((p, c) => p * c, 1);

console.log(`The product of the 3 largest basins is ${size}.`);
