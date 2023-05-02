// Puzzle for Day 6: https://adventofcode.com/2018/day/6

export const run = (fileContents) => {
  // Parse the input into an array of adjusted points 
  // and find the height and width of the grid
  let data = parseInput(fileContents);

  // Find the areas for each part of the puzzle
  let results = findAreas(data, 10000);

  return {part1: results.largest, part2: results.safeZoneSize};
}

// Find the area for each part of the puzzle
const findAreas = (data, zoneDistance) => {
  // An array that counts the number of spots in the area of each point
  let areaCount = new Array(data.points.length).fill(0);
  // The size of the safe zone that has spots where each has a 
  // total dustance to all points under the specified value
  let safeZoneSize = 0;

  // Consider each point in the grid
  for(let y = 0; y < data.height; y++){
    for(let x = 0; x < data.width; x++){
      // The closest distance and point(s) at that distance
      let closest = Number.MAX_SAFE_INTEGER;
      let closestPoint = [];
      // All distances to each point from this spot
      let allDistances = [];

      // Find the distance to each point from this spot
      for(let p = 0; p < data.points.length; p++){
        // The current point to find the distance to
        let point = data.points[p];
        // The distance calculation
        let distance = Math.abs(point.x - x) + Math.abs(point.y - y);

        // If this diatnce matches the current closest add it to the 
        // closest point array to know this spot is not in any single 
        // point's area
        if(distance === closest){
          closestPoint.push(p);
        }
        // Else if this is less than the closest distance update the 
        // closest distance and the closest point array
        else if(distance < closest){
          closest = distance;
          closestPoint = [p];
        }
        // Add this distance to the all distances array
        allDistances.push(distance);
      }
      // If only one point is the closest to this spot increment the 
      // appropriate counter for that point
      if(closestPoint.length === 1)
        areaCount[closestPoint[0]]++;
      
      // Find the sum of all distances and if it is less that the zone 
      // distance increment the safe zone size count
      let totalDistance = allDistances.reduce((total, val) => total += val, 0);
      if(totalDistance < zoneDistance)
        safeZoneSize++;
    }
  }

  // Find the area count that is the largest
  let largest = Math.max(...areaCount);

  return {largest, safeZoneSize};
}

// Parse the input to create an array of adjusted points and grid dimensions
const parseInput = (fileContents) => {
  // The points on the grid
  let points = [];
  // The edges of the grid
  let top = null;
  let bottom = null;
  let left = null;
  let right = null;

  // Evaluate each line of the input as a new point
  for(let line of fileContents){
    // Convert the line to a point object
    let coordinates = line.split(',').map(c => parseInt(c));
    let point = {x: coordinates[0], y: coordinates[1]};

    // Find the edges of the grid
    if(top === null || top > point.y)
      top = point.y;
    if(bottom === null || bottom < point.y)
      bottom = point.y;
    if(left === null || left > point.x)
      left = point.x;
    if(right === null || right < point.x)
      right = point.x;

    // Add the point to the list
    points.push(point);
  }

  // Adjust the points of the grid to have the top and left be 0,0 
  points = points.map(p => {
    p.x -= left; 
    p.y -= top; 
    return p
  });
  // Find the width and height of the grid by finding the distance of 
  // each direction and adding one to include the last row and column
  let width = right - left + 1;
  let height = bottom - top + 1;

  return {points, height, width};
}