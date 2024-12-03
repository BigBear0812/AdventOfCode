// Puzzle for Day 03: https://adventofcode.com/2024/day/3

export const run = (fileContents) => {
  // Join the memory dump into a single string
  let memory = fileContents.join('');
  let result1 = part1(memory);
  let result2 = part2(memory);
  return {part1: result1, part2: result2};
}

/**
 * Part 2 Solution
 * @param {string} memory Memory Dump
 * @returns Result of instructions
 */
const part2 = (memory) => {
  // Match all mul, do, and don't instructions
  let matches = [...memory.matchAll(/(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\))/g)];
  // Save the total and start with mul functions on
  let total = 0;
  let mulOn = true;
  // Evaluate each of the matches instructions one at a time in order
  for(let match of matches){
    // If this is a mul instruction and mul instructions are on execute 
    // the functions and add them to the total
    if(match[1].startsWith("mul(") && mulOn)
      total += parseInt(match[2]) * parseInt(match[3]);
    // Turn mul functions on
    else if(match[1].startsWith("do("))
      mulOn = true;
    // Turn mul functions off
    else if(match[1].startsWith("don't("))
      mulOn = false;
  }
  return total;
}

/**
 * Part 1 Solution
 * @param {string} memory Memory Dump
 * @returns Result of instructions
 */
const part1 = (memory) => {
  // Match all mul instructions and inside each mul match the function values
  let matches = [...memory.matchAll(/(mul\((\d{1,3}),(\d{1,3})\))/g)];
  // Compute the total of the result of all mul instructions
  return matches.reduce((total, val) => total + (parseInt(val[2]) * parseInt(val[3])), 0);
}