// Puzzle for Day 02: https://adventofcode.com/2025/day/2

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse in the input into range objects
  const ranges = [];
  const matchesIter = fileContents[0].matchAll(/(\d+)-(\d+)/g);
  for (const matches of matchesIter) {
    ranges.push({
      start: parseInt(matches[1]),
      end: parseInt(matches[2]),
    });
  }

  // Find all invalid ID's for both parts and sum them each.
  const result = findInvalidIds(ranges);
  const part1 = sumArray(result.part1InvalidIds);
  const part2 = sumArray(result.part2InvalidIds);

  return { part1, part2 };
};
/**
 * Find all of the invalid ID's for both parts
 * @param {{start: number, end: number}[]} ranges The ranges to check
 * @returns {{part1InvalidIds: number[], part2InvalidIds: number[]}} The array of invalid id's for each part
 */
const findInvalidIds = (ranges) => {
  // Keep track of the invalid id's for each part
  const part1InvalidIds = [];
  const part2InvalidIds = [];

  // Check each range
  for (const range of ranges) {
    // Check each ID in tke range
    for (let id = range.start; id <= range.end; id++) {
      // Number of digits for the ID
      const numberLength = Math.floor(Math.log10(id)) + 1;
      // The factors for this ID except 1
      let factors = factorsOfANumber(numberLength);
      // Keep track of if this is found to be invalid or not
      let isInvalid = false;
      // Check each factor
      for (let f = 0; f < factors.length && isInvalid === false; f++) {
        // The current factor
        const factor = factors[f];
        // Divide the ID into the number of sections specified by the factor
        const sections = divideNumIntoSections(id, numberLength, factor);
        // Keep track of if all the section match
        let allMatch = true;
        // Check each section against the others
        for (let s = 1; s < sections.length && allMatch == true; s++) {
          const prev = sections[s - 1];
          const curr = sections[s];
          allMatch = prev === curr;
        }
        // If they all match
        if (allMatch) {
          // Add to the part 2 invalid array
          part2InvalidIds.push(id);
          // if this was divided in 2 then also add it to the part 1 invalid list
          if (factor === 2) {
            part1InvalidIds.push(id);
          }
          // Set invalid to true
          isInvalid = true;
        }
      }
    }
  }

  return { part1InvalidIds, part2InvalidIds };
};

/**
 * Find the factors of a given number and exclude 1 from the list
 * @param {number} number To find the factors of
 * @returns {number[]} All factors except for 1
 */
const factorsOfANumber = memoize((number) => {
  return [...Array(number + 1).keys()].filter(
    (i) => number % i === 0 && i !== 1,
  );
});

/**
 * Divides an id into the specified number of sections
 * @param {number} id The number to find the sections of
 * @param {number} numberLength The length of the id
 * @param {number} sectionsCount The number of sections to divide the number into
 * @returns {number[]} An array of all the sections the number is divided into
 */
const divideNumIntoSections = (id, numberLength, sectionsCount) => {
  // Get the length of each section
  const sectionLength = numberLength / sectionsCount;

  // As the number gets broken down keep track of what of the number is left and its length
  let remainingNumber = id;
  let remainingLength = numberLength;
  // Store all sections as they are removed from the remaining number
  const sections = [];
  // COntinue until the number is completely broken down
  while (remainingLength > 0) {
    // What number to divide by to get the next section from the left most digit
    const divider = Math.pow(10, remainingLength - sectionLength);
    // Get the next section from the left side of the number
    const nextSection = Math.floor(remainingNumber / divider);
    // Reduce the remaining number and remaining length
    remainingNumber -= nextSection * divider;
    remainingLength -= sectionLength;
    // Store the next section in the array
    sections.push(nextSection);
  }

  return sections;
};

/**
 * Sum up all the values in the array
 * @param {number[]} array Array of numbers
 * @returns {number} Sum of the values in the array
 */
const sumArray = (array) => {
  return array.reduce((total, num) => (total += num), 0);
};

/**
 * Memoizes the input of the function and caches the results in a hash map.
 * Must be written like this to make it's scope global to the module
 * @param {*} func The function to cache the result of
 * @returns The result of the inputs
 */
function memoize(func) {
  // Create a cache. Using a hash map is exponentially faster than a plain object
  const cache = new Map();

  return function (...args) {
    // Get the JSON string of the args
    const key = JSON.stringify(args);

    // Check if this value has been cached and return it if found
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Otherwise run function and get the result to cache
    const result = func.apply(this, args);
    cache.set(key, result);

    return result;
  };
}
