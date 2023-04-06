// Puzzle for Day 12: https://adventofcode.com/2015/day/12

export const run = (fileContents) => {
  // Parse the input's first line as a JSON object
  let input = JSON.parse(fileContents[0]);

  // Find the total for part one
  let total1 = findAndAddNumbers(input, false);

  // Find the total for part two
  let total2 = findAndAddNumbers(input, true);

  return{part1: total1, part2: total2};
}

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