// Puzzle for Day 05: https://adventofcode.com/2020/day/5

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let seatIds = fileContents
    .map((l) => {
      // Use regex to get the row and column sections
      let matches = l.match(/([BF]{7,7})([RL]{3,3})/);

      // Convert the row letters into binary number string and parse to an int
      let row = parseInt(
        matches[1]
          .split("")
          .reduce((numStr, digit) => (numStr += digit === "B" ? "1" : "0"), ""),
        2,
      );

      // Convert the col letters into binary number string and parse to an int
      let col = parseInt(
        matches[2]
          .split("")
          .reduce((numStr, digit) => (numStr += digit === "R" ? "1" : "0"), ""),
        2,
      );

      // Calculate the seat id and return it
      return row * 8 + col;
    })
    // Sort the seat ids into ascending order
    .sort((a, b) => {
      if (a < b) return -1;
      if (a > 0) return 1;
      return 0;
    });

  // Get the highest seat id
  let result1 = seatIds[seatIds.length - 1];

  // Get the first seat id
  let firstSeat = seatIds[0];

  // Filter out all seat id's that are in the index that matches the correct order.
  // Leaving behind ones that are off by one or more places
  let filteredSeats = seatIds
    // Subtract the value of the first seat id from each seat id
    .map((s) => s - firstSeat)
    // Remove any offset seat id's that do not match their index
    .filter((seat, index) => seat != index);

  // Get the first seat ID's value which is one more that the answer.
  // Subtract one and add the first seat id to get your seat id.
  let result2 = filteredSeats[0] - 1 + firstSeat;

  return { part1: result1, part2: result2 };
};
