// Puzzle for Day 3: https://adventofcode.com/2016/day/3

export const run = (fileContents) => {
  // Parse the input into 2d array's of triangle info
  let triangles1 = parseInput1(fileContents);
  let triangles2 = parseInput2(fileContents);

  // Count the number of valid triangles in the set
  let result1 = countValidTriangles(triangles1);
  let result2 = countValidTriangles(triangles2);

  return { part1: result1, part2: result2 };
};

// Parse the input according to part 1
const parseInput1 = (fileContents) => {
  // Regex for reading each line
  let reg = new RegExp(/(\d+) +(\d+) +(\d+)/);
  // Resulting sets of triangles
  let triangles = [];

  // For each line parse the triangle info into an array of integers
  for (let line of fileContents) {
    let matches = line.match(reg);
    triangles.push([
      parseInt(matches[1]),
      parseInt(matches[2]),
      parseInt(matches[3]),
    ]);
  }

  return triangles;
};

// Parse the input according to part 2
const parseInput2 = (fileContents) => {
  // Regex for reading each line
  let reg = new RegExp(/(\d+) +(\d+) +(\d+)/);
  // Resulting sets of triangles
  let triangles = [];
  // Temporary array for triangles being built from parsing each line
  let t1 = [];
  let t2 = [];
  let t3 = [];

  // Parse each line one at a time
  for (let x = 1; x <= fileContents.length; x++) {
    // Get the line and the digits in each line
    let line = fileContents[x - 1];
    let matches = line.match(reg);

    // Push the digit from each column into a separate triangle
    t1.push(parseInt(matches[1]));
    t2.push(parseInt(matches[2]));
    t3.push(parseInt(matches[3]));

    // If this is the third line then push the three triangles
    // found into the result set of triangle info. Result t1-3
    // to empty arrays
    if (x % 3 === 0) {
      triangles.push(t1);
      triangles.push(t2);
      triangles.push(t3);
      t1 = [];
      t2 = [];
      t3 = [];
    }
  }

  return triangles;
};

// Count the number of triangles that are valid
const countValidTriangles = (triangles) => {
  let numPossible = 0;

  // Check each triangle to see if the sum of any two sides is larger than the other
  for (let triangle of triangles) {
    let result1 = triangle[0] + triangle[1] > triangle[2];
    let result2 = triangle[1] + triangle[2] > triangle[0];
    let result3 = triangle[2] + triangle[0] > triangle[1];

    // If valid add one to the number of possible triangles
    if (result1 && result2 && result3) numPossible++;
  }

  return numPossible;
};
