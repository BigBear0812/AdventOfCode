// Puzzle for Day 3: https://adventofcode.com/2019/day/3

export const run = (fileContents) => {
  // Parse the lines of the input file into wire data objects
  let wire1 = parseLine(fileContents[0]);
  let wire2 = parseLine(fileContents[1]); 

  // Create a map for stoging all the coordinates that wire one occupies
  let wire1Map = new Map();
  // Add the start to the map
  wire1Map.set(key(0,0), 0);

  // Keep track of the x, y, and steps to reach the current point 
  let x = 0;
  let y = 0;
  let steps = 0;
  // Iterate through each move in the instructionas one step at a time
  for(let move = 0; move < wire1.length; move++){
    for(let count = 0; count < wire1[move].dist; count++){
      // Increment the step counter
      steps++;
      // Update x and y based on the coordinates
      switch(wire1[move].dir){
        case "U":
          y--;
          break;
        case "D":
          y++;
          break;
        case "L":
          x--;
          break;
        case "R":
          x++;
          break;
      }
      // If the map does not already this coordinate add 
      // it with the number of steps it took to reach it
      if(!wire1Map.has(key(x, y)))
        wire1Map.set(key(x, y), steps);
    }
  }

  // Keep track of all places where wire 1 and 
  // wire 2 occupy the same location
  let intersections = [];
  // Reset the x, y, and step values to 0 for examining wire 2
  x = 0;
  y = 0;
  steps = 0;
  // Iterate through each move in the instructionas one step at a time
  for(let move = 0; move < wire2.length; move++){
    for(let count = 0; count < wire2[move].dist; count++){
      // Increment the step counter
      steps++;
      // Update x and y based on the coordinates
      switch(wire2[move].dir){
        case "U":
          y--;
          break;
        case "D":
          y++;
          break;
        case "L":
          x--;
          break;
        case "R":
          x++;
          break;
      }
      // If wire1's map has this coordinate this is an intersection
      if(wire1Map.has(key(x, y))){
        // Record this intersection and the total steps for both wires to reach this point
        intersections.push({x, y, steps: wire1Map.get(key(x, y)) + steps});
      }
    }
  }

  // Find the minimum Manhattan distance to an intersection
  let minDist = Number.MAX_SAFE_INTEGER;
  for(let i = 0; i < intersections.length; i++){
    let dist = distance({x:0, y:0}, intersections[i]);
    minDist = Math.min(minDist, dist);
  }
  
  // Find the minimum number of steps to reach an intersection
  let minSteps = Number.MAX_SAFE_INTEGER;
  for(let i = 0; i < intersections.length; i++){
    minSteps = Math.min(minSteps, intersections[i].steps);
  }

  return {part1: minDist, part2: minSteps};
}

// Manhattan diastance between two coordinates
const distance = (pointA, pointB) => {
  // Diff for each parameter
  let xDiff = pointA.x - pointB.x;
  let yDiff = pointA.y - pointB.y;

  // Add together the absolute values for each parameter
  return Math.abs(xDiff) + Math.abs(yDiff);
}

// Get the unique string for a coordinate
const key = (x, y) => {
  return `${x},${y}`;
}

// Parse the wire info from a file input line
const parseLine = (line) => {
  // Regex for parsing an individual move
  let reg = new RegExp(/([UDLR])(\d+)/);
  // Split the line on commas for each move then 
  // use regex to map each move to an object with 
  // direction and distance to move
  return line.split(',').map(x => {
    let matches = x.match(reg);
    return {dir: matches[1], dist: parseInt(matches[2])};
  });
}