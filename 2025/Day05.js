// Puzzle for Day 05: https://adventofcode.com/2025/day/5

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  const data = parseInput(fileContents);
  const part1 = countFresh(data);
  const part2 = countValidIds(data.freshIds);
  return { part1, part2 };
};

/**
 * Find the number of fresh id's in the data
 * @param {{freshIds: {start: number, end: number}[]}} freshIds The fresh id ranges
 * @returns {number} The count of fresh ids
 */
const countValidIds = (freshIds) => {
  // Keep track of the number of id's
  let total = 0;
  // Sort the list of fresh id ranges by their start values
  freshIds.sort((a, b) => a.start - b.start);
  // See if ranges can be combined starting with the first range.
  let rangeStart = freshIds[0].start;
  let rangeEnd = freshIds[0].end;
  // Check each range
  for (let x = 1; x < freshIds.length; x++) {
    // The current range
    let curr = freshIds[x];
    // If the current range end is greater than the current combined range
    // end there are id's to be added. Otherwise the id's will already be
    // accounted for in this range.
    if (curr.end > rangeEnd) {
      // If the start of the current range is at or before the combined
      // range end then there is some overlap between these ranges so they
      // can be combined by extended the combined range end to be the
      // current range end.
      if (curr.start <= rangeEnd) {
        rangeEnd = curr.end;
      }
      // Otherwise these ranges do not overlap
      else {
        // Add this new combined range tot the total number of id's
        total += rangeEnd - rangeStart + 1;
        // Set the current range to be the start of the next combined range
        rangeStart = curr.start;
        rangeEnd = curr.end;
      }
    }
  }
  // Add the last combined range to the total
  total += rangeEnd - rangeStart + 1;

  return total;
};

/**
 * Count the number of fresh produce items
 * @param {{freshIds: {start: number, end: number}[], produceIds: number[]}} data The parsed input data
 * @returns {number} The number of fresh products
 */
const countFresh = (data) => {
  // Keep track of all fresh produce id's
  const freshProduceIds = [];

  // Check each product
  for (let product of data.produceIds) {
    // Determine if it is fresh by seeing if it falls in any fresh id range
    let fresh = false;
    for (let f = 0; f < data.freshIds.length && !fresh; f++) {
      // If it does fall in this current range then mark it as true and stop checking more ranges
      if (product >= data.freshIds[f].start && product <= data.freshIds[f].end)
        fresh = true;
    }

    // If it is fresh add it to the list of id's
    if (fresh) freshProduceIds.push(product);
  }

  // Return the length of the list
  return freshProduceIds.length;
};

/**
 * Parse the input data into an object
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{freshIds: {start: number, end: number}[], produceIds: number[]}} The parsed input data
 */
const parseInput = (fileContents) => {
  // Keep track of the fresh produce id's
  const freshIds = [];
  // Keep track of the the produce id's
  const produceIds = [];
  // Flag for which part of the input is being parsed
  let parsingIds = true;
  // Parse each line
  for (let line of fileContents) {
    // Set the flag when the blank line if found
    if (line === "") {
      parsingIds = false;
    }
    // Parse a fresh produce id range
    else if (parsingIds) {
      const matches = line.match(/(\d+)-(\d+)/);
      freshIds.push({
        start: parseInt(matches[1]),
        end: parseInt(matches[2]),
      });
    }
    // Parse a new produce id
    else if (!parsingIds) {
      produceIds.push(parseInt(line));
    }
  }

  return { freshIds, produceIds };
};
