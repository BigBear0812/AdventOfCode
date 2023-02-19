import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 16: https://adventofcode.com/2015/day/16

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
  // Sample info provided by the puzzle
  const sample = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1,
  }

  // Parse all Aunts Sue info into objects
  let sues = parseInput(fileContents);

  // Find Aunt Sue matching Part 1's scenario
  let match = findMatchingSuePart1(sues, sample);

  // Log output
  console.log('Part1:', match);

  // Find Aunt Sue matching Part 2's scenario
  let match2 = findMatchingSuePart2(sues, sample);

  // Log output
  console.log('Part2:', match2);

});

// Parse each line of the input as a new Aunt Sue object
const parseInput = (fileContents) => {
  // Regex for parsing each Aunt's info
  let reg = new RegExp(/(\w+ \d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)/);
  // All Aunt Sue's
  let sues = [];
  for(let sueText of fileContents){
    let matches = sueText.match(reg);
    // Create new object and add each property to the object. 
    // Properties not added will result in undefined
    let sue = {};
    sue.name = matches[1];
    sue[matches[2]] = parseInt(matches[3]);
    sue[matches[4]] = parseInt(matches[5]);
    sue[matches[6]] = parseInt(matches[7]);
    sues.push(sue);
  }
  return sues;
}

// Find Aunt Sue matching Part 1's criteria
const findMatchingSuePart1 = (sues, sample) => {
  // Check each Aunt Sue
  for(let sue of sues){
    // Assume all defined properties will match 
    let matchesAll = true;
    // Check each property in the sample
    for(let property in sample){
      // If the matchesAll assumption is still true and 
      // the Aunt Sue has this property defined and they 
      // are not equal values set matchesAll to false
      if(matchesAll && sue[property] !== undefined && sue[property] !== sample[property]){
        matchesAll = false;
      }
    }

    // If the matchesAll assumption is still true this must be the result
    if (matchesAll){
      return sue.name;
    }
  }
}

// Find Aunt Sue matching Part 2's criteria
const findMatchingSuePart2 = (sues, sample) => {
  // Check each Aunt Sue
  for(let sue of sues){
    // Assume all defined properties will match 
    let matchesAll = true;
    // Check each property in the sample
    for(let property in sample){
      // If the matchesAll assumption is still true and 
      // the Aunt Sue has this property defined and they 
      if(matchesAll && sue[property] !== undefined){
        // If the property is cats or trees
        if(property === 'cats' || property === 'trees'){
          // If this Aunt Sue's value is not greater than the sample set matchesAll to false
          if(!(sue[property] > sample[property])){
            matchesAll = false;
          }
        }
        // If this property is pomeranians or goldfish
        else if(property === 'pomeranians' || property === 'goldfish'){
          // If this Aunt Sue's value is not less than the sample set matchesAll to false
          if(!(sue[property] < sample[property])){
            matchesAll = false;
          }
        }
        // If this property exists and is not equal in value to the sample set matchesAll to false
        else if(sue[property] !== sample[property]){
          matchesAll = false;
        }
      }
    }

    // If the matchesAll assumption is still true this must be the result
    if (matchesAll){
      return sue.name;
    }
  }
}