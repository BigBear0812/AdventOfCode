// Puzzle for Day 18: https://adventofcode.com/2015/day/18

export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

const part1 = (fileContents) => {
  // Parse input into a 2 dimensional array of strings
  let grid = parseInput(fileContents);

  // Animmate the grid the specified number of times
  let result = animateGrid(grid, 100, false);

  // Count the lights that are on
  let count = countLightsOn(result);

  return count;
};

const part2 = (fileContents) => {
  // Parse input into a 2 dimensional array of strings
  let grid = parseInput(fileContents);

  // Animmate the grid the specified number of times
  let result = animateGrid(grid, 100, true);

  // Count the lights that are on
  let count = countLightsOn(result);

  return count;
};

// Parse the input file lines into a 2 diemnsional array
const parseInput = (fileContents) => {
  // Resulting array
  let grid = [];
  // For each line of the file split each character into
  // a sperarate string and add it to the grid
  for (let line of fileContents) {
    let gridLine = line.split("");
    grid.push(gridLine);
  }
  return grid;
};

// Animate the grid the specified number of times and
// specify if the corners are stuck on or not
const animateGrid = (grid, steps, cornersOn) => {
  // The dimenion parameters for the grid
  let minY = 0;
  let minX = 0;
  let maxY = grid.length;
  let maxX = grid[0].length;
  // Do one pass at updating the grid for each step specified
  for (let step = 0; step < steps; step++) {
    // The new grid being created this step
    let newGrid = [];
    // Process each row
    for (let y = 0; y < maxY; y++) {
      // For each new row start by insterting an empty array
      newGrid.push([]);
      // Proces each column in the current row
      for (let x = 0; x < maxX; x++) {
        // The surrounding rows and columns
        let upperRow = y - 1;
        let lowerRow = y + 1;
        let leftCol = x - 1;
        let rightCol = x + 1;

        // The number of surrounding lights that are on
        let countSurroundingOn = 0;
        // For each of the eight possible surrounding positions
        // check if the location is valid and if valid then add
        // one to the count if the light is on
        // Upper Left
        if (
          upperRow >= minY &&
          upperRow < maxY &&
          leftCol >= minX &&
          leftCol < maxX
        )
          countSurroundingOn += grid[upperRow][leftCol] === "#" ? 1 : 0;
        // Upper Center
        if (upperRow >= minY && upperRow < maxY && x >= minX && x < maxX)
          countSurroundingOn += grid[upperRow][x] === "#" ? 1 : 0;
        // Upper Right
        if (
          upperRow >= minY &&
          upperRow < maxY &&
          rightCol >= minX &&
          rightCol < maxX
        )
          countSurroundingOn += grid[upperRow][rightCol] === "#" ? 1 : 0;
        // Middle Left
        if (y >= minY && y < maxY && leftCol >= minX && leftCol < maxX)
          countSurroundingOn += grid[y][leftCol] === "#" ? 1 : 0;
        // Middle Right
        if (y >= minY && y < maxY && rightCol >= minX && rightCol < maxX)
          countSurroundingOn += grid[y][rightCol] === "#" ? 1 : 0;
        // Lover Left
        if (
          lowerRow >= minY &&
          lowerRow < maxY &&
          leftCol >= minX &&
          leftCol < maxX
        )
          countSurroundingOn += grid[lowerRow][leftCol] === "#" ? 1 : 0;
        // Lower Center
        if (lowerRow >= minY && lowerRow < maxY && x >= minX && x < maxX)
          countSurroundingOn += grid[lowerRow][x] === "#" ? 1 : 0;
        // Lower Right
        if (
          lowerRow >= minY &&
          lowerRow < maxY &&
          rightCol >= minX &&
          rightCol < maxX
        )
          countSurroundingOn += grid[lowerRow][rightCol] === "#" ? 1 : 0;

        // The value of the current light
        let currentValue = grid[y][x];
        // If cornersOn is true and this light is a corner light then
        // always set this light to true in the new grid
        if (
          cornersOn &&
          ((y === minY && x === minY) ||
            (y === minY && x === maxX - 1) ||
            (y === maxY - 1 && x === minY) ||
            (y === maxY - 1 && x === maxY - 1))
        ) {
          newGrid[y][x] = "#";
        }
        // Otherwise apply normal rules to the light
        else {
          // If the current light is on
          if (currentValue === "#") {
            // If there are either 2 or 3 surrounding lights
            // that are on the current light should be on,
            // otherwise the current light is off
            if (countSurroundingOn === 2 || countSurroundingOn === 3)
              newGrid[y][x] = "#";
            else newGrid[y][x] = ".";
          }
          // Else if the current light is off
          else if (currentValue === ".") {
            // If there are 3 surrounding lights that
            // are on the current light should be on,
            // otherwise the current light is off
            if (countSurroundingOn === 3) newGrid[y][x] = "#";
            else newGrid[y][x] = ".";
          }
        }
      }
    }
    // After finding the new value for each light set the grid to be the newGrid to process the new round
    grid = newGrid;
  }
  return grid;
};

// Count the total number of lights in the grid that are on
const countLightsOn = (grid) => {
  // Total count of light on
  let countOn = 0;
  // Max X value and Max Y value
  let maxY = grid.length;
  let maxX = grid[0].length;
  // Check each light and if it is on add 1 to the total count of lights on
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      countOn += grid[y][x] === "#" ? 1 : 0;
    }
  }
  return countOn;
};
