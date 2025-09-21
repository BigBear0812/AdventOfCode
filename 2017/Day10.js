// Puzzle for Day 10: https://adventofcode.com/2017/day/10

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse in the file input as an array in integers
  let input1 = fileContents[0].split(",").map((x) => parseInt(x));

  // Compute the sparse has for the input given in part 1 after one round of hashing
  let sparse1 = knotsSparseHash(input1, 1);

  // Parse the input file as an array of ASCII value from each character with an additional suffix
  let input2 = fileContents[0]
    .split("")
    .map((x) => x.charCodeAt(0))
    .concat([17, 31, 73, 47, 23]);

  // Compute the sparse hash of the input for Part 2 after 64 rounds of hashing
  let sparse2 = knotsSparseHash(input2, 64);
  // Condense the sparse hash into a dense hash
  let dense2 = sparseToDense(sparse2);

  return { part1: sparse1[0] * sparse1[1], part2: dense2 };
};

// Convert a sparse hash of a 256 int array into a desnse
// hash of a 32 character hexadecimal string
const sparseToDense = (sparseHash) => {
  // The hexademcimal digits for the output
  let denseDigits = [];
  while (sparseHash.length > 0) {
    // Splice the hash 16 characters at a time
    let digits = sparseHash.splice(0, 16);
    // Compute a bitwise XOR between all of the ints and
    // convert the result to hexadecimal
    let hexDigit = eval(digits.join(" ^ ")).toString(16);
    // Ensure each result has 2 digits by adding a
    // leading 0 if necessary
    if (hexDigit.length < 2) hexDigit = 0 + hexDigit;
    denseDigits.push(hexDigit);
  }

  // Join all results for the output string
  return denseDigits.join("");
};

// Create the sparse hash for an input and a specified number of rounds
const knotsSparseHash = (input, rounds) => {
  // Create an array of the integers 0-255 in order
  let arr = [];
  for (let x = 0; x < 256; x++) {
    arr.push(x);
  }

  // The index to start the hashing and the additional spaces
  // to skip after each number of the input should begin at 0
  // and carry over from round to round
  let index = 0;
  let skipSize = 0;

  // Repeat the hashing for the specified number of rounds
  for (let r = 0; r < rounds; r++) {
    // Comtinue processing this round until each int
    // of the input has been applied
    for (let len of input) {
      // Find the end index for this section to reverse
      let endIndex = index + len;
      // Get the sub array to reverse
      let subArr = arr.slice(index, endIndex);
      // If the end index is past the end of the array get the
      // remaining numbers from the beginning of the array
      if (endIndex > arr.length) {
        subArr = subArr.concat(arr.slice(0, endIndex % arr.length));
      }
      // Reverse the sub array
      subArr.reverse();
      // If the end index is past the end of the array add the last
      // part of the sub array bacj on to the fron of the array
      if (endIndex > arr.length) {
        // Find the spearation point
        let separate = endIndex % arr.length;
        // Remove the end of the reversed sub array
        let startArr = subArr.splice(-separate);
        // Add the start array to replace the integers at the front of the array
        arr.splice(0, startArr.length, ...startArr);
      }
      // use the sub array to replace the integers in the positions of the
      // array starting with the index
      arr.splice(index, subArr.length, ...subArr);
      // Advance the index the length of the sub array that was just reversed
      // plus the skip size. Modulus the value by the length of the array
      // to handle situations where the index circles around to the front
      // of the array again
      index = (index + len + skipSize) % arr.length;
      // Increment the skip size after each value of the input is applied
      skipSize++;
    }
  }

  return arr;
};
