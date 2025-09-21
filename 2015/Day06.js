// Puzzle for Day 6: https://adventofcode.com/2015/day/6

const xLen = 1000;
const yLen = 1000;

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

const part1 = (fileContents) => {
  // Off false
  // On  true

  // Create the grid
  let grid = [];
  for (let x = 0; x < xLen; x++) {
    let col = [];
    for (let y = 0; y < yLen; y++) {
      col.push(false);
    }
    grid.push(col);
  }

  for (const line of fileContents) {
    let updates = parseLine(line);
    // Update the grid
    for (let x = updates.start.x; x <= updates.end.x; x++) {
      for (let y = updates.start.y; y <= updates.end.y; y++) {
        switch (updates.command) {
          case "turn on":
            grid[x][y] = true;
            break;

          case "turn off":
            grid[x][y] = false;
            break;

          case "toggle":
            grid[x][y] = !grid[x][y];
            break;
        }
      }
    }
  }

  // Count the lights on
  let total = 0;
  for (let x = 0; x < xLen; x++) {
    for (let y = 0; y < yLen; y++) {
      if (grid[x][y]) total++;
    }
  }

  // Log output
  console.log("Part 1:", total);
};

const part2 = (fileContents) => {
  // Create the grid
  let grid = [];
  for (let x = 0; x < xLen; x++) {
    let col = [];
    for (let y = 0; y < yLen; y++) {
      col.push(0);
    }
    grid.push(col);
  }

  for (const line of fileContents) {
    let updates = parseLine(line);
    // Update the grid
    for (let x = updates.start.x; x <= updates.end.x; x++) {
      for (let y = updates.start.y; y <= updates.end.y; y++) {
        switch (updates.command) {
          case "turn on":
            grid[x][y]++;
            break;

          case "turn off":
            if (grid[x][y] > 0) grid[x][y]--;
            break;

          case "toggle":
            grid[x][y] += 2;
            break;
        }
      }
    }
  }

  // Count the total brightness of the lights
  let total = 0;
  for (let x = 0; x < xLen; x++) {
    for (let y = 0; y < yLen; y++) {
      total += grid[x][y];
    }
  }

  // Log output
  console.log("Part 2:", total);
};

const parseLine = (line) => {
  const regex = new RegExp(
    "([turnofgle ]+) (\\d+),(\\d+) through (\\d+),(\\d+)",
  );
  const results = line.match(regex);
  return {
    command: results[1],
    start: {
      x: Math.min(results[2], results[4]),
      y: Math.min(results[3], results[5]),
    },
    end: {
      x: Math.max(results[2], results[4]),
      y: Math.max(results[3], results[5]),
    },
  };
};
