// Puzzle for Day 24: https://adventofcode.com/2024/day/24

export const run = (fileContents) => {
  let data = parseInput(fileContents);
  let result1 = part1(data.wires, data.gates);
  let result2 = part2(data);
  return { part1: result1, part2: result2 };
};

/**
 * Part 2 Solution. Uses a set of rules to identify bad wires
 * Got a lot of help from https://www.reddit.com/r/adventofcode/comments/1hl698z/comment/m3kb5ix/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
 * @param {{
 *   wires: Map<string, number>,
 *   gates: {
 *     inputs: string[],
 *     operation: string,
 *     output: string
 *   }[],
 *   highestZ: number,
 *   highestX: number,
 *   highestY: number,
 * }} data The data parsed from the input
 * @returns {string} The bad wires output in the correct format
 */
const part2 = (data) => {
  // Clone the input data
  let wires = structuredClone(data.wires);
  let gates = structuredClone(data.gates);
  // Assign each wire it's type which is input.
  wires.forEach((wire, key) =>
    wires.set(key, { wire: key, type: "INPUT", num: parseInt(key.slice(1)) }),
  );
  // Track the XY add wires and the XY carry wires.
  // These will be used for debugging what is going wrong in other places
  let XYAddWires = [];
  let XYCarryWires = [];
  // Check each gate that takes inputs directly from XY values
  for (let i = 0; i < data.highestX; i++) {
    // Get the gates that include this x index value
    let numPad = pad(i, 2);
    let xWire = "x" + numPad;
    let foundGates = gates.filter((gate) => gate.inputs.includes(xWire));
    for (let gate of foundGates) {
      // XYAdd
      // If the gate takes input and use an XOR operation it is an XY add
      if (gate.operation === "XOR") {
        wires.set(gate.output, { wire: gate.output, type: "XYAdd", num: i });
        XYAddWires.push(gate.output);
      }
      // XYCarry
      // If the gate takes input and use an AND operation it is an XY carry
      else if (gate.operation === "AND") {
        wires.set(gate.output, { wire: gate.output, type: "XYCarry", num: i });
        XYCarryWires.push(gate.output);
      }
    }
  }

  // Store bad wires as a unique set
  let badWires = new Set();
  // Track all operations that should output to a z wire
  // which will be used to check if it contains all of the XY add wires
  let ZOutInputs = [];
  // Track OR gates that should use all of the XY carry wires
  let ORInputs = [];
  for (let gate of gates) {
    // If a gate is trying to output to a z wire
    // and uses AND or an OR operation this wire is bad
    if (
      (gate.operation === "AND" || gate.operation === "OR") &&
      gate.output.startsWith("z") &&
      gate.output !== "z" + pad(data.highestZ, 2)
    ) {
      badWires.add(gate.output);
    }
    // If the gate is an XOR operation and does not take x, y input values then
    // add its input to an array which should contain all of the XY add wires
    if (
      gate.operation === "XOR" &&
      !gate.inputs[0].startsWith("x") &&
      !gate.inputs[0].startsWith("y")
    ) {
      ZOutInputs.push(...gate.inputs);
    }
    // If the gate is an XOR and one of it's inputs is an XY add wire but it does
    // not output to a z wire this is a bad wire
    if (
      gate.operation === "XOR" &&
      (XYAddWires.includes(gate.inputs[0]) ||
        XYAddWires.includes(gate.inputs[1])) &&
      !gate.output.startsWith("z")
    ) {
      badWires.add(gate.output);
    }
    // If this is an OR operation store this to an array which should contain
    // all of the XY carry wires
    if (gate.operation === "OR") {
      ORInputs.push(...gate.inputs);
    }
  }

  // Check if all of the XY add wires are used in all of the z wire output gates
  XYAddWires.filter(
    (wire) => !ZOutInputs.includes(wire) && wire !== "z00",
  ).forEach((wire) => badWires.add(wire));
  // Any XY Carry wires that is not in an OR operation and does
  // not take inputs from x00 and y00 is bad
  XYCarryWires.filter(
    (wire) => !ORInputs.includes(wire) && wires.get(wire).num !== 0,
  ).forEach((wire) => badWires.add(wire));

  // Format the output for the bad wires
  return Array.from(badWires).sort().join(",");
};

/**
 * Part 1 Solution
 * @param {Map<string, number>} ogWires The initial wire values
 * @param {{
 *     inputs: string[],
 *     operation: string,
 *     output: string
 *   }[]} ogGates The initial gates
 * @returns {number} The decimal result of running the circuit
 */
const part1 = (ogWires, ogGates) => {
  // Clone the input data
  let wires = structuredClone(ogWires);
  let gates = structuredClone(ogGates);

  // Continue processing gates until all have been processed
  while (gates.length > 0) {
    // Resolved gate indexes which will be removed from the gates array
    let resolvedIndexes = [];
    // Try to resolve each gates output wire value
    for (let g = 0; g < gates.length; g++) {
      // Get the current gate
      let gate = gates[g];
      // Check if both input values have been resolved and get the values
      let hasBoth = true;
      let inputVals = [];
      for (let i = 0; i < gate.inputs.length && hasBoth; i++) {
        let input = gate.inputs[i];
        if (!wires.has(input)) hasBoth = false;
        else inputVals.push(wires.get(input));
      }

      // If both inputs have not been resolved then skip this gate for now
      if (inputVals.length != 2) continue;

      // Store the output value
      let outputVal;
      // Perform the correct operation to determine the output
      switch (gate.operation) {
        case "AND":
          outputVal = inputVals[0] && inputVals[1];
          break;
        case "OR":
          outputVal = inputVals[0] || inputVals[1];
          break;
        case "XOR":
          outputVal = inputVals[0] ^ inputVals[1];
          break;
      }
      // Set the output wire value in the wires map
      wires.set(gate.output, outputVal);
      // Add this gate's index to the ones to be removed
      resolvedIndexes.push(g);
    }
    // Remove gates from the array in the reverse order
    resolvedIndexes.reverse().forEach((r) => gates.splice(r, 1));
  }

  // Retrieve the z output from the wires Map one bit at a time
  let val = [];
  for (let i = 0; true; i++) {
    let wire = "z" + pad(i, 2);
    if (!wires.has(wire)) break;
    val.push(wires.get(wire));
  }
  // Parse the z output number into a decimal value
  return parseInt(val.reverse().join(""), 2);
};

/**
 * Add the correct leading 0 padding to a number and given the size value
 * @param {number} num Number to pad
 * @param {number} size How big should the padding be
 * @returns {string} String version of the number with the correct amount of padding
 */
const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};

/**
 * Parse the input
 * @param {string[]} fileContents
 * @returns {{
 *   wires: Map<string, number>,
 *   gates: {
 *     inputs: string[],
 *     operation: string,
 *     output: string
 *   }[],
 *   highestZ: number,
 *   highestX: number,
 *   highestY: number,
 * }} The data parsed from the input
 */
const parseInput = (fileContents) => {
  // Track wire values in a map and gates in an array of objects
  let wires = new Map();
  let gates = [];
  // Store the highest x, y, and z value found in the data
  let highestX = 0;
  let highestY = 0;
  let highestZ = 0;

  // Start by parsing in wire input info
  let wiresMode = true;
  for (let line of fileContents) {
    // Switch modes since a blank line will denote we are changing modes
    if (line === "") {
      wiresMode = false;
      continue;
    }
    // If parsing in wires
    if (wiresMode) {
      // Get the wire name and starting value
      let matches = line.match(/([A-z\d]+): (\d)/);
      // Add to the wires map
      wires.set(matches[1], parseInt(matches[2]));
      // Determine if this is the highest x value see
      if (matches[1].startsWith("x")) {
        let num = parseInt(matches[1].substring(1));
        if (num > highestX) highestX = num;
      }
      // Determine if this is the highest y value seen
      else if (matches[1].startsWith("y")) {
        let num = parseInt(matches[1].substring(1));
        if (num > highestY) highestY = num;
      }
    }
    // Otherwise parse the circuit's logic gate info
    else {
      // Get the inputs, operation, and output from the line
      let matches = line.match(
        /([A-z\d]+) ([XORAND]+) ([A-z\d]+) -> ([A-z\d]+)/,
      );
      // Create a new gate object and add it to the gates array
      let gate = {
        inputs: [matches[1], matches[3]],
        operation: matches[2],
        output: matches[4],
      };
      // If this gate outputs to a z value determine if this is the highest seen z value
      if (gate.output.startsWith("z")) {
        let num = parseInt(gate.output.substring(1));
        if (num > highestZ) highestZ = num;
      }
      gates.push(gate);
    }
  }
  return { wires, gates, highestX, highestY, highestZ };
};
