// Puzzle for Day 11: https://adventofcode.com/2018/day/11

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Get the serial number from the first line of the file input
  const serialNum = parseInt(fileContents[0]);

  // Create the grid with the power levels for each location
  const grid = createGrid(serialNum);

  // Find the best power square that is 3x3
  const result = findMostPowerSquare(grid, 3);

  // Find the power square size that has the most power
  const result2 = findBestSquare(grid);

  return {
    part1: `${result.bestX},${result.bestY}`,
    part2: `${result2.bestX},${result2.bestY},${result2.bestSize}`,
  };
};

// Find the best squasre size to get the most power from the grid
const findBestSquare = (grid) => {
  // The best result found so far and the size of the best result
  let bestResult = null;
  let bestSize = 0;

  // Check each size to find the one that gets the most power
  for (let size = 1; size <= 300; size++) {
    // Find the best square for the current sqaure size
    let result = findMostPowerSquare(grid, size);
    // If this is the best found so far then save it and the current size
    if (bestResult === null || bestResult.bestTotal < result.bestTotal) {
      bestResult = result;
      bestSize = size;
    }

    // If the total power returned is no longer positive then break out
    // since it will never go positive again.
    // https://en.wikipedia.org/wiki/Convolution
    if (result.bestTotal < 0) break;
  }

  return { ...bestResult, bestSize };
};

// Find the square with the most power in the grid based on the square size
const findMostPowerSquare = (grid, squareSize) => {
  // Get best top left X and Y and best total for that square
  let bestX = 0;
  let bestY = 0;
  let bestTotal = Number.MIN_SAFE_INTEGER;

  // The max x or y top left value so that the square is always in a valid area
  let maxVal = 300 - squareSize + 1;

  // Start at 1,1 and continue across each row
  for (let y = 1; y <= maxVal; y++) {
    for (let x = 1; x <= maxVal; x++) {
      // the total for this square and the max x and y for the current square
      let total = 0;
      let maxY = y + squareSize - 1;
      let maxX = x + squareSize - 1;

      // Sum up the total for the square
      for (let sqY = y; sqY <= maxY; sqY++) {
        for (let sqX = x; sqX <= maxX; sqX++) {
          total += grid[sqY][sqX];
        }
      }

      // If this it the best total seen so far then save it
      if (total > bestTotal) {
        bestTotal = total;
        bestX = x;
        bestY = y;
      }
    }
  }

  return { bestX, bestY, bestTotal };
};

// Create the grid with the power levels for each cell
const createGrid = (serialNum) => {
  // The resulting grid of power cells
  let grid = [];

  // Fill each square for the 300x300 grid
  for (let y = 1; y <= 300; y++) {
    // Add a new array for the row
    grid[y] = [];
    // Fill each row of the grid
    for (let x = 1; x <= 300; x++) {
      // Get the Rack ID
      const rackId = x + 10;
      // Initial power level
      let powerLevel = rackId * y;
      // Add serial number
      powerLevel += serialNum;
      // Multiply by rack ID
      powerLevel *= rackId;
      // Get the hundreds digit by dividing by 100 and flooring
      // the value to remove the ones and tens digits. Mod this
      // by 10 to get the new ones digit which is the original
      // hundreds digit.
      powerLevel = Math.floor(powerLevel / 100) % 10;
      // Subtract 5 to get the final powerlevel
      powerLevel -= 5;
      // Assign this grid location the final power level
      grid[y][x] = powerLevel;
    }
  }

  return grid;
};
