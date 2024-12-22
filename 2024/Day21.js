// Puzzle for Day 21: https://adventofcode.com/2024/day/21

export const run = (fileContents) => {
  let result1 = solver(fileContents,2);
  let result2 = solver(fileContents, 25);
  return {part1: result1, part2: result2};
}

/**
 * Solve either part of the puzzle
 * @param {string[]} commands An array of the number pad commands to run
 * @param {number} numRobots The length of the robot chain
 * @returns {number} The complexity sum
 */
const solver = (commands, numRobots) => {
  // The sum of all complexities
  let total = 0;
  // Process each command separately
  for(let command of commands){
    // Get the numeric part of the command
    let commandNum = parseInt(command.split('A')[0]);
    // Process the number command into the set of possible arrow commands
    let arrowsCommands = processNumberCommand(command);
    // Track the shortest length to complete each one 
    let shortLength = Infinity;
    // Process each possible option
    for(let arrowCommand of arrowsCommands){
      // Find the shortest length of the sequence
      let temp = findShortestSequence(arrowCommand, numRobots);
      // Save this if less that a previously found shortest value
      if(temp < shortLength)
        shortLength = temp
    }
    // Calculate complexity and add it to the total
    total += shortLength * commandNum;
  }
  return total;
}

/**
 * Find the shortest sequence of key presses to achieve the desired sequence 
 * using Depth First Search(DFS) style recursion.
 * @param {string} command Command to find the shortest sequence of actions to produce it
 * @param {number} numRobots The number of th robots in the chain
 * @param {number} [keypad=0] The keypad number currently at defaulting to 0
 * @returns {number} The length of the shortest sequence of button presses
 */
const findShortestSequence = memoize((command, numRobots, keypad = 0) =>{
  // If this keypad is at the number of robots then return the length of the current command value
  if(keypad === numRobots){
    return command.length;
  }

  // Get the next available arrow command
  let nextCommand = processArrowCommand(command);
  // Split the command into each original characters sequence
  let commandSplits = nextCommand.split('A')
    .filter((command, index, array) => index != array.length-1)
    .map(c => c + 'A');
  // Find the shortest for each character's sequence and total them
  let shortest = 0;
  for(let splitCommand of commandSplits){
    shortest += findShortestSequence(splitCommand, numRobots, keypad+1); 
  }

  return shortest;
})

/**
 * Get the sequence of actions to produce the given command for an arrow pad
 * @param {string} command The command to get the sequence for
 * @returns {string} The actions sequence required to produce the command
 */
const processArrowCommand = (command) => {
  // Always start at A
  let current = 'A';
  // Store the output
  let output = '';
  // Produce the result for each button in the command one at a time
  for(let button of command){
    // Get the action sequence for this command, add it to the output, 
    // and set the current button to the one just processed.
    // Only take the first action returned since if there are more 
    // than one action sequence for a button change they are equivalent.
    let actions = arrowMovements.get(current).find((move) => move.button === button).actions[0];
    output += actions;
    current = button; 
  }
  return output;  
};

/**
 * Get the sequence of actions to produce the given command for a number pad
 * @param {string} command The command to get the sequence for
 * @returns {string} The actions sequence required to produce the command
 */
const processNumberCommand = (command) => {
  // Always start at A 
  let current = 'A';
  // Store the outputs of al possible sequences
  let outputs = [''];
  // Produce the result for each button in the command one at a time
  for(let button of command){
    // Get the possible action sequences for this command
    let actions = numericMovements.get(current).find((move) => move.button === button).actions;
    // Store new outputs
    let newOutputs = [];
    // Append each possible action sequence to each already found output and store them into new outputs
    for(let output of outputs){
      for(let action of actions){
        newOutputs.push(output + action);
      }
    }
    // Assign new outputs to outputs and set the current button to the one that was just processed
    outputs = newOutputs;
    current = button; 
  }
  return outputs;  
}


/**
 * Memoizes the input of the function and caches the results in a hash map. 
 * Must be written like this to make it's scope global to the module
 * @param {*} func The function to cache the result of
 * @returns The result of the inputs
 */
function memoize(func) {
  // Create a cache. Using a hash map is exponentially faster than a plain object
  const cache = new Map();
  
  return function(...args) {
    // Get the JSON string of the args
    const key = JSON.stringify(args);
    
    // Check if this value has been cached and return it if found
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Otherwise run function and get the result to cache
    const result = func.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * A map of the best possible moves from any button to any other button on a number pad.
 * This map uses only action sequences that require only one change in direction at most 
 * since that is always most efficient.
 */
const numericMovements = new Map([
  ['A', [
    {button: 'A', actions: ['A']},
    {button: '0', actions: ['<A']},
    {button: '1', actions: ['^<<A']},
    {button: '2', actions: ['<^A', '^<A']},
    {button: '3', actions: ['^A']},
    {button: '4', actions: ['^^<<A']},
    {button: '5', actions: ['<^^A', '^^<A']},
    {button: '6', actions: ['^^A']},
    {button: '7', actions: ['^^^<<A']},
    {button: '8', actions: ['<^^^A', '^^^<A']},
    {button: '9', actions: ['^^^A']},
  ]],
  ['0', [
    {button: 'A', actions: ['>A']},
    {button: '0', actions: ['A']},
    {button: '1', actions: ['^<A']},
    {button: '2', actions: ['^A']},
    {button: '3', actions: ['^>A', '>^A']},
    {button: '4', actions: ['^^<A', '^<^A']},
    {button: '5', actions: ['^^A']},
    {button: '6', actions: ['^^>A', '>^^A']},
    {button: '7', actions: ['^^^<A']},
    {button: '8', actions: ['^^^A']},
    {button: '9', actions: ['^^^>A', '>^^^A']},
  ]],
  ['1', [
    {button: 'A', actions: ['>>vA']},
    {button: '0', actions: ['>vA']},
    {button: '1', actions: ['A']},
    {button: '2', actions: ['>A']},
    {button: '3', actions: ['>>A']},
    {button: '4', actions: ['^A']},
    {button: '5', actions: ['^>A', '>^A']},
    {button: '6', actions: ['^>>A', '>>^A']},
    {button: '7', actions: ['^^A']},
    {button: '8', actions: ['^^>A', '>^^A']},
    {button: '9', actions: ['^^>>A', '>>^^A']},
  ]],
  ['2', [
    {button: 'A', actions: ['>vA', 'v>A']},
    {button: '0', actions: ['vA']},
    {button: '1', actions: ['<A']},
    {button: '2', actions: ['A']},
    {button: '3', actions: ['>A']},
    {button: '4', actions: ['^<A', '<^A']},
    {button: '5', actions: ['^A']},
    {button: '6', actions: ['^>A', '>^A']},
    {button: '7', actions: ['^^<A', '<^^A']},
    {button: '8', actions: ['^^A']},
    {button: '9', actions: ['^^>A', '>^^A']},
  ]],
  ['3', [
    {button: 'A', actions: ['vA']},
    {button: '0', actions: ['v<A', '<vA']},
    {button: '1', actions: ['<<A']},
    {button: '2', actions: ['<A']},
    {button: '3', actions: ['A']},
    {button: '4', actions: ['^<<A', '<<^A']},
    {button: '5', actions: ['^<A', '<^A']},
    {button: '6', actions: ['^A']},
    {button: '7', actions: ['<<^^A', '^^<<A']},
    {button: '8', actions: ['^^<A', '<^^A']},
    {button: '9', actions: ['^^A']},
  ]],
  ['4', [
    {button: 'A', actions: ['>>vvA']},
    {button: '0', actions: ['>vvA']},
    {button: '1', actions: ['vA']},
    {button: '2', actions: ['v>A', '>vA']},
    {button: '3', actions: ['v>>A', '>>vA']},
    {button: '4', actions: ['A']},
    {button: '5', actions: ['>A']},
    {button: '6', actions: ['>>A']},
    {button: '7', actions: ['^A']},
    {button: '8', actions: ['^>A', '>^A']},
    {button: '9', actions: ['>>^A', '^>>A']},
  ]],
  ['5', [
    {button: 'A', actions: ['>vvA', 'vv>A']},
    {button: '0', actions: ['vvA']},
    {button: '1', actions: ['v<A', '<vA']},
    {button: '2', actions: ['vA']},
    {button: '3', actions: ['v>A', '>vA']},
    {button: '4', actions: ['<A']},
    {button: '5', actions: ['A']},
    {button: '6', actions: ['>A']},
    {button: '7', actions: ['^<A', '<^A']},
    {button: '8', actions: ['^A']},
    {button: '9', actions: ['>^A', '^>A']},
  ]],
  ['6',[
    {button: 'A', actions: ['vvA']},
    {button: '0', actions: ['vv<A', '<vvA']},
    {button: '1', actions: ['v<<A', '<<vA']},
    {button: '2', actions: ['v<A', '<vA']},
    {button: '3', actions: ['vA']},
    {button: '4', actions: ['<<A']},
    {button: '5', actions: ['<A']},
    {button: '6', actions: ['A']},
    {button: '7', actions: ['^<<A', '<<^A']},
    {button: '8', actions: ['^<A', '<^A']},
    {button: '9', actions: ['^A']},
  ]],
  ['7', [
    {button: 'A', actions: ['>>vvvA']},
    {button: '0', actions: ['>vvvA']},
    {button: '1', actions: ['vvA']},
    {button: '2', actions: ['vv>A', '>vvA']},
    {button: '3', actions: ['vv>>A', '>>vvA']},
    {button: '4', actions: ['vA']},
    {button: '5', actions: ['v>A', '>vA']},
    {button: '6', actions: ['v>>A', '>>vA']},
    {button: '7', actions: ['A']},
    {button: '8', actions: ['>A']},
    {button: '9', actions: ['>>A']},
  ]],
  ['8', [
    {button: 'A', actions: ['>vvvA', 'vvv>A']},
    {button: '0', actions: ['vvvA']},
    {button: '1', actions: ['vv<A', '<vvA']},
    {button: '2', actions: ['vvA']},
    {button: '3', actions: ['vv>A', '>vvA']},
    {button: '4', actions: ['v<A', '<vA']},
    {button: '5', actions: ['vA']},
    {button: '6', actions: ['v>A', '>vA']},
    {button: '7', actions: ['<A']},
    {button: '8', actions: ['A']},
    {button: '9', actions: ['>A']},
  ]],
  ['9', [
    {button: 'A', actions: ['vvvA']},
    {button: '0', actions: ['vvv<A', '<vvvA']},
    {button: '1', actions: ['vv<<A', '<<vvA']},
    {button: '2', actions: ['vv<A', '<vvA']},
    {button: '3', actions: ['vvA']},
    {button: '4', actions: ['v<<A', '<<vA']},
    {button: '5', actions: ['v<A', '<vA']},
    {button: '6', actions: ['vA']},
    {button: '7', actions: ['<<A']},
    {button: '8', actions: ['<A']},
    {button: '9', actions: ['A']},
  ]],
]);

/**
 * A map of the best possible moves from any button to any other button on an arrow pad.
 * This map uses only action sequences that require only one change in direction at most 
 * since that is always most efficient.
 */
let arrowMovements = new Map([
  ['A', [
    {button: 'A', actions: ['A']},
    {button: '^', actions: ['<A']},
    {button: 'v', actions: ['<vA', 'v<A']},
    {button: '<', actions: ['v<<A', '<v<A']},
    {button: '>', actions: ['vA']},
  ]],
  ['^', [
    {button: 'A', actions: ['>A']},
    {button: '^', actions: ['A']},
    {button: 'v', actions: ['vA']},
    {button: '<', actions: ['v<A']},
    {button: '>', actions: ['v>A', '>vA']},
  ]],
  ['v', [
    {button: 'A', actions: ['^>A', '>^A']},
    {button: '^', actions: ['^A']},
    {button: 'v', actions: ['A']},
    {button: '<', actions: ['<A']},
    {button: '>', actions: ['>A']},
  ]],
  ['<', [
    {button: 'A', actions: ['>>^A', '>^>A']},
    {button: '^', actions: ['>^A']},
    {button: 'v', actions: ['>A']},
    {button: '<', actions: ['A']},
    {button: '>', actions: ['>>A']},
  ]],
  ['>', [
    {button: 'A', actions: ['^A']},
    {button: '^', actions: ['<^A', '^<A']},
    {button: 'v', actions: ['<A']},
    {button: '<', actions: ['<<A']},
    {button: '>', actions: ['A']},
  ]],
]);