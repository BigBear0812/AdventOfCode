// Puzzle for Day 7: https://adventofcode.com/2018/day/7

export const run = (fileContents) => {
  let steps = parseInput(fileContents);

  // let endingStep = findEndingStep(steps);

  let order = findTheStepOrder(steps);

  // PQWFJKSVUXEMNIHGTYDOZACRLB not right
  return {part1: order.join('')};
}

const findTheStepOrder = (steps) =>{
  // The next possible steps to consider
  let nextPossible = [];
  // Add all possible starting steps that have no steps before them to the next possible
  steps.forEach((val, key) => {
    if(val.before.length === 0)
    nextPossible.push(key);
  });
  // Sort the next steps alphabetically
  nextPossible.sort();

  // Move the first step from the next posible to the current
  let current ;
  // An array to hold the final step order
  let order = [];

  do{
    // Get the next step form the next possible array
    current = nextPossible.shift();
    // Add the current to the resulting order
    order.push(current);
    // Get the next steps from the current
    let currentNext = steps.get(current).after;
    if(currentNext !== undefined){
      // Add all next steps for the current to the next possible 
      // only if they are not already in the array and all of it's 
      // before steps have been completed
      for(let next of currentNext){
        // If not already in the next possible and all of its before steps have been completed
        if(nextPossible.indexOf(next) === -1 && steps.get(next).before.filter(c => order.indexOf(c) === -1).length === 0){
          nextPossible.push(next);
        }
      }
      // Sort the next possible array alphabetically
      nextPossible.sort();
    }
  }
  while(steps.get(current).after.length > 0 || nextPossible.length > 0);

  return order;
}

const parseInput = (fileContents) => {
  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let reg = new RegExp(/Step ([A-Z]) must be finished before step ([A-Z]) can begin./);
  let steps = new Map();

  for(let line of fileContents){
    let matches = line.match(reg);

    if(steps.has(matches[1])){
      let step = steps.get(matches[1]);
      step.after.push(matches[2]);
      steps.set(matches[1], step);
    }
    else{
      steps.set(matches[1], {after: [matches[2]], before: [], time: 61 + alphabet.indexOf(matches[1])});
    }

    if(steps.has(matches[2])){
      let step = steps.get(matches[2]);
      step.before.push(matches[1]);
      steps.set(matches[2], step);
    }
    else{
      steps.set(matches[2], {after: [], before: [matches[1]], time: 61 + alphabet.indexOf(matches[2])});
    }
  }

  return steps;
}