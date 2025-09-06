// Puzzle for Day 15: https://adventofcode.com/2019/day/15

export const run = (fileContents) => {
  // Parse the program in from the input file
  let program = fileContents[0].split(",").map((x) => parseInt(x));

  // Get the location and moves to reach the O2 system
  // along with a map of the entire space
  let result = findO2SystemAndMap(program);

  // Get the amount of time until the entire space is filled with O2
  let result2 = fillWithO2(result.grid, result.o2Location);

  return { part1: result.o2Moves.length, part2: result2 };
};

// Find how many turns it takes to fill the area with O2
// using Breadth First Search (BFS)
const fillWithO2 = (grid, o2Location) => {
  // States to consider next
  let states = [];
  // Start with the O2 syustem location as move 0
  states.push({ x: o2Location.x, y: o2Location.y, mins: 0 });

  // Number of mins it takes to fill the entire spoace with O2
  let filledTime = 0;

  // Continue while there are still more states to consider
  while (states.length > 0) {
    // Get the current states from the front of the states array
    let current = states.shift();

    // Set the current location to O showing it has been filled with oxygen
    grid.set(`${current.x},${current.y}`, "O");

    // if therer are no more states to conider and this is number
    // of mins is larger then alreayd foudn the set the result to
    // the current number of mins
    if (states.length === 0 && current.mins > filledTime) {
      filledTime = current.mins;
    }

    // Possible next moves
    let posMoves = [];
    posMoves.push({ x: current.x, y: current.y - 1 }); // Up / North
    posMoves.push({ x: current.x + 1, y: current.y }); // Right / East
    posMoves.push({ x: current.x, y: current.y + 1 }); // Down / South
    posMoves.push({ x: current.x - 1, y: current.y }); // Left / West

    // Consider each next move
    for (let p = 0; p < posMoves.length; p++) {
      // Get the possible move info
      let posMove = posMoves[p];
      let moveKey = `${posMove.x},${posMove.y}`;
      let moveSymbol = grid.get(moveKey);
      // If the move symbol is clear then it needs to be filled
      // with O2 so add it to the end of the states array with
      // mins + 1
      if (moveSymbol === ".")
        states.push({ x: posMove.x, y: posMove.y, mins: current.mins + 1 });
    }
  }

  return filledTime;
};

// Find the Oxygen system and make a full map of the area.
// This uses a depth first tree traversal alogrithm to find
// the O2 systema dn map out the entire space
const findO2SystemAndMap = (program) => {
  // Create an intcode computer
  let comp = new IntCodeComputer(program);
  // Current location
  let current = { x: 0, y: 0 };
  // Map of spaces by location
  let grid = new Map();
  // Set the value for the start location
  grid.set(`${current.x},${current.y}`, ".");
  // Move that have been made to be able to backtrack
  let moves = [];

  // Moves to get to the O2 system
  let o2Moves;
  // Grid location of the O2 system
  let o2Location;

  // Flag if the map has been completelyu navigated
  let mapComplete = false;
  // Response from the last program run move
  let response = null;

  // Continue searching until the map is complete
  while (!mapComplete) {
    // If the O2 system has been found save the moves
    // to get here along with the current location
    if (response === 2) {
      o2Moves = JSON.parse(JSON.stringify(moves));
      o2Location = JSON.parse(JSON.stringify(current));
    }

    // Possible next moves to consider
    let posMoves = [];
    posMoves.push({ x: current.x, y: current.y - 1, move: 1 }); // Up / North
    posMoves.push({ x: current.x + 1, y: current.y, move: 4 }); // Right / East
    posMoves.push({ x: current.x, y: current.y + 1, move: 2 }); // Down / South
    posMoves.push({ x: current.x - 1, y: current.y, move: 3 }); // Left / West

    // Attempt to make a move to the first possible
    // moves in order of the moves created
    let moveMade = null;
    for (let p = 0; p < posMoves.length && moveMade === null; p++) {
      // Get the possible move
      let posMove = posMoves[p];
      let moveKey = `${posMove.x},${posMove.y}`;
      // If this has already been searched then
      // continue to the next possible move
      if (grid.has(moveKey)) {
        // If back at the start and the left /
        // west move (which is the last one) has
        // been added to the grid then the map
        // is complete
        if (current.x === 0 && current.y === 0 && posMove.move === 3)
          mapComplete = true;
        continue;
      }

      // If this has not been added then make
      // the move and get the result
      let output = comp.runProgram([posMove.move]);
      response = output.val[0];
      // If the response is not a wall then the robot moved
      // forward into this direction. This means this is the
      // move made this round and to update the grid with a
      // space. Otherwise no move was made and record a wall.
      if (response !== 0) {
        moveMade = posMove;
        grid.set(moveKey, ".");
      } else {
        grid.set(moveKey, "#");
      }
    }

    // If no move to make then back track one move
    if (moveMade === null) {
      // Only backtrack while there are still move to backtrack too
      if (moves.length !== 0) {
        // Pop the last move off the moves array
        let lastMove = moves.pop();

        // Make the opposite move of the last move to backtrack
        let output;
        switch (lastMove) {
          case 1:
            current = { x: current.x, y: current.y + 1 };
            output = comp.runProgram([2]);
            break;
          case 4:
            current = { x: current.x - 1, y: current.y };
            output = comp.runProgram([3]);
            break;
          case 2:
            current = { x: current.x, y: current.y - 1 };
            output = comp.runProgram([1]);
            break;
          case 3:
            current = { x: current.x + 1, y: current.y };
            output = comp.runProgram([4]);
            break;
        }
        // Set the response to the result of this backtracking move
        response = output.val[0];
      }
    }
    // Otherwise update the moves and current position
    else {
      moves.push(moveMade.move);
      current = { x: moveMade.x, y: moveMade.y };
    }
  }

  // Return the info needed to find part 2
  // along with the result for part 1
  return { o2Location, o2Moves, grid };
};

// Intcode Computer
class IntCodeComputer {
  constructor(program) {
    // Program memory that is the max size an
    // array can be all initialized to 0's
    this.program = new Array(8388607).fill(0);
    // Replace the computer program values with the
    // given program values in the correct places
    for (let x = 0; x < program.length; x++) {
      this.program[x] = program[x];
    }
    // Current program index
    this.index = 0;
    // Inputs array
    this.input = [];
    // Index of the input array
    this.inputIndex = 0;
    // Relative Base
    this.relBase = 0;
  }

  // Run the program until it completes
  // intcode program, intput array, index of the input array, index of the program
  runProgram(input) {
    // Output values
    let output = [];
    // If an input is specified add it to the input array
    if (input) this.input = this.input.concat(input);

    // Current opcode
    let opCode;
    // Continue until reaching the end of the program or the program breaks for opcode 99
    while (this.index >= 0) {
      // Get program opcode and parameter modes for this command
      opCode = this.program[this.index];
      let param3Mode = Math.floor(opCode / 10000);
      opCode = opCode - param3Mode * 10000;
      let param2Mode = Math.floor(opCode / 1000);
      opCode = opCode - param2Mode * 1000;
      let param1Mode = Math.floor(opCode / 100);
      opCode = opCode - param1Mode * 100;

      // For each command get the parameter values based on
      // the parameter modes then run the command

      // Add
      if (opCode === 1) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];
        let param3 = this.program[this.index + 3];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param3Mode === 0) this.program[param3] = param1 + param2;
        else if (param3Mode === 2)
          this.program[param3 + this.relBase] = param1 + param2;

        this.index += 4;
      }
      // Mutiply
      else if (opCode === 2) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];
        let param3 = this.program[this.index + 3];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param3Mode === 0) this.program[param3] = param1 * param2;
        else if (param3Mode === 2)
          this.program[param3 + this.relBase] = param1 * param2;

        this.index += 4;
      }
      // Input
      else if (opCode === 3) {
        let param1 = this.program[this.index + 1];

        if (param1Mode === 0)
          this.program[param1] = this.input[this.inputIndex];
        else if (param1Mode === 2)
          this.program[param1 + this.relBase] = this.input[this.inputIndex];

        this.index += 2;
        this.inputIndex++;
      }
      // Output
      else if (opCode === 4) {
        let param1 = this.program[this.index + 1];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];

        output.push(param1);
        this.index += 2;
        break;
      }
      // Jump if true
      else if (opCode === 5) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param1 !== 0) this.index = param2;
        else this.index += 3;
      }
      // Jump if false
      else if (opCode === 6) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param1 === 0) this.index = param2;
        else this.index += 3;
      }
      // Less than
      else if (opCode === 7) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];
        let param3 = this.program[this.index + 3];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param3Mode === 0) this.program[param3] = param1 < param2 ? 1 : 0;
        else if (param3Mode === 2)
          this.program[param3 + this.relBase] = param1 < param2 ? 1 : 0;

        this.index += 4;
      }
      // Equals
      else if (opCode === 8) {
        let param1 = this.program[this.index + 1];
        let param2 = this.program[this.index + 2];
        let param3 = this.program[this.index + 3];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];
        if (param2Mode === 0) param2 = this.program[param2];
        else if (param2Mode === 2) param2 = this.program[param2 + this.relBase];

        if (param3Mode === 0) this.program[param3] = param1 === param2 ? 1 : 0;
        else if (param3Mode === 2)
          this.program[param3 + this.relBase] = param1 === param2 ? 1 : 0;
        this.index += 4;
      }
      // Adjust relative base
      else if (opCode === 9) {
        let param1 = this.program[this.index + 1];

        if (param1Mode === 0) param1 = this.program[param1];
        else if (param1Mode === 2) param1 = this.program[param1 + this.relBase];

        this.relBase += param1;
        this.index += 2;
      }
      // Exit
      else if (opCode === 99) {
        this.index += 1;
        break;
      }
    }

    return { val: output, opCode };
  }
}
