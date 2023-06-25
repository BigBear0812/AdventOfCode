// Puzzle for Day 4: https://adventofcode.com/2019/day/4

export const run = (fileContents) => {
  let range = fileContents[0].split("-").map(x => parseInt(x));

  let results1 = [];
  let results2 = [];
  for(let x = range[0]; x <= range[1]; x++){
    let digits = x.toString().split("").map(x => parseInt(x));
    let validDecreasing = true;
    let validPair = false;
    let validPairAlone = false;
    for(let d = 1; d < digits.length && validDecreasing === true; d++){
      let curr = digits[d];
      let prev = digits[d-1];
      validDecreasing = curr >= prev;
      let currValidPair = curr === prev
      let currValidPairAlone = false;
      if(currValidPair){
        if(d+1 < digits.length){
          let next = digits[d+1];
          currValidPairAlone = next !== curr;
        }
        else{
          currValidPairAlone === true;
        }
      }

      if(!validPair && currValidPair)
        validPair = currValidPair;
      if(!validPairAlone && currValidPairAlone)
        validPairAlone = currValidPairAlone;
    }

    if(validDecreasing && validPair)
      results1.push(x);
    
    if(validDecreasing && validPair && validPairAlone)
      results2.push(x);
  }

  // 938 too low, 1517 too high
  return {part1: results1.length, part2: results2.length};
}