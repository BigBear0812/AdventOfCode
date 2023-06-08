// Puzzle for Day 17: https://adventofcode.com/2018/day/17

export const run = (fileContents) => {
  // Parse the input file into a grid and boundaries for the simulation
  let data = parseInput(fileContents);

  // Fill the grid with water
  fillWater(data);

  // Count the totals for the water spaces
  let total = countWater(data);

  return {part1: total.all, part2: total.still};
}

// Count the water symbols in the grid bounds
const countWater = (data) => {
  // The all and still water totals
  let all = 0;
  let still = 0;

  // Continue through each row using the strict grid bounds
  for(let y = data.yMin; y <= data.yMax; y++){
    // Continue thorugh each symbol in the row using the grid bounds with padding on the sides 
    for(let x = data.xMin-1; x <= data.grid[y].length; x++){
      // If this is running water add one to all water count
      if(data.grid[y][x] === '|')
        all++;
      // Else if this is still water add one to both totals
      else if(data.grid[y][x] === '~'){
        all++;
        still++;
      }
    }
  }

  return {all, still};
}

// Fill the grid using a Breadth First Search (BFS) algorithm
const fillWater = (data) => {
  // The next states to examine to make sure the entire grid if filled
  let states = [{x:500, y:0}];

  // Continue running until all searches have completed
  while(states.length > 0){
    // Get the current state from the front of the states array
    let current = states.shift();
    // If the curent symbol is on still water move back up one row 
    // and don't do anything else
    if(data.grid[current.y][current.x] === '~'){
      states.push({x: current.x, y: current.y-1});
      continue;
    }

    // Find the coordinates below the current one
    let below = {x: current.x, y: current.y+1};
    // Continue if we have not reached the bottom
    if(below.y <= data.yMax){
      // Get the symbol in the below space
      let belowSymbol = data.grid[below.y][below.x];
      // If the below symbol is sand continue down
      if(belowSymbol === '.'){
        data.grid[below.y][below.x] = '|';
        states.push(below);
      }
      // Else if it is running water this has already been 
      // examined this path has been filled already so do 
      // not follow it
      else if(belowSymbol === '|'){
        continue;
      }
      // Else this is going to fill a row section so figure out what it should be filled with
      else{
        // Find the left boundary
        let foundLeft = null;
        let left = {x: current.x-1, y: current.y};
        let leftBelow = {x: current.x-1, y: current.y+1}
        // Continue examining until the boundary is found
        while(foundLeft === null){
          // Get the boundaries symbols
          let leftSymbol = data.grid[left.y][left.x];
          let leftBelowSymbol = data.grid[leftBelow.y][leftBelow.x];
          // If the symbol below the boundary is sand or running 
          // water then this is an open end
          if(leftBelowSymbol === '.' || leftBelowSymbol === '|'){
            foundLeft = {x: left.x, symbol:'.'};
          }
          // Else if the boundary symbols show this is a wall and 
          // the bottom is wall or still water then this is a closed end
          else if(leftBelowSymbol !== '.' && leftSymbol === '#'){
            foundLeft = {x: left.x+1, symbol:'#'};
          }
          // Else the end has not been found yet so advance 
          // the left and left below coordinates
          else{
            leftBelow = {x: left.x-1, y: left.y+1};
            left = {x: left.x-1, y: left.y};
          }
        }

        // Find the right boundary
        let foundRight = null;
        let right = {x: current.x+1, y: current.y};
        let rightBelow = {x: current.x+1, y: current.y+1}
        // Continue examining until the boundary is found
        while(foundRight === null){
          // Get the boundaries symbols
          let rightSymbol = data.grid[right.y][right.x];
          let rightBelowSymbol = data.grid[rightBelow.y][rightBelow.x];
          // If the symbol below the boundary is sand or running 
          // water then this is an open end
          if(rightBelowSymbol === '.' || rightBelowSymbol === '|'){
            foundRight = {x: right.x, symbol:'.'};
          }
          // Else if the boundary symbols show this is a wall and 
          // the bottom is wall or still water then this is a closed end
          else if(rightBelowSymbol !== '.' && rightSymbol === '#'){
            foundRight = {x: right.x-1, symbol:'#'};
          }
          // Else the end has not been found yet so advance 
          // the right and right below coordinates
          else{
            rightBelow = {x: right.x+1, y: right.y+1};
            right = {x: right.x+1, y: right.y};
          }
        }

        // Assume the fill symbol is running water for this row section
        let fillSymbol = '|';
        // If there are two closed ends the fill with still water instead
        if(foundLeft.symbol === '#' && foundRight.symbol === '#')
          fillSymbol = '~';

        // Fill the row section with the proper symbol
        for(let x = foundLeft.x; x <= foundRight.x; x++){
          data.grid[current.y][x] = fillSymbol;
        }

        // If this was filled with still water move back up a level and 
        // reexamine that row for a row section
        if(fillSymbol === '~'){
          states.push({x: current.x, y: current.y-1});
        }
        // Otherwise at least one of the ends is open and the water will continue down
        else{
          // If the right end is open continue down the right side
          if(foundRight.symbol === '.'){
            states.push({x: foundRight.x, y: current.y});
          }
  
          // If the left end is open continue down the left side
          if(foundLeft.symbol === '.'){
            states.push({x: foundLeft.x, y: current.y});
          }
        }
      }
    }
  }
}

// Print the grid out to the screen. Used for debugging
const print = (data) => {
  // The output for the console
  let output = "";
  // Continue through each row
  for(let y = data.yMin-1; y < data.grid.length; y++){
    // Continue through each symbol in the row adding it to the new line for the console
    let line = "";
    for(let x = data.xMin-1; x < data.grid[y].length; x++){
      line += data.grid[y][x];
    }
    // End the line in with a new line character and add it to the output
    line += "\n";
    output += line;
  }

  // Log the output
  console.log(output);
}

// Create a data object from the input file
const parseInput = (fileContents) => {
  // Regex for parsing each line of the input
  let reg = new RegExp(/([xy])=(\d+), ([xy])=(\d+)..(\d+)/);
  // Lines data from the grid parsed as objects
  let lines = [];
  // The boundaries for the grid
  let yMin = Number.MAX_SAFE_INTEGER;
  let yMax = Number.MIN_SAFE_INTEGER;
  let xMin = Number.MAX_SAFE_INTEGER;
  let xMax = Number.MIN_SAFE_INTEGER;

  // Parse each line into a data object defining the line info
  for(let line of fileContents){
    // Get the pertinent info
    let matches = line.match(reg);
    let dir = matches[1];
    let dirNum = parseInt(matches[2]);
    let opposite = matches[3];
    let start = parseInt(matches[4]);
    let end = parseInt(matches[5]);

    // Adjust the boundaries to include this line on the grid space
    if(dir === 'x'){
      if(dirNum > xMax)
        xMax = dirNum;
      if(dirNum < xMin)
        xMin = dirNum;
    }
    else if(dir === 'y'){
      if(dirNum > yMax)
        yMax = dirNum;
      if(dirNum < yMin)
        yMin = dirNum;
    }

    if(opposite === 'x'){
      if(end > xMax)
        xMax = end;
      if(start < xMin)
        xMin = start;
    }
    else if(opposite === 'y'){
      if(end > yMax)
        yMax = end;
      if(start < yMin)
        yMin = start;
    }

    // Add this line ot the lines array
    lines.push({
      dir,
      dirNum,
      opposite,
      start,
      end
    });
  }

  // Setup the grid
  let grid = [];

  // Fill the grid with sand symbols
  for(let y = 0; y < yMax+2; y++){
    let line = [];
    for(let x = 0; x < xMax+2; x++){
      line.push('.');
    }
    grid.push(line);
  }

  // Add the lines to the grid
  for(let line of lines){
    // If the line is horizontal add it 
    if(line.dir === 'x'){
      for(let y = line.start; y <= line.end; y++){
        grid[y][line.dirNum] = '#';
      }
    }
    // Else if the line is vertical add it
    else if(line.dir === 'y'){
      for(let x = line.start; x <= line.end; x++){
        grid[line.dirNum][x] = '#';
      }
    }
  }

  // Add the source symbol
  grid[0][500] = '+';

  return {grid, xMin, xMax, yMin, yMax};
}