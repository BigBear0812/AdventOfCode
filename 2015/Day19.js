// Puzzle for Day 19: https://adventofcode.com/2015/day/19

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Pase the input into a useable set of info
  let info = parseInput(fileContents);

  // Find all unique next possible replacements from the medicine molecule
  let results = nextPossibleMolecules(info);

  // Count the total number of unique results
  let count = 0;
  results.forEach(() => count++);

  // Find the number of steps needed to reach the medicine molecule
  let count2 = stepsToMolecule(info);

  return { part1: count, part2: count2 };
};

// Parse the input file lines into a useable object
const parseInput = (fileContents) => {
  // Regex for parsing each replacement option
  let regReplacement = new RegExp(/([A-Za-z]+) => ([A-Za-z]+)/);
  // Regex for parsing a molecule string such as the medicine molecule
  let regMolecule = new RegExp(/([A-Z]?[a-z]*)/g);
  // All resulting replacements
  let replacements = new Map();
  // The molecule brokwen into an array of atoms
  let molecule = [];
  // Flag to check fi there are more replacements to be processed
  let moreReplacements = true;
  for (let line of fileContents) {
    // If a blank line is found the all replacements have been processed
    if (line === "") {
      moreReplacements = false;
      continue;
    }
    // If there are more replacements then parse and add them to the map
    if (moreReplacements) {
      let matches = line.match(regReplacement);
      let arr = [];
      if (replacements.has(matches[1])) arr = replacements.get(matches[1]);
      arr.push(matches[2]);
      replacements.set(matches[1], arr);
    }
    // Else parse the medicine molecule into atoms
    else {
      molecule = line.match(regMolecule).filter((x) => x !== "");
    }
  }
  return { molecule, replacements };
};

// Find all of the next possible moves from the medicine molecule
const nextPossibleMolecules = (info) => {
  // Use a set for the results to ensure not double solutions are reported
  let results = new Set();

  // Apply each replacement option
  info.replacements.forEach((value, key) => {
    // For each replacement option for the given key
    for (let option of value) {
      // Check each atoms in the molecule to see if it matches this key
      for (let x = 0; x < info.molecule.length; x++) {
        let atom = info.molecule[x];
        // If the atom matches this key from the replacement map then do
        // the replacement and add it to the result set
        if (atom === key) {
          let tempMolecule = JSON.parse(JSON.stringify(info.molecule));
          tempMolecule[x] = option;
          let newMolecule = tempMolecule.join("");
          results.add(newMolecule);
        }
      }
    }
  });

  return results;
};

// Couldn't figure out the solution for this that would complete in a reasonable
// timeframe. This solution comes from the link below and has an excellent
// explanation. I have summarized it here.
//
// Summary:
// 1. Ar, Rn, and Y are terminal atoms in the molecule since they cannot be turned
// into something else.
//
// 2. All atoms that are not terminal can be converted to a single value since each
// one only adds 1 to the number of steps needed to reach the medicine molecule.
// This can be expressed as X => XX
//
// 3. The arrangement of the terminal atoms is such that you could replace
// Rn, Ar, and Y with ( ) , respectively. This creates the arrangements X => X(X)
// and X => X(X,X) and X(X,X,X). This means that each of these arrangements
// reduces the total number of steps by 3, 5, and 7 repsectively.
//
// 4. If the molecule is considered the starting point then the number of steps
// can be found by subtracting the number of steps each scenario reduces the
// number of atoms by to reach the result. These scenarios each translate to the
// equations below.
// X: count(atoms) - 1
// Rn and Ar: count(Rn + Ar)
// Y: 2 * count(Y)
//
// 5. Putting these together creates the number of steps to the final molecule
// count(atoms) - (count(Rn) + count(AR)) - 2 * count(Y) - 1 = steps
//
// https://www.reddit.com/r/adventofcode/comments/3xflz8/day_19_solutions/
const stepsToMolecule = (info) => {
  // Total up the number of each terminal atom
  let countRn = info.molecule.reduce(
    (total, val) => total + (val === "Rn" ? 1 : 0),
    0,
  );
  let countAr = info.molecule.reduce(
    (total, val) => total + (val === "Ar" ? 1 : 0),
    0,
  );
  let countY = info.molecule.reduce(
    (total, val) => total + (val === "Y" ? 1 : 0),
    0,
  );

  // Run the equation described above
  return info.molecule.length - (countRn + countAr) - 2 * countY - 1;
};
