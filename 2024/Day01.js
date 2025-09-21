// Puzzle for Day 01: https://adventofcode.com/2024/day/1

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let lists = createLists(fileContents);
  let result1 = part1(lists);
  let result2 = part2(lists);
  return { part1: result1, part2: result2 };
};

/**
 * Part 2 solution
 * @param {left: number[], right: number[]} lists Lists object
 * @returns Part 2 solution
 */
const part2 = (lists) => {
  // Create a total for the similarity score
  let total = 0;
  // Examine each value in the left list
  for (let x = 0; x < lists.left.length; x++) {
    // Save the total count of times it appears in the right list
    let count = 0;
    // Examine each value in the right list until reaching a number larger the the current value
    for (
      let y = 0;
      y < lists.right.length && lists.right[y] <= lists.left[x];
      y++
    ) {
      // If the values match add one to the count.
      if (lists.right[y] === lists.left[x]) count++;
    }
    // Multiply the count by the value and add to the the total similarity score.
    total += lists.left[x] * count;
  }
  return total;
};

/**
 * Part 1 solution
 * @param {left: number[], right: number[]} lists Lists object
 * @returns Part 1 solution
 */
const part1 = (lists) => {
  // Find the total distance by examining each pair
  let distance = lists.left.reduce((total, leftVal, index) => {
    // Get the right value that corresponds to the left values index
    let rightVal = lists.right[index];
    // Get the absolute value of the difference between the numbers and add it to the total
    return total + Math.abs(leftVal - rightVal);
  }, 0);

  return distance;
};

/**
 * Crate the lists from the input file
 * @param {string[]} fileContents The input file
 * @returns {left: number[], right: number[]} The lists object
 */
const createLists = (fileContents) => {
  // Create a left and right list
  let left = [];
  let right = [];

  // Go over each line of the input
  for (let line of fileContents) {
    // Use regex to match the numbers in the row
    let matches = line.match(/(\d+)\s+(\d+)/);
    // Parse the string numbers to ints and add them to the left and right arrays correctly
    left.push(parseInt(matches[1]));
    right.push(parseInt(matches[2]));
  }

  // Sort the arrays from smallest value to largest.
  left.sort();
  right.sort();

  return { left, right };
};
