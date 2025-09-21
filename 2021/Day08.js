// Puzzle for Day 08: https://adventofcode.com/2021/day/8

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the input
  const displays = fileContents.map((line) => {
    // Split each line into segments and outputs
    let splits = line.split(" | ");
    // Each segment and each output value will be stored as a set
    return {
      segments: splits[0].split(" ").map((digit) => new Set(digit.split(""))),
      outputs: splits[1].split(" ").map((digit) => new Set(digit.split(""))),
    };
  });

  // Part 1
  // Check each display
  const part1 = displays.reduce(
    (total, display) =>
      // Check each output in the display
      (total += display.outputs.reduce(
        (outTotal, output) =>
          // Check the length of the output values and if they match add 1 to the total
          (outTotal +=
            output.size === 2 ||
            output.size === 4 ||
            output.size === 3 ||
            output.size === 7
              ? 1
              : 0),
        0,
      )),
    0,
  );

  // Part 2
  // Check each display
  const part2 = displays.reduce((total, display) => {
    // Map of digits to the set of letters representing them
    const digitMap = new Map();

    // Queue of remaining digits to decode
    const digitsToDecode = display.segments;
    // Continue decoding while digits are left to decode
    while (digitsToDecode.length) {
      // Current digit
      const currentDigit = digitsToDecode.shift();
      // Assume the digit is not decoded
      let decoded = false;

      // Check for 1
      if (currentDigit.size === 2) {
        digitMap.set(1, currentDigit);
        decoded = true;
      }
      // Check for 7
      else if (currentDigit.size === 3) {
        digitMap.set(7, currentDigit);
        decoded = true;
      }
      // Check for 4
      else if (currentDigit.size === 4) {
        digitMap.set(4, currentDigit);
        decoded = true;
      }
      // Check for 8
      else if (currentDigit.size === 7) {
        digitMap.set(8, currentDigit);
        decoded = true;
      }
      // Check for 2, 3, 5
      else if (currentDigit.size === 5) {
        // It is a 3 if it has length 5 and has the same characters of a 1
        if (digitMap.has(1) && digitMap.get(1).isSubsetOf(currentDigit)) {
          digitMap.set(3, currentDigit);
          decoded = true;
        }
        // It is a 5 if it has length 5 and has the same characters of a 6
        else if (digitMap.has(6) && currentDigit.isSubsetOf(digitMap.get(6))) {
          digitMap.set(5, currentDigit);
          decoded = true;
        }
        // It is a 2 if it has length 5 and it the last digit to find
        else if (digitMap.size === 9) {
          digitMap.set(2, currentDigit);
          decoded = true;
        }
      }
      // Check for 0, 6, 9
      else if (currentDigit.size === 6) {
        // It is a 4 if it has length 6 and has the same characters of a 7 and a 4
        if (
          digitMap.has(7) &&
          digitMap.get(7).isSubsetOf(currentDigit) &&
          digitMap.has(4) &&
          digitMap.get(4).isSubsetOf(currentDigit)
        ) {
          digitMap.set(9, currentDigit);
          decoded = true;
        }
        // It is a 0 if it has length 6 and has the same characters of a 7 and not of a 4
        else if (
          digitMap.has(7) &&
          digitMap.get(7).isSubsetOf(currentDigit) &&
          digitMap.has(4) &&
          !digitMap.get(4).isSubsetOf(currentDigit)
        ) {
          digitMap.set(0, currentDigit);
          decoded = true;
        }
        // It is a 6 if it has length 6 and does not have the same characters of a 7 nor of a 4
        else if (
          digitMap.has(7) &&
          !digitMap.get(7).isSubsetOf(currentDigit) &&
          digitMap.has(4) &&
          !digitMap.get(4).isSubsetOf(currentDigit)
        ) {
          digitMap.set(6, currentDigit);
          decoded = true;
        }
      }

      // If this has not been decoded add it back to the queue
      if (!decoded) {
        digitsToDecode.push(currentDigit);
      }
    }

    // Determine the final output value by checking each value one at a time
    const outputVal = display.outputs.reduce((totalVal, output) => {
      // Check for 1
      if (output.size === 2) {
        return (totalVal += 1);
      }
      // Check for 7
      else if (output.size === 3) {
        return (totalVal += 7);
      }
      // Check for 4
      else if (output.size === 4) {
        return (totalVal += 4);
      }
      // Check for 8
      else if (output.size === 7) {
        return (totalVal += 8);
      }
      // Check for 2, 3, 5
      else if (output.size === 5) {
        // Check each length 5 by using a union of the sets of characters
        if (digitMap.get(3).union(output).size === 5) {
          return (totalVal += 3);
        } else if (digitMap.get(5).union(output).size === 5) {
          return (totalVal += 5);
        } else if (digitMap.get(2).union(output).size === 5) {
          return (totalVal += 2);
        }
      }
      // Check for 0, 6, 9
      else if (output.size === 6) {
        // Check each length 6 by using a union of the sets of characters
        if (digitMap.get(9).union(output).size === 6) {
          return (totalVal += 9);
        } else if (digitMap.get(0).union(output).size === 6) {
          return (totalVal += 0);
        } else if (digitMap.get(6).union(output).size === 6) {
          return (totalVal += 6);
        }
      }
    }, "");

    // Add this output value to the total
    return (total += parseInt(outputVal));
  }, 0);

  return { part1, part2 };
};
