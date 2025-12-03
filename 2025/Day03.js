// Puzzle for Day 03: https://adventofcode.com/2025/day/3

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Split each line into characters and parse each string number as an int.
  const batBanks = fileContents.map((line) =>
    line.split("").map((bat) => parseInt(bat)),
  );

  // Solve both parts
  const part1 = solution(batBanks, 2);
  const part2 = solution(batBanks, 12);
  return { part1, part2 };
};
/**
 * Solves the puzzle using a search for the next best number to add
 * @param {number[][]} batBanks The battery bank information
 * @param {number} numBats The number of batteries to activate for the bank
 */
const solution = (batBanks, numBats) => {
  // Keep track of the total joltage for all banks
  let total = 0;

  // Check each bank
  for (const bank of batBanks) {
    // Keep track of the best joltage for this bank and the position it was found at
    let best = 0;
    let lastPos = -1;
    // Complete each round searching through the possible positions for the next battery to turn on
    for (let round = 0; round < numBats; round++) {
      // Best total joltage achieved this round and the position the new digit was found at
      let bestForRound = 0;
      let bestPosForRound = null;
      // Get the next positions to check
      let nextPosToCheck = [
        ...positionsToCheck(bank.length, numBats - round, lastPos),
      ];
      // Check all next positions
      while (nextPosToCheck.length) {
        // Get the next position and the updated joltage turning it on would produce
        let nextPos = nextPosToCheck.pop();
        let next = best * 10 + bank[nextPos];
        // If this is better than what has been found then then save it and the position
        if (next > bestForRound) {
          bestForRound = next;
          bestPosForRound = nextPos;
        }
        // If this is equal to the best found but the position it was found at is less
        // then update the best positions since a lower position value is always better
        else if (next === bestForRound && nextPos < bestPosForRound) {
          bestPosForRound = nextPos;
        }
      }

      // Update the best and last position at the end of the round
      best = bestForRound;
      lastPos = bestPosForRound;
    }

    // Update the total
    total += best;
  }

  return total;
};

/**
 * Get the next possible positions for the next battery in the bank to be turned.
 * @param {number} length The length of the battery bank
 * @param {number} numBats The number of bats to turn on in the bank
 * @param {number} startPos The starting position to look for the next digit after
 * @returns {number[]}The positions the current value could be in.
 */
const positionsToCheck = memoize((length, numBats, startPos) => {
  // Batteries must always be far enough forward in the bank to allow for more to come
  // after then otherwise it cannot be the next value in the number. Then filter out any
  // starting values that are at or before the starting position of the last battery turned on.
  return [...Array(length - numBats + 1).keys()].filter((i) => i > startPos);
});

/**
 * Memoizes the input of the function and caches the results in a hash map.
 * Must be written like this to make it's scope global to the module
 * @param {*} func The function to cache the result of
 * @returns The result of the inputs
 */
function memoize(func) {
  // Create a cache. Using a hash map is exponentially faster than a plain object
  const cache = new Map();

  return function (...args) {
    // Get the JSON string of the args
    const key = JSON.stringify(args);

    // Check if this value has been cached and return it if found
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Otherwise run function and get the result to cache
    const result = func.apply(this, args);
    cache.set(key, result);

    return result;
  };
}
