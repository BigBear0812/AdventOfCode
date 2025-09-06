// Puzzle for Day 13: https://adventofcode.com/2016/day/13

export const run = (fileContents) => {
  // Parse the favorite numebr from the input
  let favNum = parseInt(fileContents[0]);
  // Set the goal location as stated in the puzzle
  let goal = { x: 31, y: 39 };

  // Get the results
  let results = stepsToGoal(favNum, goal);

  return { part1: results.numSteps, part2: results.locationsBelow50 };
};

// Breadth Frist Search (BFS) to get the number of
// steps to the goal and the number of unique locations
// under 50 steps from the start
const stepsToGoal = (favNum, goal) => {
  // Start
  let startingLocation = { x: 1, y: 1 };

  // Add start to all states being tracked
  let states = [];
  states.push({
    location: startingLocation,
    numMoves: 0,
  });

  // Keep track of previously seen locations
  let seenLocations = new Set();
  seenLocations.add(`x:1,y:1`);

  // Least steps taken to reach the goal
  let numSteps = null;

  // Number of locations below 50 steps including the start
  let locationsBelow50 = 1;

  // Continue looking while there are still states left to
  // process and the goal has not been reached
  while (states.length > 0 && numSteps === null) {
    // Get the next state from the front of the array
    let current = states.shift();

    // Check if at the goal
    if (current.location.x === goal.x && current.location.y === goal.y) {
      numSteps = current.numMoves;
    }
    // Not at goal
    else {
      // This being here assumes the goal location is more than 50 steps away
      if (current.numMoves <= 49) locationsBelow50++;

      // Find next possible states
      let possibleNextLocations = [];
      possibleNextLocations.push({
        x: current.location.x + 1,
        y: current.location.y,
      });
      possibleNextLocations.push({
        x: current.location.x - 1,
        y: current.location.y,
      });
      possibleNextLocations.push({
        x: current.location.x,
        y: current.location.y + 1,
      });
      possibleNextLocations.push({
        x: current.location.x,
        y: current.location.y - 1,
      });

      // Check each next state
      for (let next of possibleNextLocations) {
        // Only consider the state if it is positive and has not been seen before
        if (
          next.x >= 0 &&
          next.y >= 0 &&
          !seenLocations.has(`x:${next.x},y:${next.y}`)
        ) {
          // Add this spot to seen locations
          seenLocations.add(`x:${next.x},y:${next.y}`);

          // Find out if this is a wall or open space
          let comp =
            next.x * next.x +
            3 * next.x +
            2 * next.x * next.y +
            next.y +
            next.y * next.y;
          comp += favNum;

          let oneCount = (comp >>> 0)
            .toString(2)
            .split("")
            .map((x) => parseInt(x))
            .reduce((total, x) => total + x, 0);

          let isWall = oneCount % 2;

          // If it is open space add it to the next possible states to check
          if (isWall === 0)
            states.push({
              location: next,
              numMoves: current.numMoves + 1,
            });
        }
      }
    }
  }

  return { numSteps, locationsBelow50 };
};
