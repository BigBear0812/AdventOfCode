// Puzzle for Day 2: https://adventofcode.com/2019/day/2

export const run = (fileContents) => {
  // Parse the program in from the input file
  let program = fileContents[0].split(",").map(x => parseInt(x));
  // Run the program and return the resulting value at address 0
  let result1 = runProgram(program, 12, 2);
  
  // Target solution for part 2
  let target = 19690720;
  // Result for part 2
  let result2 = null;
  // Continue changing the noun and verb until the target value 
  // for program2 equals the target value
  for(let noun = 0; noun < 100 && result2 === null; noun++){
    for(let verb = 0; verb < 100 && result2 === null; verb++){
      // Run the program and return the resulting value at address 0
      let output = runProgram(program, noun, verb);
      // If the program2[0] value is correct set the result
      if(output === target)
        result2 = 100 * noun + verb; 
    }
  }

  return {part1: result1, part2: result2};
}

// Run the program until it completes
const runProgram = (memory, noun, verb) => {
  // Copy the program to manipulate
  let program = JSON.parse(JSON.stringify(memory));
  // Set the noun and verb
  program[1] = noun;
  program[2] = verb;
  //Continue until reaching the end of the program or the program breaks for opcode 99
  for(let x = 0; x < program.length;){
    // Get program values for this instruction
    let opCode = program[x];
    let index1 = program[x+1];
    let index2 = program[x+2];
    let index3 = program[x+3];

    // Add
    if(opCode === 1){
      program[index3] = program[index1] + program[index2]; 
      x+=4;
    }
    // Mutiply
    else if(opCode === 2){
      program[index3] = program[index1] * program[index2]; 
      x+=4;
    }
    // Exit
    else if(opCode === 99){
      x+=1;
      break;
    }
  }

  // Return the value at address 0
  return program[0];
}