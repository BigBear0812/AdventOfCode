// Puzzle for Day 09: https://adventofcode.com/2020/day/9

export const run = (fileContents) => {
  // Set the preamble size and the number of previous numbers to consider
  const PREAMBLE_SIZE = 25;
  const PREV_NUMBERS = 25;

  // Convert the input data array from strings to ints
  let data = fileContents.map((x) => parseInt(x));

  // Part 1
  let result1 = null;
  // Check each number in the data after the preamble to find the first invalid number
  for (let x = PREAMBLE_SIZE; x < data.length && result1 === null; x++) {
    // Get the current value at this index
    let currentVal = data[x];

    // Get the last previous numbers length of values
    let prevNumbers = [];
    for (let y = x - PREV_NUMBERS; y < x; y++) {
      prevNumbers.push(data[y]);
    }
    // Filter out numbers larger then the current value and order them largest to smallest
    prevNumbers = prevNumbers.filter((x) => x <= currentVal);
    prevNumbers.sort((a, b) => {
      if (a > b) return -1;
      else if (a < b) return 1;
      else return 0;
    });

    // Check if the sum of any 2 of the numbers is equal to the current value
    let foundMatch = false;
    for (let a = 0; a < prevNumbers.length && !foundMatch; a++) {
      for (let b = a + 1; b < prevNumbers.length && !foundMatch; b++) {
        foundMatch = currentVal === prevNumbers[a] + prevNumbers[b];
      }
    }

    // If no perfect sum exists this means the number is invalid and is our result for part 1
    if (!foundMatch) result1 = currentVal;
  }

  // Part 2
  let result2 = null;
  // Use indexes a and b to find a subset of numbers that when summed
  // equals the result from part 1
  for (let a = 0; a < data.length && result2 === null; a++) {
    for (let b = a + 2; b <= data.length && result2 === null; b++) {
      // Get a subset of data starting with a and including up to the value before b
      let subData = data.slice(a, b);
      // Get the sum of the subset
      let subDataSum = subData.reduce((total, val) => (total += val), 0);
      // If this is greater than the result from part 1 skip to the next starting value
      if (subDataSum > result1) break;
      // Else if the sum equals the result for part 1 get the answer
      else if (subDataSum === result1) {
        // Sort the values to get the largest and smallest at the ends of the
        // array and then sum the end numbers
        subData.sort();
        result2 = subData[0] + subData[subData.length - 1];
      }
    }
  }

  return { part1: result1, part2: result2 };
};
