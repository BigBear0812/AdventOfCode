// Puzzle for Day 19: https://adventofcode.com/2018/day/19

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the input file into a data object with the program commands and the IP index
  let data = parseInput(fileContents);

  // Run the standard program as specified from the input file
  let result1 = runProgram([0, 0, 0, 0, 0, 0], data);
  // Run a modified version of the program to get the second result
  // which takes much longer to compute the normal way
  let result2 = runModifiedProgram([1, 0, 0, 0, 0, 0], data);

  return { part1: result1, part2: result2 };
};

// Each of the possible commands
// Addition
const addr = (registers, command) => {
  registers[command[3]] = registers[command[1]] + registers[command[2]];
};
const addi = (registers, command) => {
  registers[command[3]] = registers[command[1]] + command[2];
};
// Multiplication
const mulr = (registers, command) => {
  registers[command[3]] = registers[command[1]] * registers[command[2]];
};
const muli = (registers, command) => {
  registers[command[3]] = registers[command[1]] * command[2];
};
// Bitwise AND
const banr = (registers, command) => {
  registers[command[3]] = registers[command[1]] & registers[command[2]];
};
const bani = (registers, command) => {
  registers[command[3]] = registers[command[1]] & command[2];
};
// Bitwise OR
const borr = (registers, command) => {
  registers[command[3]] = registers[command[1]] | registers[command[2]];
};
const bori = (registers, command) => {
  registers[command[3]] = registers[command[1]] | command[2];
};
// Set
const setr = (registers, command) => {
  registers[command[3]] = registers[command[1]];
};
const seti = (registers, command) => {
  registers[command[3]] = command[1];
};
// Greater Than
const gtir = (registers, command) => {
  registers[command[3]] = command[1] > registers[command[2]] ? 1 : 0;
};
const gtri = (registers, command) => {
  registers[command[3]] = registers[command[1]] > command[2] ? 1 : 0;
};
const gtrr = (registers, command) => {
  registers[command[3]] = registers[command[1]] > registers[command[2]] ? 1 : 0;
};
// Equals
const eqir = (registers, command) => {
  registers[command[3]] = command[1] == registers[command[2]] ? 1 : 0;
};
const eqri = (registers, command) => {
  registers[command[3]] = registers[command[1]] == command[2] ? 1 : 0;
};
const eqrr = (registers, command) => {
  registers[command[3]] =
    registers[command[1]] == registers[command[2]] ? 1 : 0;
};

// All of the operations in one array
const allOps = [
  addr,
  addi,
  mulr,
  muli,
  banr,
  bani,
  borr,
  bori,
  setr,
  seti,
  gtir,
  gtri,
  gtrr,
  eqir,
  eqri,
  eqrr,
];

// Run the program from the input data given
const runProgram = (registers, data) => {
  // Run each line of the program based on the code specified
  // from the first value of the command. Stop when the current
  // command index goes beyond the bounds of the program.
  for (
    let current = 0;
    current >= 0 && current < data.program.length;
    current++
  ) {
    // Set the IP register to the current command index
    registers[data.ip] = current;
    // Get the command from the program data
    let command = data.program[current];
    // Run the command
    command[0](registers, [...command]);
    // Set the current index to the value in the IP register
    current = registers[data.ip];
  }

  // Return the value in register 0
  return registers[0];
};

// Run a modified version of the program that achieves the same end. The goal of the program is
// to get the sum of the factors of the value which initially created in register 4.
const runModifiedProgram = (registers, data) => {
  // Run each line of the program based on the code specified
  // from the first value of the command. Stop when the program
  // reaches index 3. This begins the inefficient looping to
  // find the result. At this point the value in register 4 is
  // set and the program can now exit to a more efficient version
  for (let current = 0; current !== 3; current++) {
    // Set the IP register to the current command index
    registers[data.ip] = current;
    // Get the command from the program data
    let command = data.program[current];
    // Run the command
    command[0](registers, [...command]);
    // Set the current index to the value in the IP register
    current = registers[data.ip];
  }

  // The total sum of factors
  let total = 0;
  // Check each number from one to the register 4 value
  for (let i = 1; i <= registers[4]; i++) {
    // If it divides evenly then this is a factor that should be added to the total
    if (registers[4] % i === 0) total += i;
  }

  // Return the total sum
  return total;
};

// Parse the input file into a data object
const parseInput = (fileContents) => {
  // Regex for the IP register number and each line of the program
  let ipReg = new RegExp(/#ip (\d+)/);
  let programReg = new RegExp(/([a-z]+) (\d+) (\d+) (\d+)/);

  // Get the IP register
  let ip = parseInt(fileContents[0].match(ipReg)[1]);
  // The array of program commands
  let program = [];
  // The programs start after the IP line and goes to the end of the file.
  for (let l = 1; l < fileContents.length; l++) {
    // Get the important info and add a new line to the program that has
    // the command function and the three command input.
    let matches = fileContents[l].match(programReg);
    program.push([
      allOps.filter((op) => op.name === matches[1])[0],
      parseInt(matches[2]),
      parseInt(matches[3]),
      parseInt(matches[4]),
    ]);
  }

  return { ip, program };
};
