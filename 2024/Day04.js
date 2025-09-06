// Puzzle for Day 04: https://adventofcode.com/2024/day/4

export const run = (fileContents) => {
  // Create a 2d array from the file input
  let grid = fileContents.map((line) => line.split(""));
  let result1 = part1(grid);
  let result2 = part2(grid);
  return { part1: result1, part2: result2 };
};

/**
 * Part 2 solution
 * @param {string[][]} grid 2D grid of crossword puzzle
 * @returns Total number of X-MAS found
 */
const part2 = (grid) => {
  // Keep track of the total
  let total = 0;

  // Check each spot in the grid without checking the edges since those
  // cannot be possibilities in this part
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < grid[y].length - 1; x++) {
      // If the letter is A then this is possibly the center of an X-MAS
      if (grid[y][x] == "A") {
        // Get the letters for each diagonal
        let diag1 = [grid[y - 1][x - 1], grid[y][x], grid[y + 1][x + 1]].join(
          "",
        );
        let diag2 = [grid[y + 1][x - 1], grid[y][x], grid[y - 1][x + 1]].join(
          "",
        );
        // If the letters for both diagonals match MAS forwards or backwards increment the total
        if (
          (diag1 == "MAS" || diag1 == "SAM") &&
          (diag2 == "MAS" || diag2 == "SAM")
        )
          total++;
      }
    }
  }

  return total;
};

/**
 * Part 1 solution
 * @param {string[][]} grid 2D grid of crossword puzzle
 * @returns Total number of XMAS found
 */
const part1 = (grid) => {
  // Keep track of the total
  let total = 0;

  // Check each spot in the grid
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      // If there is an X this is the potential start of XMAS
      if (grid[y][x] == "X") {
        // Can there be possible answers in each cardinal direction
        let up = y >= 3;
        let down = y <= grid.length - 4;
        let left = x >= 3;
        let right = x <= grid[y].length - 4;

        // Create a list of all possible options
        let possibilities = [];
        // up
        if (up) {
          possibilities.push(
            [grid[y][x], grid[y - 1][x], grid[y - 2][x], grid[y - 3][x]].join(
              "",
            ),
          );
        }
        // up right
        if (up && right) {
          possibilities.push(
            [
              grid[y][x],
              grid[y - 1][x + 1],
              grid[y - 2][x + 2],
              grid[y - 3][x + 3],
            ].join(""),
          );
        }
        // up left
        if (up && left) {
          possibilities.push(
            [
              grid[y][x],
              grid[y - 1][x - 1],
              grid[y - 2][x - 2],
              grid[y - 3][x - 3],
            ].join(""),
          );
        }
        // right
        if (right) {
          possibilities.push(
            [grid[y][x], grid[y][x + 1], grid[y][x + 2], grid[y][x + 3]].join(
              "",
            ),
          );
        }
        // left
        if (left) {
          possibilities.push(
            [grid[y][x], grid[y][x - 1], grid[y][x - 2], grid[y][x - 3]].join(
              "",
            ),
          );
        }
        // down
        if (down) {
          possibilities.push(
            [grid[y][x], grid[y + 1][x], grid[y + 2][x], grid[y + 3][x]].join(
              "",
            ),
          );
        }
        // down right
        if (down && right) {
          possibilities.push(
            [
              grid[y][x],
              grid[y + 1][x + 1],
              grid[y + 2][x + 2],
              grid[y + 3][x + 3],
            ].join(""),
          );
        }
        // down left
        if (down && left) {
          possibilities.push(
            [
              grid[y][x],
              grid[y + 1][x - 1],
              grid[y + 2][x - 2],
              grid[y + 3][x - 3],
            ].join(""),
          );
        }

        // Check each possibility
        for (let possibility of possibilities) {
          // If a possibility equals XMAS increment the total
          if (possibility == "XMAS") total++;
        }
      }
    }
  }

  return total;
};
