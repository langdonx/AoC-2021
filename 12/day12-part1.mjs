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
                // don't ever go back to the start
                const headingBackToStart = exit === 'start';

                // don't get stuck in a loop by taking a route we already have
                const retreadingSamePath = path.includes(`${lastCave},${exit}`);

                // don't visit small caves more than once
                const exitIsSmallCave = exit.match(/[a-z]/) !== null;
                const revisitingSmallCave = exitIsSmallCave && `,${path},`.includes(`,${exit},`);

                if (headingBackToStart === false && retreadingSamePath === false && revisitingSmallCave === false) {
                    newPaths.push(`${path},${exit}`);
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
