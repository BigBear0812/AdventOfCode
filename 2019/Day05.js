// Puzzle for Day 5: https://adventofcode.com/2019/day/5

export const run = (fileContents) => {
  // Parse the program in from the input file
  let program = fileContents[0].split(",").map((x) => parseInt(x));

  // Run both parts of the puzzle
  let output1 = runProgram(program, 1);
  let output2 = runProgram(program, 5);

  return { part1: output1[output1.length - 1], part2: output2[0] };
};

// Run the program until it completes
const runProgram = (memory, input) => {
  let output = [];
  // Copy the program to manipulate
  let program = JSON.parse(JSON.stringify(memory));
  //Continue until reaching the end of the program or the program breaks for opcode 99
  for (let x = 0; x < program.length; ) {
    // Get program opcode and parameter modes for this command
    let opCode = program[x];
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
      let param1 = program[x + 1];
      let param2 = program[x + 2];
      let param3 = program[x + 3];

      if (param1Mode === 0) param1 = program[param1];
      if (param2Mode === 0) param2 = program[param2];

      program[param3] = param1 + param2;
      x += 4;
    }
    // Mutiply
    else if (opCode === 2) {
      let param1 = program[x + 1];
      let param2 = program[x + 2];
      let param3 = program[x + 3];

      if (param1Mode === 0) param1 = program[param1];
      if (param2Mode === 0) param2 = program[param2];

      program[param3] = param1 * param2;
      x += 4;
    }
    // Input
    else if (opCode === 3) {
      let param1 = program[x + 1];

      program[param1] = input;
      x += 2;
    }
    // Output
    else if (opCode === 4) {
      let param1 = program[x + 1];

      if (param1Mode === 0) param1 = program[param1];

      output.push(param1);
      x += 2;
    }
    // Jump if true
    else if (opCode === 5) {
      let param1 = program[x + 1];
      let param2 = program[x + 2];

      if (param1Mode === 0) param1 = program[param1];
      if (param2Mode === 0) param2 = program[param2];

      if (param1 !== 0) x = param2;
      else x += 3;
    }
    // Jump if false
    else if (opCode === 6) {
      let param1 = program[x + 1];
      let param2 = program[x + 2];

      if (param1Mode === 0) param1 = program[param1];
      if (param2Mode === 0) param2 = program[param2];

      if (param1 === 0) x = param2;
      else x += 3;
    }
    // Less than
    else if (opCode === 7) {
      let param1 = program[x + 1];
      let param2 = program[x + 2];
      let param3 = program[x + 3];

      if (param1Mode === 0) param1 = program[param1];
      if (param2Mode === 0) param2 = program[param2];

      program[param3] = param1 < param2 ? 1 : 0;
      x += 4;
    }
    // Equals
    else if (opCode === 8) {
      let param1 = program[x + 1];
      let param2 = program[x + 2];
      let param3 = program[x + 3];

      if (param1Mode === 0) param1 = program[param1];
      if (param2Mode === 0) param2 = program[param2];

      program[param3] = param1 === param2 ? 1 : 0;
      x += 4;
    }
    // Exit
    else if (opCode === 99) {
      x += 1;
      break;
    }
  }

  return output;
};
