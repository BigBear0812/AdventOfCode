// Puzzle for Day 5: https://adventofcode.com/2015/day/5

export const run = (fileContents) => {

  let niceTotal1 = 0;
  let niceTotal2 = 0;

  // Read in all of the lines one at a time
  for (const line of fileContents) {
    const chars = Array.from(String(line))
    // Part 1 
    let numVowels = 0;
    let lastChar = null;
    let doubleLetter = false;
    let badPair = false;

    for(const c of chars){
      // Counting the number fo vowels
      if (c === 'a' || c ===  'e' || c === 'i' || c === 'o' || c === 'u')
        numVowels++;

      if(lastChar !== null){
        // Checking if a double letter exists
        if(!doubleLetter && lastChar === c)
          doubleLetter = true;
        // Checking if a bad pair has been found
        const pair = `${lastChar}${c}`;
        if(!badPair && (pair === 'ab' || pair === 'cd' || pair === 'pq' || pair === 'xy'))
          badPair = true;
      }
      // Update the last char with the current char
      lastChar = c;
    }

    // Checking if the string is nice
    if(numVowels >= 3 && doubleLetter && !badPair)
      niceTotal1++;

    // Part 2
    let hasDoublePairs = false;
    let numSeperatedMatches = 0;
    for(let x = 1; x < chars.length; x++){
      // Checking the current pair to see if it is in the line twice or more
      var pair = `${chars[x-1]}${chars[x]}`
      if(!hasDoublePairs && findOccurences(line, pair) >= 2)
          hasDoublePairs = true;
      // Checking for matches separated by one letter
      if(x >= 2)
        if(chars[x-2] === chars[x])
        numSeperatedMatches++;     
    }

    // Checking if the line is nice
    if(hasDoublePairs && numSeperatedMatches >= 1)
      niceTotal2++;
  }

  return {part1: niceTotal1, part2: niceTotal2};
}

// Method for finding how many times a particular pair of letter 
// had a non-overlapping occurse in the line
const findOccurences = (line, sub) => {
  var lastIndexFound = null;
  var allIndexes = [];

  while(lastIndexFound != -1){
    if(lastIndexFound == null)
      lastIndexFound = line.indexOf(sub);
    else
      lastIndexFound = line.indexOf(sub, lastIndexFound + sub.length);// sub.length looks for non-overlapping recurrences. For overlapping recurrences use +1 instead
    if(lastIndexFound >= 0){
      allIndexes.push(lastIndexFound);
    }
  }
  
  return allIndexes.length;
}