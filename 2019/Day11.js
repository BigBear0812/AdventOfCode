// Puzzle for Day 11: https://adventofcode.com/2019/day/11

export const run = (fileContents) => {
  // Parse the program in from the input file
  let program = fileContents[0].split(",").map(x => parseInt(x));

  // Part 1
  // Count the number of unique spaces painted
  let robot1 = new Robot(program, 0);
  let spacesPainted = robot1.paint();

  // Part 2
  // Paint the design starting on a white space.
  // Print the output that has been painted.
  let robot2 = new Robot(program, 1);
  robot2.paint();
  let output = robot2.print();

  return {part1: spacesPainted.size, part2: output};
}

class Robot{
  constructor(program, startingColor){
    // Create an intcode computer as the brains for the robot
    this.comp = new IntCodeComputer(program);
    // Setup starting conditions
    this.x = 0;
    this.y = 0;
    this.dir = 'U';
    // Since all spaces default to black just keep track of the white spaces
    this.whiteSpaces = new Set();

    // Set the starting color to white if given that
    if(startingColor === 1){
      this.whiteSpaces.add(`${this.x},${this.y}`);
    }
  }

  // Print the current white spaces to a console string
  print(){
    // Console output
    let output = '\n';

    // Output should be 40x6
    for(let y = 0; y < 6; y++){
      // This line of the output
      let line = '';
      for(let x = 0; x < 40; x++){
        // White gets output as # while black is output as a blank space
        if(this.whiteSpaces.has(`${x},${y}`))
          line+='#';
        else
          line+=' ';
      }
      // Add a newline character at the end of each line and add it to the output
      line+='\n';
      output+=line;
    }

    return output;
  }

  // Paint the spaces until the program halts
  paint(){
    // Keep track of unique spaces painted
    let spacesPainted = new Set();

    // Continue until this breaks out when the program halts
    while(true){
      // The current string representation of this space
      let key = `${this.x},${this.y}`;
      let input = this.whiteSpaces.has(key) ? 1 : 0;
      let output = this.comp.runProgram([input]);

      // If this halts exit
      if(output.opCode === 99)
        break;

      // Update white spaces
      if(output.val[0] === 0 && this.whiteSpaces.has(key))
        this.whiteSpaces.delete(key);
      else if(output.val[0] === 1 && !this.whiteSpaces.has(key))
        this.whiteSpaces.add(key);

      // Update unique spaces painted
      if(!spacesPainted.has(key))
        spacesPainted.add(key);

      // Turn left
      if(output.val[1] === 0){
        switch(this.dir){
          case 'U':
            this.dir = 'L';
            break;
          case 'D':
            this.dir = 'R';
            break;
          case 'L':
            this.dir = 'D';
            break;
          case 'R':
            this.dir = 'U';
            break;
        }
      }
      // Turn right
      else if(output.val[1] === 1){
        switch(this.dir){
          case 'U':
            this.dir = 'R';
            break;
          case 'D':
            this.dir = 'L';
            break;
          case 'L':
            this.dir = 'U';
            break;
          case 'R':
            this.dir = 'D';
            break;
        }
      }

      // Move one space
      switch(this.dir){
        case 'U':
          this.y--;
          break;
        case 'D':
          this.y++;
          break;
        case 'L':
          this.x--;
          break;
        case 'R':
          this.x++;
          break;
      }

      
    }

    return spacesPainted;
  }
}

// Intcode Computer
class IntCodeComputer{
  constructor(program){
    // Program memory that is the max size an 
    // array can be all initialized to 0's
    this.program = new Array(8388607).fill(0);
    // Replace the computer program values with the 
    // given program values in the correct places
    for(let x = 0; x < program.length; x++){
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
  runProgram(input){
    // Output values
    let output = [];
    // If an input is specified add it to the input array
    if(input)
      this.input = this.input.concat(input);

    // Current opcode
    let opCode;
    // Continue until reaching the end of the program or the program breaks for opcode 99
    while(this.index >= 0){
      // Get program opcode and parameter modes for this command
      opCode = this.program[this.index];
      let param3Mode = Math.floor(opCode / 10000);
      opCode = opCode - (param3Mode * 10000);
      let param2Mode = Math.floor(opCode / 1000);
      opCode = opCode - (param2Mode * 1000);
      let param1Mode = Math.floor(opCode / 100);
      opCode = opCode - (param1Mode * 100);

      // For each command get the parameter values based on 
      // the parameter modes then run the command

      // Add
      if(opCode === 1){
        let param1 = this.program[this.index+1];
        let param2 = this.program[this.index+2];
        let param3 = this.program[this.index+3];

        if(param1Mode === 0)
          param1 = this.program[param1];
        else if(param1Mode === 2)
          param1 = this.program[param1 + this.relBase];
        if(param2Mode === 0)
          param2 = this.program[param2];
        else if(param2Mode === 2)
          param2 = this.program[param2 + this.relBase];

        if(param3Mode === 0)
          this.program[param3] = param1 + param2; 
        else if(param3Mode === 2)
          this.program[param3 + this.relBase] = param1 + param2; 

        this.index+=4;
      }
      // Mutiply
      else if(opCode === 2){
        let param1 = this.program[this.index+1];
        let param2 = this.program[this.index+2];
        let param3 = this.program[this.index+3];
        
        if(param1Mode === 0)
          param1 = this.program[param1];
        else if(param1Mode === 2)
          param1 = this.program[param1 + this.relBase];
        if(param2Mode === 0)
          param2 = this.program[param2];
        else if(param2Mode === 2)
          param2 = this.program[param2 + this.relBase];

        if(param3Mode === 0)
          this.program[param3] = param1 * param2; 
        else if(param3Mode === 2)
          this.program[param3 + this.relBase] = param1 * param2; 

        this.index+=4;
      }
      // Input
      else if(opCode === 3){
        let param1 = this.program[this.index+1];

        if(param1Mode === 0)
          this.program[param1] = this.input[this.inputIndex];
        else if(param1Mode === 2)
          this.program[param1 + this.relBase] = this.input[this.inputIndex];
        
        this.index+=2;
        this.inputIndex++;
      }
      // Output
      else if(opCode === 4){
        let param1 = this.program[this.index+1];

        if(param1Mode === 0)
          param1 = this.program[param1];
        else if(param1Mode === 2)
          param1 = this.program[param1 + this.relBase];

        output.push(param1);
        this.index+=2;
        if(output.length === 2)
          break;
      }
      // Jump if true
      else if(opCode === 5){
        let param1 = this.program[this.index+1];
        let param2 = this.program[this.index+2];
        
        if(param1Mode === 0)
          param1 = this.program[param1];
        else if(param1Mode === 2)
          param1 = this.program[param1 + this.relBase];
        if(param2Mode === 0)
          param2 = this.program[param2];
        else if(param2Mode === 2)
          param2 = this.program[param2 + this.relBase];

        if(param1 !== 0)
          this.index = param2;
        else
          this.index+=3;
      }
      // Jump if false
      else if(opCode === 6){
        let param1 = this.program[this.index+1];
        let param2 = this.program[this.index+2];
        
        if(param1Mode === 0)
          param1 = this.program[param1];
        else if(param1Mode === 2)
          param1 = this.program[param1 + this.relBase];
        if(param2Mode === 0)
          param2 = this.program[param2];
        else if(param2Mode === 2)
          param2 = this.program[param2 + this.relBase];

        if(param1 === 0)
          this.index = param2;
        else
          this.index+=3;
      }
      // Less than
      else if(opCode === 7){
        let param1 = this.program[this.index+1];
        let param2 = this.program[this.index+2];
        let param3 = this.program[this.index+3];
        
        if(param1Mode === 0)
          param1 = this.program[param1];
        else if(param1Mode === 2)
          param1 = this.program[param1 + this.relBase];
        if(param2Mode === 0)
          param2 = this.program[param2];
        else if(param2Mode === 2)
          param2 = this.program[param2 + this.relBase];

        if(param3Mode === 0)
          this.program[param3] = param1 < param2 ? 1 : 0;
        else if(param3Mode === 2)
          this.program[param3 + this.relBase] = param1 < param2 ? 1 : 0;
        
        this.index+=4;
      }
      // Equals
      else if(opCode === 8){
        let param1 = this.program[this.index+1];
        let param2 = this.program[this.index+2];
        let param3 = this.program[this.index+3];
        
        if(param1Mode === 0)
          param1 = this.program[param1];
        else if(param1Mode === 2)
          param1 = this.program[param1 + this.relBase];
        if(param2Mode === 0)
          param2 = this.program[param2];
        else if(param2Mode === 2)
          param2 = this.program[param2 + this.relBase];

        if(param3Mode === 0)
          this.program[param3] = param1 === param2 ? 1 : 0;
        else if(param3Mode === 2)
          this.program[param3 + this.relBase] = param1 === param2 ? 1 : 0;
        this.index+=4;
      }
      // Adjust relative base
      else if(opCode === 9){
        let param1 = this.program[this.index+1];

        if(param1Mode === 0)
          param1 = this.program[param1];
        else if(param1Mode === 2)
          param1 = this.program[param1 + this.relBase];

        this.relBase += param1;
        this.index+=2;
      }
      // Exit
      else if(opCode === 99){
        this.index+=1;
        break;
      }
    }

    return {val: output, opCode};
  }
}