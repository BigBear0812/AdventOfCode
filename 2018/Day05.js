// Puzzle for Day 5: https://adventofcode.com/2018/day/5

export const run = (fileContents) => {
  // Convert the polymer string into an array
  let polymer = fileContents[0].split('');

  // Shrink down the polymer as much as possible
  let shrunk = shrinkPolymer(polymer);

  // Find the smallest possible polymer by removing certain letters 
  let shortest = findShortest(polymer);

  return {part1: shrunk.length, part2: shortest.length};
}

// Find the shortest polymer possible by removing each letter of 
// the alphabet one at a time before shrinking the new polymer
const findShortest = (polymer) => {
  // Start with an array of the alphabet
  let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // The shortest polymer found starting out as null
  let shortest = null

  for(let alpha of alphabet){
    // Get the uppercase version of the letter
    let upper = alpha.toLocaleUpperCase();
    // Create a new array with this letter and its uppercase equivalent filtered out
    let changed = polymer.filter(x => x !== alpha && x !== upper);
    // Shrink down this new polymer
    let shrunk = shrinkPolymer(changed);
    // If it is the shortest seen so far then save it
    if(shortest === null || shrunk.length < shortest.length)
      shortest = shrunk;
  }

  return shortest;
}

// Shrink down the polymer as much as possible
const shrinkPolymer = (polymer) => {
  // Marker to know if letters were deleted form the polymer each round
  let deleted;

  do{
    // Set deleted to false
    deleted = false
    // Compare every letter in the polymer to it's previous one. 
    // Going from the end of the array forward makes it safe to 
    // delete items immediately since the array will shorten while 
    // approaching 0 instead of while approaching the end of the array
    for(let x = polymer.length - 1; x > 0; x--){
      let last = x-1;
      // Delete both letters if they are matching letters where one 
      // is uppercase and the other is lowercase. This is done by 
      // comparing the distance between their char codes. If they 
      // are the upper and lowercase version of each other then 
      // they will always have a differance of 32
      if(Math.abs(polymer[last].charCodeAt() - polymer[x].charCodeAt()) === 32){
        polymer.splice(x, 1);
        polymer.splice(last, 1);
        deleted = true;
      }
    }
  }
  // Continue processing if the array has just deleted items the last round
  while(deleted)

  return polymer;
}