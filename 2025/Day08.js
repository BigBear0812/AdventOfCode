// Puzzle for Day 08: https://adventofcode.com/2025/day/8

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Get all of the junction boxes from the input
  const junctionBoxes = fileContents.map((line) => {
    // Split each line on the commas and parse it into a coordinates object
    const coords = line.split(",").map((num) => parseInt(num));
    return {
      x: coords[0],
      y: coords[1],
      z: coords[2],
    };
  });

  // An array of the distances for junction box pairs
  const distanceArray = [];

  // Find the distance from every junction box to every other junction box
  for (let a = 0; a < junctionBoxes.length; a++) {
    for (let b = a + 1; b < junctionBoxes.length; b++) {
      // Get the boxes and compute their straight line Euclidean
      // distance then add them to the array
      const aBox = junctionBoxes[a];
      const bBox = junctionBoxes[b];
      const dist = Math.sqrt(
        Math.pow(aBox.x - bBox.x, 2) +
          Math.pow(aBox.y - bBox.y, 2) +
          Math.pow(aBox.z - bBox.z, 2),
      );
      distanceArray.push({
        dist,
        boxes: [a, b],
      });
    }
  }
  // Sort the distances in ascending order
  distanceArray.sort((a, b) => a.dist - b.dist);

  // Keep track of all circuits as they are created with an array of
  // Sets containing the junction box ids in the circuit
  const circuitsArray = [];
  // Keep track of each connected junction box and the circuit it
  // is currently a member of
  const circuitsMap = new Map();
  // Prefill the unused boxes array with all junction boxes to
  // know which ones are left to be connected to any circuit
  const unusedBoxes = new Set([...junctionBoxes.keys()]);
  // The last connection made for the single giant circuit for part 2
  let lastConnection;
  // The result for part 1
  let part1;

  // Continue processing more shortest distance until either one
  // large circuit is found or the list is exhausted
  for (let x = 0; x < distanceArray.length; x++) {
    // Solve for part 1 if the 1000th connection has been made
    if (x === 1000)
      // Get all of the currently referenced circuits
      part1 = Array.from(new Set(circuitsMap.values()))
        // Save only those circuits sizes
        .map((circuit) => circuitsArray[circuit].size)
        // Sort the size in descending order
        .sort((a, b) => b - a)
        // Take the largest 3 sizes
        .splice(0, 3)
        // Multiple the sizes together
        .reduce((total, val) => (total *= val), 1);

    // Get the next connection
    let connection = distanceArray[x];
    // Get the existing circuits that these boxes may already be a part of
    let circuits = connection.boxes.map((box) => {
      if (unusedBoxes.has(box)) unusedBoxes.delete(box);
      if (circuitsMap.has(box)) return circuitsMap.get(box);
    });

    // If there are no unused boxes this means one giant circuit has been found
    if (unusedBoxes.size === 0) {
      // Save this final connection and break out of the loop
      lastConnection = connection;
      break;
    }

    // If both boxes are already part of the same circuit then skip this connection
    if (circuits[0] != null && circuits[0] === circuits[1]) continue;

    // Remove any falsy values
    circuits = circuits.filter((circuit) => circuit);

    // Add to a new circuit if neither box has been added to one yet
    if (circuits.length === 0) {
      // Set both boxes to the id of the new circuit to be added to the array
      connection.boxes.forEach((box) =>
        circuitsMap.set(box, circuitsArray.length),
      );
      // Add the new circuit to the array
      circuitsArray.push(new Set([...connection.boxes]));
    }
    // Add one of the boxes to the other box's existing circuit
    else if (circuits.length === 1) {
      // Update both boxes to be in the same circuit
      connection.boxes.forEach((box) => {
        circuitsMap.set(box, circuits[0]);
        connection.boxes.forEach((box) => circuitsArray[circuits[0]].add(box));
      });
    }
    // Join two existing circuits
    else {
      // Get both circuits
      const circuitA = circuitsArray[circuits[0]];
      const circuitB = circuitsArray[circuits[1]];
      // Create a new joined circuit
      const joinedCircuit = new Set([...circuitA.keys(), ...circuitB.keys()]);
      // Update all boxes to be in this new circuit that will be inserted
      joinedCircuit.forEach((box) =>
        circuitsMap.set(box, circuitsArray.length),
      );
      // Insert the new circuit
      circuitsArray.push(joinedCircuit);
    }
  }

  // Multiply together the x coordinates of the last 2 boxes to be connected
  const part2 = lastConnection.boxes.reduce(
    (total, box) => (total *= junctionBoxes[box].x),
    1,
  );

  return { part1, part2 };
};
