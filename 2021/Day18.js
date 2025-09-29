// Puzzle for Day 18: https://adventofcode.com/2021/day/18

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Part 1
  // Parse the first line
  let current = JSON.parse(fileContents[0]);
  // Add each line one at a time
  for (let n = 1; n < fileContents.length; n++) {
    // Parse the next line, add them together, and reduce the value down
    let next = JSON.parse(fileContents[n]);
    current = [current, next];
    reduceNum(current);
  }
  // Find the magnitude of the outcome
  const part1 = calcMagnitude(current);

  // Part 2
  // Start with the height value at 0
  let part2 = 0;
  // Compare every value with every other value
  for (let a = 0; a < fileContents.length; a++) {
    for (let b = a + 1; b < fileContents.length; b++) {
      // Add a + b and get the magnitude
      let aPlusB = [JSON.parse(fileContents[a]), JSON.parse(fileContents[b])];
      reduceNum(aPlusB);
      let aPlusBMagnitude = calcMagnitude(aPlusB);

      // Add b + a and get the magnitude
      let bPlusA = [JSON.parse(fileContents[b]), JSON.parse(fileContents[a])];
      reduceNum(bPlusA);
      let bPlusAMagnitude = calcMagnitude(bPlusA);

      // Find the highest magnitude
      if (aPlusBMagnitude > part2) part2 = aPlusBMagnitude;
      if (bPlusAMagnitude > part2) part2 = bPlusAMagnitude;
    }
  }

  return { part1, part2 };
};

/**
 * Calculate the magnitude of the snailfish number
 * @param {Array<number | Array>} number The current snailfish number
 * @returns {Number} The magnitude of the snailfish number
 */
const calcMagnitude = (number) => {
  // Add the value of position 0 * 3 and the value of position 1 * 2
  return number.reduce(
    (total, val, index) =>
      // If the value is an array recurse deeper to get its value
      (total +=
        (Array.isArray(val) ? calcMagnitude(val) : val) * (index == 0 ? 3 : 2)),
    0,
  );
};

/**
 * Reduce a snailfish number
 * @param {Array<number | Array>} number The current snailfish number that will be reduced
 */
const reduceNum = (number) => {
  let explodeDone = false;
  let splitDone = false;

  // Continue until no more explosions or splits
  while (!explodeDone || !splitDone) {
    // If not done exploding
    if (!explodeDone) {
      // Check for explosions
      let result = explodeNum(number);
      // If there are no explosions set the flag
      if (!result) explodeDone = true;
    }
    // If done exploding check for splits
    else if (!splitDone) {
      // Check for split number
      let result = splitNum(number);
      // If a split if found recheck for explosions
      if (result) explodeDone = false;
      // Else this number is done reducing
      else splitDone = true;
    }
  }
};

/**
 * Check for numbers to explode
 * @param {Array<number | Array>} number The current snailfish number
 * @param {number} level The current depth level
 * @param {null | {left: null | Number, right: null | Number, zeroAdded: boolean}} explodeResult An exploded result moving back down the tree
 * @returns {null | {left: null | Number, right: null | Number, zeroAdded: boolean}} Null if no numbers were exploded otherwise an object
 */
const explodeNum = (number, level = 1, explodeResult = null) => {
  // Handle passed down explode result
  if (explodeResult) {
    // If an explode value is moving right
    if (explodeResult.right) {
      // If it's a number add this value to the left number
      if (Number.isInteger(number[0])) {
        number[0] += explodeResult.right;
      }
      // Otherwise pass it down to the left array
      else if (Array.isArray(number[0])) {
        explodeNum(number[0], level + 1, explodeResult);
      }
    }
    // If an explode value is moving left
    else if (explodeResult.left) {
      // If it's a number add this value to the right number
      if (Number.isInteger(number[1])) {
        number[1] += explodeResult.left;
      }
      // Otherwise pass it down to the right sub-array
      else if (Array.isArray(number[1])) {
        explodeNum(number[1], level + 1, explodeResult);
      }
    }
    return explodeResult;
  }

  // Explode the current number if the level value is 5
  if (level >= 5) {
    return { left: number[0], right: number[1], zeroAdded: false };
  }

  // Assume there is noting to explode
  let result = null;

  // Check each number
  for (let n = 0; n < number.length && !result; n++) {
    // Array dive deeper
    if (Array.isArray(number[n]) && !result) {
      // Recurse into the sub-array
      result = explodeNum(number[n], level + 1);
      // Handle an explosion at a lower level
      if (result) {
        // If a zero has not been added to replace the exploded array
        if (result.zeroAdded === false) {
          // Add the zero and set the value in the result so it does not keep happening
          number[n] = 0;
          result.zeroAdded = true;
        }
        // Is left position and there is a right moving number
        if (n === 0 && result.right) {
          // If the right value is an integer add the right value
          if (Number.isInteger(number[1])) {
            number[1] += result.right;
          }
          // Else pass this exploded result into the left sub-array
          else if (Array.isArray(number[1])) {
            explodeNum(number[1], level + 1, { right: result.right });
          }
          // The right moving number has been used
          result.right = null;
        }
        // Is right position and there is a left moving number
        else if (n === 1 && result.left) {
          // If the left value is an integer add the left value
          if (Number.isInteger(number[0])) {
            number[0] += result.left;
          }
          // Else pass this exploded result into the right sub-array
          else if (Array.isArray(number[0])) {
            explodeNum(number[0], level + 1, { left: result.left });
          }
          // The left moving number has been used
          result.left = null;
        }
      }
    }
  }

  // Pass back up result of either null or the exploded numbers left to be used.
  return result;
};

/**
 * Check for numbers to split
 * @param {Array<number | Array>} number The current snailfish number
 * @returns {null | {splitNum: boolean}} Null if no numbers were split otherwise an object
 */
const splitNum = (number) => {
  // Assume there is nothing to split
  let result = null;
  // Check each number in the array
  for (let n = 0; n < number.length && !result; n++) {
    // Array dive deeper
    if (Array.isArray(number[n]) && !result) {
      // Recurse into the next sub-array to find any numbers to split
      result = splitNum(number[n]);
    }
    // Split number if the value is 10 or larger
    else if (number[n] >= 10 && !result) {
      // Split the value into a new sub-array
      let half = number[n] / 2;
      number[n] = [Math.floor(half), Math.ceil(half)];
      // Return an object to show there was a number split during this check of the snail fish number
      result = { splitNum: true };
    }
  }

  // Pass the result back up the tree.
  return result;
};
