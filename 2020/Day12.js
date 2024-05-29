// Puzzle for Day 12: https://adventofcode.com/2020/day/12

export const run = (fileContents) => {
  // Parse each line fo the input file out as a separate object that contains a move and an int value 
  let moves = fileContents.map(x => {
    let matches = x.match(/([A-Z])(\d+)/);
    return {
      dir: matches[1],
      val: parseInt(matches[2])
    }
  });

  // Calculate each part of the puzzle's result
  let result1 = part1(moves);
  let result2 = part2(moves);

  return { part1: result1, part2: result2 };
}

/**
 * Part 2
 * @param {{dir: string, val: number}[]} moves The moves the ship will make
 * @returns The distance to the final destination
 */
const part2 = (moves) => {
  // Set the starting position of the ship and the waypoint
  let currentPos = { y: 0, x: 0 };
  let waypointPos = { y : 1, x: 10 };

  // Follow each move in order
  for(let move of moves){
    // Move the ship forward to the waypoint the specified number of times
    if(move.dir === "F"){
      currentPos.y += waypointPos.y * move.val;
      currentPos.x += waypointPos.x * move.val;
    }
    // Rotate the waypoint the specified number of degrees around the boat to the right
    else if(move.dir === "R"){
      if(move.val === 90){
        swapXY(waypointPos);
        waypointPos.y *= -1;
      }
      else if(move.val === 180){
        waypointPos.y *= -1;
        waypointPos.x *= -1;
      }
      else if(move.val === 270){
        swapXY(waypointPos);
        waypointPos.x *= -1;
      }
    }
    // Rotate the waypoint the specified number of degrees around the boat to the left
    else if(move.dir === "L"){
      if(move.val === 90){
        swapXY(waypointPos);
        waypointPos.x *= -1;
      }
      else if(move.val === 180){
        waypointPos.y *= -1;
        waypointPos.x *= -1;
      }
      else if(move.val === 270){
        swapXY(waypointPos);
        waypointPos.y *= -1;
      }
    }
    // Move the waypoint the specified distance in the specified direction
    else if(move.dir === "N"){
      waypointPos.y += move.val;
    }
    else if(move.dir === "E"){
      waypointPos.x += move.val;
    }
    else if(move.dir === "S"){
      waypointPos.y -= move.val;
    }
    else if(move.dir === "W"){
      waypointPos.x -= move.val;
    }
  }
  
  // Return the manhattan distance from the start to the final destination
  return Math.abs(currentPos.y) + Math.abs(currentPos.x);
}

/**
 * Swap the x and y coordinate of a position object
 * @param {{y: number, x: number}[]} pos A position coordinate object
 */
const swapXY = (pos) => {
  let temp = pos.x;
  pos.x = pos.y;
  pos.y = temp;
}

/**
 * Part 1
 * @param {{dir: string, val: number}[]} moves The moves the ship will make
 * @returns The distance to the final destination
 */
const part1 = (moves) => {
  // Set the ships starting direction and position
  let currentDir = "E";
  let currentPos = { y: 0, x: 0 };

  // Follow each move in order
  for(let move of moves){
    // Get the current move direction either from the current 
    // direction the ship faces or from the move's direction indicator
    let currentMoveDir;
    if(move.dir === "F")
      currentMoveDir = currentDir;
    else
      currentMoveDir = move.dir;

    // If turning right adjust the ships direction based on by how much the 
    // ship is turning and what direction it's currently facing
    if(currentMoveDir === "R"){
      if(currentDir === "N"){
        switch(move.val){
          case 90:
            currentDir = "E";
            break;
          case 180:
            currentDir = "S";
            break;
          case 270:
            currentDir = "W";
            break;
        }
      }
      else if(currentDir === "E"){
        switch(move.val){
          case 90:
            currentDir = "S";
            break;
          case 180:
            currentDir = "W";
            break;
          case 270:
            currentDir = "N";
            break;
        }
      }
      else if(currentDir === "S"){
        switch(move.val){
          case 90:
            currentDir = "W";
            break;
          case 180:
            currentDir = "N";
            break;
          case 270:
            currentDir = "E";
            break;
        }
      }
      else if(currentDir === "W"){
        switch(move.val){
          case 90:
            currentDir = "N";
            break;
          case 180:
            currentDir = "E";
            break;
          case 270:
            currentDir = "S";
            break;
        }
      }
    }
    // If turning left adjust the ships direction based on by how much the 
    // ship is turning and what direction it's currently facing
    else if(currentMoveDir === "L"){
      if(currentDir === "N"){
        switch(move.val){
          case 90:
            currentDir = "W";
            break;
          case 180:
            currentDir = "S";
            break;
          case 270:
            currentDir = "E";
            break;
        }
      }
      else if(currentDir === "E"){
        switch(move.val){
          case 90:
            currentDir = "N";
            break;
          case 180:
            currentDir = "W";
            break;
          case 270:
            currentDir = "S";
            break;
        }
      }
      else if(currentDir === "S"){
        switch(move.val){
          case 90:
            currentDir = "E";
            break;
          case 180:
            currentDir = "N";
            break;
          case 270:
            currentDir = "W";
            break;
        }
      }
      else if(currentDir === "W"){
        switch(move.val){
          case 90:
            currentDir = "S";
            break;
          case 180:
            currentDir = "E";
            break;
          case 270:
            currentDir = "N";
            break;
        }
      }
    }
    // Otherwise move the ship in the specified direction a specific distance
    else if(currentMoveDir === "N"){
      currentPos.y += move.val;
    }
    else if(currentMoveDir === "E"){
      currentPos.x += move.val;
    }
    else if(currentMoveDir === "S"){
      currentPos.y -= move.val;
    }
    else if(currentMoveDir === "W"){
      currentPos.x -= move.val;
    }
  }

  // Return the manhattan distance from the start to the final destination
  return Math.abs(currentPos.y) + Math.abs(currentPos.x);
}