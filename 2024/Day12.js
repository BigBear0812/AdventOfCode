// Puzzle for Day 12: https://adventofcode.com/2024/day/12

export const run = async (fileContents) => {
  let data = fileContents.map((line) => line.split(""));
  let regions = findRegions(data);
  // Calc part 1 answer
  let result1 = regions.reduce(
    (total, region) => (total += region.area * region.perimeter),
    0,
  );
  // Calc part 2 answer
  let result2 = regions.reduce(
    (total, region) => (total += region.area * region.corners),
    0,
  );
  return { part1: result1, part2: result2 };
};

/**
 * Search the map for regions and return the necessary info about each region
 * @param {string[][]} data The map
 * @returns {{area: number, perimeter: number, corners: number}[]} The list of regions area,
 * perimeter, and number of corners
 */
let findRegions = (data) => {
  // Array of all regions
  let regions = [];
  // Positions outside of the current region
  let outRegionPositions = [{ y: 0, x: 0 }];
  // Set of visited points
  let visited = new Set();

  // Breadth First Search (BFS) for each region.
  // Continue processing new regions until there are
  // no new points outside of any region
  while (outRegionPositions.length > 0) {
    // The starting point for this region
    let start = outRegionPositions.shift();

    // If this point has been visited before then ignore it and continue
    if (visited.has(`${start.y},${start.x}`)) continue;

    // Area, perimeter, and a map of all coordinates in this region
    let area = 0;
    let perimeter = 0;
    let spaces = new Map();

    // Array for next coordinates to check that are a part of the current region
    let inRegionPositions = [start];
    // The current region letter
    let regionLetter = data[start.y][start.x];
    // Breadth First Search (BFS) this region.
    // Continue processing more points for this region until all regional points have been found
    while (inRegionPositions.length > 0) {
      // Get the next position in the region to evaluate
      let current = inRegionPositions.shift();
      // If it has been visited then skip it
      if (visited.has(`${current.y},${current.x}`)) continue;

      // Get the adjacent spaces and filter out the ones outside of the grid
      let adjacent = [
        { y: current.y - 1, x: current.x }, // up
        { y: current.y + 1, x: current.x }, // down
        { y: current.y, x: current.x - 1 }, // left
        { y: current.y, x: current.x + 1 }, // right
      ].filter((val) => inGrid(val, data));
      // Store a count of the number of adjacent spaces that are in the same region
      let inRegionAdjacent = 0;
      adjacent.forEach((val) => {
        if (data[val.y][val.x] === regionLetter) {
          inRegionAdjacent++;
          inRegionPositions.push(val);
        } else {
          outRegionPositions.push(val);
        }
      });
      // The number of edges needing fencing is 4 minus the number of
      // in region adjacent spaces. Add this value to the perimeter
      // and add one to the area for this space.
      let edges = 4 - inRegionAdjacent;
      perimeter += edges;
      area++;

      // Add this space to the map of spaces in this region
      spaces.set(`${current.y},${current.x}`, {
        y: current.y,
        x: current.x,
        edges,
      });
      // Add this space to the global visited set of spaces
      visited.add(`${current.y},${current.x}`);
    }

    // Count the number of corners a region has to get the number of unique sides for part 2
    let corners = 0;
    // Convert the values form the spaces in the region map into an array for checking each one for corners
    let spacesArr = Array.from(spaces.values());
    // Check each space in the region
    for (let space of spacesArr) {
      // Check if all 8 adjacent spaces to a current space are in the regions set of spaces
      let hasUp = spaces.has(`${space.y - 1},${space.x}`);
      let hasDown = spaces.has(`${space.y + 1},${space.x}`);
      let hasLeft = spaces.has(`${space.y},${space.x - 1}`);
      let hasRight = spaces.has(`${space.y},${space.x + 1}`);
      let hasUpperRight = spaces.has(`${space.y - 1},${space.x + 1}`);
      let hasLowerRight = spaces.has(`${space.y + 1},${space.x + 1}`);
      let hasLowerLeft = spaces.has(`${space.y + 1},${space.x - 1}`);
      let hasUpperLeft = spaces.has(`${space.y - 1},${space.x - 1}`);
      // Check if the corner spaces surrounding a current space are withing the bounds of the map
      let inBoundsUpperRight = inGrid({ y: space.y - 1, x: space.x + 1 }, data);
      let inBoundsLowerRight = inGrid({ y: space.y + 1, x: space.x + 1 }, data);
      let inBoundsLowerLeft = inGrid({ y: space.y + 1, x: space.x - 1 }, data);
      let inBoundsUpperLeft = inGrid({ y: space.y - 1, x: space.x - 1 }, data);

      // If a space has 4 edges this is a single space region therefore it has four corners
      if (space.edges === 4) corners += 4;
      // If it has 3 edges this is connected to only one other space therefore must have 2 outside corners
      else if (space.edges === 3) corners += 2;
      // If this has 2 edges then this might have corners depending on the way they occupied spaces are arranged
      else if (space.edges === 2) {
        // If up and right are in the region
        if (hasUp && hasRight) {
          // If the space between then is also in the region only one outside corner exists
          if (hasUpperRight) corners += 1;
          // Otherwise this has an inside and outside corner
          else corners += 2;
        }
        // If right and down are in the region
        else if (hasRight && hasDown) {
          // If the space between then is also in the region only one outside corner exists
          if (hasLowerRight) corners += 1;
          // Otherwise this has an inside and outside corner
          else corners += 2;
        }
        // If down and left are in the region
        else if (hasDown && hasLeft) {
          // If the space between then is also in the region only one outside corner exists
          if (hasLowerLeft) corners += 1;
          // Otherwise this has an inside and outside corner
          else corners += 2;
        }
        // If left and up are in the region
        else if (hasLeft && hasUp) {
          // If the space between then is also in the region only one outside corner exists
          if (hasUpperLeft) corners += 1;
          // Otherwise this has an inside and outside corner
          else corners += 2;
        }
      }
      // If this space has 1 exposed edge then there might be inside corners
      // depending on the arrangement of the surrounding space
      else if (space.edges === 1) {
        // If up is open
        if (hasLeft && hasDown && hasRight) {
          // If each interior corner is not in the region and in
          // the boundaries of the map add one for each
          if (!hasLowerRight && inBoundsLowerRight) corners += 1;
          if (!hasLowerLeft && inBoundsLowerLeft) corners += 1;
        }
        // If right is open
        else if (hasLeft && hasDown && hasUp) {
          // If each interior corner is not in the region and in
          // the boundaries of the map add one for each
          if (!hasUpperLeft && inBoundsUpperLeft) corners += 1;
          if (!hasLowerLeft && inBoundsLowerLeft) corners += 1;
        }
        // If down is open
        else if (hasLeft && hasUp && hasRight) {
          // If each interior corner is not in the region and in
          // the boundaries of the map add one for each
          if (!hasUpperRight && inBoundsUpperRight) corners += 1;
          if (!hasUpperLeft && inBoundsUpperLeft) corners += 1;
        }
        // If left is open
        else if (hasUp && hasDown && hasRight) {
          // If each interior corner is not in the region and is in
          // the boundaries of the map add one for each
          if (!hasLowerRight && inBoundsLowerRight) corners += 1;
          if (!hasUpperRight && inBoundsUpperRight) corners += 1;
        }
      }
      // If no edges are exposed interior corners may exist on any corner
      // spot that is not in the region and is in the boundaries of the map
      else if (space.edges === 0) {
        if (!hasLowerRight && inBoundsLowerRight) corners += 1;
        if (!hasLowerLeft && inBoundsLowerLeft) corners += 1;
        if (!hasUpperRight && inBoundsUpperRight) corners += 1;
        if (!hasUpperLeft && inBoundsUpperLeft) corners += 1;
      }
    }
    // Add the region info to the output list of regions
    regions.push({ area, perimeter, corners });
  }
  return regions;
};

/**
 * IDetermines if the coordinate value is with the boundaries of the grid
 * @param {{y: number, x: number}} val Location coordinates
 * @param {string[][]} data The map to test against
 * @returns {boolean} True if the value is within the boundaries of the grid
 */
const inGrid = (val, data) => {
  // Is location within possible points on the map
  return (
    val.y >= 0 &&
    val.y < data.length &&
    val.x >= 0 &&
    val.x < data[val.y].length
  );
};
