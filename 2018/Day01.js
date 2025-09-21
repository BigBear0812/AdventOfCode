// Puzzle for Day 1: https://adventofcode.com/2018/day/1

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // The current frequency
  let frequency = 0;
  // The frequencys seen in the past
  let seenBefore = new Set();
  seenBefore.add(frequency);

  // The part 1 and 2 results
  let part1 = null;
  let part2 = null;

  // Continue looping through the frequency changes until both results have been found
  for (let x = 0; part1 === null || part2 === null; x++) {
    // Save the frequency value for part 1 if this is the end of the changes list
    if (x === fileContents.length) part1 = frequency;

    // Make the next frequency change accounting for reaching the end
    // of the frequency change list using the modulus operator
    frequency += parseInt(fileContents[x % fileContents.length]);

    // If part2 has not been found yet
    if (part2 === null) {
      // If the frequency has been seen before then save it for part 2
      if (seenBefore.has(frequency)) part2 = frequency;
      // Else add this frequency to the set of previously seen frequencies
      else seenBefore.add(frequency);
    }
  }

  return { part1: part1, part2: part2 };
};
