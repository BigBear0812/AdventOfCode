// Puzzle for Day 2: https://adventofcode.com/2022/day/2

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  {
    // OP
    // A: Rock
    // B: Paper
    // C: Scissors

    // You
    // X: Rock:    1
    // Y: Paper    2
    // Z: Scissors 3

    // Win  6
    // Tie  3
    // Lose 0
    const games1 = [
      "B X", // OP: Paper    You: Rock     1 Lose 0
      "C Y", // OP: Scissors You: Paper    2 Lose 0
      "A Z", // OP: Rock     You: Scissors 3 Lose 0
      "A X", // OP: Rock     You: Rock     1 Tie  3
      "B Y", // OP: Paper    You: Paper    2 Tie  3
      "C Z", // OP: Scissors You: Scissors 3 Tie  3
      "C X", // OP: Scissors You: Rock     1 Win  6
      "A Y", // OP: Rock     You: Paper    2 Win  6
      "B Z", // OP: Paper    You: Scissors 3 Win  6
    ];

    // OP
    // A: Rock
    // B: Paper
    // C: Scissors

    // You
    // Rock:    1
    // Paper    2
    // Scissors 3

    // X: Lose 0
    // Y: Tie  3
    // Z: Win  6
    const games2 = [
      "B X", // OP: Paper    Lose 0 You: Rock     1
      "C X", // OP: Scissors Lose 0 You: Paper    2
      "A X", // OP: Rock     Lose 0 You: Scissors 3
      "A Y", // OP: Rock     Tie  3 You: Rock     1
      "B Y", // OP: Paper    Tie  3 You: Paper    2
      "C Y", // OP: Scissors Tie  3 You: Scissors 3
      "C Z", // OP: Scissors Win  6 You: Rock     1
      "A Z", // OP: Rock     Win  6 You: Paper    2
      "B Z", // OP: Paper    Win  6 You: Scissors 3
    ];

    let runningTotal1 = 0;
    let runningTotal2 = 0;

    // Read in all of the lines one at a time
    for (const line of fileContents) {
      // need to add one since the index is 0 based instead of 1 based
      runningTotal1 += games1.indexOf(line) + 1;
      runningTotal2 += games2.indexOf(line) + 1;
    }

    return { part1: runningTotal1, part2: runningTotal2 };
  }
};
