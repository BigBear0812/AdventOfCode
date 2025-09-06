// Puzzle for Day 20: https://adventofcode.com/2023/day/20

export const run = (fileContents) => {
  // Get the solution for each part
  let result1 = part1(fileContents);
  let result2 = part2(fileContents);

  return { part1: result1, part2: result2 };
};

/**
 * Part 2 Solution
 * @param {string[]} fileContents
 * @returns
 */
const part2 = (fileContents) => {
  // Create the modules map
  let modules = createModuleMap(fileContents);
  // Track how many button pushes have been made and at what point each of
  // these modules sent a high pulse. When all of these modules in my input
  // have sent a high the rx module will start the machine
  let buttonPushes = 0;
  let vgHigh = null;
  let kpHigh = null;
  let gcHigh = null;
  let txHigh = null;
  // Continue until a high pulse has been sent from each module
  while (!vgHigh || !kpHigh || !gcHigh || !txHigh) {
    // Track all upcoming pulses to be processed in order. Start by
    // adding the initial button push for this round and increment
    // the button push counter
    let queue = [];
    queue.push({ mod: "button", pulse: null, from: null });
    buttonPushes++;
    while (queue.length > 0) {
      // Get the current pulse to process
      let current = queue.shift();
      // Check if any of the modules sent a high pulse
      if (!vgHigh && current.from == "vg" && current.pulse == "high")
        vgHigh = buttonPushes;

      if (!kpHigh && current.from == "kp" && current.pulse == "high")
        kpHigh = buttonPushes;

      if (!gcHigh && current.from == "gc" && current.pulse == "high")
        gcHigh = buttonPushes;

      if (!txHigh && current.from == "tx" && current.pulse == "high")
        txHigh = buttonPushes;

      // Get the current module the pulse is sent to
      let currentMod = modules.get(current.mod);
      if (currentMod) {
        // Generate the new pulses and add them to the end of the queue
        let newPulses = currentMod.generatePulses(current.pulse, current.from);
        if (newPulses && newPulses.length > 0) queue.push(...newPulses);
      }
    }
  }

  // The rx module will start the machine when all of these modules send the high
  // pulse at once. The number of button pushes this takes is the LCM of these numbers.
  // Since they are all primes this can be found by multiplying them all together.
  return vgHigh * kpHigh * gcHigh * txHigh;
};

/**
 * Part 1 Solution
 * @param {string[]} fileContents
 * @returns
 */
const part1 = (fileContents) => {
  // Create the modules map
  let modules = createModuleMap(fileContents);
  // Set 1000 button pushes to run through and count the number of low and high pulses sent during this time
  let buttonPushes = 1000;
  let lowCount = 0;
  let highCount = 0;
  for (let bp = 0; bp < buttonPushes; bp++) {
    // Keep a queue of all upcoming pulses that need to be processed
    let queue = [];
    // Add the initial button push action to start the sequence
    queue.push({ mod: "button", pulse: null, from: null });
    while (queue.length > 0) {
      // Get the current pulse
      let current = queue.shift();
      // Update the counts
      if (current.pulse === "low") lowCount++;
      else if (current.pulse === "high") highCount++;

      // Get the module from the map
      let currentMod = modules.get(current.mod);
      // If found generate the output pulses and add them to the queue
      if (currentMod) {
        let newPulses = currentMod.generatePulses(current.pulse, current.from);
        if (newPulses && newPulses.length > 0) queue.push(...newPulses);
      }
    }
  }

  // Return the low pulse count multiplied byt the high pulse count
  return lowCount * highCount;
};

/**
 * Create the module map from the input that can be processed for each part
 * @param {string[]} fileContents
 * @returns
 */
const createModuleMap = (fileContents) => {
  // Create a map with a button module that outputs to the broadcaster
  let modules = new Map();
  let buttonMod = new Module("button");
  buttonMod.addOutput("broadcaster");
  modules.set(buttonMod.name, buttonMod);

  // For each line add a new module to the map
  for (let line of fileContents) {
    // Get the important info using regex
    let matches = line.match(/([%&])?([a-z]+) -> ([a-z, ]+)/);
    // Create a module with the specified type
    let mod;
    if (!matches[1]) mod = new Module(matches[2]);
    else if (matches[1] == "%") mod = new FlipFlopModule(matches[2]);
    else if (matches[1] == "&") {
      mod = new ConjunctionModule(matches[2]);
      // For conjunction modules add the input from the outputs of other modules in the input
      for (let line2 of fileContents) {
        let matches2 = line2.match(/([a-z]+) -> ([a-z, ]+)/);
        let potInputs = matches2[2].split(",").map((x) => x.trim());
        if (potInputs.includes(matches[2])) mod.addInput(matches2[1]);
      }
    }

    // Add the outputs specified on this line to the module
    mod.addOutputs(matches[3].split(",").map((x) => x.trim()));
    // Add this module to the map
    modules.set(mod.name, mod);
  }

  return modules;
};

/**
 * A class for tracking module states and their different functionalities
 */
class Module {
  // Constructor to setup initial state of all modules
  constructor(name) {
    this.name = name;
    this.outputs = [];
  }

  // Add a single output to the modules outputs array
  addOutput(mod) {
    this.outputs.push(mod);
  }

  // Add multiple outputs to the outputs array
  addOutputs(mods) {
    this.outputs.push(...mods);
  }

  // Generate a low pulse to all outputs for generic modules
  generatePulses(pulse, input) {
    return this.outputs.map((o) => {
      return { mod: o, pulse: "low", from: this.name };
    });
  }
}

/**
 * A flip flop module class. This tracks an internal state for the
 * flip flop and generate output pulses based on flip flop rules
 */
class FlipFlopModule extends Module {
  // Track and internal state for this flipflop module
  constructor(name) {
    super(name);
    this.state = false;
  }

  // Generate pulses based on flip flop rules
  generatePulses(pulse, input) {
    // If high pulse received return no pulses
    if (pulse === "high") return;
    // Otherwise if low pulse received toggle the internal state and
    // generate a pulse based on the new setting of the state
    else if (pulse === "low") {
      this.state = !this.state;
      let outputPulse;
      if (this.state) outputPulse = "high";
      else outputPulse = "low";
      return this.outputs.map((o) => {
        return { mod: o, pulse: outputPulse, from: this.name };
      });
    }
  }
}

/**
 * A conjunction module class. This tracks the inputs states
 * and generates output pulses based on the conjunction rules
 */
class ConjunctionModule extends Module {
  // Setup an array for tracking inputs for this conjunction module
  constructor(name) {
    super(name);
    this.inputs = [];
  }

  // Add an input for the conjunction module
  addInput(mod) {
    this.inputs.push({
      mod,
      state: "low",
    });
  }

  // Generate pulses based on conjunction rules
  generatePulses(pulse, input) {
    // Update the state of the input that sent this pulse
    let inputIndex = this.inputs.findIndex((i) => i.mod === input);
    this.inputs[inputIndex].state = pulse;

    // If all of the inputs are high output a low pulse otherwise output a high pulse
    let allHigh = this.inputs.every((i) => i.state === "high");
    if (allHigh)
      return this.outputs.map((o) => {
        return { mod: o, pulse: "low", from: this.name };
      });
    else
      return this.outputs.map((o) => {
        return { mod: o, pulse: "high", from: this.name };
      });
  }
}
