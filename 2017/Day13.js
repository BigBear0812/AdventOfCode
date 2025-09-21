// Puzzle for Day 13: https://adventofcode.com/2017/day/13

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the input into a scanner info objects array
  let scanners = parseInput(fileContents);

  // Find the severity score of crossing without a time deplay
  let score = severityScore(scanners, 0);

  // Find the time delay required to not get caught
  let timeToDelay = delayTime(scanners);

  return { part1: score, part2: timeToDelay };
};

// Find the time delay required to not get caught
const delayTime = (scanners) => {
  // The final severity score of being caught
  let finalScore;
  // The inital time value to count 0 as the starting time to check
  let t = -1;
  do {
    // Add one to the time and get the new severity score
    t++;
    finalScore = severityScore(scanners, t);
  } while (
    // Continue searching if this severity score is not null
    finalScore !== null
  );

  return t;
};

// Find the severity score of crossing at the given time delay
const severityScore = (scanners, startTime) => {
  // Score starts at null and null indicates not caught since being caught
  // by the first scanner indicates 0 as the score.
  let score = null;

  // Check each scanner and see if they have caught the packet on this trip
  for (let scanner of scanners) {
    // Calculate the position of the scanner at the time the packet crosses.
    // Start time plus position of the scanner give the time that the packet
    // crosses that scanner. Modulus that by the range minus tw to account
    // for the repeating pattern and not to double count either end of that pattern.
    let positionAtTime =
      (startTime + scanner.position) % (scanner.range * 2 - 2);
    // Add to the score if the position that the firewall is being crossed at
    // which is always 0 for this problem equals the scanner position
    if (positionAtTime === 0) score += scanner.position * scanner.range;
  }

  return score;
};

// Parse the input into a scanner info objects array
const parseInput = (fileContents) => {
  // Regex for extract all digits from a given line in order
  let reg = new RegExp(/(\d+)/g);
  // the resulting array of scanners
  let scanners = [];

  // Parse each line one at a time
  for (let line of fileContents) {
    // Find all numbers on a line
    let matches = line.match(reg);
    // Add a new scanner with the first number being the position
    // and the second number being its scanning range and parsing
    // the values to integers
    scanners.push({
      position: parseInt(matches[0]),
      range: parseInt(matches[1]),
    });
  }

  return scanners;
};
