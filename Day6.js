import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 6: https://adventofcode.com/2015/day/6
// TODO: Possibly redo this using regex. 

// Check that the right number of arguments are present in the command
if (process.argv.length !== 3){
  console.log('Please specify an input file.');
  process.exit(1);
}

// Get the file name from the last argv value
const filename = process.argv[2];
const xLen = 1000;
const yLen = 1000;

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
  // Off false
  // On  true

  // Create the grid
  let grid = [];
  for(let x = 0; x < xLen; x++){
    let col = [];
    for(let y = 0; y < yLen; y++){
      col.push(false);
    }
    grid.push(col);
  }

  for (const line of fileContents){
    let updates = parseLine(line);
    // Update the grid
    for(let x = updates.start.x; x <= updates.end.x; x++){
      for(let y = updates.start.y; y <= updates.end.y; y++){
        switch(updates.command){
          case 'turn on': 
            grid[x][y] = true;
            break;
          
          case 'turn off': 
            grid[x][y] = false;
            break;
          
          case 'toggle': 
            grid[x][y] = !grid[x][y];
            break;
        }
      }
    }
  }

  // Count the lights on
  let total = 0;
  for(let x = 0; x < xLen; x++){
    for(let y = 0; y < yLen; y++){
      if(grid[x][y])
        total++;
    }
  }

  // Log output
  console.log(`Total Lights On: ${total}`);

  return fileContents;
})
.then((fileContents) => {

  // Create the grid
  let grid = [];
  for(let x = 0; x < xLen; x++){
    let col = [];
    for(let y = 0; y < yLen; y++){
      col.push(0);
    }
    grid.push(col);
  }

  for (const line of fileContents){
    let updates = parseLine(line);
    // Update the grid
    for(let x = updates.start.x; x <= updates.end.x; x++){
      for(let y = updates.start.y; y <= updates.end.y; y++){
        switch(updates.command){
          case 'turn on': 
            grid[x][y]++;
            break;
          
          case 'turn off': 
            if(grid[x][y] > 0)
              grid[x][y]--;
            break;
          
          case 'toggle': 
            grid[x][y] += 2;
            break;
        }
      }
    }
  }

  // Count the total brightness of the lights
  let total = 0;
  for(let x = 0; x < xLen; x++){
    for(let y = 0; y < yLen; y++){
      total += grid[x][y];
    }
  }

  // Log output
  console.log(`Total Light Brightness: ${total}`);
});

const parseLine = (line) => {
  const regex = new RegExp('([turnofgle ]+) (\\d+),(\\d+) through (\\d+),(\\d+)');
  const results = line.match(regex);
  return {
    command: results[1],
    start: {
      x: Math.min(results[2], results[4]), 
      y: Math.min(results[3], results[5])
    },
    end: {
      x: Math.max(results[2], results[4]), 
      y: Math.max(results[3], results[5])
    }
  }
}