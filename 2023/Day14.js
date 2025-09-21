// Puzzle for Day 14: https://adventofcode.com/2023/day/14

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

/**
 * Part 2 Solution
 * @param {string[]} fileContents
 * @returns {number} weight
 */
const part2 = (fileContents) => {
  // Convert input string[] to 2d string[][]
  let grid = fileContents.map((l) => l.split(""));
  let maxCycles = 1000000000;
  // Cache each cycles final pattern to find repeats
  let cache = new Map();
  // The number of cycles to finish simulating to get the final answer
  let remainingCycles = null;

  // Continue the simulation until reaching the end of finding s repeat
  for (
    let cycleCount = 0;
    cycleCount < maxCycles && !remainingCycles;
    cycleCount++
  ) {
    // Simulate one cycle
    grid = simulateCycle(grid);
    // Check if this ending pattern has been seen before
    let cacheKey = JSON.stringify(grid);
    if (cache.has(cacheKey)) {
      // Get the repeated patterns cycle count value
      let startRepeat = cache.get(cacheKey);
      // Compute the cycle length and the number or remaining cycles to get the final pattern
      let repeatingCycleLength = cycleCount + 1 - startRepeat;
      remainingCycles = (maxCycles - startRepeat) % repeatingCycleLength;
    } else {
      // Cache this pattern and add one to the cycle count
      cache.set(cacheKey, cycleCount + 1);
    }
  }

  // Simulate the remaining cycles to get the grid into the final pattern
  for (let c = 0; c < remainingCycles; c++) {
    grid = simulateCycle(grid);
  }

  // Get the total weight
  return weight(grid);
};

/**
 * Part 1 Solution
 * @param {string[]} fileContents
 * @returns {number} weight
 */
const part1 = (fileContents) => {
  // Convert input string[] to 2d string[][]
  let grid = fileContents.map((l) => l.split(""));
  // Move all boulders to the north
  moveToTop(grid);
  // Get the total weight
  return weight(grid);
};

/**
 * Simulate one cycle of the
 * @param {string[][]} grid
 * @returns
 */
const simulateCycle = (grid) => {
  moveToTop(grid); // North
  grid = transposeGrid(grid);
  grid = reverseGrid(grid); // West at top
  moveToTop(grid); // West
  grid = transposeGrid(grid);
  grid = reverseGrid(grid); // South at top
  moveToTop(grid); // South
  grid = transposeGrid(grid);
  grid = reverseGrid(grid); // East at top
  moveToTop(grid); // East
  grid = transposeGrid(grid);
  grid = reverseGrid(grid); // North at top

  return grid;
};

/**
 * Reverse each row in the grid
 * @param {string[][]} grid
 * @returns
 */
const reverseGrid = (grid) => {
  return grid.map((l) => l.reverse());
};

/**
 * Flip the grid along the x/y axis to make horizontal lines vertical and vice versa
 * @param {string[]} grid
 * @returns {string[]}
 */
const transposeGrid = (grid) => {
  return grid[0].map((_, x) => grid.map((_, y) => grid[y][x]));
};

/**
 * Move all boulders to the top of the grid as far as they will go
 * @param {string[][]} grid
 */
const moveToTop = (grid) => {
  // Check each space starting ast the top of the grid
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      // If a boulder is found move it
      if (grid[y][x] == "O") {
        // Find how far it can move by checking each row
        // above it for the obstacles in this column until
        // reaching the top of the grid
        let moveDistance = 0;
        for (let row = y; row > 0; row--) {
          let above = grid[row - 1][x];
          if (above == ".") {
            moveDistance++;
          } else {
            break;
          }
        }
        // If it can move at least one space move iut up to that new space
        if (moveDistance > 0) {
          grid[y - moveDistance][x] = "O";
          grid[y][x] = ".";
        }
      }
    }
  }
};

/**
 * Calculate the weight of each boulder
 * @param {string[][]} grid
 * @returns
 */
const weight = (grid) => {
  let total = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "O") {
        total += grid.length - y;
      }
    }
  }

  return total;
};
