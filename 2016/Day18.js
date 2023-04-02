// Puzzle for Day 18: https://adventofcode.com/2016/day/18

export const run = (fileContents) => {
  // Get the start row input from the first line of the input file
  let startRow = fileContents[0].split('');

  // Generate a map of the traps and safe tiles in the room
  let map1 = generateRoomMap(startRow, 40);

  // Count the number of safe tiles
  let count1 = countSafe(map1);

  // Log output
  console.log("Part 1:", count1);

  // Generate a map of the traps and safe tiles in the room
  let map2 = generateRoomMap(startRow, 400000);

  // Count the number of safe tiles
  let count2 = countSafe(map2);

  // Log output
  console.log("Part 2:", count2);
}

// Generate a map of the safe and trap tile in the room based on 
// the total number of rows and and the starting row
const generateRoomMap = (startRow, totalRows) => {
  // The resulting map with the first row added to it
  let map = [];
  map.push(startRow);

  // Generate the rest of the map starting with the fact that the map 
  // already has the first row
  for(let x = map.length; x < totalRows; x++){
    // Setup array for the previous row and the next row to be generated
    let nextRow = [];
    let previousRow = map[x-1];

    // For each character in the previous row generate a new character for the next row
    for(let y = 0; y < previousRow.length; y++){
      // Assume all previous directions are safe to start
      let left = '.';
      let center = '.';
      let right = '.';

      // Get values from the previous row if they exist
      if(y-1 >= 0)
        left = previousRow[y-1];
      if(y+1 < previousRow.length)
        right = previousRow[y+1];
      center = previousRow[y];

      // Check if we meet a trap condition or a safe condition
      if(
      (left === '^' && center === '^' && right === '.') ||
      (left === '.' && center === '^' && right === '^') ||
      (left === '^' && center === '.' && right === '.') ||
      (left === '.' && center === '.' && right === '^'))
        nextRow.push('^');
      else
        nextRow.push('.');
    }

    // Push the next row into the map
    map.push(nextRow);
  }

  return map;
}

// Count the number of safe characters in the given map
const countSafe = (map) => {
  // Number of safe characters
  let countSafe = 0;
  // Use this double for loop to vists each character and see what the value is
  for(let y = 0; y < map.length; y++){
    for(let x = 0; x < map[y].length; x++){
      if(map[y][x] === '.')
        countSafe++;
    }
  }
  return countSafe;
}