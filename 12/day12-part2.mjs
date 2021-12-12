import { readFileSync } from 'fs';

const input = readFileSync('input', 'utf-8');
const uniqueCaves = new Set(input.replace(/\n/g, '-').split('-'));
const caveExits = new Map([...uniqueCaves].map((c) => {
    const exits = input
        .split('\n')
        .filter(p => p.includes(`${c}-`) || p.includes(`-${c}`)) // starts or ends with the uniqueCave
        .map(p => p.replace(new RegExp(`-?${c}-?`), '')); // remove uniqueCave to get the exit
    return [c, exits];
}));

const determineNextSteps = (paths) => {
    const newPaths = [];

    for (const path of paths) {
        const lastCave = path.match(/([A-Za-z]+)$/)[1];

        // this path has reached the end, nothing left to do
        if (lastCave === 'end') {
            newPaths.push(path);
        }
        else {
            // iterate through cave exits
            for (const exit of caveExits.get(lastCave)) {
                let canVisitExit = true;

                // don't ever go back to the start
                if (exit === 'start') {
                    canVisitExit = false;
                }

                // don't visit a single small cave more than twice
                else {
                    const exitIsSmallCave = exit.match(/[a-z]/) !== null;
                    const exitUsedBefore = path.includes(`${exit},`);

                    if (exitIsSmallCave === true && exitUsedBefore === true) {
                        // build a Map of small caves visited so far (inefficient to keep rebuilding this, but)
                        const smallCaveExitFrequency = new Map();
                        const smallCavesVisited = path.split(',').filter(e => e.match(/[a-z]/) !== null);
                        for (const e of smallCavesVisited) {
                            smallCaveExitFrequency.set(e, (smallCaveExitFrequency.get(e) || 0) + 1);
                        }

                        // if another small cave has been visited twice, then it's a no go
                        canVisitExit = ![...smallCaveExitFrequency.values()].some(p => p === 2);
                    }

                    if (canVisitExit === true) {
                        newPaths.push(`${path},${exit}`);
                    }
                }
            }
        }
    }

    return newPaths;
};

// generate all possible paths
let paths = ['start'];
while (paths.length !== paths.filter(p => p.match(',end$')).length) {
    paths = determineNextSteps(paths);
}
console.log(`There are ${paths.length} paths.`);
