// Puzzle for Day 21: https://adventofcode.com/2022/day/21

export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

const part1 = (fileContents) => {
  // Parse file contents
  let monkeys = parseInput(fileContents);

  // Evaluate monkeys using recursion to get the result of root
  let result = evaluateMonkeys(monkeys, "root", new Map());

  return result;
};

const part2 = (fileContents) => {
  // Parse file contents
  let monkeys = parseInput(fileContents);

  // Update the expression for root and humn due to the mistranslation
  let reg = new RegExp(/([a-z]+) ([+\-*/]) ([a-z]+)/);
  let rootExp = monkeys.get("root");
  let matches = rootExp.match(reg);
  let monkey1 = matches[1];
  let monkey2 = matches[3];
  monkeys.set("root", monkey1 + " = " + monkey2);
  monkeys.set("humn", "undefined");

  // Evaluate the monkeys to get the value of root.
  // This will also populate the resolved monkeys
  // and create the reversed monkeys to allow
  // finding the value of humn.
  let reversedMonkeys = new Map();
  let resolvedMonkeys = new Map();
  evaluateMonkeys(monkeys, "root", resolvedMonkeys, reversedMonkeys);

  // Remove the entries of undefined and NaN since
  // these are not valid and are only generated as
  // part of creating the other maps
  resolvedMonkeys.forEach((value, key, map) => {
    if (typeof value === undefined || isNaN(value)) map.delete(key);
  });

  // Combine the reveresed monkey equations with the
  // original monkey equations so the everything can
  // complete correctly when finding the value of humn
  reversedMonkeys.forEach((value, key) => {
    monkeys.set(key, value);
  });

  // Evaluate this new set of equations and resolved values using recursion to find the value of humn
  let result = evaluateMonkeys(monkeys, "humn", resolvedMonkeys);

  return result;
};

// Parse the input into a map of key value pairs. Some pairs
// will be value and some expressions to be evaluated
const parseInput = (fileContents) => {
  let reg = new RegExp(/([a-zA-Z]+): (.+)/);
  let monkeys = new Map();
  for (const line of fileContents) {
    let matches = line.match(reg);
    let key = matches[1];
    let expression = matches[2];
    monkeys.set(key, expression);
  }
  return monkeys;
};

// Use recusion to evaluate just the expressions needed to find the output value
const evaluateMonkeys = (
  monkeys,
  monkeyKey,
  resolvedMonkeys,
  reversedMonkeys,
) => {
  // Regex for parsing expressions out of the value for the current monkey key
  let reg = new RegExp(/([a-z\-\d]+) ([+\-*/=]) ([a-z\-\d]+)/);
  let monkey = monkeys.get(monkeyKey);
  let matches = monkey.match(reg);

  // If this does not have any matches then this is assumed to be a number value.
  // Evaluate this value. Then save it into the resolved monkeys map to cut down
  // on future recussion and return the value.
  if (!matches) {
    let val = eval(monkey);
    resolvedMonkeys.set(monkeyKey, val);
    return val;
  }
  // If this does match the regex then it is an expression
  else {
    let monkey1 = matches[1];
    let monkey2 = matches[3];
    let operator = matches[2];
    let monkey1Val;
    let monkey2Val;
    // Check each value separately. If it has already been resolved then return that
    // value. If not then try to parse it as a int if it is a number. Finally use
    // recursion to finds the value and return it.
    if (resolvedMonkeys.has(monkey1)) monkey1Val = resolvedMonkeys.get(monkey1);
    else if (parseInt(monkey1)) monkey1Val = parseInt(monkey1);
    else
      monkey1Val = evaluateMonkeys(
        monkeys,
        monkey1,
        resolvedMonkeys,
        reversedMonkeys,
      );
    if (resolvedMonkeys.has(monkey2)) monkey2Val = resolvedMonkeys.get(monkey2);
    else if (parseInt(monkey2)) monkey2Val = parseInt(monkey2);
    else
      monkey2Val = evaluateMonkeys(
        monkeys,
        monkey2,
        resolvedMonkeys,
        reversedMonkeys,
      );

    // Check if the reversed monkey map is being used. If it is then check if either
    // value is undefined. This means we have hit an unknown base case we will have
    // to sovle for later. This only happens with the updated humn value for Part 2
    if (reversedMonkeys) {
      // If the first monkey value is not defined
      if (!monkey1Val) {
        // If the operator is = then this means the second monkey value must have
        // resolved. Set the resovled values in the resolved map and return it
        if (operator === "=") {
          resolvedMonkeys.set(monkeyKey, monkey2Val);
          resolvedMonkeys.set(monkey1, monkey2Val);
          return monkey2Val;
        }
        // If not then reverse the equaltion so that the first monkey is the key
        // to solve for and add it to the reversed map
        else {
          let reversedOperator = reverseOperator(operator);
          let reversedExp = monkeyKey + " " + reversedOperator + " " + monkey2;
          reversedMonkeys.set(monkey1, reversedExp);
        }
      } else if (!monkey2Val) {
        // If the operator is = then this means the first monkey value must have
        // resolved. Set the resovled values in the resolved map and return it
        if (operator === "=") {
          resolvedMonkeys.set(monkeyKey, monkey1Val);
          resolvedMonkeys.set(monkey2, monkey1Val);
          return monkey1Val;
        }
        // If not then reverse the equaltion so that the second monkey is the key
        // to solve for and add it to the reversed map. In this case this requires
        // some extra steps to properly rearrange subtration and division operations.
        else {
          let reversedOperator = reverseOperator(operator);
          let reversedExp = "";
          if (reversedOperator === "+")
            reversedExp = monkey1Val + " - " + monkeyKey;
          else if (reverseOperator === "*")
            reversedExp = monkeyKey + " * " + 1 / monkey1Val;
          else reversedExp = monkeyKey + " " + reversedOperator + " " + monkey1;
          reversedMonkeys.set(monkey2, reversedExp);
        }
      }
    }
    // Once the values for this expression have been resolved evaluate the expression,
    // add the result to the resolved set, and return it up the tree.
    let monkeyVal = eval(monkey1Val + " " + operator + " " + monkey2Val);
    resolvedMonkeys.set(monkeyKey, monkeyVal);
    return monkeyVal;
  }
};

// A simple method to give the opposite operator for the given operation
// except in the case of =
const reverseOperator = (operator) => {
  if (operator === "+") return "-";
  if (operator === "-") return "+";
  if (operator === "*") return "/";
  if (operator === "/") return "*";
};
