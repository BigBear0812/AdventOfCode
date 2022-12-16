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
  const critRow = 2000000;

  // Parse input to get the sensor and beacon location and disatance info
  const sensorsAndBeacons = parseInput(fileContents);

  let coveredXs = [];
  for(const pair of sensorsAndBeacons){
    const topRow = pair.sensor.y - pair.distance;
    const bottomRow = pair.sensor.y + pair.distance;
    if(topRow <= critRow && critRow <= bottomRow){
      const lrSize = pair.distance - Math.abs(critRow - pair.sensor.y);
      const left = pair.sensor.x - lrSize;
      const right = pair.sensor.x + lrSize;
      coveredXs.push({left: left, right: right});
    }
  }

  // Bubble sort the points by the left value
  for(let a = 0; a < coveredXs.length; a++){
    for(let b = 0; b < coveredXs.length - a - 1; b++){
      let result = coveredXs[b].left < coveredXs[b + 1].left
      if(result !== true){
        swap(coveredXs, b, b + 1);
      }
    }
  }

  let total = 0;
  let lowest = coveredXs[0].left;
  let highest = coveredXs[0].right;
  for(let i = 1; i < coveredXs; i++){
    let cons = contains(lowest, highest, coveredXs[i].left, coveredXs[i].right);
    let over = overlaps(lowest, highest, coveredXs[i].left, coveredXs[i].right);
    if (!cons){
      if(over > 0)
        highest= coveredXs[i].right;
      else{
        total += highest - lowest;
        lowest = coveredXs[i].left;
        highest = coveredXs[i].right;
      }
    }

  }
  total += highest - lowest;

  // 2652668 too low
  console.log(`Number of covered space on row 2000000: ${total}`);
});

// Basic swap of two values at specified indexes in the array
const swap = (array, indexA, indexB) => {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
  return array;
}

const contains = (min1, max1, min2, max2) => {
  return min1 <= min2 && max1 >= max2;
}

const overlaps = (min1, max1, min2, max2) => {
  return Math.max(0, Math.min(max1, max2) - Math.max(min1, min2));
}


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