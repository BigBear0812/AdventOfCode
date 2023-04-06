// Puzzle for Day 6: https://adventofcode.com/2016/day/6

export const run = (fileContents) => { 
  // Parse the input into a 2d array of letters
  let data = parseInput(fileContents);
  // Get the number of columns assuming each row has the same number of letters
  let columns = data[0].length;

  // Strings to store the resulting messages in
  let partOneMessage = "";
  let partTwoMessage = "";

  // Iterate through each column one at a time
  for(let x = 0; x < columns; x++){
    let map = new Map();

    // Itereate through each message to get the letter in the current column
    for(let message of data){
      let letter = message[x];

      // If the letter is already in the map then add one to its value
      if(map.has(letter)){
        let count = map.get(letter);
        map.set(letter, count+1);
      }
      // Else add it to the map with the value of one
      else{
        map.set(letter, 1);
      }
    }

    // Get a list where each index with value has a list of letters 
    // that all appeared that many times in the column
    let orderedLetters = [];
    // For each key, value in the map
    map.forEach((value, key) => {
      // If the ordered letters array position already has a value then 
      // add this key to the array of existing letters
      if(orderedLetters[value]){
        orderedLetters[value].push(key);
      }
      // Else create as new array for this index with just this key in it
      else{
        orderedLetters[value] = [key];
      }
    });

    // Get a string of all letters in each array ordered by the number of times they appear
    let orderedLetterStr = orderedLetters.join('');

    // For part one take the letter that appears most often
    partOneMessage += orderedLetterStr.slice(orderedLetterStr.length - 1);
    // For part two take the letter that appears least often
    partTwoMessage += orderedLetterStr.slice(0, 1);
  }

  return {part1: partOneMessage, part2: partTwoMessage};
}

// Parse the input data into a 2d array of letters in each message
const parseInput = (fileContents) => {
  let results = []

  // Process each line
  for(let line of fileContents){
    // Split each message into an array of individual letters
    results.push(line.split(''));
  }

  return results;
}