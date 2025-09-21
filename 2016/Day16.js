// Puzzle for Day 16: https://adventofcode.com/2016/day/16

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Get the inital state form the first lin eof the input file. Split this
  // into an array of strings. Convert each string to an int
  let initialState = fileContents[0].split("").map((x) => parseInt(x));
  // Disk Sizes for each part
  let diskSize1 = 272;
  let diskSize2 = 35651584;

  // Get the data and checksum for the initial state for the specified disk size
  let result1 = generateDataAndChecksum(initialState, diskSize1);

  // Get the data and checksum for the initial state for the specified disk size
  let result2 = generateDataAndChecksum(initialState, diskSize2);

  return { part1: result1.checksum.join(""), part2: result2.checksum.join("") };
};

// Generate the data and the checksum for this disk
const generateDataAndChecksum = (initialState, diskSize) => {
  let data = JSON.parse(JSON.stringify(initialState));

  // Generate more data using modified dragon curve method
  while (data.length < diskSize) {
    // Copy the current set of data
    let b = JSON.parse(JSON.stringify(data));
    // Reverse the array
    b.reverse();
    // Swap 0's for 1's and 1's for 0's
    b = b.map((x) => (x === 1 ? 0 : 1));
    // Add a 0 to the front of the array
    b.unshift(0);
    // Concat this new data to the original data
    data = data.concat(b);
  }

  // Find the checksum for the data. Only consider the data that fits on the disk
  // by slicing off any data that won't fit
  let diskData = data.slice(0, diskSize);
  // Copy the data for the disk as the inital state for the checksum
  let checksum = JSON.parse(JSON.stringify(diskData));
  // Continue reducing down for a checksum until the length of the checksum is an odd number
  while (checksum.length % 2 === 0) {
    // If the checksum length is even compute a new checksum from the old one
    let newChecksum = [];
    // Check each pair of number
    for (let x = 1; x < checksum.length; x += 2) {
      let pair1 = checksum[x - 1];
      let pair2 = checksum[x];

      // If the pair matches add a 1 to the new checksum
      if (pair1 === pair2) newChecksum.push(1);
      // Else they do not match so add a 0 to the new checksum
      else newChecksum.push(0);
    }
    // Replace the old checksum with the new checksum
    checksum = newChecksum;
  }

  return { checksum, diskData };
};
