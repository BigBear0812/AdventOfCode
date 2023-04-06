// Puzzle for Day 11: https://adventofcode.com/2016/day/11

export const run = (fileContents) => {
  let floors = parseInput(fileContents);

  let moves1 = leastNumberOfSteps(floors);

  floors[0].microchips.push('elerium');
  floors[0].generators.push('elerium');
  floors[0].microchips.push('dilithium');
  floors[0].generators.push('dilithium');

  let moves2 = leastNumberOfSteps(floors);

  return {part1: moves1, part2: moves2};
}

// Use Breadth First Search (BFS) to get the least number of steps 
// required to move everything to the top floor
// I took a lot of advice from the solutions megathread in building this solution 
// https://www.reddit.com/r/adventofcode/comments/5hoia9/2016_day_11_solutions/
const leastNumberOfSteps = (floors) => {
  // Create the starting state for the simulation
  let state = {
    elevator: 0,
    floors: JSON.parse(JSON.stringify(floors)),
    turns: 0
  }

  // Keep track of the possible next states to examine. Start by adding the inital state
  let states = [];
  states.push(state);

  // Setup tracking for seen states and add the inital state
  let seenStates = new Set();
  seenStates.add(getMemo(state));

  // This will return our least number of moves made
  let moves = undefined;

  // Continue processing next states while there is still more to 
  // process and a solution has not yet been found
  while (states.length > 0 && moves === undefined) {
    // Remove the next state to examine from the front of the array
    let current = states.shift();

    // Check for this being the final solution
    if(current.floors[0].microchips.length === 0 &&
      current.floors[0].generators.length === 0 &&
      current.floors[1].microchips.length === 0 &&
      current.floors[1].generators.length === 0 &&
      current.floors[2].microchips.length === 0 &&
      current.floors[2].generators.length === 0){
        moves = current.turns;
    }
    // If not the final solution
    else{
      // Find the next floors that can be mvoed to
      let nextFloors = [];
      // If can move up
      if ((current.elevator + 1) < current.floors.length) {
        nextFloors.push(current.elevator + 1);
      }
      // If can move down
      if ((current.elevator - 1) >= 0) {
        nextFloors.push(current.elevator - 1);
      }

      // If this is the third floor and the bottom two floors are empty don't move anything down
      if(current.elevator === 2 && 
        current.floors[0].microchips.length === 0 && 
        current.floors[0].generators.length === 0 &&
        current.floors[1].microchips.length === 0 &&
        current.floors[1].generators.length === 0){
          let index = nextFloors.indexOf(1);
          nextFloors.splice(index, 1);
      }
      // Else if this is the second floor and the first floor is empty don't move anything down
      else if(current.elevator === 1 && 
        current.floors[0].microchips.length === 0 && 
        current.floors[0].generators.length === 0){
          let index = nextFloors.indexOf(0);
          nextFloors.splice(index, 1);
      }
  
      // For each of the possible next floors find potential next states
      for (let nextFloor of nextFloors) {
        // New states to consider
        let newStates = [];

        // If going up first see if you can move two items before considering if you can move one
        if(nextFloor > current.elevator){
          newStates = moveTwoItems(current, nextFloor, seenStates);
          if(newStates.length === 0)
            newStates = moveOneItem(current, nextFloor);
        }
        // If going down see if you only have to move one down before considering if you can move two
        else{
          newStates = moveOneItem(current, nextFloor);
          if(newStates.length === 0)
            newStates = moveTwoItems(current, nextFloor);
        }

        // If new states have bee found see if they have been seen before. 
        // If not then they should be considered
        if(newStates.length > 0){
          for(let nextState of newStates){
            let newMemo = getMemo(nextState);
            if(!seenStates.has(newMemo)){
              seenStates.add(newMemo);
              states.push(nextState);
            }
          }
        }
      }
    }
    
  }

  return moves;
}

const moveTwoItems = (current, nextFloor) => {
  let states = [];

  // Move two microchips
  for (let x = 0; x < current.floors[current.elevator].microchips.length; x++) {
    for (let y = x + 1; y < current.floors[current.elevator].microchips.length; y++) {
      let micro1 = current.floors[current.elevator].microchips[x];
      let micro2 = current.floors[current.elevator].microchips[y];
      // If can move both microchips to the next floor
      // Must have both corresponding generators or no generators
      if ((current.floors[nextFloor].generators.indexOf(micro1) !== -1 && 
        current.floors[nextFloor].generators.indexOf(micro2) !== -1) ||
        current.floors[nextFloor].generators.length === 0) {
        // Generate this next state
        let nextState = JSON.parse(JSON.stringify(current));
        let ind1 = nextState.floors[current.elevator].microchips.indexOf(micro1);
        nextState.floors[current.elevator].microchips.splice(ind1, 1);
        let ind2 = nextState.floors[current.elevator].microchips.indexOf(micro2);
        nextState.floors[current.elevator].microchips.splice(ind2, 1);
        nextState.floors[nextFloor].microchips.push(micro1);
        nextState.floors[nextFloor].microchips.push(micro2);
        nextState.turns++;
        nextState.elevator = nextFloor;
        states.push(nextState);
      }
    }
  }

  // Move two generators
  for (let x = 0; x < current.floors[current.elevator].generators.length; x++) {
    for (let y = x + 1; y < current.floors[current.elevator].generators.length; y++) {
      let gen1 = current.floors[current.elevator].generators[x];
      let gen2 = current.floors[current.elevator].generators[y];
      // If can move both generators to the next floor
      // Must have both corresponding microchips or must have matching 
      // generators for each of the microchips on the next floor
      if ((current.floors[nextFloor].microchips.indexOf(gen1) !== -1 && 
        current.floors[nextFloor].microchips.indexOf(gen2) !== -1) ||
        current.floors[nextFloor].microchips.length <= current.floors[nextFloor].generators.length) {
        // Generate this next state
        let nextState = JSON.parse(JSON.stringify(current));
        let ind1 = nextState.floors[current.elevator].generators.indexOf(gen1);
        nextState.floors[current.elevator].generators.splice(ind1, 1);
        let ind2 = nextState.floors[current.elevator].generators.indexOf(gen2);
        nextState.floors[current.elevator].generators.splice(ind2, 1);
        nextState.floors[nextFloor].generators.push(gen1);
        nextState.floors[nextFloor].generators.push(gen2);
        nextState.turns++;
        nextState.elevator = nextFloor;
        states.push(nextState);
      }
    }
  }

  // Move one of each
  for(let x = 0; x < current.floors[current.elevator].microchips.length; x++){
    for(let y = 0; y < current.floors[current.elevator].generators.length; y++){
      let micro = current.floors[current.elevator].microchips[x];
      let gen = current.floors[current.elevator].generators[y]; 
      // Microchips and generators can only be moved together if they match 
      // and if the next floor does not have any unmatched microchips
      if(micro === gen && 
        current.floors[nextFloor].microchips.length <= current.floors[nextFloor].generators.length){
        // Generate this next state
        let nextState = JSON.parse(JSON.stringify(current));
        nextState.floors[current.elevator].microchips.splice(x, 1);
        nextState.floors[current.elevator].generators.splice(y, 1);
        nextState.floors[nextFloor].microchips.push(micro);
        nextState.floors[nextFloor].generators.push(gen);
        nextState.turns++;
        nextState.elevator = nextFloor;
        states.push(nextState);
      }
    }
  }

  return states;

}

// Possible next states if only trying to move one microchip or generator
const moveOneItem = (current, nextFloor) => {
  let states = [];
  // Move one microchip
  for (let x = 0; x < current.floors[current.elevator].microchips.length; x++) {
    let micro = current.floors[current.elevator].microchips[x];
    // If can move this microchip to the next floor
    // Must have the corresponding generator or no generators
    if (current.floors[nextFloor].generators.indexOf(micro) !== -1 ||
      current.floors[nextFloor].generators.length === 0) {
      // Generate this next state
      let nextState = JSON.parse(JSON.stringify(current));
      nextState.floors[current.elevator].microchips.splice(x, 1);
      nextState.floors[nextFloor].microchips.push(micro);
      nextState.turns++;
      nextState.elevator = nextFloor;
      states.push(nextState);
    }
  }

  // Move one generator
  for (let x = 0; x < current.floors[current.elevator].generators.length; x++) {
    let gen = current.floors[current.elevator].generators[x];
    // If can move this generators to the next floor
    // Must have the corresponding microchip or must have matching 
    // generators for each of the microchips on the next floor
    if (current.floors[nextFloor].microchips.indexOf(gen) !== -1 ||
      current.floors[nextFloor].microchips.length <= current.floors[nextFloor].generators.length) {
      // Generate this next state
      let nextState = JSON.parse(JSON.stringify(current));
      nextState.floors[current.elevator].generators.splice(x, 1);
      nextState.floors[nextFloor].generators.push(gen);
      nextState.turns++;
      nextState.elevator = nextFloor;
      states.push(nextState);
    }
  }

  return states;
}

// Create memo version of the current state.
// The microchips and generators are all interchangeable pairs which 
// means that none of them are unique. Since none are unique just 
// replace every microchip and generator with a single letter that 
// is always the same. This allows us to prune potential next states 
// extremely quickly. This is the key optimization for this puzzle.
const getMemo = (current) => {
  let memo = `E:${current.elevator}`;
  for(let x = 0; x < current.floors.length; x++){
    memo += `{M:[${current.floors[x].microchips.map(x => 'a').join(',')}]`
    memo += `G:[${current.floors[x].generators.map(x => 'a').join(',')}]}`;
  }
  return memo;
}

// Parse the input into the starting state object
const parseInput = (fileContents) => {
  // Regex for parsing each line
  let reg = new RegExp(/The (first|second|third|fourth) floor contains [ and]*([A-z]+-compatible microchip|[A-z]+ generator)*[, and]*([A-z]+-compatible microchip|[A-z]+ generator)*[, and]*([A-z]+-compatible microchip|[A-z]+ generator)*[, and]*([A-z]+-compatible microchip|[A-z]+ generator)*[, and]*([A-z]+-compatible microchip|[A-z]+ generator)*/);
  // The state of each floor
  let floors = [];

  for (let line of fileContents) {
    // All of the microchips and generator info for a floor
    let matches = line.match(reg);

    // The starting object for a floor
    let floor = {
      microchips: [],
      generators: []
    };

    // Parse each match allowing for up to 4 microchips or generators per floor. 
    // Check each and add it to the correct array for the floor 
    for (let x = 2; x <= 6; x++) {
      if (matches[x]) {
        let microchipIndex = matches[x].indexOf('-compatible microchip');
        let generatorIndex = matches[x].indexOf(' generator');
        if (microchipIndex >= 0)
          floor.microchips.push(matches[x].substring(0, microchipIndex));
        else if (generatorIndex >= 0)
          floor.generators.push(matches[x].substring(0, generatorIndex));
      }
    }

    // Add to the total set of floors
    floors.push(floor);
  }

  return floors;
}