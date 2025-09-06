// Puzzle for Day 25: https://adventofcode.com/2024/day/25

export const run = (fileContents) => {
  let data = parseInput(fileContents);
  let result1 = part1(data);
  return { part1: result1, part2: null };
};

/**
 * Part 1 Solution
 * @param {{locks: number[][], keys: number[][]}} data The input lock and key data
 * @returns {number} The number of lock and key matches
 */
const part1 = (data) => {
  // Count how many key and lock combinations fit together
  let fitCount = 0;
  // Compare every key with every lock
  for (let lock of data.locks) {
    for (let key of data.keys) {
      // If the sum of each column is less than 5 there will be no overlaps between
      // the key and lock pins and will be considered a fit
      if (
        lock[0] + key[0] <= 5 &&
        lock[1] + key[1] <= 5 &&
        lock[2] + key[2] <= 5 &&
        lock[3] + key[3] <= 5 &&
        lock[4] + key[4] <= 5
      ) {
        fitCount++;
      }
    }
  }
  return fitCount;
};

/**
 * Parse the input data
 * @param {string[]} fileContents The lines of the input file as a string array
 * @returns {{locks: number[][], keys: number[][]}} The key and lock arrays
 */
const parseInput = (fileContents) => {
  // Store the lock and key patterns
  let locks = [];
  let keys = [];
  // Is this a key or lock being stored
  let mode;
  // Buffer for counting the used spaces in each column
  let buffer = [0, 0, 0, 0, 0];

  // Parse in lines 8 at a time to cover an entire key or lock
  for (let l = 0; l < fileContents.length; l += 8) {
    // Check the first line to determine if this is a lock or key
    mode = fileContents[l] === "#####" ? "lock" : "key";

    // Parse in the next 5 lines as the pins in the line or key
    for (let kl = l + 1; kl <= l + 5; kl++) {
      // Split the current line in to it characters
      let lineChars = fileContents[kl].split("");
      // Update the buffer with corresponding character
      // index if the character is a #
      for (let c = 0; c < 5; c++) {
        if (lineChars[c] === "#") buffer[c]++;
      }
    }

    // Add the buffer to the correct array
    if (mode === "lock") locks.push(buffer);
    else keys.push(buffer);

    // Reset the buffer
    buffer = [0, 0, 0, 0, 0];
  }
  return { locks, keys };
};
