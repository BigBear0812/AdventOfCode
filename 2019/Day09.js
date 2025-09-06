// Puzzle for Day 9: https://adventofcode.com/2019/day/9

export const run = (fileContents) => {
  // Parse the program in from the input file
  let program = fileContents[0].split(",").map((x) => parseInt(x));

  // Setup a computer for part 1 and run the program
  let comp1 = new IntCodeComputer(program);
  let result1 = comp1.runProgram([1]);

  // Setup a computer for part 2 and run the program
  let comp2 = new IntCodeComputer(program);
  let result2 = comp2.runProgram([2]);

  return { part1: result1.val[0], part2: result2.val[0] };
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
