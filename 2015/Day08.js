// Puzzle for Day 8: https://adventofcode.com/2015/day/8

export const run = (fileContents) => {
  // Collect the totals for the original code string lengths,
  // memory string lengths, and encoded string lengths
  let codeTotal = 0;
  let memoryTotal = 0;
  let encodedTotal = 0;
  // Iterate through each line of the file which has one string per line
  for (const line of fileContents) {
    // Original code length of the string written as it is in the file
    let codeLength = line.length;
    // Memory length of the string once read into memory
    let memoryLength = eval(line).length;
    // Encoded length of the string once run thorugh JSON string encoding
    let encodedLength = JSON.stringify(String.raw`${line}`).length;
    // Add lengths to the totals
    codeTotal += codeLength;
    memoryTotal += memoryLength;
    encodedTotal += encodedLength;
  }

  return { part1: codeTotal - memoryTotal, part2: encodedTotal - codeTotal };
};
