// Puzzle for Day 21: https://adventofcode.com/2017/day/21

export const run = (fileContents) => {
  // Parse in the rules file
  let rules = parseInput(fileContents);
  // Setup the starting grid as defined in the problem
  let start = [
    [".", "#", "."],
    [".", ".", "#"],
    ["#", "#", "#"],
  ];

  // Generate the grid for Part 1
  let grid1 = generateGrid(start, rules, 5);

  // Generate the grid for Part 2
  let grid2 = generateGrid(grid1, rules, 13);

  // Output the number of on spots for each Part
  return { part1: countOn(grid1), part2: countOn(grid2) };
};

// Count the number of "On" spots in the grid
const countOn = (grid) => {
  let count = 0;
  // Check each spot in the grid and add up the number of #'s
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "#") count++;
    }
  }
  return count;
};

// Generate the grid at the next number of iterations from the start
const generateGrid = (grid, rules, iterations) => {
  for (let x = 0; x < iterations; x++) {
    grid = interate(grid, rules);
  }
  return grid;
};

// Create the next iteration of the grid
const interate = (grid, rules) => {
  // Find if the grid is divisible by 2 or 3
  let modTwo = grid.length % 2;
  let modThree = grid.length % 3;
  // The resulting new grid
  let resultGrid = [];
  // If the grid is divisible by 2
  if (modTwo === 0) {
    // Get the number of grid sections per side to divide out
    let div = grid.length / 2;
    // Resulting divided sections in order
    let sections = [];
    // Divide out each section row by row and column by column
    for (let y = 1; y <= div; y++) {
      for (let x = 1; x <= div; x++) {
        sections.push([
          [grid[2 * y - 2][2 * x - 2], grid[2 * y - 2][2 * x - 1]],
          [grid[2 * y - 1][2 * x - 2], grid[2 * y - 1][2 * x - 1]],
        ]);
      }
    }

    // The resulting sections to replace the ones in the
    // corresponding indexes of the sections array
    let resultSections = [];
    // Find the result for each section
    for (let section of sections) {
      // Check each two rule for a match
      let matchFound = false;
      for (let x = 0; x < rules.twoRules.length && matchFound === false; x++) {
        let current = rules.twoRules[x];
        // This is a match if one of the current rule's match grid is identical to the current section
        for (let m = 0; m < current.matches.length && !matchFound; m++) {
          matchFound = compareGrids(current.matches[m], section);
        }
        // If the match is found add it to the repalcement sections
        if (matchFound) {
          resultSections.push(current.replace);
        }
      }
    }

    // Add the resulting sections to the results grid section row by section row
    for (let y = 0; y < div; y++) {
      // Create new section row
      let row1 = [];
      let row2 = [];
      let row3 = [];
      // Add each section in order to the rows
      for (let x = 0; x < div; x++) {
        let current = resultSections[y * div + x];
        row1.push(current[0][0]);
        row1.push(current[0][1]);
        row1.push(current[0][2]);
        row2.push(current[1][0]);
        row2.push(current[1][1]);
        row2.push(current[1][2]);
        row3.push(current[2][0]);
        row3.push(current[2][1]);
        row3.push(current[2][2]);
      }
      // Add the rows to the resulting grid
      resultGrid.push(row1);
      resultGrid.push(row2);
      resultGrid.push(row3);
    }
  }
  // Otherwise if the grid is divisible by 3
  else if (modThree === 0) {
    // Get the number of grid sections per side to divide out
    let div = grid.length / 3;
    // Resulting divided sections in order
    let sections = [];
    // Divide out each section row by row and column by column
    for (let y = 1; y <= div; y++) {
      for (let x = 1; x <= div; x++) {
        sections.push([
          [
            grid[3 * y - 3][3 * x - 3],
            grid[3 * y - 3][3 * x - 2],
            grid[3 * y - 3][3 * x - 1],
          ],
          [
            grid[3 * y - 2][3 * x - 3],
            grid[3 * y - 2][3 * x - 2],
            grid[3 * y - 2][3 * x - 1],
          ],
          [
            grid[3 * y - 1][3 * x - 3],
            grid[3 * y - 1][3 * x - 2],
            grid[3 * y - 1][3 * x - 1],
          ],
        ]);
      }
    }

    // The resulting sections to replace the ones in the
    // corresponding indexes of the sections array
    let resultSections = [];
    for (let section of sections) {
      // Check each three rule for a match
      let matchFound = false;
      for (
        let x = 0;
        x < rules.threeRules.length && matchFound === false;
        x++
      ) {
        let current = rules.threeRules[x];
        // This is a match if one of the current rule's match grid is identical to the current section
        for (let m = 0; m < current.matches.length && !matchFound; m++) {
          matchFound = compareGrids(current.matches[m], section);
        }
        // If the match is found add it to the repalcement sections
        if (matchFound) {
          resultSections.push(current.replace);
        }
      }
    }

    // Add the resulting sections to the results grid section row by section row
    for (let y = 0; y < div; y++) {
      // Create new section row
      let row1 = [];
      let row2 = [];
      let row3 = [];
      let row4 = [];
      // Add each section in order to the rows
      for (let x = 0; x < div; x++) {
        let current = resultSections[y * div + x];
        row1.push(current[0][0]);
        row1.push(current[0][1]);
        row1.push(current[0][2]);
        row1.push(current[0][3]);
        row2.push(current[1][0]);
        row2.push(current[1][1]);
        row2.push(current[1][2]);
        row2.push(current[1][3]);
        row3.push(current[2][0]);
        row3.push(current[2][1]);
        row3.push(current[2][2]);
        row3.push(current[2][3]);
        row4.push(current[3][0]);
        row4.push(current[3][1]);
        row4.push(current[3][2]);
        row4.push(current[3][3]);
      }
      // Add the rows to the resulting grid
      resultGrid.push(row1);
      resultGrid.push(row2);
      resultGrid.push(row3);
      resultGrid.push(row4);
    }
  }

  return resultGrid;
};

// Print out the grid and current iteration
const print = (grid, iteration) => {
  console.log("Iteration:", iteration);
  for (let y = 0; y < grid.length; y++) {
    console.log(grid[y].join(""));
  }
};

// Parse the input file of rules and into a set of rules considering all possible grid variations for each rules
const parseInput = (fileContents) => {
  // Rules for 2x2 grids
  let twoRules = [];
  // Rules for 3x3 grids
  let threeRules = [];
  // Parse each line as a new rule
  for (let line of fileContents) {
    // Split the match from the replace
    let matchReplace = line.split(" => ");
    // Split each row of the match
    let matchGrid = matchReplace[0].split("/").map((x) => x.split(""));
    // Split each row of the replace
    let replaceGrid = matchReplace[1].split("/").map((x) => x.split(""));
    // If the match is a 2x2
    if (matchGrid.length === 2) {
      // Create all other vairations of the match grid by
      // rotating and flipping the original match grid
      let matchGrids = [];
      let rightGrid = rotateTwo(matchGrid);
      let downGrid = rotateTwo(rightGrid);
      let leftGrid = rotateTwo(downGrid);
      let flipGrid = flipTwo(matchGrid);
      let rightFlip = rotateTwo(flipGrid);
      let downFlip = rotateTwo(rightFlip);
      let leftFlip = rotateTwo(downFlip);
      // Add all new variations to the match grids array
      matchGrids.push(matchGrid);
      matchGrids.push(rightGrid);
      matchGrids.push(downGrid);
      matchGrids.push(leftGrid);
      matchGrids.push(flipGrid);
      matchGrids.push(rightFlip);
      matchGrids.push(downFlip);
      matchGrids.push(leftFlip);

      // Cheack each grid against every other grid and mark the
      // ones that have matches to delete the extra copies
      for (let a = 0; a < matchGrids.length; a++) {
        if (matchGrids[a].delete !== false) {
          for (let b = a + 1; b < matchGrids.length; b++) {
            if (matchGrids[b].delete !== false) {
              let gridsMatch = compareGrids(matchGrids[a], matchGrids[b]);
              if (gridsMatch) matchGrids[b].delete = true;
            }
          }
        }
      }

      // Filter out the match grid variations that are marked for deletion
      matchGrids = matchGrids.filter((x) => x.delete !== true);

      // Add the new two rule to the output with all unique
      // match variations and the replacement output
      twoRules.push({
        matches: matchGrids,
        replace: replaceGrid,
      });
    }
    // If the match is a 3x3
    if (matchGrid.length === 3) {
      // Create all other vairations of the match grid by
      // rotating and flipping the original match grid
      let matchGrids = [];
      let rightGrid = rotateThree(matchGrid);
      let downGrid = rotateThree(rightGrid);
      let leftGrid = rotateThree(downGrid);
      let flipGrid = flipThree(matchGrid);
      let rightFlip = rotateThree(flipGrid);
      let downFlip = rotateThree(rightFlip);
      let leftFlip = rotateThree(downFlip);
      // Add all new variations to the match grids array
      matchGrids.push(matchGrid);
      matchGrids.push(rightGrid);
      matchGrids.push(downGrid);
      matchGrids.push(leftGrid);
      matchGrids.push(flipGrid);
      matchGrids.push(rightFlip);
      matchGrids.push(downFlip);
      matchGrids.push(leftFlip);

      // Cheack each grid against every other grid and mark the
      // ones that have matches to delete the extra copies
      for (let a = 0; a < matchGrids.length; a++) {
        if (matchGrids[a].delete !== false) {
          for (let b = a + 1; b < matchGrids.length; b++) {
            if (matchGrids[b].delete !== false) {
              let gridsMatch = compareGrids(matchGrids[a], matchGrids[b]);
              if (gridsMatch) matchGrids[b].delete = true;
            }
          }
        }
      }

      // Filter out the match grid variations that are marked for deletion
      matchGrids = matchGrids.filter((x) => x.delete !== true);

      // Add the new three rule to the output with all unique
      // match variations and the replacement output
      threeRules.push({
        matches: matchGrids,
        replace: replaceGrid,
      });
    }
  }

  return { twoRules, threeRules };
};

// Compare 2 grids. Return true if they match
const compareGrids = (gridA, gridB) => {
  let result = true;
  for (let y = 0; y < gridA.length && result === true; y++) {
    for (let x = 0; x < gridA[y].length && result === true; x++) {
      result = gridA[y][x] === gridB[y][x];
    }
  }
  return result;
};

// Horizontal flip
const flipTwo = (grid) => {
  let newGrid = [
    ["", ""],
    ["", ""],
  ];

  newGrid[0][0] = grid[0][1];
  newGrid[0][1] = grid[0][0];
  newGrid[1][0] = grid[1][1];
  newGrid[1][1] = grid[1][0];

  return newGrid;
};

// Rotate 90 degrees clockwise
const rotateTwo = (grid) => {
  let newGrid = [
    ["", ""],
    ["", ""],
  ];

  newGrid[0][0] = grid[1][0];
  newGrid[0][1] = grid[0][0];
  newGrid[1][0] = grid[1][1];
  newGrid[1][1] = grid[0][1];

  return newGrid;
};

// Horizontal flip
const flipThree = (grid) => {
  let newGrid = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  newGrid[0][0] = grid[0][2];
  newGrid[0][1] = grid[0][1];
  newGrid[0][2] = grid[0][0];
  newGrid[1][0] = grid[1][2];
  newGrid[1][1] = grid[1][1];
  newGrid[1][2] = grid[1][0];
  newGrid[2][0] = grid[2][2];
  newGrid[2][1] = grid[2][1];
  newGrid[2][2] = grid[2][0];

  return newGrid;
};

// Rotate 90 degrees clockwise
const rotateThree = (grid) => {
  let newGrid = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  newGrid[0][0] = grid[2][0];
  newGrid[0][1] = grid[1][0];
  newGrid[0][2] = grid[0][0];
  newGrid[1][0] = grid[2][1];
  newGrid[1][1] = grid[1][1];
  newGrid[1][2] = grid[0][1];
  newGrid[2][0] = grid[2][2];
  newGrid[2][1] = grid[1][2];
  newGrid[2][2] = grid[0][2];

  return newGrid;
};
