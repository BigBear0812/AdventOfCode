import { createHash } from 'node:crypto'

// Puzzle for Day 4: https://adventofcode.com/2015/day/4

// Setup variables
let secret = 'bgvyzdsv';
let found5Zeros = null;
let found6Zeros = null;

// Iterate through all number until finding one starting with 5 and one with 6 zero's
for(let x = 0; found5Zeros === null || found6Zeros === null ; x ++){
  const hash = createHash('md5').update(secret + x).digest('hex');
  if(found5Zeros === null && hash.substring(0,5) === '00000')
    found5Zeros = x;
  if(found6Zeros === null && hash.substring(0,6) === '000000')
    found6Zeros = x;
}

// Log output
console.log(`Lowest positive number for 5 zero hash: ${found5Zeros}`);
console.log(`Lowest positive number for 6 zero hash: ${found6Zeros}`)