// Puzzle for Day 17: https://adventofcode.com/2021/day/17

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  const matches = fileContents[0].match(
    /x=([-\d]+)..([-\d]+), y=([-\d]+)..([-\d]+)/,
  );
  const targetArea = {
    xMin: parseInt(matches[1]),
    xMax: parseInt(matches[2]),
    yMax: parseInt(matches[3]),
    yMin: parseInt(matches[4]),
  };

  const posXVel = [];
  let foundMinX = false;
  let foundMaxX = false;
  for (let x = 0; !foundMinX || !foundMaxX; x++) {
    let triangleNumber = (x * (x + 1)) / 2;
    if (
      triangleNumber >= targetArea.xMin &&
      triangleNumber <= targetArea.xMax
    ) {
      posXVel.push(x);
      foundMinX = true;
    } else if (foundMinX) {
      foundMaxX = true;
    }
  }

  let part1Final;
  let yMax = Math.abs(targetArea.yMax);
  for (let x of posXVel) {
    for (let y = 0; y < yMax; y++) {
      let result = runSim(targetArea, x, y);
      if (result && (!part1Final || part1Final.yMax < result.yMax))
        part1Final = result;
    }
  }

  return { part1: part1Final.yMax, part2: null };
};

const runSim = (targetArea, xVel, yVel) => {
  let xPos = 0;
  let yPos = 0;
  let yMax = 0;
  let xCurVel = xVel;
  let yCurVel = yVel;
  let landed = false;
  let landedLoc = null;
  for (
    let t = 1;
    xPos <= targetArea.xMax && yPos >= targetArea.yMax && !landed;
    t++
  ) {
    if (
      xPos >= targetArea.xMin &&
      xPos <= targetArea.xMax &&
      yPos <= targetArea.yMin &&
      yPos >= targetArea.yMax
    ) {
      landed = true;
      landedLoc = { t, xPos, yPos, xVel, yVel, yMax };
    }

    xPos += xCurVel;
    yPos += yCurVel;
    xCurVel -= xCurVel > 0 ? 1 : 0;
    yCurVel -= 1;
    if (yPos > yMax) yMax = yPos;
  }

  return landedLoc;
};
