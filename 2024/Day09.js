// Puzzle for Day 09: https://adventofcode.com/2024/day/9

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = async (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);
  return { part1: result1, part2: result2 };
};

/**
 * Part 2 Solution
 * @param {string[]} fileContents The input file
 * @returns {number} Checksum
 */
const part2 = (fileContents) => {
  // Keep a disk array of files and continuous chucks of free space
  let disk = [];
  // Since the input is one line split each character and parse them all to int's
  let input = fileContents[0].split("").map((val) => parseInt(val));
  for (let i = 0; i < input.length; i++) {
    // If the length of the chuck is 0 do not include it
    if (input[i] == 0) continue;

    let id;
    // If at an even position this is an id for a file
    if (i % 2 == 0) {
      id = Math.floor(i / 2);
    }
    // Otherwise this is empty space
    else {
      id = ".";
    }
    // Add a new object to the disk array for this chunk
    disk.push({ id, length: input[i] });
  }

  // Start the data position at the end of the array
  let dataPos = disk.length - 1;
  // Continue processing until all data has been moved forward in the array
  while (dataPos > 0) {
    // Decrease the data position until finding a data chunk to attempt to move
    while (typeof disk[dataPos].id != "number") {
      dataPos--;
    }

    // Start from 0 each time for the free space position
    let freePos = 0;
    while (freePos < dataPos) {
      // Increase the free position until reaching a free space
      // chunk large enough to accommodate the file or until
      // reaching the data position.
      while (
        (disk[freePos].id != "." ||
          disk[freePos].length < disk[dataPos].length) &&
        freePos < dataPos
      ) {
        freePos++;
      }

      // If the free position is past or at the data position
      // then this file cannot be moved. Decrease the data
      // position to skip this file and break out to start
      // over with the next file found.
      if (freePos >= dataPos) {
        dataPos--;
        break;
      }

      // Otherwise there is place to move the file into
      // If free space is larger thank the file
      if (disk[freePos].length > disk[dataPos].length) {
        // Get the difference of the space and file lengths
        let spaceDiff = disk[freePos].length - disk[dataPos].length;
        // Add file before remaining free space
        disk.splice(freePos, 0, structuredClone(disk[dataPos]));
        // After inserting a new item increment the position indexes
        freePos++;
        dataPos++;
        // Replace file will free space
        disk[dataPos].id = ".";
        // Adjust the size of the free space
        disk[freePos].length = spaceDiff;
      }
      // Else if the free space and file lengths are the same
      else if (disk[freePos].length == disk[dataPos].length) {
        // Replace free space with the new file
        disk[freePos].id = disk[dataPos].id;
        // Replace file will free space
        disk[dataPos].id = ".";
      }

      // Combine free space together
      // Check the disk chunk position after the newly freed space
      // to see if it is also free space
      if (dataPos + 1 < disk.length && disk[dataPos + 1].id == ".") {
        // Combine the length of the next free space chunk into the current one
        disk[dataPos].length += disk[dataPos + 1].length;
        // Remove the free space chunk after the new one
        disk.splice(dataPos + 1, 1);
      }
      // Check the disk chunk position before the newly freed space
      // to see if it is also free space
      if (disk[dataPos - 1].id == ".") {
        // Combine the current newly freed space into the free space before it
        disk[dataPos - 1].length += disk[dataPos].length;
        // Remove the newly freed space chunk
        disk.splice(dataPos, 1);
        // Shift the position forward by one to keep it inline where it should be.
        dataPos--;
      }

      // Move the data pos forward by 1 since this data has now been
      // processed and needs to move on to the next file. Make sure to
      // break out so free space checking always begins at 0.
      dataPos--;
      break;
    }
  }

  // Calculate the checksum
  let checksum = 0;
  // Keep track of the file block on the disk this id is being multiplied by
  let blockPos = 0;
  for (let f = 0; f < disk.length; f++) {
    // Get the current file
    let file = disk[f];
    for (let l = 0; l < file.length; l++) {
      // Only add to the total if the file chunk is not empty space
      if (file.id != ".")
        // Multiply the file id by the file block position and add it to the checksum
        checksum += blockPos * file.id;
      // Always increase the file block position no matter what kind of file chunk it is.
      blockPos++;
    }
  }

  return checksum;
};

/**
 * Part 1 Solution
 * @param {string[]} fileContents The input file
 * @returns {number} Checksum
 */
const part1 = (fileContents) => {
  // Parse in the input to an array
  let disk = [];
  // Since the input is one line split each character and parse them all to int's
  let input = fileContents[0].split("").map((val) => parseInt(val));
  // Apply one at a time to the disk info
  for (let i = 0; i < input.length; i++) {
    let val;
    // If at an even position this is an id for a file
    if (i % 2 == 0) {
      val = Math.floor(i / 2);
    }
    // Otherwise this is empty space
    else {
      val = ".";
    }
    // For the length of the object add the correct value into the disk array
    for (let x = 0; x < input[i]; x++) {
      disk.push(val);
    }
  }

  // Start with the free space position being 0
  let freePos = 0;
  // Start with the data file position being the end of the disk array
  let dataPos = disk.length - 1;
  // Continue processing until they match
  while (freePos != dataPos) {
    // Increase the free position index until finding a free space to insert data
    while (disk[freePos] != "." && freePos != dataPos) {
      freePos++;
    }
    // Decrease the data position until finding a space to get data from
    while (typeof disk[dataPos] != "number" && freePos != dataPos) {
      dataPos--;
    }
    // Swap the values in those spots
    disk[freePos] = disk[dataPos];
    disk[dataPos] = ".";
  }

  // Calculate the checksum
  let checksum = 0;
  // For every space that is a file id multiply it by it's index and add it to the checksum
  for (let i = 0; i < disk.length && disk[i] != "."; i++) {
    checksum += i * disk[i];
  }
  return checksum;
};
