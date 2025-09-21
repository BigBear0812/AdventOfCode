// Puzzle for Day 15: https://adventofcode.com/2016/day/15

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the disc info from the
  let discs = parseInput(fileContents);

  // Find the time to drop the capsule so it passes through perfectly
  let time1 = findTimeToDropCapsule(discs);

  // Add another disc for Part 2
  discs.push({
    discNum: discs[discs.length - 1].discNum + 1,
    numPositions: 11,
    startPosition: 0,
  });

  // Find the time to drop the capsule so it passes through perfectly
  let time2 = findTimeToDropCapsule(discs);

  return { part1: time1, part2: time2 };
};

// Find the time to drop the capsule so it passes through the discs perfectly
const findTimeToDropCapsule = (discs) => {
  // The resulting time to drop is unknown to start
  let time = null;
  // Test each time starting at 0
  for (let t = 0; time === null; t++) {
    // The value of the last result. The goal is for this number to always be zero.
    // If a non-zero comes up then this is not the time to drop
    let lastResult = 0;
    // Check each disc to see if it will hit
    for (let d = 0; d < discs.length && lastResult === 0; d++) {
      // See if this discs will hit or allow it to pass
      let disc = discs[d];
      lastResult = (disc.startPosition + t + disc.discNum) % disc.numPositions;
    }
    // If all discs were 0 then this is the time to drop.
    if (lastResult === 0) time = t;
  }
  return time;
};

// Parse the inoput text into discs objects
const parseInput = (fileContents) => {
  // Reegex for parsing each line
  let reg = new RegExp(
    /Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)./,
  );
  // Resulting set of discs
  let discs = [];

  // Parse each disc using the regex to get the disc number, number of positions the disc has,
  // and the starting position of the disc
  for (let line of fileContents) {
    let matches = line.match(reg);

    discs.push({
      discNum: parseInt(matches[1]),
      numPositions: parseInt(matches[2]),
      startPosition: parseInt(matches[3]),
    });
  }

  return discs;
};
