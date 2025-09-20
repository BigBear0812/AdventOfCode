// Puzzle for Day 12: https://adventofcode.com/2021/day/12

export const run = (fileContents) => {
  // Create cave map
  const caveMap = new Map();
  const smallCaves = new Set();
  const largeCaves = new Set();
  fileContents.forEach((line) => {
    // Split each line to egt the end values
    const ends = line.split("-");

    // Determine if this is a small or large cave and update the appropriate sets
    const end0Small = isSmallCave(ends[0]);
    const end1Small = isSmallCave(ends[1]);
    if (end0Small && ends[0].length === 2) smallCaves.add(ends[0]);
    if (end1Small && ends[1].length === 2) smallCaves.add(ends[1]);
    if (!end0Small && ends[0].length === 2) largeCaves.add(ends[0]);
    if (!end1Small && ends[1].length === 2) largeCaves.add(ends[1]);

    // Update the current values in the map if any
    const current0 = caveMap.get(ends[0]) ?? [];
    const current1 = caveMap.get(ends[1]) ?? [];
    current0.push(ends[1]);
    current1.push(ends[0]);
    caveMap.set(ends[0], current0);
    caveMap.set(ends[1], current1);
  });

  // Part 1
  const part1 = findAllPaths(caveMap, smallCaves, largeCaves, false).length;

  // Part 2
  const part2 = findAllPaths(caveMap, smallCaves, largeCaves, true).length;

  return { part1, part2 };
};

/**
 * Find all paths from start to end points
 * @param {Map} caveMap Map of the caves and which other caves they connect to
 * @param {Set} smallCaves The set of small caves
 * @param {Set} largeCaves The set of large caves
 * @param {boolean} part2 True if using part 2 rules
 * @returns {string[][]} The paths that go from start to end
 */
const findAllPaths = (caveMap, smallCaves, largeCaves, part2) => {
  // The paths from start to end
  const paths = [];

  // Depth First Search (DFS)
  // The queue of path options that are being considered
  const queue = [{ path: ["start"], allowSecond: true }];
  // Continue while there are still paths queued up to consider
  while (queue.length) {
    // For some reason depth first search (using .pop()) is much faster
    // here than breadth first search (using .shift()). My guess is it
    // has to do with shifting items off the front of a long array of
    // values being significantly slower due to indexing updates rather
    // than popping them off the end of the array.

    // Get the last path option off the end of the queue
    const current = queue.pop();
    // Get the last cave in the path
    const pathLast = current.path.at(-1);

    // Get the next options given the last cave visited in the path
    const nextOptions = caveMap.get(pathLast);

    // Examine all next options from the map
    for (let nextOption of nextOptions) {
      // If at end save the path and continue
      if (nextOption === "end") {
        paths.push(current.path);
        continue;
      }
      // Is this next options a small cave, large cave, or fit he cave has been visited
      const smallCave = smallCaves.has(nextOption);
      const largeCave = largeCaves.has(nextOption);
      const unvisited = !current.path.includes(nextOption);
      // If this is a small cave that has been visited before
      const smallCaveUnvisited = smallCave && unvisited;
      // If this part 2 and allows for small a small ave to be visited twice
      const smallCaveVisitedPart2 =
        part2 && smallCave && !unvisited && current.allowSecond;
      // If this next option should be considered
      if (smallCaveUnvisited || largeCave || smallCaveVisitedPart2) {
        // Update the path and add it to the queue
        queue.push({
          path: [...current.path, nextOption],
          allowSecond: smallCaveVisitedPart2 ? false : current.allowSecond,
        });
      }
    }
  }

  return paths;
};

/**
 * Determine if a cave node is a small cave
 * @param {string} node A cave node name
 * @returns {boolean} True if this is a small cave
 */
const isSmallCave = (node) => {
  // Get the first character of the string
  const firstCharCode = node.charCodeAt(0);
  // Is this anything except for an uppercase letter
  return firstCharCode < 65 || firstCharCode > 90;
};
