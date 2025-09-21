// Puzzle for Day 4: https://adventofcode.com/2019/day/4

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Get the value range from the input file
  let range = fileContents[0].split("-").map((x) => parseInt(x));

  // Results array for parts 1 & 2
  let results1 = [];
  let results2 = [];
  // Check each number to see if it's a fit for the rules
  for (let x = range[0]; x <= range[1]; x++) {
    // Convert the number into and array of digits
    let digits = x
      .toString()
      .split("")
      .map((x) => parseInt(x));
    // Flags for if this number meets the three puzzle requirements
    let validDecreasing = true;
    let validPair = false;
    let validPairAlone = false;

    // Check digits starting with the second digit moving to the last one.
    // If a non-decreasing pair is found immeadiately stop
    for (let d = 1; d < digits.length && validDecreasing === true; d++) {
      // Get the current digit and previous digit
      let curr = digits[d];
      let prev = digits[d - 1];
      // Check for a decresing pattern
      validDecreasing = curr >= prev;
      // Check if this is a matching pair
      let currValidPair = curr === prev;
      // Setup check for this not being a pair by itself
      let currValidPairAlone = false;
      if (currValidPair) {
        // Check if this if a middle digit
        if (d + 1 < digits.length && d > 1) {
          let next = digits[d + 1];
          let prevPrev = digits[d - 2];
          currValidPairAlone = next !== curr && prevPrev !== curr;
        }
        // Else if this is an end digit
        else if (d > 1) {
          let prevPrev = digits[d - 2];
          currValidPairAlone = prevPrev !== curr;
        }
        // Else if this is a starting digit
        else if (d + 1 < digits.length) {
          let next = digits[d + 1];
          currValidPairAlone = next !== curr;
        }
      }

      // If no other valid pair has been found then set the flag
      if (!validPair && currValidPair) validPair = currValidPair;
      // If no other valid pair alone has ben found then set the flag
      if (!validPairAlone && currValidPairAlone)
        validPairAlone = currValidPairAlone;
    }

    // If this meets the requirements for part 1 add it to that results array
    if (validDecreasing && validPair) results1.push(x);

    // If this meets the requirements for part 2 add it to that results array
    if (validDecreasing && validPair && validPairAlone) results2.push(x);
  }

  return { part1: results1.length, part2: results2.length };
};
