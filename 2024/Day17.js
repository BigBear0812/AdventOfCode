// Puzzle for Day 17: https://adventofcode.com/2024/day/17

export const run = (fileContents) => {
  let data = parseInput(fileContents);
  let result1 = runProgram(structuredClone(data.registers), structuredClone(data.program));
  let result2 = part2( structuredClone(data.program))
  return {part1: result1.join(','), part2: result2};
}

/**
 * Part 2 solution
 * @param {number[]} program The program to run
 * @returns {number} The lowest correct initial value for A
 */
const part2 = (program) => {
  // Reverse the program and join the values into a target string to work with
  let targetOutput = structuredClone(program).reverse().join('');
  // Record the answers found
  let answers = [];
  // Find the initial value for A
  findInitialValue(0, program.length-1, program, targetOutput, answers);
  // Return the lowest answer
  return  Math.min(...answers);
}

/**
 * This recursively searches for a number to use for A. The program is always outputting 
 * (A/8^outputIndex)%8. This works in reverse solving for the last digit first by adding 
 * the pervious partial sum to 8^outputIndexValue multiplied by x. X is a variable 
 * between 0 and 7. One of these values is guaranteed to give us the next value necessary since 
 * it covers all of the possible 3 bit values. If the output string matches we record 
 * the value since there could be multiple possible solutions for this. if not we check if 
 * it is partially matches for at least the values we have been working generate so far. 
 * If it does match then continue with this partial sum to the next power to see if a value can be made 
 * 
 * Got the idea for this solution from https://github.com/yolocheezwhiz/adventofcode/blob/main/2024/day17.js
 * @param {number} sum Sum of the answer to this point
 * @param {number} power The current power of 8 being checked for
 * @param {number[]} program The program to run
 * @param {string} target The reversed concatenated program
 * @param {number[]} answers The answers that have been found so far
 * @returns 
 */
const findInitialValue = (sum, power, program, target, answers) => {
  // Check each 3 bit value
  for(let x = 0; x < 8; x++){
    // Get a new partial sum to try for A
    let partialSum = sum + Math.pow(8, power) * x;
    // Configure the registers
    let registers = new Map();
    registers.set('A', partialSum);
    registers.set('B', 0);
    registers.set('C', 0);

    // Run the program and get an output
    let output = runProgram(registers, program);
    // Reverse and join the array to check against the target
    let revStrOutput = output.reverse().join('');

    // If there is a match save and return it
    if(revStrOutput === target){
      answers.push(partialSum);
      return;
    }

    // Else if there is a partial match for the values we have 
    // worked to generate so far then recurse to the next value.
    else {
      // Get the starting part of the reverse string output which 
      // is the part we have worked to generate so far
      let startOutput = revStrOutput.substring(0, target.length - power)
      // If this is a partial match with the target recuse to the next value
      if(target.startsWith(startOutput)){
        findInitialValue(partialSum, power -1, program, target, answers);
      }
      
    }
  }
}

/**
 * The program computer as described in Part 1
 * @param {Map<string, number>} registers The values to use for the program
 * @param {number[]} program The program to run
 * @returns {number[]} The output generated by the program
 */
const runProgram = (registers, program) => {

  // Store the output values
  let output = [];

  // A method for determining the value of a combo operand
  const comboOperandValue = (operand) => {
    // Treat as literal for 0-3
    if(operand >= 0 && operand <= 3){
      return operand;
    }
    // 4 return A
    else if(operand === 4){
      return registers.get('A');
    }
    // 5 returns B
    else if(operand === 5){
      return registers.get('B');
    }
    // 6 returns C
    else if(operand === 6){
      return registers.get('C');
    }
    // Anything else is invalid and throws an error
    throw new Error("Invalid Combo Operand:", operand);
  }

  // Starting at the position 0 in the program array
  let current = 0;
  // Continue until the current index goes off the end of the array
  while(current < program.length){
    // Get the opCode and operand for the current iteration
    let opCode = program[current];
    let operand = program[current+1];
    // Flag wether or not to increment the current index after commands have run
    let incrementCurrent = true;

    // ADV
    // Divide A by 2 ^ comboOperand store in A
    if(opCode === 0){
      let numerator = registers.get("A");
      let operandVal = comboOperandValue(operand);
      let denominator = Math.pow(2, operandVal);
      registers.set('A',  Math.floor(numerator / denominator));
    }
    // BXL
    // Bitwise XOR of B and literalOperand store in B
    else if(opCode === 1){
      let bVal = registers.get('B');
      registers.set('B', bVal ^ operand);
    }
    // BST
    // comboOperand % 8 to keep lowest 3 bits store in B
    else if(opCode === 2){
      let operandVal = comboOperandValue(operand);
      // Used bitwise & 7 instead to avoid issues with large numbers in JS
      registers.set('B', operandVal & 7);
    }
    // JNZ
    // Jump to operation at literalOperand if A is not 0
    else if(opCode === 3){
      if(registers.get('A') !== 0){
        current = operand;
        incrementCurrent = false;
      }
    }
    // BXC
    // Bitwise XOR of B and C store in B
    else if(opCode === 4){
      let bVal = registers.get('B');
      let cVal = registers.get('C');
      registers.set('B', bVal ^ cVal);
    }
    // OUT
    // Output val of comboOperand % 8 to get the last 3 bits to store in output
    else if(opCode === 5){
      let operandVal = comboOperandValue(operand);
      // Used bitwise & 7 instead to avoid issues with large numbers in JS
      output.push(operandVal & 7);
    }
    // BDV
    // Divide A by 2 ^ comboOperand store in B
    else if(opCode === 6){
      let numerator = registers.get("A");
      let operandVal = comboOperandValue(operand);
      let denominator = Math.pow(2, operandVal);
      registers.set('B', Math.floor(numerator / denominator));
    }
    // CDV
    // Divide A by 2 ^ comboOperand store in C
    else if(opCode === 7){
      let numerator = registers.get("A");
      let operandVal = comboOperandValue(operand);
      let denominator = Math.pow(2, operandVal);
      registers.set('C', Math.floor(numerator / denominator));
    }
    // If another opCode value is used throw an error
    else{
      throw new Error("Invalid OpCode:", opCode);
    }

    // Increment to the next command
    if(incrementCurrent)
      current += 2;
  }

  return output;
}

/**
 * Parse the input into useable data
 * @param {string[]} fileContents The lines fo the input file as a string array
 * @returns {registers: Map<string, number>, number[]} The registers and program commands from the input file
 */
const parseInput = (fileContents) => {
  // True if getting register info
  let registerMode = true;
  // Store registers in a map
  let registers = new Map();
  // The program  will be an array
  let program;

  for(let line of fileContents){
    // Blank line means switch to program mode
    if(line === ''){
      registerMode = false;
      continue;
    }
    // Parse each register one at a time
    if(registerMode){
      let matches = line.match(/Register ([ABC]): (\d+)/);
      registers.set(matches[1], parseInt(matches[2]));
    }
    // Parse the program into an integer array
    else{
      let matches = line.match(/Program: ([\d,]+)/);
      program = matches[1].split(',').map(num => parseInt(num));
    }
  }

  return {registers, program};
}