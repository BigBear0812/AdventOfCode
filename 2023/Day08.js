// Puzzle for Day 08: https://adventofcode.com/2023/day/8

export const run = (fileContents) => {
  // Get the solutions for part 1 and 2
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

/**
 * Part 2 Solution
 * @param {string[]} fileContents The input file lines as a string array
 * @return Number of steps to reach from all A to all Z
 */
const part2 = (fileContents) => {
  // Parse instructions
  let instructions = fileContents[0].split("");

  // Create a hash map of all nodes
  let nodes = new Map();
  // Get an array of starting positions and ending positions
  let nodesA = [];
  let nodesZ = [];
  let nodeRegex = /([A-z\d]+) = \(([A-z\d]+), ([A-z\d]+)\)/;
  for (let l = 2; l < fileContents.length; l++) {
    let matches = fileContents[l].match(nodeRegex);
    nodes.set(matches[1], { L: matches[2], R: matches[3] });
    if (matches[1].endsWith("A")) nodesA.push(matches[1]);
    if (matches[1].endsWith("Z")) nodesZ.push(matches[1]);
  }

  // Current position and number of steps to reach it
  let steps = 0;
  let positions = [...nodesA];
  let shortestDistToZ = new Map();
  // Continue until reaching all of the Z nodes
  while (shortestDistToZ.size !== nodesZ.length) {
    // Make the next move for each position
    for (let p = 0; p < positions.length; p++) {
      let moves = nodes.get(positions[p]);
      positions[p] = moves[instructions[steps % instructions.length]];
      // If this position ends with Z and has not been reached before add it to the shortest distance to Z map
      if (positions[p].endsWith("Z") && !shortestDistToZ.has(positions[p]))
        shortestDistToZ.set(positions[p], steps + 1);
    }
    // Increase the number of steps
    steps++;
  }
  // Get the least common multiple of the set of shortest distances
  return lcm_arr(Array.from(shortestDistToZ.values()));
};

// Get the least common multiple of an array of numbers
const lcm_arr = (nums) => {
  // Set the result to the first value in the array
  let result = nums[0];
  // For each number find the LCM of the current result
  // and the next number in the array
  for (let x = 1; x < nums.length; x++) {
    result = lcm_two(result, nums[x]);
  }
  return result;
};

// Get the least common multiple of two numbers
const lcm_two = (a, b) => {
  return Math.abs((a * b) / gcd_two(a, b));
};

// Get the greatest common denominator of two numbers
const gcd_two = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    var temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

/**
 * Part 1 Solution
 * @param {string[]} fileContents The input file lines as a string array
 * @return Number of steps to reach ZZZ from AAA
 */
const part1 = (fileContents) => {
  // Parse instructions
  let instructions = fileContents[0].split("");

  // Create a hash map of all nodes
  let nodes = new Map();
  let nodeRegex = /([A-z\d]+) = \(([A-z\d]+), ([A-z\d]+)\)/;
  for (let l = 2; l < fileContents.length; l++) {
    let matches = fileContents[l].match(nodeRegex);
    nodes.set(matches[1], { L: matches[2], R: matches[3] });
  }

  // Current position and number of steps to reach it
  let steps = 0;
  let pos = "AAA";
  // Continue until reaching the end
  while (pos !== "ZZZ") {
    // Make the next move and increase the number of steps
    let moves = nodes.get(pos);
    pos = moves[instructions[steps % instructions.length]];
    steps++;
  }

  return steps;
};
