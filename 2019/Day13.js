// Puzzle for Day 13: https://adventofcode.com/2019/day/13

export const run = (fileContents) => {
  // Parse the program in from the input file
  let program = fileContents[0].split(",").map((x) => parseInt(x));

  // Count the blocks on the grid
  let result1 = countBlocks(program);

  // Play the hacked version of the game to get the final score
  let result2 = playHackedGame(program);

  return { part1: result1, part2: result2 };
};

// Hack the game and play until it halts
const playHackedGame = (program) => {
  // Add coin to the input for the program to run
  program[0] = 2;

  // Replace all of the empty spaces on the row with the paddle with a wall
  for (let i = 1445; i <= 1477; i++) {
    if (i !== 1461) program[i] = 1;
  }

  // Track the score
  let score = 0;

  // Create intcode computer
  let comp = new IntCodeComputer(program);

  // Run the program while it has not halted
  let opCode = null;
  while (opCode !== 99) {
    let output = comp.runProgram([0]);
    let x = output.val[0];
    let y = output.val[1];
    let p = output.val[2];

    opCode = output.opCode;

    if (opCode !== 99) {
      if (x === -1 && y === 0) score = p;
    }
  }

  return score;
};

// Count the number of blocks in the grid
const countBlocks = (program) => {
  // Create na intcode computer for the program
  let comp = new IntCodeComputer(program);

  // Run the program and count the number of blocks found until it halts
  let opCode = null;
  let blocks = 0;
  while (opCode !== 99) {
    let output = comp.runProgram();
    opCode = output.opCode;

    if (output.val[2] === 2) blocks++;
  }

  return blocks;
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
        if (output.length === 3) break;
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
