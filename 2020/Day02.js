// Puzzle for Day 02: https://adventofcode.com/2020/day/2

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the input lines into entry objects
  let entries = fileContents.map((e) => {
    // Use regex to get the important info from the entry
    let matches = e.match(/(\d+)-(\d+) ([a-z]): (.+)/);

    // Parse the data to an object and convert the number values to int's
    return {
      first: parseInt(matches[1]),
      second: parseInt(matches[2]),
      required: matches[3],
      password: matches[4],
    };
  });

  // Get the results for each part of the puzzle
  let result1 = 0;
  let result2 = 0;

  // Check each entry
  for (let entry of entries) {
    // Get the number of times the required letter appears in the password
    let matches = [...entry.password.matchAll(entry.required)];

    // Get the letters at each position of the password assuming a 1 based index value instead of 0
    let pos1 = entry.password.substring(entry.first - 1, entry.first);
    let pos2 = entry.password.substring(entry.second - 1, entry.second);

    // Check if the password has the correct number of required letters in it for part 1
    if (entry.first <= matches.length && matches.length <= entry.second)
      result1++;

    // Perform an XOR check if one and only one of the pos1 and pos2 values matches the required letter
    if (
      (pos1 === entry.required || pos2 === entry.required) &&
      !(pos1 === entry.required && pos2 === entry.required)
    )
      result2++;
  }

  return { part1: result1, part2: result2 };
};
