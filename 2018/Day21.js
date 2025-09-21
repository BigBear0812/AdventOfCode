// Puzzle for Day 21: https://adventofcode.com/2018/day/21

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the input file into a data object with the program commands and the IP index
  let data = parseInput(fileContents);

  // Run the standard program as specified from the input file
  let output = findNumber(data);

  return { part1: output.first, part2: output.last };
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
const findNumber = (data) => {
  // Set registers to all 0's
  let registers = [0, 0, 0, 0, 0, 0];
  // The first value found to compare with register 0
  let first;
  // The last new value found to compare to register 0
  let last;
  // The value from the previous computing round which
  // will be set to the last value when the first
  // repeated number for the current round appears
  let previous;
  // A set of seen values being compared to 0 to check for when a pattern emerges
  let seen = new Set();
  // Run each line of the program based on the code specified
  // from the first value of the command. Stop when the program
  // index goes outside the bounds of the program or until it
  // breaks out. Thius happens when the program has fountd the
  // value being compared to register 0 that is both the shortest
  // compute time and the longest compute time. Since the program
  // has to generate these values in order to check for them it
  // is easy to record the first and last ones before it starts
  // looping and brakc out when a pattern emerges.
  for (
    let current = 0;
    current >= 0 && current < data.program.length;
    current++
  ) {
    // Set the IP register to the current command index
    registers[data.ip] = current;
    // Get the command from the program data
    let command = data.program[current];

    // If the current command is 24
    if (current === 24) {
      // The program comtinues to add 1 to register 5 until it
      // passes the check on command 19. Instead of adding 1 to
      // register 5 simply set register 5 to the correct value
      // to get the next possible value to be compared to register
      // 0. This significantly cuts down on the compute time.
      registers[5] = registers[2] / data.program[19][2];
    } else {
      // Run the command
      command[0](registers, [...command]);
    }

    // If this is the comparision on command 28 to see if the program terminates
    if (current === 28) {
      // If this is the first time hitting this line then this
      // is the answer to part 1 so save the value
      if (seen.size === 0) first = registers[1];
      // If this value has been seen before then a loop has been
      // found and the last value to come up is the answer to part
      // 2 since it halts but takes the most commands. This also
      // is time to break out of the loop and return the values
      if (seen.has(registers[1])) {
        last = previous;
        break;
      }
      // Add this value to the ones already compared to register 0
      seen.add(registers[1]);
      // Set this as the previous value for the nest round
      previous = registers[1];
    }

    // Set the current index to the value in the IP register
    current = registers[data.ip];
  }

  // Return the value in register 1
  return { first, last };
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
