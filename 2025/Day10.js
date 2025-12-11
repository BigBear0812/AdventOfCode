// Puzzle for Day 10: https://adventofcode.com/2025/day/10
import { init } from "z3-solver";

const INIT_Z3_COUNT = 100;
/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = async (fileContents) => {
  // Parse in the data from the input file
  const machines = fileContents.map((line) => {
    // Get each section of the machine's input
    const matches = line.match(/\[([.#]+)\] ([()\d,\s]+)+{([\d,]+)}/);
    // Get the indicator input in a binary string format
    const indicStr = matches[1]
      .split("")
      .map((val) => val === "#")
      .reduce((result, val) => (result += val ? "1" : "0"), "");
    // Return the machine data
    return {
      // Get the number version of the binary string for the proper indicator result
      indic: parseInt(indicStr, 2),
      // Get the buttons and how they will toggle the indicator values as numbers
      // from their binary strings
      indicButtons: matches[2]
        // Split the buttons and remove any bad values
        .split(" ")
        .filter((val) => val)
        .map((button) => {
          // Get a base 0 binary string to to start for this button
          let result = new Array(indicStr.length).fill(0);
          button
            // Trim the ends and split the values
            .substring(1, button.length - 1)
            .split(",")
            // Update the result for each wire in the button
            .forEach((val) => (result[parseInt(val)] = 1));
          // Parse the result to a number from a binary string
          return parseInt(result.join(""), 2);
        }),
      // Get the buttons again but as 2d array of decimal ints
      joltageButtons: matches[2]
        // Split the buttons and remove any bad values
        .split(" ")
        .filter((val) => val)
        .map((button) =>
          button
            // Trim the ends and split the values
            .substring(1, button.length - 1)
            .split(",")
            // Parse to an int array of values for each wire it effects
            .map((val) => parseInt(val)),
        ),
      // Get the target set of joltage values as a number array
      joltage: matches[3].split(",").map((val) => parseInt(val)),
    };
  });
  // Track the results for each part
  let part1 = 0;
  let part2 = 0;

  // Keep the initialized context for Z3
  let z3Init;

  // Find the result for each machine one at a time
  for (let m = 0; m < machines.length; m++) {
    // Initialize Z3
    if (m % INIT_Z3_COUNT === 0) z3Init = await init();
    // Get the machine info and solve each part
    const machine = machines[m];
    part1 += solveMachine(machine.indicButtons, machine.indic);
    part2 += await solveZ3(
      machine.joltageButtons,
      machine.joltage,
      z3Init.Context,
    );
  }

  return { part1, part2 };
};

/**
 * Solution for Part 2 using Z3
 * @param {number[][]} buttons The 2d array of buttons and what they will do to each joltage
 * @param {number[]} joltages The joltage values required for the machine
 * @param {import("z3-solver").ContextCtor} Context The Z3 context constructor to use for the calculations
 * @returns {Promise<number>} The minimum number of button presses it will take to get to the correct joltage
 */
const solveZ3 = async (buttons, joltages, Context) => {
  // The result
  let presses;

  // Create an optimize object from Z3
  const { Int, Optimize } = Context("main");
  const optimizer = new Optimize();

  // Create a variable for each button
  const variables = [];
  buttons.forEach((_, ind) => {
    const value = Int.const(String.fromCodePoint(ind + 97));
    optimizer.add(value.ge(0));
    variables.push(value);
  });

  // For each joltage to be found create a condition that ties the buttons wires
  // to the appropriate joltage output value
  joltages.forEach((joltage, vInd) => {
    let condition = Int.val(0);
    buttons.forEach((_, bInd, buttons) => {
      if (buttons[bInd].includes(vInd))
        condition = condition.add(variables[bInd]);
    });
    condition = condition.eq(Int.val(joltage));
    optimizer.add(condition);
  });

  // Reduce the variables to add up to the final joltage
  const sum = variables.reduce((arith, val) => arith.add(val), Int.val(0));
  // Find the minimal way to reach this sum
  optimizer.minimize(sum);
  // If there is a satisfactory result get it and put it into the result
  if ((await optimizer.check()) == "sat")
    presses = parseInt(optimizer.model().eval(sum).toString());

  return presses;
};

/**
 * Solution for part 1 using BFS
 * @param {number[]} buttons The numbers of the binary version of each buttons wires and how they toggle the indicators
 * @param {number} goal The goal value to reach
 * @returns {number} The minimal number of presses to reach to goal indicator lights
 */
const solveMachine = (buttons, goal) => {
  // The result
  let presses = 0;
  // Keep track of past indicator values that have been seen to avoid
  // repeats and cut down the search space
  const seen = new Set();
  // The next round of possible states to explore and initialized with the start value of 0
  let nextRound = [];
  nextRound.push(0);
  // Flag for short circuiting when a result has been found
  let foundMatch = false;
  // Continue processing the next round of possible button clicks until a result is found
  while (!foundMatch && nextRound.length > 0) {
    // Get the stack of next states and update presses and next round variables
    const stack = Array.from(nextRound);
    presses += 1;
    nextRound = [];
    // Continue processing the stack next states until a result is found
    while (!foundMatch && stack.length > 0) {
      // Get the next value to process
      const current = stack.pop();
      // Generate all next possible states
      for (let b = 0; !foundMatch && b < buttons.length; b++) {
        // Get the button value
        const button = buttons[b];
        // Use XOR to toggle the indicator lights
        const next = current ^ button;

        // If the goal is found stop
        if (next === goal) {
          foundMatch = true;
        }
        // Otherwise if this value has not already been seen then
        // add it to seen and the next round states
        else if (!seen.has(next)) {
          nextRound.push(next);
          seen.add(next);
        }
      }
    }
  }
  return presses;
};
