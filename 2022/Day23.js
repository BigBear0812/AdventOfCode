// Puzzle for Day 23: https://adventofcode.com/2022/day/23

export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return {part1: result1, part2: result2};
}

const part1 = (fileContents) => {
  // Parse input into a hash set of the elves locations
  let elves = parseInput(fileContents);

  // Run the simulation for 10 round for Part 1
  runSimulationPart1(elves, 10);

  // Count the number of empty spaces in the grid
  let totalEmpty = countEmptySpaces(elves);

  return totalEmpty;
}

const part2 = (fileContents) => {
  // Parse input into a hash set of the elves locations
  let elves = parseInput(fileContents);

  // Find the first round that no elf moves any longer
  let finalRound = runSimulationPart2(elves);

  return finalRound;
}

// Parse the elves starting locations into a has set.
const parseInput = (fileContents) => {
  let elves = new Set();
  // Check each line of the input
  for(let y = 0; y < fileContents.length; y++){
    // Split into individual characters
    let line = fileContents[y].split('');
    // Check each on for if it is an elf
    for(let x = 0; x < line.length; x++){
      // If it is an elf add it to the hash set
      let char = line[x];
      if(char === '#'){
        elves.add(`${x},${y}`);
      }
    }
  }
  return elves;
}

// Run the simulation for Part 1 for the given number of rounds
const runSimulationPart1 = (elves, rounds) => {
  // Starting consideration directions
  let directions = ['N', 'S', 'W', 'E'];

  // Run for a specific number of rounds
  for(let r = 0; r < rounds; r++){
    simulateOneRound(elves, directions);

    // Rotate the direction values
    let rotatedDir = directions.shift();
    directions.push(rotatedDir);
  }
}

// Run the simulation for Part 2 until the elves have a round where no one moves
const runSimulationPart2 = (elves) => {
  // Starting consideration directions
  let directions = ['N', 'S', 'W', 'E'];

  // Run until the elves stop
  let elvesStopped = false;
  for(let r = 0; !elvesStopped; r++){
    elvesStopped = simulateOneRound(elves, directions);
    // If the elves stop return the round number plus 1 since rounds do not count starting at 0
    if(elvesStopped)
      return r + 1;

    // Rotate the directions
    let rotatedDir = directions.shift();
    directions.push(rotatedDir);
  }
}

// Simulate the elves changing positions given their current set of positions 
// and the order in which to consider each direction
const simulateOneRound = (elves, directions) => {
  // A hash map for mapping elves current positions to their proposed new positions
  let nextPos = new Map();

  // Check each elf to see if they will move this round to a new position or staty put
  elves.forEach((value) => {
    // Get current cordinates and coordinates for all surrounding points
    let coord = value.split(',').map(i => parseInt(i));
    let nw = `${coord[0]-1},${coord[1]-1}`;
    let n = `${coord[0]},${coord[1]-1}`;
    let ne = `${coord[0]+1},${coord[1]-1}`;
    let e = `${coord[0]+1},${coord[1]}`;
    let w = `${coord[0]-1},${coord[1]}`;
    let sw = `${coord[0]-1},${coord[1]+1}`;
    let s = `${coord[0]},${coord[1]+1}`;
    let se = `${coord[0]+1},${coord[1]+1}`;

    // Check each each surrounding point for an elf that is occupying it
    let hasNW = elves.has(nw);
    let hasN = elves.has(n);
    let hasNE = elves.has(ne);
    let hasE = elves.has(e);
    let hasW = elves.has(w);
    let hasSW = elves.has(sw);
    let hasS = elves.has(s);
    let hasSE = elves.has(se);

    // If the elf has at least one adjacent elf consider moving them
    if(hasNW || hasN || hasNE || hasE || hasW || hasSW || hasS || hasSE){
      // Consider each direction in the order specified
      let foundDirection = false;
      for(let d = 0; d < directions.length && !foundDirection; d++){
        let dir = directions[d];
        // Consider North
        if(dir === 'N'){
          // If this direciton is clear
          if(!hasNW && !hasN && !hasNE){
            foundDirection = true;
            // If a collision was found delete the other elf's move and don't 
            // add one for this elf. Both elves will not move this round
            if(nextPos.has(n)){
              nextPos.delete(n);
            }
            // Add the elf's next position
            else{
              nextPos.set(n, value);
            }
          }
        }
        // Consider South
        else if(dir === 'S'){
          // If this direciton is clear
          if(!hasSW && !hasS && !hasSE){
            foundDirection = true;
            // If a collision was found delete the other elf's move and don't 
            // add one for this elf. Both elves will not move this round
            if(nextPos.has(s)){
              nextPos.delete(s);
            }
            // Add the elf's next position
            else{
              nextPos.set(s, value);
            }
          }
        }
        // Consider West
        else if(dir === 'W'){
          // If this direciton is clear
          if(!hasNW && !hasW && !hasSW){
            foundDirection = true;
            // If a collision was found delete the other elf's move and don't 
            // add one for this elf. Both elves will not move this round
            if(nextPos.has(w)){
              nextPos.delete(w);
            }
            // Add the elf's next position
            else{
              nextPos.set(w, value);
            }
          }
        }
        // Consider East
        else if(dir === 'E'){
          // If this direciton is clear
          if(!hasNE && !hasE && !hasSE){
            foundDirection = true;
            // If a collision was found delete the other elf's move and don't 
            // add one for this elf. Both elves will not move this round
            if(nextPos.has(e)){
              nextPos.delete(e);
            }
            // Add the elf's next position
            else{
              nextPos.set(e, value);
            }
          }
        }
      }
    }
  });

  // Check if the next position array is empty. If so this means 
  // no elf will make a move this round
  if(nextPos.size === 0)
    return true;

  // Move each elf to it's new position by deleting it's old position 
  // and adding it's new position the the elf hash set
  nextPos.forEach((value, key) => {
    elves.delete(value);
    elves.add(key);
  })

  // Elves have not stopped moving
  return false;
}

// Counts the number of empty spaces for the grid of elves
const countEmptySpaces = (elves) => {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  // Check each elf to see if their position changes the minX, minY, maxX, or maxY values
  elves.forEach((value) => {
    let coord = value.split(',').map(i => parseInt(i));
    minX = Math.min(minX, coord[0]);
    minY = Math.min(minY, coord[1]);
    maxX = Math.max(maxX, coord[0]);
    maxY = Math.max(maxY, coord[1]);
  })

  // Using the min and max values check each pair of coordinates 
  // to see if an elf is in that position
  let totalEmpty = 0;
  for(let y = minY; y <= maxY; y++){
    for(let x = minX; x <= maxX; x++){
      // If no elf is in this position add 1 to the total number of empty spaces
      if (!elves.has(`${x},${y}`))
        totalEmpty++;
    }
  }

  return totalEmpty;
}

// Print method used to print the elves hash set to the console during testing
const print = (elves) => {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  // Check each elf to see if their position changes the minX, minY, maxX, or maxY values
  elves.forEach((value) => {
    let coord = value.split(',').map(i => parseInt(i));
    minX = Math.min(minX, coord[0]);
    minY = Math.min(minY, coord[1]);
    maxX = Math.max(maxX, coord[0]);
    maxY = Math.max(maxY, coord[1]);
  })

  // Check each pair of coordinates to see if there is an elf in that position. 
  // If there is print # else print . like the example
  for(let y = minY; y <= maxY; y++){
    let line = '';
    for(let x = minX; x <= maxX; x++){
      if (!elves.has(`${x},${y}`))
        line += '.';
      else
        line += '#';
    }
    console.log(line);
  }
}