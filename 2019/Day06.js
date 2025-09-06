// Puzzle for Day 6: https://adventofcode.com/2019/day/6

export const run = (fileContents) => {
  // Parse the input into an orbits map
  let map = parseInput(fileContents);
  // Solve part 1
  let result1 = countOrbits(map);
  // Solve part 2
  let result2 = jumpsToFindSan(map);

  return { part1: result1, part2: result2 };
};

// Find the number of jumpd to santa for part 2
const jumpsToFindSan = (map) => {
  // The path from YOU to the COM
  let youPath = [];
  let pYou = map.get("YOU");
  while (pYou !== undefined) {
    youPath.push(pYou);
    pYou = map.get(pYou);
  }

  // The path from SAN to the COM
  let sanPath = [];
  let pSan = map.get("SAN");
  while (pSan !== undefined) {
    sanPath.push(pSan);
    pSan = map.get(pSan);
  }

  // Find the unique remaining parts of the paths by removing any shared objects
  let sanPathRemaining = sanPath.filter((x) => !youPath.includes(x));
  let youPathRemaining = youPath.filter((x) => !sanPath.includes(x));

  // Return the sum of the lengths of the remaining paths
  return sanPathRemaining.length + youPathRemaining.length;
};

// Count all orbits for part 1
const countOrbits = (map) => {
  // All orbits
  let count = 0;

  // For each objcet in the map count up the number of parent objects ending with an object who has no parent object
  map.forEach((parent, object, map) => {
    let p = parent;
    while (p !== undefined) {
      count++;
      p = map.get(p);
    }
  });

  return count;
};

// Pasre the input into a map of the orbits
const parseInput = (fileContents) => {
  // Map of the celestial objects and the
  // parent object that they are orbiting
  let map = new Map();

  // Treat each line as a new orbit. Split
  // the line as parent and child on ) and
  // add them to map with the child as the
  // key
  for (let line of fileContents) {
    let celestialObjects = line.split(")");
    map.set(celestialObjects[1], celestialObjects[0]);
  }

  return map;
};
