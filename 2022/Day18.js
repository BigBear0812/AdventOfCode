// Puzzle for Day 18: https://adventofcode.com/2022/day/18

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Create droplet
  let drop = new Droplet();

  // Parse in the droplet info
  drop.parseInput(fileContents);

  // Calculate the surface areas
  let totalSurfaceArea = drop.surfaceArea();
  let exteriorSurfaceArea = drop.exteriorSurfaceArea();

  return { part1: totalSurfaceArea, part2: exteriorSurfaceArea };
};

// A class to hold the information about the droplet
class Droplet {
  constructor() {
    this.coordinates = new Map();
    this.maxX = 0;
    this.maxY = 0;
    this.maxZ = 0;
    this.minX = Infinity;
    this.minY = Infinity;
    this.minZ = Infinity;
  }

  // Parse the input
  parseInput = (fileContents) => {
    // Create a map of the coordinates for the droplet
    for (const line of fileContents) {
      let nums = line.split(",");
      this.coordinates.set(line, {
        x: parseInt(nums[0]),
        y: parseInt(nums[1]),
        z: parseInt(nums[2]),
      });
    }
    // Find the min and max for each dimension
    this.coordinates.forEach((value) => {
      this.maxX = Math.max(this.maxX, value.x);
      this.maxY = Math.max(this.maxY, value.y);
      this.maxZ = Math.max(this.maxZ, value.z);
      this.minX = Math.min(this.minX, value.x);
      this.minY = Math.min(this.minY, value.y);
      this.minZ = Math.min(this.minZ, value.z);
    });
  };

  // Calculate the total (interior and exterior) surface area of the droplet
  surfaceArea = () => {
    let totalSurfaceArea = 0;
    // Check each space in the of ands surrounding the entire droplet to find the total surface area
    for (let x = this.minX - 1; x <= this.maxX + 1; x++) {
      for (let y = this.minY - 1; y <= this.maxY + 1; y++) {
        for (let z = this.minZ - 1; z <= this.maxZ + 1; z++) {
          // If the space is not contained in the droplet set of points check each
          // surrounding space and if it does exist in the droplet add 1
          if (!this.coordinates.has(`${x},${y},${z}`)) {
            this.coordinates.has(`${x + 1},${y},${z}`)
              ? totalSurfaceArea++
              : null;
            this.coordinates.has(`${x - 1},${y},${z}`)
              ? totalSurfaceArea++
              : null;
            this.coordinates.has(`${x},${y + 1},${z}`)
              ? totalSurfaceArea++
              : null;
            this.coordinates.has(`${x},${y - 1},${z}`)
              ? totalSurfaceArea++
              : null;
            this.coordinates.has(`${x},${y},${z + 1}`)
              ? totalSurfaceArea++
              : null;
            this.coordinates.has(`${x},${y},${z - 1}`)
              ? totalSurfaceArea++
              : null;
          }
        }
      }
    }
    return totalSurfaceArea;
  };

  // Calculate only the exterior surface area of the droplet
  exteriorSurfaceArea = () => {
    // Set of the exterior points surrounding the drop
    let exterior = new Set();
    // Breadth First Search (BFS) of the outside of the drop
    let start = `${this.minX - 1}, ${this.minY - 1}, ${this.minZ - 1}`;
    // Create a queue for storing next spaces
    let queue = [];
    // Add start to exterior and add it to the end of the queue
    exterior.add(start);
    queue.push(start);
    // Continue searching while the queue has next possible steps
    while (queue.length > 0) {
      // Remove the next space to evaluate from the front of the queue
      let current = queue.shift();
      // Check if we have reached the opposite corner space
      let currentString = current.split(",");
      if (
        parseInt(currentString[0]) === this.maxX + 1 &&
        parseInt(currentString[1]) === this.maxY + 1 &&
        parseInt(currentString[2]) === this.maxZ + 1
      )
        break;
      // If this is not the end then compute the next exterior spaces.
      // For each unexplored next step mark it add it to the exterior
      // and add it to the queue
      for (const side of this.getValidNextSides(current)) {
        if (!exterior.has(side) && !this.coordinates.has(side)) {
          exterior.add(side);
          queue.push(side);
        }
      }
    }

    // Calculate the surface area like but this time for the inside of the
    // exterior points. In this case we start one space closer in
    let totalSurfaceArea = 0;
    for (let x = this.minX; x <= this.maxX; x++) {
      for (let y = this.minY; y <= this.maxY; y++) {
        for (let z = this.minZ; z <= this.maxZ; z++) {
          // If the space is not contained in the extrior set of points check each
          // surrounding space and it does exist in the exterior add 1
          if (!exterior.has(`${x},${y},${z}`)) {
            exterior.has(`${x + 1},${y},${z}`) ? totalSurfaceArea++ : null;
            exterior.has(`${x - 1},${y},${z}`) ? totalSurfaceArea++ : null;
            exterior.has(`${x},${y + 1},${z}`) ? totalSurfaceArea++ : null;
            exterior.has(`${x},${y - 1},${z}`) ? totalSurfaceArea++ : null;
            exterior.has(`${x},${y},${z + 1}`) ? totalSurfaceArea++ : null;
            exterior.has(`${x},${y},${z - 1}`) ? totalSurfaceArea++ : null;
          }
        }
      }
    }
    // Return the total surface area
    return totalSurfaceArea;
  };

  // Get the next possible spaces for a given space
  getValidNextSides = (current) => {
    let results = [];
    // Parse the point info into useful int's
    let currentString = current.split(",");
    for (let s = 0; s < currentString.length; s++) {
      currentString[s] = parseInt(currentString[s]);
    }
    // Calculate the avilable adjacent spaces that are within the bounds
    results[0] =
      currentString[0] + 1 <= this.maxX + 1
        ? `${currentString[0] + 1},${currentString[1]},${currentString[2]}`
        : null;
    results[1] =
      currentString[1] + 1 <= this.maxY + 1
        ? `${currentString[0]},${currentString[1] + 1},${currentString[2]}`
        : null;
    results[2] =
      currentString[2] + 1 <= this.maxZ + 1
        ? `${currentString[0]},${currentString[1]},${currentString[2] + 1}`
        : null;
    results[3] =
      currentString[0] - 1 >= this.minX + 1
        ? `${currentString[0] - 1},${currentString[1]},${currentString[2]}`
        : null;
    results[4] =
      currentString[1] - 1 >= this.minY + 1
        ? `${currentString[0]},${currentString[1] - 1},${currentString[2]}`
        : null;
    results[5] =
      currentString[2] - 1 >= this.minZ + 1
        ? `${currentString[0]},${currentString[1]},${currentString[2] - 1}`
        : null;

    // Remove any values that are null (meaning would have
    // been outside of the bounds) or that exist in the droplet
    for (let s = results.length - 1; s >= 0; s--) {
      if (this.coordinates.has(results[s]) || results[s] === null)
        results.splice(s, 1);
    }
    return results;
  };
}
