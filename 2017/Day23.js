// Puzzle for Day 23: https://adventofcode.com/2017/day/23

export const run = (fileContents) => {
  // Setup the registers for Part 1
  let registers = new Map();
  registers.set('a', 0);
  registers.set('b', 0);
  registers.set('c', 0);
  registers.set('d', 0);
  registers.set('e', 0);
  registers.set('f', 0);
  registers.set('g', 0);
  registers.set('h', 0);

  // Setup the registers for Part 2
  let registers2 = new Map();
  registers2.set('a', 1);
  registers2.set('b', 0);
  registers2.set('c', 0);
  registers2.set('d', 0);
  registers2.set('e', 0);
  registers2.set('f', 0);
  registers2.set('g', 0);
  registers2.set('h', 0);

  // Parse in the commands separately for each part
  let commands = parseInput(fileContents);
  let commands2 = parseInput(fileContents);

  // Modify the commands for part 2. Include a new command to 
  // check if a value is prime. The code in the replace section 
  // is working to check if the value of b is prime. If it is 
  // not prime then set f as 0 to add 1 to h. This is very 
  // inefficient in the code and can be made to run much faster 
  // by repalcing this continuous looping with a new is prime check 
  // method. Once this is in place then the rest of the commands 
  // can be skipped in this block. Got some good ideas for this from 
  // https://www.reddit.com/r/adventofcode/comments/7m0fkf/2017_day_23_part_2_patch_the_assembly/
  commands2.splice(11, 13,
    {cmd: 'isp', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0},
    {cmd: 'jnz', val1: 0, val2: 0});

  // Find the answer for Part 1
  let countMul = runProgram(commands, registers);
  // Find the answer for Part 2
  runProgram(commands2, registers2);

  return {part1: countMul, part2: registers2.get('h')};
}

// Run the current program from the input
const runProgram = (commands, registers) => {
  // Count the number of times the 'mul' command is run
  let mulCount = 0;
  // The index of the currently processing command
  let index = 0;

  // Continue running while the index is still referencing a valid command
  while(index >= 0 && index < commands.length){
    // The current command object
    let current = commands[index];

    // Set command
    if(current.cmd === 'set'){
      let val2 = parseInt(current.val2);
      if(isNaN(val2)){
        val2 = registers.get(current.val2);
      }
      registers.set(current.val1, val2);
      index++;
    }
    // Subtract command
    else if(current.cmd === 'sub'){
      let val1 = registers.get(current.val1);
      let val2 = parseInt(current.val2);
      if(isNaN(val2)){
        val2 = registers.get(current.val2);
      }
      registers.set(current.val1, val1 - val2);
      index++;
    }
    // Multiply command
    else if(current.cmd === 'mul'){
      let val1 = registers.get(current.val1);
      let val2 = parseInt(current.val2);
      if(isNaN(val2)){
        val2 = registers.get(current.val2);
      }
      registers.set(current.val1, val1 * val2);
      index++;
      mulCount++;
    }
    // Jump if Not Zero command
    else if(current.cmd === 'jnz'){
      let val1 = parseInt(current.val1);
      if(isNaN(val1)){
        val1 = registers.get(current.val1);
      }
      let val2 = parseInt(current.val2);
      if(isNaN(val2)){
        val2 = registers.get(current.val2);
      }
      if(val1 != 0)
        index += val2;
      else
        index++;
    }
    // Is Prime command
    else if(current.cmd === 'isp'){
      let b = registers.get('b');
      let found = false;
      for(let x = 2, s = Math.sqrt(b); x <= s && !found; x++) {
        if(b % x === 0) {
          found = true
          registers.set('f', 0);
        }
      }
      registers.set('d', b);
      registers.set('e', b);
      index++;
    }
  }

  return mulCount;
}

// Parse the input into a set of command objects
const parseInput = (fileContents) => {
  // Regex for parsing each line
  let reg = new RegExp(/([a-z]+) ([a-z]|\d+) ([a-z]|-*\d+)/);
  // The commands in order from the input file
  let commands = [];

  // Parse each line as a separate command with 2 possible value
  for(let line of fileContents){
    let matches = line.match(reg);
    commands.push({
      cmd: matches[1],
      val1: matches[2],
      val2: matches[3]
    });
  }

  return commands;
}