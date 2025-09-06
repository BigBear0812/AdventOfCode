// Puzzle for Day 07: https://adventofcode.com/2020/day/7

export const run = (fileContents) => {
  // Store a map of the bag info from the input
  let bagsMap = new Map();

  // Parse each line as a new rule in the bagsMap
  for (let line of fileContents) {
    // Extract the bag rule info using a combo of string splits and regex
    let ruleInfo = line.split("contain");
    let ruleBag = ruleInfo[0].trim().match(/([A-z\s]+) bags*/)[1];
    let ruleContents = ruleInfo[1]
      .trim()
      .split(", ")
      .map((ri) => {
        // Parse the number and type of each bag this bag must contain
        let matches = ri.match(/(\d+) ([A-z\s]+) bags*/);
        if (matches == null) return null;
        return {
          count: parseInt(matches[1]),
          type: matches[2],
        };
      });
    // Add this rule to the bags map
    bagsMap.set(ruleBag, ruleContents);
  }

  // Part 1
  let bagKeys = ["shiny gold"];
  // Keep a set of the bag type that each may contain a shiny gold bag
  let result1 = new Set();
  // Starting with a shiny gold bag do a Breadth First Search (BFS)
  // to find all of the bags that may contain this shiny gold one
  // and have not yet been seen
  while (bagKeys.length > 0) {
    let currentKey = bagKeys.shift();
    bagsMap.forEach((contents, bag) => {
      // Consider this bag if it has the current bag key in it and it is not yet in the results set
      if (
        contents &&
        contents.find((bc) => bc && bc.type === currentKey) &&
        !result1.has(bag)
      ) {
        bagKeys.push(bag);
        result1.add(bag);
      }
    });
  }

  // Part 2
  // Keep track of what bags have their inner bag count resolved
  // and which bag keys can be removed this round
  let resolvedBags = new Map();
  let keysToRemove = [];

  // Start by finding all bags that contain no other bags and add them to the resolved bags map
  bagsMap.forEach((value, key) => {
    if (value.length === 1 && value[0] === null) {
      keysToRemove.push(key);
      resolvedBags.set(key, 0);
    }
  });

  // Remove these bag keys from the bags map so we do not reconsider them
  keysToRemove.forEach((bag) => {
    bagsMap.delete(bag);
  });
  keysToRemove = [];

  // While there are still bags to consider and the shiny gold bag has not been resolved
  while (bagsMap.size > 0 && resolvedBags.get("shiny gold") === undefined) {
    // Consider reach remaining bag in the bagsMap to see if it can be resolved and removed
    bagsMap.forEach((value, key) => {
      // Get the total inner count and if this bag is valid to be resolved
      let bagTotal = 0;
      let valid = true;
      value.forEach((innerBag) => {
        // Add to the total if the inner bag for this one has been resolved
        // otherwise it is not valid to be resolved
        let bagCount = resolvedBags.get(innerBag.type);
        if (valid && bagCount !== undefined) {
          bagTotal += bagCount * innerBag.count + innerBag.count;
        } else {
          valid = false;
        }
      });
      // If it can be resolved the add it to the new map and add the key to be removed
      if (valid) {
        resolvedBags.set(key, bagTotal);
        keysToRemove.push(key);
      }
    });

    // Remove these bag keys from the bags map so we do not reconsider them
    keysToRemove.forEach((bag) => {
      bagsMap.delete(bag);
    });
    keysToRemove = [];
  }

  // Get the number of inner bags for the shiny gold bag from the resolved map
  let result2 = resolvedBags.get("shiny gold");

  return { part1: result1.size, part2: result2 };
};
