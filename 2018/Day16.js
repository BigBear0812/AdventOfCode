// Puzzle for Day 16: https://adventofcode.com/2018/day/16

export const run = (fileContents) => {
  // Parse in the data from the file
  let data = parseInput(fileContents);

  // Test the eamples and get all of the possible operations for each example
  testExamples(data.examples);

  // Get the count of exmaples with more than 3 possible valid operations
  let result1 = data.examples.filter(val => val.opCodes.length >= 3).length;

  // Find the operations that go with each code
  let ops = findOpCodes(data.examples);

  // Run the program and return the resulting registers
  let registers = runProgram(data.program, ops);

  return {part1: result1, part2: registers[0]};
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
 
// Run the progrma from the input given the operaions specified for each code
const runProgram = (program, ops) => {
  // Start with all registers at 0
  let registers = [0, 0, 0, 0];

  // Run each line of the program based on the code specified 
  // from the first value of the command 
  for(let command of program){
    ops[command[0]](registers, command);
  }

  return registers;
}

// Find the operation function for each code
const findOpCodes = (examples) => {
  // The operation name for each code number
  let opCodes = [];

  // Find all of the operations that are possible for each code by 
  // getting the intersection of each example with the same code number
  for(let code = 0; code < allOps.length; code++){
    opCodes[code] = examples
      // Get just the examples with the current code number
      .filter(val => val.command[0] === code)
      // Get those examples possible operation codes
      .map(val => val.opCodes)
      // Get the intersection of each examples possible operations codes
      .reduce((output, current) => output.filter(out => current.includes(out)));
  }

  // Multiple operations exist for all but one number. That 
  // means that if a number has only one operation then that 
  // operation can be removed from the other nunmbers and is 
  // confirmed to be for that number. Keep repeating this 
  // process until all numbers have a confirmed operation on 
  // the opsCode array

  // The unordered list of confirmed operations
  let confirmed = [];

  // Keep iterating over the ops code array until all values are operation strings and no longer array
  for(let c = 0; !opCodes.reduce((output, current) => output && !Array.isArray(current), true); c++){
    // The current operation code index to examine
    let code = c % allOps.length;
    // The current set of possible operation codes
    let currentCode = opCodes[code];
    // If the current code is an array and not already confirmed with 
    // an operation string name
    if(Array.isArray(currentCode)){
      // If the array has only 1 item this must be the operation name for this code
      if(currentCode.length === 1){
        // Add the operation name to the confirmed lista nd convert this 
        // from a single element array into a string
        confirmed.push(currentCode[0]);
        opCodes[code] = currentCode[0];
      }
      // Otherwise check if the more confirmed operation names can be 
      // filtered out of this code's array of operation's
      else{
        opCodes[code] = currentCode
        .filter(current => !confirmed.includes(current));
      }
    }
  }

  // Convert each operation name in the array to the 
  // corresponding function
  let opsOrdered = opCodes.map(code => allOps.filter(op => op.name === code)[0]);
  return opsOrdered;
}

// Test each example and record the possible operation 
// names for this example
const testExamples = (examples) => {
  // Test each example against each operation
  for(let example of examples){
    for(let op of allOps){
      // Copy the before registers
      let registers = [...example.before];
      // Run the operation
      op(registers, example.command);
      // If the registers match with the examples after registers 
      // then this operation applies to the example
      let applies = registers.reduce((result, val, index) => result && val === example.after[index], true);

      // If this operation applies to this example add the 
      // operation name to it's opCodes array
      if(applies)
        example.opCodes.push(op.name);
    }
  }
}

// Parse the input into a array's of examples and program commands
const parseInput = (fileContents) => {
  // Join the file input array into a simgle string and split it on the 
  // 4 line breaks. These 4 line breaks spearate the end of the examples 
  // and the beginning of the program
  let sections = fileContents.join("\n").split("\n\n\n\n");
  // Examples have 2 line breaks between each one
  let exampleData = sections[0].split("\n\n");
  // Programs commands only have 1 line break between each one
  let programData = sections[1].split("\n");

  // Regex for parsing each scenario
  let exampleReg = new RegExp(/Before: +\[(\d+), (\d+), (\d+), (\d+)\]\n(\d+) (\d+) (\d+) (\d+)\nAfter: +\[(\d+), (\d+), (\d+), (\d+)\]/);
  let programReg = new RegExp(/(\d+) (\d+) (\d+) (\d+)/);
  // Resukting examples and program commands arrays
  let examples = [];
  let program = [];

  // Check each line of the example data and create 
  // a new object in the array for each one
  for(let line of exampleData){
    let matches = line.match(exampleReg);
    examples.push({
      before: [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4])],
      command: [parseInt(matches[5]), parseInt(matches[6]), parseInt(matches[7]), parseInt(matches[8])],
      after: [parseInt(matches[9]), parseInt(matches[10]), parseInt(matches[11]), parseInt(matches[12])],
      opCodes: []
    });
  }

  // Check each line of the program data and create 
  // a new object in the array for each one
  for(let line of programData){
    let matches = line.match(programReg);
    program.push([parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4])]);
  }

  return {examples, program};
}