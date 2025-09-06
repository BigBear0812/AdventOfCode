// Puzzle for Day 10: https://adventofcode.com/2024/day/10

export const run = async (fileContents) => {
  let data = parseInput(fileContents);
  let result1 = part1(data);
  let result2 = part2(data);
  return { part1: result1, part2: result2 };
};

/**
 * Part 2 Solution
 * @param {{starts: {y: number, x: number}[], map: number[][]}} data Input data
 * @returns {number} Total Ratings for each trail
 */
const part2 = (data) => {
  // Save the total rating for each trail
  let total = 0;

  // Check each trail head separately
  for (let start of data.starts) {
    // Add start to the list of positions to be checked
    let positions = [structuredClone(start)];

    // Breadth First Search (BFS) to find the all possible ways to
    // height 9 locations that are reachable from the start location.
    while (positions.length > 0) {
      // Shift the next location off the front of the positions to be checked array
      let current = positions.shift();
      // If the height is 9 then this is a base case and no more searching needs to be done
      if (data.map[current.y][current.x] === 9) {
        // Add 1 tot the total number of possible paths to a height 9 location
        total++;
        // Continue processing without considering any next possible spaces from this location
        continue;
      }
      // Get the next positions if this is not as base case
      let nextPositions = [
        { y: current.y - 1, x: current.x }, // up
        { y: current.y + 1, x: current.x }, // down
        { y: current.y, x: current.x - 1 }, // left
        { y: current.y, x: current.x + 1 }, // right
      ]
        // Filter out the next possible locations that are not valid
        .filter(
          (val) =>
            // Is location within possible points on the map
            val.y >= 0 &&
            val.y < data.map.length &&
            val.x >= 0 &&
            val.x < data.map[val.y].length &&
            // Is the next place an appropriate step up from the current location
            data.map[val.y][val.x] == data.map[current.y][current.x] + 1,
        );

      // Add each next possible location to the array of positions to be checked.
      nextPositions.forEach((val) => {
        positions.push({ y: val.y, x: val.x });
      });
    }
  }

  return total;
};

/**
 * Part 1 Solution
 * @param {{starts: {y: number, x: number}[], map: number[][]}} data Input data
 * @returns {number} Total Scores for each trail
 */
const part1 = (data) => {
  // Save the total of all scores for each trail head
  let total = 0;

  // Check each trail head separately
  for (let start of data.starts) {
    // Keep track of previously visited locations
    let visited = new Set();
    // Add start to the previously visited
    visited.add(`${start.y},${start.x}`);
    // Add start to the list of positions to be checked
    let positions = [structuredClone(start)];
    // Keep track of height 9 spots that have been found.
    // Use a set to make sure locations don't get double counted.
    let found = new Set();

    // Breadth First Search (BFS) to find the height 9 locations
    // that are reachable from the start location
    while (positions.length > 0) {
      // Shift the next location off the front of the positions to be checked array
      let current = positions.shift();
      // If the height is 9 then this is a base case and no more searching needs to be done
      if (data.map[current.y][current.x] === 9) {
        // Add this to the set of found locations.
        found.add(`${current.y},${current.x}`);
        // Continue processing without considering any next possible spaces from this location
        continue;
      }
      // Get the next positions if this is not as base case
      let nextPositions = [
        { y: current.y - 1, x: current.x }, // up
        { y: current.y + 1, x: current.x }, // down
        { y: current.y, x: current.x - 1 }, // left
        { y: current.y, x: current.x + 1 }, // right
      ]
        // Filter out the next possible locations that are not valid
        .filter(
          (val) =>
            // Is location within possible points on the map
            val.y >= 0 &&
            val.y < data.map.length &&
            val.x >= 0 &&
            val.x < data.map[val.y].length &&
            // Is the next place an appropriate step up by one from the current location
            data.map[val.y][val.x] == data.map[current.y][current.x] + 1 &&
            // Has this location already been visited
            !visited.has(`${val.y},${val.x}`),
        );

      // Add the next positions to the set if visited locations and the array of positions to be checked.
      nextPositions.forEach((val) => {
        visited.add(`${val.y},${val.x}`);
        positions.push({ y: val.y, x: val.x });
      });
    }

    // Add the total number of found 9 height locations from this start to the total
    total += found.size;
  }

  return total;
};

/**
 * Parse Input File
 * @param {string[]} fileContents The input file contents as an array of strings for each line
 * @returns {{starts: {y: number, x: number}[], map: number[][]}} A list of start locations and a 2D
 * number array of all map locations
 */
const parseInput = (fileContents) => {
  // Keep track of all start locations
  let starts = [];
  // Parse each location into a number form string
  let map = fileContents.map((line, y) => {
    // Split each line into a separate character in the array
    return line.split("").map((location, x) => {
      // Parse the locations values as an int
      let num = parseInt(location);
      // If it is 0 also add the location to the starts array
      if (num === 0) starts.push({ y, x });
      // Return the number to the map output
      return num;
    });
  });
  return { starts, map };
};
