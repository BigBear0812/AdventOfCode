// Puzzle for Day 03: https://adventofcode.com/2021/day/3

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Convert the input into a 2D array of integer values
  const info = fileContents.map((line) =>
    line.split("").map((num) => parseInt(num)),
  );
  const colCount = info[0].length;

  // Part 1

  // Track the values for each position of the gamma and epsilon values
  const gammaRateArray = [];
  const epsilonRateArray = [];

  // Consider each column
  for (let col = 0; col < colCount; col++) {
    // Get the counts of 1's and 0's
    const counts = colCounts(info, col);
    // Update the gamma and epsilon arrays
    if (counts[0] > counts[1]) {
      gammaRateArray.push(0);
      epsilonRateArray.push(1);
    } else {
      gammaRateArray.push(1);
      epsilonRateArray.push(0);
    }
  }

  // Convert the array of 1's and 0's into a decimal numbers
  const gammaRate = parseInt(gammaRateArray.join(""), 2);
  const epsilonRate = parseInt(epsilonRateArray.join(""), 2);
  // Calculate the final value
  const part1 = gammaRate * epsilonRate;

  // Part 2

  // O2 and CO2 copies of the report info
  const O2Info = JSON.parse(JSON.stringify(info));
  const CO2Info = JSON.parse(JSON.stringify(info));

  // Find O2 Value
  for (let col = 0; col < colCount && O2Info.length > 1; col++) {
    // Get the counts of 1's and 0's
    const counts = colCounts(O2Info, col);
    // Get the highest count value defaulting to 1 if equal
    const colValue = counts[1] >= counts[0] ? 1 : 0;
    // Remove rows that do not have a matching value in this column
    removeRows(O2Info, col, colValue);
  }

  // Find CO2 Value
  for (let col = 0; col < colCount && CO2Info.length > 1; col++) {
    // Get the counts of 1's and 0's
    const counts = colCounts(CO2Info, col);
    // Get the lowest count value defaulting to 0 if equal
    const colValue = counts[0] <= counts[1] ? 0 : 1;
    // Remove rows that do not have a matching value in this column
    removeRows(CO2Info, col, colValue);
  }

  // Convert the array of 1's and 0's into a decimal numbers
  const O2Rate = parseInt(O2Info[0].join(""), 2);
  const CO2Rate = parseInt(CO2Info[0].join(""), 2);
  // Calculate the final value
  const part2 = O2Rate * CO2Rate;

  return { part1, part2 };
};

/**
 * Find the count of 0's and 1's in a given column of an array
 * @param {[][number]} array The array
 * @param {number} col The column index
 * @returns {[number]} The counts of 0's and 1's
 */
const colCounts = (array, col) => {
  // Track the counts of 1's and 0's
  const counts = new Array(2).fill(0);
  // Update the appropriate count for each row
  for (let row = 0; row < array.length; row++) {
    counts[array[row][col]] += 1;
  }
  return counts;
};

/**
 * Remove rows from the array whose col does not match the column value
 * @param {[][number]} array The array to update
 * @param {*} col The column to compare to
 * @param {*} colValue The column value to match against
 */
const removeRows = (array, col, colValue) => {
  for (let row = 0; row < array.length && array.length > 1; row++) {
    if (array[row][col] != colValue) {
      array.splice(row, 1);
      row--;
    }
  }
};
