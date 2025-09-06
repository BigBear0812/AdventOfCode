// Puzzle for Day 23: https://adventofcode.com/2016/day/23

export const run = (fileContents) => {
  // Parse in the commands for this program
  let commands = parseInput(fileContents);
  // The commands at indexes 2-9 equate to multiply b * a and store
  // the result in a. This is not a necessary optimization when a
  // is 7 but the constant multiplication by copying and incrementing
  // becomes extremely slow as numbers increase. This means that we
  // need to implement a multiply function which is hinted at in the
  // puzzle. Do this by reaplcing the first line with multiply and
  // then filling in the rest of the commands with things that always
  // cause no action. This allows the rest of the program to function
  // normally and efficiently.
  commands.splice(
    2,
    8,
    { command: "mul", val1: "b", val2: "a" },
    { command: "jnz", val1: 0, val2: 0 },
    { command: "jnz", val1: 0, val2: 0 },
    { command: "jnz", val1: 0, val2: 0 },
    { command: "jnz", val1: 0, val2: 0 },
    { command: "jnz", val1: 0, val2: 0 },
    { command: "jnz", val1: 0, val2: 0 },
    { command: "jnz", val1: 0, val2: 0 },
  );

  // Create a copy of the commands for part 1
  let commands1 = JSON.parse(JSON.stringify(commands));

  // Setup the registers for part 1
  let registers1 = new Map();
  registers1.set("a", 7);
  registers1.set("b", 0);
  registers1.set("c", 0);
  registers1.set("d", 0);

  // Process the commands in the program
  processCommands(commands1, registers1);

  // Create a copy of the commands for part 2
  let commands2 = JSON.parse(JSON.stringify(commands));

  // Setup the registers for Part 2
  let registers2 = new Map();
  registers2.set("a", 12);
  registers2.set("b", 0);
  registers2.set("c", 0);
  registers2.set("d", 0);

  // Process the commands in the program
  processCommands(commands2, registers2);

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
      if (val != 0) {
        let val2 = parseInt(current.val2);
        if (isNaN(val2)) val2 = registers.get(current.val2);
        commandIndex += parseInt(val2);
      } else commandIndex += 1;
    }
    // Toggle Command
    else if (current.command === "tgl") {
      let tglIndex = commandIndex + registers.get(current.val1);
      if (tglIndex >= 0 && tglIndex < commands.length) {
        let tglCommand = commands[tglIndex];
        if (tglCommand.val2 === "") {
          if (tglCommand.command === "inc") tglCommand.command = "dec";
          else tglCommand.command = "inc";
        } else {
          if (tglCommand.command === "jnz") tglCommand.command = "cpy";
          else tglCommand.command = "jnz";
        }
      }
      commandIndex += 1;
    }
    // Multiply command
    else if (current.command === "mul") {
      let val1 = registers.get(current.val1);
      let val2 = registers.get(current.val2);
      registers.set(current.val2, val1 * val2);
      commandIndex += 1;
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
