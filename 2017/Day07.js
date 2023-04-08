// Puzzle for Day 7: https://adventofcode.com/2017/day/7

export const run = (fileContents) => {
  // Create a map of all tower info
  let towers = parseInput(fileContents);
  
  // Convert the tower map into an array for Part 1
  let towersArr = [];
  towers.forEach((value, key) => {
    towersArr.push({
      program: key,
      weight: value.weight,
      children: value.children
    });
  })
  // Find the program on the bottom of the tower
  let result1 = findBottomProgram(towersArr);

  // Find the off balance program and what it's correct weight should be
  let result2 = findChildWeights(towers, result1);

  return {part1: result1, part2: result2.found.correctedIndividualWeight};
}

// Find the weight of the child and the off balance program 
// starting from the bottom of the tower. Search recursively 
// using a Depth First Search (DFS) style algorithm
const findChildWeights = (towers, bottomProgram) => {
  // Current program 
  let current = towers.get(bottomProgram);
  // If this has no children that we have reached the top 
  // of a sub tower so return the weight and that we have 
  // not found an off balance program
  if(current.children.length === 0){
    return {weight: current.weight, found: null};
  }

  // Find the weight of all children and if one of the children 
  // has found an off balance program save that as well
  let childWeights = [];
  let found = null;
  for(let child of current.children){
    // Find the weight of the child using recursion
    let result = findChildWeights(towers, child);
    childWeights.push(result.weight);
    if(result.found !== null){
      found = result.found;
    }
  }

  // If an off balance program has not been found see if one of 
  // the current children is off balance
  if(found === null){
    // Find the index of the offbalance program if it exists by 
    // comparing every child program weigfht to every other child 
    // program weight
    let offBalanceIndex = -1;
    for(let x = 0; x < childWeights.length; x++){
      let matches = false;
      for(let y = 0; y < childWeights.length && !matches; y++){
        if(x !== y)
          matches = childWeights[x] === childWeights[y];
      }
      if(!matches)
        offBalanceIndex = x;
    }

    // If an off balance program was found
    if(offBalanceIndex !== -1){
      // Find the weight that off balance subtower should have been
      let correctWeight = offBalanceIndex+1 === childWeights.length ? 
      childWeights[offBalanceIndex-1] : childWeights[offBalanceIndex+1];

      // Find the difference for the off balance subtower
      let difference = correctWeight - childWeights[offBalanceIndex];
      
      // Find the corrceted individual weight for that sub tower
      let correctedIndividualWeight = towers.get(current.children[offBalanceIndex]).weight + difference;

      // Find the correct weight for this tower
      let weight = (correctWeight * childWeights.length) + current.weight; 
      // Return the foud program and the total weight up to the parent level
      return {weight, found: {program: current.children[offBalanceIndex], correctedIndividualWeight}};
    }
  }
  
  // If there is no off balance program found or one had been found previously 
  // return the total weight for this tower and the found off balance program info
  let weight = childWeights.reduce((sum, weight) => sum + weight, 0) + current.weight; 
  return {weight, found};
}

// Find the program at the bottom of the tree that is referenced 
// by no other program as one of it's children
const findBottomProgram = (towers) => {
  // Continue searching which there is more than one program left inthe array
  while(towers.length > 1){
    // Remove any programs that have no child programs
    towers = towers.filter(x => x.children.length > 0);
    // Check the still existing children of each remaining tower
    for(let x = 0; x < towers.length; x++){
      // Remove any children from a tower that are not still in the larger array
      towers[x].children = towers[x].children.filter(c => towers.find(t => t.program === c) !== undefined);
    }
  } 

  return towers[0].program
}

// Parse each row as a new tower which may or may not have children
const parseInput = (fileContents) => {
  // Regex for parsing each row
  let reg = new RegExp(/([a-z]+) \((\d+)\)(?: -> ([, a-z]+))*/);
  // Resulting tower map
  let towers = new Map();

  // For each line match the content using regex and create the map objects
  for(let line of fileContents){
    let matches = line.match(reg);

    towers.set(matches[1], {
      weight: parseInt(matches[2]),
      children: matches[3] === undefined ? [] : matches[3].split(', ')
    });
  }

  return towers;
}