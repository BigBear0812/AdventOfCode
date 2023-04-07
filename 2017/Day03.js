// Puzzle for Day 3: https://adventofcode.com/2017/day/3

export const run = (fileContents) => {
  // Parse the number in from the first line of the input file and convert to an int
  let num = parseInt(fileContents[0]);

  let result1 = part1(num);
  let result2 = part2(num);

  return {part1: result1, part2: result2};
}

const part1 = (num) => {
  // Find the nearest square root
  let nearestSqrt = Math.ceil(Math.sqrt(num));

  // Find the square value of the root to get a corner
  let nearestSq = nearestSqrt * nearestSqrt;
  
  // The length of one side of the squere will be one less 
  // than the sqare root of the current square value
  let sideLength = nearestSqrt - 1;

  // The next corner back will be the halfway point and 
  // will be one sidelength away
  let half = nearestSq - sideLength;
  
  // Half of the side is the diatnce to the mid point which 
  // is the closest point on the side to the center
  let halfSideLength = Math.ceil(sideLength / 2);

  // Find the middle number
  let mid;
  if(half > num)
    mid = half - halfSideLength;
  else
    mid = nearestSq - halfSideLength;

  // Find absolute differance between the actual number and the middle
  let diff = Math.abs(num - mid);
  
  let distance;
  // If this number is a perfect square the distance 
  // will be one side length
  if(diff === halfSideLength)
    distance = sideLength;
  // Otherwise the distance is the half distance plus 
  // the distance from the mid number
  else
    distance = halfSideLength + diff;

  return distance;
}

const part2 = (num) => {
  // Create a map to store seen points and keep track of the 
  // current position and the last value found
  let grid = new Map();
  let x = 0; 
  let y = 0;
  let lastVal = 1;
  // Add the first point to the grid
  grid.set(`${x},${y}`, lastVal);

  // Continue searching while a number larger than the 
  // input number has not been found
  while(lastVal < num){
    // Find the next position to go to in the spiral
    // If the position is on top or bottom of the spiral
    if ((x !== y || x >= 0) && Math.abs(x) <= Math.abs(y)) {
      // Moving left or right
      x += y >= 0 ? 1 : -1;
    }
    // Else the position is on the left or right of the spiral
    else {
      // Moving up or down
      y += x >= 0 ? -1 : 1;
    }
    // Get all of the points surrounding the current one
    let around = [];
    around.push(grid.get(`${x-1},${y+1}`));// upperLeft
    around.push(grid.get(`${x},${y+1}`));  // upperCenter
    around.push(grid.get(`${x+1},${y+1}`));// upperRight
    around.push(grid.get(`${x-1},${y}`));  // midLeft
    around.push(grid.get(`${x+1},${y}`));  // midRight
    around.push(grid.get(`${x-1},${y-1}`));// bottomLeft
    around.push(grid.get(`${x},${y-1}`));  // bottomCenter
    around.push(grid.get(`${x+1},${y-1}`));// bottomRight

    // Add up the defined values
    lastVal = around.filter( x => x !== undefined).reduce((sum, x) => sum + x, 0);

    // Add the new value to the grid
    grid.set(`${x},${y}`, lastVal);
  }

  return lastVal;
}

