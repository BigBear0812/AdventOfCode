// Puzzle for Day 25: https://adventofcode.com/2018/day/25

export const run = (fileContents) => {
  // Get the stars info from the input file
  let stars = parseInput(fileContents);

  // Get all constellations for the map of stars
  let constellations = findConstellations(stars);

  return { part1: constellations.length };
};

// Find all of the constellations in the map of stars
const findConstellations = (stars) => {
  // All constellations
  let constellations = [];
  // Remaining stars to add to a constellation
  let remainingStars = Array.from(stars.values());
  // Continue while there are still remaining stars to examine
  while (remainingStars.length > 0) {
    // Add the first star to the current constellation being built
    let currentConstellation = [remainingStars[0].id];
    // Keep track of the previous star count for the current
    // constellation to find if this constellation is complete
    let constellationCount;
    do {
      // Previous current constellation count
      constellationCount = currentConstellation.length;
      // Track the new stars to add to this constellation
      let newStars = new Set();
      // Compare every star in the constellation to every remaining star
      for (let constStarId of currentConstellation) {
        for (let star of remainingStars) {
          // Skip the comparison if the constellation start and the
          // remaining start id's match. Also, skip if this id has
          // already been added to the new stars set.
          if (star.id !== constStarId && !newStars.has[star.id]) {
            // Get the constellation start info from the full stars map
            let constStar = stars.get(constStarId);
            // Calc the distance between the two stars
            let dist = distance(constStar, star);
            // If the distance is less than or equal to three add it to the new stars set
            if (dist <= 3) {
              newStars.add(star.id);
            }
          }
        }
      }
      // Update the current constellation with the new stars
      newStars.forEach((s) => {
        currentConstellation.push(s);
      });
      // currentConstellation = currentConstellation.concat(newStars);
      // Update remaining stars to remove stars that were just added to this constellation
      remainingStars = remainingStars.filter(
        (s) => !currentConstellation.includes(s.id),
      );
    } while (
      // Continue looping if any stars were added to the current constellation
      currentConstellation.length !== constellationCount
    );

    // Add this new constellation to the full set of constellations
    constellations.push(currentConstellation);
  }

  return constellations;
};

// Manhattan diastance between two coordinates
const distance = (pointA, pointB) => {
  // Diff for each parameter
  let aDiff = pointA.a - pointB.a;
  let bDiff = pointA.b - pointB.b;
  let cDiff = pointA.c - pointB.c;
  let dDiff = pointA.d - pointB.d;

  // Add together the absolute values for each parameter
  return Math.abs(aDiff) + Math.abs(bDiff) + Math.abs(cDiff) + Math.abs(dDiff);
};

// Parse the input file into a map of stars
const parseInput = (fileContents) => {
  // All stars map
  let stars = new Map();

  // Treat each line as a new star
  for (let l = 0; l < fileContents.length; l++) {
    // Current line
    let line = fileContents[l];
    // Split the line on commas to get each point of the star
    let points = line.split(",");
    // Set the points and add to the map
    let a = parseInt(points[0]);
    let b = parseInt(points[1]);
    let c = parseInt(points[2]);
    let d = parseInt(points[3]);
    stars.set(l, { id: l, a, b, c, d });
  }

  return stars;
};
