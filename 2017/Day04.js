// Puzzle for Day 4: https://adventofcode.com/2017/day/4

export const run = (fileContents) => {
  // Parse in each pass phrase into a word seperated array
  let passPhrases = [];
  for (let line of fileContents) {
    passPhrases.push(line.split(" "));
  }

  // Find the number of valid pass phrases for each part
  let result1 = countValid(passPhrases);
  let result2 = countValid(passPhrases, true);

  return { part1: result1, part2: result2 };
};

const countValid = (passPhrases, sort = false) => {
  // The number of valid pass phrases
  let validCount = 0;
  // Check each pass phrase
  for (let passPhrase of passPhrases) {
    // Start out assuming this is valid
    let valid = true;
    // If this is Part 2 sort each word of the passpharse alphabetcally
    if (sort) {
      for (let x = 0; x < passPhrase.length; x++) {
        passPhrase[x] = passPhrase[x].split("").sort().join("");
      }
    }
    // Check every word against every other word of the passpharse looking for matches
    for (let x = 0; x < passPhrase.length && valid; x++) {
      for (let y = x + 1; y < passPhrase.length && valid; y++) {
        // If this is not a match then this passpharse continues to be valid
        valid = passPhrase[x] !== passPhrase[y];
      }
    }
    // If all words have been checked and it is still valid add one to the count
    if (valid) validCount++;
  }

  return validCount;
};
