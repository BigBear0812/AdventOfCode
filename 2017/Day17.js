// Puzzle for Day 17: https://adventofcode.com/2017/day/17

export const run = (fileContents) => {
  // Parse in the number of steps from the input file's first line
  let steps = parseInt(fileContents[0]);

  // Find the solution to both parts of the problem
  let result1 = spinArrayInsertion(2017, steps);
  let result2 = findValueAtPosition(50000000, steps, 1);

  return { part1: result1, part2: result2 };
};

// Build the array using the spin lock insertion for the next value
// and return the value in the array after the last value inserted
const spinArrayInsertion = (highestValue, steps) => {
  // The list with the starting value
  let list = [0];
  // The current position in the array
  let pos = 0;
  // Continue adding value including the highest value passed in
  for (let x = 1; x <= highestValue; x++) {
    // Find the new position by adding the number of steps to the
    // position. Mod this by the length of th e list currently. Add
    // one to get the position of the place to insert the next value
    pos = newPos(pos, steps, x);
    // Insert the new value at the new position
    list.splice(pos, 0, x);
  }

  // Return the value after the last value inserted
  return list[pos + 1];
};

// Find the value that will be inserted at the given position that
// is less than the highest value
const findValueAtPosition = (highestValue, steps, position) => {
  // The current position where a value would be inserted
  let pos = 0;
  // The last value inserted at the specified position
  let result = 0;

  // Check each value that would be inserted into the array until
  // reaching the highest value
  for (let x = 1; x <= highestValue; x++) {
    // Find the new position
    pos = newPos(pos, steps, x);
    // If the new position is equal to the position value to be
    // found save it to the result
    if (pos === position) result = x;
  }

  return result;
};

// Find the new position to insert a value
const newPos = (pos, steps, length) => {
  return ((pos + steps) % length) + 1;
};
