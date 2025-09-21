// Puzzle for Day 2: https://adventofcode.com/2018/day/2

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Find the answer for each part of the puzzle
  let part1 = findPart1(fileContents);
  let part2 = findPart2(fileContents);

  return { part1: part1, part2: part2 };
};

// Find the answer for part 2
const findPart2 = (fileContents) => {
  // The similar letters found ebtween the 2 words being compared
  let similar = [];

  // Loop through the set of lines comparing them each together.
  // Stop compariong if a similar set is found to be off by only one
  for (
    let a = 0;
    a < fileContents.length && similar.length !== fileContents[0].length - 1;
    a++
  ) {
    for (
      let b = a + 1;
      b < fileContents.length && similar.length !== fileContents[0].length - 1;
      b++
    ) {
      // Set the similar matching letters to a new empty array
      similar = [];
      // Sompare each letter in each position between each line
      for (let x = 0; x < fileContents[a].length; x++) {
        // If the letters match add the letter to the similar array
        if (fileContents[a][x] === fileContents[b][x])
          similar.push(fileContents[a][x]);
      }
    }
  }

  // Return the letters and join them together into a single string
  return similar.join("");
};

// Find the answer for part 1
const findPart1 = (fileContents) => {
  // The count of the lines with two and three character matching letters
  let twoCount = 0;
  let threeCount = 0;

  // Check each line
  for (let line of fileContents) {
    // Sets for the letters that are found both two and three times exactly in the line
    let hasTwo = new Set();
    let hasThree = new Set();

    // Find the letters that match 3 times in the line
    for (let a = 0; a < line.length; a++) {
      for (let b = a + 1; b < line.length; b++) {
        for (let c = b + 1; c < line.length; c++) {
          if (
            line[a] === line[b] &&
            line[b] === line[c] &&
            !hasThree.has(line[a])
          )
            hasThree.add(line[a]);
        }
      }
    }

    // Find the letters that match 2 times in the line that are not already found to match 3 times
    for (let a = 0; a < line.length; a++) {
      for (let b = a + 1; b < line.length; b++) {
        if (
          line[a] === line[b] &&
          !hasThree.has(line[a]) &&
          !hasTwo.has(line[a])
        )
          hasTwo.add(line[a]);
      }
    }

    // If either set has any values increment the appropriate counters
    if (hasTwo.size > 0) twoCount++;
    if (hasThree.size > 0) threeCount++;
  }

  // Return the result of multiplying the counters
  return twoCount * threeCount;
};
