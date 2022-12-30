import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 12: https://adventofcode.com/2015/day/12

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
  // Parse the input's first line as a JSON object
  let input = JSON.parse(fileContents[0]);

  // Find the total for part one
  let total1 = findAndAddNumbers(input, false);

  // Find the total for part two
  let total2 = findAndAddNumbers(input, true);

  // Log output
  console.log(`Total Part 1: ${total1}`);
  console.log(`Total Part 2: ${total2}`);
});

// Fin all of the numbers in the object and add them together. This uses a Breadth First Search (BFS) 
// approach as opposed to a recursive approach since the recursive approach gave a stack overflow error.
const findAndAddNumbers = (input, ignoreRed) => {
  // Total of the numbers so far
  let total = 0;
  // Queue holding the next items to be processed
  let queue = [];
  // If the top level of the input is an object take it's values as an array and add them to the queue
  if(!Array.isArray(input)){
    queue.push(Object.values(input));
  }
  // Else this must be aklready an array of values that can be pushed into the queue
  else{
    queue.push(input);
  }

  // Continue looping while there are still items int he queue to process
  while(queue.length > 0){
    // Take the next item off the front of the queue.
    let arr = queue.shift();
    // This is ensured to be an array of values so loop through them
    for(const item of arr){
      // If this item is a number add it to the total
      if(Number.isInteger(item)){
        total += item;
      }
      // If this istem is a string skip it
      else if(typeof item === 'string'){
        continue;
      }
      // Else this must be an object or an array
      else{
        // If this is an object 
        if(!Array.isArray(item)){
          // If this is ignoring objects with a string value red
          if(ignoreRed){
            let temp = Object.values(item);
            let index = temp.indexOf('red');
            // Only add this value array to the queue if there is no string value red
            if(index === -1)
              queue.push(temp);
          }
          // Else add this objects values to the queue
          else{
            queue.push(Object.values(item));
          }
        }
        // Else this is an array so add it to the queue
        else{
          queue.push(item);
        }
      }
    }
  }
  return total;
}