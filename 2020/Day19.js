// Puzzle for Day 19: https://adventofcode.com/2020/day/19

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Solve for each part individually
  let result1 = countValidMessages(fileContents, false);
  let result2 = countValidMessages(fileContents, true);

  return { part1: result1, part2: result2 };
};

const countValidMessages = (fileContents, part2) => {
  // The unresolved rules and the resolved rules map of regex values
  let unresolvedRules = [];
  let rules = new Map();
  // The current line number that is being examined
  let lineNum = 0;

  // Parse rules to resolve and base case rules until reaching a blank line
  while (lineNum < fileContents.length) {
    // The current line
    let line = fileContents[lineNum];
    // If at a blank line break out
    if (line === "") {
      lineNum++;
      break;
    }
    // Otherwise use regex to determine if this is a rule that will need to be resolved
    let matches = line.match(/^(\d+): ([\d\s]+) *\|* *([\d\s]+)*$/);
    if (matches && matches.length > 0) {
      // Get the rule number
      let ruleNum = parseInt(matches[1]);
      // Get the individual parts of each rule separated by | characters
      let parts = [];
      parts.push(
        matches[2]
          .trim()
          .split(" ")
          .map((m) => parseInt(m)),
      );
      // If there is a second part match that too and add it to the parts array
      if (matches[3])
        parts.push(
          matches[3]
            .trim()
            .split(" ")
            .map((m) => parseInt(m)),
        );
      // Get a flattened array fo all the numbers used by all parts and make sure it's unique
      let allNumbers = Array.from(
        parts.flat().reduce((set, val) => set.add(val), new Set()),
      );

      // If this is for part 2 add in 5 iterations of re-compounding the answer onto itself for rules 8 and 11
      if (part2 && ruleNum === 8) {
        parts.push([42, 8]);
        parts.push([42, 8]);
        parts.push([42, 8]);
        parts.push([42, 8]);
      } else if (part2 && ruleNum === 11) {
        parts.push([42, 11, 31]);
        parts.push([42, 11, 31]);
        parts.push([42, 11, 31]);
        parts.push([42, 11, 31]);
      }
      // Add this info to the unresolved rules list
      unresolvedRules.push({
        ruleNum: ruleNum,
        allNumbers: allNumbers,
        parts: parts,
      });
    }
    // Otherwise this is a base rule so add it to the rules map
    else {
      matches = line.match(/^(\d+): "([a-z])"$/);
      rules.set(parseInt(matches[1]), matches[2]);
    }
    // Advance the line num counter
    lineNum++;
  }

  // Resolve all rules into rule sets
  // Check each rule cyclically removing resolved rule until not rules remain unresolved
  for (let r = 0; unresolvedRules.length > 0 || !rules.has(0); r++) {
    // Get the current rule
    let current = unresolvedRules[r % unresolvedRules.length];
    // Check if all of the numbers used in this rule have been resolved into the rules map
    let allMatch = true;
    for (let m = 0; m < current.allNumbers.length && allMatch; m++) {
      allMatch = rules.has(current.allNumbers[m]);
    }

    // If all rules have been resolved then resolve this rule and remove it
    if (allMatch) {
      // Resolve each part of the rule one at a time
      let allRulesParts = [];
      for (let p = 0; p < current.parts.length; p++) {
        // Add each number of the rule part to the result one at a time
        let rulePart = "";
        for (let c = 0; c < current.parts[p].length; c++) {
          // If this number is the same as the current rule the use the value
          // rom the previous part in the rule parts. This will handle the
          // "infinite" cycling for part2
          if (current.parts[p][c] === current.ruleNum)
            rulePart += allRulesParts[p - 1];
          // Otherwise pull the rule from the rules map
          else rulePart += rules.get(current.parts[p][c]);
        }
        // Add the completed rule part to the array
        allRulesParts.push(rulePart);
      }
      // Combine all of the rule parts in order into a new regex expression
      rules.set(current.ruleNum, `(${allRulesParts.join("|")})`);
      // Remove this from the unresolved rules list
      unresolvedRules.splice(r % unresolvedRules.length, 1);
    }
  }

  // Find matches
  // Get the regex for matching rule 0 and check all values tro see which one match
  let rule0Regex = new RegExp(`^${rules.get(0)}$`);
  let lines = fileContents.slice(lineNum);
  return lines.reduce((total, val) => {
    // If it matches the regex add 1 to the total
    let matches = val.match(rule0Regex);
    if (matches && matches.length > 0) total++;
    return total;
  }, 0);
};
