// Puzzle for Day 03: https://adventofcode.com/2023/day/3

export const run = (fileContents) => {
  // Get a 2d grid of strings for the file contents
  let grid = fileContents.map((l) => l.split(""));

  // Get the results for each part
  let result1 = part1(grid);
  let result2 = part2(grid);

  return { part1: result1, part2: result2 };
};

/**
 * Part 2 Solution
 * @param {[[string]]} grid
 * @returns {number}
 */
const part2 = (grid) => {
  // Sum of the gear ratios
  let sum = 0;

  // Array of all valid numbers and their locations in the grid
  let validNumbers = [];
  // Array of all * positions in the grid
  let potentialGears = [];
  // Check the grid line by line
  for (let y = 0; y < grid.length; y++) {
    // Current line
    let line = grid[y];
    // Current number digits
    let numValues = [];
    // Current number digit locations
    let numLocations = [];
    // Check each character in the line
    for (let x = 0; x < line.length; x++) {
      // Current character
      let character = line[x];
      // Current num to add to the list of numbers
      let num = undefined;
      // if this is a digit add its info to the arrays
      if (character.match(/\d/)) {
        numLocations.push({ y, x });
        numValues.push(character);
      }
      // Otherwise check if there is a number to parse and if so parse it
      else {
        if (numLocations.length > 0) {
          num = parseInt(
            numValues.reduce((number, val) => (number += val), ""),
          );
        }
      }

      // If the end of the line is reached and a number needs to be parsed then parse it
      if (x == line.length - 1 && numLocations.length > 0 && num == undefined) {
        num = parseInt(numValues.reduce((number, val) => (number += val), ""));
      }

      // If there is a number then add it's info to the valid numbers and reset
      if (num) {
        validNumbers.push({ num, numLocations });
        num = undefined;
        numLocations = [];
        numValues = [];
      }

      // If a * is found add its location to the array
      if (character === "*") {
        potentialGears.push({ y, x });
      }
    }
  }

  // Check each star location as being a potential gear
  for (let potGear of potentialGears) {
    // Get the potential spaces surrounding the *
    let surrounding = getSurroundingCoordinates(potGear);

    // A set of surrounding valid numbers
    let foundNumbers = new Set();
    // Check each surrounding space
    for (let sur of surrounding) {
      // If there is a valid number then add it to the set
      let number = validNumbers.find((num) =>
        num.numLocations.find((loc) => loc.y === sur.y && loc.x === sur.x),
      );
      if (number) {
        foundNumbers.add(JSON.stringify(number));
      }
    }

    // If exactly 2 numbers are found then this is a gear
    if (foundNumbers.size == 2) {
      // Get the number values
      let values = Array.from(foundNumbers).map((val) => {
        let obj = JSON.parse(val);
        return obj.num;
      });
      // Add the gear ratio to the sum
      sum += values[0] * values[1];
    }
  }

  return sum;
};

/**
 * Part 1 Solution
 * @param {[[string]]} grid
 * @returns {number}
 */
const part1 = (grid) => {
  // Sum of part numbers
  let sum = 0;

  // Parse each grid location to find the numbers
  for (let y = 0; y < grid.length; y++) {
    // Get the current line
    let line = grid[y];
    // Track the consecutive number values and their locations
    let numValues = [];
    let numLocations = [];
    // Check each character in the line
    for (let x = 0; x < line.length; x++) {
      // The current characters
      let character = line[x];
      // A complete found part number otherwise undefined
      let num = undefined;

      // If this is a digit add it to the numberLocations and numValues
      if (character.match(/\d/)) {
        numLocations.push({ y, x });
        numValues.push(character);
      }
      // Otherwise if there is a number to check then check the number
      else {
        if (numLocations.length > 0) {
          num = isNumPart(numLocations, numValues, grid);
        }
      }

      // If the end of the lin is hit and there is a number to check then check it
      if (x == line.length - 1 && numLocations.length > 0 && num == undefined) {
        num = isNumPart(numLocations, numValues, grid);
      }

      // If there is a part number then add it to the sum and reset
      if (num) {
        sum += num;
        num = undefined;
        numLocations = [];
        numValues = [];
      }
      // Otherwise, if the num is null then a number was found but
      // it is not a part number so reset without adding to the sum
      else if (num === null) {
        num = undefined;
        numLocations = [];
        numValues = [];
      }
    }
  }

  return sum;
};

// Check if the number is a valid part number
const isNumPart = (numLocations, numValues, grid) => {
  // Get the grid max dimensions
  let yMax = grid.length - 1;
  let xMax = grid[0].length - 1;

  // Get the surrounding location coordinates for the whole number
  let surrounding = new Set();
  for (let loc of numLocations) {
    // Get the potential surrounding locations for the current digit
    let currentSurrounding = getSurroundingCoordinates(loc);

    // Check each location to see is it is a valid location on the grid
    // and not part of the number's digit locations
    for (let curSur of currentSurrounding) {
      if (
        curSur.y >= 0 &&
        curSur.y <= yMax &&
        curSur.x >= 0 &&
        curSur.x <= xMax &&
        !numLocations.find((val) => val.x == curSur.x && val.y == curSur.y)
      ) {
        surrounding.add(`{"y": ${curSur.y}, "x":${curSur.x}}`);
      }
    }
  }

  // Check if a symbol is found in the surrounding locations
  let foundSymbol =
    Array.from(surrounding)
      // Gat an array and parse each location into grid values
      .map((x) => {
        let coord = JSON.parse(x);
        return grid[coord.y][coord.x];
      })
      // Find if any of the grid values are symbols
      .find((x) => /[^\d\.]/.test(x)) != undefined;

  // If a symbol is found return the number otherwise return null
  if (foundSymbol) {
    return parseInt(numValues.reduce((number, val) => (number += val), ""));
  } else {
    return null;
  }
};

/**
 * Get the potentially surrounding coordinates
 * @param {x: number, y: number} loc
 * @returns {[{x: number, y: number}]}
 */
const getSurroundingCoordinates = (loc) => {
  let currentSurrounding = [];
  currentSurrounding.push({ y: loc.y - 1, x: loc.x - 1 }); // up left
  currentSurrounding.push({ y: loc.y - 1, x: loc.x }); // up
  currentSurrounding.push({ y: loc.y - 1, x: loc.x + 1 }); // up right
  currentSurrounding.push({ y: loc.y, x: loc.x - 1 }); // left
  currentSurrounding.push({ y: loc.y, x: loc.x + 1 }); // right
  currentSurrounding.push({ y: loc.y + 1, x: loc.x - 1 }); // down left
  currentSurrounding.push({ y: loc.y + 1, x: loc.x }); // down
  currentSurrounding.push({ y: loc.y + 1, x: loc.x + 1 }); // down right

  return currentSurrounding;
};
