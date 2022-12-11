import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 1: https://adventofcode.com/2015/day/1

// Check that the right number of arguments are present in the command
if (process.argv.length !== 3){
  console.log('Please specify an input file.');
  process.exit(1);
}

// Get the file name from the last argv value
const filename = process.argv[2];

// Open the file and pass it ot our main processing 
open(filename)
.then(file => {
  processLines(file)
});

const processLines = async(file) => {
  // Each floor defined by each line of the input
  let floors = [];

  // Read in all of the lines one at a time
  for await (const line of file.readLines()) {
    const chars = Array.from(String(line))
    // Start at floor 0 
    let currentFloor = 0;
    let firstCharNegative = null;
    for (let x = 0; x < chars.length; x++) {
      const c = chars[x];
      // Move up or down the floors
      if(c === '(')
        currentFloor++;
      if(c === ')')
        currentFloor--;
      // Check if the floor number has gone negative mfor the first time
      if(currentFloor < 0 && firstCharNegative === null)
        firstCharNegative = x + 1;
    }
    // Pass out values
    floors.push({ 'currentFloor': currentFloor, 'firstCharNegative': firstCharNegative });
  }

  // Log output
  console.log(`Floors Santa must visit floor: ${floors[0].currentFloor}`);
  console.log(`First char to send the floor number negative: ${floors[0].firstCharNegative}`);
}