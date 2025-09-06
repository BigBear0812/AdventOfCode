// Puzzle for Day 13: https://adventofcode.com/2023/day/13

export const run = (fileContents) => {
  // Get all of the patterns into separate string arrays from
  // an input of string array for the input file
  let allPatterns = [];
  let currentPattern = [];
  for (let line of fileContents) {
    if (line === "") {
      allPatterns.push(currentPattern);
      currentPattern = [];
    } else {
      currentPattern.push(line);
    }
  }
  // Add the final pattern top the array of patterns
  if (currentPattern.length > 0) allPatterns.push(currentPattern);

  // Get the result of the each part of the solution
  let result1 = 0;
  let result2 = 0;
  for (let pattern of allPatterns) {
    // Find the center of the current pattern
    let patternCenter = findCenter(pattern);
    // Add the total value of this pattern to the part 1 solution sum
    result1 += patternCenter.total;

    // Look for a new center after fixing the smudges
    let newCenterFound = false;
    // Check each character in the pattern until a new center is found
    for (let y = 0; y < pattern.length && !newCenterFound; y++) {
      for (let x = 0; x < pattern[y].length && !newCenterFound; x++) {
        // Create a new pattern from the original and fix the smudge at the y,x coordinate
        let newPattern = JSON.parse(JSON.stringify(pattern));
        let currentVal = newPattern[y].at(x);
        if (currentVal === "#") newPattern[y] = newPattern[y].replaceAt(x, ".");
        else newPattern[y] = newPattern[y].replaceAt(x, "#");

        // Get the new center for this pattern
        let newPatternCenter = findCenter(newPattern);
        // If it is different than the original and has points consider it
        if (
          newPatternCenter.center !== patternCenter.center &&
          newPatternCenter.total > 0
        ) {
          // The new center might contain the original center. Let's check that
          let finalTotal = newPatternCenter.total;
          let patternCenterPertinent = patternCenter.center
            .replace("[", "")
            .replace("]", "");
          if (newPatternCenter.center.includes(patternCenterPertinent))
            finalTotal -= patternCenter.total;

          // If there are still points to add to the total then add them and mark this new center as found
          if (finalTotal > 0) {
            newCenterFound = true;
            result2 += finalTotal;
          }
        }
      }
    }
  }

  return { part1: result1, part2: result2 };
};

/**
 * The pattern to find the center of
 * @param {string[]} pattern
 * @returns
 */
const findCenter = (pattern) => {
  // Use the original pattern to find horizontal matches
  let horizontal = pattern;
  // Transpose the pattern to find vertical matches using the same technique as finding horizontal matches
  let vertical = transposePattern(pattern);

  // Find pairs of rows that match
  let horizontalCenters = findPossibleCenter(horizontal, "H");
  let verticalCenters = findPossibleCenter(vertical, "V");

  // Confirm that these matches found are actually valid centers of reflections
  horizontalCenters = checkForValidReflection(horizontal, horizontalCenters);
  verticalCenters = checkForValidReflection(vertical, verticalCenters);

  // Add value of these centers to the total
  let total = 0;
  total += horizontalCenters.reduce(
    (total, center) => (total += 100 * (center.prev + 1)),
    0,
  );
  total += verticalCenters.reduce(
    (total, center) => (total += center.prev + 1),
    0,
  );

  // Stringify the center for later comparison
  let center = JSON.stringify(horizontalCenters.concat(verticalCenters));

  return { total, center };
};

/**
 * Check if all centers are valid in this pattern
 * @param {string[]} pattern
 * @param {{prev: number, curr: number, marker: string}} centers
 * @returns
 */
const checkForValidReflection = (pattern, centers) => {
  // Valid centers for this pattern
  let output = [];
  for (let center of centers) {
    // Since the prev and curr lines match start with the next ones out.
    let currentValid = true;
    let currentPrev = center.prev - 1;
    let currentCurr = center.curr + 1;
    // Continue until finding a mismatch of hitting and edge ofn the pattern
    while (currentPrev >= 0 && currentCurr < pattern.length && currentValid) {
      // Check if the lines match
      if (pattern[currentPrev] !== pattern[currentCurr]) currentValid = false;
      // Move positions one steps further out from the center
      currentPrev--;
      currentCurr++;
    }
    // If this is valid add it to the output
    if (currentValid) output.push(center);
  }
  return output;
};

/**
 * Find pairs of adjacent rows that match
 * @param {string[]} pattern
 * @param {string} marker
 * @returns
 */
const findPossibleCenter = (pattern, marker) => {
  // Id's of pairs of rows that match
  let output = [];
  // Check this current row with the previous starting at index 1
  for (let l = 1; l < pattern.length; l++) {
    let prev = pattern[l - 1];
    let curr = pattern[l];
    // If matching add to the output
    if (prev === curr) output.push({ prev: l - 1, curr: l, marker });
  }
  return output;
};

/**
 * Flip the puzzle along the x/y axis to make horizontal lines vertical and vice versa
 * @param {string[]} pattern
 * @returns {string[]}
 */
const transposePattern = (pattern) => {
  let patternGrid = pattern.map((l) => l.split(""));
  patternGrid = patternGrid[0].map((_, x) =>
    patternGrid.map((_, y) => patternGrid[y][x]),
  );
  return patternGrid.map((l) => l.join(""));
};

// https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
/**
 * Replaces the characters in the current string with the replacement value starting at the index
 * @param {number} index
 * @param {string} replacement
 * @returns a new string with the number of characters replaced equal to the length of the replacement value
 */
String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};
