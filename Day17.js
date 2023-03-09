import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 17: https://adventofcode.com/2015/day/17

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
  // Parse all containers avlues into anarray of integers
  let containers = parseInput(fileContents);

  // Find all possible combinations that exactly match the amount of eggnog
  let combinations = findAllCombinations(containers, 150);

  // Log output
  console.log('Part 1:', combinations.length);

  // Find the number of container combinations that all 
  // use the minimum number of containers possible

  // Length of the minimum number of containers arrays
  let minComboLength = Number.MAX_SAFE_INTEGER;
  // Count of the number of minimum length containers there are
  let minComboCount = 0;
  // Check each cmobinations
  for(let x = 0; x < combinations.length; x++){
    // If this combination's legnth is smaller than any found before, 
    // set this length as the new length and reset the count to 1
    if(minComboLength > combinations[x].length){
      minComboLength = combinations[x].length;
      minComboCount = 1;
    }
    // Else if this combination's length equals the minimum length 
    // found then add one to the count
    else if(minComboLength === combinations[x].length){
      minComboCount++;
    }
  }

  // Log output
  console.log('Part 2:', minComboCount);
});

// Parse input values into an array of integers
const parseInput = (fileContents) => {
  // Resulting array of containers
  let containers = [];
  // Parse each line as an int
  for(let container of fileContents){
    containers.push(parseInt(container));
  }
  return containers;
}

// Find all of the combinations of containers that eaxctly match the maxSize
const findAllCombinations = (containers, maxSize) => {
  // Resulting unique combinations
  let combos = [];
  // Order the containers first with a bubble sort to get all numbers in ascending order
  bubbleSort(containers);

  // A queue of next possible combinations to be considered
  let queue = [];
  // The first combo for the queue which has nothing used
  queue.push({
    unused: JSON.parse(JSON.stringify(containers)),
    used: []
  });
  // Continue checking combos in the queue until there are none left to consider
  while(queue.length > 0){
    // Take the first combo off the front of the queue
    let current = queue.shift();
    // Find the total amount used by these containers
    let totalUsed = current.used.reduce((accumulator, val) => accumulator + val, 0);
    // If it is less add new combos to the queue
    if(totalUsed < maxSize){
      // Continue while there are still unused contsiners to consider
      while(current.unused.length > 0){
        // Add the next unused container to a new combo's 
        // used container list. Add the remaining unused 
        // containers to the new combo's unused list.
        // Add this new combo to the queue
        let nextItem = current.unused.shift();
        let newUnused = JSON.parse(JSON.stringify(current.unused)) ?? [];
        let newUsed = JSON.parse(JSON.stringify(current.used)) ?? [];
        newUsed.push(nextItem);
        queue.push({
          unused: newUnused,
          used: newUsed
        });
      }
    }
    // Else if the total equals the maxSize add this combination to the results array
    else if(totalUsed === maxSize){
      combos.push(current.used);
    }
  }
  return combos;
}

// Basic bubble sorting algorithm
const bubbleSort = (array) => {
  for(let x = 0; x < array.length - 1; x++){
    for(let y = 0; y < array.length - x - 1; y++){
      if (array[y] < array[y + 1])
        swap(array, y, y + 1);
    }
  }
}

// Basic swap method
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
}