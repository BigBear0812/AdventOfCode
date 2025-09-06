// Puzzle for Day 10: https://adventofcode.com/2020/day/10

export const run = (fileContents) => {
  // Map the file contents into ints and order them from smallest to largest
  let data = fileContents
    .map((x) => parseInt(x))
    .sort((a, b) => {
      if (a > b) return 1;
      else if (a < b) return -1;
      else return 0;
    });

  // Add a number for the outlet starting at 0
  data.unshift(0);

  // Add a number for the adapter built into the device which
  // is always 3 more than the highest (last) number
  data.push(data[data.length - 1] + 3);

  // Count the number of differences of each type in the set of adapters
  // Turns out all adapters either have a difference of 1 or 3
  let differences = [0, 0, 0, 0];
  // Track groups of adapters that cane be removed. Turns out no
  // group is ever larger than 3 adapters
  let groups = [];
  let group = [];
  // Examine each adapter in the data
  for (let x = 1; x < data.length; x++) {
    // Find the difference between this and the last adapter
    let diff = data[x] - data[x - 1];
    // Add this to the array counting adapter differences
    differences[diff]++;
    // If the difference is only 1 and the difference between this and the
    // next adapter is also 1 add it to a group of removable adapters
    if (diff === 1 && data[x + 1] - data[x] === 1) {
      group.push(data[x]);
    }
    // Otherwise check if we have reached the end of a group.
    // If so add this group to the list of all groups
    else if (group.length > 0) {
      groups.push(JSON.parse(JSON.stringify(group)));
      group = [];
    }
  }

  // Do the multiplication for part 1
  let result1 = differences[1] * differences[3];

  // For each group find the number of combinations that can be made and multiply
  // that with the number of combinations for every other group
  let result2 = groups.reduce((total, g) => {
    switch (g.length) {
      // For a group of size 1 this this has 2 possibilities 2^1
      case 1:
        return total * 2;
      // For a group of size 2 this this has 4 possibilities 2^1
      case 2:
        return total * 4;
      // For a group of size 3 this this has 7 possibilities 2^1 - 1
      // since not including any of the chargers is not an option for this group
      case 3:
        return total * 7;
    }
  }, 1);

  return { part1: result1, part2: result2 };
};
