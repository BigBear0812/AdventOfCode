// Puzzle for Day 19: https://adventofcode.com/2017/day/19

export const run = (fileContents) => {
  // Parse in the input files map
  let data = parseInput(fileContents);

  // Follow the path on the map
  let result = followPath(data);

  return {part1: result.letters.join(''), part2: result.steps};
}

// Follow the path on the map
const followPath = (data) => {
  // Letters found on the path
  let letters = [];
  // Steps taken on the path to reach the end
  let steps = 0;
  // Continue while there is not an end to the path
  while(data.grid[data.pos.y][data.pos.x] !== ' '){
    // The current position symbol
    let current = data.grid[data.pos.y][data.pos.x];
    // Record a letter if one is found
    if(current !== '|' && current !== '-' && current !== '+')
      letters.push(current);

    // Make a turn if the current symbol is a + always turning 90 degrees
    if(current === '+'){
      // Up or down will always become left or right
      if(data.direction === 'U' || data.direction === 'D'){
        let right = data.grid[data.pos.y][data.pos.x+1];
        if(right !== ' ')
          data.direction = 'R';
        else
          data.direction = 'L';
      }
      // Left or right will always become up or down
      else if(data.direction === 'L' || data.direction === 'R'){
        let down = data.grid[data.pos.y+1][data.pos.x];
        if(down !== ' ')
          data.direction = 'D';
        else
          data.direction = 'U';
      }
    }
    // Find the next position
    let nextPos;
    if(data.direction === 'U')
      nextPos = {x: data.pos.x, y: data.pos.y-1};
    else if(data.direction === 'D')
      nextPos = {x: data.pos.x, y: data.pos.y+1};
    else if(data.direction === 'L')
      nextPos = {x: data.pos.x-1, y: data.pos.y};
    else if(data.direction === 'R')
      nextPos = {x: data.pos.x+1, y: data.pos.y};

    // Update the current position to the next position and add one to steps
    data.pos = nextPos;
    steps++;
  }

  return {letters, steps};
}

// Parse the input file contents
const parseInput = (fileContents) => {
  // Create a 2D array for the grid that contains the map
  let grid = [];
  // Find the start position of the path
  let pos = {x:0, y:0};
  // Fill the grid with the contents of the file
  for(let line of fileContents){
    grid.push(line.split(''));
  }

  // Find the start position on the top row
  for(let x = 0; x < grid[0].length; x++){
    if(grid[0][x] !== ' ')
      pos.x = x;
  }

  // Return the grid, start position, and start direction 
  // which is always down from off the top of the map
  return {grid, pos, direction: 'D'};
}