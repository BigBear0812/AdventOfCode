// Puzzle for Day 14: https://adventofcode.com/2017/day/14

export const run = (fileContents) => {
  // Get the input to be hashed from the intput file's first line
  let hashInput = fileContents[0];
  // CReate a grid to store the results of the 128 binary hashes
  let grid = [];
  for(let x = 0; x < 128; x++){
    // Create the sparse and dense hashes for this line of the grid's input. 
    let sparseHash = knotsSparseHash(hashInput + '-' + x);
    let denseHash = sparseToDense(sparseHash); 
    // The convert the dense hash to a binary array and add it to the grid
    let binArray = convertToBinaryArray(denseHash);
    grid.push(binArray);
  }

  // Count the number of spaces that are used in the grid
  let count = countUsed(grid);

  // Get all the regions of the grid
  let regions = findAllRegions(grid);

  return {part1: count, part2: regions.length};
}

// Find all of the regions on the grid
const findAllRegions = (grid) => {
  // The list of regions
  let regions = [];
  // All of the points on ther grid already considered or that are part of a region
  let visited = new Set();

  // Check each position in the grid
  for(let y = 0; y < grid.length; y++){
    for(let x = 0; x < grid[y].length; x++){
      // If the value is 1 and it has not been visited find it's region
      if(grid[y][x] == 1 && !visited.has(`x:${x},y:${y}`)){
        let region = findRegion(grid, {x, y});
        // Add each position of the region to the visited set to avoid double counting regions
        for(let regionPos of region){
          visited.add(`x:${regionPos.x},y:${regionPos.y}`);
        }
        // Add the region to the list
        regions.push(region);
      }
    }
  }

  return regions;
}

// Find a single region from a given start point using a Breadth First Search (BFS)
const findRegion = (grid, pos) => {
  // Next points to check in a region
  let states = [];
  // The final set of region points
  let region = [];
  // Add the start to the set of states
  states.push(pos);
  // Keep track of points that have been visited already for this region
  let visited = new Set();

  // Keep checking while there are still next opoints to consider
  while(states.length > 0){
    // Get the current point from the beginning of the array
    let current = states.shift();
    // Add tihs point to the region and to the viisted set
    region.push(current);
    visited.add(`x:${current.x},y:${current.y}`);

    // Determine the coordinates of the next possible points
    let nextPossible = [];
    nextPossible.push({x: current.x, y: current.y-1}); // Up
    nextPossible.push({x: current.x, y: current.y+1}); // Down
    nextPossible.push({x: current.x-1, y: current.y}); // Left
    nextPossible.push({x: current.x+1, y: current.y}); // Right

    // Add the next point to the set of next states only if it is a 
    // valid point on the grid, it's value is 1, and it has not 
    // already been visited
    for(let next of nextPossible){
      if(next.y >= 0 && 
        next.y < grid.length && 
        next.x >= 0 && 
        next.x < grid[next.y].length && 
        grid[next.y][next.x] === 1 && 
        !visited.has(`x:${next.x},y:${next.y}`))
        states.push(next);
    }
  }

  return region;
}

// Count the number of used spaces in the grid
const countUsed = (grid) => {
  // The count of 1's in the grid
  let count = 0;
  // Go through each space of the grid and add one 
  // to the count for each 1 found
  for(let line of grid){
    for(let char of line){
      if(char === 1)
        count++;
    }
  }

  return count;
}

// A print command used to print the grid to the console during development
const print = (grid) => {
  for(let y = 0; y < grid.length; y++){
    let outputLine = '';
    for(let x = 0; x < grid[y].length; x++){
      outputLine += grid[y][x] === 1 ? '#' : '.';
    }
    console.log(outputLine);
  }
}

const convertToBinaryArray = (denseHash) => {
  // Split the dense hash into hexidecimal chacarters to be converted to binary
  let hexArray = denseHash.split('');
  // The output binary array for the hash
  let output = [];
  // Convert each character one at a time
  for(let hexDigit of hexArray){
    // Convert a single hexidecimal digit into a 4 character binary arrau
    let binDigit = (parseInt(hexDigit, 16)).toString(2);
    while(binDigit.length < 4){
      binDigit = '0' + binDigit;
    }
    // Concat this digit's bibnary to the output for this hash
    output = output.concat(binDigit.split('').map(x => parseInt(x)));
  }

  return output;
}

// Convert a sparse hash of a 256 int array into a desnse 
// hash of a 32 character hexadecimal string
const sparseToDense = (sparseHash) => {
  // The hexademcimal digits for the output
  let denseDigits = [];
  while(sparseHash.length > 0){
    // Splice the hash 16 characters at a time
    let digits = sparseHash.splice(0, 16);
    // Compute a bitwise XOR between all of the ints and 
    // convert the result to hexadecimal
    let hexDigit = eval(digits.join(' ^ ')).toString(16);
    // Ensure each result has 2 digits by adding a 
    // leading 0 if necessary
    if(hexDigit.length < 2)
      hexDigit = 0 + hexDigit;
    denseDigits.push(hexDigit);
  }

  // Join all results for the output string
  return denseDigits.join('');
}

// Create the sparse hash for an input and a specified number of rounds
const knotsSparseHash = (inputHash, rounds = 64) => {

  let input = inputHash.split('').map(x => x.charCodeAt(0)).concat([17, 31, 73, 47, 23])
  // Create an array of the integers 0-255 in order
  let arr = [];
  for(let x = 0; x < 256; x++){
    arr.push(x);
  }

  // The index to start the hashing and the additional spaces 
  // to skip after each number of the input should begin at 0 
  // and carry over from round to round
  let index = 0;
  let skipSize = 0;

  // Repeat the hashing for the specified number of rounds
  for(let r = 0; r < rounds; r++){
    // Comtinue processing this round until each int 
    // of the input has been applied
    for(let len of input){
      // Find the end index for this section to reverse
      let endIndex = index + len;
      // Get the sub array to reverse
      let subArr = arr.slice(index, endIndex);
      // If the end index is past the end of the array get the 
      // remaining numbers from the beginning of the array
      if(endIndex > arr.length){
        subArr = subArr.concat(arr.slice(0, endIndex % arr.length));
      }
      // Reverse the sub array
      subArr.reverse();
      // If the end index is past the end of the array add the last 
      // part of the sub array bacj on to the fron of the array
      if(endIndex > arr.length){
        // Find the spearation point
        let separate = endIndex % arr.length;
        // Remove the end of the reversed sub array
        let startArr = subArr.splice(-separate);
        // Add the start array to replace the integers at the front of the array
        arr.splice(0, startArr.length, ...startArr);
      }
      // use the sub array to replace the integers in the positions of the 
      // array starting with the index
      arr.splice(index, subArr.length, ...subArr);
      // Advance the index the length of the sub array that was just reversed 
      // plus the skip size. Modulus the value by the length of the array 
      // to handle situations where the index circles around to the front 
      // of the array again
      index = (index + len + skipSize) % arr.length;
      // Increment the skip size after each value of the input is applied
      skipSize++;
    }
  }
  
  return arr;
}