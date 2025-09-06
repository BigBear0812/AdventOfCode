// Puzzle for Day 7: https://adventofcode.com/2016/day/7

export const run = (fileContents) => {
  // The full set of addresses parsed into supernet sequences and hypernet sequences
  let addresses = parseInput(fileContents);
  // The counts of addresses supprting TLS and SSL
  let supportsTls = 0;
  let supportsSSL = 0;

  // Check each address
  for (let address of addresses) {
    // Solve Part 1

    // Assume there is not ABBA in either part of the address
    let sequenceTls = false;
    let hypernetSequencesTls = false;

    // Check each supernet sequence of this address for an ABBA
    for (let x = 0; x < address.sequences.length && !sequenceTls; x++) {
      sequenceTls = hasABBA(address.sequences[x]);
    }
    // Check each hypernet sequence of this address for an ABBA
    for (
      let x = 0;
      x < address.hypernetSequences.length && !hypernetSequencesTls;
      x++
    ) {
      hypernetSequencesTls = hasABBA(address.hypernetSequences[x]);
    }

    // Check if there is an ABBA in the supernet but not the hypernet
    // and add one to the result if true
    if (sequenceTls && !hypernetSequencesTls) supportsTls++;

    // Solve Part 2

    // Combine the sequences for the supernet and hypernet since in
    // this part the ABA or BAB can be anywhere in these sections
    let combinedSeq = address.sequences.join("");
    let combinedHSeq = address.hypernetSequences.join("");

    // Get all of the ABA's and BAB's from each of the combined sequences
    let sequenceABA = [];
    let hypernetSequenceBAB = [];
    sequenceABA = sequenceABA.concat(getABAOrBAB(combinedSeq));
    hypernetSequenceBAB = hypernetSequenceBAB.concat(getABAOrBAB(combinedHSeq));
    // Assume there is not SSL
    let hasSSL = false;

    // Check if there are both ABA's and BAB's
    if (sequenceABA.length > 0 && hypernetSequenceBAB.length > 0) {
      // Check each ABA by finding the corresponding BAB and comparing it to each actual BAB
      for (let x = 0; x < sequenceABA.length && !hasSSL; x++) {
        let letters = sequenceABA[x].split("");
        let correspondingBAB = `${letters[1]}${letters[0]}${letters[1]}`;
        for (let y = 0; y < hypernetSequenceBAB.length && !hasSSL; y++) {
          // If the coresponding BAB and actual BAB match this address has SSL
          hasSSL = correspondingBAB === hypernetSequenceBAB[y];
        }
      }
    }

    // If this has SSL then add one to the result
    if (hasSSL) supportsSSL++;
  }

  return { part1: supportsTls, part2: supportsSSL };
};

// A method to return all ABA or BAB patterns in a sequence
const getABAOrBAB = (sequence) => {
  // Split the sequence into an array of letters
  let splitSeq = sequence.split("");
  let result = [];

  // Starting with the third letter check for ABA and BAB sequences
  for (let x = 2; x < splitSeq.length; x++) {
    // Look back three letters
    let first = splitSeq[x - 2];
    let second = splitSeq[x - 1];
    let third = splitSeq[x];

    // Check if the letters are arraneged in the correct pattern
    if (first === third && first !== second) {
      // Add correct patterns to the result set
      result.push(`${first}${second}${third}`);
    }
  }

  return result;
};

// A method to determine if the sequence has an ABBA pattern in it
const hasABBA = (sequence) => {
  // Split the sequence into an array of letters
  let splitSeq = sequence.split("");
  let result = false;

  // Starting with the fourth letter check for ABBA sequences
  for (let x = 3; x < splitSeq.length && !result; x++) {
    // Look back four letters
    let first = splitSeq[x - 3];
    let second = splitSeq[x - 2];
    let third = splitSeq[x - 1];
    let fourth = splitSeq[x];

    // Check if the letters are arraneged in the correct pattern
    if (first === fourth && second === third && first !== second) {
      // Update result to true
      result = true;
    }
  }

  return result;
};

// Parse the input into an array of address objects
const parseInput = (fileContents) => {
  // The regex for separating supernet and hypernet sequences
  let reg = new RegExp(
    /([a-z]+)\[([a-z]+)\]([a-z]+)\[*([a-z]+)*\]*([a-z]+)*\[*([a-z]+)*\]*([a-z]+)*/,
  );
  let results = [];

  // Consider each line as a new address
  for (let line of fileContents) {
    // Arrays for the supernet and hypernet sequences of this address
    let sequences = [];
    let hypernetSequences = [];

    // Parse the line into sections
    let matches = line.match(reg);

    // Add the sections outside bracket to the sequences array and the
    // ones inside brackets to the hypernet sequences array
    if (matches[1]) {
      sequences.push(matches[1]);
    }
    if (matches[2]) {
      hypernetSequences.push(matches[2]);
    }
    if (matches[3]) {
      sequences.push(matches[3]);
    }
    if (matches[4]) {
      hypernetSequences.push(matches[4]);
    }
    if (matches[5]) {
      sequences.push(matches[5]);
    }
    if (matches[6]) {
      hypernetSequences.push(matches[6]);
    }
    if (matches[7]) {
      sequences.push(matches[7]);
    }

    // Create a new address object and add it to the array
    results.push({ sequences, hypernetSequences });
  }

  return results;
};
