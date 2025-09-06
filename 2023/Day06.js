// Puzzle for Day 06: https://adventofcode.com/2023/day/6

export const run = (fileContents) => {
  // Get the solutions for each part
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

/**
 * The Solution for Part 2
 * @param {string[]} fileContents The lines of the input file as an array
 * @returns Solution value
 */
const part2 = (fileContents) => {
  // Get the joined time and distance values
  let time = parseInt(
    fileContents[0].match(/([\d\s]+)/)[1].replaceAll(" ", ""),
  );
  let distance = parseInt(
    fileContents[1].match(/([\d\s]+)/)[1].replaceAll(" ", ""),
  );

  // Check for winning distances starting from 1 and going up until a winning distance
  // is found. This is the lower boundary of the winning times
  let lowerBound = null;
  for (let holdTime = 1; holdTime < time && !lowerBound; holdTime++) {
    let curDistance = (time - holdTime) * holdTime;
    if (curDistance > distance) lowerBound = holdTime;
  }

  // Check for winning distances starting from time - 1 and going down until a winning distance
  // is found. This is the upper boundary of the winning times
  let upperBound = null;
  for (let holdTime = time - 1; holdTime < time && !upperBound; holdTime--) {
    let curDistance = (time - holdTime) * holdTime;
    if (curDistance > distance) upperBound = holdTime;
  }

  // The number of possible winning hold times is anytime between and including the upper and lower bounds
  return upperBound - lowerBound + 1;
};

/**
 * The Solution for Part 1
 * @param {string[]} fileContents The lines of the input file as an array
 * @returns Solution value
 */
const part1 = (fileContents) => {
  // Get all of the times and distances
  let times = Array.from(fileContents[0].matchAll(/(\d+)/g)).map((x) =>
    parseInt(x[1]),
  );
  let distances = Array.from(fileContents[1].matchAll(/(\d+)/g)).map((x) =>
    parseInt(x[1]),
  );

  // Convert times and distances into race objects
  let races = [];
  for (let r = 0; r < times.length; r++) {
    // The count of winning distances
    let winningDistances = 0;
    // Check each possible hold time and see if the resulting distance will win
    for (let holdTime = 1; holdTime < times[r]; holdTime++) {
      let distance = (times[r] - holdTime) * holdTime;
      if (distance > distances[r]) winningDistances++;
    }
    // Add to the races object
    races.push({
      time: times[r],
      distances: distances[r],
      winningDistances,
    });
  }

  // Multiply all winning possibilities together
  return races.reduce((total, race) => (total *= race.winningDistances), 1);
};
