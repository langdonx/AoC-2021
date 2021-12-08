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

let boardWithBingo = null;
let winningNumber = 0;

// iterate through numbers, and activate them on each board
for (const n of numbers) {
    for (const board of boards) {
        board.activateSquare(n);

        // if the board has bingo, keep track of some stuff, and stop looping
        if (board.hasBingo === true) {
            boardWithBingo = board;
            winningNumber = n;
            break;
        }
    }

    // we have a board w/ bingo, no need to continue
    if (boardWithBingo !== null) {
        break;
    }
}

if (boardWithBingo === null) {
    console.log('Nobody ever got bingo. Somehow..');
}
else {
    console.log('Bingo on this board:');
    boardWithBingo.displayBoard();
    const score = boardWithBingo.calculateScore(winningNumber);

    console.log(`The winning score is ${score}.`)
}
