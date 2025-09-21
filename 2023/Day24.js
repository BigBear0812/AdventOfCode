// Puzzle for Day 24: https://adventofcode.com/2023/day/24
import { init } from "z3-solver";

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = async (fileContents) => {
  // Generate points from input
  let lines = [];
  for (let line of fileContents) {
    // Parse the line using regex
    let matches = line.match(
      /(\d+), (\d+), (\d+) @  ?([-\d]+),  ?([-\d]+),  ?([-\d]+)/,
    );
    // Get the point and velocity objects
    let point1 = {
      x: parseInt(matches[1]),
      y: parseInt(matches[2]),
      z: parseInt(matches[3]),
    };
    let velocity = {
      x: parseInt(matches[4]),
      y: parseInt(matches[5]),
      z: parseInt(matches[6]),
    };
    // Calculate the next point
    let point2 = {
      x: point1.x + velocity.x,
      y: point1.y + velocity.y,
      z: point1.z + velocity.z,
    };
    // Got the basic algebra for this from https://www.topcoder.com/thrive/articles/Geometry%20Concepts%20part%202:%20%20Line%20Intersection%20and%20its%20Applications
    let A = point2.y - point1.y;
    let B = point1.x - point2.x;
    let C = A * point1.x + B * point1.y;
    // Add to the array of lines
    lines.push({ points: [point1, point2], velocity, A, B, C });
  }

  // Get the results for each part
  let result1 = part1(lines);
  let result2 = await part2(lines);

  return { part1: result1, part2: result2 };
};

/**
 * Solves for Part 1
 * @param {*} lines
 * @returns
 */
const part1 = (lines) => {
  // Compare lines for intersections
  let min = 200000000000000;
  let max = 400000000000000;
  let inTheZone = 0;
  // Compare every line to every other line
  for (let l1 = 0; l1 < lines.length; l1++) {
    for (let l2 = l1 + 1; l2 < lines.length; l2++) {
      // Determine if the lines are parallel or intersect using this algebra https://www.topcoder.com/thrive/articles/Geometry%20Concepts%20part%202:%20%20Line%20Intersection%20and%20its%20Applications
      let det = lines[l1].A * lines[l2].B - lines[l2].A * lines[l1].B;
      if (det != 0) {
        // If not parallel get the x and y coordinate fo the intersection
        let interX =
          (lines[l2].B * lines[l1].C - lines[l1].B * lines[l2].C) / det;
        let interY =
          (lines[l1].A * lines[l2].C - lines[l2].A * lines[l1].C) / det;
        // Check if any of the dimensions compared to the start point of each line put this intersection in the past
        let past1X =
          (interX - lines[l1].points[0].x) / lines[l1].velocity.x < 0;
        let past1Y =
          (interY - lines[l1].points[0].y) / lines[l1].velocity.y < 0;
        let past2X =
          (interX - lines[l2].points[0].x) / lines[l2].velocity.x < 0;
        let past2Y =
          (interY - lines[l2].points[0].y) / lines[l2].velocity.y < 0;
        let inPast = past1X || past1Y || past2X || past2Y;

        // Add to the total if this intersection is in the defined zone and is not in the past
        if (
          interX >= min &&
          interX <= max &&
          interY >= min &&
          interY <= max &&
          !inPast
        )
          inTheZone++;
      }
    }
  }

  return inTheZone;
};

/**
 * Solves for part 2
 * @param {*} lines
 * @returns
 */
const part2 = async (lines) => {
  // Adapted this solution from jeis93's solution. I'm still learning how to use Z3
  // but this was extremely helpful since I had no idea where to start on the math for this.
  // Reddit: https://www.reddit.com/r/adventofcode/comments/18pnycy/comment/kerwjsy/?utm_source=share&utm_medium=web2x&context=3
  // GitHub: https://github.com/joeleisner/advent-of-code-2023/blob/main/days/24/mod.ts
  const { Context } = await init();
  const { Real, Solver } = Context("main");

  // Define the parameters to solve for
  const x = Real.const("x");
  const y = Real.const("y");
  const z = Real.const("z");

  const vx = Real.const("vx");
  const vy = Real.const("vy");
  const vz = Real.const("vz");

  // Create new Solver
  const solver = new Solver();

  // Add each line's info to the solver
  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    const t = Real.const(`t${l}`);

    solver.add(t.ge(0));
    solver.add(
      x.add(vx.mul(t)).eq(t.mul(line.velocity.x).add(line.points[0].x)),
    );
    solver.add(
      y.add(vy.mul(t)).eq(t.mul(line.velocity.y).add(line.points[0].y)),
    );
    solver.add(
      z.add(vz.mul(t)).eq(t.mul(line.velocity.z).add(line.points[0].z)),
    );
  }

  // Check, if it is satisfied with the data provided
  const satisfied = await solver.check();

  if (satisfied != "sat") "Z3 Solver Unsatisfied";

  // Get a solution model
  const model = solver.model();

  // Get the parameters for x, y, and z and sum them.
  return [model.eval(x), model.eval(y), model.eval(z)].reduce(
    (total, val) => (total += Number(val)),
    0,
  );
};
