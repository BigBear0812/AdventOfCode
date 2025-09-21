// Puzzle for Day 16: https://adventofcode.com/2020/day/16

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Get the first section that defines rules
  let firstSectionIndex = fileContents.indexOf("");
  let section1 = fileContents.splice(0, firstSectionIndex + 1);
  section1 = section1.filter((x) => x !== "");
  // Get the second section that defines you ticket info
  let secondSectionIndex = fileContents.indexOf("");
  let section2 = fileContents.splice(0, secondSectionIndex + 1);
  section2 = section2.filter((x) => x !== "" && x !== "your ticket:");
  // Get the last section that defines the nearby tickets
  let section3 = fileContents.filter((x) => x !== "nearby tickets:");
  let rules = [];
  let yourTicket;
  let nearbyTickets = [];

  // Parse each section from the string inputs into useable data
  for (let rule of section1) {
    let matches = rule.match(/([a-z\s]+): (\d+)-(\d+) or (\d+)-(\d+)/);
    rules.push({
      name: matches[1],
      ranges: [
        {
          low: parseInt(matches[2]),
          high: parseInt(matches[3]),
        },
        {
          low: parseInt(matches[4]),
          high: parseInt(matches[5]),
        },
      ],
    });
  }
  for (let line of section2) {
    yourTicket = line.split(",").map((x) => parseInt(x));
  }
  for (let line of section3) {
    nearbyTickets.push(line.split(",").map((x) => parseInt(x)));
  }

  // Part 1
  let result1 = 0;
  // Track which tickets are valid for part 2
  let validTickets = [];
  for (let n = 0; n < nearbyTickets.length; n++) {
    // Get the current ticket being examined
    let near = nearbyTickets[n];
    // Keep track of the value info for each value of the ticket until it
    // is known if the ticket is valid or not
    let potentialTicket = [];
    let valid = true;
    // Examine each value
    for (let v = 0; v < near.length; v++) {
      // Get the current value and find out which rules potentially apply to it
      let val = near[v];
      let possibleRules = [];
      // Check each rule
      for (let rule of rules) {
        // If the value is within range then add the name of the rule to the possible rules list
        if (
          (val >= rule.ranges[0].low && val <= rule.ranges[0].high) ||
          (val >= rule.ranges[1].low && val <= rule.ranges[1].high)
        ) {
          possibleRules.push(rule.name);
        }
      }
      // If no rules then this value and the ticket are invalid
      if (possibleRules.length === 0) {
        result1 += val;
        valid = false;
      }
      // Otherwise add this value info object to the potential ticket array
      else {
        potentialTicket.push({
          val: val,
          rules: possibleRules,
        });
      }
    }
    // If the entire ticket is valid add it to the valid tickets array
    if (valid) validTickets.push(potentialTicket);
  }

  // Part 2
  // Find which rules potentially apply to each field of the ticket.
  // Since many rules will apply to many of the fields we will narrow
  // it down more later and for now just track all possibilities.
  let ticketOrder = [];
  // Check each field in order
  for (let x = 0; x < yourTicket.length; x++) {
    // The potential rule names for this field
    let potentialNames = validTickets[0][x].rules;
    // Check this field for each ticket
    for (
      let y = 1;
      y < validTickets.length && potentialNames.length !== 1;
      y++
    ) {
      // Find which names that are in the current set of possibilities and that are
      // not in this tickets rules set for this field. These will need to be eliminated
      // as possibilities for this field since they do not fit.
      let potentialNameToEliminate = [];
      for (let n = 0; n < potentialNames.length; n++) {
        if (validTickets[y][x].rules.indexOf(potentialNames[n]) === -1) {
          potentialNameToEliminate.push(n);
        }
      }
      // Eliminate potential names that do not fit
      for (let n = potentialNameToEliminate.length - 1; n >= 0; n--) {
        potentialNames.splice(potentialNameToEliminate[n], 1);
      }
    }
    // Push the list of all possibilities into the ticket order array
    ticketOrder.push(potentialNames);
  }

  // The name possibilities will be arranged such that names can be eliminated
  // from all columns once it is determined they fit a specific column. This
  // will give the final order of the values on the ticket.
  let ticketFinalOrder = new Array(ticketOrder.length).fill("");
  // Run through all fields the the number of times that there are fields
  // since only one name can be eliminated each round.
  for (let r = 0; r < ticketOrder.length; r++) {
    // Find the current word to eliminate from all other possibilities
    let wordToEliminate;
    // Check each set of possible names
    for (let n = 0; n < ticketOrder.length; n++) {
      // Find the set of names that only has one option in it this round
      if (ticketOrder[n].length === 1) {
        // Get this name and add it to the final ticket order
        wordToEliminate = ticketOrder[n][0];
        ticketFinalOrder[n] = wordToEliminate;
      }
    }
    // Eliminate this name from all other lists of possibilities
    ticketOrder.map((x) => {
      if (x.length > 0) {
        let index = x.indexOf(wordToEliminate);
        x.splice(index, 1);
      }
    });
  }

  // With the names for each value of your ticket determined multiply together
  // all those that start with departure to get the result for part 2.
  let result2 = ticketFinalOrder.reduce((output, val, index) => {
    if (val.startsWith("departure")) output *= yourTicket[index];
    return output;
  }, 1);

  return { part1: result1, part2: result2 };
};
