import process from "node:process";
import { open } from "node:fs/promises";
import { createHash } from 'node:crypto'

// Puzzle for Day 4: https://adventofcode.com/2015/day/4

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
  // Setup variables
  let secret = fileContents[0];//'bgvyzdsv';
  let found5Zeros = null;
  let found6Zeros = null;

  // Iterate through all number until finding one starting with 5 and one with 6 zero's
  for(let x = 0; found5Zeros === null || found6Zeros === null ; x ++){
    const hash = createHash('md5').update(secret + x).digest('hex');
    if(found5Zeros === null && hash.substring(0,5) === '00000')
      found5Zeros = x;
    if(found6Zeros === null && hash.substring(0,6) === '000000')
      found6Zeros = x;
  }

  // Log output
  console.log(`Lowest positive number for 5 zero hash: ${found5Zeros}`);
  console.log(`Lowest positive number for 6 zero hash: ${found6Zeros}`);
});