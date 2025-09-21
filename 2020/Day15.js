// Puzzle for Day 15: https://adventofcode.com/2020/day/15

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse in the starting numbers from the input
  let startingNums = fileContents[0].split(",").map((x) => parseInt(x));

  // Keep track of the result for part 1 and 2 and when the result will appear in the sequence
  let result1, result2;
  let result1At = 2020 - 1;
  let result2At = 30000000 - 1;
  // Keep track of the times that the number will appear and the last number spoken
  let memory = new Map();
  let lastNum;
  // Continue simulating rounds until both results are found
  for (let x = 0; !result1 || !result2; x++) {
    // If there are still starting numbers to call out call them out
    if (x < startingNums.length) {
      lastNum = startingNums[x];
    }
    // Otherwise find the next number to call based on the last number
    else if (memory.has(lastNum)) {
      // Get the last number from memory
      let lastSpoken = memory.get(lastNum);
      // If this is the first time it was spoken call 0
      if (lastSpoken.length === 1) lastNum = 0;
      // Otherwise call the difference between this time it was spoken and the last time it was spoken
      else
        lastNum =
          lastSpoken[lastSpoken.length - 1] - lastSpoken[lastSpoken.length - 2];
    }
    // Add the number spoken for this round to memory or update it
    let currentRecord = memory.get(lastNum);
    if (!currentRecord) currentRecord = [x];
    else currentRecord.push(x);
    memory.set(lastNum, currentRecord);

    // If this round is the result for either part then record it as a result
    if (x === result1At) result1 = lastNum;
    if (x === result2At) result2 = lastNum;
  }

  return { part1: result1, part2: result2 };
};
