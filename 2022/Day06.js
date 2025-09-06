// Puzzle for Day 6: https://adventofcode.com/2022/day/6

export const run = (fileContents) => {
  // All data should be on the first line
  let data = fileContents[0];

  // Part 1
  let startOfPacketMarker = detectStartOf(data, 4);
  // Part 2
  let startOfMessageMarker = detectStartOf(data, 14);

  return { part1: startOfPacketMarker, part2: startOfMessageMarker };
};

const detectStartOf = (data, bufferSize) => {
  // The start of marker needs an invalid value to
  // know we have not yet found the solution. Setup
  // a buffer array that will be used to examine
  // subsets of characters.
  let startOfMarker = -1;
  let buffer = [];

  // Iterate over each character in the data set
  for (let x = 0; x < data.length && startOfMarker === -1; x++) {
    // Start by adding to the buffer since the marker has not been found
    buffer.push(data[x]);

    // If the buffer is over the max buffer size shift
    // the first character off the front of the array
    if (buffer.length > bufferSize) buffer.shift();

    // If the buffer has reached its max size and is not still
    // filling up then evaluate if the characters are unique
    if (buffer.length === bufferSize) {
      // Check each character against all of the other
      // characters in the buffer to see if they are unique
      let unique = true;
      for (let y = 0; y < buffer.length && unique; y++) {
        for (let z = 1 + y; z < buffer.length && unique; z++) {
          if (buffer[y] === buffer[z]) unique = false;
        }
      }

      // If unique output the current position in the data plus one
      // for a one based index instead of a zero based index
      if (unique) startOfMarker = x + 1;
    }
  }
  return startOfMarker;
};
