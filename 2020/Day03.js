// Puzzle for Day 03: https://adventofcode.com/2020/day/3

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the input into a hillside map of a 2d grid
  let hillside = fileContents.map((l) => l.split(""));

  // Get the number of trees hit for each of the different downhill strategies
  let results1x1 = numberTrees(hillside, 1, 1);
  let results3x1 = numberTrees(hillside, 3, 1);
  let results5x1 = numberTrees(hillside, 5, 1);
  let results7x1 = numberTrees(hillside, 7, 1);
  let results1x2 = numberTrees(hillside, 1, 2);

  // Multiply the strategies together for part 2
  let result2 = results1x1 * results3x1 * results5x1 * results7x1 * results1x2;

  return { part1: results3x1, part2: result2 };
};

/**
 * Get the number of trees hit following the downhill pattern
 * described by the change in x and y for each row
 * @param {string[][]} hillside
 * @param {number} deltaX
 * @param {number} deltaY
 * @returns {number} number of trees hit
 */
const numberTrees = (hillside, deltaX, deltaY) => {
  // Get the height and width for the hillside input
  let height = hillside.length;
  let width = hillside[0].length;

  // Always start at open position 0,0
  let pos = { x: 0, y: 0 };

  // Number of trees hit
  let result = 0;

  // Continue checking for positions until reaching the bottom of the hill
  while (pos.y < height) {
    // Update the current position with the delta values
    pos.x += deltaX;
    pos.y += deltaY;

    // If not at the bottom and hitting a tree the add one to the result
    if (pos.y < height && hillside[pos.y][pos.x % width] === "#") result++;
  }

  return result;
};
