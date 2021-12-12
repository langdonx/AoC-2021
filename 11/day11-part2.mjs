import { readFileSync } from 'fs';

const input = readFileSync('input', 'utf-8');
const matrixHeight = input.match(/\n/g).length + 1;
const matrixWidth = input.match(/^\d+/)[0].length;
const octopusEnergyLevels = [...input.replace(/\n/g, '')].reduce((p, c, i) => {
    if (i % matrixWidth === 0) {
        p.push([Number(c)]);
    }
    else {
        p[p.length - 1].push(Number(c));
    }
    return p;
}, []);

const flash = (x, y) => {
    if (octopusEnergyLevels[y][x] > 9) {
        // mark it as flash (by setting it to null)
        octopusEnergyLevels[y][x] = null;

        // increment adjacent octopi
        for (let iy = y - 1; iy <= y + 1; iy += 1) {
            for (let ix = x - 1; ix <= x + 1; ix += 1) {
                if (octopusEnergyLevels[iy] && octopusEnergyLevels[iy][ix]) {
                    octopusEnergyLevels[iy][ix] += 1;

                    // did he flash?
                    flash(ix, iy);
                }
            }
        }
    }
};

const step = () => {
    for (const [y, row] of octopusEnergyLevels.entries()) {
        for (const [x, energyLevel] of row.entries()) {
            // First, the energy level of each octopus increases by 1.
            // ignore octopi that have already flashed
            if (energyLevel !== null) {
                octopusEnergyLevels[y][x] += 1;
            }
        }
    }

    for (const [y, row] of octopusEnergyLevels.entries()) {
        for (const x of row.keys()) {
            // Then, any octopus with an energy level greater than 9 flashes.
            flash(x, y);
        }
    }

    // Finally, any octopus that flashed during this step has its energy level set to 0.
    for (const [y, row] of octopusEnergyLevels.entries()) {
        for (const [x, energyLevel] of row.entries()) {
            if (energyLevel === null) {
                octopusEnergyLevels[y][x] = 0;
            }
        }
    }
};

// eslint-disable-next-line prefer-template
const syncRegExp = new RegExp('(.)\\1{' + (matrixHeight * matrixWidth - 1) + '}');

const areSynchronized = () => {
    return octopusEnergyLevels.flat().join('').match(syncRegExp) !== null;
};

let steps = 0;
while (areSynchronized() === false) {
    step();
    steps += 1;
    if (steps === 195) {
        // debug();
    }
}

console.log(`Octopus energy levels synchronized after ${steps} steps.`);
