import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 14: https://adventofcode.com/2022/day/14

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
  // Process all of the lines of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then((fileContents) => { 
  // Parse input to get the sensor and beacon location and disatance info
  const sensorsAndBeacons = parseInput(fileContents);
  // Create a blank grid of dots
  const gridInfo = createGrid(sensorsAndBeacons);
  const grid = gridInfo.grid;

  // Place sensors and beacons on the grid witrh the covered areas
  for(const pair of sensorsAndBeacons){
    // Adjust X and Y coordinate with the correct offsets
    const sensorX = pair.sensor.x - gridInfo.offsetX;
    const sensorY = pair.sensor.y - gridInfo.offsetY;
    const beaconX = pair.beacon.x - gridInfo.offsetX;
    const beaconY = pair.beacon.y - gridInfo.offsetY;

    // Place the sensor and beacon icons
    grid[sensorY][sensorX] = 'S';
    grid[beaconY][beaconX] = 'B';

    // Fill the area covered by the sensor that cannot have any beaocns in it
    const topY = sensorY - pair.distance;
    const bottomY = sensorY + pair.distance;
    let currentLeftX = sensorX;
    let currentRightX = sensorX;
    let currentY = topY;
    while(currentY <= bottomY){
      let point = currentLeftX;
      while(point <= currentRightX){
        if(grid[currentY][point] === '.')
          grid[currentY][point] = '#';
        point++;
      }
      currentY++;
      if(currentY <= sensorY){
        currentLeftX--;
        currentRightX++;
      }
      else{
        currentLeftX++;
        currentRightX--;
      }
    }
  }

  // Find number of covered spaces on the row 2000000
  const rowNum =  10 - gridInfo.offsetY;
  let runningTotal = 0;
  const row = grid[rowNum];
  for(const char of row)
    if(char === '#')
      runningTotal++;

  console.log(`Number of covered space on row 2000000: ${runningTotal}`);
});

// Used for printing out the grid during testing.
const print = (grid) => {
  for(const lineGrid of grid){
    let output = "";
    for(const symbol of lineGrid){
      output += symbol;
    }
    console.log(output);
  }
}

// Parse the input into a workable object list
const parseInput = (fileContents) => {
  // Parsing regex for sensors and beacons
  const reg = new RegExp(/Sensor at x=(\d+), y=(\d+): closest beacon is at x=(-*\d+), y=(-*\d+)/);

  // Parse all lines of the input into a list of pairs of sensors and beacons
  let allSAndB = []
  for(const line of fileContents){
    // Parse out all matches on the line and assign to the correct vaiables
    const matches = line.match(reg);
    const sensorX = parseInt(matches[1]);
    const sensorY = parseInt(matches[2]);
    const beaconX = parseInt(matches[3]);
    const beaconY = parseInt(matches[4]);
    // Calculate the disatance from the sensor to the beacon
    const distance = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY)

    // Add the info to the result
    allSAndB.push({
      sensor: {
        x: sensorX,
        y: sensorY
      },
      beacon: {
        x: beaconX,
        y: beaconY,
      },
      distance: distance
    });
  }

  return allSAndB;
}

// Create the grid used for this puzzle from the sensors and beacons info
const createGrid = (allSAndB) => {
  
  // find the boundaries of the grid based on the sensors and beacons positions
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER; 
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  
  // Find the bounds by using the sensors and the distance to the 
  // beacon to make sure all sensor covered area will be included on the grid
  for(const pair of allSAndB){
    if(minX > pair.sensor.x - pair.distance)
      minX = pair.sensor.x - pair.distance;
    if(maxX < pair.sensor.x + pair.distance)
      maxX = pair.sensor.x + pair.distance;
    if(minY > pair.sensor.y - pair.distance)
      minY = pair.sensor.y - pair.distance;
    if(maxY < pair.sensor.y + pair.distance)
      maxY = pair.sensor.y + pair.distance;
  }

  // Pre-Populate the grid with dots.
  let grid = [];
  let yLen = maxY - minY;
  let xLen = maxX - minX;
  for(let y = 0; y <= yLen; y++){
    let gridRow = [];
    for(let x = 0; x <= xLen; x++){
      gridRow.push('.');
    }
    grid.push(gridRow);
  }

  // Return the grid
  return {
    grid: grid,
    offsetX: minX,
    offsetY: minY
  }
}