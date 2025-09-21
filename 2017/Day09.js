// Puzzle for Day 9: https://adventofcode.com/2017/day/9

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Split the stream into characters to be evaluated one at a time
  let stream = fileContents[0].split("");

  // Keep track of several things at once
  // How many groups deep are we
  let groupsDeep = 0;
  // The total score
  let score = 0;
  // How many garbage charcacters are there
  let grabageChars = 0;
  // The current index
  let index = 0;
  // Is this part of a garbage sequence
  let inGarbage = false;

  // Continue processing the stream while the index is still valid
  while (index < stream.length) {
    // Get the current character
    let current = stream[index];
    // If a ! then skip the next character regardless of being in garbage or not
    if (current === "!") {
      index++;
    } else {
      // If not in garbage
      if (!inGarbage) {
        // Add one to groupsDeep if at an opening brace
        if (current === "{") {
          groupsDeep++;
        }
        // Update the score then subtract one from groupsDeep if at a closing brace
        else if (current === "}") {
          score += groupsDeep;
          groupsDeep--;
        }
        // Set inGarbage to true if finding < while not already in garbage
        else if (current === "<") {
          inGarbage = true;
        }
      }
      // If in garbage
      else {
        // Set inGarnbage toi false if  > is found while in garbage
        if (current === ">") {
          inGarbage = false;
        }
        // Else this is just a random garbage character so add one to garbage characters
        else {
          grabageChars++;
        }
      }
    }
    // Add one to the index to advance through the stream.
    index++;
  }

  return { part1: score, part2: grabageChars };
};
