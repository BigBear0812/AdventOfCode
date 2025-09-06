// Puzzle for Day 12: https://adventofcode.com/2016/day/12

export const run = (fileContents) => {
  // Parse in the commands for this program
  let commands = parseInput(fileContents);
  // Setup the registers for part 1
  let registers1 = new Map();
  registers1.set("a", 0);
  registers1.set("b", 0);
  registers1.set("c", 0);
  registers1.set("d", 0);

  // Process the commands in the program
  processCommands(commands, registers1);

  // Setup the registers for Part 2
  let registers2 = new Map();
  registers2.set("a", 0);
  registers2.set("b", 0);
  registers2.set("c", 1);
  registers2.set("d", 0);

  // Process the commands in the program
  processCommands(commands, registers2);

  return { part1: registers1.get("a"), part2: registers2.get("a") };
};

// Process the commands in the program
const processCommands = (commands, registers) => {
  // Keep track of which command is being processed starting at the first command in the array
  let commandIndex = 0;

  // Continue running the program while the command index is still pointing to a valid command
  while (commandIndex < commands.length) {
    let current = commands[commandIndex];

    // Copy command
    if (current.command === "cpy") {
      let val = parseInt(current.val1);
      if (isNaN(val)) {
        val = registers.get(current.val1);
      }
      registers.set(current.val2, val);
      commandIndex += 1;
    }
    // Increment command
    else if (current.command === "inc") {
      let val = registers.get(current.val1);
      registers.set(current.val1, val + 1);
      commandIndex += 1;
    }
    // Decrement command
    else if (current.command === "dec") {
      let val = registers.get(current.val1);
      registers.set(current.val1, val - 1);
      commandIndex += 1;
    }
    // Jump if Not Zero command
    else if (current.command === "jnz") {
      let val = parseInt(current.val1);
      if (isNaN(val)) {
        val = registers.get(current.val1);
      }
      if (val != 0) commandIndex += parseInt(current.val2);
      else commandIndex += 1;
    }
  }
};

// Parse the file input with the program commands
const parseInput = (fileContents) => {
  // Regex to parse the command on the current line
  let reg = new RegExp(/([a-z]+) ([a-z0-9\-]+) *([a-z0-9\-]*)/);
  // The resulting list of commands
  let commands = [];

  // Copy each of the pieces of the command into a command object and add it to the result set
  for (let line of fileContents) {
    let matches = line.match(reg);
    let command = {
      command: matches[1],
      val1: matches[2],
      val2: matches[3],
    };
    commands.push(command);
  }

  return commands;
};
