// Puzzle for Day 13: https://adventofcode.com/2021/day/13

export const run = (fileContents) => {
  // Store the points on the paper
  let points = new Map();
  // Save the folds in the paper
  const folds = [];
  // Flag to switch over after parsing in all of the points
  let parsePoints = true;
  fileContents.forEach((line) => {
    // If this is a blank line then switch to parsing folds
    if (line === "") {
      parsePoints = false;
      return;
    }
    // Parse in a point
    if (parsePoints) {
      const splits = line.split(",");
      const x = parseInt(splits[0]);
      const y = parseInt(splits[1]);
      points.set(line, { x, y });
    }
    // Parse in a fold instruction
    else {
      const matches = line.match(/fold along ([yx])=(\d+)/);
      folds.push({
        dir: matches[1],
        num: matches[2],
      });
    }
  });

  // Part 1
  // Make a single fold
  points = makeFold(points, folds[0]);

  // Count the number of points left in the map
  const part1 = points.size;

  // Part 2
  // Complete the rest of the folds
  for (let f = 1; f < folds.length; f++) {
    points = makeFold(points, folds[f]);
  }

  // Determine the max X and Y values for the display
  const maxes = points.values().reduce(
    (maxes, point) => {
      if (point.x > maxes.x) maxes.x = point.x;
      if (point.y > maxes.y) maxes.y = point.y;
      return maxes;
    },
    { x: 0, y: 0 },
  );

  // Generate the output of the remaining points
  let part2 = "\n";
  // Determine if each point in the multi-line output should be filled or empty
  for (let y = 0; y <= maxes.y; y++) {
    let outputLine = "";
    for (let x = 0; x <= maxes.x; x++) {
      if (points.has(`${x},${y}`)) {
        outputLine += "#";
      } else {
        outputLine += " ";
      }
    }
    part2 += outputLine + "\n";
  }

  return { part1, part2 };
};

/**
 * Perform one fold on the set of points
 * @param {Map<string, {x: number, y: number}>} points The set of points on the paper
 * @param {{dir: string, num: number}} fold The fold to make
 * @return {Map<string, {x: number, y: number}>} The updated set of points after the fold
 */
const makeFold = (points, fold) => {
  // Create a new map to store points in
  const newPoints = new Map();

  // Check each point to see if it is covered by another point after completing the fold
  points.keys().forEach((pointKey) => {
    // The current point
    const point = points.get(pointKey);

    // Handle a Y axis fold
    if (fold.dir === "y") {
      // If this point is affected by the fold
      if (point.y > fold.num) {
        // Get the new Y value for the point
        const newY = fold.num - (point.y - fold.num);
        // Generate the new map key it will have
        const newKey = `${point.x},${newY}`;
        // Add this to the map only if it has not already been added
        if (!newPoints.has(newKey)) {
          newPoints.set(newKey, { x: point.x, y: newY });
        }
      }
      // Otherwise add it to the new points map
      else {
        newPoints.set(pointKey, point);
      }
    }

    // Handle an X axis fold
    if (fold.dir === "x") {
      // If this point is affected by the fold
      if (point.x > fold.num) {
        // Get the new X value for the point
        const newX = fold.num - (point.x - fold.num);
        // Generate the new map key it will have
        const newKey = `${newX},${point.y}`;
        // Add this to the map only if it has not already been added
        if (!newPoints.has(newKey)) {
          newPoints.set(newKey, { x: newX, y: point.y });
        }
      }
      // Otherwise add it to the new points map
      else {
        newPoints.set(pointKey, point);
      }
    }
  });

  return newPoints;
};
