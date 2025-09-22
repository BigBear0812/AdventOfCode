// Puzzle for Day 14: https://adventofcode.com/2021/day/14

// Polymerization Map
const polymerization = new Map();

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Polymer character starting array
  let polymer = [];
  // Flag to parse either the input polymer or the polymerization map
  let parsePolymer = true;
  // Parse in each line
  fileContents.forEach((line) => {
    // On the blank line toggle the flag
    if (line === "") {
      parsePolymer = false;
      return;
    }

    // Prase in the initial polymer into an array
    if (parsePolymer === true) {
      polymer = line.split("");
    }
    // Otherwise add a a new item to the polymerization map
    else {
      const matches = line.match(/([A-z]+) -> ([A-z]+)/);
      polymerization.set(matches[1], matches[2]);
    }
  });

  // Part 1
  const part1 = runSimulation(polymer, 10);

  // Part 2
  const part2 = runSimulation(polymer, 40);

  return { part1, part2 };
};

/**
 * Runs a simulation for a single part of the puzzle
 * @param {string[]} polymer The initial polymer
 * @param {number} steps The number of steps to simulate
 * @returns {number} Final part answer
 */
const runSimulation = (polymer, steps) => {
  // Get the initial count of items in the polymer array
  const counts = polymer.reduce((counts, element) => {
    updateCounts(counts, element);
    return counts;
  }, {});

  // Recurse to find the elements that will be added
  const subCounts = recursiveSolution(polymer, steps);

  // Combine the initial counts with the counts of added sub elements
  combineCounts(counts, subCounts);

  // Get the final answer
  return findAnswer(counts);
};

const recursiveSolution = memoize(
  /**
   * Recurse through the polymers inserted subsections
   * @param {string[]} polymer The current substring of a polymer
   * @param {number} maxSteps The max number of steps for this simulation
   * @param {number} step The current step
   * @returns {Object} The counts of each element
   */
  (polymer, maxSteps, step = 0) => {
    // If the max depth of the recursion is reached return an empty object
    if (step === maxSteps) return {};
    // Create an object to store counts
    const counts = {};
    // Max val for the index
    const maxVal = polymer.length - 2;
    // Get all pairs to find the inserted elements for
    for (let a = 0; a <= maxVal; a++) {
      // Get next element
      const b = a + 1;
      // Create pair string
      const pair = polymer[a] + polymer[b];
      // Get new element to insert
      const element = polymerization.get(pair);
      // Update the counts
      updateCounts(counts, element);
      // Recurse this new polymer section array to find the sub counts
      const subCounts = recursiveSolution(
        [polymer[a], element, polymer[b]],
        maxSteps,
        step + 1,
      );
      // Combine the sub counts with the current counts
      combineCounts(counts, subCounts);
    }

    return counts;
  },
);

/**
 * Find the final answer for a part
 * @param {Object} counts The count of each element
 * @returns {number} Final answer
 */
const findAnswer = (counts) => {
  // Set initial highest and lowest values
  let highest = 0;
  let lowest = Infinity;
  // Check each value and update highest and lowest
  Object.values(counts).forEach((val) => {
    if (val > highest) highest = val;
    if (val < lowest) lowest = val;
  });

  // Return the difference between highest and lowest
  return highest - lowest;
};

/**
 * Combine the sub counts into the current set of counts
 * @param {Object} counts The set of current counts
 * @param {Object} subCounts The new counts to add into the current object of counts
 */
const combineCounts = (counts, subCounts) => {
  // For each element in the sub counts
  Object.keys(subCounts).forEach((key) => {
    // Add or update the counts total for the element
    if (counts[key]) counts[key] += subCounts[key];
    else counts[key] = subCounts[key];
  });
};

/**
 * Add the element to the set of counts for all of the elements
 * @param {Object} counts The set of current counts
 * @param {string} element The element to add to the counts
 */
const updateCounts = (counts, element) => {
  if (counts[element]) counts[element] += 1;
  else counts[element] = 1;
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
