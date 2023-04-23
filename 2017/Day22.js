// Puzzle for Day 22: https://adventofcode.com/2017/day/22

export const run = (fileContents) => {
  // Parse the input into a hash set of the infected positions relative to the center
  let infected1 = parseInput(fileContents);
  let infected2 = parseInput(fileContents);

  // Simulate the infections for each part of the puzzle and return the number of infections
  let numInfected1 = simulateInfectionPart1(infected1, 10000);
  let numInfected2 = simulateInfectionPart2(infected2, 10000000);
  
  return {part1: numInfected1, part2: numInfected2};
}

// The simulation rules for Part 2
const simulateInfectionPart2 = (infectedPositions, totalBursts) => {
  // The number of infections during the simulation
  let numInfected = 0;
  // Set's for tracking weakened and flagged positions
  let weakenedPositions = new Set();
  let flaggedPositions = new Set();
  // The current position starting at (0, 0)
  let position = {x: 0, y: 0};
  // The current direction starting up
  let direction = 'U';

  // Run the simulation for the specified number of total bursts
  for(let r = 0; r < totalBursts; r++){
    // The string version of the current position
    let posStr = `${position.x},${position.y}`;
    // True if the spot is infected
    let infected = infectedPositions.has(posStr);
    // True if the spot is weakened
    let weakened = weakenedPositions.has(posStr);
    // True if the spot is flagged
    let flagged = flaggedPositions.has(posStr);
    // If infected
    if(infected){
      // Turn right
      switch(direction){
        case 'U':
          direction = 'R';
          break;
        case 'R':
          direction = 'D';
          break;
        case 'D': 
          direction = 'L';
          break;
        case 'L': 
          direction = 'U';
          break;
      }

      // Delete from infected positions and add to flagged positions
      infectedPositions.delete(posStr);
      flaggedPositions.add(posStr);
    }
    // Else if weakened
    else if(weakened){
      // No turn

      // Delete from weakened positions and add to infected positions. 
      // Add one to the total number of infections
      weakenedPositions.delete(posStr);
      infectedPositions.add(posStr);
      numInfected++;
    }
    // Else if flagged
    else if(flagged){
      // Reverse direction
      switch(direction){
        case 'U':
          direction = 'D';
          break;
        case 'R':
          direction = 'L';
          break;
        case 'D': 
          direction = 'U';
          break;
        case 'L': 
          direction = 'R';
          break;
      }

      // Delete from flagged positions since the position is now clean
      flaggedPositions.delete(posStr)

    }
    // Else if clean
    else{
      // Turn left
      switch(direction){
        case 'U':
          direction = 'L';
          break;
        case 'L':
          direction = 'D';
          break;
        case 'D': 
          direction = 'R';
          break;
        case 'R': 
          direction = 'U';
          break;
      }

      // Add to weakened positions
      weakenedPositions.add(posStr);
    }

    // Move forward one position
    switch(direction){
      case 'U':
        position.y--;
        break;
      case 'R':
        position.x++;
        break;
      case 'D': 
        position.y++;
        break;
      case 'L': 
        position.x--;
        break;
    }
  }

  return numInfected;
}

// The simulation rules for Part 1
const simulateInfectionPart1 = (infectedPositions, totalBursts) => {
  // The number of infections during the simulation
  let numInfected = 0;
  // The current position starting at (0, 0)
  let position = {x: 0, y: 0};
  // The current direction starting up
  let direction = 'U';

  // Run the simulation for the specified number of total bursts
  for(let r = 0; r < totalBursts; r++){
    // The string version of the current position
    let posStr = `${position.x},${position.y}`;
    // True if the spot is infected
    let infected = infectedPositions.has(posStr);
    // If infected
    if(infected){
      // Turn right
      switch(direction){
        case 'U':
          direction = 'R';
          break;
        case 'R':
          direction = 'D';
          break;
        case 'D': 
          direction = 'L';
          break;
        case 'L': 
          direction = 'U';
          break;
      }

      // Clean the location
      infectedPositions.delete(posStr);
    }
    // Else if clean
    else{
      // Turn left
      switch(direction){
        case 'U':
          direction = 'L';
          break;
        case 'L':
          direction = 'D';
          break;
        case 'D': 
          direction = 'R';
          break;
        case 'R': 
          direction = 'U';
          break;
      }

      // Infect the position and add one to the total number of infections
      infectedPositions.add(posStr);
      numInfected++;
    }

    // Move forward one position
    switch(direction){
      case 'U':
        position.y--;
        break;
      case 'R':
        position.x++;
        break;
      case 'D': 
        position.y++;
        break;
      case 'L': 
        position.x--;
        break;
    }
  }

  return numInfected;
}

// Parse the input file into a hash set of positions of infected locations
const parseInput = (fileContents) => {
  // The height and width of the input
  let height = fileContents.length;
  let width = fileContents[0].length;
  // The middle position of the input which will be the start (0, 0)
  let middle = {x: Math.floor(width / 2), y: Math.floor(height / 2)};
  // The infected set of positions
  let infected = new Set();

  // Iterate through each position if the input
  for(let y = 0; y < fileContents.length; y++){
    for(let x = 0; x < fileContents[y].length; x++){
      // If this is infected add the position to the infected 
      // set with the coordinates relative to the middle point
      if(fileContents[y][x] === '#'){
        let relX = x - middle.x;
        let relY = y - middle.y;
        infected.add(`${relX},${relY}`);
      }
    }
  }

  return infected;
}