// Puzzle for Day 23: https://adventofcode.com/2015/day/23

export const run = (fileContents) => {
  // Parse command in from the input file
  let commands = parseInput(fileContents);

  // Run the program for part 1
  let results = runProgram(commands, 0, 0);

  // Run the program for part 2
  let results2 = runProgram(commands, 1, 0);

  return { part1: results.b, part2: results2.b };
};

// Parse the input file to add each line to the set of commands
const parseInput = (fileContents) => {
  // Regex for parsing each line
  let reg = new RegExp(/([a-z]{3,3}) ([a-z+-\d]+),* *([+-\d]*)/);
  // Resulting command info
  let commands = [];
  // Parse each line
  for (let line of fileContents) {
    let matches = line.match(reg);
    // Each type of possible line to be parsed in
    switch (matches[1]) {
      case "hlf":
      case "tpl":
      case "inc":
        commands.push({ command: matches[1], register: matches[2] });
        break;
      case "jmp":
        commands.push({ command: matches[1], offset: parseInt(matches[2]) });
        break;
      case "jie":
      case "jio":
        commands.push({
          command: matches[1],
          register: matches[2],
          offset: parseInt(matches[3]),
        });
    }
  }
  return commands;
};

// Run the commands of the program
const runProgram = (commands, a, b) => {
  // The registers thsat will store the values being
  // manipulated by the program
  let registers = new Registers(a, b);
  // Continue running until the end of the program is reached
  for (let index = 0; index < commands.length; ) {
    // Get the current command
    let current = commands[index];

    // Check for which command is being executed.
    // Make the update using the update register
    // funciton and update dht eindex appropriately
    // for the next command
    // Half the given regsiter
    if (current.command === "hlf") {
      let reg = current.register;
      let val = registers[reg] / 2;
      registers.updateRegister(reg, val);
      index++;
    }
    // Triple the given register
    else if (current.command === "tpl") {
      let reg = current.register;
      let val = registers[reg] * 3;
      registers.updateRegister(reg, val);
      index++;
    }
    // Increment the given register by one
    else if (current.command === "inc") {
      let reg = current.register;
      let val = registers[reg] + 1;
      registers.updateRegister(reg, val);
      index++;
    }
    // Jump to the command at the specified offset
    else if (current.command === "jmp") {
      index += current.offset;
    }
    // Jump to the command at the specified offset if the given register is even
    else if (current.command === "jie") {
      let reg = current.register;
      let val = registers[reg] % 2;
      if (val === 0) {
        index += current.offset;
      } else {
        index++;
      }
    }
    // Jump to the command at the specified offset if the given register is one
    else if (current.command === "jio") {
      let reg = current.register;
      let val = registers[reg] === 1;
      if (val) {
        index += current.offset;
      } else {
        index++;
      }
    }
  }

  return { a: registers.a, b: registers.b };
};

// A regsiters object to keep track of the register values when running the program
class Registers {
  // A constructor that accepts starting values for the registers
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  // Update the registers following the rules
  updateRegister(letter, value) {
    // Make a temp copy of the current register value
    let temp = this[letter];
    // Set the temp to the new value
    temp = value;
    // Check that the temp value was always greater than or equal to 0
    temp = temp < 0 ? 0 : temp;
    // Drop any remainder to ensure the value is always an integer
    // and set the register to the temp value
    this[letter] = Math.floor(temp);
  }
}
