import { createHash } from 'node:crypto';
// Puzzle for Day 17: https://adventofcode.com/2016/day/17

export const run = (fileContents) => {
  // Get the passcode from the first line of the input file
  let passcode = fileContents[0];

  // Find all of the paths that will lead to the vault. Since this 
  // is using as breadth first search algorithm the results will 
  // be ordered from shortest path to longest path.
  let paths = findAllPaths(passcode);

  // Log output
  console.log("Part 1:", paths[0]);
  console.log("Part 2:", paths[paths.length-1].length);
}

// Breadth First Search (BFS) to find all of the paths that lead to the vault
const findAllPaths = (passcode) => {
  // Initial state for the start of the search
  let initialState = {
    path: "",
    position: {x: 0, y: 0}
  }

  // All next possible states of the search starting with the inital state
  let states = [];
  states.push(initialState);

  // The set of results for all possible paths that reach the valut
  let result = [];

  // While there are still possible next states to process
  while(states.length > 0){
    // Get the next state to examine off the front of the array
    let current = states.shift();

    // Check if the vault has been reached
    if(current.position.x === 3 && current.position.y === 3){
      result.push(current.path);
    }
    // If not see if there are any next moves to be made
    else{
      // Compute the current hash
      let hash = createHash('md5').update(passcode + current.path).digest('hex');
      // Take the first four characters from the hash
      let firstFour = hash.slice(0, 4).split('');

      // Check each direction and if it is possible to move in 
      // that direction. Any valid direction found create a new 
      // state for that movement and push it on to the back of 
      // the states array.
      // Up
      if(isOpen(firstFour[0]) && current.position.y > 0){
        let newState = JSON.parse(JSON.stringify(current));
        newState.path += 'U';
        newState.position.y -=1;
        states.push(newState);
      }
      // Down
      if(isOpen(firstFour[1]) && current.position.y < 3){
        let newState = JSON.parse(JSON.stringify(current));
        newState.path += 'D';
        newState.position.y +=1;
        states.push(newState);
      }
      // Left
      if(isOpen(firstFour[2]) && current.position.x > 0){
        let newState = JSON.parse(JSON.stringify(current));
        newState.path += 'L';
        newState.position.x -=1;
        states.push(newState);
      }
      // Right
      if(isOpen(firstFour[3]) && current.position.x < 3){
        let newState = JSON.parse(JSON.stringify(current));
        newState.path += 'R';
        newState.position.x +=1;
        states.push(newState);
      }
    }
  }

  return result;
}

// Check if the character passed indicates a locked or unlocked door
const isOpen = (value) => {
  return value === 'b' || 
    value === 'c' || 
    value === 'd' || 
    value === 'e' || 
    value === 'f';
}