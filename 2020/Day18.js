// Puzzle for Day 18: https://adventofcode.com/2020/day/18

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Solve each part of the problem
  let result1 = solvePart(fileContents, solveProblem1);
  let result2 = solvePart(fileContents, solveProblem2);

  return { part1: result1, part2: result2 };
};

/**
 * Solve a single part of the problem
 * @param {*} fileContents The contents of the file as an array of strings for each line of the input file
 * @param {*} solver The solver function for this part of the problem
 * @returns The sum of the result of each equation
 */
const solvePart = (fileContents, solver) => {
  // Parse the equation into a set of nested arrays with numbers and operators
  let equations = fileContents.map((l) => {
    let eq =
      "[" +
      l
        .replaceAll("(", "[")
        .replaceAll(")", "]")
        .replaceAll(" ", ",")
        .replaceAll(/\d+|\+|\*/g, (match) => `"${match}"`) +
      "]";
    return JSON.parse(eq);
  });

  // Total the result of each equation
  return equations.reduce((total, eq) => (total += solver(eq)), 0);
};

/**
 * Solve equations by using the Part 2 rules
 * @param {string[]} equation An array of nested arrays with numbers and operators
 * @returns {number} The result of the equation
 */
const solveProblem2 = (equation) => {
  // Resolve Parenthesis
  for (let x = 0; x < equation.length; x++) {
    // If there is a nested array pass it into the solver again to get a result
    if (Array.isArray(equation[x])) {
      equation[x] = solveProblem2(equation[x]);
    }
  }

  // Resolve Addition
  for (let x = 0; x < equation.length; x++) {
    if (equation[x] === "+") {
      // Get the addition values and calculate the result
      let val1 = equation[x - 1];
      let val2 = equation[x + 1];
      let result = eval(val1 + "+" + val2);
      // Replace val 1 in the array with the result
      equation.splice(x - 1, 3, result);
      // Set the counter back 1 so that nothing gets skipped
      x--;
    }
  }

  // Resolve Multiplication
  for (let x = 0; x < equation.length; x++) {
    if (equation[x] === "*") {
      // Get the multiplication values and calculate the result
      let val1 = equation[x - 1];
      let val2 = equation[x + 1];
      let result = eval(val1 + "*" + val2);
      // Replace val 1 in the array with the result
      equation.splice(x - 1, 3, result);
      // Set the counter back 1 so that nothing gets skipped
      x--;
    }
  }

  // Return the only remaining number which is the answer
  return equation[0];
};

/**
 * Solve equations by using the Part 1 rules
 * @param {string[]} equation An array of nested arrays with numbers and operators
 * @returns {number} The result of the equation
 */
const solveProblem1 = (equation) => {
  // Resolve Parenthesis
  for (let x = 0; x < equation.length; x++) {
    // If there is a nested array pass it into the solver again to get a result
    if (Array.isArray(equation[x])) {
      equation[x] = solveProblem1(equation[x]);
    }
  }

  // Resolve Equations
  for (let x = 0; x < equation.length; x++) {
    // Resolve either operator going left to right
    if (equation[x] === "+" || equation[x] === "*") {
      // Get the values and operator to find the result
      let val1 = equation[x - 1];
      let operator = equation[x];
      let val2 = equation[x + 1];
      let result = eval(val1 + operator + val2);
      // Replace val 1 in the array with the result
      equation.splice(x - 1, 3, result);
      // Set the counter back 1 so that nothing gets skipped
      x--;
    }
  }

  // Return the only remaining number which is the answer
  return equation[0];
};
