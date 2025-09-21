// Puzzle for Day 10: https://adventofcode.com/2023/day/10

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Convert the string array input into 2d array
  let grid = fileContents.map((l) => l.split(""));

  // Find the starting position
  let startingPos = null;
  for (let y = 0; y < grid.length && !startingPos; y++) {
    for (let x = 0; x < grid[y].length && !startingPos; x++) {
      if (grid[y][x] === "S") startingPos = { x, y };
    }
  }

  // Get the next possible positions from start
  let nextPositions = getNextPositions(startingPos, grid);
  // current position is the 0 point and the end point is at position 1
  let currentPosition = nextPositions[0];
  let endPoint = nextPositions[1];
  // Add the start and next point to the array
  let loop = [startingPos, nextPositions[0]];
  // Create a visited set to make it quicker to check what has been visited
  let visited = new Set();
  visited.add(JSON.stringify(startingPos));
  visited.add(JSON.stringify(nextPositions[0]));

  // Continue until the loop has been completed
  while (true) {
    // Get the next possible positions and add the one that has not been visited to the loop and visited
    let next = getNextPositions(currentPosition, grid);
    for (let n of next) {
      if (!visited.has(JSON.stringify(n))) {
        visited.add(JSON.stringify(n));
        loop.push(n);
        currentPosition = n;
      }
    }

    // If the end point is reached break out
    if (currentPosition.x == endPoint.x && currentPosition.y == endPoint.y)
      break;
  }

  // The furthest distance on the loop away from the start is half the total distance
  let result1 = loop.length / 2;

  // Use the shoelace formula to calculate the area inside the loop
  // https://en.wikipedia.org/wiki/Shoelace_formula
  let area =
    Math.abs(
      loop.reduce(
        (total, val, index, array) =>
          (total +=
            val.x * array[(index + 1) % array.length].y -
            array[(index + 1) % array.length].x * val.y),
        0,
      ),
    ) / 2;

  // Use Pick's theorem given the area to calculate the number of interior points
  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  let result2 = area - loop.length / 2 + 1;

  return { part1: result1, part2: result2 };
};

/**
 * This method gets the next possible moves given a position on the grid
 * @param {{x: number, y: number}} currentPos
 * @param {string[][]} grid
 * @returns The next possible move given the current position
 */
const getNextPositions = (currentPos, grid) => {
  // Find adjacent positions based on the current symbol at this position
  let adjacent = [];
  if (grid[currentPos.y][currentPos.x] === "S") {
    adjacent.push({
      y: currentPos.y - 1,
      x: currentPos.x,
      expected: ["|", "F", "7"],
    }); // up
    adjacent.push({
      y: currentPos.y + 1,
      x: currentPos.x,
      expected: ["|", "J", "L"],
    }); // down
    adjacent.push({
      y: currentPos.y,
      x: currentPos.x - 1,
      expected: ["-", "F", "L"],
    }); // left
    adjacent.push({
      y: currentPos.y,
      x: currentPos.x + 1,
      expected: ["-", "7", "J"],
    }); // right
  } else if (grid[currentPos.y][currentPos.x] === "|") {
    adjacent.push({
      y: currentPos.y - 1,
      x: currentPos.x,
      expected: ["|", "F", "7"],
    }); // up
    adjacent.push({
      y: currentPos.y + 1,
      x: currentPos.x,
      expected: ["|", "J", "L"],
    }); // down
  } else if (grid[currentPos.y][currentPos.x] === "-") {
    adjacent.push({
      y: currentPos.y,
      x: currentPos.x - 1,
      expected: ["-", "F", "L"],
    }); // left
    adjacent.push({
      y: currentPos.y,
      x: currentPos.x + 1,
      expected: ["-", "7", "J"],
    }); // right
  } else if (grid[currentPos.y][currentPos.x] === "F") {
    adjacent.push({
      y: currentPos.y + 1,
      x: currentPos.x,
      expected: ["|", "J", "L"],
    }); // down
    adjacent.push({
      y: currentPos.y,
      x: currentPos.x + 1,
      expected: ["-", "7", "J"],
    }); // right
  } else if (grid[currentPos.y][currentPos.x] === "L") {
    adjacent.push({
      y: currentPos.y - 1,
      x: currentPos.x,
      expected: ["|", "F", "7"],
    }); // up
    adjacent.push({
      y: currentPos.y,
      x: currentPos.x + 1,
      expected: ["-", "7", "J"],
    }); // right
  } else if (grid[currentPos.y][currentPos.x] === "J") {
    adjacent.push({
      y: currentPos.y - 1,
      x: currentPos.x,
      expected: ["|", "F", "7"],
    }); // up
    adjacent.push({
      y: currentPos.y,
      x: currentPos.x - 1,
      expected: ["-", "F", "L"],
    }); // left
  } else if (grid[currentPos.y][currentPos.x] === "7") {
    adjacent.push({
      y: currentPos.y + 1,
      x: currentPos.x,
      expected: ["|", "J", "L"],
    }); // down
    adjacent.push({
      y: currentPos.y,
      x: currentPos.x - 1,
      expected: ["-", "F", "L"],
    }); // left
  }

  // Get the next valid connected positions
  let nextPositions = [];
  for (let pos of adjacent) {
    if (
      pos.y >= 0 &&
      pos.y < grid.length &&
      pos.x >= 0 &&
      pos.x < grid[pos.y].length &&
      pos.expected.includes(grid[pos.y][pos.x])
    )
      nextPositions.push({ x: pos.x, y: pos.y });
  }

  return nextPositions;
};
