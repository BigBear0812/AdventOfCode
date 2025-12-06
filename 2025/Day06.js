// Puzzle for Day 06: https://adventofcode.com/2025/day/6

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  const part1 = solution1(fileContents);
  const part2 = solution2(fileContents);
  return { part1, part2 };
};

/**
 * Solution for Part 2
 * @param {string[]} fileContents The file contents in an array opf strings for each line
 * @returns {number} The total sum of all the equation results
 */
const solution2 = (fileContents) => {
  // Final total
  let total = 0;
  // The width of the data to be checked
  const dataLength = fileContents[0].length;
  // The row with the operations
  const opRow = fileContents.length - 1;

  // The current equation operator and numbers
  let eqOp = "";
  let eqNums = [];
  // Check each column one at a time
  for (let c = 0; c < dataLength; c++) {
    // If this is a new operator if then this is the beginning of a new equation
    if (fileContents[opRow][c] !== " ") {
      // Skip if this is the first operator at the beginning of the doc
      if (eqOp !== "") {
        // Compute the total for the equation and add it to the final total
        total += eval(eqNums.join(eqOp));
        // Reset the equations numbers array
        eqNums = [];
      }
      // Update the equation operator
      eqOp = fileContents[opRow][c];
    }

    // Get the next number in the current column
    let num = "";
    // Add each number from the column's rows into the string from top to bottom
    for (let r = 0; r < opRow; r++) {
      num += fileContents[r][c];
    }

    // Trim excess white space
    let trimmedNum = num.trim();
    // Only add it to the equation numbers if there are still values to add
    if (trimmedNum !== "") eqNums.push(trimmedNum);
  }
  // Add the last number to the final total
  total += eval(eqNums.join(eqOp));

  return total;
};

/**
 * Solution for Part 1
 * @param {string[]} fileContents The file contents in an array opf strings for each line
 * @returns {number} The total sum of all the equation results
 */
const solution1 = (fileContents) => {
  // Split each row on its spaces and remove any empty values
  const dataGrid = fileContents.map((line) =>
    line.split(" ").filter((x) => x !== ""),
  );
  // Final total
  let total = 0;
  // The width of the data to be checked
  const dataLength = dataGrid[0].length;
  // The row of the operators
  const opRow = dataGrid.length - 1;

  // Check each column
  for (let x = 0; x < dataLength; x++) {
    // Get the operator and numbers for this equation
    const eqOp = dataGrid[opRow][x];
    const eqNums = [];
    // Add each number from this column's rows to the equation numbers
    for (let y = 0; y < opRow; y++) {
      eqNums.push(dataGrid[y][x]);
    }
    // Compute the equation total and add it to the final total
    total += eval(eqNums.join(eqOp));
  }

  return total;
};
