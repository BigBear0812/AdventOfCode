// Puzzle for Day 2: https://adventofcode.com/2016/day/2

export const run = (fileContents) => {
  // The keypad layout, current position, and results for part 1
  let keypadPart1 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
  let positionPart1 = {y:1, x:1};
  let resultPart1 = [];

  // The keypad layout, current position, and results for part 2
  let keypadPart2 = [
    [ null,  null,  1   ,  null,  null ],
    [ null,  2   ,  3   ,  4   ,  null ],
    [ 5   ,  6   ,  7   ,  8   ,  9    ],
    [ null, 'A'  , 'B'  , 'C'  ,  null ],
    [ null,  null, 'D'  ,  null,  null ]
  ];
  let positionPart2 = {y:2, x:0};
  let resultPart2 = [];

  // At each line of the file split each character into an array to process
  for(let line of fileContents){
    let instructionList = line.split("");
    // Process each step in the instructions list for each keypad and update the position 
    for(let instruction of instructionList){
      positionPart1 = processUpdate(instruction, positionPart1, keypadPart1);
      positionPart2 = processUpdate(instruction, positionPart2, keypadPart2);
    }
    // After the entire list is processed add the character bat this position to the result for each keypad
    resultPart1.push(keypadPart1[positionPart1.y][positionPart1.x]);
    resultPart2.push(keypadPart2[positionPart2.y][positionPart2.x]);
  }

  // Log output
  console.log("Part 1:", resultPart1.join(""));
  console.log("Part 2:", resultPart2.join("")); 
}

const processUpdate = (instruction, position, keypad) => {
  // Save a temp copy of the current position to be used for updating
  let tempPosition = JSON.parse(JSON.stringify(position));

  // Update the temp position cooprdinates based on the instruction given
  switch(instruction){
    case "U":
      tempPosition.y -= 1;
      break;
    case "D":
      tempPosition.y += 1;
      break;
    case "L":
      tempPosition.x -= 1;
      break;
    case "R":
      tempPosition.x += 1;
      break;
  }

  // If the value of the new temp position is valid and has a character then return the new position
  if (keypad[tempPosition.y] && keypad[tempPosition.y][tempPosition.x])
    return tempPosition;
  // Otherwise the new temp positions is either null or undefined so return the original position
  else
    return position;
}