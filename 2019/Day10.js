// Puzzle for Day 10: https://adventofcode.com/2019/day/10

export const run = (fileContents) => {
  // Get the grid from the input file
  let grid = parseInput(fileContents);

  // Get the best location for the monitoring station
  let best = findBestAsteroid(grid);

  // Get the 200th asteroid to be destroyed
  let twoHundredth = Array.from(best.visible).sort((a, b) => {
    return b[0] - a[0];
  })[199];

  // Get the result for part 2
  let result2 = twoHundredth[1].x * 100 + twoHundredth[1].y;

  return { part1: best.visible.size, part2: result2 };
};

// Find the best asteroid for the monitoring station
const findBestAsteroid = (grid) => {
  // Best asteroid
  let best = null;

  // Consider each location in the grid
  for (let y1 = 0; y1 < grid.length; y1++) {
    for (let x1 = 0; x1 < grid[y1].length; x1++) {
      // Skip if this location is empty space
      if (grid[y1][x1] === ".") continue;

      // Track the visible asteroids by their tangent
      // angle and record their coordinates
      let visible = new Map();
      // Consider each location in the grid to compare
      // to the current asteroid
      for (let y2 = 0; y2 < grid.length; y2++) {
        for (let x2 = 0; x2 < grid[y2].length; x2++) {
          // Skip if this location is the same as the current
          // asteroid being considered or if this is empty space
          if ((y1 === y2 && x1 === x2) || grid[y2][x2] === ".") continue;
          // Calc angle of the vector between the current asteroid
          // and the other asteroid being considered
          //    -180 / 180
          //         |
          //    90 - . - 90
          //         |
          //         0
          const angle = (Math.atan2(x2 - x1, y2 - y1) * 180) / Math.PI;
          // Calc distance d=√((x2 – x1)² + (y2 – y1)²)
          const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2),
          );
          // If this angle has not been added yet then add it, the
          // coordinates, and the distance to the visible map
          if (!visible.has(angle))
            visible.set(angle, { x: x2, y: y2, d: distance });
          // Else see if this coordinate is closer than the one
          // already found for this angle. If it is then replace
          // it with the new point found
          else {
            let current = visible.get(angle);
            if (current.d > distance)
              visible.set(angle, { x: x2, y: y2, d: distance });
          }
        }
      }

      // If this is the point with the most visible points found so far then
      // set it as the best place to put the monitoring station
      if (best === null || best.visible.size < visible.size)
        best = { x: x1, y: y1, visible };
    }
  }

  return best;
};

// Parse the input into a grid of asteroids
const parseInput = (fileContents) => {
  let grid = [];

  // Convert each line of the input file into an array of
  // characters and push it into the grid array in order
  for (let line of fileContents) {
    let row = line.split("");
    grid.push(row);
  }

  return grid;
};
