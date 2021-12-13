import { readFileSync } from 'fs';

const start = new Date();

const input = readFileSync('input', 'utf-8');
const [rawGridInputs, rawInstructionInput] = input.split('\n\n');
const gridInputs = rawGridInputs.split('\n').map(rgi => rgi.split(',').map(gi => Number(gi)));

// determine grid size
let [gridWidth, gridHeight] = gridInputs
    .reduce((p, gi) => {
        return [Math.max(gi[0], p[0]), Math.max(gi[1], p[1])];
    }, [0, 0])
    .map(p => p + 1);

// create grid
const grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill('.'));

// populate grid
gridInputs
    .forEach((gi) => {
        const [x, y] = gi;
        grid[y][x] = '#';
    });

const displayGrid = () => {
    console.log(`${gridWidth}x${gridHeight}`);

    for (const row of grid) {
        for (const cell of row) {
            process.stdout.write(cell);
        }
        process.stdout.write('\n');
    }
};

const getCount = () => {
    let count = 0;
    for (const row of grid) {
        for (const cell of row) {
            if (cell === '#') {
                count += 1;
            }
        }
    }
    return count;
};

const fold = (foldDimension, foldIndex) => {
    if (foldDimension === 'y') {
        console.log(`fold ${foldDimension} @ ${foldIndex} (${Math.floor(gridHeight / 2)})`);

        let iForward = 0;

        // loop backwards through the rows
        for (let i = gridHeight - 1; i > foldIndex; i -= 1) {
            // and forwards through the columns
            for (let j = 0; j < gridWidth; j += 1) {
                if (grid[i][j] === '#') {
                    grid[iForward][j] = '#';
                }
            }

            // keep track of the opposite y index (the destination row)
            iForward += 1;
        }

        // shrink the grid
        grid.splice(foldIndex);
        gridHeight = foldIndex;
    }
    else if (foldDimension === 'x') {
        console.log(`fold ${foldDimension} @ ${foldIndex} (${Math.floor(gridWidth / 2)})`);

        // loop forwards through the rows
        for (let i = 0; i < gridHeight; i += 1) {
            let jForward = 0;

            // and backwards through the columns
            for (let j = gridWidth - 1; j > foldIndex; j -= 1) {
                if (grid[i][j] === '#') {
                    grid[i][jForward] = '#';
                }

                jForward += 1;
            }

            // shrink the row
            grid[i].splice(foldIndex);
        }

        // shrink the grid now that we're done looping
        gridWidth = foldIndex;
    }
};

// determine first instruction
for (const instruction of rawInstructionInput.split('\n')) {
    const [, foldDimension, foldIndex] = instruction.match(/([xy])=(\d+)/);
    fold(foldDimension, foldIndex);
}

displayGrid();

console.log(getCount());
console.log(`This took ${Date.now() - start}ms.`);
