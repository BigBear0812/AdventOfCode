// Puzzle for Day 09: https://adventofcode.com/2025/day/9

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Create an array of point objects from the input
  const pointProps = ["x", "y"];
  const points = fileContents.map((line) =>
    // Split each line on the comma, parse the values as
    // ints, and add them to a new object using the given props
    line
      .split(",")
      .map((val) => parseInt(val))
      .reduce((out, val, ind) => ({ ...out, [pointProps[ind]]: val }), {}),
  );

  // Create a list of all the pairs of points
  const pairs = [];
  // Compare every point to every other point
  for (let a = 0; a < points.length; a++) {
    for (let b = a + 1; b < points.length; b++) {
      // Add the new pair object to the array. Include the area
      // and each of the points properties.
      pairs.push({
        area:
          (Math.abs(points[a].x - points[b].x) + 1) *
          (Math.abs(points[a].y - points[b].y) + 1),
        x1: points[a].x,
        y1: points[a].y,
        x2: points[b].x,
        y2: points[b].y,
      });
    }
  }

  // Sort the pairs by area in descending order
  pairs.sort((a, b) => b.area - a.area);

  // The answer to part 1 is the largest area
  const part1 = pairs[0].area;

  // Create an array of edges for the shape created by the points
  const edges = points.map((val, ind) => {
    const next = points[(ind + 1) % points.length];
    return {
      x1: val.x,
      y1: val.y,
      x2: next.x,
      y2: next.y,
    };
  });

  /**
   * Determine if the 1 dimensional start and end values for each line overlap
   * @param {number} aStart line a start
   * @param {number} aEnd line a end
   * @param {number} bStart line b start
   * @param {number} bEnd line b end
   * @returns {boolean} True if the line vals overlap
   */
  const overlap = (aStart, aEnd, bStart, bEnd) =>
    // If a start and end are not both less than b start and end
    !(aStart <= bStart && aStart <= bEnd && aEnd <= bStart && aEnd <= bEnd) &&
    // If a start and end are not both greater than b start and end
    !(aStart >= bStart && aStart >= bEnd && aEnd >= bStart && aEnd >= bEnd);

  // Find the first pair area that does not have an edge that
  // intersects the edge of the shape made by the edges
  const part2 = pairs.find(
    (pair) =>
      // If any edge overlaps the pairs edges then it is not inside and is not the answer
      !edges.some(
        (edge) =>
          overlap(edge.y1, edge.y2, pair.y1, pair.y2) &&
          overlap(edge.x1, edge.x2, pair.x1, pair.x2),
      ),
  ).area;
  return { part1, part2 };
};
