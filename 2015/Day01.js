// Puzzle for Day 1: https://adventofcode.com/2015/day/1

export const run = (fileContents) => {
  // Each floor defined by each line of the input
  let floors = [];

  // Read in all of the lines one at a time
  for (const line of fileContents) {
    const chars = Array.from(line);
    // Start at floor 0
    let currentFloor = 0;
    let firstCharNegative = null;
    for (let x = 0; x < chars.length; x++) {
      const c = chars[x];
      // Move up or down the floors
      if (c === "(") currentFloor++;
      if (c === ")") currentFloor--;
      // Check if the floor number has gone negative mfor the first time
      if (currentFloor < 0 && firstCharNegative === null)
        firstCharNegative = x + 1;
    }
    // Pass out values
    floors.push({
      currentFloor: currentFloor,
      firstCharNegative: firstCharNegative,
    });
  }

  return { part1: floors[0].currentFloor, part2: floors[0].firstCharNegative };
};
