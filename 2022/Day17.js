// Puzzle for Day 17: https://adventofcode.com/2022/day/17

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
  const maxRocks = 2022;
  // Jet pattern parsed in from file
  let jetPattern = fileContents[0].split("");

  // Run the simulation
  let highest = runSimulation(maxRocks, jetPattern);

  return highest;
};

const part2 = (fileContents) => {
  const maxRocks = 1000000000000;
  // Jet pattern parsed in from file
  let jetPattern = fileContents[0].split("");

  // Run the simulation
  let highest = runSimulation(maxRocks, jetPattern);

  return highest;
};

const runSimulation = (maxRocks, jetPattern) => {
  // Rocks that will fall in order
  const rocks = [
    [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
    ], // -
    [
      { x: 3, y: 2 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 3, y: 0 },
    ], // +
    [
      { x: 4, y: 2 },
      { x: 4, y: 1 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ], // reverse L
    [
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 2, y: 0 },
    ], // |
    [
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ], // square
  ];

  // Stopped rocks grid
  let grid = new Grid();
  // Patterns that have been seen before
  let patternCache = new Map();

  let rocksStopped = 0;
  let jetUsed = 0;

  let cycleStart = 0;
  let cycleStartRock = 0;

  // Continue interating over the movements until enough rocks have dropped
  while (rocksStopped < maxRocks) {
    // For each rock dropped add it's final coordinate to the grid and
    // update the jet used and rocks dropped numbers
    let info = nextRock(rocks, rocksStopped, jetPattern, jetUsed, grid);
    grid.addRockToGrid(info.currentRock);
    jetUsed = info.jetUsed;
    rocksStopped++;

    // If a pattern is found see if it has been found before
    let pattern = grid.getPattern(info.currentRock);
    if (pattern) {
      let patternKey = pattern.join(",");
      // If the pattern has been found before confimr that the number of jets used and the
      // next rock match to be sure we are in the same place again
      if (patternCache.has(patternKey)) {
        let foundPattern = patternCache.get(patternKey);
        // If everything matches then the cycle start and the next rock in
        // the cycle are now known to compute the rest of the answer
        if (
          rocksStopped % rocks.length === foundPattern.nextRock &&
          jetUsed % jetPattern.length === foundPattern.nextJet
        ) {
          cycleStart = foundPattern.highest;
          cycleStartRock = foundPattern.rocksStopped;
          break;
        }
      }
      // If the pattern was not found in the cache add it
      else {
        patternCache.set(patternKey, {
          nextRock: rocksStopped % rocks.length,
          nextJet: jetUsed % jetPattern.length,
          highest: grid.highest,
          rocksStopped: rocksStopped,
        });
      }
    }
  }

  // Now the cycle start point and and starting rock are known
  // compute the number of rockes left to drop and how many cycles
  // need to pass to reach the max number of rocks dropped
  let rocksToDrop = maxRocks - rocksStopped;
  let heightPerCycle = grid.highest - cycleStart;
  let cycles = Math.floor(rocksToDrop / (rocksStopped - cycleStartRock));
  let heightGained = cycles * heightPerCycle;
  let rocksRemainingToDrop = rocksToDrop % (rocksStopped - cycleStartRock);

  // Run through the remaining rocks that need to be dropped
  for (let r = 0; r < rocksRemainingToDrop; r++) {
    let info = nextRock(rocks, rocksStopped, jetPattern, jetUsed, grid);
    grid.addRockToGrid(info.currentRock);
    jetUsed = info.jetUsed;
    rocksStopped++;
  }

  // Return the final height of the grid
  return heightGained + grid.highest;
};

// Process the movements for the next rock
const nextRock = (rocks, rocksStopped, jetPattern, jetUsed, grid) => {
  let currentRock = null;
  let jet = true;
  while (true) {
    // New rock needs to drop
    if (currentRock === null) {
      // Get the next rock and copy it
      currentRock = JSON.parse(
        JSON.stringify(rocks[rocksStopped % rocks.length]),
      );
      // Get the highest point in the grid and add spaces above that point
      for (const point of currentRock) {
        point.y = grid.highest + grid.spaceBelowRock + 1 + point.y;
      }
      jet = true;
    }
    // Jet tries to blow the rock
    else if (jet) {
      // Get the next jet direction and update the current positions of the rock into a new array
      let rockCanShift = true;
      let currentJet = jetPattern[jetUsed % jetPattern.length];
      jetUsed++;
      let newRockPositions = [];
      if (currentJet === "<") {
        for (const point of currentRock) {
          newRockPositions.push({ x: point.x - 1, y: point.y });
        }
      } else if (currentJet === ">") {
        for (const point of currentRock) {
          newRockPositions.push({ x: point.x + 1, y: point.y });
        }
      }

      // Check for collisions
      rockCanShift = !grid.checkCollision(newRockPositions);

      // If rock can shift then set then update the current positions to the new positions
      if (rockCanShift) currentRock = newRockPositions;

      // Next turn will not be the jet's turn
      jet = false;
    }
    // Jet went last round so now drop the rock one level and see if it stopped
    else if (!jet) {
      // Update the current rock positions into a new array that is down one level
      let rockStopped = false;
      let newRockPositions = [];
      for (const point of currentRock) {
        newRockPositions.push({ x: point.x, y: point.y - 1 });
      }

      // Check for collisions
      rockStopped = grid.checkCollision(newRockPositions);

      // If the rock stopped add it's points to the grid array, set the current
      // rock to null. and add one to rocks stopped
      if (rockStopped) return { currentRock, jetUsed };
      // If the rock is not stopped update the positions of the current rock
      else currentRock = newRockPositions;

      // Next round with be the jet's turn
      jet = true;
    }
  }
};

class Grid {
  constructor() {
    // Puzzle Universal Constants
    this.gridWidth = 7;
    this.spaceBelowRock = 3;

    this.points = new Set();
    this.highest = 0;
  }

  // Add rock to the grid and set the new highest based on new y values
  addRockToGrid = (rock) => {
    for (const point of rock) {
      this.points.add(`${point.x},${point.y}`);
      this.highest = Math.max(point.y, this.highest);
    }
  };

  // Check of a set of points for a rtock overlap with any of the point already stopped for a rock in the grid
  checkCollision = (rock) => {
    let collision = false;
    for (let r = 0; r < rock.length && !collision; r++) {
      const point = rock[r];
      // Check if the rock ran into a wall
      if (point.x < 0 || point.x >= this.gridWidth) collision = true;
      // Check if the rock hit the floor at x = 0;
      else if (point.y <= 0) collision = true;
      // Check if the rock collided with the stopped rocks
      else if (this.points.has(`${point.x},${point.y}`)) collision = true;
    }

    return collision;
  };

  // Get the x position pattern for this rock
  getPattern = (rock) => {
    let pattern = [];

    for (const point of rock) {
      pattern.push(`${point.x}`);
    }

    return pattern;
  };
}
