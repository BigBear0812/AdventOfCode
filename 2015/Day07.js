import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 7: https://adventofcode.com/2015/day/7

// TODO: Some command have numbers instead of wire inputs
const assignmentRegex = new RegExp(/^([a-z]+|\d+) -> (.+)$/);
const comboRegex = new RegExp(/^([a-z]+|\d+) ([RSHIFTLANDO]+) ([a-z]+|\d+) -> (.+)$/);
const notRegex = new RegExp(/^([NOT]+) ([a-z]+) -> (.+)$/);

let wires = {};

export const run = (fileContents) => { 

  // Parse in all of the command lines in the instructions
  // and get then ready to be evaluated
  for(let x = 0; x < fileContents.length; x++){
    const line = fileContents[x];
    const resultCombo = line.match(comboRegex);
    const resultNot = line.match(notRegex);

    // LSHIFT, RSHIFT, AND, OR
    if(resultCombo){
      let result1;
      let result3;
      if(isNaN(resultCombo[1]))
        result1 = resultCombo[1];
      else
        result1 = parseInt(resultCombo[1]);
      if(isNaN(resultCombo[3]))
        result3 = resultCombo[3];
      else
        result3 = parseInt(resultCombo[3]);

      let result2 = ""
      switch(resultCombo[2]){
        case "AND":
          result2 = " & ";
          break;
        case "OR":
          result2 = " | ";
          break;
        case "LSHIFT":
          result2 = " << ";
          break;
        case "RSHIFT":
          result2 = " >> ";
          break;
      }

      wires[resultCombo[4]] = {
        inputs: [result1, result3],
        ogInputs: [result1, result3],
        command: result2
      }
    }
    // NOT
    if(resultNot){
      let result2;
      if(isNaN(resultNot[2]))
        result2 = resultNot[2];
      else
        result2 = parseInt(resultNot[2]);

      wires[resultNot[3]] = {
        inputs: [result2],
        ogInputs: [result2],
        command: "~ "
      }
    }
  }

  // Add assignment wires and evaluate the inputs if they 
  // do not already have a specific signal value.
  for(let x = 0; x < fileContents.length ; x++){
    const line = fileContents[x];
    const result = line.match(assignmentRegex);
    if(result){
      let result1;
      if(isNaN(result[1])) 
        result1 = getValue(result[1]);
      else
        result1 = parseInt(result[1]);
      wires[result[2]] = {
        command: result[1],
        value: result1
      } 
    }
  }
  // Log Output
  console.log('Part 1:', wires["a"].value);

  // Copy wire a's value to the value of wire b
  wires["b"].value = wires["a"].value

  // Reset the computed inputs for each wire
  for (const wire in wires) {
    // Check if this is the case of a wire with a value is found.
    if(wires[wire].command !== "~ " 
    && wires[wire].command !== " << " 
    && wires[wire].command !== " >> " 
    && wires[wire].command !== " & " 
    && wires[wire].command !== " | "){
      continue;
    }
    else{
      wires[wire].inputs = wires[wire].ogInputs.slice();
    }
  }

  // Recompute wire a's signal value
  wires["a"].value = getValue(wires["a"].command);
  
  // Log Output
  console.log('Part 2:', wires["a"].value);

}

const getValue = (output) => {
  const wire = wires[output];
  // Check if the base case of a wire with a value is found.
  if(wire.command !== "~ " 
  && wire.command !== " << " 
  && wire.command !== " >> " 
  && wire.command !== " & " 
  && wire.command !== " | ")
    return wire.value;

  // If not then see if all inputs have signal values computed. 
  // If not then get those values as well.
  for(let x = 0; x < wire.inputs.length; x++){
    if(!isNaN(wire.inputs[x]))
      continue;
    else
      wire.inputs[x] = getValue(wire.inputs[x]);
  }

  // Once the inputs are computed evaluate this wire and return the result 
  if(wire.command === "~ ")
    return checkRange(eval(wire.command + wire.inputs[0]))
  else
    return checkRange(eval(wire.inputs[0] + wire.command + wire.inputs[1]));
}

// Corrects for invalid values to keep everything in the correct range
const checkRange = (i) => {
  const n = 65536;
  return ((i%n)+n)%n;
}
