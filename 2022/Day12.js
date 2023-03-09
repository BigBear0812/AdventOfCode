import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 12: https://adventofcode.com/2022/day/12

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
  // Create and object map from the file contents
  let map = parseMap(fileContents);
  
  // Find the start on the map
  let start = null;
  for(let y = 0; y < map.length && start === null; y++){
    for(let x = 0; x < map[y].length && start === null; x++){
      if(map[y][x].elevation === 'S')
        start = map[y][x];
    }
  }
  // Do a breadth first search to find the shortest route
  let result = breadthFirstSearch(map, start);

  // Count how many steps by backtracking to the start.
  let count = 0;
  while(result.parent !== null){
    result = result.parent;
    count++;
  }

  // Log output
  console.log(`The shortest route from the start is: ${count} steps`);

  // Pass along the file contents to Part 2
  return fileContents;
})
.then((fileContents) => {
  // Create and object map from the file contents
  let map = parseMap(fileContents);

  // Find the all possible starts on the map
  let allAs = [];
  for(let y = 0; y < map.length; y++){
    for(let x = 0; x < map[y].length; x++){
      if(map[y][x].elevation === 'S' || map[y][x].elevation === 'a')
        allAs.push(map[y][x]);
    }
  }

  // Look for the shortest path from any a the can successfully reach the end.
  let shortest = Number.MAX_SAFE_INTEGER;
  for(const a of allAs){
    // Copy the map
    let mapCopy = JSON.parse(JSON.stringify(map));
    // Do a breadth first search to find the shortest route
    let result = breadthFirstSearch(mapCopy, a);

    // Count how many steps by backtracking to the start 
    // if it reached the end successfully
    if(result != undefined){
      let count = 0;
      while(result.parent !== null){
        result = result.parent;
        count++;
      }
      // If this is the shortest route so far then save it
      if(count < shortest)
      shortest = count;
    }
  }

  // Log output
  console.log(`The shortest route form any a is: ${shortest} steps`);

});

// Breadth first search algorithm to find the shortest path
const breadthFirstSearch = (map, start) => {
  // Create a queue for storing next steps
  let queue = [];
  // Mark start as explored and add it to the end of the queue
  start.explored = true;
  queue.push(start);
  // Continue searching while the queue has next possible steps
  while(queue.length > 0){
    // Remove the next step to evaluate fomr the from of the queue
    let current = queue.shift();
    // Check if we have reached the end
    if(current.elevation === 'E')
      return current;
    // If this is not the end then  compute the next possible steps.
    // For each unexplored next step mark it exploredm, set it's 
    // parent to the current step, and add it to the queue
    for(const edge of getValidEdges(map, current)){
      if(edge.explored === false){
        edge.explored = true
        edge.parent = current;
        queue.push(edge);
      }
    }
  } 
}

// Get all of the valid next possible steps for a given location
const getValidEdges = (map, current) => {
  // The list of all elevations in order from lowest to highest
  const elevationOrder = ['S', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'E'];
  // Next steps can only be to an elevation at, one above, or below the current elevation.
  const elevOrderIndex = elevationOrder.indexOf(current.elevation);
  const possibleElevations = elevationOrder.slice(0, elevOrderIndex + 2);

  // Check if each of the cardinal directions is on the map and a place that can be stepped on to.
  // If it is then add it to the results set
  let results = [];
  // Up
  if(current.y - 1 >= 0 && possibleElevations.indexOf(map[current.y - 1][current.x].elevation) !== -1)
    results.push(map[current.y - 1][current.x]);
  // Down
  if(current.y + 1 < map.length && possibleElevations.indexOf(map[current.y + 1][current.x].elevation) !== -1)
    results.push(map[current.y + 1][current.x]);
  // Left
  if(current.x - 1 >= 0 && possibleElevations.indexOf(map[current.y][current.x - 1].elevation) !== -1)
    results.push(map[current.y][current.x - 1]);
  // Right
  if(current.x + 1 < map[current.y].length && possibleElevations.indexOf(map[current.y][current.x + 1].elevation) !== -1)
    results.push(map[current.y][current.x + 1]);

  return results;
}

// Parse each line of the file contents and create an object with the
const parseMap = (fileContents) => {
  let map = [];
  for(let y = 0; y < fileContents.length; y++){
    const line = fileContents[y];
    map.push(line.split('').map((value, index) => {return { elevation: value, parent: null, explored: false, y: y, x: index }}));
  }
  return map;
}
