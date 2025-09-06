// Puzzle for Day 06: https://adventofcode.com/2020/day/6

export const run = (fileContents) => {
  // Keep track of the current groups letters that anyone has using a set
  let groupSet = new Set();
  // Keep track of the current groups letters that everyone has using a map
  let groupMap = new Map();
  // Keep track of the group's size
  let groupSize = 0;
  // Keep track of all groups info
  let groups = [];

  // Parse each line of the file one at a time
  for (let line of fileContents) {
    // A blank line separates the groups
    if (line === "") {
      // Add the group info
      groups.push({
        // Get an array from the set
        anyLetters: Array.from(groupSet),
        // Get an array of all map letters where the count matches the group size
        allLetters: Array.from(groupMap)
          .filter((g) => g[1] === groupSize)
          .map((g) => g[0]),
      });
      // Reset all group tracking
      groupSet = new Set();
      groupMap = new Map();
      groupSize = 0;
    }
    // Process an individuals responses
    else {
      // Split all letters for this individual
      let letters = line.split("");
      // Add each letter to the group buffers
      for (let l of letters) {
        // Update the set and map with this new letter
        groupSet.add(l);
        if (groupMap.has(l)) groupMap.set(l, groupMap.get(l) + 1);
        else groupMap.set(l, 1);
      }
      // Update the group size
      groupSize++;
    }
  }

  // Add the remaining info in the buffers to the group info
  groups.push({
    anyLetters: Array.from(groupSet),
    allLetters: Array.from(groupMap)
      .filter((g) => g[1] === groupSize)
      .map((g) => g[0]),
  });

  // Get the sum of all groups any letters array lengths
  let result1 = groups.reduce(
    (total, current) => (total += current.anyLetters.length),
    0,
  );
  // Get the sum of all groups all letters array lengths
  let result2 = groups.reduce(
    (total, current) => (total += current.allLetters.length),
    0,
  );

  return { part1: result1, part2: result2 };
};
