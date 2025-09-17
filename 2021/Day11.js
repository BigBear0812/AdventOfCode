// Puzzle for Day 11: https://adventofcode.com/2021/day/11

// Constants
const PART1_STEPS = 100;
const MAX_Y = 9;
const MAX_X = 9;
const TOTAL_OCTOPI = 100;

export const run = (fileContents) => {
  const octopusGrid = fileContents.map((line) =>
    line.split("").map((num) => parseInt(num)),
  );

  // Part 1
  // Check for if all the octopi flashed this turn and the
  // total number of flashes that occur in 100 steps
  let totalFlashes = 0;
  let allFlashStep = 0;
  // Continue for 100 steps
  for (let s = 0; s < PART1_STEPS; s++) {
    const flashes = simulateStep(octopusGrid);
    if (flashes === TOTAL_OCTOPI) allFlashStep = s + 1;
    totalFlashes += flashes;
  }

  // Part 2
  // Continue until all octopi flash at once
  if (!allFlashStep) {
    for (let s = 0; !allFlashStep; s++) {
      const flashes = simulateStep(octopusGrid);
      if (flashes === TOTAL_OCTOPI) allFlashStep = s + 1 + PART1_STEPS;
    }
  }

  return { part1: totalFlashes, part2: allFlashStep };
};

/**
 * Simulate a single step
 * @param {number[][]} octopusGrid
 * @returns {number} The total number of flashes that occurred
 */
const simulateStep = (octopusGrid) => {
  // Add one to each octopus and find all octopi that are going to flash
  const flashQueue = [];
  for (let y = 0; y <= MAX_Y; y++) {
    for (let x = 0; x <= MAX_X; x++) {
      octopusGrid[y][x] += 1;
      if (octopusGrid[y][x] > 9) {
        flashQueue.push({ y, x });
      }
    }
  }

  // Track the octopi locations that have flashed
  const flashed = new Set();
  // Continue while there are still octopi to flash
  while (flashQueue.length) {
    // Take the next octopi
    const current = flashQueue.shift();

    // Add it to the set of flashed locations if it has not already flashed
    if (!flashed.has(key(current))) flashed.add(key(current));
    else continue;

    // Get the Y and X coordinates values and set its energy value to 0
    const y = current.y;
    const x = current.x;
    octopusGrid[y][x] = 0;

    // Get all adjacent locations
    const adjacent = [];
    if (y - 1 >= 0 && x - 1 >= 0) adjacent.push({ y: y - 1, x: x - 1 }); // Top Left
    if (y - 1 >= 0) adjacent.push({ y: y - 1, x }); // Top
    if (y - 1 >= 0 && x + 1 <= MAX_X) adjacent.push({ y: y - 1, x: x + 1 }); // Top Right
    if (x - 1 >= 0) adjacent.push({ y, x: x - 1 }); // Left
    if (x + 1 <= MAX_X) adjacent.push({ y, x: x + 1 }); // Right
    if (y + 1 <= MAX_Y && x - 1 >= 0) adjacent.push({ y: y + 1, x: x - 1 }); // Bottom Left
    if (y + 1 <= MAX_Y) adjacent.push({ y: y + 1, x }); // Bottom
    if (y + 1 <= MAX_Y && x + 1 <= MAX_X) adjacent.push({ y: y + 1, x: x + 1 }); // Bottom Right

    // Check each adjacent location
    for (let a of adjacent) {
      // If it has not flashed yet
      if (octopusGrid[a.y][a.x] > 0) {
        // Add one to it's energy
        octopusGrid[a.y][a.x] += 1;
        // If it is now going to flash add it to the queue
        if (octopusGrid[a.y][a.x] > 9) {
          flashQueue.push({ y: a.y, x: a.x });
        }
      }
    }
  }

  // Return the number of spaces that flashed this step
  return flashed.size;
};

/**
 * Generate Key
 * @param {{y: number, x: number}} param0 Object with coordinates
 * @returns {string} Set key string
 */
const key = ({ y, x }) => {
  return `${y},${x}`;
};
