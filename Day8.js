import process from "node:process";
import { open } from "node:fs/promises";
import { copyFile } from "node:fs";
import { Console } from "node:console";
import { getCipherInfo } from "node:crypto";

// Puzzle for Day 8: https://adventofcode.com/2022/day/8

// Check that the right number of arguments are present in the command
if (process.argv.length !== 3){
  console.log('Please specify an input file.');
  process.exit(1);
}

// Get the file name from the last argv value
const filename = process.argv[2];

// Open the file and pass it ot our main processing 
open(filename)
.then(async(file) => {
  // Process all of the line of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then((fileContents) => {
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

  // Log output
  console.log(`Visible Number of Trees: ${visibleTrees}`);
  console.log(`Highest Scenic Score: ${highScenicScore}`);
})