// Puzzle for Day 16: https://adventofcode.com/2023/day/16

export const run = (fileContents) => {
  // Convert the input from a string[] to string[][] of characters
  let grid = fileContents.map(l => l.split(''));
  // Simulate the one scenario for part 1
  let result1 = simulateFromStart(grid, 0, 0, '>');
  // Simulate all scenarios for part 2
  let result2 = part2(grid);

  return {part1: result1, part2: result2};
}

/**
 * Part 2 Solution
 * @param {string[][]} grid 
 * @returns 
 */
const part2 = (grid) => {
  // Get all of the possible start positions for the grid
  let startPositions = [];
  for(let y = 0; y < grid.length; y++){
    // Every row will have both ends
    startPositions.push({x: 0, y, direction: '>'});
    startPositions.push({x: grid[y].length-1, y, directions: '<'});

    // If on the top row add every space in the row with a down direction
    if(y == 0){
      for(let x = 0; x < grid[y].length; x++){
        startPositions.push({x, y, direction: 'v'});
      }
    }
    // Otherwise if on the bottom row add every space in the row with and up direction
    else if(y = grid.length-1){
      for(let x = 0; x < grid[y].length; x++){
        startPositions.push({x, y, direction: '^'});
      }
    }
  }

  // Run each simulation and find the result with the greatest energy output
  let mostEnergy = 0;
  for(let pos of startPositions){
    let energy = simulateFromStart(grid, pos.x, pos.y, pos.direction);
    if(energy > mostEnergy)
      mostEnergy = energy;
  }

  return mostEnergy;
}

/**
 * Rune the full simulation of the laster and get all energized spaces. 
 * This uses an optimized Breadth First Search (BFS) to find all energized squares.
 * @param {string[][]} grid 
 * @param {number} x 
 * @param {number} y 
 * @param {string} direction 
 * @returns 
 */
const simulateFromStart = (grid, x, y, direction) => {
  // Create a start object 
  let start = {x:x, y:y, direction: direction};
  // Create a queue to keep track of all diverging paths and add the starting point to it
  let queue = [];
  queue.push(start);
  // Keep track of the X, Y coordinates that are being energized and add the start to it
  let energized = new Set();
  energized.add(`{x:${start.x},y:${start.y}\}`);
  // Keep track of the x, y, and direction of all places visited. If a laser has already 
  // gone in this direction there is no need to continue simulating that instance.
  let visited = new Set();

  // Continue tracking the laser's path until all possible divergences have completed
  while(queue.length > 0){
    // Get the current laser end point from the queue
    let current = queue.shift();

    // Continue the simulation while the laser is still in the grid, and this space 
    // and direction have not yet been visited.
    while(current.y >= 0 
      && current.y < grid.length 
      && current.x >= 0 
      && current.x < grid[current.y].length 
      && !visited.has(JSON.stringify(current))){ 

      // Add this to the visited set
      visited.add(JSON.stringify(current));
      // If the energized set does not have this point yet then add it
      if(!energized.has(`{x:${current.x},y:${current.y}\}`))
        energized.add(`{x:${current.x},y:${current.y}\}`);

      // Get the current space's character
      let currentSpace = grid[current.y][current.x];
      // If empty move through it
      if(currentSpace === '.'){
        switch(current.direction){
          case '>':
            current.x++;
            break;
          case '<':
            current.x--;
            break;
          case '^':
            current.y--;
            break;
          case 'v':
            current.y++;
            break;
        }
      }
      // If a \ mirror reflect
      else if (currentSpace === '\\'){
        switch(current.direction){
          case '>':
            current.y++;
            current.direction = 'v';
            break;
          case '<':
            current.y--;
            current.direction = '^';
            break;
          case '^':
            current.x--;
            current.direction = '<';
            break;
          case 'v':
            current.x++;
            current.direction = '>';
            break;
        }
      }
      // If a / mirror reflect
      else if (currentSpace === '/'){
        switch(current.direction){
          case '>':
            current.y--;
            current.direction = '^';
            break;
          case '<':
            current.y++;
            current.direction = 'v';
            break;
          case '^':
            current.x++;
            current.direction = '>';
            break;
          case 'v':
            current.x--;
            current.direction = '<';
            break;
        }
      }
      // If a | splitter then either continue through or split by adding the non-chosen path to the queue
      else if (currentSpace === '|'){
        switch(current.direction){
          case '>':
          case '<':
            let newDirection = JSON.parse(JSON.stringify(current));
            newDirection.y++;
            newDirection.direction = 'v';
            queue.push(newDirection);
            current.y--;
            current.direction = '^';
            break;
          case '^':
            current.y--;
            break;
          case 'v':
            current.y++;
            break;
        }
      }
      // If a - splitter then either continue through or split by adding the non-chosen path to the queue
      else if (currentSpace === '-'){
        switch(current.direction){
          case '^':
          case 'v':
            let newDirection = JSON.parse(JSON.stringify(current));
            newDirection.x++;
            newDirection.direction = '>';
            queue.push(newDirection);
            current.x--;
            current.direction = '<';
            break;
          case '<':
            current.x--;
            break;
          case '>':
            current.x++;
            break;
        }
      }
    }
  }

  // The final result it the size of the energized set.
  return energized.size;
}