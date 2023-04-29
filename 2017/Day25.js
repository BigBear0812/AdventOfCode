// Puzzle for Day 25: https://adventofcode.com/2017/day/25

export const run = (fileContents) => {
  // Parse the input data into a set of objects
  let data = parseInput(fileContents);

  // Run the turing machine and get the number of ones generated at the last step
  let diagnostic = runTuringMachine(data);

  return {part1: diagnostic};
}

// Run thre turing mahcine simulation suing the input data
const runTuringMachine = (data) => {
  // Keep track of which positions have ones
  let ones = new Set();
  // Current position
  let pos = 0; 
  // Current state 
  let state = data.start;

  // Run until the number of steps has been reached
  for(let x = 0; x < data.steps; x++){
    // Get the instructions for the current state
    let current = data.states.get(state);
    // If the current position is a 1
    if(ones.has(pos)){
      // If it says to write 0 then remove this position form the ones set
      if(current[1].write === 0)
        ones.delete(pos);
      // Move the position left or right 
      if(current[1].move === "right")
        pos++;
      else if(current[1].move === "left")
        pos--;
      // Set the next state
      state = current[1].continue;
    }
    // Else the current position is a 0
    else{
      // If it says to write 1 then add this position to the ones set
      if(current[0].write === 1)
        ones.add(pos)
      // Move the position left or right 
      if(current[0].move === "right")
        pos++;
      else if(current[0].move === "left")
        pos--;
      // Set the next state
      state = current[0].continue;
    }
  }

  return ones.size;
}

// Parse the input into a set of objects for the instructions
const parseInput = (fileContents) => {
  // Regex for parsing various lines of the input file
  let regStart = new RegExp(/Begin in state ([A-Z])./);
  let regSteps = new RegExp(/Perform a diagnostic checksum after (\d+) steps./);
  let regState = new RegExp(/In state ([A-Z]):/);
  let regWrite = new RegExp(/    - Write the value (\d)./);
  let regMove = new RegExp(/    - Move one slot to the (right|left)./);
  let regContinue = new RegExp(/    - Continue with state ([A-Z])./);

  // Get the starting state and the number of steps
  let start = fileContents[0].match(regStart)[1];
  let steps = parseInt(fileContents[1].match(regSteps)[1]);
  // Create a map for the state instructions info
  let states = new Map();

  // Sets of instructions should be 10 lines long and start on line 3. 
  // Continue adding to x until each state has been added and the end 
  // of the file is reached
  for(let x = 0; ((x * 10) + 3) < fileContents.length; x++){
    // The starting line number for this instruction set
    let lineNum = (x * 10) + 3;

    // Get all pieces of the instruction info from each of the appropriate lines using regex
    let state = fileContents[lineNum].match(regState)[1];
    let write1 = parseInt(fileContents[lineNum+2].match(regWrite)[1]);
    let move1 = fileContents[lineNum+3].match(regMove)[1];
    let continue1 = fileContents[lineNum+4].match(regContinue)[1];
    let write2 = parseInt(fileContents[lineNum+6].match(regWrite)[1]);
    let move2 = fileContents[lineNum+7].match(regMove)[1];
    let continue2 = fileContents[lineNum+8].match(regContinue)[1];

    // Add the instruction info to the set of states instructions
    states.set(state, {
      0: {
        write: write1,
        move: move1,
        continue: continue1
      },
      1: {
        write: write2,
        move: move2,
        continue: continue2
      }
    });
  }

  return {start, steps, states};
}