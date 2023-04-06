// Puzzle for Day 8: https://adventofcode.com/2022/day/8

export const run = (fileContents) => {
  // The grid of all tree heights
  let grid = []
  
  // Parse in each row as a row of the grid with each 
  // number in a separate column
  for(let x = 0; x < fileContents.length; x++){
    const line = fileContents[x];
    const chars = line.split('');
    let row = [];
    for(let y = 0; y < chars.length; y++){
      row.push(parseInt(chars[y]));
    }
    grid.push(row);
  }

  // Total number of trees visible from the outside
  let visibleTrees = 0;

  // Highest Scenic Score
  let highScenicScore = 0;

  // Check each tree that is not one of the edge trees
  // Check each tree to see if it can be seen from the 
  // edge of the grid in one or more directions.
  // At each tree count how many trees there are until 
  // the view is blocked or you reach the edge for the 
  // scenic score.
  for(let r = 1 ; r < grid.length - 1; r++){
    for(let c = 1; c < grid[r].length - 1; c++){
      const treeHeight = grid[r][c]
      // Check Up
      let stillVisibleUp = true;
      let scenicUp = 0;
      for(let lu = r - 1; lu >= 0 && stillVisibleUp; lu--){
        if(grid[lu][c] >= treeHeight){
          stillVisibleUp = false;
        }
        scenicUp++;
      }
      // Check Down
      let stillVisibleDown = true;
      let scenicDown = 0;
      for(let ld = r + 1; ld <= grid.length - 1 && stillVisibleDown; ld++){
        if(grid[ld][c] >= treeHeight){
          stillVisibleDown = false;
        }
        scenicDown++;
      }
      // Check Left
      let stillVisibleLeft = true;
      let scenicLeft = 0;
      for(let ll = c - 1; ll >= 0 && stillVisibleLeft; ll--){
        if(grid[r][ll] >= treeHeight){
          stillVisibleLeft = false;
        }
        scenicLeft++;
      }
      // Check Right
      let stillVisibleRight = true;
      let scenicRight = 0;
      for(let lr = c + 1; lr <= grid[r].length - 1 && stillVisibleRight; lr++){
        if(grid[r][lr] >= treeHeight){
          stillVisibleRight = false;
        }
        scenicRight++;

      }

      // If visible in at least one direction add one to the total of visible trees
      if(stillVisibleUp || stillVisibleDown || stillVisibleLeft || stillVisibleRight)
        visibleTrees++;

      // Compute Scenic Score and check if it is the highest one found yet
      const scenicScore = scenicUp * scenicDown * scenicLeft * scenicRight;
      if(highScenicScore < scenicScore)
        highScenicScore = scenicScore;
    }
  }

  // Add the outer edge trees and don't double count the corner trees
  visibleTrees += (grid.length * 4) - 4;

  return {part1: visibleTrees, part2: highScenicScore};
}