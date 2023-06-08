// Puzzle for Day 18: https://adventofcode.com/2018/day/18

export const run = (fileContents) => {
  // Parse the input file into a 2D array grid of the space symbols
  let grid = parseInput(fileContents);

  // Find the resulting grid after 10 rounds and 1000000000 rounds
  let grid1 = processGrid(grid, 10);
  let grid2 = processGrid(grid, 1000000000);

  // Get the score for each grid
  let score1 = resourceScore(grid1);
  let score2 = resourceScore(grid2);

  return {part1: score1, part2: score2};
}

// Calculate the resource score for a grid
const resourceScore = (grid) => {
  // Total of trees and lumberyards
  let trees = 0; 
  let lumberyards = 0;

  // Check each space and add to the appropriate totals
  for(let y = 0; y < grid.length; y++){
    for(let x = 0; x < grid[y].length; x++){
      if(grid[y][x] === '|')
        trees++;
      if(grid[y][x] === '#')
        lumberyards++;
    }
  }

  // Multiply trees by lumberyards for the final resource score
  return trees * lumberyards;
}

// Process the grid for a given number of rounds
const processGrid = (grid, totalRounds) => {
  // Keep track of the current round, any previously seen 
  // patterns, and the cycle length if a repeating pattern is found
  let cycleLength = null;
  let seen = new Map();
  let round;

  // Continue procesing for the specified number of rounds 
  // or until a repeated pattern is found
  for(round = 0; round < totalRounds && cycleLength === null; round++){
    // Calculate a single round of change
    grid = singleRound(grid);
    // Get a unique string representation of the grid by 
    // flattening it and converting it to a string
    let key = grid.flat().join('');
    // If this pattern has been seen before then a cycle has been found
    if(seen.has(key)){
      // Calculate the cycle length
      let last = seen.get(key);
      cycleLength = round - last;
    }
    // Else this is a new pattern and should be added to 
    // the set of patterns that have been seen
    else{
      seen.set(key, round);
    }
  }

  // Once completed find out how many round are remaining to be 
  // processed to find the correct result
  let remaining = (totalRounds - round) % cycleLength;

  // Calculate the reamining roujnds one at a time before 
  // returning the final grid
  for(round = 0; round < remaining; round++){
    grid = singleRound(grid);
  }

  return grid;
}

// Calculate a single round
const singleRound = (grid) => {
  // Keep track of the updated grid separate from the inital grid
  let updated = [];

  // Continue processing the grid row by row
  for(let y = 0; y < grid.length; y++){
    // The new line to be added to the updated output
    let line = [];
    // Continue processing each space in the row
    for(let x = 0; x < grid[y].length; x++){
      // The current space symbol
      let current = grid[y][x];
      // The valid directions around the current space to check
      let validDirections = new Set();
      // The surrounding spaces symbols
      let surrounding = [];
      // The totals of each type of space in the surrounding array
      let clear = 0;
      let trees = 0;
      let lumberyard = 0;
      
      // Check in each direction if the grid 
      // has valid spaces in the direction
      if(y-1 >= 0)
        validDirections.add("ABOVE");
      if(y+1 < grid.length)
        validDirections.add("BELOW");
      if(x-1 >= 0)
        validDirections.add("LEFT");
      if(x+1 < grid[y].length)
        validDirections.add("RIGHT");

      // Add a value for each of the eight surrounding spaces if 
      // there is a valid value there on the grid to get
      if(validDirections.has("ABOVE") && validDirections.has("LEFT"))
        surrounding.push(grid[y-1][x-1]);
      if(validDirections.has("ABOVE"))
        surrounding.push(grid[y-1][x]);
      if(validDirections.has("ABOVE") && validDirections.has("RIGHT"))
        surrounding.push(grid[y-1][x+1]);
      if(validDirections.has("LEFT"))
        surrounding.push(grid[y][x-1]);
      if(validDirections.has("RIGHT"))
        surrounding.push(grid[y][x+1]);
      if(validDirections.has("BELOW") && validDirections.has("LEFT"))
        surrounding.push(grid[y+1][x-1]);
      if(validDirections.has("BELOW"))
        surrounding.push(grid[y+1][x]);
      if(validDirections.has("BELOW") && validDirections.has("RIGHT"))
        surrounding.push(grid[y+1][x+1]);

      // Check each surroudning sapace value and 
      // find the totals of each kind of space
      for(let space of surrounding){
        if(space === '.')
          clear++;
        else if(space === '|')
          trees++;
        else if(space === '#')
          lumberyard++;
      }

      // Check for each of the specified conditions as specified in the puzzle
      // If the space is clear and has 3 or more trees 
      // surrounding it then it becomes a tree
      if(current === '.' && trees >= 3)
        line.push('|');
      // If the space is a tree and has 3 or more lumberyards 
      // around it then it becomes a lumber yard
      else if(current === '|' && lumberyard >= 3)
        line.push('#')
      // If a space is a lumberyard it remains a lumberyard 
      // if is has 1 or more lumberyards and 1 or more trees 
      // around it. Conversely, If a space is a lumberyard 
      // and it has less than one trees or less than one 
      // lumberyard around it then it becomes clear.
      else if(current === '#' && (lumberyard < 1 || trees < 1))
        line.push('.')
      // Else there is no change and the current psace 
      // remains the same in the updated grid
      else
        line.push(current);
    }
    // Push the new line into the updated grid
    updated.push(line);
  }

  return updated;
}

// A print command to show the current state of the 
// grid on the command line. Used for debugging
const print = (grid) => {
  // Console output
  let output = '';
  for(let y = 0; y < grid.length; y++){
    // Join together the symbols on the row with a 
    // new line character at the end of eqch line 
    // and add it ot the output.
    output += grid[y].join('') + '\n';
  }
  console.log(output);
}

// Parse the input file into a 2D array grid
const parseInput = (fileContents) => {
  // The resulting grid;
  let grid = [];
  for(let line of fileContents){
    // Split each line of the input into a new array 
    // and push that array into the grid
    grid.push(line.split(''));
  }
  return grid;
}