// Puzzle for Day 07: https://adventofcode.com/2021/day/7

export const run = (fileContents) => {
  // Sort values from the input
  const vals = fileContents[0]
    .split(",")
    .map((num) => parseInt(num))
    .sort((a, b) => (a === b ? 0 : a < b ? -1 : 1));

  // Solve each part
  const part1 = bestFuelUsage(vals, false);
  const part2 = bestFuelUsage(vals, true);

  return { part1, part2 };
};

/**
 * Solve for the best fuel usage
 * @param {number[]} vals The sorted position values
 * @param {boolean} part2 True if calculating fuel usage based on Part 2 rules
 * @returns {number} The best fuel usage
 */
const bestFuelUsage = (vals, part2) => {
  // Find the median since the optimal position should be at or near that
  const median = vals[vals.length / 2];

  // Save the minimum fuel usage and the position it occurs at
  let minFuel = Infinity;

  // Keep tracked of the previously checked positions
  const checked = new Set();
  // A queue of the positions that need to be checked
  const queue = [median];

  // Continue which there are still locations to check
  while (queue.length > 0) {
    // Get the current positions to check and add it to the checked set
    let currentPos = queue.shift();
    checked.add(currentPos);

    // Calculate total fuel using part 1 or part 2 calculations
    let totalFuel = !part2
      ? // Part 1 absolute value fuel usage
        vals.reduce(
          (total, subPos) => (total += Math.abs(currentPos - subPos)),
          0,
        )
      : // Part 2 triangle number fuel usage
        // https://math.stackexchange.com/questions/593318/factorial-but-with-addition
        vals.reduce((total, subPos) => {
          let dist = Math.abs(currentPos - subPos);
          return (total += (dist * (dist + 1)) / 2);
        }, 0);

    // Check if this is the minimum found
    if (totalFuel < minFuel) {
      // If minimum save the fuel usage
      minFuel = totalFuel;

      // Check the adjacent positions only if they have not already been checked
      [currentPos + 1, currentPos - 1].forEach((val) =>
        !checked.has(val) ? queue.push(val) : null,
      );
    }
  }

  return minFuel;
};
