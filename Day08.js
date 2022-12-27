import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 8: https://adventofcode.com/2015/day/8

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
  // Collect the totals for the original code string lengths, 
  // memory string lengths, and encoded string lengths
  let codeTotal = 0;
  let memoryTotal = 0;
  let encodedTotal = 0;
  // Iterate through each line of the file which has one string per line
  for(const line of fileContents){
    // Original code length of the string written as it is in the file
    let codeLength = line.length;
    // Memory length of the string once read into memory
    let memoryLength = eval(line).length;
    // Encoded length of the string once run thorugh JSON string encoding
    let encodedLength = JSON.stringify(String.raw`${line}`).length;
    // Add lengths to the totals
    codeTotal += codeLength;
    memoryTotal += memoryLength;
    encodedTotal += encodedLength;
  }

  // Log output for Parts 1 and 2
  console.log(`Part1: ${codeTotal - memoryTotal}`);
  console.log(`Part2: ${encodedTotal - codeTotal}`);
});