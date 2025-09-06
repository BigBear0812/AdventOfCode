// Puzzle for Day 18: https://adventofcode.com/2023/day/18

export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

/**
 * Part 1 Solution
 * @param {string[]} fileContents
 * @returns
 */
const part1 = (fileContents) => {
  // Parse the instructions according to part 1
  let instructions = [];

  // The letter for direction and number for distance
  for (let line of fileContents) {
    let matches = line.match(/([UDLR]) (\d+) \(#([\dabcdef]+)\)/);
    let direction = matches[1];
    let distance = parseInt(matches[2]);
    instructions.push({ direction, distance });
  }

  return totalArea(instructions);
};

/**
 * Part 2 Solution
 * @param {string[]} fileContents
 * @returns
 */
const part2 = (fileContents) => {
  // Parse the instructions according to part 2
  let instructions = [];

  // Get the color code. Convert the first 5 digits to the distance and the last digit to direction
  for (let line of fileContents) {
    let matches = line.match(/([UDLR]) (\d+) \(#([\dabcdef]+)\)/);
    let color = matches[3];
    let distance = parseInt(color.slice(0, 5), 16);
    let directionNum = color.slice(5);
    let direction;
    switch (directionNum) {
      case "0":
        direction = "R";
        break;
      case "1":
        direction = "D";
        break;
      case "2":
        direction = "L";
        break;
      case "3":
        direction = "U";
        break;
    }
    instructions.push({ direction, distance });
  }

  return totalArea(instructions);
};

/**
 * Get the total area given the set if instructions outlining the border of the area
 * @param {{direction: string, distance: number}[]} instructions
 * @returns
 */
const totalArea = (instructions) => {
  // Use the shoelace formula to calculate the area inside the loop
  // https://en.wikipedia.org/wiki/Shoelace_formula

  // Setup the initial state for the shoelace formula
  let total = 0;
  let current = { x: 0, y: 0 };
  let previous = { x: 0, y: 0 };
  // For each instruction continue to update the current and
  // previous points to continue totaling up the formula value
  for (let instruction of instructions) {
    for (let x = 0; x < instruction.distance; x++) {
      switch (instruction.direction) {
        case "U":
          current.y--;
          break;
        case "D":
          current.y++;
          break;
        case "L":
          current.x--;
          break;
        case "R":
          current.x++;
          break;
      }
      total += current.x * previous.y - previous.x * current.y;
      previous.x = current.x;
      previous.y = current.y;
    }
  }
  // Get the final area
  let area = Math.abs(total) / 2;

  // Use Pick's theorem given the area to calculate the number of interior points
  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  let totalPointCount = instructions.reduce(
    (total, i) => (total += i.distance),
    0,
  );
  let interiorPoints = area - totalPointCount / 2 + 1;

  // The total points is the interior plus the edge points from the instructions
  return totalPointCount + interiorPoints;
};
