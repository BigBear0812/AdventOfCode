import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 24: https://adventofcode.com/2022/day/24

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
  // Process all of the lines of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then((fileContents) => {
  // Parse input for blizzard positions, start, end, maxX, and maxY
  let input = parseInput(fileContents);

  // Find trip 1 time from start to end
  let trip1 = searchBestPath({x: input.start.x, y: input.start.y, blizzards: input.blizzards}, input.end, input.x, input.y); 
  
  // Log output
  console.log(`Total time for Part 1: ${trip1.time}`);

  // Go back to start from the end based on the blizzard configuration from the end of trip1
  let trip2 = searchBestPath({x: trip1.x, y: trip1.y, blizzards : trip1.blizzards}, input.start, input.x, input.y);

  // Return the the end one more time from start based on the blizzard configuration of trip 2
  let trip3 = searchBestPath({x: trip2.x, y: trip2.y, blizzards : trip2.blizzards}, input.end, input.x, input.y);

  // Log output
  console.log(`Total time for Part 2: ${trip1.time + trip2.time + trip3.time}`)
});

// Use Breadth First Search (BFS) to find the shortest path through the blizzard field
const searchBestPath = (start, end, maxX, maxY) => {
  // Queue of the next states to examine
  let queue = [];
  // Set of states that have previously been examined. 
  let seen = new Set();
  // Set time to 0 for the initial state
  start.time = 0;
  // Add that start to the queue
  queue.push(start);

  // While there are still states to check through
  while(queue.length > 0){
    // Take the next state off the front of the queue
    let current = queue.shift();

    // Get an id for this state x,y,time. Add to the set if it has not already 
    // been seen otherwise skip this evaluation
    let uniqueId = `${current.x},${current.y},${current.time}`;
    if(seen.has(uniqueId))
      continue;
    seen.add(uniqueId);

    // Check if this state is located at the end point. If so return it
    if(current.x === end.x && current.y === end.y)
      return current;

    // Otherwise get the next possible states for this current state. Set their time 
    // values and add them to the back of the queue
    for(const next of getNextValidMoves(current, maxX, maxY, start, end)){
      next.time = current.time + 1;
      queue.push(next);
    }
  }
}

// Determines what next states are possible from the current state. Also updates the 
// blizzard configuration for the next states being generated.
const getNextValidMoves = (current, maxX, maxY, start, end) => {
  // Set for the new blizzard positions
  let updatedBlizzards = new Set();

  // Evaluate the new position of each current blizard
  current.blizzards.forEach((value, key, set) => {
    // Get the x, y and directions for the blizzard
    const parsed = value.split(',');
    let x = parseInt(parsed[0]);
    let y = parseInt(parsed[1]);
    const dir = parsed[2];

    // Find the new X and Y values for this blizzard
    let newX;
    let newY;
    if(dir === '^'){
      newY = y - 1;
      newX = x;
      if(newY === 0){
        newY = maxY - 1;
      }
    }
    else if(dir === '<'){
      newX = x - 1;
      newY = y;
      if(newX === 0){
        newX = maxX - 1;
      }
    }
    else if(dir === '>'){
      newX = x + 1;
      newY = y;
      if(newX === maxX){
        newX = 1;
      }
    }
    else if(dir === 'v'){
      newY = y + 1;
      newX = x;
      if(newY === maxY){
        newY = 1;
      }
    }

    // Add the new coordinates to the new blizzard set
    updatedBlizzards.add(`${newX},${newY},${dir}`);
  })

  // Get each set of new coordinates for all possible next moves
  let up = {x: current.x, y: current.y - 1, blizzards: updatedBlizzards};
  let left = {x: current.x - 1, y: current.y, blizzards: updatedBlizzards};
  let right = {x: current.x + 1, y: current.y, blizzards: updatedBlizzards};
  let down = {x: current.x, y: current.y + 1, blizzards: updatedBlizzards};
  let wait = {x: current.x, y: current.y, blizzards: updatedBlizzards};

  // Check each new position to see if it can be moved to
  let canMoveUp = (up.x === start.x && up.y === start.y)
    || (up.x === end.x && up.y === end.y)
    || !updatedBlizzards.has(`${up.x},${up.y},^`) 
    && !updatedBlizzards.has(`${up.x},${up.y},<`)
    && !updatedBlizzards.has(`${up.x},${up.y},>`)
    && !updatedBlizzards.has(`${up.x},${up.y},v`)
    && up.y > 0 && up.y < maxY && up.x > 0 && up.x < maxX;
  let canMoveLeft = !updatedBlizzards.has(`${left.x},${left.y},^`) 
    && !updatedBlizzards.has(`${left.x},${left.y},<`)
    && !updatedBlizzards.has(`${left.x},${left.y},>`)
    && !updatedBlizzards.has(`${left.x},${left.y},v`)
    && left.y > 0 && left.y < maxY && left.x > 0 && left.x < maxX;
  let canMoveRight = !updatedBlizzards.has(`${right.x},${right.y},^`) 
    && !updatedBlizzards.has(`${right.x},${right.y},<`)
    && !updatedBlizzards.has(`${right.x},${right.y},>`)
    && !updatedBlizzards.has(`${right.x},${right.y},v`)
    && right.y > 0 && right.y < maxY && right.x > 0 && right.x < maxX;
  let canMoveDown = (down.x === start.x && down.y === start.y)
    || (down.x === end.x && down.y === end.y)
    ||!updatedBlizzards.has(`${down.x},${down.y},^`) 
    && !updatedBlizzards.has(`${down.x},${down.y},<`)
    && !updatedBlizzards.has(`${down.x},${down.y},>`)
    && !updatedBlizzards.has(`${down.x},${down.y},v`)
    && down.y > 0 && down.y < maxY && down.x > 0 && down.x < maxX;
  let canWait = !updatedBlizzards.has(`${wait.x},${wait.y},^`) 
    && !updatedBlizzards.has(`${wait.x},${wait.y},<`)
    && !updatedBlizzards.has(`${wait.x},${wait.y},>`)
    && !updatedBlizzards.has(`${wait.x},${wait.y},v`);

  // Only add new positions that can be moved into the result
  let result = [];
  if(canMoveDown)
    result.push(down);
  if(canMoveRight)
    result.push(right);
  if(canMoveLeft)
    result.push(left);
  if(canMoveUp)
    result.push(up);
  if(canWait)
    result.push(wait);
  return result;
}

// Parse the input
const parseInput = (fileContents) => {
  let blizzards = new Set();
  let start = {};
  let end = {};
  let y;
  let x;
  // Check each position in the map
  for(y = 0; y < fileContents.length; y++){
    const line = fileContents[y].split('');
    for(x = 0; x < line.length; x++){
      const char = line[x];
      // Record the start on the first line
      if(y === 0 && char === '.'){
        start.x = x;
        start.y = y;
      }
      // Record the end in the last line
      else if(y === fileContents.length - 1 && char === '.'){
        end.x = x;
        end.y = y;
      }
      // Otherwise check for blizzards and add them to the set of blizzards inital positions
      else if(char === '>' || char === '<' || char === '^' || char === 'v'){
        blizzards.add(`${x},${y},${char}`);
      }
    }
  }
  return {blizzards, start, end, x: x - 1, y: y - 1};
}