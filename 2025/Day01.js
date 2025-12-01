// Puzzle for Day 01: https://adventofcode.com/2025/day/1

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Regex for parsing in the input lines
  const lineReg = new RegExp(/([RL])(\d+)/);
  // Get the moves data
  const moves = fileContents.map((line) => {
    // Find the matching capture values for the line
    let matches = line.match(lineReg);
    // Create a move object
    return {
      dir: matches[1],
      dis: parseInt(matches[2]),
    };
  });
  // Calculate the results
  const results = numberOfTimeZeroAppears(moves);
  const part1 = results.totalEndedZeros;
  const part2 = results.totalEndedZeros + results.totalPassedZeros;
  return { part1, part2 };
};

/**
 * Calculate the number of time the moves will land on 0
 * @param {{dir: string, dis: number}[]} moves The moves to make
 * @returns {number} The number of the time the sequence of moves lands on 0
 */
const numberOfTimeZeroAppears = (moves) => {
  // Start at position 50
  let start = 50;
  // Track the total number of ending 0's and the total number of passed 0's
  let totalEndedZeros = 0;
  let totalPassedZeros = 0;
  // Set the current position
  let current = start;
  // Process each move in order
  for (let m of moves) {
    // Set the distance to travel for this move
    let distance = m.dis;

    // If the distance to travel is 100 or greater then remove the
    // number of full rotations that are made as passed 0's. This
    // makes the next part simpler by never having it make a full rotation.
    let passedZeros = 0;
    if (distance >= 100) {
      passedZeros += Math.floor(distance / 100);
      distance -= 100 * passedZeros;
    }

    // Track the starting value before the move is made
    let previous = current;
    // Get the current position after the move is made
    current += m.dir === "R" ? distance : distance * -1;
    // Correct for a too high position value
    while (current > 99) {
      current = current - 100;
      // If this value ends at 0 then do not count it as a passed 0.
      // Also, if it started at 0 then this may need a correction but will never pass 0.
      if (current != 0 && previous != 0) passedZeros += 1;
    }
    // Correct for a too low position value
    while (current < 0) {
      current = current + 100;
      // If this value ends at 0 then do not count it as a passed 0.
      // Also, if it started at 0 then this may need a correction but will never pass 0.
      if (current != 0 && previous != 0) passedZeros += 1;
    }
    // Update totals
    if (current === 0) totalEndedZeros += 1;
    totalPassedZeros += passedZeros;
  }

  return { totalEndedZeros, totalPassedZeros };
};
