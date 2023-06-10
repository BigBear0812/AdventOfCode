// Puzzle for Day 19: https://adventofcode.com/2018/day/19

export const run = (fileContents) => {
  let data = parseInput(fileContents);

  let registers1 = runProgram([0, 0, 0, 0, 0, 0], data);
  let registers2 = runProgram([1, 0, 0, 0, 0, 0], data);

  return {part1: registers1[0], part2: registers2[0]};
}

// Each of the possible commands
// Addition
const addr = (registers, command) => { registers[command[3]] = registers[command[1]] + registers[command[2]]; }
const addi = (registers, command) => { registers[command[3]] = registers[command[1]] + command[2]; }
// Multiplication
const mulr = (registers, command) => { registers[command[3]] = registers[command[1]] * registers[command[2]]; }
const muli = (registers, command) => { registers[command[3]] = registers[command[1]] * command[2]; }
// Bitwise AND
const banr = (registers, command) => { registers[command[3]] = registers[command[1]] & registers[command[2]]; }
const bani = (registers, command) => { registers[command[3]] = registers[command[1]] & command[2]; }
// Bitwise OR
const borr = (registers, command) => { registers[command[3]] = registers[command[1]] | registers[command[2]]; }
const bori = (registers, command) => { registers[command[3]] = registers[command[1]] | command[2]; }
// Set
const setr = (registers, command) => { registers[command[3]] = registers[command[1]]; }
const seti = (registers, command) => { registers[command[3]] = command[1]; }
// Greater Than
const gtir = (registers, command) => { registers[command[3]] = command[1] > registers[command[2]] ? 1 : 0; }
const gtri = (registers, command) => { registers[command[3]] = registers[command[1]] > command[2] ? 1 : 0; }
const gtrr = (registers, command) => { registers[command[3]] = registers[command[1]] > registers[command[2]] ? 1 : 0; }
// Equals
const eqir = (registers, command) => { registers[command[3]] = command[1] == registers[command[2]] ? 1 : 0; }
const eqri = (registers, command) => { registers[command[3]] = registers[command[1]] == command[2] ? 1 : 0; }
const eqrr = (registers, command) => { registers[command[3]] = registers[command[1]] == registers[command[2]] ? 1 : 0; }

// All of the operations in one array
const allOps = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr];

// Run the program from the input data given
const runProgram = (registers, data) => {

  // Run each line of the program based on the code specified 
  // from the first value of the command 
  for(let current = 0; current >= 0 && current < data.program.length; current++){
    registers[data.ip] = current;
    let command = data.program[current];
    command[0](registers, [...command]);
    current = registers[data.ip];
  }

  return registers;
}

const parseInput = (fileContents) => {
  let ipReg = new RegExp(/#ip (\d+)/);
  let programReg = new RegExp(/([a-z]+) (\d+) (\d+) (\d+)/);

  let ip = parseInt(fileContents[0].match(ipReg)[1]);
  let program = [];
  for(let l = 1; l < fileContents.length; l++){
    let matches = fileContents[l].match(programReg);
    program.push([allOps.filter(op => op.name === matches[1])[0], parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4])]);
  }

  return {ip, program};
}