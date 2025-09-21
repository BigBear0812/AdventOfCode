// Puzzle for Day 20: https://adventofcode.com/2017/day/20

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the input separately for each part of the puzzle
  let particles1 = parseInput(fileContents);
  let particles2 = parseInput(fileContents);

  // Find the particle that on average stays closest to (0, 0, 0)
  let result1 = avgClosestParticle(particles1);

  // Simulate the particles movements and eliminate particles that collide
  particlesAfterCollisions(particles2);

  return { part1: result1.closestAvgPart, part2: particles2.size };
};

// Simulate the movements of particles and eliminate ones that collide
const particlesAfterCollisions = (particles) => {
  // Simulate for 500 movements to make sure all collisions happen brfore particles begin to move away from each other
  for (let t = 0; t < 500; t++) {
    // Create a map of new positions
    let newPositions = new Map();
    // Find each particles new position and add it to the map
    particles.forEach((val, key) => {
      // Find the new position of each particle
      val.v.x += val.a.x;
      val.v.y += val.a.y;
      val.v.z += val.a.z;
      val.p.x += val.v.x;
      val.p.y += val.v.y;
      val.p.z += val.v.z;

      // Create or update map entries for new positions to find collisions
      let parts = [];
      let pos = `${val.p.x},${val.p.y},${val.p.z}`;
      if (newPositions.has(pos)) {
        parts = newPositions.get(pos);
      }
      parts.push(key);
      newPositions.set(pos, parts);
    });

    // Create an array of all particle that are sharing a given point
    let collided = [];
    newPositions.forEach((val) => {
      if (val.length > 1) collided = collided.concat(val);
    });

    // Delete the collided particles from the particles map
    for (let c of collided) {
      particles.delete(c);
    }
  }
};

// FInd the particle that stays the closest to (0, 0, 0) on average
const avgClosestParticle = (particles) => {
  // The closest particle and it's average
  let closestAvg = Number.MAX_SAFE_INTEGER;
  let closestAvgPart = null;

  // Find the average distance from (0, 0, 0) for each point
  particles.forEach((val, key) => {
    // The distances a point has from 0 at each time
    let distances = [];
    // Simulate 500 movements to make sure points have moved
    // enough to predict long term results
    for (let t = 0; t < 500; t++) {
      // Add the current diatance to the array
      distances.push(Math.abs(val.p.x) + Math.abs(val.p.y) + Math.abs(val.p.z));
      // Find the new position of the particle
      val.v.x += val.a.x;
      val.v.y += val.a.y;
      val.v.z += val.a.z;
      val.p.x += val.v.x;
      val.p.y += val.v.y;
      val.p.z += val.v.z;
    }
    // After 500 movements find the average particle distance from (0, 0, 0)
    let avgDistance =
      distances.reduce((total, val) => total + val) / (distances.length * 1.0);
    // If this is the lowest average so far save it and the particle number
    if (avgDistance < closestAvg) {
      closestAvg = avgDistance;
      closestAvgPart = key;
    }
  });

  return { closestAvg, closestAvgPart };
};

// Parse each line as a new particle into a map
const parseInput = (fileContents) => {
  // Regex for reading each particle's information
  let reg = new RegExp(
    /p=<([-\d]+),([-\d]+),([-\d]+)>, v=<([-\d]+),([-\d]+),([-\d]+)>, a=<([-\d]+),([-\d]+),([-\d]+)>/,
  );
  // Resulting particles in a map
  let particles = new Map();

  // Parse each line of the file as a new particle
  for (let x = 0; x < fileContents.length; x++) {
    // Find matches in the current line of text
    let line = fileContents[x];
    let matches = line.match(reg);

    // Add particles to the map with their specified
    // position, velocity, and acceleration
    particles.set(x, {
      p: {
        x: parseInt(matches[1]),
        y: parseInt(matches[2]),
        z: parseInt(matches[3]),
      },
      v: {
        x: parseInt(matches[4]),
        y: parseInt(matches[5]),
        z: parseInt(matches[6]),
      },
      a: {
        x: parseInt(matches[7]),
        y: parseInt(matches[8]),
        z: parseInt(matches[9]),
      },
    });
  }

  return particles;
};
