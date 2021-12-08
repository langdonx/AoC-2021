class Square {
    constructor(n) {
        this.active = false;
        this.value = n;
    }
}

class Board {
    constructor(numbers, size) {
        this.hasBingo = false;
        this.size = size;
        this.squares = numbers.map(n => new Square(n));
    }

    activateSquare(n) {
        for (const square of this.squares) {
            if (square.value === n) {
                square.active = true;

                this.hasBingo = this.determineBingo(); // naming remains the hardest thing in programming

                // surely a square is unique
                break;
            }
        }
    }

    // TODO not necessary
    buildMatrix() {
        return this.squares
            .reduce((squaresMatrix, square, index) => {
                if (index % this.size === 0) {
                    squaresMatrix.push([]);
                }

                squaresMatrix[squaresMatrix.length - 1].push(square);

                return squaresMatrix;
            }, []);
    }

    calculateScore(winningNumber) {
        // Start by finding the sum of all unmarked numbers on that board; in this case, the sum is 188.
        const sumOfInactive = this.squares.reduce((sum, square) => sum + (square.active === true ? 0 : square.value), 0);

        console.log({ sumOfInactive });
        console.log({ winningNumber });
        // Then, multiply that sum by the number that was just called when the board won, 24, to get the final score, 188 * 24 = 4512.
        return sumOfInactive * winningNumber;
    }

    determineBingo() {
        // horizontal bingo?
        for (let y = 0; y < this.squares.length; y += this.size) {
            let numberActiveInRow = 0;

            for (let i = 0; i < this.size; i += 1) {
                if (this.squares[y + i].active === true) {
                    numberActiveInRow += 1;
                }
            }

            if (numberActiveInRow === this.size) {
                return true;
            }
        }

        // vertical bingo?
        for (let x = 0; x < this.size; x += 1) {
            let numberActiveInColumn = 0;

            for (let i = 0; i <= this.squares.length - this.size; i += this.size) {
                if (this.squares[x + i].active === true) {
                    numberActiveInColumn += 1;
                }
            }

            if (numberActiveInColumn === this.size) {
                return true;
            }
        }

        return false;
    }

    displayBoard() {
        // TODO no need to buildMatrix, just use this.squares
        const squaresMatrix = this.buildMatrix();
        for (const row of squaresMatrix) {
            for (const square of row) {
                process.stdout.write(`${square.value}${(square.active ? '!' : '')}`.padEnd(4, ' '));
            }
            process.stdout.write('\n');
        }
    }
}

export default Board;
