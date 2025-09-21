// Puzzle for Day 19: https://adventofcode.com/2024/day/19

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let data = parseInput(fileContents);
  let result = findAllCombos(data.available, data.patterns);
  return { part1: result.total1, part2: result.total2 };
};

/**
 * Find all of the combinations for all patterns
 * @param {string[]} available The array of towels available at the hotel
 * @param {*} patterns The patterns to make out of the towels
 * @returns {{total1: number, total2: number}} The solutions to part 1 and 2 of the puzzle
 */
const findAllCombos = (available, patterns) => {
  // Track the solutions to part 1 and 2 of the puzzle
  let total1 = 0;
  let total2 = 0;
  // Check each pattern
  for (let pattern of patterns) {
    // Find the number of towel combinations for each pattern
    let answers = findCombos(available, pattern);
    // If there are answers update the totals for each part accordingly
    if (answers > 0) {
      total1++;
      total2 += answers;
    }
  }
  return { total1, total2 };
};

/**
 * Find the towel combination count for this pattern recursively.
 * Memoization is a big time saver here since many patterns may
 * ask to compute the number of towels that match any given pattern.
 * @param {string[]} availableTowels The array of available towels
 * @param {string} pattern The pattern to create from the towels
 * @return The number of combinations of towels that match this pattern
 */
const findCombos = memoize((availableTowels, pattern) => {
  // If the pattern is empty then the original pattern has found
  // a matching sequence of towels to return 1 for this sequence
  if (pattern.length === 0) return 1;

  // Total number of patterns
  let result = 0;
  // Find any towels that match the start of the pattern
  let possibleTowels = availableTowels.filter((towel) =>
    pattern.startsWith(towel),
  );

  // Check each possibility
  for (let towel of possibleTowels) {
    // Get the remaining part of the pattern after removing the towel
    let remaining = pattern.substring(towel.length);
    // Recurse to find the number of towel combinations that match the
    // remaining portion of the pattern
    result += findCombos(availableTowels, remaining);
  }
  return result;
});

/**
 * Parse the input into useable data
 * @param {string[]} fileContents The line of the input file as a string array
 * @returns {available: string[], patterns: string[]} The available towels and the patterns to make with them
 */
const parseInput = (fileContents) => {
  // True while parsing the available towels
  let availableMode = true;
  // The available towels and the patterns to make with them
  let available;
  let patterns = [];

  // Parse each line
  for (let line of fileContents) {
    // A blank line means to switch over to parsing patterns instead of available towels
    if (line === "") {
      availableMode = false;
      continue;
    }

    // Parse in the available towels
    if (availableMode)
      available = line.split(", ").sort((a, b) => b.length - a.length);
    // Add each pattern to the patterns array
    else patterns.push(line);
  }
  return { available, patterns };
};

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
