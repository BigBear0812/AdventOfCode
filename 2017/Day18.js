// Puzzle for Day 18: https://adventofcode.com/2017/day/18

export const run = (fileContents) => {
  // Parse in the data set for each of the parts of the puzzle to have their own clean copy
  let data1 = parseInput(fileContents);
  let data20 = parseInput(fileContents);
  let data21 = parseInput(fileContents);
  // Set the register values for p as descirbed in part 2
  data20.registers.set("p", 0);
  data21.registers.set("p", 1);

  // Process each part of the puzzle and return the results
  singleProcess(data1);
  doubleProcess(data20, data21);

  // Return the requested info for each part of this command
  return {
    part1: data1.sendBuffer[data1.sendBuffer.length - 1],
    part2: data21.sentCount,
  };
};

// Process 2 programs passing data between them
const doubleProcess = (data0, data1) => {
  // Process the programs starting with program 0 and alternating
  // when their recieve buffers empty. If both buffers are empty
  // then this is a deadlock and the programs have stopped. Also,
  // check that the programs can continue to execute. Since a
  // switch always happens either on an out of bounds or an empty
  // send buffer check that the program executing has everything
  // it needs to continue from it's last stopped recieve command.
  for (
    let x = 0;
    x === 0 ||
    (data1.sendBuffer.length > 0 &&
      data0.index >= 0 &&
      data0.index < data0.commands.length) ||
    (data0.sendBuffer.length > 0 &&
      data1.index >= 0 &&
      data1.index < data1.commands.length);
    x++
  ) {
    if (x % 2 === 0) {
      processCommands(data0, data1.sendBuffer);
    } else {
      processCommands(data1, data0.sendBuffer);
    }
  }
};

// Process a single program and record the outputs
const singleProcess = (data) => {
  // Process the program with no recieveing buffer
  processCommands(data, []);
};

// Process the commands of a program based on its data and the values
// it recieved from the other program
const processCommands = (data, recieveBuffer) => {
  while (data.index >= 0 && data.index < data.commands.length) {
    let current = data.commands[data.index];
    // Send command
    if (current.command === "snd") {
      let val1 = Number.isInteger(current.val1)
        ? current.val1
        : data.registers.get(current.val1);
      data.sendBuffer.push(val1);
      data.sentCount++;
      data.index++;
    }
    // Set command
    else if (current.command === "set") {
      let val2 = Number.isInteger(current.val2)
        ? current.val2
        : data.registers.get(current.val2);
      data.registers.set(current.val1, val2);
      data.index++;
    }
    // Add command
    else if (current.command === "add") {
      let val1 = data.registers.get(current.val1);
      let val2 = Number.isInteger(current.val2)
        ? current.val2
        : data.registers.get(current.val2);
      data.registers.set(current.val1, val1 + val2);
      data.index++;
    }
    // Multiply command
    else if (current.command === "mul") {
      let val1 = data.registers.get(current.val1);
      let val2 = Number.isInteger(current.val2)
        ? current.val2
        : data.registers.get(current.val2);
      data.registers.set(current.val1, val1 * val2);
      data.index++;
    }
    // Modulus command
    else if (current.command === "mod") {
      let val1 = data.registers.get(current.val1);
      let val2 = Number.isInteger(current.val2)
        ? current.val2
        : data.registers.get(current.val2);
      data.registers.set(current.val1, val1 % val2);
      data.index++;
    }
    // Recieve command
    else if (current.command === "rcv") {
      if (recieveBuffer.length > 0) {
        let val = recieveBuffer.shift();
        data.registers.set(current.val1, val);
      } else {
        break;
      }
      data.index++;
    }
    // Jump Greater than Zero command
    else if (current.command === "jgz") {
      let val1 = Number.isInteger(current.val1)
        ? current.val1
        : data.registers.get(current.val1);
      let val2 = Number.isInteger(current.val2)
        ? current.val2
        : data.registers.get(current.val2);
      if (val1 > 0) {
        data.index += val2;
      } else {
        data.index++;
      }
    }
  }
};

// Parse the input file and create basic data objects for each program
const parseInput = (fileContents) => {
  // Regex for getting relevant info from each line
  let reg = new RegExp(/([a-z]+) ([-a-z\d]+) *([-a-z\d]+)*/);
  // The resulting program commands
  let commands = [];
  // The map of registers all initialized to 0
  let registers = new Map();

  // Parse the file one line at a time
  for (let line of fileContents) {
    // Find all matches
    let matches = line.match(reg);
    let val1;
    let val2;
    // Check if the first value after the command is an
    // int or a letter and save it appropriately
    if (matches[2]) {
      val1 = parseInt(matches[2]);
      if (isNaN(val1)) {
        val1 = matches[2];
        if (!registers.has(val1)) {
          registers.set(val1, 0);
        }
      }
    }
    // Check if the second value after the command is an
    // int or a letter and save it appropriately
    if (matches[3]) {
      val2 = parseInt(matches[3]);
      if (isNaN(val2)) {
        val2 = matches[3];
        if (!registers.has(val2)) {
          registers.set(val2, 0);
        }
      }
    }

    // Add this command to the output list
    commands.push({
      command: matches[1],
      val1,
      val2,
    });
  }

  // Return a new data object for this command with the
  // relevant info about the execution of this program
  return {
    commands,
    registers,
    index: 0,
    sentCount: 0,
    sendBuffer: [],
  };
};
