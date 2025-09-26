// Puzzle for Day 17: https://adventofcode.com/2021/day/17

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the target area using regex
  const matches = fileContents[0].match(
    /x=([-\d]+)..([-\d]+), y=([-\d]+)..([-\d]+)/,
  );
  // Parse target area values to integers
  const targetArea = {
    xMin: parseInt(matches[1]),
    xMax: parseInt(matches[2]),
    yMax: parseInt(matches[3]),
    yMin: parseInt(matches[4]),
  };

  // Get possible X velocities which can end up at least once in the target area
  const posXVel = [];
  // Check all velocities from 0 to the target area xMin
  for (let x = 0; x < targetArea.xMin; x++) {
    // Set starting state
    let inTargetArea = false;
    let xPos = 0;
    let xVel = x;
    // Continue until the velocity stop or it ends up in the target area
    while (xVel > 0 && !inTargetArea) {
      xPos += xVel;
      xVel -= 1;
      if (xPos >= targetArea.xMin && xPos <= targetArea.xMax)
        inTargetArea = true;
    }

    // If it got to the target area add it to the array
    if (inTargetArea) posXVel.push(x);
  }

  // Simulate all possible shots from 0 to the top of the target area
  // for each of the x velocities that have been found. This gives the
  // result for every possible "trick shot".
  const allResults = [];
  let yMax = Math.abs(targetArea.yMax);
  for (let x of posXVel) {
    // Start at the top of the target area and move up to the absolute
    // value of the bottom of the target area
    for (let y = targetArea.yMin; y < yMax; y++) {
      // Run the simulation and save the result if it is not null
      let result = runSim(targetArea, x, y);
      if (result) allResults.push(result);
    }
  }

  // Find the result with the highest yMax Value
  const part1 = allResults.reduce(
    (highest, result) => (result.yMax > highest ? result.yMax : highest),
    Number.MIN_SAFE_INTEGER,
  );

  // Add the number of results to the number of locations inside of
  // the target area since each one could also be hit with a direct
  // shot where the coordinates of the location would be the
  // starting X and Y velocities
  const part2 =
    allResults.length +
    (targetArea.xMax - targetArea.xMin + 1) *
      (targetArea.yMin - targetArea.yMax + 1);

  return { part1, part2 };
};

/**
 * Sun the simulation of firing form start given the target area
 * and starting velocity in each direction
 * @param {{
 *  xMin: number,
 *  xMax: number,
 *  yMin: number,
 *  yMax Number}}} targetArea The boundaries of the target area
 * @param {number} xVel The starting X velocity
 * @param {number} yVel The starting Y velocity
 * @returns {{
 *  xPos: Number,
 *  yPos: Number,
 *  yMax: Number,
 *  xVel: Number,
 *  yVel: Number,
 *  t: Number
 * }} Object that contains the final position, starting velocities,
 * max Y value reached, and the time at which is reached the
 * final position
 */
const runSim = (targetArea, xVel, yVel) => {
  // Starting position
  let xPos = 0;
  let yPos = 0;
  // Max Y value reached
  let yMax = 0;
  // Current velocity
  let xCurVel = xVel;
  let yCurVel = yVel;
  // Has it landed in the target area
  let landed = false;
  // Final landing info
  let landedLoc = null;
  // Simulate each position the probe will move through given
  // the starting velocity. Stop if the target area was
  // missed or it the probe landed in the target area
  for (
    let t = 1;
    xPos <= targetArea.xMax && yPos >= targetArea.yMax && !landed;
    t++
  ) {
    // If it is in the target area stop and set the final output
    if (
      xPos >= targetArea.xMin &&
      xPos <= targetArea.xMax &&
      yPos <= targetArea.yMin &&
      yPos >= targetArea.yMax
    ) {
      landed = true;
      landedLoc = { t, xPos, yPos, xVel, yVel, yMax };
    }

    // Update the position and velocities
    xPos += xCurVel;
    yPos += yCurVel;
    xCurVel -= xCurVel > 0 ? 1 : 0;
    yCurVel -= 1;
    // See if a new Y max has been reached
    if (yPos > yMax) yMax = yPos;
  }

  return landedLoc;
};
