// Puzzle for Day 24: https://adventofcode.com/2017/day/24

export const run = (fileContents) => {
  // Get the connectors from the input
  let connectors = parseInput(fileContents);

  // Find all of the bridges
  let all = findAllBridges(connectors, []);

  // Find the strongest bridge and the longest bridge with the highest strength
  let strongest = { used: [], strength: 0 };
  let longestStrongest = { used: [], strength: 0 };
  for (let bridge of all) {
    if (strongest.strength < bridge.strength) strongest = bridge;
    if (
      longestStrongest.used.length < bridge.used.length ||
      (longestStrongest.used.length === bridge.used.length &&
        longestStrongest.strength < bridge.strength)
    )
      longestStrongest = bridge;
  }

  return { part1: strongest.strength, part2: longestStrongest.strength };
};

// Find all bridges from the connectors using recursive Depth First Search (DFS)
const findAllBridges = (unused, used) => {
  // Get the end connector that the next connector will have to attach to. If
  // there is not last connector then the value is 0 since it is at the start
  let endConnector = used.length > 0 ? used[used.length - 1].output : 0;
  // Create an array to insert all bridges from the current connector on into.
  // Start by inserting this currnt set of used connectors
  let allBridges = [
    {
      used,
      strength: used.reduce((total, val) => total + val.input + val.output, 0),
    },
  ];
  // Check all of the unsued connectors to see if they can possibly be used next
  for (let x = 0; x < unused.length; x++) {
    // Decide if the connector can connector forward or backwards
    let flipConnector = false;
    let canConnect = false;
    // Can connect forward
    if (unused[x].input === endConnector) {
      canConnect = true;
    }
    // Can connect backwards
    else if (unused[x].output === endConnector) {
      canConnect = true;
      flipConnector = true;
    }

    // If it can connect either direction
    if (canConnect) {
      // Create new objects for the used and unsued arrays with the connector being used
      // being remvoed from the new unused array and being added to the new used array
      let newUnused = JSON.parse(JSON.stringify(unused));
      let removed = newUnused.splice(x, 1);
      let newUsed = JSON.parse(JSON.stringify(used));
      // If this connector connects backwards then flip the connector
      // before adding it the the new used array
      if (flipConnector) {
        let temp = removed[0].input;
        removed[0].input = removed[0].output;
        removed[0].output = temp;
      }
      newUsed.push(removed[0]);
      // Pass this array to the next recursive level down to find if
      // the bridge can continue after this connector
      allBridges.push(findAllBridges(newUnused, newUsed));
    }
  }
  // Since this array will now be an array of array's make sure
  // to flatten this before passing up the next level
  return allBridges.flat();
};

// Parse the input into a list of connector objects
const parseInput = (fileContents) => {
  // Resulting connectors
  let connectors = [];
  for (let line of fileContents) {
    // Split on the / and add the new connector
    let connections = line.split("/");
    connectors.push({
      input: parseInt(connections[0]),
      output: parseInt(connections[1]),
    });
  }
  return connectors;
};
