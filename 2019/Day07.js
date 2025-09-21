// Puzzle for Day 7: https://adventofcode.com/2019/day/7

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the program in from the input file
  let program = fileContents[0].split(",").map((x) => parseInt(x));

  // Find the highest output for each part of the puzzle
  let result1 = highestOutput(program, [0, 1, 2, 3, 4]);
  let result2 = highestOutput(program, [5, 6, 7, 8, 9], true);

  return { part1: result1, part2: result2 };
};

// Find the highest output for the set of phase settings and if this should use the feedback loop
const highestOutput = (memory, phaseValues, feedbackLoop = false) => {
  // Get all permutations of the set of phase values
  let permutations = permutator(phaseValues);
  // Highest thrust value found
  let highestThrust = 0;

  // Check each permutation of the phase values
  for (let perm of permutations) {
    // Thruster output from the last round starting with 0
    let thruster = 0;

    // Copy the program to manipulate each amplifier separately
    let programA = JSON.parse(JSON.stringify(memory));
    let programB = JSON.parse(JSON.stringify(memory));
    let programC = JSON.parse(JSON.stringify(memory));
    let programD = JSON.parse(JSON.stringify(memory));
    let programE = JSON.parse(JSON.stringify(memory));

    // Inputs for each program
    let programAInputs = [perm[0]];
    let programBInputs = [perm[1]];
    let programCInputs = [perm[2]];
    let programDInputs = [perm[3]];
    let programEInputs = [perm[4]];

    // Current index for each programs input array
    let inputIndexA = 0;
    let inputIndexB = 0;
    let inputIndexC = 0;
    let inputIndexD = 0;
    let inputIndexE = 0;

    // Current index for eahc programs execution
    let indexA = 0;
    let indexB = 0;
    let indexC = 0;
    let indexD = 0;
    let indexE = 0;

    // Final opcode from amplifier E
    let finalOpcode;

    do {
      // Setup, run, handle output for program A
      programAInputs.push(thruster);
      let outputA = runProgram(programA, programAInputs, inputIndexA, indexA);
      programA = outputA.program;
      inputIndexA = outputA.inputIndex;
      indexA = outputA.index;

      // Setup, run, handle output for program B
      programBInputs.push(outputA.output[0]);
      let outputB = runProgram(programB, programBInputs, inputIndexB, indexB);
      programB = outputB.program;
      inputIndexB = outputB.inputIndex;
      indexB = outputB.index;

      // Setup, run, handle output for program C
      programCInputs.push(outputB.output[0]);
      let outputC = runProgram(programC, programCInputs, inputIndexC, indexC);
      programC = outputC.program;
      inputIndexC = outputC.inputIndex;
      indexC = outputC.index;

      // Setup, run, handle output for program D
      programDInputs.push(outputC.output[0]);
      let outputD = runProgram(programD, programDInputs, inputIndexD, indexD);
      programD = outputD.program;
      inputIndexD = outputD.inputIndex;
      indexD = outputD.index;

      // Setup, run, handle output for program E
      programEInputs.push(outputD.output[0]);
      let outputE = runProgram(programE, programEInputs, inputIndexE, indexE);
      programE = outputE.program;
      inputIndexE = outputE.inputIndex;
      indexE = outputE.index;

      // If the last op code is an output set the thruster value to it
      if (outputE.opCode === 4) thruster = outputE.output[0];
      // Set final op code to the op code value that halted amplifier E
      finalOpcode = outputE.opCode;
    } while (
      // Continue while the programs have not halted and this is using the feedback loop
      finalOpcode !== 99 &&
      feedbackLoop
    );

    // If this is the highest thruster value save it
    if (thruster > highestThrust) highestThrust = thruster;
  }

  return highestThrust;
};

// Run the program until it completes
// intcode program, intput array, index of the input array, index of the program
const runProgram = (program, input, inIndex, index) => {
  let output = [];
  // Index of the input array
  let inputIndex = inIndex;
  // Current program index
  let x = index;

  // Current opcode
  let opCode;
  //Continue until reaching the end of the program or the program breaks for opcode 99
  while (x < program.length) {
    // Get program opcode and parameter modes for this command
    opCode = program[x];
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

      program[param1] = input[inputIndex];
      x += 2;
      inputIndex++;
    }
    // Output
    else if (opCode === 4) {
      let param1 = program[x + 1];

      if (param1Mode === 0) param1 = program[param1];

      output.push(param1);
      x += 2;
      break;
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

  return { output, program, inputIndex, index: x, opCode };
};

// Create all permutations of 0-4
// https://stackoverflow.com/questions/9960908/permutations-in-javascript
const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
};
