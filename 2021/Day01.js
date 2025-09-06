// Puzzle for Day 01: https://adventofcode.com/2021/day/1

export const run = (fileContents) => {
  // Part 1
  const part1 = fileContents
    // Convert each number from a string to a number
    .map((numStr) => parseInt(numStr))
    // Find the total number of increases
    .reduce((total, num, index, array) => {
      // Skip the first value
      if (index === 0) return 0;
      // Get the previous value
      const prev = array[index - 1];
      // If the previous value is less than the current value add 1 to the total
      if (prev < num) {
        return total + 1;
      }
      // Otherwise pass along the current total
      return total;
    }, 0);

  // Part 2
  const part2 = fileContents
    // Convert each number from a string to a number
    .map((numStr) => parseInt(numStr))
    // Create an array of the totals of the sliding windows
    .map((num, index, array) => {
      // Return the window total of -1 if this is the first or second index
      if (index === 0 || index === 1) return -1;
      // Get the last 2 values
      const prev2 = array[index - 2];
      const prev1 = array[index - 1];
      // Return the sliding window total
      return num + prev1 + prev2;
    })
    // Filter to include only the positive values
    .filter((num) => num > 0)
    // Find the total number of increases
    .reduce((total, num, index, array) => {
      // Skip the first value
      if (index === 0) return 0;
      // Get the previous value
      const prev = array[index - 1];
      // If the previous value is less than the current value add 1 to the total
      if (prev < num) {
        return total + 1;
      }
      // Otherwise pass along the current total
      return total;
    }, 0);

  return { part1, part2 };
};
