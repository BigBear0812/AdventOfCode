// Puzzle for Day 17: https://adventofcode.com/2019/day/17

export const run = (fileContents) => {
  // Parse the program in from the input file
  let program = fileContents[0].split(",").map((x) => parseInt(x));

  // Create a 2D array of the scaffolding area
  let grid = createGrid(program);

  // Get the alignment paramemeter sum for Part 1
  let alignParamSum = alignmentParamSum(grid);

  // The grid is a walking path that you only run at
  // corners not inertesections. Create the set of
  // movements to represent this path for the current grid
  let moves = walkGrid(grid);

  // Convert the movements into a main command and a
  // set of three sub-commands to be run
  let commands = createCommands(moves);

  // Convert the commands into ASCII intcode inputs and
  // run the program to get thje amount of dust collected
  let dustCollected = collectDust(commands, program);

  return { part1: alignParamSum, part2: dustCollected };
};

// Convert the commands into ASCII Intcode inputs and run
// the program to get the result
const collectDust = (commands, program) => {
  // Set the first value of the program to 2 to start the vaccum robot
  program[0] = 2;
  // Create the intcode computer with the modified program
  let comp = new IntCodeComputer(program);

  // Create a commands array of all of the input commands in order
  let cmds = [commands.main, ...commands.cmds, "n"];
  // Add newline character to each command set
  cmds = cmds
    .map((x) => x + "\n")
    // Convert each string into an array of ASCI values for each character
    .map((x) => x.split("").map((y) => y.charCodeAt()))
    // Flatten the array into one long array of integers
    .flat();

  // Run the program with these inputs
  let output = comp.runProgram(cmds);

  // Retun the last value of the output which is the amount of dust colected
  return output.val[output.val.length - 1];
};

// Create commands from the moves
const createCommands = (moves) => {
  // Convert the moves array into a string which
  // will become the main command
  let movesStr = moves.join(",");
  // The resulting A, B, C sub-commands
  let cmds = [];
  // Names for the sub-commands
  let cmdNames = ["A", "B", "C"];

  // Offset to start looking for the next command segment
  let offset = 0;
  // The previous segment examined
  let prevSeg = "";
  // Examine segments of the moves string to find matches that
  // could potentially be sub-commands
  for (let x = offset + 1; x < movesStr.length; x++) {
    // Get the current segment to search for
    let segment = movesStr.slice(offset, x);
    // Use regex to find all matches of this segment in the moves string
    let matches = [...movesStr.matchAll(new RegExp(segment, "g"))];
    // Assume all sub-commands will be used at least 3 times so if less matches
    // then this the segment must contains a sub-command
    if (matches.length < 3) {
      // Find the last digit index of the previous segment since this
      // will be the end of the sub-command
      let digitMatches = [...prevSeg.matchAll(new RegExp(/\d/, "g"))];
      let cmdSegLastInd = digitMatches[digitMatches.length - 1].index;
      // Get the sub-command from the previous segment, replace all
      // instances of it with the next sub-command name letter, and
      // add it to the cmds array
      let cmdSeg = prevSeg.slice(0, cmdSegLastInd + 1);
      movesStr = movesStr.replaceAll(cmdSeg, cmdNames.shift());
      cmds.push(cmdSeg);
      // Find the index of the next L or R sicne the leats of these
      // will be the start of the next command segment and is
      // therefore the offset value. Also, reset x to just after the
      // offset as if starting over the loop
      let lInd = movesStr.indexOf("L");
      let rInd = movesStr.indexOf("R");
      offset = Math.min(lInd, rInd);
      x = offset + 1;
    }
    // Otherwise continue searching and set the current
    // segment as the previous segment
    else {
      prevSeg = segment;
    }
  }

  // Return all of the commands
  return { main: movesStr, cmds };
};

// Walk the grid to get the movements required to visit each space at least once
const walkGrid = (grid) => {
  // Keep track of current position and direction
  let curX;
  let curY;
  let dir;

  // Find start by looking for the only space that is not empty or scaffolding
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== "#" && grid[y][x] !== ".") {
        curX = x;
        curY = y;
        dir = grid[y][x];
      }
    }
  }

  // Find all of the moves to reach the end. Moves will
  // always be turn and move forward until reaching a corner
  let moves = [];
  while (true) {
    // Find the turn to make
    let turn = null;
    // North to East or West
    if (dir === "^") {
      let left = grid[curY][curX - 1] ? grid[curY][curX - 1] : ".";
      let right = grid[curY][curX + 1] ? grid[curY][curX + 1] : ".";

      if (left === "#") {
        turn = "L";
        dir = "<";
      } else if (right === "#") {
        turn = "R";
        dir = ">";
      }
    }
    // South to West or East
    else if (dir === "v") {
      let left = grid[curY][curX + 1] ? grid[curY][curX + 1] : ".";
      let right = grid[curY][curX - 1] ? grid[curY][curX - 1] : ".";

      if (left === "#") {
        turn = "L";
        dir = ">";
      } else if (right === "#") {
        turn = "R";
        dir = "<";
      }
    }
    // West to North or South
    else if (dir === "<") {
      let left = grid[curY + 1] ? grid[curY + 1][curX] : ".";
      let right = grid[curY - 1] ? grid[curY - 1][curX] : ".";

      if (left === "#") {
        turn = "L";
        dir = "v";
      } else if (right === "#") {
        turn = "R";
        dir = "^";
      }
    }
    // East to South or North
    else if (dir === ">") {
      let left = grid[curY - 1] ? grid[curY - 1][curX] : ".";
      let right = grid[curY + 1] ? grid[curY + 1][curX] : ".";

      if (left === "#") {
        turn = "L";
        dir = "^";
      } else if (right === "#") {
        turn = "R";
        dir = "v";
      }
    }

    // If no turn is found break out since this
    // is the end of the scaffolding
    if (turn === null) break;

    // Find the distance to move after turning. Keep moving
    // ahead by one space until the next space is not scaffolding
    let move;
    for (let m = 1; true; m++) {
      let ahead;
      // North
      if (dir === "^") {
        ahead = grid[curY - 1] ? grid[curY - 1][curX] : ".";

        // If found the corner record the move and break out
        if (ahead === ".") {
          move = m - 1;
          break;
        }
        curY--;
      }
      // South
      else if (dir === "v") {
        ahead = grid[curY + 1] ? grid[curY + 1][curX] : ".";

        // If found the corner record the move and break out
        if (ahead === ".") {
          move = m - 1;
          break;
        }
        curY++;
      }
      // East
      else if (dir === "<") {
        ahead = grid[curY][curX - 1] ? grid[curY][curX - 1] : ".";

        // If found the corner record the move and break out
        if (ahead === ".") {
          move = m - 1;
          break;
        }
        curX--;
      }
      // West
      else if (dir === ">") {
        ahead = grid[curY][curX + 1] ? grid[curY][curX + 1] : ".";

        // If found the corner record the move and break out
        if (ahead === ".") {
          move = m - 1;
          break;
        }
        curX++;
      }
    }

    // Record this turn and move pair
    moves.push(turn);
    moves.push(move);
  }

  return moves;
};

// Create a 2D array of the scaffolding area
const createGrid = (program) => {
  // Create an Intcode Computer
  let comp = new IntCodeComputer(program);
  // Run the program
  let output = comp.runProgram();
  // Create console output string version of the grid
  let conOut = output.val.map((x) => String.fromCharCode(x)).join("");
  // Convert to a 2D array
  let grid = conOut
    .split("\n")
    .map((x) => x.split(""))
    .filter((x) => x.length > 0);
  return grid;
};

// Get the alignment parameter sum
const alignmentParamSum = (grid) => {
  // Total sum
  let total = 0;

  // Check each space for a intersection
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[y].length - 1; x++) {
      // This is a scaffolding space
      if (grid[y][x] === "#") {
        // Get the adjacent spaces
        let adjacent = [];
        adjacent.push(grid[y - 1][x]); // Up
        adjacent.push(grid[y + 1][x]); // Down
        adjacent.push(grid[y][x - 1]); // Left
        adjacent.push(grid[y][x + 1]); // Right
        // If this is an intersection add it's x * y to the total
        if (adjacent.filter((x) => x !== ".").length === 4) {
          total += x * y;
        }
      }
    }
  }

  return total;
};

// Intcode Computer
class IntCodeComputer {
  constructor(program) {
    // Program memory that is the max size an
    // array can be all initialized to 0's
    this.program = new Array(8388607).fill(0);
    // Replace the computer program values with the
    // given program values in the correct places
    for (let x = 0; x < program.length; x++) {
      this.program[x] = program[x];
    }
    // Current program index
    this.index = 0;
    // Inputs array
    this.input = [];
    // Index of the input array
    this.inputIndex = 0;
    // Relative Base
    this.relBase = 0;
  }

  // Run the program until it completes
  // intcode program, intput array, index of the input array, index of the program
  runProgram(input) {
    // Output values
    let output = [];
    // If an input is specified add it to the input array
    if (input) this.input = this.input.concat(input);

    // Current opcode
    let opCode;
    // Continue until reaching the end of the program or the program breaks for opcode 99
    while (this.index >= 0) {
      // Get program opcode and parameter modes for this command
      opCode = this.program[this.index];
      let param3Mode = Math.floor(opCode / 10000);
      opCode = opCode - param3Mode * 10000;
      let param2Mode = Math.floor(opCode / 1000);
      opCode = opCode - param2Mode * 1000;
      let param1Mode = Math.floor(opCode / 100);
      opCode = opCode - param1Mode * 100;

      // For each command get the parameter values based on
      // the parameter modes then run the command

      // Add
      if (opCode === 1) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];
        let param3 = this.program[this.index + 3];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param3Mode === 0) this.program[param3] = param1 + param2;
        else if (param3Mode === 2)
          this.program[param3 + this.relBase] = param1 + param2;

        this.index += 4;
      }
      // Mutiply
      else if (opCode === 2) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];
        let param3 = this.program[this.index + 3];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param3Mode === 0) this.program[param3] = param1 * param2;
        else if (param3Mode === 2)
          this.program[param3 + this.relBase] = param1 * param2;

        this.index += 4;
      }
      // Input
      else if (opCode === 3) {
        let param1 = this.program[this.index + 1];

        if (param1Mode === 0)
          this.program[param1] = this.input[this.inputIndex];
        else if (param1Mode === 2)
          this.program[param1 + this.relBase] = this.input[this.inputIndex];

        this.index += 2;
        this.inputIndex++;
      }
      // Output
      else if (opCode === 4) {
        let param1 = this.program[this.index + 1];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];

        output.push(param1);
        this.index += 2;
      }
      // Jump if true
      else if (opCode === 5) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param1 !== 0) this.index = param2;
        else this.index += 3;
      }
      // Jump if false
      else if (opCode === 6) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param1 === 0) this.index = param2;
        else this.index += 3;
      }
      // Less than
      else if (opCode === 7) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];
        let param3 = this.program[this.index + 3];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param3Mode === 0) this.program[param3] = param1 < param2 ? 1 : 0;
        else if (param3Mode === 2)
          this.program[param3 + this.relBase] = param1 < param2 ? 1 : 0;

        this.index += 4;
      }
      // Equals
      else if (opCode === 8) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];
        let param3 = this.program[this.index + 3];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param3Mode === 0) this.program[param3] = param1 === param2 ? 1 : 0;
        else if (param3Mode === 2)
          this.program[param3 + this.relBase] = param1 === param2 ? 1 : 0;
        this.index += 4;
      }
      // Adjust relative base
      else if (opCode === 9) {
        let param1 = this.program[this.index + 1];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];

        this.relBase += param1;
        this.index += 2;
      }
      // Exit
      else if (opCode === 99) {
        this.index += 1;
        break;
      }
    }

    return { val: output, opCode };
  }
}
