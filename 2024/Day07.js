// Puzzle for Day 07: https://adventofcode.com/2024/day/7

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = async (fileContents) => {
  // Parse the input using regex
  let data = fileContents.map((line) => {
    // Match target value and the equation numbers
    let matches = line.match(/(\d+): ([\d ]+)/);
    // Return a data object for each equation
    return {
      // Parse the target to int
      target: parseInt(matches[1]),
      // Split the equation numbers by spaces and parse each one to an int
      numbers: matches[2].split(" ").map((num) => parseInt(num)),
    };
  });
  // Part 1
  let result1 = checkAllEquations(data, false);
  // Part 2
  let result2 = checkAllEquations(data, true);
  return { part1: result1, part2: result2 };
};

/**
 * Check all equations and return the sum of the valid targets
 * @param {{target: number, numbers: number[]}} data The target and equation data
 * @param {boolean} withConcat True to include the concat operator
 * @returns {number} The sum of the target values with possible valid equations from their numbers
 */
const checkAllEquations = (data, withConcat) => {
  // Save the total sum of the valid targets values
  let total = 0;

  // Check each equation
  for (let equation of data) {
    // Clone the numbers to avoid having to reparse them later
    let numbers = structuredClone(equation.numbers);
    let target = equation.target;

    // Keep track of an array of answer possibilities starting with the first equation number
    let answers = [numbers.shift()];
    // Continue while there are still numbers to consider
    while (numbers.length > 0) {
      // Get the next number to apply to all of the answers
      let next = numbers.shift();
      // Create a new set of all possible answers
      let newAnswers = [];
      // Apply all possible next operations with the next values to all current answers
      for (let answer of answers) {
        // If the answer is already larger then the target skip it since all operators
        // only increase the size of the answer
        if (answer > target) continue;
        // Add result for addition and multiplication
        newAnswers.push(answer + next);
        newAnswers.push(answer * next);
        // If concatenation is included then add that new answer as well
        if (withConcat)
          // Concatenate using math
          // Multiply the current answer by 10^(number of digits of the next value).
          // This way when adding the next value it will fill the newly added zeros of the answer.
          newAnswers.push(
            answer * Math.pow(10, Math.floor(Math.log10(next)) + 1) + next,
          );
      }
      // Set the answer array to the new answers for the next number to be processed
      answers = newAnswers;
    }
    // Check if the target value is in the answers
    if (answers.indexOf(target) >= 0)
      // Add valid target values to the total
      total += equation.target;
  }

  return total;
};
