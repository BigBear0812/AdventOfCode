// Puzzle for Day 19: https://adventofcode.com/2023/day/19

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse workflows into a map of arrays with rules and results of passing each rule
  let workflows = new Map();
  let l = 0;
  // Continue processing each line of the input until hitting and empty line
  while (fileContents[l] != "") {
    // Get the name of the workflow and all workflow rules
    let matches = fileContents[l].match(/([a-z]+){([a-zA-Z><\d:,]+)}/);
    let name = matches[1];
    // Parse the rules into an array of rule and result objects
    let rules = matches[2].split(",").map((i) => {
      let parts = i.split(":");
      return { rule: parts[0], result: parts[1] };
    });
    workflows.set(name, rules);
    l++;
  }

  // Parse parts into objects with the x m a s values from the input
  let parts = [];
  l++;
  while (l < fileContents.length) {
    // Get all of the parts data
    let partData = fileContents[l].match(/{([a-z=\d,]+)}/)[1].split(",");
    let x, m, a, s;
    // Evaluate each statement to set the x m a s values
    for (let pd of partData) {
      eval(pd);
    }
    // Create a new part object with these values.
    parts.push({ x, m, a, s });
    l++;
  }

  // Part 1
  // Process each part from the input through the workflow
  // saving the accepted parts inb the array
  let accepted = [];
  for (let part of parts) {
    // Put the values of the part into the current context so eval
    // statements will be able to work on them
    let x = part.x;
    let m = part.m;
    let a = part.a;
    let s = part.s;
    // Track if this has completed and what workflow it is currently in
    let completed = false;
    let workflow = "in";
    // Continue until the part has completed by being accepted or rejected
    while (!completed) {
      // Get the rules for the current workflow and process them in order
      let rules = workflows.get(workflow);
      for (let r of rules) {
        // If this is not a terminal rule the evaluate the expression
        if (r.result != undefined) {
          let ruleResult = eval(r.rule);
          // If true check for a base case result or assign it to it's new workflow.
          // Either way break out to stop processing this workflow
          if (ruleResult == true) {
            if (r.result === "A") {
              accepted.push(part);
              completed = true;
              break;
            } else if (r.result === "R") {
              completed = true;
              break;
            } else {
              workflow = r.result;
              break;
            }
          }
        }
        // Otherwise this is a terminal rule. Check for a base case rule or assign
        // it to it's new workflow. Either way break out to stop processing this workflow
        else {
          if (r.rule === "A") {
            accepted.push(part);
            completed = true;
            break;
          } else if (r.rule === "R") {
            completed = true;
            break;
          } else {
            workflow = r.rule;
            break;
          }
        }
      }
    }
  }
  // Total up all the parts and all their values to get the part 1 solution
  let result1 = accepted.reduce(
    (total, part) => (total += part.x + part.m + part.a + part.s),
    0,
  );

  // Part 2
  // Using the starting case defined in the problem use Breadth First Search (BFS) to
  // search through and find all possible accepted states
  let start = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
    workflow: "in",
  };
  // Create a queue of states that still need to be checked starting with the initial state
  let queue = [];
  queue.push(start);
  // Keep track of all accepted states and continue processing until no more states are left to check
  let acceptedStates = [];
  while (queue.length > 0) {
    // Get the next state to check from the front of the queue
    let current = queue.shift();
    // Check base cases to see if this state has reached it's end
    if (current.workflow === "A") {
      acceptedStates.push(current);
      continue;
    } else if (current.workflow === "R") continue;

    // Get the rules for the current workflow and process each rule adding new states
    // to the queue for each new path outside this workflow that comes up.
    let rules = workflows.get(current.workflow);
    for (let r of rules) {
      // If this is not a terminal rule get a new state from the current one that
      // satisfies the condition. Update the current state to not satisfy the condition.
      // The current state will continue until reaching the terminal rule of this workflow.
      if (r.result != undefined) {
        // Get the rule information
        let param = r.rule.charAt(0);
        let operation = r.rule.charAt(1);
        let value = parseInt(r.rule.substring(2));
        // Generate a new state from the current one
        let newState = JSON.parse(JSON.stringify(current));
        // For each type of operation set the new state values to satisfy it and the
        // current state to not satisfy it.
        if (operation == ">") {
          if (newState[param].min <= value) {
            newState[param].min = value + 1;
            newState.workflow = r.result;
            queue.push(newState);
          }
          if (current[param].max > value) {
            current[param].max = value;
          }
        } else if (operation == "<") {
          if (newState[param].max >= value) {
            newState[param].max = value - 1;
            newState.workflow = r.result;
            queue.push(newState);
          }
          if (current[param].min < value) {
            current[param].min = value;
          }
        }
      }
      // This is a terminal rule. Update the workflow of the current state and readd it to the queue.
      else {
        current.workflow = r.rule;
        queue.push(current);
      }
    }
  }

  // Once all accepted states have been found get the total of the number of possible
  // values represented by all of the states. This is the solution for part 2
  let result2 = acceptedStates.reduce(
    (total, state) =>
      (total +=
        (state.x.max - state.x.min + 1) *
        (state.m.max - state.m.min + 1) *
        (state.a.max - state.a.min + 1) *
        (state.s.max - state.s.min + 1)),
    0,
  );

  return { part1: result1, part2: result2 };
};
