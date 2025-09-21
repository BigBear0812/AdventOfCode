// Puzzle for Day 22: https://adventofcode.com/2022/day/22

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

const part1 = (fileContents) => {
  // Parse the input file into a useable grid map and instructions set
  let input = parseInput(fileContents);
  // Navigate the map based on part 1 rules
  let finalPos = followInstructionsMap(input.grid, input.instructions);

  // Calculate the final password number
  let facing;
  if (finalPos.direction === ">") facing = 0;
  else if (finalPos.direction === "v") facing = 1;
  else if (finalPos.direction === "<") facing = 2;
  else if (finalPos.direction === "^") facing = 3;

  let number = 1000 * (finalPos.y + 1) + 4 * (finalPos.x + 1) + facing;

  return number;
};

const part2 = (fileContents) => {
  // Parse the input file into a useable grid map and instructions set
  let input = parseInput(fileContents);
  // Convert the 2D map into a 3D cube
  let cube = convertToCube(input.grid);
  // Navigate around the cube to the final cube position
  let finalPos = followInstructionsCube(cube, input.instructions);

  // Calculate the final password number
  let facing;
  if (finalPos.direction === ">") facing = 0;
  else if (finalPos.direction === "v") facing = 1;
  else if (finalPos.direction === "<") facing = 2;
  else if (finalPos.direction === "^") facing = 3;

  let finalX = cube.get(finalPos.side).minX + finalPos.x + 1;
  let finalY = cube.get(finalPos.side).minY + finalPos.y + 1;

  let number = 1000 * finalY + 4 * finalX + facing;

  return number;
};

// Parse the input from lines of a file into a 2D map and array if instructions
const parseInput = (fileContents) => {
  let grid = [];
  let instructions = [];
  for (const line of fileContents) {
    // If the line is part of the map split each character and add it to the grid one row at a time
    if (line.includes(".")) grid.push(line.split(""));
    // Else this is the instruction line. Use the regex to seperate instructions into pairs of
    // matches where the first is a movement number and the second is a direction change. Seperate
    // them into a simplate array that alternates between each value.
    else if (line !== "") {
      let reg = new RegExp(/(\d+)*([RL])*/g);
      let allMatches = [...line.matchAll(reg)];
      for (const matches of allMatches) {
        instructions.push(matches[1]);
        instructions.push(matches[2]);
      }
    }
  }
  // The instructions had some undefined values in it that needed to be filtered out
  instructions = instructions.filter((i) => i);
  return { grid, instructions };
};

// Convert the 2D map into a 3D cube
const convertToCube = (grid) => {
  // Configure cube sides and how to translate position and direction from
  // one side to another based on the inputs grid configuration.
  // Sides are assumed to be a 50 x 50 character size
  // Original Layout
  //   |1|2|
  //   |3|
  // |4|5|
  // |6|
  let cube = new Map();

  cube.set(
    1,
    new CubeSide(grid, 50, 0, (pos) => {
      if (pos.direction === "^")
        return { x: pos.y, y: pos.x, direction: ">", side: 6 };
      else if (pos.direction === ">")
        return { x: 0, y: pos.y, direction: ">", side: 2 };
      else if (pos.direction === "<")
        return { x: pos.x, y: 49 - pos.y, direction: ">", side: 4 };
      else if (pos.direction === "v")
        return { x: pos.x, y: 0, direction: "v", side: 3 };
    }),
  );

  cube.set(
    2,
    new CubeSide(grid, 100, 0, (pos) => {
      if (pos.direction === "^")
        return { x: pos.x, y: 49, direction: "^", side: 6 };
      else if (pos.direction === ">")
        return { x: pos.x, y: 49 - pos.y, direction: "<", side: 5 };
      else if (pos.direction === "<")
        return { x: 49, y: pos.y, direction: "<", side: 1 };
      else if (pos.direction === "v")
        return { x: pos.y, y: pos.x, direction: "<", side: 3 };
    }),
  );

  cube.set(
    3,
    new CubeSide(grid, 50, 50, (pos) => {
      if (pos.direction === "^")
        return { x: pos.x, y: 49, direction: "^", side: 1 };
      else if (pos.direction === ">")
        return { x: pos.y, y: pos.x, direction: "^", side: 2 };
      else if (pos.direction === "<")
        return { x: pos.y, y: pos.x, direction: "v", side: 4 };
      else if (pos.direction === "v")
        return { x: pos.x, y: 0, direction: "v", side: 5 };
    }),
  );

  cube.set(
    4,
    new CubeSide(grid, 0, 100, (pos) => {
      if (pos.direction === "^")
        return { x: pos.y, y: pos.x, direction: ">", side: 3 };
      else if (pos.direction === ">")
        return { x: 0, y: pos.y, direction: ">", side: 5 };
      else if (pos.direction === "<")
        return { x: pos.x, y: 49 - pos.y, direction: ">", side: 1 };
      else if (pos.direction === "v")
        return { x: pos.x, y: 0, direction: "v", side: 6 };
    }),
  );

  cube.set(
    5,
    new CubeSide(grid, 50, 100, (pos) => {
      if (pos.direction === "^")
        return { x: pos.x, y: 49, direction: "^", side: 3 };
      else if (pos.direction === ">")
        return { x: pos.x, y: 49 - pos.y, direction: "<", side: 2 };
      else if (pos.direction === "<")
        return { x: 49, y: pos.y, direction: "<", side: 4 };
      else if (pos.direction === "v")
        return { x: pos.y, y: pos.x, direction: "<", side: 6 };
    }),
  );

  cube.set(
    6,
    new CubeSide(grid, 0, 150, (pos) => {
      if (pos.direction === "^")
        return { x: pos.x, y: 49, direction: "^", side: 4 };
      else if (pos.direction === ">")
        return { x: pos.y, y: pos.x, direction: "^", side: 5 };
      else if (pos.direction === "<")
        return { x: pos.y, y: pos.x, direction: "v", side: 1 };
      else if (pos.direction === "v")
        return { x: pos.x, y: 0, direction: "v", side: 2 };
    }),
  );

  return cube;
};

// Follow the instructions of the given based on the cube logic
const followInstructionsCube = (cube, instructions) => {
  // Starting position
  let pos = { x: 0, y: 0, direction: ">", side: 1 };

  // Execute each instruction
  for (const instruction of instructions) {
    // Check if this is a distance value or a rotation
    let distance = parseInt(instruction);
    // If distance move the direction that position is currently facing until either hitting a wall or stopping
    if (distance) {
      let hitWall = false;
      for (let s = 0; s < distance && !hitWall; s++) {
        let nextSpace = null;
        let nextPos = null;
        // If moving up
        if (pos.direction === "^") {
          nextSpace = cube.get(pos.side).grid[pos.y - 1]
            ? cube.get(pos.side).grid[pos.y - 1][pos.x]
            : null;
          nextPos = { x: pos.x, y: pos.y - 1, direction: "^", side: pos.side };
          // Check if pos is at an edge
          if (pos.y === 0 || (nextSpace !== "." && nextSpace !== "#")) {
            nextPos = cube.get(pos.side).nextGridLocation(pos);
            nextSpace = cube.get(nextPos.side).grid[nextPos.y][nextPos.x];
          }
        }
        // If moving left
        else if (pos.direction === "<") {
          nextSpace = cube.get(pos.side).grid[pos.y][pos.x - 1];
          nextPos = { x: pos.x - 1, y: pos.y, direction: "<", side: pos.side };
          // Check if pos is at an edge
          if (pos.x === 0 || (nextSpace !== "." && nextSpace !== "#")) {
            nextPos = cube.get(pos.side).nextGridLocation(pos);
            nextSpace = cube.get(nextPos.side).grid[nextPos.y][nextPos.x];
          }
        }
        // If moving right
        else if (pos.direction === ">") {
          nextSpace = cube.get(pos.side).grid[pos.y][pos.x + 1];
          nextPos = { x: pos.x + 1, y: pos.y, direction: ">", side: pos.side };
          // Check if pos is at an edge
          if (
            pos.x === cube.get(pos.side).grid[pos.y].length - 1 ||
            (nextSpace !== "." && nextSpace !== "#")
          ) {
            nextPos = cube.get(pos.side).nextGridLocation(pos);
            nextSpace = cube.get(nextPos.side).grid[nextPos.y][nextPos.x];
          }
        }
        // If moving down
        else if (pos.direction === "v") {
          nextSpace = cube.get(pos.side).grid[pos.y + 1]
            ? cube.get(pos.side).grid[pos.y + 1][pos.x]
            : null;
          nextPos = { x: pos.x, y: pos.y + 1, direction: "v", side: pos.side };
          // Check if pos is at an edge
          if (
            pos.y === cube.get(pos.side).grid.length - 1 ||
            (nextSpace !== "." && nextSpace !== "#")
          ) {
            nextPos = cube.get(pos.side).nextGridLocation(pos);
            nextSpace = cube.get(nextPos.side).grid[nextPos.y][nextPos.x];
          }
        }

        // Once the next position and space value are known check if a wall was hit
        if (nextSpace === "#") hitWall = true;
        // If a wall was not hit update the current pos
        else {
          pos.x = nextPos.x;
          pos.y = nextPos.y;
          pos.direction = nextPos.direction;
          pos.side = nextPos.side;
        }
      }
    }
    // Else this is a change in direction
    else {
      // Turn counter clockwise
      if (instruction === "L") {
        if (pos.direction === "^") pos.direction = "<";
        else if (pos.direction === "<") pos.direction = "v";
        else if (pos.direction === "v") pos.direction = ">";
        else if (pos.direction === ">") pos.direction = "^";
      }
      // Turn clockwise
      else {
        if (pos.direction === "^") pos.direction = ">";
        else if (pos.direction === ">") pos.direction = "v";
        else if (pos.direction === "v") pos.direction = "<";
        else if (pos.direction === "<") pos.direction = "^";
      }
    }
  }
  return pos;
};

// Follow the instructions based on 2D map logic
const followInstructionsMap = (grid, instructions) => {
  // Starting position
  let pos = { x: 0, y: 0, direction: ">" };

  // Find the start on the map
  let currentGrid = grid[pos.y][pos.x];
  while (currentGrid != ".") {
    pos.x++;
    currentGrid = grid[pos.y][pos.x];
  }

  // Execute each instruction
  for (const instruction of instructions) {
    // Check if this is a distance value or a rotation
    let distance = parseInt(instruction);
    // If distance move the direction that position is currently facing
    if (distance) {
      let hitWall = false;
      for (let s = 0; s < distance && !hitWall; s++) {
        let nextSpace = null;
        let nextPos = null;
        // If moving up
        if (pos.direction === "^") {
          nextSpace = grid[pos.y - 1] ? grid[pos.y - 1][pos.x] : null;
          nextPos = { x: pos.x, y: pos.y - 1 };
          // Check if pos is at an edge
          if (pos.y === 0 || (nextSpace !== "." && nextSpace !== "#")) {
            let y = grid.length - 1;
            nextSpace = grid[y][pos.x];
            while (nextSpace !== "." && nextSpace !== "#") {
              y--;
              nextSpace = grid[y][pos.x];
            }
            nextPos = { x: pos.x, y: y };
          }
        }
        // If moving left
        else if (pos.direction === "<") {
          nextSpace = grid[pos.y][pos.x - 1];
          nextPos = { x: pos.x - 1, y: pos.y };
          // Check if pos is at an edge
          if (pos.x === 0 || (nextSpace !== "." && nextSpace !== "#")) {
            let x = grid[pos.y].length - 1;
            nextSpace = grid[pos.y][x];
            while (nextSpace !== "." && nextSpace !== "#") {
              x--;
              nextSpace = grid[pos.y][x];
            }
            nextPos = { x: x, y: pos.y };
          }
        }
        // If moving right
        else if (pos.direction === ">") {
          nextSpace = grid[pos.y][pos.x + 1];
          nextPos = { x: pos.x + 1, y: pos.y };
          // Check if pos is at an edge
          if (
            pos.x === grid[pos.y].length - 1 ||
            (nextSpace !== "." && nextSpace !== "#")
          ) {
            let x = 0;
            nextSpace = grid[pos.y][x];
            while (nextSpace !== "." && nextSpace !== "#") {
              x++;
              nextSpace = grid[pos.y][x];
            }
            nextPos = { x: x, y: pos.y };
          }
        }
        // If moving down
        else if (pos.direction === "v") {
          nextSpace = grid[pos.y + 1] ? grid[pos.y + 1][pos.x] : null;
          nextPos = { x: pos.x, y: pos.y + 1 };
          // Check if pos is at an edge
          if (
            pos.y === grid.length - 1 ||
            (nextSpace !== "." && nextSpace !== "#")
          ) {
            let y = 0;
            nextSpace = grid[y][pos.x];
            while (nextSpace !== "." && nextSpace !== "#") {
              y++;
              nextSpace = grid[y][pos.x];
            }
            nextPos = { x: pos.x, y: y };
          }
        }

        // Once the next position and space value are known check if a wall was hit
        if (nextSpace === "#") hitWall = true;
        // If a wall was not hit update the current pos
        else {
          pos.x = nextPos.x;
          pos.y = nextPos.y;
        }
      }
    }
    // Else this is a change in direction
    else {
      // Turn counter clockwise
      if (instruction === "L") {
        if (pos.direction === "^") pos.direction = "<";
        else if (pos.direction === "<") pos.direction = "v";
        else if (pos.direction === "v") pos.direction = ">";
        else if (pos.direction === ">") pos.direction = "^";
      }
      // Turn clockwise
      else {
        if (pos.direction === "^") pos.direction = ">";
        else if (pos.direction === ">") pos.direction = "v";
        else if (pos.direction === "v") pos.direction = "<";
        else if (pos.direction === "<") pos.direction = "^";
      }
    }
  }
  return pos;
};

// Method print out the 2D grid for inital testing
const print = (grid, pos, instruction) => {
  for (let y = 0; y < grid.length; y++) {
    let line = "";
    for (let x = 0; x < grid[y].length; x++) {
      let space = grid[y][x];
      if (pos.x === x && pos.y === y) {
        space = pos.direction;
      }
      line += space;
    }
    console.log(line);
  }
  console.log("\n");
  console.log(instruction);
  console.log("\n\n");
};

// A class to hold the information about each cube side in the 3D cube
class CubeSide {
  constructor(grid, minX, minY, nextGridLocation) {
    this.grid = [];
    this.minX = minX;
    this.minY = minY;
    this.nextGridLocation = nextGridLocation;

    // Extract the relevant side from the 2D grid that is passed in based on the minX and minY values
    for (let y = minY; y < minY + 50; y++) {
      let row = [];
      for (let x = minX; x < minX + 50; x++) {
        row.push(grid[y][x]);
      }
      this.grid.push(row);
    }
  }
}
