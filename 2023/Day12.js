// Puzzle for Day 12: https://adventofcode.com/2023/day/12

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let result1 = solver(fileContents);
  let result2 = solver(fileContents, 5);

  return { part1: result1, part2: result2 };
};

const solver = (fileContents, multiplier = 1) => {
  let totalValid = 0;
  for (let line of fileContents) {
    // Split the input line into spring info and run info
    let [springsData, damagedNotesData] = line.split(" ");
    // Multiply the input as many times as needed
    let springs = [];
    let runs = [];
    for (let x = 0; x < multiplier; x++) {
      springs.push(springsData);
      runs.push(damagedNotesData.split(","));
    }
    // Get the multiplied input into ready to use states
    runs = runs.flat().map((x) => parseInt(x));
    springs = springs.join("?");

    // Count the ways this can be interpreted
    totalValid += countWays(springs, runs);
  }

  return totalValid;
};

/**
 * This dynamic programming solution was written by Nathan Fenner who posted this
 * in the solutions thread on reddit. I have adapted this from typescript to
 * javascript and attempted to better explain how the solution works.
 * Reddit: https://www.reddit.com/r/adventofcode/comments/18ge41g/comment/kd09kvj/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
 * Code:   https://gist.github.com/Nathan-Fenner/781285b77244f06cf3248a04869e7161
 *
 * Lines of springs will be considered one spring at a time. If the beginning
 * of the line is ? they will be replaced with both possible options and reevaluated
 * to see if the line can still possibly result in a solution. As runs are found
 * they are also eliminated until there are none left resulting in a valid solution
 * adding to the total.
 */
const countWays = memoize((line, runs) => {
  // If all springs in the line have been considered and all runs completed then this is a valid
  // solution so return 1 to add to the total otherwise return 0 since this is invalid
  if (line.length === 0) {
    if (runs.length === 0) {
      return 1;
    }
    return 0;
  }

  // If all runs have been completed and the line contains no more broken
  // springs return 1 otherwise return 0
  if (runs.length === 0) {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "#") {
        return 0;
      }
    }
    return 1;
  }

  // If there are not enough remaining characters in the line to complete all of the runs then return 0
  let sumRuns = runs.reduce((total, val) => (total += val), 0);
  if (line.length < sumRuns + runs.length - 1) {
    // The line is not long enough for all runs
    return 0;
  }

  // If the next character is set as a good spring slice it off and continue processing
  if (line[0] === ".") {
    return countWays(line.slice(1), runs);
  }
  // If the next spring is broken see if the run can be completed
  if (line[0] === "#") {
    const [run, ...leftoverRuns] = runs;
    // If the next run has a good spring break in it then return 0.
    // Unknown springs can be assumed to be part of the run. If this
    // does not work out later on that will be figured out then.
    for (let i = 0; i < run; i++) {
      if (line[i] === ".") {
        return 0;
      }
    }
    // If there is a broken spring beyond the next run then return 0
    if (line[run] === "#") {
      return 0;
    }

    // Otherwise this run was found successfully using # and ?. Slice the run
    // and the following space off the line and continue with the remaining runs
    return countWays(line.slice(run + 1), leftoverRuns);
  }
  // Otherwise this must be a ? so select both possibilities and continue with them
  return (
    countWays("#" + line.slice(1), runs) + countWays("." + line.slice(1), runs)
  );
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
