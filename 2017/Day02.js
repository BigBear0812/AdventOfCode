// Puzzle for Day 2: https://adventofcode.com/2017/day/2

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Regex to eaxtract all numbers from a line and put them in an array
  let reg = new RegExp(/(\d+)/g);
  // The 2D array fo numbers on the spreadsheeet
  let grid = [];

  // For each line use regex to extract the digits
  // in order and parse them all as integers. Then
  // add this array to the grid
  for (let line of fileContents) {
    let row = line.match(reg).map((x) => parseInt(x));
    grid.push(row);
  }

  // Part 1
  let sum1 = 0;
  for (let row of grid) {
    // Find the lowest and highest values for each row
    let lowest = Number.MAX_SAFE_INTEGER;
    let highest = Number.MIN_SAFE_INTEGER;
    for (let num of row) {
      if (num < lowest) lowest = num;
      if (num > highest) highest = num;
    }
    // Add the difference between the lowest and highest
    // values for each row to the sum for this grid
    sum1 += highest - lowest;
  }

  // Part 2
  let sum2 = 0;
  for (let row of grid) {
    // Find the evenly dividing numbers in each row. Take the
    // result of their dividsion as the result for this row
    let rowResult = null;
    for (let x = 0; x < row.length && rowResult === null; x++) {
      for (let y = x + 1; y < row.length && rowResult === null; y++) {
        // Use modulus to find which numbers divide evenly (aka having 0 remainder)
        if (row[x] % row[y] === 0) rowResult = row[x] / row[y];
        else if (row[y] % row[x] === 0) rowResult = row[y] / row[x];
      }
    }
    // Add the result for this row to the sum for the grid
    sum2 += rowResult;
  }

  return { part1: sum1, part2: sum2 };
};
