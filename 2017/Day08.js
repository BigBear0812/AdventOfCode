// Puzzle for Day 8: https://adventofcode.com/2017/day/8

export const run = (fileContents) => {
  // Parse the input file to get the list of commands being 
  // processed and an initialized set of registers 
  let data = parseInput(fileContents);

  // Process the commands and update the register values. 
  // Return the highest ever regsiter value
  let highestEver = processCommands(data);

  // Find the largest current register value after all the commands have run
  let largest = Number.MIN_SAFE_INTEGER;
  data.registers.forEach(val => {
    if(val > largest)
      largest = val;
  });

  return {part1: largest, part2: highestEver};
}

// Process the commands and update the registers in the data
const processCommands = (data) => {
  // Initialize this to 0 since all registers are initally 0
  let highestEver = 0;

  // Run through each command
  for(let x = 0; x < data.commands.length; x++){
    // Get the current command from the data
    let current = data.commands[x];
    // Eavluate the goal statement with the specified current register value
    if(eval(data.registers.get(current.goalRegister) + current.goalComparator + current.goalAmount)){
      // Update the register value in the first part of the command
      let regVal = data.registers.get(current.register);
      // Increment or decrement the value by the specified amount
      if(current.commands === 'inc')
        data.registers.set(current.register, regVal + current.amount);
      else if(current.commands === 'dec')
        data.registers.set(current.register, regVal - current.amount);

      // If the updated regsiter is higher than the highest register 
      // value ever seen the update it
      if(data.registers.get(current.register) > highestEver)
        highestEver = data.registers.get(current.register);
    }
  }

  return highestEver;
}

// Parse the input file to extract the commands and the registers used. Set all registers to 0.
const parseInput = (fileContents) => {
  // The regex to parse each command
  let reg = new RegExp(/([a-z]+) (inc|dec) (-*\d+) if ([a-z]+) (<=|>=|==|!=|<|>) (-*\d+)/);
  // The commands and registers data structures
  let commands = [];
  let registers = new Map();

  // Process each line as a separate command
  for(let line of fileContents){
    let matches = line.match(reg);

    // Add the command
    commands.push({
      register: matches[1],
      commands: matches[2],
      amount: parseInt(matches[3]),
      goalRegister: matches[4],
      goalComparator: matches[5],
      goalAmount: parseInt(matches[6])
    });

    // If the mentioned register doesn't exist in the map then add it initialized to 0
    if(!registers.has(matches[1]))
      registers.set(matches[1], 0);
  }

  return {commands, registers};
}