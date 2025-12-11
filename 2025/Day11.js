// Puzzle for Day 11: https://adventofcode.com/2025/day/11

let SERVER_MAP;
/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = async (fileContents) => {
  SERVER_MAP = new Map(
    fileContents.map((line) => {
      let server = line.split(":");
      let connections = server[1].split(" ").filter((conn) => conn);
      return [server[0].trim(), [...connections]];
    }),
  );

  // Find the count of all paths from you to out
  const part1 = findPathsRecursive("you", "out");

  // In part 2 divide the path traversal into sections from start to
  // fft or dac. The from fft to dac and dac to fft. Finally from fft
  // to out and dac to out. This is necessary since we don't know which
  // will come first in the graph.
  const startToDac = findPathsRecursive("svr", "dac");
  const startToFft = findPathsRecursive("svr", "fft");
  const dacToFft = findPathsRecursive("dac", "fft");
  const fftToDac = findPathsRecursive("fft", "dac");
  const fftToOut = findPathsRecursive("fft", "out");
  const dacToOut = findPathsRecursive("dac", "out");

  // Calculate the number of valid paths from each potential route by multiplying
  // each route section together. Then add the number of paths together.
  const part2 = [
    startToDac * dacToFft * fftToOut,
    startToFft * fftToDac * dacToOut,
  ].reduce((total, val) => (total += val), 0);

  return { part1, part2 };
};

/**
 * Find all paths from a start to end point in the sever map using Recursive Depth First Search (DFS)
 * @param {Map} serverMap Map of the servers
 * @param {string} start The starting point
 * @param {string} end The ending point
 * @returns {number} The count of all paths from the start to the end point
 */
const findPathsRecursive = memoize((start, end) => {
  // Track the number of paths found
  let paths = 0;
  // Get the output of the next steps to take
  for (let output of SERVER_MAP.get(start)) {
    // If this is the end add one to the number of paths
    if (output === end) paths += 1;
    // If this output does not exist in the server map then skip it
    else if (!SERVER_MAP.has(output)) continue;
    // Otherwise recurse down to the next level and
    else paths += findPathsRecursive(output, end);
  }
  return paths;
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
