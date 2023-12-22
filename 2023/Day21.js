// Puzzle for Day 21: https://adventofcode.com/2023/day/21

export const run = (fileContents) => {
  // Assume the grid is square
  let grid = fileContents.map(l => l.split(''));
  let size = grid.length;
  let center = {y: Math.floor(size / 2), x: Math.floor(size / 2)};

  // Get the answer for part 1
  let result1 = gridFill(grid, center, 64);

  // Solve for part 2
  // This solution is from Github user hyper-neutrino. Their solution 
  // was far better than mine for figuring out part 2 so I converted it 
  // from python and have used it here. All credit goes to them.
  // https://github.com/hyper-neutrino/advent-of-code/blob/main/2023/day21p2.py
  // 
  // There is an excellent explanation video that explains why all of this math works.
  // https://www.youtube.com/watch?v=9UOMZSL0JTg 
  let steps = 26501365;

  let gridWidth = Math.floor(steps / size) - 1;

  let odd = Math.pow(Math.floor(gridWidth / 2) * 2 + 1, 2);
  let even = Math.pow(Math.floor((gridWidth + 1) / 2) * 2, 2);

  let oddPoints = gridFill(grid, center, size * 2 + 1);
  let evenPoints = gridFill(grid, center, size * 2);

  let cornerT = gridFill(grid, {y: size - 1, x: center.x}, size - 1);
  let cornerR = gridFill(grid, {y: center.y, x: 0}, size - 1);
  let cornerB = gridFill(grid, {y: 0, x: center.x}, size - 1);
  let cornerL = gridFill(grid, {y: center.y, x: size - 1}, size - 1);

  let smallTr = gridFill(grid, {y: size - 1, x: 0}, Math.floor(size / 2) - 1);
  let smallTl = gridFill(grid, {y: size - 1, x: size - 1}, Math.floor(size / 2) - 1);
  let smallBr = gridFill(grid, {y: 0, x: 0}, Math.floor(size / 2) - 1);
  let smallBl = gridFill(grid, {y: 0, x: size - 1}, Math.floor(size / 2) - 1);

  let largeTr = gridFill(grid, {y: size - 1, x: 0}, Math.floor(size * 3 / 2) - 1);
  let largeTl = gridFill(grid, {y: size - 1, x: size - 1}, Math.floor(size * 3 / 2) - 1);
  let largeBr = gridFill(grid, {y: 0, x: 0}, Math.floor(size * 3 / 2) - 1);
  let largeBl = gridFill(grid, {y: 0, x: size - 1}, Math.floor(size * 3 / 2) - 1);

  let result2 = odd * oddPoints + 
  even * evenPoints +
  cornerT + cornerR + cornerB + cornerL +
  (gridWidth + 1) * (smallTr + smallTl + smallBr + smallBl) +
  gridWidth * (largeTr + largeTl + largeBr + largeBl);

  return {part1: result1, part2: result2};
}

/**
 * This fills the grid stopping at the edges until the number of steps is reached
 * @param {string[][]} grid 
 * @param {{y: number, x: number}} start 
 * @param {number} maxSteps 
 * @returns 
 */
const gridFill = (grid, start, maxSteps) => {
  // Keep a queue of all points to visit. Ensure no duplicate 
  // points are added for each step to cutdown on duplicate work
  let queue = [];
  let queueUnique = new Set();
  // Add the starting point to the queue
  queue.push({y: start.y, x: start.x, steps: 0});
  // Continue while there are still points and the code has not broken out of the loop
  while(queue.length > 0){
    // Break out if the next step will reach the max steps
    if(queue[0].steps === maxSteps)
      break;

    // Get the current step location
    let current = queue.shift();

    // Get the next possible points
    let nextPossible = [];
    nextPossible.push({y: current.y-1, x: current.x, steps: current.steps+1}); // Up
    nextPossible.push({y: current.y+1, x: current.x, steps: current.steps+1}); // Down
    nextPossible.push({y: current.y, x: current.x-1, steps: current.steps+1}); // Left
    nextPossible.push({y: current.y, x: current.x+1, steps: current.steps+1}); // Right

    for(let next of nextPossible){
      // Check if each next point is valid and if so add it to the queue
      if(next.y >= 0 && 
        next.y < grid.length && 
        next.x >= 0 && 
        next.x < grid[next.y].length && 
        grid[next.y][next.x] != '#'){
          let stringNext = JSON.stringify(next);
          if(!queueUnique.has(stringNext)){
            queueUnique.add(stringNext);
            queue.push(next);
          }
        }
    }
  }

  // The length of the queue is the number of possible to visit points by this step
  return queue.length;
}