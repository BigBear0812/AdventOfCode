// Puzzle for Day 12: https://adventofcode.com/2019/day/12

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Get the moons from the input file and make
  // a copy of it for each part
  let moons1 = parseInput(fileContents);
  let moons2 = JSON.parse(JSON.stringify(moons1));

  // Part 1 simulate the steps for 1000 times
  // and get the total energy
  let total = simulateSteps(moons1, 1000);

  // Part 2 find the number of steps until the
  // moons returns to a previous state
  let repeatAt = simulateUntilRepeat(moons2);

  return { part1: total, part2: repeatAt };
};

// Simulate the steps for a given number of rounds
// and return the total energy
const simulateSteps = (moons, steps) => {
  // Simulate for the given number of steps
  for (let s = 0; s < steps; s++) {
    singleStep(moons);
  }

  // Get the total energy for the array of moons
  let total = 0;
  for (let moon of moons) {
    let potentialEnergy =
      Math.abs(moon.posX) + Math.abs(moon.posY) + Math.abs(moon.posZ);
    let kineticEnergy =
      Math.abs(moon.velX) + Math.abs(moon.velY) + Math.abs(moon.velZ);
    total += potentialEnergy * kineticEnergy;
  }
  return total;
};

// Simulate the steps to find the number of steps required
// before the moons return to a previous state
const simulateUntilRepeat = (moons) => {
  // Keep track of the moons previous
  // states for each dimension
  let xPrev = new Map();
  let yPrev = new Map();
  let zPrev = new Map();
  // Get the starting state and add it
  // to each of the dimensions maps
  let startState = state(moons);
  xPrev.set(startState.xState, 0);
  yPrev.set(startState.yState, 0);
  zPrev.set(startState.zState, 0);
  // Keep track of when previuous states
  // are found for each dimension
  let xFound = false;
  let yFound = false;
  let zFound = false;
  let previous = [];

  // Keep simulating next steps until all dimensions
  // have found a repeated state
  for (let s = 0; previous.length < 3; s++) {
    singleStep(moons);

    // Get the currrent state after simulating the step
    let curState = state(moons);
    if (!xFound) {
      // If not a seen state add it to the dimension's set
      if (!xPrev.has(curState.xState)) xPrev.set(curState.xState, s + 1);
      // Otherwise a repeat has been found so add it to previous
      else {
        previous.push(s + 1);
        xFound = true;
      }
    }

    if (!yFound) {
      // If not a seen state add it to the dimension's set
      if (!yPrev.has(curState.yState)) yPrev.set(curState.yState, s + 1);
      // Otherwise a repeat has been found so add it to previous
      else {
        previous.push(s + 1);
        yFound = true;
      }
    }

    if (!zFound) {
      // If not a seen state add it to the dimension's set
      if (!zPrev.has(curState.zState)) zPrev.set(curState.zState, s + 1);
      // Otherwise a repeat has been found so add it to previous
      else {
        previous.push(s + 1);
        zFound = true;
      }
    }
  }

  // Return the least common multiple of the
  // steps at which each dimension repeated
  return lcm_arr(previous);
};

// Simulate a single step
let singleStep = (moons) => {
  // Apply gravity
  for (let m1 = 0; m1 < moons.length; m1++) {
    for (let m2 = m1 + 1; m2 < moons.length; m2++) {
      let moon1 = moons[m1];
      let moon2 = moons[m2];
      // Update Velocity X
      if (moon1.posX < moon2.posX) {
        moon1.velX++;
        moon2.velX--;
      } else if (moon1.posX > moon2.posX) {
        moon1.velX--;
        moon2.velX++;
      }
      // Update Velocity Y
      if (moon1.posY < moon2.posY) {
        moon1.velY++;
        moon2.velY--;
      } else if (moon1.posY > moon2.posY) {
        moon1.velY--;
        moon2.velY++;
      }
      // Update Velocity Z
      if (moon1.posZ < moon2.posZ) {
        moon1.velZ++;
        moon2.velZ--;
      } else if (moon1.posZ > moon2.posZ) {
        moon1.velZ--;
        moon2.velZ++;
      }
    }
  }

  // Update Position
  for (let moon of moons) {
    moon.posX += moon.velX;
    moon.posY += moon.velY;
    moon.posZ += moon.velZ;
  }
};

// Get the state of the moons by each dimension
const state = (moons) => {
  // Each dimension has a separate state string
  let xState = "";
  let yState = "";
  let zState = "";
  // Build the state strings for each dimension
  for (let moon of moons) {
    xState += `\{${moon.posX},${moon.velX}\}`;
    yState += `\{${moon.posY},${moon.velY}\}`;
    zState += `\{${moon.posZ},${moon.velZ}\}`;
  }
  return { xState, yState, zState };
};

// Parse the input file into an array of moon objects
const parseInput = (fileContents) => {
  // Regex for parsing each moon and the resulting array of moons
  let reg = new RegExp(/<x=([-\d]+), y=([-\d]+), z=([-\d]+)>/);
  let moons = [];

  // Treat each line as a different moon
  for (let l = 0; l < fileContents.length; l++) {
    // Get the moon and significant values from the line
    let line = fileContents[l];
    let matches = line.match(reg);

    // Add the moon to the result set
    moons.push({
      id: l,
      posX: parseInt(matches[1]),
      posY: parseInt(matches[2]),
      posZ: parseInt(matches[3]),
      velX: 0,
      velY: 0,
      velZ: 0,
    });
  }
  return moons;
};

// Get the least common multiple of an array of numbers
const lcm_arr = (nums) => {
  // Set the result to the first value in the array
  let result = nums[0];
  // For each number find the LCM of the current result
  // and the next number in the array
  for (let x = 1; x < nums.length; x++) {
    result = lcm_two(result, nums[x]);
  }
  return result;
};

// Get the least common multiple of two numbers
const lcm_two = (a, b) => {
  return Math.abs((a * b) / gcd_two(a, b));
};

// Get the greatest common denominator of two numbers
const gcd_two = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    var temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};
