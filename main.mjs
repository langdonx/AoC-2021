import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { exec } from 'child_process';

const days = fs
    .readdirSync('.')
    .filter(dir => dir.match(/\d+/))
    .map((day) => {
        const parts = fs
            .readdirSync(`./${day}`)
            .map((file) => {
                const matches = file.match(/part([\d-]+7)\.mjs$/);
                return matches ? matches[1] : null;
            })
            .filter(part => part)
            .map(part => parseInt(part, 10));

        return { day: parseInt(day, 10), parts };
    });

const maxDay = days.reduce((p, d) => (d.day > p ? d.day : p), 0)

const rli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rli.question(`Choose a Day (1-${maxDay}): `, (dayChoice) => {
    const day = days.filter(d => d.day === parseInt(dayChoice, 10))[0];

    rli.question(`Choose a Part (${day.parts.join(', ')}): `, (partChoice) => {
        const dayDir = dayChoice.padStart(2, '0');

        const cwd = `${path.resolve()}/${dayDir}`;
        const command = `node day${dayDir}-part${partChoice}.mjs`;

        exec(command, { cwd }, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
        });

        rli.close();
    });
});
