import { createHash } from "node:crypto";
// Puzzle for Day 5: https://adventofcode.com/2016/day/5

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // The doorId for the project and the passwords that are constructed
  let doorId = fileContents[0];
  let passwordPart1 = "";
  let passwordPart2 = [];

  // Continue checking while we have not found both passwords yet
  for (
    let x = 0;
    passwordPart1.length < 8 || passwordPart2.join("").length < 8;
    x++
  ) {
    // The current test of the door id and the itertation number to use to generate the hash
    let test = doorId + x;
    // That hash for this test
    let hash = createHash("md5").update(test).digest("hex");

    // Determine if the hash is of interest
    let ofInterest = hash.slice(0, 5) === "00000";

    if (ofInterest) {
      // Find the sixth and seventh characters for the of interest hash
      let sixth = hash.slice(5, 6);
      let seventh = hash.slice(6, 7);

      // Update the Part 1 password if it is not full yet
      if (passwordPart1.length < 8) {
        passwordPart1 += sixth;
      }

      // Update the Part 2 password if it is not full yet
      if (passwordPart2.join("").length < 8) {
        // Check if the index in the Part 2 password array is filled yet
        // if this is a valid index
        let index = parseInt(sixth);
        if (index >= 0 && index <= 7 && !passwordPart2[index]) {
          passwordPart2[index] = seventh;
        }
      }
    }
  }

  return { part1: passwordPart1, part2: passwordPart2.join("") };
};
