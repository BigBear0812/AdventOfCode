// Puzzle for Day 15: https://adventofcode.com/2017/day/15

export const run = (fileContents) => {
  // Parse the generator start values from the input file
  let startVals = parseInput(fileContents);

  // Find the count of matching pairs for Part 1 and Part 2 
  let count1 = countPairs(startVals, 40000000);
  let count2 = countPairs(startVals, 5000000, true);

  return {part1: count1, part2: count2};
}

// Count the number of matching pairs of values
const countPairs = (startVals, totalRounds, isPart2 = false) => {
  // Values for A and B generators
  let A = startVals.A;
  let B = startVals.B;
  // The count of matching pairs
  let count = 0;
  // The number of pairs examined
  let pairsExamined = 0;

  // Continue looking for pairs until reaching the total rounds
  while(pairsExamined < totalRounds){
    // Compute the next valid value for A depending on Part 1 or Part 2 logic
    do{
      A = (A * 16807) % 2147483647;
    } while(isPart2 && A % 4 !== 0)
    // Compute the next valid value for B depending on Part 1 or Part 2 logic
    do{
      B = (B * 48271) % 2147483647;
    } while(isPart2 && B % 8 !== 0)

    // Convert to binary and compare the last 16 digits only.
    // If they match add 1 to count
    let binA = A.toString(2);
    let binB = B.toString(2);
    binA = binA.substring(binA.length - 16);
    binB = binB.substring(binB.length - 16);
    if(binA === binB){
      count++;
    }
    // Add 1 to pairs examined either way
    pairsExamined++;
  }

  return count;
}

// Parse the generator start values from the input for 
const parseInput = (fileContents) => {
  // Regex for each line of the input
  let reg = new RegExp(/Generator ([AB]) starts with (\d+)/);
  // Values for generator A and B
  let A;
  let B;

  // Match each line and assign the value correctly
  for(let line of fileContents){
    let matches = line.match(reg);

    if(matches[1] === 'A')
      A = parseInt(matches[2]);
    if(matches[1] === 'B')
      B = parseInt(matches[2]);
  }

  return {A, B};
}