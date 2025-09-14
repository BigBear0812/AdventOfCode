// Puzzle for Day 05: https://adventofcode.com/2021/day/5

export const run = (fileContents) => {
  // Part 1
  const part1 = createMap(fileContents, false)
    .values()
    .reduce((total, value) => (value > 1 ? total + 1 : total), 0);

  // Part 2
  const part2 = createMap(fileContents, true)
    .values()
    .reduce((total, value) => (value > 1 ? total + 1 : total), 0);

  return { part1, part2 };
};

/**
 * Create a map of all points and the number of times they appear
 * @param {string[]} fileContents The input file contents where each line is a new string in the array
 * @param {boolean} part2 True if this is part 2 logic
 * @returns {Map} A map of grid points and the number of times they appear in the data
 */
const createMap = (fileContents, part2) => {
  // Create a new Map
  const lines = new Map();

  // Parse each line
  for (let line of fileContents) {
    // Use regex to extract the number values
    const matches = line.match(/(\d+),(\d+) -> (\d+),(\d+)/);
    // Parse the values as integers
    const x1 = parseInt(matches[1]);
    const y1 = parseInt(matches[2]);
    const x2 = parseInt(matches[3]);
    const y2 = parseInt(matches[4]);

    // Get the difference in the x and y values
    const xDiff = x1 - x2;
    const yDiff = y1 - y2;

    // Convert the diff into the amount to change x and y each time a new point is reached.
    const xDelta = xDiff === 0 ? xDiff : xDiff > 0 ? -1 : 1;
    const yDelta = yDiff === 0 ? yDiff : yDiff > 0 ? -1 : 1;

    // Skip diagonals in part 1
    if (!part2 && xDelta != 0 && yDelta != 0) {
      continue;
    }

    // Set the current part it the first coordinate
    let curX = x1;
    let curY = y1;

    // Add more points to the map until reaching the second point
    for (; curX != x2 || curY != y2; curX += xDelta, curY += yDelta) {
      addToMap(curX, curY, lines);
    }
    // Add the last point to the map
    addToMap(curX, curY, lines);
  }

  // Return the full map of all points in all lines
  return lines;
};

/**
 * Add the coordinates to the
 * @param {number} x X Coordinate
 * @param {number} y Y Coordinate
 * @param {Map} map Line Points Map
 */
const addToMap = (x, y, map) => {
  // Create a unique location string for the point
  const key = `${y},${x}`;
  // If the map has this point update it otherwise add it for the first time.
  map.set(key, (map.get(key) ?? 0) + 1);
};
