export default class LanterfishSchool {
    constructor(fish) {
        this.fishHash = fish.reduce((hash, age) => {
            hash[age] = (hash[age] || 0) + 1;
            return hash;
        }, {});

        this.dumpFish();
    }

    get size() {
        return Object.values(this.fishHash)
            .reduce((size, f) => size + f, 0);
    }

    dumpFish() {
        process.stdout.write(`After ${this.days} days: `);
        for (const [age, count] of Object.entries(this.fishHash)) {
            for (let i = 0; i < count; i += 1) {
                process.stdout.write(`${age}, `);
            }
        }
        process.stdout.write('\n');
    }

    passDay() {
        this.days += 1;

        let spawn = 0;

        const agedFish = Object.entries(this.fishHash)
            .map((entry) => {
                const [ageHash, count] = entry;
                let age = parseInt(ageHash, 10);

                // if the age has reached zero, set to to 7 so it gets decremented to 6 like the others
                if (age === 0) {
                    age = 7;
                    spawn += count;
                }

                // decrement the ages of all fish
                return [(age - 1).toString(), count];
            });

        // spawn new fish if necessary
        if (spawn > 0) {
            agedFish.push(['8', spawn]);
        }

        // rebuild the fishHash
        this.x = agedFish.reduce((hash, entry) => {
            const [ageHash, count] = entry;
            hash[ageHash] = (hash[ageHash] || 0) + count;
            return hash;
        }, {});
    }
}
