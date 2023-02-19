import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 25: https://adventofcode.com/2015/day/25

// Check that the right number of arguments are present in the command
if (process.argv.length !== 3){
  console.log('Please specify an input file.');
  process.exit(1);
}

// Get the file name from the last argv value
const filename = process.argv[2];

// Open the file and pass it ot our main processing 
open(filename)
.then(async(file) => {
  // Process all of the line of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then((fileContents) => { 
  // Parse the input to get the row and col for the code
  let xy = parseInput(fileContents);

  // Find the nth value that would appear in this place in the grid
  let nthVal = findNthValue(xy.row, xy.col);

  // Find the nth code
  let code = calcCode(nthVal);

  // Log output
  console.log('Part 1: ', code);
});

// Parse in the row and colum using reg ex from the first line of the input
const parseInput = (fileContents) => {
  let reg = new RegExp(/row (\d+), column (\d+)/);
  let matches = fileContents[0].match(reg);
  return {row: parseInt(matches[1]), col: parseInt(matches[2])};
}

// Find the nth value that would appear in the position 
// defined by this row and col
const findNthValue = (row, col) => {
  let nthVal = 0;

  // Find the nth value of the first row for the given column by adding n+1 
  // to the value until reaching the spoecified column
  for(let x = 1; x <= col; x++){
    nthVal += x;
  }

  // Find the nth value in the row now that the nth value of the first row 
  // is know by adding the n+1 starting with the column number to the nth 
  // val until reaching the specified column
  for(let y = col, count = 1; count < row; y++, count++){
    nthVal += y;
  }

  return nthVal;
}

// Find the code in the nth position
const calcCode = (nthVal) => {
  // The known starting code
  let code = 20151125;

  // The math to generate the next code from the current one. 
  // Repeat this n number of times specified
  for(let i = 1; i < nthVal; i++){
    code *= 252533;
    code %= 33554393;
  }

  return code;
}