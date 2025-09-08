// Puzzle for Day 04: https://adventofcode.com/2021/day/4

export const run = (fileContents) => {
  // Get drawn numbers
  const drawnNums = fileContents
    .shift()
    .split(",")
    .map((num) => parseInt(num));

  // Parse board info
  const boards = [];

  while (fileContents.length > 0) {
    // Shift off one more blank row
    fileContents.shift();
    // Create a board
    const board = [];
    for (let r = 0; r < 5; r++) {
      board.push(
        fileContents
          .shift()
          .split(" ")
          .filter((val) => val != "") // Filter out blanks
          .map((num) => parseInt(num)),
      );
    }
    // Add the board to the list of boards
    boards.push(new Board(board));
  }

  // Calculate the bingo for each board
  for (let b = 0; b < boards.length; b++) {
    for (let d = 0; d < drawnNums.length && boards[b].bingoOnTurn === -1; d++) {
      boards[b].numberDrawn(drawnNums[d], d);
    }
  }

  // Part 1
  let part1Count = Infinity;
  let part1;

  // Find the first board to get bingo
  for (let b = 0; b < boards.length; b++) {
    if (boards[b].bingoOnTurn < part1Count) {
      part1Count = boards[b].bingoOnTurn;
      part1 = boards[b].score;
    }
  }

  // Part 2
  let part2Count = -1;
  let part2;

  // Find the last board to get bingo
  for (let b = 0; b < boards.length; b++) {
    if (boards[b].bingoOnTurn > part2Count) {
      part2Count = boards[b].bingoOnTurn;
      part2 = boards[b].score;
    }
  }

  return { part1, part2 };
};

/**
 * Bingo Board
 */
class Board {
  constructor(board) {
    // The original board
    this.board = board;
    // A same size board that is used to mark the
    // spaces that have been drawn
    this.foundSpaces = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    // Number of found slots
    this.foundSpacesCount = 0;
    // Final board score
    this.score = 0;
    // The count of numbers drawn to find bingo
    this.bingoOnTurn = -1;
  }

  /**
   * Update the board based on a new number drawn
   * @param {number} number The number drawn
   * @param {number} count The count of numbers drawn
   */
  numberDrawn(number, count) {
    // Check each space on the board
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        // If there is a match
        if (this.board[y][x] === number) {
          // Update found values
          this.foundSpacesCount += 1;
          this.foundSpaces[y][x] = 1;
          // Check board for bingo
          if (this.foundSpacesCount >= 5) {
            if (this.checkBingo()) {
              // If bingo calc the score and save the current count
              this.calcScore(number);
              this.bingoOnTurn = count;
            }
          }
        }
      }
    }
  }

  /**
   * Check if the board has a bingo
   * @returns true if the board has a bingo
   */
  checkBingo() {
    let winner = false;

    // Check rows
    for (let y = 0; y < 5 && winner === false; y++) {
      let count = 0;
      for (let x = 0; x < 5; x++) {
        count += this.foundSpaces[y][x];
      }
      if (count === 5) winner = true;
    }

    // Check columns
    for (let x = 0; x < 5 && winner === false; x++) {
      let count = 0;
      for (let y = 0; y < 5; y++) {
        count += this.foundSpaces[y][x];
      }
      if (count === 5) winner = true;
    }

    return winner;
  }

  /**
   * Calculate the board score
   * @param {number} drawnNum
   */
  calcScore(drawnNum) {
    let boardTotal = 0;
    // Check each space
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        // If it is not marked add its value to the total
        if (this.foundSpaces[y][x] !== 1) {
          boardTotal += this.board[y][x];
        }
      }
    }
    // Multiply the total by the number that was drawn to
    // cause the bingo to get the finals score.
    this.score = boardTotal * drawnNum;
  }
}
