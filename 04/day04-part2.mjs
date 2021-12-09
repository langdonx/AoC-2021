import { readFileSync } from 'fs';
import Board from './Bingo.mjs';

const input = readFileSync('./input', 'utf-8');

// parse randomly generated bingo numbers
const numbers = input
    .split('\n')
    .shift()
    .split(',')
    .map(n => parseInt(n, 10));

// parse bingo boards
const boardInput = input.substring(input.indexOf('\n\n') + 2);

const boards = boardInput
    .split('\n\n')
    .map((squaresInput) => {
        const squares = squaresInput
            .match(/(\d+)/g)
            .map(n => parseInt(n, 10));

        return new Board(squares, 5);
    });

let finalWinningNumber = 0;
let losingBoard = null;

// iterate through numbers, and activate them on each board
for (const n of numbers) {
    for (const board of boards) {
        // no need to further activate squares on boards that have already won
        if (board.hasBingo === false) {
            board.activateSquare(n);

            // if the board has bingo, keep track of it
            if (board.hasBingo === true) {
                // if this is the final board to achieve bingo, take note and stop looping
                const numberOfWinningBoards = boards.filter(b => b.hasBingo === true).length;
                if (numberOfWinningBoards === boards.length) {
                    finalWinningNumber = n;
                    losingBoard = board;
                    break;
                }
            }
        }
    }

    // we have determined the final winner, no need to continue
    if (losingBoard !== null) {
        break;
    }
}

console.log('Final bingo on this board:');
losingBoard.displayBoard();
const score = losingBoard.calculateScore(finalWinningNumber);

console.log(`The score is ${score}.`);
