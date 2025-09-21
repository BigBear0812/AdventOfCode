// Puzzle for Day 06: https://adventofcode.com/2021/day/6

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Create a map opf the number of days remaining until a fish
  // reproduces and the number of fish currently on that day
  let fish = new Map();
  fileContents[0].split(",").map((num) => {
    const fishNum = parseInt(num);
    fish.set(fishNum, (fish.get(fishNum) ?? 0) + 1);
  });

  // Part 1
  const PART_1_DAYS = 80;
  fish = runSimulation(fish, PART_1_DAYS);
  const part1 = fish.values().reduce((total, val) => (total += val), 0);

  // Part 2
  const PART_2_DAYS = 256 - PART_1_DAYS;
  fish = runSimulation(fish, PART_2_DAYS);
  const part2 = fish.values().reduce((total, val) => (total += val), 0);

  return { part1, part2 };
};

/**
 * Runs the simulation for the given number of days
 * @param {Map} fish The fish days to reproduce mapped to their count in the data
 * @param {number} days The number of days to run the simulation for
 */
const runSimulation = (fish, days) => {
  // Simulate each day
  for (let d = 0; d < days; d++) {
    // Create a new map for the updated fish values
    let newFish = new Map();
    // Update the key for each fish to the new number of days remaining it has
    for (let fishType of fish.keys()) {
      let fishCount = fish.get(fishType) ?? 0;
      // If a fish is at 0 days remaining add it back to the set with 6 days remaining
      // and add the same number of fish to the set with 8 days remaining
      if (fishType === 0) {
        newFish.set(6, (newFish.get(6) ?? 0) + fishCount);
        newFish.set(8, (newFish.get(8) ?? 0) + fishCount);
      }
      // Else subtract 1 from that fishes number of days remaining to reproduce
      else {
        newFish.set(fishType - 1, (newFish.get(fishType - 1) ?? 0) + fishCount);
      }
    }
    // Set the fish set tio the new fish set
    fish = newFish;
  }

  // Return the updated map of fish
  return fish;
};
