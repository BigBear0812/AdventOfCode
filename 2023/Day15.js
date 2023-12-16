// Puzzle for Day 15: https://adventofcode.com/2023/day/15

export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return {part1: result1, part2: result2};
}

/**
 * Part 2 Solution
 * @param {string[]} fileContents 
 * @returns {number}
 */
const part2 = (fileContents) => {
  // Get the steps from the first line of the input
  let steps = fileContents[0].split(',');
  // Initialize and array of 256 empty arrays
  let boxCount = 256;
  let boxes = [];
  for(let b = 0; b < boxCount; b++){
    boxes.push([]);
  }

  // Process each step in order
  for(let step of steps){
    // Use regex to get the pertinent information from the step information
    let matches = step.match(/([a-z]+)([-=])(\d*)/);
    let label = matches[1];
    let boxNum = getHash(label);
    let operation = matches[2];
    let foundLensIndex = boxes[boxNum].findIndex(l => l.label === label);

    // Add or update lens
    if(operation === '='){
      // Get the focal length from the step input
      let focalLength = parseInt(matches[3]);
      // If a matching lens is found update it
      if(foundLensIndex >= 0){
        boxes[boxNum][foundLensIndex].focalLength = focalLength;
      }
      // Otherwise add this lens
      else{
        boxes[boxNum].push({label, focalLength});
      }
    }
    // Remove lens
    else if(operation === '-'){
      // If the lens was found remove it. Otherwise do nothing
      if(foundLensIndex >= 0){
        boxes[boxNum].splice(foundLensIndex, 1);
      }
    }
  }

  // Get the focusing power of the set of lenses
  let focusingPower = 0;
  for(let b = 0; b < boxes.length; b++){
    for(let l = 0; l < boxes[b].length; l++){
      // Focusing power formula
      focusingPower += (b+1) * (l+1) * boxes[b][l].focalLength;
    }
  }

  return focusingPower;
}

/**
 * Part 1 Solution
 * @param {string[]} fileContents 
 * @returns {number}
 */
const part1 = (fileContents) => {
  // Get the sum of the hash values for each step
  return fileContents[0].split(',').reduce((total, value) => total += getHash(value), 0);
}

/**
 * Get the has value of the string 
 * @param {string} input 
 * @returns {number}
 */
const getHash = (input) => {
  // Get the total sum of each character by getting the character code, multiply it by 17, and modulus it by 256
  return input.split('').reduce((total,value) => {
    total += value.charCodeAt(0);
    total *= 17;
    return total % 256;
  }, 0);
}