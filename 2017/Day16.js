// Puzzle for Day 16: https://adventofcode.com/2017/day/16

export const run = (fileContents) => {
  // Parse in the moves from the first line of the input file and split the moves by commas
  let moves = fileContents[0].split(",");
  // Create starting arrays for parts 1 and 2
  let dancers1 = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
  ];
  let dancers2 = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
  ];

  // Dance parts 1 and 2
  danceAllMoves(moves, dancers1, 1);
  danceAllMoves(moves, dancers2, 1000000000);

  return { part1: dancers1.join(""), part2: dancers2.join("") };
};

// Dance all of the moves for the set of danceer for the given number of rounds
const danceAllMoves = (moves, dancers, rounds) => {
  // A memory map to keep track of previously seen end of round states for the dancers
  let memory = new Map();
  // The remaining rounds to dance to reach the total
  let remainingRounds = 0;
  // Dance all of the moves for the given number of rounds
  for (let x = 0; x < rounds; x++) {
    // Dance all moves for the round updateing the dancers array positions
    danceOneRound(moves, dancers);
    // Get a string version of the array of dancers
    let result = dancers.join("");
    // Check if that string has been seen before
    if (memory.has(result)) {
      // If it has find the number of rounds until the cycle repeated itself.
      // Then find the remaining number of rounds to reach the total number
      // of rounds final state of the dancers array. Break out of this loop
      // to process those rounds.
      let start = memory.get(result);
      let cycleSize = x - start;
      remainingRounds = rounds % cycleSize;
      break;
    } else {
      // If not found add this state to the array and continue
      memory.set(result, x);
    }
  }

  // Process the remaining number of rounds
  for (let x = 1; x < remainingRounds; x++) {
    danceOneRound(moves, dancers);
  }
};

// Proces all of the moves for one round of dancing
const danceOneRound = (moves, dancers) => {
  // Regex to parse each move
  let reg = new RegExp(/(s|x|p)(\d+|[a-p])\/*(\d+|[a-p])*/);
  // Dance each move in order
  for (let move of moves) {
    // Parse the correspodning info from the move
    let matches = move.match(reg);
    // Spin move
    if (matches[1] === "s") {
      let rounds = parseInt(matches[2]);
      for (let x = 0; x < rounds; x++) {
        let temp = dancers.pop();
        dancers.unshift(temp);
      }
    }
    // Exchange move
    else if (matches[1] === "x") {
      let a = parseInt(matches[2]);
      let b = parseInt(matches[3]);
      swap(dancers, a, b);
    }
    // Partner move
    else if (matches[1] === "p") {
      let a = dancers.indexOf(matches[2]);
      let b = dancers.indexOf(matches[3]);
      swap(dancers, a, b);
    }
  }
};

// Basic swap method
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
};
