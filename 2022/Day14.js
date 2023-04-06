// Puzzle for Day 14: https://adventofcode.com/2022/day/14

export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return {part1: result1, part2: result2};
}

const part1 = (fileContents) => { 
  // Create the grid
  let grid = createGrid(fileContents);

  // Drop sand until it falls output the map. 
  let stop = false;
  let sandCount = 0;
  while(!stop){
    let x = 500;
    let y = 0;
    let stillDroppping = true;
    while(stillDroppping){
      // Check if it's about to go off the grid
      if(y >= grid.length - 1){
        stillDroppping = false;
      }
      // Check Below
      else if(grid[y+1][x] !== '#' && grid[y+1][x] !== 'o'){
        y++;
      }
      // Check Below Left
      else if(grid[y+1][x-1] !== '#' && grid[y+1][x-1] !== 'o'){
        x--;
        y++;
      }
      // Check Below Right
      else if(grid[y+1][x+1] !== '#' && grid[y+1][x+1] !== 'o'){
        x++;
        y++;
      }
      // Stopped Dropping
      else{
        grid[y][x] = 'o';
        stillDroppping = false;
      }
    }

    // If it fell out of the grid
    if(y >= grid.length - 1){
      stop = true;
    }
    // Otherwise add it to the count
    else{
      sandCount++;
    }
  }

  return sandCount;
}

const part2 = (fileContents)=>{
  // Create the grid
  let grid = createGrid(fileContents);

  // Add in the last floor row to the grid
  let rowLen = grid[0].length;
  let lastRow = [];
  for(let i = 0; i < rowLen; i++){
    lastRow.push('#');
  }
  grid.push(lastRow);

  // Drop sand until it piles up and blocks the flow in of sand
  let stop = false;
  let sandCount = 0;
  while(!stop){
    let x = 500;
    let y = 0;
    // Check that the sand has not piled up and blocked the opening
    if(grid[y][x] !== 'o'){
      let stillDroppping = true;
      while(stillDroppping){
        // Check Below
        if(grid[y+1][x] !== '#' && grid[y+1][x] !== 'o'){
          y++;
        }
        // Check Below Left
        else if(grid[y+1][x-1] !== '#' && grid[y+1][x-1] !== 'o'){
          x--;
          y++;
        }
        // Check Below Right
        else if(grid[y+1][x+1] !== '#' && grid[y+1][x+1] !== 'o'){
          x++;
          y++;
        }
        // Stopped Dropping
        else{
          grid[y][x] = 'o';
          stillDroppping = false;
        }
      }
      // Count the sand since it came to a resting point
      sandCount++;
    }
    else{
      stop = true
    }
  }

  return sandCount;
}

// Used for printing out the grid during testing.
const print = (grid) => {
  for(const lineGrid of grid){
    let output = "";
    for(const symbol of lineGrid){
      output += symbol;
    }
    console.log(output);
  }
}

// Create the grid used for this puzzle
const createGrid = (fileContents) => {
  // Parsing regex and boundaries for the grid starting from the drop point at 500, 0
  const pointReg = new RegExp(/(\d+),(\d+)/);
  // Make this wide enough so that the x limits will never be hit
  let minX = 0;
  let maxX = 1000; 
  // Find the minimum maxY value that is needed to draw all of the lines
  let minY = 0;
  let maxY = 0;

  // Parse points from each line and find the boundaries of the grid
  let lines = []
  for(const line of fileContents){
    let points = line.split(' -> ');
    let linePoints = [];
    for(const point of points){
      let matches = point.match(pointReg);
      if(matches){
        let x = parseInt(matches[1]);
        let y = parseInt(matches[2]);

        // Find lowest maxY that can be used to draw all of the lines
        if(maxY === -1 || maxY < y)
          maxY = y;

        linePoints.push({x: x, y: y});
      }
    }
    lines.push(linePoints);
  }

  // Pre-Populate the grid with dots.
  // Add one to the bottom to make sure there is space for the 
  // sand to fall out of the bottom of the grid.
  let grid = [];
  let yLen = (maxY+1) - minY;
  let xLen = maxX - minX;
  for(let y = 0; y <= yLen; y++){
    let gridRow = [];
    for(let x = 0; x <= xLen; x++){
      gridRow.push('.');
    }
    grid.push(gridRow);
  }

  // Draw all of the lines on the grid
  for(const line of lines){
    for(let i = 1; i < line.length; i++){
      let pointA = line[i - 1];
      let pointB = line[i];
      // Vertical Line
      if(pointA.x === pointB.x){
        let start = pointA.y;
        let end = pointB.y;
        if(start > end){
          start = pointB.y;
          end = pointA.y;
        }
        while(start <= end){
          grid[start][pointA.x] = '#';
          start++;
        }
      }
      // Horizontal Line
      else{
        let start = pointA.x;
        let end = pointB.x;
        if(start > end){
          start = pointB.x;
          end = pointA.x;
        }
        while(start <= end){
          grid[pointA.y][start] = '#';
          start++;
        }
      }
    }
  }

  // Return the grid
  return grid;


}