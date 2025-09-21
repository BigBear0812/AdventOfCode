// Puzzle for Day 7: https://adventofcode.com/2018/day/7

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse input into a map of steps containing what comes before,
  // after, and the time to complete the step
  let steps = parseInput(fileContents, 61);

  // Solve for each part of the puzzle
  let result1 = findTheStepOrder(steps, 1);
  let result2 = findTheStepOrder(steps, 5);

  return { part1: result1.order.join(""), part2: result2.totalTime };
};

const findTheStepOrder = (steps, workers) => {
  // The next possible steps to consider
  let nextPossible = [];
  // Add all possible starting steps that have no steps before them to the next possible
  steps.forEach((val, key) => {
    if (val.before.length === 0) nextPossible.push(key);
  });
  // Sort the next steps alphabetically
  nextPossible.sort();

  // Create an array to hold all of the currently working steps
  let current = [];
  // Create an array to hold the final step order
  let order = [];

  // Add all next possible steps that will fit in order to the current array
  // and remove them from the next possible array
  while (current.length < workers && nextPossible.length > 0) {
    let step = nextPossible.shift();
    current.push({ step, timeLeft: steps.get(step).time });
  }

  // Keep track of which step finishes next and the total time elapsed
  let nextFinished;
  let totalTime = 0;

  do {
    // Find the next step to finish from the current array based on each step's time left
    let lowestTimeLeft = Number.MAX_SAFE_INTEGER;
    for (let x = 0; x < current.length; x++) {
      if (current[x].timeLeft < lowestTimeLeft) {
        lowestTimeLeft = current[x].timeLeft;
        nextFinished = current[x];
      }
    }

    // Add the lowest time left found to the total time
    totalTime += lowestTimeLeft;
    // Remove the next step to finish from the current array
    current = current.filter((x) => x.step !== nextFinished.step);
    // Remove the elapsed time from the time left for each currently working step
    current.forEach((x) => (x.timeLeft -= lowestTimeLeft));
    // Add the next finished to the resulting order
    order.push(nextFinished.step);
    // Get the next steps from the next finished to be added to the next possible
    let finishedNext = steps.get(nextFinished.step).after;
    if (finishedNext !== undefined) {
      // Add all next steps for the next finished to the next possible
      // only if they are not already in the array and all of it's
      // before steps have been completed
      for (let next of finishedNext) {
        // If not already in the next possible and all of its before steps have been completed
        if (
          nextPossible.indexOf(next) === -1 &&
          steps.get(next).before.filter((c) => order.indexOf(c) === -1)
            .length === 0
        ) {
          nextPossible.push(next);
        }
      }
      // Sort the next possible array alphabetically
      nextPossible.sort();
    }

    // Add all next possible steps that will fit in order to the current array
    // and remove them from the next possible array
    while (current.length < workers && nextPossible.length > 0) {
      let step = nextPossible.shift();
      current.push({ step, timeLeft: steps.get(step).time });
    }
  } while (
    // Continue while the next finished step has steps after it or the next possible
    // array still has steps to process
    steps.get(nextFinished.step).after.length > 0 ||
    nextPossible.length > 0
  );

  return { order, totalTime };
};

// Parse input into a map of steps containing what comes before,
// after, and the time to complete the step
const parseInput = (fileContents, timeOffset) => {
  // Alphabet for finding the unique time for each step
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  // Regex for extracting critical values
  let reg = new RegExp(
    /Step ([A-Z]) must be finished before step ([A-Z]) can begin./,
  );
  // Resulting step map
  let steps = new Map();

  for (let line of fileContents) {
    // Find the critical info for each line
    let matches = line.match(reg);

    // Build the step after information for the step
    if (steps.has(matches[1])) {
      let step = steps.get(matches[1]);
      step.after.push(matches[2]);
      steps.set(matches[1], step);
    } else {
      steps.set(matches[1], {
        after: [matches[2]],
        before: [],
        time: timeOffset + alphabet.indexOf(matches[1]), // Time is based on the alphabet position plus the standard offset
      });
    }

    // Build the before information for the step
    if (steps.has(matches[2])) {
      let step = steps.get(matches[2]);
      step.before.push(matches[1]);
      steps.set(matches[2], step);
    } else {
      steps.set(matches[2], {
        after: [],
        before: [matches[1]],
        time: timeOffset + alphabet.indexOf(matches[2]), // Time is based on the alphabet position plus the standard offset
      });
    }
  }

  return steps;
};
