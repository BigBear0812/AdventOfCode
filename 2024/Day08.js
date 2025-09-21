// Puzzle for Day 08: https://adventofcode.com/2024/day/8

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = async (fileContents) => {
  let data = parseInput(fileContents);
  let result1 = part1(data);
  let result2 = part2(data);
  return { part1: result1, part2: result2 };
};

/**
 * Part 2 Solution
 * @param {{height: number, width: number, nodes: Map()}} data The input data
 * @returns {number} Number of anti-nodes by part 2 rules
 */
const part2 = (data) => {
  // Keep track of the set of unique anti-node locations
  let antiNodes = new Set();

  // Check each node type in the map
  data.nodes.forEach((locations) => {
    // Find anti-nodes between each pair of node locations for this node type
    for (let a = 0; a < locations.length; a++) {
      for (let b = a + 1; b < locations.length; b++) {
        // Get the locations for each pair of nodes
        let aLoc = locations[a];
        let bLoc = locations[b];
        // Find the difference between location a's and location b's y and x values
        let yDiff = aLoc.y - bLoc.y;
        let xDiff = aLoc.x - bLoc.x;

        // Use the differences to create the anti-node locations
        // A direction anti-nodes
        let stillInBounds = true;
        for (let i = 0; stillInBounds; i++) {
          // The next location for an anti-node
          let location = { y: aLoc.y + yDiff * i, x: aLoc.x + xDiff * i };
          // If it is not in bounds then stop creating more anti-nodes
          if (!inBounds(location, data.height, data.width))
            stillInBounds = false;
          // Otherwise add to the set of anti-nodes
          else antiNodes.add(`${location.y},${location.x}`);
        }

        // B direction anti-nodes
        stillInBounds = true;
        for (let i = 0; stillInBounds; i++) {
          // The next location for an anti-node
          let location = { y: bLoc.y - yDiff * i, x: bLoc.x - xDiff * i };
          // If it is not in bounds then stop creating more anti-nodes
          if (!inBounds(location, data.height, data.width))
            stillInBounds = false;
          // Otherwise add to the set of anti-nodes
          else antiNodes.add(`${location.y},${location.x}`);
        }
      }
    }
  });

  return antiNodes.size;
};

/**
 * Part 1 Solution
 * @param {{height: number, width: number, nodes: Map()}} data
 * @returns {number} Number of anti-nodes by part 1 rules
 */
const part1 = (data) => {
  // Keep track of the set of unique anti-node locations
  let antiNodes = new Set();

  // Check each node type in the map
  data.nodes.forEach((locations) => {
    // Find anti-nodes between each pair of node locations for this node type
    for (let a = 0; a < locations.length; a++) {
      for (let b = a + 1; b < locations.length; b++) {
        // Get the locations for each pair of nodes
        let aLoc = locations[a];
        let bLoc = locations[b];
        // Find the difference between location a's and location b's y and x values
        let yDiff = aLoc.y - bLoc.y;
        let xDiff = aLoc.x - bLoc.x;
        // Use the differences to create the anti-node locations
        let antiNodeLocations = [
          { y: aLoc.y + yDiff, x: aLoc.x + xDiff },
          { y: bLoc.y - yDiff, x: bLoc.x - xDiff },
        ];

        antiNodeLocations
          // Remove out of bounds anti-nodes
          .filter((location) => inBounds(location, data.height, data.width))
          // Add to the set of anti-nodes
          .forEach((location) => antiNodes.add(`${location.y},${location.x}`));
      }
    }
  });

  return antiNodes.size;
};

/**
 * Check if a given location is in the specified height and width bounds
 * @param {{y: number, x: number}} location
 * @param {number} height
 * @param {number} width
 * @returns True if the location is in bounds
 */
const inBounds = (location, height, width) => {
  return (
    location.y >= 0 &&
    location.y < height &&
    location.x >= 0 &&
    location.x < width
  );
};

/**
 * Parse the input file
 * @param {string[]} fileContents Input file content
 * @returns {{height: number, width: number, nodes: Map()}} Parsed input data
 */
const parseInput = (fileContents) => {
  // Get the height and width of the data input
  let height = fileContents.length;
  let width = fileContents[0].length;
  // Save each node found
  let nodes = new Map();

  // Check each location in the input
  for (let y = 0; y < fileContents.length; y++) {
    for (let x = 0; x < fileContents[y].length; x++) {
      // Get the current location
      let current = fileContents[y][x];
      // If the spot is not blank
      if (current != ".") {
        // Add this to the set of locations for a specific node type
        let locations = nodes.has(current) ? nodes.get(current) : [];
        locations.push({ y, x });
        nodes.set(current, locations);
      }
    }
  }

  return { height, width, nodes };
};
