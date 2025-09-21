// Puzzle for Day 15: https://adventofcode.com/2024/day/15

const SHOW_FINAL_GRIDS = false;

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);
  return { part1: result1, part2: result2 };
};

/**
 * Part 2 Solution
 * @param {string[]} fileContents An array of each line of the input file
 * @returns Solution for Part 1
 */
const part2 = (fileContents) => {
  let data = parseInput(fileContents, true);
  return runSim(
    data.walls,
    data.boxes,
    data.location,
    data.moves,
    "Part 2:",
    data.height,
    data.width,
  );
};

/**
 * Part 1 Solution
 * @param {string[]} fileContents An array of each line of the input file
 * @returns Solution for Part 1
 */
const part1 = (fileContents) => {
  let data = parseInput(fileContents, false);
  return runSim(
    data.walls,
    data.boxes,
    data.location,
    data.moves,
    "Part 1:",
    data.height,
    data.width,
  );
};

/**
 * Parse input into useable data
 * @param {string[]} fileContents An array of each line of the input file
 * @param {boolean} part2 True if parsing using part 2 rules
 * @returns {{
 *    walls: Set<string>,
 *    boxes: Map<string, {y: number, x: number, symbol:string}>,
 *    location: {
 *        y: number,
 *        x: number
 *    },
 *    moves: string[],
 *    height: number,
 *    width: number,
 * }} The important grid data to run the simulation
 */
const parseInput = (fileContents, part2) => {
  // Create objects for storing all of the important information
  let walls = new Set();
  let boxes = new Map();
  let moves = [];
  let location;
  // Is this parsing in the grid from the input file
  let gridMode = true;
  // The height and width of the grid area
  let height;
  let width = part2 ? fileContents[0].length * 2 : fileContents[0].length;

  // Parse each line
  for (let l = 0; l < fileContents.length; l++) {
    // If this is the blank separator line
    if (fileContents[l] === "") {
      // Turn off grid parsing
      gridMode = false;
      // Set height
      height = l;
      // Parse next line
      continue;
    }
    // Get the line contents and split the string into an array of each character
    let line = fileContents[l].split("");
    // Double the line length if using part 2
    let lineLength = part2 ? line.length * 2 : line.length;
    // Parse each character in the line
    for (let c = 0; c < lineLength; part2 ? (c += 2) : c++) {
      // Get the current character depending on line length
      let current = part2 ? line[c / 2] : line[c];
      // If in grid mode
      if (gridMode) {
        // If the starting location is found set it
        if (current === "@") {
          location = { y: l, x: c };
        }
        // If a wall is found add it to the Set of wall locations
        else if (current === "#") {
          if (part2) {
            walls.add(`${l},${c}`);
            walls.add(`${l},${c + 1}`);
          } else {
            walls.add(`${l},${c}`);
          }
        }
        // If a box is found add it to the Map of box locations
        else if (current === "O") {
          if (part2) {
            boxes.set(`${l},${c}`, { y: l, x: c, symbol: "[" });
            boxes.set(`${l},${c + 1}`, { y: l, x: c + 1, symbol: "]" });
          } else {
            boxes.set(`${l},${c}`, { y: l, x: c, symbol: "O" });
          }
        }
      }
      // If not in grid mode the parse all characters into the array of moves
      else {
        moves.push(current);
      }
    }
  }

  return { walls, boxes, location, moves, height, width };
};

/**
 * Simulate all of the moves and return a final sum of all GPS coordinates
 * @param {Set<string>} walls A set of all wall positions
 * @param {Map<string, {y: number, x: number, symbol:string}>} boxes A map of all current box locations
 * @param {{y: number, x: number}} location Current robot location
 * @param {string[]} moves The moves to be made during each step in the simulation
 * @param {string} message Message to display
 * @param {number} height Height of area
 * @param {number} width Width of area
 * @returns {number} Sum of all GPS coordinates
 */
const runSim = (walls, boxes, location, moves, message, height, width) => {
  // Simulate each move one at a time
  for (let m = 0; m < moves.length; m++) {
    // Get the direction of movement
    let direction = moves[m];
    // Track any boxes to be moved
    let boxesToMove = [];
    // Flag for if a wall was hit
    let hitWall = false;

    // Track the next positions to check next
    let nextPositions = [];
    // Start with the next position to check based on the direction of travel
    if (direction === "^")
      nextPositions.push({ y: location.y - 1, x: location.x });
    else if (direction === "v")
      nextPositions.push({ y: location.y + 1, x: location.x });
    else if (direction === "<")
      nextPositions.push({ y: location.y, x: location.x - 1 });
    else if (direction === ">")
      nextPositions.push({ y: location.y, x: location.x + 1 });

    // Use Breadth First Search (BFS) to find all boxes to be moved.
    // Stop searching if we hit a wall since that means nothing will move.
    while (nextPositions.length > 0 && !hitWall) {
      // Get the next position to check and create it's search key
      let nextPos = nextPositions.shift();
      let nextKey = `${nextPos.y},${nextPos.x}`;

      // If this is a wall set the hit wall flag to true
      if (walls.has(nextKey)) {
        hitWall = true;
      }
      // Else if it is a box process the next positions to check
      else if (boxes.has(nextKey)) {
        // Get the current box
        let current = boxes.get(nextKey);
        // Add it to the array of boxes to move
        boxesToMove.push(current);
        // Remove it from the Map of boxes
        boxes.delete(nextKey);
        // Create the key for the opposite side of the box if this is a 2 wide box
        let oppositeKey;
        if (current.symbol === "[")
          oppositeKey = `${nextPos.y},${nextPos.x + 1}`;
        else if (current.symbol === "]")
          oppositeKey = `${nextPos.y},${nextPos.x - 1}`;
        // Get the opposite side of the box if it exists
        let opposite;
        if (oppositeKey) {
          // Get the opposite side of the box
          opposite = boxes.get(oppositeKey);
          // Add it to the array of boxes to move
          boxesToMove.push(opposite);
          // Remove it from the Map of boxes
          boxes.delete(oppositeKey);
        }

        // If moving up
        if (direction === "^") {
          // Add the space above this to next positions array
          nextPositions.push({ y: nextPos.y - 1, x: nextPos.x });
          // If there is an opposite side of the box. Add that
          // to the next positions to check as well since it
          // will also be moving up.
          if (opposite && opposite.symbol === "[")
            nextPositions.push({ y: nextPos.y - 1, x: nextPos.x - 1 });
          else if (opposite && opposite.symbol === "]")
            nextPositions.push({ y: nextPos.y - 1, x: nextPos.x + 1 });
        }
        // If moving down
        else if (direction === "v") {
          // Add the space below this to next positions array
          nextPositions.push({ y: nextPos.y + 1, x: nextPos.x });
          // If there is an opposite side of the box. Add that
          // to the next positions to check as well since it
          // will also be moving down.
          if (opposite && opposite.symbol === "[")
            nextPositions.push({ y: nextPos.y + 1, x: nextPos.x - 1 });
          else if (opposite && opposite.symbol === "]")
            nextPositions.push({ y: nextPos.y + 1, x: nextPos.x + 1 });
        }
        // If moving left
        else if (direction === "<") {
          // If the box is 2 wide move over by 2
          if (opposite) nextPositions.push({ y: nextPos.y, x: nextPos.x - 2 });
          // Otherwise move over by just 1
          else nextPositions.push({ y: nextPos.y, x: nextPos.x - 1 });
        }
        // If moving right
        else if (direction === ">") {
          // If the box is 2 wide move over by 2
          if (opposite) nextPositions.push({ y: nextPos.y, x: nextPos.x + 2 });
          // Otherwise move over by just 1
          else nextPositions.push({ y: nextPos.y, x: nextPos.x + 1 });
        }
      }
    }

    // If no walls were hit then move the boxes in the boxes to move array
    if (!hitWall) {
      // Move boxes and location up
      if (direction === "^") {
        boxesToMove = boxesToMove.map((box) => ({
          y: box.y - 1,
          x: box.x,
          symbol: box.symbol,
        }));
        location.y--;
      }
      // Move boxes and location down
      else if (direction === "v") {
        boxesToMove = boxesToMove.map((box) => ({
          y: box.y + 1,
          x: box.x,
          symbol: box.symbol,
        }));
        location.y++;
      }
      // Move boxes and location left
      else if (direction === "<") {
        boxesToMove = boxesToMove.map((box) => ({
          y: box.y,
          x: box.x - 1,
          symbol: box.symbol,
        }));
        location.x--;
      }
      // Move boxes and location right
      else if (direction === ">") {
        boxesToMove = boxesToMove.map((box) => ({
          y: box.y,
          x: box.x + 1,
          symbol: box.symbol,
        }));
        location.x++;
      }
    }

    // Add all boxes to move back into the Map of boxes
    boxesToMove.forEach((box) =>
      boxes.set(`${box.y},${box.x}`, {
        y: box.y,
        x: box.x,
        symbol: box.symbol,
      }),
    );
  }

  // Display the final grids if that setting is on
  if (SHOW_FINAL_GRIDS) print(walls, boxes, location, message, height, width);

  // Calculate the total of the GPS coordinates
  let total = 0;
  boxes
    .values()
    // Use only the left side of a double wide box or a single width box location
    .filter((box) => box.symbol === "[" || box.symbol === "O")
    .forEach((box) => {
      total += 100 * box.y + box.x;
    });
  return total;
};

/**
 * Print out to console the current state of the area
 * @param {Set<string>} walls A set of all wall positions
 * @param {Map<string:{y: number, x: number, symbol:string}>} boxes A map of all current box locations
 * @param {{y: number, x: number}} location Current robot location
 * @param {string} message Message to display
 * @param {number} height Height of area
 * @param {number} width Width of area
 */
const print = (walls, boxes, location, message, height, width) => {
  // Start the output with the message
  let output = message ? message + "\n" : "";
  // Parse rows until reaching the height
  for (let y = 0; y < height; y++) {
    // Parse columns until reaching the width
    for (let x = 0; x < width; x++) {
      // Icons to display on this tile
      let icons = [];
      // Key for this location for set and map lookups
      let key = `${y},${x}`;

      // If there is a wall, box, or robot at this location
      // add their symbols to the icons array.
      if (walls.has(key)) icons.push("#");
      if (boxes.has(key)) icons.push(boxes.get(key).symbol);
      if (location.y == y && location.x == x) icons.push("@");

      // If there are no icons here print a . for empty space
      if (icons.length === 0) output += ".";
      // If there is only one icon print it
      else if (icons.length === 1) output += icons[0];
      // If more icons print the count of the number of icons.
      else output += icons.length;
    }
    // Add a newline at the end of each row
    output += "\n";
  }
  // Log the output to console
  console.log(output);
};
