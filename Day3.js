import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 2: https://adventofcode.com/2022/day/2

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

// Process all of the line of the file after it has been opened
const processLines = async(file) => {

  const priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let totalMatchedItemValues = 0;

  // Read in all of the lines one at a time
  for await (const line of file.readLines()) {
    const compartment1 = line.substring(0, line.length / 2);
    const compartment2 = line.substring(line.length / 2);

    const chars = compartment1.split('');
    let itemsInBoth = null;
    for(let x = 0; x < chars.length && itemsInBoth === null; x++){
      if(compartment2.indexOf(chars[x]) >= 0)
        itemsInBoth = chars[x];
    }

    for(let x = 0; x < itemsInBoth.length; x++){
      totalMatchedItemValues += priorities.indexOf(itemsInBoth[x]) + 1;
    }
  }

  console.log(`Total item priorities in both compartments for all rucksacks: ${totalMatchedItemValues}`);
}