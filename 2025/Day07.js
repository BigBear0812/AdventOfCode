// Puzzle for Day 07: https://adventofcode.com/2025/day/7

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Split the incoming file contents into a 2d array of strings
  const grid = fileContents.map((line) => line.split(""));
  // Store set of all the splitters location strings
  const splitters = new Set();
  // Store the starting location
  const start = { y: 0, x: 0 };
  // Store the y value of the last row in the grid
  const lastRow = grid.length - 1;

  // Check each location in the grid for either the start or a splitter
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const curr = grid[y][x];

      if (curr === "S") {
        start.y = y;
        start.x = x;
      } else if (curr === "^") {
        splitters.add(JSON.stringify({ y, x }));
      }
    }
  }

  // Compute the result
  return { ...solution(start, splitters, lastRow) };
};

/**
 * Solve the problem
 * @param {{y: number, x: number}} start Start location
 * @param {Set<string>} splitters The set of stringified splitter locations
 * @param {number} lastRow The last row of the grid
 */
const solution = (start, splitters, lastRow) => {
  // A map of splitters that split beams mapped to the splitters that send beam towards them
  const foundSplitters = new Map();
  // A map of each splitter and how many paths it produces
  const splitterTotals = new Map();
  // The current beams being processed through the search
  const beams = [{ ...start, parent: "start" }];
  // Continue while there is still another beam to process
  while (beams.length) {
    // The current location fo the beam
    let currLoc = beams.pop();
    // A flag for if the beam hits a splitter
    let foundSplitter = false;
    // Continue moving the beam down until it hits a splitter or the last row
    while (!foundSplitter && currLoc.y < lastRow) {
      // Get the next location the beam goes to
      const nextY = currLoc.y + 1;
      const nextLoc = { y: nextY, x: currLoc.x };
      const nextLocStr = JSON.stringify(nextLoc);
      // Handle if this is a splitter
      if (splitters.has(nextLocStr)) {
        // Set the flag
        foundSplitter = true;
        // If the splitter has been found then add it to the map of found
        // splitters with the current location's parent
        if (!foundSplitters.has(nextLocStr))
          foundSplitters.set(nextLocStr, [currLoc.parent]);
        // Otherwise add this parent to the already found splitter and
        // skip further processing for this beam
        else {
          foundSplitters.set(nextLocStr, [
            ...foundSplitters.get(nextLocStr),
            currLoc.parent,
          ]);
          continue;
        }
        // Get the right and left locations the splitter produces and add them to the beams array.
        // In this case the parent will be the current splitter that was just found
        const leftLoc = { y: nextLoc.y, x: nextLoc.x - 1, parent: nextLocStr };
        const rightLoc = { y: nextLoc.y, x: nextLoc.x + 1, parent: nextLocStr };
        beams.push(leftLoc);
        beams.push(rightLoc);
      }
      // Otherwise update the the current locations y value and keep going down
      else {
        currLoc.y = nextLoc.y;
      }
    }

    // If a beam runs off the bottom of the grid
    if (currLoc.y === lastRow) {
      // Add one to the total number of beams produced by the parent splitter.
      splitterTotals.set(
        currLoc.parent,
        (splitterTotals.get(currLoc.parent) || 0) + 1,
      );
    }
  }

  // Get an array fo all the found splitter locations as objects
  const foundSplitterLocs = Array.from(foundSplitters.keys()).map((loc) =>
    JSON.parse(loc),
  );

  // Process each row going from bottom to top of the grid
  for (let y = lastRow; y >= 0; y--) {
    // Get the found splitters on this row
    const onRow = foundSplitterLocs.filter((loc) => loc.y === y);

    // Process each splitter
    for (const loc of onRow) {
      // Get the location string and the parent splitters for this splitter
      const locStr = JSON.stringify(loc);
      const parents = foundSplitters.get(locStr);
      // Update each parents total beams by adding the current splitter's
      // total beams to the parents total beams.
      for (const parent of parents) {
        splitterTotals.set(
          parent,
          (splitterTotals.get(parent) || 0) + splitterTotals.get(locStr),
        );
      }
    }
  }

  // Return the number of found splitters for part 1 and
  // the total number of beams produced from the start for part 2
  return { part1: foundSplitters.size, part2: splitterTotals.get("start") };
};
