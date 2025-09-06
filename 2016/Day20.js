// Puzzle for Day 20: https://adventofcode.com/2016/day/20

export const run = (fileContents) => {
  // Get the list of blocked IP ranges from the input file contents
  let blockList = parseInput(fileContents);

  // Combine IP blocks to make sure each block does not overlap or connect with another
  let combined = reduceBlockList(blockList);

  // Sort the IP blocks from lowest to highest
  bubbleSort(combined);

  // Get the lowest IP by taking the first IP block's high value and adding 1
  let lowest = combined[0].high + 1;

  // Count all avilable IP addresses
  let count = countAvailableIps(combined);

  return { part1: lowest, part2: count };
};

// Reduce the set of IP addesses blocks by continually recombining
// it until it cannot be reduced any fruther
const reduceBlockList = (blockList) => {
  let startLength;
  let endLength;
  // Compare the length of the block list before and after combining blocks
  // down again. If it is less than before then attempt to do this again
  do {
    startLength = blockList.length;
    blockList = combineBlockList(blockList);
    endLength = blockList.length;
  } while (startLength > endLength);

  return blockList;
};

// Combine blocks in the IP block list. This will look for any overlapping or adjacent IP blocks
const combineBlockList = (blockList) => {
  // The new list of IP blocks
  let combinedList = [];
  // Add the first on to the list to have something to compare against
  combinedList.push(blockList[0]);

  // Compare each block in the incoming list to the combined blocks in the new list
  for (let block of blockList) {
    let matchFound = false;
    for (let x = 0; x < combinedList.length && !matchFound; x++) {
      // Block is comtained within the existing block in the combined list
      if (
        combinedList[x].low <= block.low &&
        combinedList[x].high >= block.high
      ) {
        // Skip this because it is already contained by a block in the new list
        matchFound = true;
      }
      // Block contains the block that exists in the combined list
      else if (
        combinedList[x].low >= block.low &&
        combinedList[x].high <= block.high
      ) {
        combinedList[x].low = block.low;
        combinedList[x].high = block.high;
        matchFound = true;
      }
      // Block low value is contained in the combined list block but not the high value
      else if (
        combinedList[x].low <= block.low &&
        combinedList[x].high >= block.low &&
        combinedList[x].high <= block.high
      ) {
        combinedList[x].high = block.high;
        matchFound = true;
      }
      // Block high value is contained in the combined list block but not the low value
      else if (
        combinedList[x].low <= block.high &&
        combinedList[x].high >= block.high &&
        combinedList[x].low >= block.low
      ) {
        combinedList[x].low = block.low;
        matchFound = true;
      }
      // Block's high value is adjacent to the combined list blocks low value
      else if (combinedList[x].low - 1 === block.high) {
        combinedList[x].low = block.low;
        matchFound = true;
      }
      // Block's low value is adjacent to the combined list blocks high value
      else if (combinedList[x].high + 1 === block.low) {
        combinedList[x].high = block.high;
        matchFound = true;
      }
    }

    // If no matching block was found to combine with then
    // add this block as a new one to the combined list
    if (!matchFound) {
      combinedList.push(block);
    }
  }

  return combinedList;
};

// Count the available IP addresses. This assumes the block list is already in order from lowest to highest
const countAvailableIps = (blockList) => {
  // Start with the lowest blocks low value since the lowest allowed is 0
  let count = blockList[0].low;

  for (let x = 1; x < blockList.length; x++) {
    // Take the difference of each blocks low value and the previous blocks high value and subtract one
    count += blockList[x].low - blockList[x - 1].high - 1;
    // If this is the final block subtract it's high value from the max IP allowed to get the final number of IP's
    if (x + 1 === blockList.length) {
      count += 4294967295 - blockList[x].high;
    }
  }

  return count;
};

// Parse the input from text into IP block objects
const parseInput = (fileContents) => {
  // Regex for parsing each line
  let reg = new RegExp(/(\d+)-(\d+)/);
  let blockList = [];

  // Get the high and low values as int values from each line of the input file
  for (let line of fileContents) {
    let matches = line.match(reg);
    blockList.push({
      low: parseInt(matches[1]),
      high: parseInt(matches[2]),
    });
  }

  return blockList;
};

// Basic bubble sorting algorithm
const bubbleSort = (array) => {
  for (let x = 0; x < array.length - 1; x++) {
    for (let y = 0; y < array.length - x - 1; y++) {
      if (array[y].low > array[y + 1].low) swap(array, y, y + 1);
    }
  }
};

// Basic swap method
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
};
