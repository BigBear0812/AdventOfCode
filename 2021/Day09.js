// Puzzle for Day 09: https://adventofcode.com/2021/day/9

export const run = (fileContents) => {
  // Convert the input into a 2D array of number heights
  const map = fileContents.map((line) =>
    line.split("").map((loc) => parseInt(loc)),
  );

  // Part 1
  // All low points
  const lowPoints = [];

  // Max Y value
  const maxY = map.length - 1;
  // Max X value
  const maxX = map[0].length - 1;

  // Check each row
  for (let y = 0; y < map.length; y++) {
    // Check each column in the current row
    for (let x = 0; x < map[y].length; x++) {
      // The current height to evaluate
      const height = map[y][x];
      // If this is a 9 it can be skipped since it is the max height
      if (height === 9) continue;
      // Find adjacent heights
      const adjacent = [];
      if (y - 1 >= 0) adjacent.push(map[y - 1][x]);
      if (x - 1 >= 0) adjacent.push(map[y][x - 1]);
      if (y + 1 <= maxY) adjacent.push(map[y + 1][x]);
      if (x + 1 <= maxX) adjacent.push(map[y][x + 1]);

      // Determine if this is lower than all adjacent points
      let lowPoint = true;
      for (let a = 0; a < adjacent.length && lowPoint; a++) {
        if (adjacent[a] < height) lowPoint = false;
      }

      // If this is a low point add it's risk value to the output
      if (lowPoint) lowPoints.push({ x, y, height });
    }
  }

  // Calculate the risk for all low points
  const part1 = lowPoints.reduce(
    (total, point) => (total += point.height + 1),
    0,
  );

  // Part 2
  // Keep track of basins sizes found
  const basins = [];

  // Find the size of each basin starting at each low point
  for (let l = 0; l < lowPoints.length; l++) {
    // Breadth First Search (BFS)
    // Track the visited locations so they do not get repeated
    const visited = new Set();
    // Create a queue with the initial low point of the basin
    const queue = [lowPoints[l]];
    // Continue searching adjacent points until the queue is empty
    while (queue.length) {
      // Get the current position
      const currentPos = queue.shift();

      // If visited then skip it otherwise add it to the set of visited locations
      if (visited.has(key(currentPos))) continue;
      else visited.add(key(currentPos));

      // Get the x and y coordinates
      const x = currentPos.x;
      const y = currentPos.y;
      // Find adjacent heights
      let adjacent = [];
      if (currentPos.y - 1 >= 0)
        adjacent.push({ x, y: y - 1, height: map[y - 1][x] });
      if (currentPos.x - 1 >= 0)
        adjacent.push({ x: x - 1, y, height: map[y][x - 1] });
      if (currentPos.y + 1 <= maxY)
        adjacent.push({ x, y: y + 1, height: map[y + 1][x] });
      if (currentPos.x + 1 <= maxX)
        adjacent.push({ x: x + 1, y: y, height: map[y][x + 1] });

      // Filter out any lower heights or heights of 9
      adjacent = adjacent.filter(
        (adj) => adj.height >= currentPos.height && adj.height < 9,
      );

      // Add adjacent points to the queue
      queue.push(...adjacent);
    }
    // Add the size of the basin to the array of basin sizes
    basins.push(visited.size);
  }

  // Calc Part 2 result
  const part2 = basins
    // Sort the basins size from lowest to highest
    .sort((a, b) => (a === b ? 0 : a < b ? -1 : 1))
    // Take only the last 3 highest basins
    .slice(-3)
    // Multiply the sizes together
    .reduce((total, size) => (total *= size), 1);

  return { part1, part2 };
};

const key = (pos) => `${pos.y},${pos.x}`;
