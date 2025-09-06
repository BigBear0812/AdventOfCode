// Puzzle for Day 1: https://adventofcode.com/2017/day/1

export const run = (fileContents) => {
  // Get the captcha from the first line of the input file.
  // Split this into an array of characters
  let captcha = fileContents[0].split("");
  // The total for Part1
  let total1 = 0;

  // Check for pairs of matching numbers between this number and the
  // next one wrapping around the end of the array
  for (let x = 0; x < captcha.length; x++) {
    let next = x + 1;
    // If reached the end of the array compare with the beginning of the array
    if (next === captcha.length) next = 0;

    // If a match is found add the value to the total
    if (captcha[x] === captcha[next]) total1 += parseInt(captcha[x]);
  }

  // The total for Part 2
  let total2 = 0;
  // Find the distance to halfway for the captcha
  let half = captcha.length / 2;
  // Check for pairs of matching numbers between this number and the
  // one halfway around the array wrapping around the end of the array
  // when necessary
  for (let x = 0; x < captcha.length; x++) {
    let pair = (x + half) % captcha.length;

    // If a match is found add the value to the total
    if (captcha[x] === captcha[pair]) total2 += parseInt(captcha[x]);
  }

  return { part1: total1, part2: total2 };
};
