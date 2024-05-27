// Puzzle for Day 11: https://adventofcode.com/2020/day/11

export const run = (fileContents) => {
  // Run simulations for each part of the problem
  let result1 = runSim(fileContents, false);
  let result2 = runSim(fileContents, true);

  return { part1: result1, part2: result2 };
}

/**
 * Run the full simulation of a single part of the problem
 * @param {string[]} fileContents An array of strings for each line of the input file
 * @param {boolean} part2 A boolean that is true if simulating part 2
 * @returns {number} The number of occupied chairs when the simulation settles into a perpetual state
 */
const runSim = (fileContents, part2) => {
  // Get the initial grid state info from the input file
  let gridInfo = { grid: fileContents.map(x => x.split("")), occupiedCount: 0 };
  // Keep track of the results of the last round to check for a repeat
  let lastRoundOccupied;
  let lastRoundGridString;
  do{
    // Set the last round variables
    lastRoundOccupied = gridInfo.occupiedCount;
    lastRoundGridString = gridInfo.grid.reduce((output, row) => output += row.join(""), "");
    // Generate the grid info for the results of the next round of the simulation
    gridInfo = simRound(gridInfo.grid, part2);
  }
  // Confirm if the simulation should continue or stop
  while(lastRoundOccupied !== gridInfo.occupiedCount 
    && lastRoundGridString !== gridInfo.grid.reduce((output, row) => output += row.join(""), ""))

  // Once completed return the number of occupied seats from the last round of the simulation
  return gridInfo.occupiedCount;
}

/**
 * Simulate one round of the simulation
 * @param {string[][]} grid A 2D grid of the state of each space in the waiting room
 * @param {boolean} part2 A boolean that is true if simulating part 2
 * @returns {{grid: string[][], occupiedCount: number}} Return the new grid info that is the 
 * result of running the simulation for another round
 */
const simRound = (grid, part2) => {
  // Create a new grid to fill and keep track of the number of occupied seats
  let newGrid = [];
  let newGridOccupiedCount = 0;

  // Use nested for loops to check and fill each spot in the new grid
  for(let y = 0; y < grid.length; y++){
    // The current row being filled
    let row = [];
    for(let x = 0; x < grid[y].length; x++){
      // Get the current seat value
      let currentSeat = grid[y][x];
      // If this is a floor space add a floor space to this spot in the new grid and continue to the next space
      if(currentSeat === "."){
        row.push(".");
        continue;
      }
      // Fill the array with the neighboring seat values from the grid
      let neighbors = [];
      findNextChair(y, x, -1, -1, grid, neighbors, part2); // up left
      findNextChair(y, x, -1, 0, grid, neighbors, part2); // up center
      findNextChair(y, x, -1, 1, grid, neighbors, part2); // up right
      findNextChair(y, x, 0, -1, grid, neighbors, part2); // left
      findNextChair(y, x, 0, 1, grid, neighbors, part2); // right
      findNextChair(y, x, 1, -1, grid, neighbors, part2); // down left
      findNextChair(y, x, 1, 0, grid, neighbors, part2); // down center
      findNextChair(y, x, 1, 1, grid, neighbors, part2); // down right

      // Count the number of occupied seats
      let occupiedCount = 0;
      for(let neighbor of neighbors){
        if(neighbor === "#")
          occupiedCount++;
      }

      // If the seat is empty and no neighbors are occupied it should be filled
      if(currentSeat === "L" && occupiedCount === 0){
        row.push("#");
        newGridOccupiedCount++;
      }
      // If the seat is filled and has either 4 or 5 occupied seats around it (depending on which part of the puzzle is being simulated) the empty it
      else if (currentSeat === "#" && ((!part2 && occupiedCount >= 4) || (part2 && occupiedCount >= 5)))
        row.push("L");
      // Otherwise the seat remains the same
      else{
        row.push(currentSeat);
        if(currentSeat === "#")
          newGridOccupiedCount++;
      }
    }
    // Add the complete row to the new grid
    newGrid.push(row);
  }

  // Return the new grid info object
  return { grid: newGrid, occupiedCount: newGridOccupiedCount }
}

/**
 * Add the valid seat value for single neighbor to the neighbors array if one can be found in the direction specified
 * @param {number} y The current seat being examined y coordinate
 * @param {number} x The current seat being examined x coordinate
 * @param {number} yDelta The current seat being examined y coordinate change to find the neighbor
 * @param {number} xDelta The current seat being examined x coordinate change to find the neighbor
 * @param {string[][]} grid The current grid being examined
 * @param {string[]} neighbors The neighbors values for the current spot being examined
 * @param {boolean} allowRecursion A boolean that is true if simulating part 2
 */
const findNextChair = (y, x, yDelta, xDelta, grid, neighbors, allowRecursion) => {
  let neighborY = y + yDelta;
  let neighborX = x + xDelta;
  if(neighborY < 0 || neighborY >= grid.length || neighborX < 0 || neighborX >= grid[neighborY].length)
    return;
  let neighborSeat = grid[neighborY][neighborX];
  if(neighborSeat === "L" || neighborSeat === "#"){
    neighbors.push(neighborSeat);
    return;
  }
  else if(neighborSeat === '.' && allowRecursion){
    return findNextChair(neighborY, neighborX, yDelta, xDelta, grid, neighbors, allowRecursion);
  }
}