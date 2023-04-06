// Puzzle for Day 9: https://adventofcode.com/2022/day/9

export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return {part1: result1, part2: result2};
}

const part1 = (fileContents) => {
  // List of positions the last knot has been to
  let positionsVisited = ['0,0'];
  // Current position of both knots
  let head = { x:0, y:0 };
  let tail = { x:0, y:0 };

  // Parse each line with a new set of directions
  const reg = new RegExp(/(.) (\d+)/);
  for(const line of fileContents){
    const matches = line.match(reg);
    const direction = matches[1];
    const moves = parseInt(matches[2]);
    // Take each step of each line one at a time
    for(let i = 0; i < moves; i++){
      // Keep track of where the head just was
      const x = head.x;
      const y = head.y;
      // How to update the head position based on the directions
      switch(direction){
        case 'U':
          head.y++;
          break;
        case 'D':
          head.y--;
          break;
        case 'L':
          head.x--;
          break;
        case 'R':
          head.x++;
          break;
      }
      
      // Calc distance d=√((x2 – x1)² + (y2 – y1)²)
      const distance = Math.sqrt(Math.pow(head.x - tail.x, 2) + Math.pow(head.y - tail.y, 2));
      // If the distance is greater than or equal to 2 that means the the knot is not 
      // adjacent to the one before it and needs to update its position
      if (distance >= 2){
        // Since this is only two points the tail just goes where the head was last
        tail.x = x;
        tail.y = y;
        // The tail was updated so if this new point is not in the list add it
        const point = `${x},${y}`
        if(positionsVisited.indexOf(point) === -1){
          positionsVisited.push(point);
        }
      }
    }
  }

  return positionsVisited.length;
}

const part2 = (fileContents) => {
  // List of positions the last knot has been to
  let positionsVisited = ['0,0'];
  // Current record of where all the knots are
  let knots = [
    { x:0, y:0 },
    { x:0, y:0 },
    { x:0, y:0 },
    { x:0, y:0 },
    { x:0, y:0 },
    { x:0, y:0 },
    { x:0, y:0 },
    { x:0, y:0 },
    { x:0, y:0 },
    { x:0, y:0 }
  ];

  // Parse each line with a new set of directions
  const reg = new RegExp(/(.) (\d+)/);
  for(const line of fileContents){
    const matches = line.match(reg);
    const direction = matches[1];
    const moves = parseInt(matches[2]);
    // Take each step of each line one at a time
    for(let i = 0; i < moves; i++){
      // How to update the head position based on the directions
      switch(direction){
        case 'U':
          knots[0].y++;
          break;
        case 'D':
          knots[0].y--;
          break;
        case 'L':
          knots[0].x--;
          break;
        case 'R':
          knots[0].x++;
          break;
      }
      // After moving the head knot update the subsequent knots
      for(let k = 1; k < knots.length; k++){
        // Calc distance d=√((x2 – x1)² + (y2 – y1)²)
        const distance = Math.sqrt(Math.pow(knots[k-1].x - knots[k].x, 2) + Math.pow(knots[k-1].y - knots[k].y, 2)); 
        // If the distance is greater than or equal to 2 that means the the knot is not 
        // adjacent to the one before it and needs to update its position
        if (distance >= 2){ 
          // Calc angle of the vector in the direction the knot needs to move
          //              90
          //              |
          // 180 / -180 - . - 0
          //              |
          //             -90
          const angle = (Math.atan2(knots[k-1].y - knots[k].y, knots[k-1].x - knots[k].x) * 180) / Math.PI;
          if(angle >= 22.5 && angle < 67.5){ // Move Top Right
            knots[k].x++;
            knots[k].y++;
          }
          else if(angle >= 67.5 && angle < 112.5){ // Move Top Center
            knots[k].y++;
          }
          else if(angle >= 112.5 && angle < 157.5){ // Move Top Left
            knots[k].x--;
            knots[k].y++;
          }
          else if(angle <= -22.5 && angle > -67.5){ // Move Bottom Right
            knots[k].x++;
            knots[k].y--;
          }
          else if(angle <= -67.5 && angle > -112.5){ // Move Bottom Center
            knots[k].y--;
          }
          else if(angle <= -112.5 && angle > -157.5){ // Move Bottom Left
            knots[k].x--;
            knots[k].y--;
          }
          else if(angle < 22.5 && angle > -22.5){ // Move Middle Right
            knots[k].x++;
          }
          else{ // Move Middle Left
            knots[k].x--;
          }
          // If this move was made to the last knot check if this new 
          // point has been recorded and if not add it to the list
          if(k === knots.length-1){
            const point = `${knots[k].x},${knots[k].y}`
            if(positionsVisited.indexOf(point) === -1){
              positionsVisited.push(point);
            }
          }
        }
      }
      
    }
  }

  return positionsVisited.length;
}