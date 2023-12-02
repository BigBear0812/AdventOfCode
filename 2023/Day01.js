// Puzzle for Day 01: https://adventofcode.com/2023/day/1

export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(fileContents)

  return {part1: result1, part2: result2};
}

/**
 * Part 1 Solution
 * @param {string[]} fileContents 
 * @returns {number}
 */
const part1 = (fileContents) => {
  // Setup regex for the first and last digits on the line
  let firstDigitRegex = /(\d).*/;
  let lastDigitRegex = /.*(\d)/;
  // Track the sum of all calibration values
  let sum = 0;
  // Parse each line
  for(const line of fileContents){
    // Get the first digit and last digit of the line
    let firstDigit = line.match(firstDigitRegex);
    let lastDigit = line.match(lastDigitRegex); 
    // Concatenate the number and parse to an int that is added to the sum
    sum += parseInt(firstDigit[1] + lastDigit[1]);
  }

  return sum;
}

/**
 * Part 2 Solution
 * @param {string[]} fileContents 
 * @returns {number}
 */
const part2 = (fileContents) => {
  // Setup regex for the regex for the first and last digits or text number
  let firstDigitRegex = /(\d|one|two|three|four|five|six|seven|eight|nine).*/;
  let lastDigitRegex = /.*(\d|one|two|three|four|five|six|seven|eight|nine)/;
  // Track the sum of all calibration values
  let sum = 0;
  // Parse each line
  for(const line of fileContents){
    // Get the first digit and last digit or text number of the line
    let firstDigit = line.match(firstDigitRegex);
    let lastDigit = line.match(lastDigitRegex);
    // Concatenate the converted numbers and parse to an int that is added to the sum
    sum += parseInt(convertToDigit(firstDigit[1]) + convertToDigit(lastDigit[1]));
  }

  return sum;
}

/**
 * Convert a text number string to a single digit string. If already a single digit string leave it alone
 * @param {string} value 
 * @returns {string}
 */
const convertToDigit = (value) => {
  // A map of number text to digit strings
  let numberMap = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9'
  };

  // Try to convert the string to a digit string
  let digit = numberMap[value]; 

  // If invalid then this is already a digit string so return the original value
  if(!digit){
    digit = value;
  }

  return digit;
}