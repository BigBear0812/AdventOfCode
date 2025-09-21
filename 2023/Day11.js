// Puzzle for Day 11: https://adventofcode.com/2023/day/11

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Get the results for parts 1 and 2
  let result1 = analyzeImage(fileContents, 1);
  let result2 = analyzeImage(fileContents, 999999);

  return { part1: result1, part2: result2 };
};

const analyzeImage = (fileContents, expandedBy) => {
  // Convert the string array input into 2d array
  let image = fileContents.map((l) => l.split(""));

  // Get the list of galaxy coordinates from the image
  let galaxies = [];
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      if (image[y][x] === "#") {
        galaxies.push({ x, y });
      }
    }
  }

  // Expand the coordinate values based on the empty rows in the image
  galaxies = expandCoordinates(image, galaxies, expandedBy);
  // Transform the data across the x/y axis
  let t1 = transformData(image, galaxies);
  image = t1.image;
  galaxies = t1.galaxies;
  // Expand the coordinate values based on the empty rows in the image
  galaxies = expandCoordinates(image, galaxies, expandedBy);

  // Get the total distance from every point to every other point
  let totalDistance = 0;
  for (let a = 0; a < galaxies.length; a++) {
    for (let b = a + 1; b < galaxies.length; b++) {
      totalDistance +=
        Math.abs(galaxies[a].x - galaxies[b].x) +
        Math.abs(galaxies[a].y - galaxies[b].y);
    }
  }

  return totalDistance;
};

/**
 * Transforms the image and galaxy coordinates around the diagonal x/y axis
 * @param {string[][]} image
 * @param {{x: number, y: number}[]} galaxies
 * @returns {image: string[][], galaxies: {x: number, y: number}[]}
 */
const transformData = (image, galaxies) => {
  image = image[0].map((_, x) => image.map((_, y) => image[y][x]));
  galaxies = galaxies.map((g, i) => {
    return { x: g.y, y: g.x };
  });
  return { image, galaxies };
};

/**
 * Expands the coordinates for the galaxies based on the empty rows in the image. Only expands in the y direction
 * @param {string[][]} image
 * @param {{x: number, y: number}[]} galaxies
 * @param {number} expandedBy
 * @returns Expanded galaxy coordinates
 */
const expandCoordinates = (image, galaxies, expandedBy) => {
  // The new coordinate of the galaxies from the given starting coordinates
  let newGalaxies = JSON.parse(JSON.stringify(galaxies));
  // Check each row to see if it should be expanded
  for (let y = 0; y < image.length; y++) {
    // Count the empty spaces in the row
    let emptyCount = 0;
    for (let x = 0; x < image[y].length; x++) {
      if (image[y][x] === ".") emptyCount++;
    }
    // If the number of empties equals the row length this row is empty
    if (emptyCount === image[y].length) {
      for (let g = 0; g < galaxies.length; g++) {
        // Expand only the coordinates with y values below the current row
        if (galaxies[g].y > y) newGalaxies[g].y += expandedBy;
      }
    }
  }

  return newGalaxies;
};
