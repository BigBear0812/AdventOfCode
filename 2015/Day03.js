// Puzzle for Day 3: https://adventofcode.com/2015/day/3

export const run = (fileContents) => { 

  // Setup stroage for the locations that have been visited
  let houseLocsY1 = ["0,0"];
  let houseLocsY2 = ["0,0"];

  // Read in all of the lines one at a time
  for (const line of fileContents) {
    const chars = Array.from(String(line));
    // Current positions of all delivery instances
    let currentPosY1 = { x: 0, y: 0 };
    let currentPosY2Santa = { x: 0, y: 0 };
    let currentPosY2RoboSanta = { x: 0, y: 0 };
    let moveSanta = true;
    
    for(const c of chars){
      // Location moving for Year 1 instance
      updateLocation(currentPosY1, c);
      const positionOutY1 = `${currentPosY1.x},${currentPosY1.y}`;
      if(houseLocsY1.indexOf(positionOutY1) < 0)
        houseLocsY1.push(positionOutY1);

      // Location moving for Year 2 instances
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
      // Alternate between Santa and Robo-Santa
      moveSanta = !moveSanta;
    }
  }

  return {part1: houseLocsY1.length, part2: houseLocsY2.length};
}

// Method to update the position of a location based on the given directional character
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