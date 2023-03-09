import process from "node:process";
import { open } from "node:fs/promises";
import { ifError } from "node:assert";

// Puzzle for Day 25: https://adventofcode.com/2022/day/25

// Check that the right number of arguments are present in the command
if (process.argv.length !== 3){
  console.log('Please specify an input file.');
  process.exit(1);
}

// Get the file name from the last argv value
const filename = process.argv[2];

// Open the file and pass it ot our main processing 
open(filename)
.then(async(file) => {
  // Process all of the lines of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then((fileContents) => {

  // Convert each line of the input from SNAFU to Decimal and add them together
  let total = 0;
  for(const line of fileContents){
    total += snafuToDecmial(line);
  }

  // Log the decimal sum
  console.log(`Decmial Total: ${total}`);

  // Convert the sum back to SNAFU
  let output = decimalToSnafu(total);

  // Log the SNAFU sum
  console.log(`SNAFU Total: ${output}`);
});

// Convert from decimal to SNAFU
const decimalToSnafu = (decimalNum) => {
  // Find the highest power of 5 that does not exceed the size of the number being converted.
  // This is how many base 5 digits there will be.
  let highestPower = 0;
  while(decimalNum > Math.pow(5, highestPower + 1)){
    highestPower++;
  }

  // Starting with the largest power of 5 reduce the number by dividing by 5 for each base 
  // 5 digit from largets to smallest and reducing the number by the modules 5. This converts 
  // the number to base 5.
  let remaining = decimalNum;
  let digits = [];
  for(let d = highestPower; d >= 0; d--){
    let divisor = Math.pow(5, d);
    let div = Math.floor(remaining / divisor);
    let mod = remaining % divisor;

    digits.push(div);

    remaining = mod;
  }
  
  // Convert the base 5 number to SNAFU by starting with the smallest digit and working up.
  let chars = [];
  for(let d = digits.length - 1; d >=0 ; d--){
    let digit = digits[d];

    // If the digit is greater than or equal to 5 pass up the result of the division and 
    // convert the remainder to be the new digits.
    if(digit >= 5){
      digits[d-1] += Math.floor(digit / 5);
      digit = digit % 5
    }

    // The digitd is now gauranteed to be 0-4. for 0-2 add the digit to the output. 
    // For 3 and 4 since they add one to the next digit add one to the next highest 
    // place digit in the array and append = or - repsectively.
    switch (digit){
      case 0:
        chars.unshift('0');
        break;
      case 1:
        chars.unshift('1');
        break;
      case 2:
        chars.unshift('2');
        break;
      case 3: 
        chars.unshift('=');
        digits[d-1] +=1;
        break;
      case 4:
        chars.unshift('-');
        digits[d-1] +=1;
        break;
    }
  }

  // Join all characters together without any seperator.
  return chars.join('');
}

// Convert SNAFU to decimal
const snafuToDecmial = (snafuNum) => {
  // Split the SNAFU string into individual characters
  let chars = snafuNum.split('');
  
  // For each character in the array convert to an appropriate decimal value
  let total = 0;
  for(let d = 0; d < chars.length; d++){
    let char = chars[d];
    let val;
    switch(char){
      case '2': 
        val = 2;
        break;
      case '1': 
        val = 1;
        break;
      case '0': 
        val = 0;
        break;
      case '-': 
        val = -1;
        break;
      case '=': 
        val = -2;
        break;
    }

    // Multiply each value the corresponding power of 5 for it's reverse 
    // index in the array. Add this value to the running total.
    total += val * Math.pow(5, (chars.length - (d + 1)));
  }

  return total;
}