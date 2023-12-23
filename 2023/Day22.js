// Puzzle for Day 22: https://adventofcode.com/2023/day/22

export const run = (fileContents) => {
  // Switch progress logging on an off. This solution takes approximately 8-9
  // minutes to run so this is helpful for seeing the progress.
  let showProgressLogging = false;

  // Parse the input into an array of sand block objects
  let sandBlocks = [];
  for(let line of fileContents){
    // Use regex to get the pertinent information from the input file line
    let matches = line.match(/(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/);
    // Create the start and end point objects
    let start = {x: parseInt(matches[1]), y: parseInt(matches[2]), z: parseInt(matches[3])};
    let end = {x: parseInt(matches[4]), y: parseInt(matches[5]), z: parseInt(matches[6])};

    // Find the number of blocks being added after the first one 
    let xDiff = end.x - start.x;
    let yDiff = end.y - start.y;
    let zDiff = end.z - start.z;
    let blockCounter = Math.abs(xDiff + yDiff + zDiff);

    // Create an array of point objects for the starting position of the current block. 
    // All blocks are assumed to be straight lines. 
    let startBlocks = [];
    let current = JSON.parse(JSON.stringify(start));
    startBlocks.push(current);
    for(let c = 0; c < blockCounter; c++){
      current = JSON.parse(JSON.stringify(current));
      if(xDiff != 0) current.x += xDiff > 0 ? 1 : -1;
      if(yDiff != 0) current.y += yDiff > 0 ? 1 : -1;
      if(zDiff != 0) current.z += zDiff > 0 ? 1 : -1;
      startBlocks.push(current);
    }

    // Find the lowest z-index for this block. This will be used to sort the blocks by starting position
    let lowestZ = startBlocks.reduce((lowest, current) => lowest = current.z < lowest ? current.z : lowest, Number.MAX_SAFE_INTEGER);

    // Add this to the list of total blocks
    sandBlocks.push({name: line, start, end, startBlocks, lowestZ});
  }
  if(showProgressLogging) console.log("Sand Blocks Parsed")
  
  // Order the sand blocks by ascending order of lowest z index
  sandBlocks.sort((a, b) => {
    if(a.lowestZ < b.lowestZ) return -1;
    else if(a.lowestZ > b.lowestZ) return 1;
    else return 0;
  })
  if(showProgressLogging) console.log("Sand Blocks Sorted")

  // Drop each block one level at a time until it either collides with the ground or another resting block
  let restingPositions = new Map();
  for(let sb of sandBlocks){
    // Copy the starting blocks into  new array to move down until they reach their final resting place
    let blocks = JSON.parse(JSON.stringify(sb.startBlocks));
    // Mover down until it can't anymore
    while(canMoveDown(restingPositions, blocks)){
      blocks = blocks.map(b => { return {x: b.x, y: b.y, z: b.z-1} });
    }
    // Set this array as the final resting place of the blocks points
    sb.finalBlocks = blocks;
    // Add these points to the map of points that have stopped moving
    for(let b of blocks){
      restingPositions.set(JSON.stringify(b), sb.name);
    }
  }
  if(showProgressLogging) console.log("Sand Blocks Stacked")

  // Find solutions for parts 1 and 2
  let safeToRemove = [];
  let allOtherBricks = 0;
  // Check each block starting at the bottom and move up
  for(let a = 0; a < sandBlocks.length; a++){
    if(showProgressLogging) console.log("Checking Block:", a, sandBlocks[a].name);
    // Create a map of the resting locations map to work with
    let testRestingPositions = new Map(restingPositions);
    // Delete the points of the current block from the map of resting points
    for(let bl of sandBlocks[a].finalBlocks){
      testRestingPositions.delete(JSON.stringify(bl));
    }

    let chainReaction = 0;
    // Check for chain reactions
    for(let b = a+1; b < sandBlocks.length; b++){
      // If the sand block can move down remove it from the map and add one to the chain reaction number
      if(canMoveDown(testRestingPositions, sandBlocks[b].finalBlocks)){
        chainReaction++;
        for(let bl of sandBlocks[b].finalBlocks){
          testRestingPositions.delete(JSON.stringify(bl));
        }
      }

    }
    // If a chain reaction happened add this to the array of safe blocks to remove
    if(chainReaction == 0){
      safeToRemove.push(sandBlocks[a].name);
    }
    // Add the number of other blocks affected to the total
    allOtherBricks += chainReaction;
  }

  let result1 = safeToRemove.length;

  return {part1: result1, part2: allOtherBricks};
}

/**
 * Check if a block can move down given the map of resting blocks and the array of points for the current block
 * @param {Map} restingPositions 
 * @param {{x:number, y: number, z: number}[]} blocks 
 * @returns 
 */
const canMoveDown = (restingPositions, blocks) => {
  // Copy the blocks array and the resting positions map
  let newBlocks = blocks.map(b => { return {x: b.x, y: b.y, z: b.z-1} });
  let testRestingPositions = new Map(restingPositions);
  // Delete the current blocks points from the map To avoid vertical blocks from detecting collisions with their former selves
  for(let b of blocks){
    testRestingPositions.delete(JSON.stringify(b));
  }
  // Check if each new blocks position is in the current map of points. If not then this block can move
  let collision = false;
  for(let nb = 0; nb < newBlocks.length && !collision; nb++){
    collision = testRestingPositions.has(JSON.stringify(newBlocks[nb])) || newBlocks[nb].z <= 0;
  }
  return !collision;
}