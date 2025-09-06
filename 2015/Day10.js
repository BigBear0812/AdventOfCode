// Puzzle for Day 10: https://adventofcode.com/2015/day/10

export const run = (fileContents) => {
  // Parse input starting number
  let start = fileContents[0].split("").map((x) => parseInt(x));

  // Calculate the finsl output for iterating this sequence 40 times and 50 times each
  let forty = lookAndSayNumberSequence(start, 40);
  let fifty = lookAndSayNumberSequence(start, 50);

  return { part1: forty.length, part2: fifty.length };
};

// Look-and-Say number sequence iterator
const lookAndSayNumberSequence = (start, iterations) => {
  // Set the start seed number array as the current
  let current = start;

  // Iterate the pattern the given number of times
  for (let c = 0; c < iterations; c++) {
    // Store the next output, current group being counted, and the gound of that group
    let output = [];
    let group = -1;
    let groupCount = 0;
    // Iterate over each value of the current array
    for (const val of current) {
      // If a new groupd it found
      if (val !== group) {
        // If this this is not the firts group found ad the last group
        // count and value to the new output
        if (group !== -1) {
          output.push(groupCount);
          output.push(group);
        }
        // Set the new goup being tracked and set the count to 1
        group = val;
        groupCount = 1;
      }
      // If this val is the same as the previous this is not a new group so
      // add 1 to the current count for this group
      else {
        groupCount++;
      }
    }
    // Add the final group count and the final group val to the output
    output.push(groupCount);
    output.push(group);
    // Set the current to the output for the next round to to be returned.
    current = output;
  }

  return current;
};
