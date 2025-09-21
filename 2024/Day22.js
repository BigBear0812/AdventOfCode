// Puzzle for Day 22: https://adventofcode.com/2024/day/22

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let initialBuyerNumbers = fileContents.map((line) => parseInt(line));
  let result = solver(initialBuyerNumbers);
  return { part1: result.total, part2: result.largestSale };
};

/**
 * Solve both parts of the puzzle
 * @param {number[]} initialBuyerNumbers Array of initial buyer numbers
 * @returns {{total: number, largestSale: number}} The solution for part 1 and part 2
 */
const solver = (initialBuyerNumbers) => {
  // Store the total of the 2000th current numbers
  let total = 0;
  // Store the largest sale from one of the keys
  let largestSale = 0;
  // Store a map of banana sales based on keys of previous 4 sales differences
  let bananaSales = new Map();
  // Check each initial buyer number one at a time.
  for (let number of initialBuyerNumbers) {
    // The current number for this round opf processing
    let current = number;
    // The last 4 differences in sales between rounds
    let diffs = [];
    // Simulate updating the number 2000 times
    for (let i = 0; i < 2000; i++) {
      // Store the current number as the previous
      let previous = current;
      // Use the process described in part 1 to get the new current secret number
      current = mixAndPrune(current * 64, current);
      current = mixAndPrune(Math.floor(current / 32), current);
      current = mixAndPrune(current * 2048, current);

      // Get the ones digit of the previous value and current value
      let previousPrice = previous % 10;
      let newPrice = current % 10;
      // Get the new diff and add it ot the diffs array
      diffs.push(newPrice - previousPrice);
      // If there are too many diff values remove the first one
      if (diffs.length > 4) diffs.shift();
      // If there are 4 diffs to use start tracking sale prices
      if (diffs.length === 4) {
        // Use the diffs array to create a key for storing sales info
        let key = JSON.stringify(diffs);
        // If the key has already been seen before
        if (bananaSales.has(key)) {
          // Get the previous sales map for this key
          let previousSales = bananaSales.get(key);
          // If this initial number is not found then this is the first
          // time it has occurred for this monkey and should be stored
          if (!previousSales.has(number)) {
            // Find the new total for this key
            let newTotal = previousSales.get("total") + newPrice;
            // Set the new total and the price for this monkey
            previousSales.set("total", newTotal);
            previousSales.set(number, newPrice);
            // Update the banana sales record for this key with the updated sales map
            bananaSales.set(key, previousSales);
            // Update the latest sale total if this new total is larger
            if (newTotal > largestSale) largestSale = newTotal;
          }
        }
        // Else this is a new key so add it with the initial number
        // and new price and initialize the total for this key in a new map.
        else
          bananaSales.set(
            key,
            new Map([
              [number, newPrice],
              ["total", newPrice],
            ]),
          );
      }
    }
    // Add the current secret number to the total
    total += current;
  }
  return { total, largestSale };
};

/**
 * Mix and prune according to part 1 instructions
 * @param {number} newNumber The new secret number
 * @param {number} secretNumber The previous secret number
 * @returns {number} The mixed and pruned secret number
 */
const mixAndPrune = (newNumber, secretNumber) => {
  return secretNumber ^ newNumber % 16777216;
};
