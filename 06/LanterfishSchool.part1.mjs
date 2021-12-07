export default class LanterfishSchool {
    constructor(fish) {
        this.fish = fish;
    }

    get size() {
        return this.fish.length;
    }

    passDay() {
        this.fish.forEach((_, i) => {
            if (this.fish[i] === 0) {
                this.fish[i] = 6;
                this.fish.push(8);
            }
            else {
                this.fish[i] -= 1;
            }
        });
    }
}
