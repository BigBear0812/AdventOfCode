// Puzzle for Day 02: https://adventofcode.com/2021/day/2

export const run = (fileContents) => {
  // Parse the instructions form the input
  const instructions = fileContents.map((line) => {
    // Split the line info by the space in the middle
    const splits = line.split(" ");
    // Create an object for the parsed data
    return {
      dir: splits[0],
      val: parseInt(splits[1]),
    };
  });

  // Part 1

  // Track the horizontal position and depth
  let subHorPos1 = 0;
  let subDepPo2 = 0;

  // Process each instruction
  for (const inst of instructions) {
    switch (inst.dir) {
      // Move horizontal position
      case "forward":
        subHorPos1 += inst.val;
        break;
      // Move depth up
      case "up":
        subDepPo2 -= inst.val;
        break;
      // Move depth down
      case "down":
        subDepPo2 += inst.val;
        break;
    }
  }

  // Calculate the final value
  const part1 = subDepPo2 * subHorPos1;

  // Part 2

  // Track the horizontal position, depth, and aim
  let subHorPos2 = 0;
  let subDepPos2 = 0;
  let subAim2 = 0;

  // Process each instruction
  for (const inst of instructions) {
    switch (inst.dir) {
      // Move the sub forward
      case "forward":
        subHorPos2 += inst.val;
        subDepPos2 += inst.val * subAim2;
        break;
      // Adjust the aim up
      case "up":
        subAim2 -= inst.val;
        break;
      // Adjust the aim down
      case "down":
        subAim2 += inst.val;
        break;
    }
  }

  // Calculate the final value
  const part2 = subDepPos2 * subHorPos2;

  return { part1, part2 };
};
