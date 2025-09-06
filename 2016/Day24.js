// Puzzle for Day 24: https://adventofcode.com/2016/day/24

export const run = (fileContents) => {
  // Parse in the data from the input file. This is
  // a grid from the input and a map of the points
  // and their locations on the map
  let data = parseInput(fileContents);

  // Create a matrix (2D array) of the shortest distance
  // from any point to any other point on the grid
  let matrix = createDistanceMatrix(data);

  // Find the shortest path for Part 1
  let shortestPath1 = findShortestPath(matrix);

  // Find the shortest path for Part 2
  let shortestPath2 = findShortestPath(matrix, true);

  return { part1: shortestPath1, part2: shortestPath2 };
};

// Depth First Search (DFS) all paths. Return the distance travlled for
// the path and continue passing up only the shortest distance paths until
// finally only the shortest opath is returned
const findShortestPath = (
  matrix,
  returnToZero = false,
  visited = [0],
  current = 0,
  distTravelled = 0,
) => {
  // Check for a base case where all points have been visited
  if (visited.length === matrix.length) {
    // If returning back to 0 add that distance otherwise
    // just return the distance travelled
    if (returnToZero) return distTravelled + matrix[current][0];
    else return distTravelled;
  }

  // If not at the end of the path make recursive calls to this
  // method for any remaining points to be visited and save their
  // shortest path values
  let allDistances = [];
  for (let x = 0; x < matrix[current].length; x++) {
    if (x !== current && visited.indexOf(x) === -1) {
      let newVisited = JSON.parse(JSON.stringify(visited));
      newVisited.push(x);
      allDistances.push(
        findShortestPath(
          matrix,
          returnToZero,
          newVisited,
          x,
          distTravelled + matrix[current][x],
        ),
      );
    }
  }

  // Find the lowest path value returned and return only that value
  let lowest = Number.MAX_SAFE_INTEGER;
  for (let dist of allDistances) {
    if (dist < lowest) lowest = dist;
  }

  return lowest;
};

// Create a matrix (2D array) of all of the points shortest distance to any other point
const createDistanceMatrix = (data) => {
  // Resulting matrix
  let matrix = [];
  // For each point find the shortest path to all other points and add it the resulting
  // array to the matirx in the correct spot in it's array
  data.points.forEach((val, key) => {
    let distances = distanceToOtherPoints(data, key);
    matrix[parseInt(key)] = distances;
  });

  return matrix;
};

// Breadth First Seach (BFS) for the shortest path from the
// starting point to all other points in the maze
const distanceToOtherPoints = (data, start) => {
  // The distnce to point at the given index
  let distances = [];
  // Add a zero distance for the distance from this point to
  // itself and keep track of the number of distances found
  distances[parseInt(start)] = 0;
  let distancesCount = 1;

  // The count of the number of point there are to visit total
  let pointsCount = 0;
  data.points.forEach(() => {
    pointsCount++;
  });

  // The states of search running the maze starting at the current point's location
  let states = [];
  states.push({
    x: data.points.get(start).x,
    y: data.points.get(start).y,
    distance: 0,
  });

  // Keep track of the points that have been visited and start with the current point
  let seenPoints = new Set();
  seenPoints.add(`${data.points.get(start).x},${data.points.get(start).y}`);

  // Continue searching while there are still places left to go and
  // all points have not been visited yet
  while (states.length > 0 && distancesCount <= pointsCount) {
    // Get the next states to examine
    let current = states.shift();

    // If the current symbol in the grid is one of the points then add the
    // current distance to the distances array for this points index in the array
    let gridSymbol = data.grid[current.y][current.x];
    if (gridSymbol !== "#" && gridSymbol !== ".") {
      distances[parseInt(gridSymbol)] = current.distance;
      distancesCount++;
    }

    // Find next possible points from the current location
    let possiblePoints = [
      { x: current.x, y: current.y + 1 }, // Up
      { x: current.x, y: current.y - 1 }, // Down
      { x: current.x - 1, y: current.y }, // Left
      { x: current.x + 1, y: current.y }, // Right
    ];

    // For each of the possible points only add a new state
    // if it is on the grid, if it's symbol is not a wall (#),
    // and it has not been visited yet
    for (let point of possiblePoints) {
      let uniqueKey = `${point.x},${point.y}`;
      if (
        point.y >= 0 &&
        point.y < data.grid.length &&
        point.x >= 0 &&
        point.x < data.grid[point.y].length &&
        data.grid[point.y][point.x] !== "#" &&
        !seenPoints.has(uniqueKey)
      ) {
        // Add the new state to the end of the states array and
        // add the new point to the seen points set
        seenPoints.add(uniqueKey);
        states.push({
          x: point.x,
          y: point.y,
          distance: current.distance + 1,
        });
      }
    }
  }

  return distances;
};

// Used for testing to print all data points locations out after being parsed
const printPoints = (points) => {
  points.forEach((val, key) => {
    console.log(`Point: ${key} Location: ${val.x}, ${val.y}`);
  });
};

// Used for testing to print the grid to the screen after parsing in from the file to check for accuracy
const printGrid = (grid) => {
  for (let y = 0; y < grid.length; y++) {
    let line = "";
    for (let x = 0; x < grid[y].length; x++) {
      line += grid[y][x];
    }
    console.log(line);
  }
};

// Parse in the input data from the file
const parseInput = (fileContents) => {
  // The raw text grid as a 2D array
  let grid = [];
  // A map of each point and their locations
  let points = new Map();

  for (let line of fileContents) {
    // Split each line into an array
    let row = line.split("");
    // Check the line for any point symbols
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== "#" && row[x] !== ".")
        points.set(row[x], { x, y: grid.length });
    }
    // Add the array to the grid
    grid.push(row);
  }

  return { grid, points };
};
