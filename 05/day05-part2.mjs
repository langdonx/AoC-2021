import { readFileSync } from 'fs';

// https://stackoverflow.com/a/9614122/158502
const calculateAngle = (cx, cy, ex, ey) => {
    const dy = ey - cy;
    const dx = ex - cx;
    const theta = Math.atan2(dy, dx); // range (-PI, PI]
    const degrees = theta * 180 / Math.PI; // rads to degs, range (-180, 180]
    // if (theta < 0) theta = 360 + theta; // range [0, 360)
    return Math.abs(degrees);
};

const lineInput = readFileSync('input', 'utf-8')
    .split('\n');

let xMax = 0;
let yMax = 0;

// build a matrix of lines
const lineMatrix = lineInput.map((line) => {
    const matches = line.match(/(\d+),(\d+) -> (\d+),(\d+)/);
    const x1 = parseInt(matches[1], 10);
    const y1 = parseInt(matches[2], 10);
    const x2 = parseInt(matches[3], 10);
    const y2 = parseInt(matches[4], 10);

    // while we're looping, determine the grid size
    xMax = Math.max(xMax, x1 + 1, x2 + 1);
    yMax = Math.max(yMax, x1 + 1, y2 + 1);

    return [
        [x1, y1],
        [x2, y2],
    ];
});

// const intersectionMatrix = new Array(xMax).fill(new Array(yMax).fill('.'));
const intersectionMatrix = Array.from({ length: xMax }, () => Array(yMax).fill(0));

// determine intersections
for (const row of lineMatrix) {
    const [point1, point2] = row;
    const [x1, y1] = point1;
    const [x2, y2] = point2;

    // only handle horizontal...
    if (x1 === x2) {
        const [lower, upper] = y1 < y2 ? [y1, y2] : [y2, y1];
        for (let y = lower; y <= upper; y += 1) {
            intersectionMatrix[x1][y] += 1;
        }
    }
    // or vertical lines...
    else if (y1 === y2) {
        const [lower, upper] = x1 < x2 ? [x1, x2] : [x2, x1];
        for (let x = lower; x <= upper; x += 1) {
            intersectionMatrix[x][y1] += 1;
        }
    }
    // or 45 degree diagonal lines
    else if ([45, 135].includes(calculateAngle(x1, y1, x2, y2)) === true) {
        const diff = Math.abs(x1 - x2);

        for (let i = 0; i <= diff; i += 1) {
            const xIncrement = x1 > x2 ? -i : i;
            const yIncrement = y1 > y2 ? -i : i;
            intersectionMatrix[x1 + xIncrement][y1 + yIncrement] += 1;
        }
    }
}

// print the matrix for fun/debugging if it's not too big (iterate rows, then columns)
if (intersectionMatrix.length < 20) {
    for (let y = 0; y < intersectionMatrix.length; y += 1) {
        for (let x = 0; x < intersectionMatrix[y].length; x += 1) {
            process.stdout.write((intersectionMatrix[x][y] || '.').toString());
        }
        process.stdout.write('\n');
    }
}

let overlaps = 0;
for (const row of intersectionMatrix) {
    for (const col of row) {
        if (col > 1) {
            overlaps += 1;
        }
    }
}

console.log(`${lineInput.length} lines intersected ${overlaps} times.`);
