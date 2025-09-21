// Puzzle for Day 4: https://adventofcode.com/2018/day/4

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the input into an ordered array of observations
  let observations = parseInput(fileContents);

  // Convert the observations into maps of the minutes each guard is asleep
  // and how often they are asleep that minute
  let guards = getGuardsData(observations);

  // Find the results for each strategy
  let part1 = strategy1(guards);
  let part2 = strategy2(guards);

  return { part1: part1, part2: part2 };
};

// Find the result using strategy 2
const strategy2 = (guards) => {
  // Find the guard who is most frequently asleep on the same minute.
  // Track the number of times they are asleep on this minute, which
  // minute it is, and their ID
  let mostFreqGuard = 0;
  let mostFreqMinute = 0;
  let mostFreqCount = 0;

  // Check each guard
  guards.forEach((minutes, guard) => {
    // The most asleep minute
    let mostAsleepMin = -1;
    // The number of times the guard is asleep on this minute
    let mostAsleepCount = Number.MIN_SAFE_INTEGER;

    // Check each minute
    minutes.forEach((count, minute) => {
      // If this minute's count is higher than the highest seen
      if (count > mostAsleepCount) {
        mostAsleepCount = count;
        mostAsleepMin = minute;
      }
    });

    // If the most asleep minute count for this guard is higher than
    // the most frequent minute count found so far update the most
    // frequent info
    if (mostAsleepCount > mostFreqCount) {
      mostFreqCount = mostAsleepCount;
      mostFreqGuard = guard;
      mostFreqMinute = mostAsleepMin;
    }
  });

  // Return the result of multiplying the most frequent minute guard ID
  // with the most frequent minute for that guard
  return mostFreqGuard * mostFreqMinute;
};

// Find the result using strategy 1
const strategy1 = (guards) => {
  // Find the guard with the highest total. Then the minute
  // they are asleep the most and their ID
  let highestTotal = 0;
  let highestMin = 0;
  let highestId = 0;

  // Check each guard
  guards.forEach((minutes, guard) => {
    // The total minutes this guard is asleep
    let total = 0;
    // The minute this guard is asleep the most often
    let mostAsleepMin = -1;
    // The number of times the guard is asleep this minute
    let mostAsleepCount = Number.MIN_SAFE_INTEGER;

    // Examine each minute for this guard
    minutes.forEach((count, minute) => {
      // Update the total number of minutes asleep
      total += count;
      // If this count is higher than the highest most asleep count seen
      if (count > mostAsleepCount) {
        // Update the most asleep count and minute with this minute's values
        mostAsleepCount = count;
        mostAsleepMin = minute;
      }
    });

    // If this total is higher than the higest seen so far
    if (total > highestTotal) {
      // Update the highest vaklues with this guards info
      highestTotal = total;
      highestId = guard;
      highestMin = mostAsleepMin;
    }
  });

  // Return the result of multiplying the highest guards ID and
  // the minute they were asleep the most
  return highestMin * highestId;
};

// Convert the ordered observations into data maps of the
// guards sleeping patterns at each minute and how often
// they sleep on each minute
const getGuardsData = (observations) => {
  // Regex to get the guard ID
  let reg = new RegExp(/Guard #(\d+) begins shift/);
  // Resulting map of gaurd's sleeping pattern maps
  let guards = new Map();

  // The current guard and the start time of the next sleep
  let current = -1;
  let start = null;

  // Read each observation in order one by one
  for (let obs of observations) {
    // If a new guard started their shift
    if (obs.event.startsWith("Guard")) {
      // Get the guard ID and set current to their ID. Also create
      // the guard an empty map if one does not already exist
      current = parseInt(obs.event.match(reg)[1]);
      if (!guards.has(current)) {
        guards.set(current, new Map());
      }
    }
    // Else if the guard falls asleep set start to the time in this observation
    else if (obs.event === "falls asleep") {
      start = obs.time;
    }
    // Else if the guard wakes up update the guards sleep minutes map with the time span
    else if (obs.event === "wakes up") {
      // The minutes map for this guard
      let minutes = guards.get(current);

      // Add each minute the guard is asleep tio the map
      for (let x = start.getMinutes(); x < obs.time.getMinutes(); x++) {
        // If this minute is not in the map add it with a value of 1
        if (!minutes.has(x)) {
          minutes.set(x, 1);
        }
        // Else update the minute to be the current value + 1
        else {
          let temp = minutes.get(x);
          minutes.set(x, temp + 1);
        }
      }
      // Update the guards minute map
      guards.set(current, minutes);
    }
  }

  return guards;
};

// Parse the observations into an ordered array of observation objects
const parseInput = (fileContents) => {
  // Regex for parsing each line into times and events
  let reg = new RegExp(
    /\[(\d+-\d+-\d+ \d+:\d+)\] (wakes up|falls asleep|Guard #\d+ begins shift)/,
  );
  // Resulting unordered observations
  let observations = [];

  // User regex to parse each observation into an object with
  // a date object and an event string
  for (let line of fileContents) {
    let matches = line.match(reg);
    observations.push({
      time: new Date(matches[1].replace(" ", "T")),
      event: matches[2],
    });
  }
  // Sort the observations by date in ascending order
  bubbleSort(observations);
  return observations;
};

// Basic bubble sorting algorithm
const bubbleSort = (array) => {
  for (let x = 0; x < array.length - 1; x++) {
    for (let y = 0; y < array.length - x - 1; y++) {
      if (array[y].time.getTime() > array[y + 1].time.getTime())
        swap(array, y, y + 1);
    }
  }
};

// Basic swap method
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
};
