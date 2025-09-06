// Puzzle for Day 08: https://adventofcode.com/2020/day/8

export const run = (fileContents) => {
  // Parse the instructions from the input file
  let instructions = [];
  for (let line of fileContents) {
    // Match the information form each line
    let matches = line.match(/([a-z]*) ([-+]\d*)/);
    // Add an instruction object
    instructions.push({
      cmd: matches[1],
      val: parseInt(matches[2]),
    });
  }

  // Part 1
  let result1 = runInstructions(instructions);

  // Part 2
  let result2;
  // Change instructions one at a time until finding the one that makes the program complete successfully
  for (
    let pos = 0, success = false;
    success === false && pos < instructions.length;
    pos++
  ) {
    // Get the current instruction to examine
    let currentInstruction = instructions[pos];
    let newInstructions = null;
    // if the current instruction is a jmp copy all instructions and modify this one to a nop
    if (currentInstruction.cmd === "jmp") {
      newInstructions = JSON.parse(JSON.stringify(instructions));
      newInstructions[pos].cmd = "nop";
    }
    // if the current instruction is a nop copy all instructions and modify this one to a jmp
    else if (currentInstruction.cmd === "nop") {
      newInstructions = JSON.parse(JSON.stringify(instructions));
      newInstructions[pos].cmd = "jmp";
    }
    // If new instructions were created simulate them to find out if they run successfully
    if (newInstructions !== null) {
      result2 = runInstructions(newInstructions);
      success = result2.success;
    }
  }

  return { part1: result1.accumulator, part2: result2.accumulator };
};

/**
 * Run a simulation of the instruction set provided
 * @param {{cmd: string, val: number}[]} instructions An array of instruction objects
 * @returns {{success: boolean, accumulator: number}} An object with the results of simulating the instructions
 */
const runInstructions = (instructions) => {
  // Keep track of the accumulator, the current instruction being
  // run starting at 0, and the instruction that have already been visited
  let currentPos = 0;
  let accumulator = 0;
  let visitedPos = new Set();

  // While not hitting and instruction already seen and still having a valid instruction to
  // process continue the simulation
  while (
    !visitedPos.has(currentPos) &&
    currentPos >= 0 &&
    currentPos < instructions.length
  ) {
    // Add this position to the visited positions set to check for an infinite loop
    visitedPos.add(currentPos);

    // Get the current command
    let currentCmd = instructions[currentPos];
    // Run the current command
    if (currentCmd.cmd === "acc") {
      accumulator += currentCmd.val;
      currentPos++;
    } else if (currentCmd.cmd === "jmp") {
      currentPos += currentCmd.val;
    } else {
      currentPos++;
    }
  }

  // Determine if this stopped due to a successful run or an infinite loop
  let success = !visitedPos.has(currentPos);
  return { success, accumulator };
};
