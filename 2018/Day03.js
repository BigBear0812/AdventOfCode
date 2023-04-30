// Puzzle for Day 3: https://adventofcode.com/2018/day/3

export const run = (fileContents) => {
  // Create and empty 1000 x 1000 grid and an array of all of the claim info
  let grid = createEmptyGrid();
  let claims = parseInput(fileContents);

  // Apply all of the claims to the grid
  applyAllClaims(grid, claims);

  // Find the answers for part 1 and 2 of the puzzle
  let part1 = countDoubleClaimed(grid);
  let part2 = findWholeClaim(grid, claims);

  return {part1: part1, part2: part2};
}

// Find the only whole claim
const findWholeClaim = (grid, claims) => {
  // The only claim found to be whole
  let foundClaim = null;

  // Consider each claim while a whole claim has still not been found
  for(let c = 0; c < claims.length && foundClaim === null; c++){
    // The current claim
    let claim = claims[c];
    // Start assuming this claim is whole and therefore valid
    let valid = true;
    // Check each row left to right, then top to bottom 
    for(let y = 0; y < claim.height && valid; y++){
      for(let x = 0; x < claim.width && valid; x++){
        // If the current spot is double claimed then set valid to false
        let current = grid[y+ claim.top][x+ claim.left];
        if(current === 'X')
          valid = false;
      }
    }
    // If this claim is still valid after being checked then set found claim to it's ID
    if(valid)
      foundClaim = claim.id;
  }

  return foundClaim;
}

// Count the number of double cliamed locations
const countDoubleClaimed = (grid) => {
  // Total count
  let count = 0;

  // Check each row and column and add 1 to count for each X found
  for(let y = 0; y < grid.length; y++){
    for(let x = 0; x < grid[y].length; x++){
      if(grid[y][x] === 'X')
        count++;
    }
  }

  return count;
}

// Apply all claims to the grid
const applyAllClaims = (grid, claims) => {
  // Consider each claim
  for(let claim of claims){
    // Move accross each row left to right, then top to bottom
    for(let y = 0; y < claim.height; y++){
      for(let x = 0; x < claim.width; x++){
        // Get the marker at the current point
        let current = grid[y+ claim.top][x+ claim.left];
        // If it is unclaimed. Mark it as claimed
        if(current === '.')
          grid[y+ claim.top][x+ claim.left] = '#';
        // Else if it is claimed. Mark it as double claimed
        else if(current === '#')
          grid[y+ claim.top][x+ claim.left] = 'X';
      }
    }
  }
}

// Parse the input into an array of claims
const parseInput = (fileContents) => {
  // Regex for parsing each line
  let reg = new RegExp(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
  // All claims
  let claims = [];

  for(let line of fileContents){
    // Match all of the pertinent info in each line
    let matches = line.match(reg);

    // Add the new claim object to the array
    claims.push({
      id: parseInt(matches[1]),
      left: parseInt(matches[2]),
      top: parseInt(matches[3]),
      width: parseInt(matches[4]),
      height: parseInt(matches[5])
    });
  }

  return claims;
}

// Create an empty grid that is 1000 x 1000 in size
const createEmptyGrid = () => {
  let grid = [];

  // Add 1000 .'s to 1000 rows in the grid
  for(let y = 0; y < 1000; y++){
    let row = [];
    for(let x = 0; x < 1000; x++){
      row.push('.');
    }
    grid.push(row);
  }

  return grid;
}