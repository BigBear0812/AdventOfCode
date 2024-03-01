// Puzzle for Day 01: https://adventofcode.com/2020/day/1

export const run = (fileContents) => {
  // Parse the input from strings to ints
  let values = fileContents.map(x => parseInt(x));

  // Try adding pairs of numbers until a pair equals 2020
  let result1 = null;
  for(let a = 0; a < values.length && result1 === null; a++){
    for(let b = a+1; b < values.length && result1 === null; b++){
      // If the numbers add up to 2020 set the result to break out of the loops
      if(values[a] + values[b] == 2020){
        result1 = values[a] * values[b];
      }
    }
  }

  // Try adding triplets of numbers until a set equals 2020
  let result2 = null;
  for(let a = 0; a < values.length && result2 === null; a++){
    for(let b = a+1; b < values.length && result2 === null; b++){
      for(let c = b+1; c < values.length && result2 === null; c++){
        // If the numbers add up to 2020 set the result to break out of the loops
        if(values[a] + values[b] + values[c] == 2020){
          result2 = values[a] * values[b] * values[c];
        }
      }
    }
  }

  return {part1: result1, part2: result2};
}

