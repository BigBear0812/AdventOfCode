// Puzzle for Day 25: https://adventofcode.com/2016/day/25

export const run = (fileContents) => {
  // The assembunny commands
  let commands = parseInput(fileContents);

  // Find the lowest positive int that will create the clock signal
  let lowest = findLowestA(commands);

  // Log output
  console.log("Part 1:", lowest);
}

// Finds the lowest int that will output the clock signal
const findLowestA = (commands) => {
  // Starting value to check
  let index = 0;
  // True if the clock signal is found
  let success = false;
  // The expected clock signal sample
  let expected = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  
  // Test this while there has not been a success yet
  do{
    // Add one to the index to test the next value
    index++;
    // Setup the registers
    let registers = new Map();
    registers.set('a', index);
    registers.set('b', 0);
    registers.set('c', 0);
    registers.set('d', 0);

    // Process the commands and get the actual output
    let output = processCommands(commands, registers);

    // Check if the actual sample matches the expected sample
    let match = true;
    for(let x = 0; x < output.length && match; x++){
      match = output[x] === expected[x];
    }
    // If all values match update the success flag
    success = match;
  }
  while(!success);

  return index;
}

// Process the commands in the program
const processCommands = (commands, registers) => {
  // Keep track of which command is being processed starting at the first command in the array
  let commandIndex = 0;

  let output = [];

  // Continue running the program while the command index is still pointing to a valid command
  while(commandIndex < commands.length && output.length < 10){
    let current = commands[commandIndex];

    // Copy command
    if(current.command === 'cpy'){
      let val = parseInt(current.val1);
      if(isNaN(val)){
        val = registers.get(current.val1);
      }
      registers.set(current.val2, val);
      commandIndex += 1;
    }
    // Increment command
    else if(current.command === 'inc'){
      let val = registers.get(current.val1);
      registers.set(current.val1, val + 1);
      commandIndex += 1;
    }
    // Decrement command
    else if(current.command === 'dec'){
      let val = registers.get(current.val1);
      registers.set(current.val1, val - 1);
      commandIndex += 1;
    }
    // Jump if Not Zero command
    else if(current.command === 'jnz'){
      let val = parseInt(current.val1);
      if(isNaN(val)){
        val = registers.get(current.val1);
      }
      if(val != 0){
        let val2 = parseInt(current.val2);
        if(isNaN(val2))
          val2 = registers.get(current.val2);
        commandIndex += parseInt(val2);
      }
      else
        commandIndex += 1;
    }
    // Out command
    else if(current.command === 'out'){
      let val = parseInt(current.val1);
      if(isNaN)
        val = registers.get(current.val1);
      output.push(val);
      commandIndex += 1;
    }
  }

  return output;
}

// Parse the file input with the program commands
const parseInput = (fileContents) => {
  // Regex to parse the command on the current line
  let reg = new RegExp(/([a-z]+) ([a-z0-9\-]+) *([a-z0-9\-]*)/);
  // The resulting list of commands
  let commands = [];

  // Copy each of the pieces of the command into a command object and add it to the result set
  for(let line of fileContents){
    let matches = line.match(reg);
    let command = {
      command: matches[1],
      val1: matches[2],
      val2: matches[3]
    };
    commands.push(command);
  }

  return commands;
}