// Puzzle for Day 05: https://adventofcode.com/2024/day/5

export const run = (fileContents) => {
  // Get the data from the input file
  let data = parseInput(fileContents);

  // Get the correct and incorrect updates
  let output1 = part1(data.rules, data.updates);
  // Get the total of the middle values of the correct updates
  let result1 = getTotal(output1.correct);

  // Fix the incorrect updates
  let output2 = part2(data.rules, output1.incorrect);
  // Get the total of the middle values of the formerly incorrect updates
  let result2 = getTotal(output2);

  return { part1: result1, part2: result2 };
};

/**
 * Part 2 solution
 * @param {{before: number, after: number}[]} rules The rules from the input
 * @param {number[][]} updates The incorrect page updates to be fixed
 * @returns {number[][]} The corrected page updates
 */
const part2 = (rules, updates) => {
  // Fix each of the updates
  for (let update of updates) {
    // Keep track of only the rules that apply to this update
    let applicableRules = [];
    // Check each rule
    for (let x = 0; x < rules.length; x++) {
      // Get the current rule
      let rule = rules[x];
      // Get the before and after indexes
      let beforeIndex = update.indexOf(rule.before);
      let afterIndex = update.indexOf(rule.after);
      // If this rule is Valid add it to the applicableRules array.
      if (beforeIndex >= 0 && afterIndex >= 0) {
        applicableRules.push(rule);
      }
    }

    // Assume this rule is invalid
    let isValid = false;
    // Continue fixing this rule until it is valid
    while (!isValid) {
      // Keep track of if a change was made on this pass of evaluating the rules
      let madeChange = false;
      // Check each rule against the update
      for (let x = 0; x < applicableRules.length; x++) {
        // Get the rule
        let rule = applicableRules[x];
        // Get the before and after indexes
        let beforeIndex = update.indexOf(rule.before);
        let afterIndex = update.indexOf(rule.after);
        // If the indexes are in the wrong order correct this
        if (beforeIndex > afterIndex) {
          // Delete the before value from it's current position
          update.splice(beforeIndex, 1);
          // Insert the before value immediately in front of the after position
          update.splice(afterIndex, 0, rule.before);
          // Set madeChange to true
          madeChange = true;
        }
      }
      // If no changes were made then all rules passed and the update is now valid
      if (!madeChange) isValid = true;
    }
  }
  return updates;
};

/**
 * Part 1 solution
 * @param {{before: number, after: number}[]} rules The rules from the input
 * @param {number[][]} updates The page updates to be evaluated
 * @returns {{correct: number[][], incorrect: number[][]}} The correct and incorrect page updates
 */
const part1 = (rules, updates) => {
  // Save the updates into separate arrays for ones that are already correct and ones that are not
  let correct = [];
  let incorrect = [];

  // Check each update
  for (let update of updates) {
    // Assume it is a valid page update until evaluated against every rule
    let isValid = true;
    // Check each rule until reaching the end or finding one that is invalid
    for (let x = 0; x < rules.length && isValid; x++) {
      // Get the rule
      let rule = rules[x];
      // Get the index of the before and after values for this rule
      let beforeIndex = update.indexOf(rule.before);
      let afterIndex = update.indexOf(rule.after);
      // Only evaluate this rule if both indexes are valid
      if (beforeIndex >= 0 && afterIndex >= 0) {
        // If the before index is less that the after index this rule
        // passes otherwise this is an incorrect page update
        isValid = beforeIndex < afterIndex;
      }
    }

    // Add the update to the appropriate array
    if (isValid) correct.push(update);
    else incorrect.push(update);
  }
  return { correct, incorrect };
};

/**
 * Get the total of the middle values of each array in an array
 * @param {number[][]} values The 2D values arrays
 * @returns {number} The total of the array middle values
 */
const getTotal = (values) => {
  // Sum the total of the middle values of each array in the values arrays
  return values.reduce(
    (total, update) => (total += update[Math.floor(update.length / 2)]),
    0,
  );
};

/**
 * Parse the input into rules and page updates
 * @param {string[]} fileContents The input file contents array
 * @returns {rules: {before: number, after: number}[], updates: number[][]} An object of rules and updates
 */
const parseInput = (fileContents) => {
  // Keep track of rules and page updates
  let rules = [];
  let updates = [];

  // Assume to be parsing in rules until page update have been reached
  let addRules = true;
  // Parse each line
  for (let line of fileContents) {
    // If the current line is blank then this separates rules from page updates
    if (line === "") {
      // No longer parse in new rules
      addRules = false;
      // Skip this line and continue to the next one.
      continue;
    }

    // If parsing rules
    if (addRules) {
      // Get the before and after page numbers
      let nums = line.split("|").map((num) => parseInt(num));
      // Add them as an object to the array
      rules.push({
        before: nums[0],
        after: nums[1],
      });
    }
    // Otherwise parse page updates
    else {
      // Parse the comma separated values in an array of integers
      let nums = line.split(",").map((num) => parseInt(num));
      // Add it to the updates array
      updates.push(nums);
    }
  }

  return { rules, updates };
};
