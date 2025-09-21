// Puzzle for Day 1: https://adventofcode.com/2019/day/1

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the module weights in from the input file
  let modules = fileContents.map((x) => parseInt(x));

  // The totals for parts 1 & 2
  let total1 = 0;
  let total2 = 0;
  // Calculate modules file requirements for each part one by one
  for (let module of modules) {
    // Fuel total for part 1
    let fuelTotal = Math.floor(module / 3) - 2;
    // Add to part 1 total
    total1 += fuelTotal;

    // Calculate the addition fuel starting with the base fuel total
    let additionalFuel = [fuelTotal];
    // Fuel to add based one the weight of the last amount of fuel added
    let fuelToAdd = 0;
    do {
      // If it is a valid amount add it to the array
      if (fuelToAdd > 0) additionalFuel.push(fuelToAdd);
      // Calculate the fuel to add for the last amount of fuel added
      fuelToAdd = Math.floor(additionalFuel[additionalFuel.length - 1] / 3) - 2;
    } while (
      // Continue looping while the fuel to be added is still valid
      fuelToAdd > 0
    );

    // Add the fuel values together and update the total fuel for part 2
    total2 += additionalFuel.reduce((total, val) => total + val, 0);
  }

  return { part1: total1, part2: total2 };
};
