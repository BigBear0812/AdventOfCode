// Puzzle for Day 8: https://adventofcode.com/2016/day/8

export const run = (fileContents) => {
  // Parse the input file into a set of command objects
  let commands = parseInput(fileContents);
  // The dimensions of the screen
  let width = 50;
  let height = 6;

  // Process all commands on the screen and return the output
  let screen = processScreen(commands, width, height);

  // Count the number of stars on the screen
  let count = 0;
  for (let y = 0; y < screen.length; y++) {
    for (let x = 0; x < screen[y].length; x++) {
      if (screen[y][x] === "*") count++;
    }
  }

  return { part1: count, part2: print(screen) };
};

// Process all of the commands on the screen of the given size
const processScreen = (commands, width, height) => {
  // Populate a blank screen with spaces
  let screen = [];
  for (let y = 0; y < height; y++) {
    screen.push([]);
    for (let x = 0; x < width; x++) {
      screen[y].push(" ");
    }
  }

  // Run each command
  for (let command of commands) {
    // If this is a rectangle command
    if (command.command === "rect") {
      // Go through the specified size of the retangle starting at
      // 0, 0 and set every space to a star
      for (let y = 0; y < command.height; y++) {
        for (let x = 0; x < command.width; x++) {
          screen[y][x] = "*";
        }
      }
    }
    // If this is a rotate command
    else if (command.command === "rotate") {
      // If rotating a row
      if (command.dimension === "row") {
        // Remove the last item from the row array and add it to the
        // front of the row array as many times as the moves are specified
        for (let m = 0; m < command.moves; m++) {
          let end = screen[command.lineNumber].pop();
          screen[command.lineNumber].unshift(end);
        }
      }
      // If rotating a column
      else if (command.dimension === "column") {
        // Populate a new array with the value from a given column by finding
        // that column value in each row in order
        let column = [];
        for (let x = 0; x < height; x++) {
          column.push(screen[x][command.lineNumber]);
        }
        // Remove the last item from the column array and add it to the
        // front of the column array as many times as the moves are specified
        for (let m = 0; m < command.moves; m++) {
          let end = column.pop();
          column.unshift(end);
        }
        // Update the screen values for this column in each row in order
        // with the corresponding value from the column array
        for (let x = 0; x < height; x++) {
          screen[x][command.lineNumber] = column[x];
        }
      }
    }
  }
  return screen;
};

// Parse the input into an array of command objects
const parseInput = (fileContents) => {
  // Regex for parsing each line
  let reg = new RegExp(/(rotate|rect) (row|column)*[ yx=]*(\d+)[x by]+(\d+)/);
  // Resulting commands array
  let commands = [];

  // Parse each line of the file
  for (let line of fileContents) {
    // Get the matching segments from the line
    let matches = line.match(reg);

    // If this is a rect command
    if (matches[1] === "rect") {
      // Create a command that only uses the necessary match
      // values and has prioperty names that are relevant
      commands.push({
        command: matches[1],
        width: matches[3],
        height: matches[4],
      });
    }
    // Else if this is a rotate command
    else if (matches[1] === "rotate") {
      // Create a command that only uses the necessary match
      // values and has prioperty names that are relevant
      commands.push({
        command: matches[1],
        dimension: matches[2],
        lineNumber: matches[3],
        moves: matches[4],
      });
    }
  }

  return commands;
};

// Print the screen array to the console
const print = (screen) => {
  let result = "\n";
  for (let y = 0; y < screen.length; y++) {
    let line = screen[y].join("");
    result += line + "\n";
  }
  return result;
};
