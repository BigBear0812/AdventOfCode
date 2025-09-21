// Puzzle for Day 5: https://adventofcode.com/2017/day/5

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse each lione of the input as a new number in the jumps array
  let jumps = [];
  for (let line of fileContents) {
    jumps.push(parseInt(line));
  }
  // Copy the jumps array to be used for each part
  let jumps1 = JSON.parse(JSON.stringify(jumps));
  let jumps2 = JSON.parse(JSON.stringify(jumps));

  // Process each part until escaping the array
  let result1 = processJumps(jumps1);
  let result2 = processJumps(jumps2, true);

  return { part1: result1, part2: result2 };
};

// Process the jumps from the array until the current index exits the array
const processJumps = (jumps, part2 = false) => {
  // The number of steps taken to exist the array and the
  // current index of the jump value being processed
  let stepsCount = 0;
  let index = 0;

  // Continue processing while the index of the next jump
  // command is still a valid index in the array
  while (index >= 0 && index < jumps.length) {
    // Get the dist the index will be moving
    let dist = jumps[index];

    // Find whether to increase or decrease the value at this index
    if (part2 && dist >= 3) jumps[index]--;
    else jumps[index]++;

    // Update the index based on the distance found
    index += dist;
    // Increment the step count
    stepsCount++;
  }

  return stepsCount;
};
