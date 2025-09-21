// Puzzle for Day 14: https://adventofcode.com/2020/day/14

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // An array of the program commands in order
  let program = [];
  // Process each line of the input a a new command
  for (let line of fileContents) {
    // Use regex to extract the necessary data
    let matches = line.match(/(mask|mem\[(\d+)\]) = ([\dX]+)/);
    program.push({
      operation: matches[1],
      memId: matches[2],
      value: matches[3],
    });
  }

  // Find the results for each part of the problem
  let result1 = part1(program);
  let result2 = part2(program);

  return { part1: result1, part2: result2 };
};

/**
 * Part 2
 * @param {{operation: string, memId: string, value:string}[]}} program The program commands
 * @returns number The result for part 2
 */
const part2 = (program) => {
  // Keep track of the current mask and memory map of values
  let mask;
  let memory = new Map();
  // Process each line of the program one at a time
  for (let command of program) {
    // If this is a new mask update the mask variable
    if (command.operation === "mask") {
      mask = command.value.split("");
    }
    // Otherwise compute a new memory value to be stored
    else {
      // Get the value to be stored
      let value = parseInt(command.value);
      // Get the decimal value of the mem id
      let decimal = parseInt(command.memId);
      // Keep track of the results from this command after applying the bit mask
      let results = [];
      // Add the initial memID decimal value to the results array
      results.push(decimalToBinary(decimal).split(""));
      // Check each value of the mask
      for (let x = 0; x < mask.length; x++) {
        // Set the value in each result to 1
        if (mask[x] === "1") {
          for (let result of results) {
            result[x] = "1";
          }
        }
        // Create 2 results for each result that each have a 0 and 1 at this spot in the result
        else if (mask[x] === "X") {
          // New results being created
          let newResults = [];
          // For each result add a 0 and 1 copy of the result
          for (let result of results) {
            // Create two copies
            let copy0 = JSON.parse(JSON.stringify(result));
            let copy1 = JSON.parse(JSON.stringify(result));
            // Assign one a 0 and the other a 1
            copy0[x] = "0";
            copy1[x] = "1";
            // Add them to the new result array
            newResults.push(copy0);
            newResults.push(copy1);
          }
          // Update the results array
          results = newResults;
        }
      }
      // Set the memory for each result
      for (let result of results) {
        // Convert each result to a decimal
        let maskedDecimal = binaryToDecimal(result.join(""));
        // Use the decimal as the mem id and store the commands value into it.
        memory.set(maskedDecimal, value);
      }
    }
  }
  // Sum all results in memory and return them
  return sumMemory(memory);
};

/**
 * Part 1
 * @param {{operation: string, memId: string, value:string}[]}} program The program commands
 * @returns number The result for part 1
 */
const part1 = (program) => {
  // Keep track of the current mask and memory map of values
  let mask;
  let memory = new Map();
  // Process each line of the program one at a time
  for (let command of program) {
    // If this is a new mask update the mask variable
    if (command.operation === "mask") {
      mask = command.value.split("");
    }
    // Otherwise compute a new memory value to be stored
    else {
      // Get the decimal value fo the commands value
      let decimal = parseInt(command.value);
      // Convert to a binary string array
      let binary = decimalToBinary(decimal).split("");
      // For each value in mask check update the value in the binary string array
      for (let x = 0; x < mask.length; x++) {
        // If mask value is not an X update the binary string array at this spot with the mask value
        if (mask[x] !== "X") {
          binary[x] = mask[x];
        }
      }
      // Convert the binary string array into a decimal
      let maskedDecimal = binaryToDecimal(binary.join(""));
      // Store the computed value into the commands memory id
      memory.set(command.memId, maskedDecimal);
    }
  }
  // Sum all results in memory and return them
  return sumMemory(memory);
};

/**
 * Sum all of the values in each populated spot in the memory map
 * @param {Map} memory The map of memory values
 * @returns {number} The sum of all values in the memory
 */
const sumMemory = (memory) => {
  let sum = 0;
  memory.forEach((value) => {
    sum += value;
  });
  return sum;
};

/**
 * Convert a binary string into a decimal number
 * @param {string} binary Binary string
 * @returns {number} The decimal number version of the binary string
 */
const binaryToDecimal = (binary) => {
  return parseInt(binary, 2);
};

/**
 * Convert a decimal number into a binary string filled with placeholder 0's to 36 digits
 * @param {number} decimal A decimal number
 * @returns {string} A binary string that represents the decimal number
 */
const decimalToBinary = (decimal) => {
  // Length to fill with placeholders up to
  const outputLength = 36;
  // Binary string of the decimal number
  let shortBinary = decimal.toString(2);
  // The length of padding 0's to add
  let paddingLength = outputLength - shortBinary.length;
  // Create padding and append it to the binary string
  let padding = "";
  for (let x = 0; x < paddingLength; x++) {
    padding += "0";
  }
  return padding + shortBinary;
};
