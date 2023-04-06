// Puzzle for Day 11: https://adventofcode.com/2015/day/11

export const run = (fileContents) => {
  // Get Santa's old password from the input file
  let oldPassword = fileContents[0];

  // Find the first next good password
  let nextGood1 = nextGoodPassword(oldPassword);

  // Find the second next good password
  let nextGood2 = nextGoodPassword(nextGood1);

  return {part1: nextGood1, part2: nextGood2};
}

// Get the next good password by incrementing the poasswords by one letter 
// until finding a password that fits the requirements.
const nextGoodPassword = (password) => {
  // All possible starights without i, l, or o
  const straights = new Set();
  straights.add('abc');
  straights.add('bcd');
  straights.add('cde');
  straights.add('def');
  straights.add('efg');
  straights.add('fgh');
  straights.add('pqr');
  straights.add('qrs');
  straights.add('rst');
  straights.add('stu');
  straights.add('tuv');
  straights.add('uvw');
  straights.add('vwx');
  straights.add('wxy');
  straights.add('xyz');
  
  // Alphabet in order without i, l, or o
  const letters = 'abcdefghjkmnpqrstuvwxyz'.split('');
  
  // Current password split into an array of each letter
  let passArray = password.split('');

  // This password is not valid and a new one should be found
  let valid = false;
  while(!valid){
    // Increment the password by one letter
    passArray = incrementLastLetter(passArray, letters);

    // Check for a straight 
    let straightValid = false;
    for(let x = 3; x <= passArray.length && !straightValid; x++){
      // Get a 3 letter section of the array
      let potentialStraight = passArray.slice(x-3, x).join('');
      // See if those values are in the set of possible straights
      if(straights.has(potentialStraight))
        straightValid = true;
    }

    // Check does not contain i, o, or l
    // I did not include this check since my 
    // input does not contain these letters 
    // and neither should any future password 
    // based on the letter set being used


    // Check for non-overlapping pairs
    let pairsValid = false;
    let pair1 = [];
    for(let x = 2; x <= passArray.length && !pairsValid; x++){
      // Get a 2 character pair from the password
      let potentialPair = passArray.slice(x-2, x);
      // If a pair has been found
      if(potentialPair[0] === potentialPair[1]){
        // If this is the second pair make sure the poositions int he array do not overlap
        if(pair1.length > 0 && !pair1.some(a => a === x-2) && !pair1.some(a => a === x-1)){
          pairsValid = true;
        }
        // Push the index of this pair into the set of pairs
        pair1.push(x-2);
        pair1.push(x-1);
      }
    }

    // See if this password passed both tests
    valid = straightValid && pairsValid;
  }

  // Return the next valid password as a string
  return passArray.join('');
}

// Increment the password by one letter in the avilable set of letters using recursion
const incrementLastLetter = (passArray, letters) => {
  // If the array is empty return back up the call stack
  if(passArray.length === 0){
    return passArray;
  }

  // Pop off the last letter of the array
  let lastChar = passArray.pop();
  // Get the index of the next character from the set of available letters
  let nextCharIndex = letters.indexOf(lastChar) + 1;
  // If this letter reached the end of the alphabet then set the next index to 
  // 0 and increment the previous set of letters by one
  if(nextCharIndex === letters.length){
    passArray = incrementLastLetter(passArray, letters);
    nextCharIndex = 0;
  }
  // Add the new letter to the end of the password and return it
  passArray.push(letters[nextCharIndex]);
  return passArray
};