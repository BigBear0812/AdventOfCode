import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 2: https://adventofcode.com/2015/day/2

// Check that the right number of arguments are present in the command
if (process.argv.length !== 3){
  console.log('Please specify an input file.');
  process.exit(1);
}

// Get the file name from the last argv value
const filename = process.argv[2];

// Open the file and pass it ot our main processing 
open(filename)
.then(file => {
  processLines(file)
});

const processLines = async(file) => { 

  let houseLocsY1 = ["0,0"];
  let houseLocsY2 = ["0,0"];

  // Read in all of the lines one at a time
  for await (const line of file.readLines()) {
    const chars = Array.from(String(line));
    let currentPosY1 = { x: 0, y: 0 };
    let currentPosY2Santa = { x: 0, y: 0 };
    let currentPosY2RoboSanta = { x: 0, y: 0 };
    let moveSanta = true;
    
    for(const c of chars){

      updateLocation(currentPosY1, c);
      const positionOutY1 = `${currentPosY1.x},${currentPosY1.y}`;
      if(houseLocsY1.indexOf(positionOutY1) < 0)
        houseLocsY1.push(positionOutY1);

      if(moveSanta){
        updateLocation(currentPosY2Santa, c);
        const positionOut = `${currentPosY2Santa.x},${currentPosY2Santa.y}`;
        if(houseLocsY2.indexOf(positionOut) < 0)
          houseLocsY2.push(positionOut);
      }
      else{
        updateLocation(currentPosY2RoboSanta, c);
        const positionOut = `${currentPosY2RoboSanta.x},${currentPosY2RoboSanta.y}`;
        if(houseLocsY2.indexOf(positionOut) < 0)
          houseLocsY2.push(positionOut);
      }

      moveSanta = !moveSanta;
    }

    console.log(`House that got at least one present in year 1: ${houseLocsY1.length}`);
    console.log(`House that got at least one present in year 2: ${houseLocsY2.length}`);
  }

}

const updateLocation = (location, c) => {
  if(c === '^')
    location.y++;
  if(c === 'v')
    location.y--;
  if(c === '>')
    location.x++;
  if(c === '<')
    location.x--;
}