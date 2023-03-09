import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 15: https://adventofcode.com/2022/day/15

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
  // The row we are concerned with
  const critRow = 2000000;

  // Parse input to get the sensor and beacon location and disatance info
  const sensorsAndBeacons = parseInput(fileContents);

  // Calc the number covered for the given row
  const segments = coveredRowSegments(sensorsAndBeacons, critRow, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  const total = numCovered(segments);

  // Log output
  console.log(`Number of covered spaces on row 2000000: ${total}`);

  return fileContents;
})
.then((fileContents) => {
  // Boundaries for the saearch area
  const lowBnd = 0;
  const upBnd = 4000000;
  // Parse input to get the sensor and beacon location and disatance info
  const sensorsAndBeacons = parseInput(fileContents);

  // Position of the distress beacon
  let y;
  let x;
  
  // Check each row for one row that has an uncovered space to get the Y coordinate of the distress beacon
  for(let row = lowBnd; row <= upBnd; row++){
    // Calc the number covered for the current row
    const segments = coveredRowSegments(sensorsAndBeacons, row, lowBnd, upBnd);
    const total = numCovered(segments);

    // If it is less than fully covered record it
    if (total < upBnd - lowBnd)
      y = row;
  }

  // Check each col for one col that has an uncovered space to get the X coordinate of the distress beacon
  for(let col = lowBnd; col <= upBnd; col++){
    // Calc the number covered for the current col
    const segments = coveredColSegments(sensorsAndBeacons, col, lowBnd, upBnd);
    const total = numCovered(segments);

    // If it is less than fully covered record it
    if (total < upBnd - lowBnd)
      x = col;
  }

  // Calc frequency
  const frequency = (x * 4000000) + y;

  // Log output
  console.log(`Distress Beacon Position: (${x},${y})`);
  console.log(`Distress Beacon Frequency: ${frequency}`);

});

// Check a given row for the segments of that row covered by each sensor
const coveredRowSegments = (sensorsAndBeacons, row, lowBnd, upBnd) => {
  // Determine the segments of the current row are covered by each of the 
  // sensors within the upper and lower bounds
  let coveredXs = [];
  for(const pair of sensorsAndBeacons){
    // First find if this sensor touches this row
    const topRow = pair.sensor.y - pair.distance;
    const bottomRow = pair.sensor.y + pair.distance;
    // If it does then find out the left and right bound of the x values for this segment
    if(topRow <= row && row <= bottomRow){
      const lrSize = pair.distance - Math.abs(row - pair.sensor.y);
      const left = Math.max(lowBnd, pair.sensor.x - lrSize);
      const right = Math.min(upBnd, pair.sensor.x + lrSize);
      coveredXs.push({left: left, right: right});
    }
  }

  return coveredXs;
}

// Check a given col for the segments of that col covered by each sensor
const coveredColSegments = (sensorsAndBeacons, col, lowBnd, upBnd) => {
  // Determine the segments of the current col are covered by each of the 
  // sensors within the upper and lower bounds
  let coveredYs = [];
  for(const pair of sensorsAndBeacons){
    // First find if this sensor touches this col
    const leftCol = pair.sensor.x - pair.distance;
    const rightCol = pair.sensor.x + pair.distance;
    // If it does then find out the left and right bound of the y values for this segment
    if(leftCol <= col && col <= rightCol){
      const lrSize = pair.distance - Math.abs(col - pair.sensor.x);
      const left = Math.max(lowBnd, pair.sensor.y - lrSize);
      const right = Math.min(upBnd, pair.sensor.y + lrSize);
      coveredYs.push({left: left, right: right});
    }
  }

  return coveredYs;
}

// Return the number of covered space for the given set of segments
const numCovered = (segments) => {

  // Bubble sort the segments by the left value to ensure that the 
  // next value always has a higher or equal left value
  for(let a = 0; a < segments.length; a++){
    for(let b = 0; b < segments.length - a - 1; b++){
      let result = segments[b].left < segments[b + 1].left
      if(result !== true){
        let temp = segments[b];
        segments[b] = segments[b + 1];
        segments[b + 1] = temp;
      }
    }
  }

  // Find the total number of covered points along this line by 
  // comparing the lengths of covered segments and checking if 
  // they are contained or overlap their previous segments
  let total = 0;
  // Start with the first segment
  let lowest = segments[0].left;
  let highest = segments[0].right;
  // Iterate through each sorted segment after the first
  for(let i = 1; i < segments.length; i++){
    // Check for being contained by the previous and for overlaps
    let cons = lowest <= segments[i].left && highest >= segments[i].right;
    let over = Math.max(0, Math.min(highest, segments[i].right) - Math.max(lowest, segments[i].left));
    if (!cons){
      // If not contained by but overlaping the next segment this
      // must have a higher right value so treat them as one 
      // segment and change the highest value
      if(over > 0)
        highest= segments[i].right;
      // Otherwise this is seperate segment. Total up the 
      // current segment and set the highest and lowest 
      // values to the new segment being tracked
      else{
        total += highest - lowest;
        lowest = segments[i].left;
        highest = segments[i].right;
      }
    }
  }
  // Add the final segment to the total
  total += highest - lowest;

  return total;
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