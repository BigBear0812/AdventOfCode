// Puzzle for Day 06: https://adventofcode.com/2024/day/6
import { Worker, isMainThread, parentPort, workerData} from "node:worker_threads"

// Set the max number of worker threads to use for part 2
const WORKER_THREADS = 15;

export const run = async (fileContents) => {
  // Parse the input data into a map and a starting position with direction
  let data = parseInput(fileContents);
  // Get a set of the visited spaces of the first simulation
  let result1 = part1(data.map, data.position);
  // Use a multi-threaded solution to get the total number of loops it is possible to make
  let result2 = await part2(data.map, data.position, result1);
  return {part1: result1.size, part2: result2};
}

/**
 * Part 2 Solution
 * @param {string[][]} map A 2D array representing the map of the room and the obstacles
 * @param {{y: number, x: number, direction: string}} position The current starting position of the guard
 * @param {Set()} visitedSet The spaces the guard will visit if left unchanged 
 * @returns {number}
 */
const part2 = async (map, position, visitedSet) => {
  // Convert the visited spaces set into an array to iterate over
  let visitedArray = Array.from(visitedSet, (val) => {
    // Split strings into 2 numbers and parse them as integers
    let splits = val.split(",").map(num => parseInt(num));
    // Create the location object
    return{y: splits[0], x: splits[1]};
  });

  // Save the total number of loops that are detected
  let countLoops = 0;
  // Find the length of the segments that the worker processes will have to handle
  let segmentLength = Math.floor(visitedArray.length / WORKER_THREADS);
  // Save the visited array into segments. One for each worker thread
  let visitSegments = [];
  // Split the array into equal length segments
  for(let s = 0; s < WORKER_THREADS; s++){
    // If not the last segment
    if(s < WORKER_THREADS-1)
      //Splice off the correct length of items
      visitSegments.push(visitedArray.splice(0, segmentLength));
    // Otherwise take the remaining number of items regardless 
    // of how many are left. This ensures no possibilities are missed
    else
      visitSegments.push(visitedArray);
  }

  // Create a promise with a worker thread for each segment
  let visitPromises = visitSegments.map((visits) => {
    return new Promise((resolve, reject) => {
      // The worker will execute this file with the segments 
      // specific visits passed into it
      const worker = new Worker('./2024/Day06.js', {
        workerData: {map, position, visits}
      })
      // When successfully completed
      worker.on('message', (totalLoops) => {
        // Add the threads total number of loops to the grand 
        // total and resolve the promise.
        countLoops += totalLoops;
        resolve();
      });
      // Handle errors and unexpected exits
      worker.on('error', (error) => reject(error));
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    })
  });

  // Await all of the promises with their worker threads to complete.
  // Log out any errors that occur when running the worker threads.
  await Promise.all(visitPromises).catch((error) => {console.log(error)});
  return countLoops;
}

/**
 * Part 1 Solution
 * @param {string[][]} map A 2D array representing the map of the room and the obstacles
 * @param {{y: number, x: number, direction: string}} position The current starting position of the guard
 * @returns 
 */
const part1 = (map, position) => {
  // Clone the map  and position to avoid needing 
  // to reparse it from the file
  let clonedMap = JSON.parse(JSON.stringify(map));
  let clonedPosition = JSON.parse(JSON.stringify(position));
  
  // Run the simulation of the guard until it completes
  let output = runSimulation(clonedMap, clonedPosition);
  // Return the set of visited spaces since its size is the 
  // answer to part 1 and the visited space make up the set 
  // of possible places to put obstacles in part 2.
  return output.visited;
}

/**
 * Run a simulation with the given starting position and map
 * @param {string[][]} map A 2D array representing the map of the room and the obstacles
 * @param {{y: number, x: number, direction: string}} position The current starting position of the guard
 * @returns {visited: Set(), loopDetected: boolean} This returns the set of visited spaces and if a loop was detected
 */
const runSimulation = (map, position) => {
  // Track the unique space visited during the simulation
  let visited = new Set();
  // Add the starting location to this set
  visited.add(`${position.y},${position.x}`);
  // Track the location and direction traveled. If this repeats it means a loop had been detected
  let loopFinding = new Set();
  // Add the starting position and direction to this set.
  loopFinding.add(`${position.y},${position.x},${position.direction}`);

  // Assume no loop has been detected
  let loopDetected = false;
  // Assume the starting position is not already on the edge leaving the map
  let canMove = true;
  // WHile still able to move and no loop has been detected continue the simulation
  while(canMove && !loopDetected){
    // The new y and x values depending on the current direction of travel
    let newY;
    let newX;
    // Up
    if(position.direction === '^'){
      newY = position.y-1;
      newX = position.x;
    }
    // Right
    else if(position.direction === '>'){
      newY = position.y;
      newX = position.x+1;
    }
    // Down
    else if(position.direction === 'v'){
      newY = position.y+1;
      newX = position.x;
    }
    // Left
    else if(position.direction === '<'){
      newY = position.y;
      newX = position.x-1;
    }

    // If the new position is not outside of the map bounds then the guard can keep moving
    if(newY < 0 || newY >= map.length || newX < 0 || newX >= map[newY].length){
      canMove = false;
    }
    // Else if the new location is an obstacle change direction
    else if(map[newY][newX] === '#'){
      // Up becomes right
      if(position.direction === '^')
        position.direction = '>';
      // Right becomes down
      else if(position.direction === '>')
        position.direction = 'v';
      // Down becomes left
      else if(position.direction === 'v')
        position.direction = '<';
      // Left becomes up
      else if(position.direction === '<')
        position.direction = '^';
    }
    // Otherwise this must be a valid space to move into
    else{
      // Update the current position with the new y, x values
      position.y = newY;
      position.x = newX;
      // Add this new position to the set of visited spaces
      visited.add(`${position.y},${position.x}`);
      // If the loop finding set already has this position and direction 
      // combination a loop has been detected.
      if(loopFinding.has(`${position.y},${position.x},${position.direction}`))
        loopDetected = true;
      // Otherwise add this to the loop finding set
      else
        loopFinding.add(`${position.y},${position.x},${position.direction}`);
    }
  }
  
  // Return the set of visited spaces and wether or not this ended in a loop
  return {visited, loopDetected};
}

/**
 * Parse Input
 * @param {string[]} fileContents The input file as an array of string lines of text
 * @returns {map: string[][], position: {y: number, x: number, direction: string} } The input data parsed into a map and starting position info
 */
const parseInput = (fileContents) => {
  // Save the map and the starting position once found
  let map = [];
  let position;
  // Parse each line on by one
  for(let line = 0; line < fileContents.length; line++){
    // Split the row into an array of characters
    let row = fileContents[line].split('');
    // If one of them is the starting position save it
    let index = row.indexOf('^');
    if(index >= 0)
      position = {direction: '^', y: line, x: index};
    // Add the row to the map
    map.push(row);
  }

  return {map, position}; 
}

// Worker Thread Code
// This will ony be executed when this file is directly 
// executed by Node and is not the main thread of the process
if(!isMainThread){
  // Get the workerdata for the visits handled by this thread
  let visits = workerData.visits;
  // Get the kap and starting position info  
  let map = workerData.map;
  let position = workerData.position;
  // Save the total number of loops created
  let totalLoops = 0;
  // Check each visit one at a time
  for(let visit of visits){
    // Clone the map and position objects for each simulation run
    let clonedMap = JSON.parse(JSON.stringify(map));
    let clonedPosition = JSON.parse(JSON.stringify(position));

    // If this position is not the starting position run a new simulation
    if(!(visit.y == clonedPosition.y && visit.x == clonedPosition.x)){
      // Update the cloned map with this modification
      clonedMap[visit.y][visit.x] = '#';
      // Run the simulation and get the result
      let output = runSimulation(clonedMap, clonedPosition)
      // If a loop was detected increment the total
      if(output.loopDetected)
        totalLoops++;
    }
  }
  // Pass the total number of loops found back up to the parent thread
  parentPort.postMessage(totalLoops);
}