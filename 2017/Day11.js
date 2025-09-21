// Puzzle for Day 11: https://adventofcode.com/2017/day/11

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse in the directions to move from the first line of the input file separated by commas
  let directions = fileContents[0].split(",");

  // The start position at 0, 0, 0 assuming cubic coordinate system.
  let position = { x: 0, y: 0, z: 0 };
  // The furtherst disatance form start found.
  let furthestDistance = 0;
  // The current distance from 0 after the instruction is processed.
  let currentDistance = 0;

  // Process each direction moving the position on a cubic grid system.
  // Below shows how to update X, Y, and Z when moving on this grid system.
  //
  //        \  x++  y-- /
  //  z++    \    n    /    x++
  //  y--     +-------+     z--
  //      nw /       x \ ne
  //        /           \
  //  -----+ z           +------
  //        \           /
  //      sw \       y / se
  //  x--     +-------+     z--
  //  z++    /    s    \    y++
  //        / x--   y++ \

  for (let dir of directions) {
    switch (dir) {
      case "n":
        position.x++;
        position.y--;
        break;
      case "s":
        position.x--;
        position.y++;
        break;
      case "ne":
        position.x++;
        position.z--;
        break;
      case "sw":
        position.x--;
        position.z++;
        break;
      case "nw":
        position.z++;
        position.y--;
        break;
      case "se":
        position.z--;
        position.y++;
        break;
    }

    // Find the absoute value from each of the coordinate values
    let x = Math.abs(position.x);
    let y = Math.abs(position.y);
    let z = Math.abs(position.z);

    // The current distance from start is the highest of the coordinate values absolute value
    currentDistance = x > y ? x : y > z ? y : z;
    // If this current distance is further from start than the furthest seen so far update the furtheest value
    furthestDistance =
      currentDistance > furthestDistance ? currentDistance : furthestDistance;
  }

  return { part1: currentDistance, part2: furthestDistance };
};
