// Puzzle for Day 6: https://adventofcode.com/2017/day/6

export const run = (fileContents) => {
  // Parse all of the individual numbers into ints in an array
  let reg = new RegExp(/(\d+)/g);
  let blocks = fileContents[0].match(reg).map(x => parseInt(x));

  // Count the number of cycles needed to find a 
  // repeating state and the cycle size
  let results = countCycles(blocks);

  return {part1: results.cycles, part2: results.cycleSize};
}

// Count the number of cycles needed to find a 
// repeating state and the cycle size 
const countCycles = (blocks) => {
  // Keep track of the states that have been seen 
  // and what cycle they were seen at
  let seenStates = new Map();
  // The current cycle
  let cycles = 0;

  // Continue until a state that has been seen already is seen again
  while(!seenStates.has(blocks.join(','))){
    // Add this state to the seen states
    seenStates.set(blocks.join(','), cycles);

    // Find the blocks with the highest amount ties being won by the lower index
    let highestIndex = -1;
    let highestValue = 0;
    for(let x = 0; x < blocks.length; x++){
      if(blocks[x] > highestValue){
        highestValue = blocks[x];
        highestIndex = x;
      }
    }

    // Redistribute the info in that block to the rest of the array
    let stackSize = blocks[highestIndex];
    blocks[highestIndex] = 0;
    for(let x = highestIndex+1; stackSize > 0; x++){
      // If the last block in the array is found go back to the starting block
      if (x === blocks.length)
        x = 0;
      
        // Add to the current block and remove from the stack to be placed
      blocks[x]++;
      stackSize--;
    }
    // Increment the number of cycles
    cycles++;
  }
  // Find the cycle size by subtracting the cycle when this was 
  // first seen from the current cycle
  let cycleLastSeen = seenStates.get(blocks.join(','));
  return {cycles, cycleSize: cycles - cycleLastSeen};
} 