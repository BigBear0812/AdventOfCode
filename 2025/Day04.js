// Puzzle for Day 04: https://adventofcode.com/2025/day/4

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Get a 2D array grid of all of the locations in the input
  const grid = fileContents.map((line) => line.split(""));

  // Convert the input data into a set of locations the rolls of paper are at
  let paperLocs = new Set();
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "@") paperLocs.add(JSON.stringify({ y: y, x: x }));
    }
  }
  // Get the max Y and max X values
  const maxY = grid.length - 1;
  const maxX = grid[0].length - 1;
  const data = { paperLocs, maxX, maxY };

  const part1 = solution(data, 1);
  const part2 = solution(data);
  return { part1, part2 };
};

/**
 * Find the number of rolls to be removed
 * @param {{paperLocs: Set, maxY: number, maxX: number}} data The puzzle data
 * @param {number} maxRounds Maximum number of rounds to simulate
 * @returns The total number of rolls removed
 */
const solution = (data, maxRounds = Infinity) => {
  // Total rolls to be removed
  let totalRemoved = 0;
  // Recreate this object since it will be manipulated so that
  // subsequent simulations will not need to reparse it.
  const paperLocs = new Set(data.paperLocs);
  // Create new objects for the data values that are easier to use
  const maxY = data.maxX;
  const maxX = data.maxY;

  // Run each round one at a time until hitting the max number of rounds
  for (let round = 0; round < maxRounds; round++) {
    // save the locations of rolls to be removed
    let toBeRemoved = [];
    // Check each roll in the set of roll locations
    for (let loc of paperLocs) {
      // Get the basic info for the location
      const locData = JSON.parse(loc);
      const x = locData.x;
      const y = locData.y;

      // Find all surrounding locations
      const surrounding = [];
      surrounding.push({ x: x - 1, y: y - 1 }); // top left
      surrounding.push({ x: x, y: y - 1 }); // top center
      surrounding.push({ x: x + 1, y: y - 1 }); // top right
      surrounding.push({ x: x - 1, y: y }); // left
      surrounding.push({ x: x + 1, y: y }); // right
      surrounding.push({ x: x - 1, y: y + 1 }); // bottom left
      surrounding.push({ x: x, y: y + 1 }); // bottom center
      surrounding.push({ x: x + 1, y: y + 1 }); // bottom right

      // Find which of those locations is valid and has a paper roll in it
      let countSurroundingRolls = surrounding.reduce((total, pos) => {
        if (
          pos.y >= 0 &&
          pos.y <= maxY &&
          pos.x >= 0 &&
          pos.x <= maxX &&
          paperLocs.has(JSON.stringify({ y: pos.y, x: pos.x }))
        )
          return (total += 1);
        else return total;
      }, 0);

      // If there are less than 4 rolls surrounding this one then
      // add it to the list of rolls to be removed.
      if (countSurroundingRolls < 4) toBeRemoved.push({ y, x });
    }

    // If there are no rolls to remove then break out since
    // there will never be anymore rolls to remove
    if (toBeRemoved.length === 0) break;

    // Update the total removed
    totalRemoved += toBeRemoved.length;
    // Remove the rolls from the data set
    for (let toRemove of toBeRemoved) {
      paperLocs.delete(JSON.stringify(toRemove));
    }
  }
  return totalRemoved;
};
