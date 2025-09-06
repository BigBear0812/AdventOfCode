// Puzzle for Day 15: https://adventofcode.com/2018/day/15

export const run = (fileContents) => {
  // Get the data for part 1
  let data1 = parseInput(fileContents);

  // Run the part 1 simulation
  let rounds1 = runSimulation(data1);

  // Re-run the simulation with increasing elf
  // attack strength until no elves die
  let foundMin = false;
  let attack = 4;
  let data2;
  let rounds2;
  while (!foundMin) {
    // Create a new set of data from the input with the increased attack strength
    data2 = parseInput(fileContents, attack);
    // Get the total number of elves
    let totalElves = 0;
    data2.units.forEach((val) => {
      if (val.type === "E") totalElves++;
    });

    // Run the simulation with the new data
    rounds2 = runSimulation(data2);

    // Get all types for the remaining units
    let types = [];
    data2.units.forEach((x) => {
      if (types.indexOf(x.type) === -1) types.push(x.type);
    });

    // If only one type of unit, it's and elf, and no elf has died then the attack power min has been found
    if (
      types.length === 1 &&
      types[0] === "E" &&
      data2.units.size === totalElves
    ) {
      foundMin = true;
    }
    // If elves died then increase the attack strength by one to try again
    else {
      attack++;
    }
  }

  return {
    part1: finalValue(data1, rounds1),
    part2: finalValue(data2, rounds2),
  };
};

// Calculate the final value
const finalValue = (data, rounds) => {
  // Get the sum of all remaining units hp
  let hpSum = 0;
  data.units.forEach((val) => (hpSum += val.hp));

  // Return the number of rounds multiplied by the hp sum
  return rounds * hpSum;
};

// Run the battle simulation until it has reached the end
const runSimulation = (data) => {
  // Continue running until the simulation ends keeping
  // track of the number of rounds
  let done = false;
  let round = 0;
  while (!done) {
    // Get the units that will update in reading order
    let unitsOrder = data.grid.flat().filter((x) => x !== "#" && x !== ".");

    for (let u = 0; !done && u < unitsOrder.length; u++) {
      let unitId = unitsOrder[u];
      let unit = data.units.get(unitId);
      if (unit === undefined) continue;
      // Get the spaces that surround the current unit
      let unitSurrounding = getSurroundingSpaces(data, {
        x: unit.x,
        y: unit.y,
      });
      // Check for attack opporutnities
      let attacked = attack(data, unit, unitSurrounding);
      done = gameOver(data);
      // No attacks. Try to move
      if (!attacked) {
        // Find all reachable spaces using BFS and map
        // out the spaces distance to the current unit
        let reachable = allReachableSpaces(data, { x: unit.x, y: unit.y });
        // Get all in range spaces that are reachable
        let inRange = [];
        data.units.forEach((val) => {
          if (val.type !== unit.type) {
            let surrounding = getSurroundingSpaces(data, { x: val.x, y: val.y })
              .filter(
                (val) =>
                  val.symbol === "." && reachable.has(`${val.x},${val.y}`),
              )
              .map((val) => reachable.get(`${val.x},${val.y}`));
            inRange = inRange.concat(surrounding);
          }
        });

        // If there is an in range space to move towards
        if (inRange.length > 0) {
          // This is the target space to move towards
          let targetSpace = inRange.sort((a, b) => {
            let result = a.dis - b.dis;
            if (result === 0) result = a.y - b.y;
            if (result === 0) result = a.x - b.x;
            return result;
          })[0];

          // Get all moves that can be made
          let moveSpaces = unitSurrounding.filter((val) => val.symbol === ".");
          // Get the shoratest distance from each possible move space to the target.
          // Then sort them by the best choice first
          let moveSpace = moveSpaces
            .map((val) => {
              let dis = shortestDistance(data, val, targetSpace);
              return { x: val.x, y: val.y, dis };
            })
            .filter((val) => val.dis !== null && val.dis !== undefined)
            .sort((a, b) => {
              let result = a.dis - b.dis;
              if (result === 0) result = a.y - b.y;
              if (result === 0) result = a.x - b.x;
              return result;
            })[0];

          // Move the unit to the found best move space by updating the grid and the units map
          if (moveSpace) {
            data.grid[unit.y][unit.x] = ".";
            data.grid[moveSpace.y][moveSpace.x] = unitId;
            unit.x = moveSpace.x;
            unit.y = moveSpace.y;
            data.units.set(unitId, unit);

            // After moving attempt to attack
            attack(
              data,
              unit,
              getSurroundingSpaces(data, { x: unit.x, y: unit.y }),
            );
            done = gameOver(data);
          }
        }
      }
    }

    if (!done) round++;
    // print(data);
  }

  return round;
};

// See if there is an attack and if so then perform the attack
const attack = (data, unit, unitSurrounding) => {
  // Filter out walls, emptys, and units of similar types
  // Sort the units by health lowest first
  let attacks = unitSurrounding
    .filter(
      (x) =>
        x.symbol !== "#" &&
        x.symbol !== "." &&
        data.units.get(x.symbol).type !== unit.type,
    )
    .sort((a, b) => data.units.get(a.symbol).hp - data.units.get(b.symbol).hp);

  // If there is a valid attack nearby
  if (attacks.length > 0) {
    // Get the unit to attack and attack
    let toAttack = data.units.get(attacks[0].symbol);
    toAttack.hp = toAttack.hp - unit.attack;

    // If dead
    if (toAttack.hp <= 0) {
      // Delete from the units map and the grid
      data.units.delete(attacks[0].symbol);
      data.grid[toAttack.y][toAttack.x] = ".";
    }
    // The unit survived and should be updated
    else {
      data.units.set(attacks[0].symbol, toAttack);
    }

    return true;
  }
  return false;
};

// Checks if the simulation has reached it's end
const gameOver = (data) => {
  // Get all types for the remaining units
  let types = [];
  data.units.forEach((x) => {
    if (types.indexOf(x.type) === -1) types.push(x.type);
  });

  // If only one type of unit is left the simulation is over
  if (types.length === 1) {
    return true;
  }
  return false;
};

// Find the shortest distance between two points using Breadth First Search (BFS)
const shortestDistance = (data, start, end) => {
  // Keep track of the visited locations and add the start with a distance of 0
  let visited = new Set();
  visited.add(`${start.x},${start.y}`);
  // Add the start as the first state
  let states = [{ x: start.x, y: start.y, dis: 0 }];
  // Check if the start and end are the same if so the distance is 0 otherwise
  // it is null and still needs to be found
  let foundDistance = start.x === end.x && start.y === end.y ? 0 : null;
  // Continue while the distance is not found and the possible next states have not run out
  while (foundDistance === null && states.length > 0) {
    // Get the next state to examine
    let current = states.shift();
    // Get the spaces surrounding this one and get only the empty spaces that have not yet been visited
    getSurroundingSpaces(data, { x: current.x, y: current.y })
      .filter(
        (space) =>
          space.symbol === "." && !visited.has(`${space.x},${space.y}`),
      )
      .forEach((val) => {
        // If this is the end then set the found distance
        if (val.x === end.x && val.y === end.y) foundDistance = current.dis + 1;
        // Add the next possible state to the states array and the visited set
        states.push({ x: val.x, y: val.y, dis: current.dis + 1 });
        visited.add(`${val.x},${val.y}`);
      });
  }

  return foundDistance;
};

// Get all reachable space from a starting location using Breadth First Search (BFS)
const allReachableSpaces = (data, start) => {
  // The map of reachable spaces starting off witht he start point at a distance of 0
  let reachable = new Map();
  reachable.set(`${start.x},${start.y}`, { x: start.x, y: start.y, dis: 0 });
  // Add the start as the first state in the search
  let states = [{ x: start.x, y: start.y, dis: 0 }];
  // Continue until there are no more states
  while (states.length > 0) {
    // Get the next state to examine
    let current = states.shift();
    // Get the spaces surrounding this one and get only the empty spaces that have
    // not yet been added to the reachable map
    getSurroundingSpaces(data, { x: current.x, y: current.y })
      .filter(
        (space) =>
          space.symbol === "." && !reachable.has(`${space.x},${space.y}`),
      )
      .forEach((val) => {
        // Add the next possible state to the states array and the reachable map
        states.push({ x: val.x, y: val.y, dis: current.dis + 1 });
        reachable.set(`${val.x},${val.y}`, {
          x: val.x,
          y: val.y,
          dis: current.dis + 1,
        });
      });
  }

  return reachable;
};

// Get the surrounding spaces to the given space
const getSurroundingSpaces = (data, pos) => {
  // Get all of the surrounding space for a position in reading order
  let surrounding = [];
  surrounding.push({
    symbol: data.grid[pos.y - 1][pos.x],
    x: pos.x,
    y: pos.y - 1,
  }); // Up
  surrounding.push({
    symbol: data.grid[pos.y][pos.x - 1],
    x: pos.x - 1,
    y: pos.y,
  }); // Left
  surrounding.push({
    symbol: data.grid[pos.y][pos.x + 1],
    x: pos.x + 1,
    y: pos.y,
  }); // Right
  surrounding.push({
    symbol: data.grid[pos.y + 1][pos.x],
    x: pos.x,
    y: pos.y + 1,
  }); // Down
  return surrounding;
};

// Print out the grid similar to how the examples show it including unit
// hp's for the given line in order. This was used during testing
const print = (data) => {
  // The full console output
  let output = "";
  // Examin every row
  for (let y = 0; y < data.grid.length; y++) {
    // The units on this row
    let lineUnits = [];
    // Examine each space in this row
    for (let x = 0; x < data.grid[y].length; x++) {
      // If this is a unit replace it's ID with it's type for the
      // output. Also, add it to the line units
      if (data.grid[y][x] !== "#" && data.grid[y][x] !== ".") {
        let unit = data.units.get(data.grid[y][x]);
        output += unit.type;
        lineUnits.push(unit);
      }
      // Otherwise add the symbol to the output
      else output += data.grid[y][x];
    }
    // If there are units on this line output their info on the console
    if (lineUnits.length > 0) {
      // Inital spacing
      output += "   ";
      // Each unit's info in the order they are on the current line
      for (let u = 0; u < lineUnits.length; u++) {
        if (u !== 0) {
          output += ", ";
        }
        output += `${lineUnits[u].type}(${lineUnits[u].hp})`;
      }
    }
    // Add a new line character for each row
    output += "\n";
  }
  console.log(output);
};

// Parse the input and elf attack strength into a data object for processing
const parseInput = (fileContents, elfAttack = 3) => {
  // Grid outlining the map for the battle filled by the file contents
  let grid = [];
  for (let line of fileContents) {
    grid.push(line.split(""));
  }

  // The map of unit info and current unit id
  let units = new Map();
  let unitId = 0;
  // Check each each row and then column to assign ID's
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      // If the space is a unit
      if (grid[y][x] !== "#" && grid[y][x] !== ".") {
        // Add this unit to the set of units with the curent ID
        let type = grid[y][x];
        units.set(unitId, {
          type,
          x,
          y,
          hp: 200,
          attack: type === "E" ? elfAttack : 3,
        });
        // Update the symbol on the grid for it to be the ID of this unit
        grid[y][x] = unitId;
        // Increment the unit ID
        unitId++;
      }
    }
  }

  return { grid, units };
};
