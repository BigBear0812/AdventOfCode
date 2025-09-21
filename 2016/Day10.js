// Puzzle for Day 10: https://adventofcode.com/2016/day/10

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse the bot info into a map of bots to work with
  let bots = parseInput(fileContents);
  // Create an empty map of output info
  let outputs = new Map();

  // Results for each part of the solution
  let result1;
  let result2;
  // Check for solutions and then do the next step until both are found
  do {
    // Check for Part 1 solution if not already found
    if (!result1) {
      result1 = checkForPart1Solution(bots);
    }
    // Check for Part 2 solution if not already found
    if (!result2) {
      result2 = checkForPart2Solution(outputs);
    }
    // Process the next step of passing around microchips
    processStep(bots, outputs);
  } while (!result1 || !result2);

  return { part1: result1, part2: result2 };
};

// Process a single step in the process of passing around microchips
const processStep = (bots, outputs) => {
  // Find the bots that have at least 2 microchips and will move this turn
  let willMove = [];
  bots.forEach((bot, name) => {
    if (bot.values.length >= 2) {
      willMove.push(name);
    }
  });

  // For each of the bots that will be moving process their handoff's one at a time
  for (let name of willMove) {
    // Get the bot info
    let bot = bots.get(name);
    // Determine the low and hign values
    let lowVal;
    let highVal;
    if (bot.values[0] > bot.values[1]) {
      lowVal = bot.values[1];
      highVal = bot.values[0];
    } else {
      lowVal = bot.values[0];
      highVal = bot.values[1];
    }

    // Update output or bot for the low reciever
    if (bot.lowType === "output") {
      // Check if the output bin exists and if not create a new array for it
      let output;
      if (outputs.has(bot.low)) output = outputs.get(bot.low);
      else output = [];

      // Add the value to the bin and update the outputs map
      output.push(lowVal);
      outputs.set(bot.low, output);
    } else if (bot.lowType === "bot") {
      // Get the bot to hand off to and add this to it's list of values
      let lowBot = bots.get(bot.low);
      lowBot.values.push(lowVal);
      bots.set(bot.low, lowBot);
    }

    // Update output or bot for the high reciever
    if (bot.highType === "output") {
      // Check if the output bin exists and if not create a new array for it
      let output;
      if (outputs.has(bot.high)) output = outputs.get(bot.high);
      else output = [];

      // Add the value to the bin and update the outputs map
      output.push(highVal);
      outputs.set(bot.high, output);
    } else if (bot.highType === "bot") {
      // Get the bot to hand off to and add this to it's list of values
      let highBot = bots.get(bot.high);
      highBot.values.push(highVal);
      bots.set(bot.high, highBot);
    }

    // Remove the values from this bot so it does not get
    // processed again next round
    bot.values = [];
    bots.set(name, bot);
  }
};

// Check for a solution to Part 1
const checkForPart1Solution = (bots) => {
  let result;
  // Examine each bot
  bots.forEach((bot, name) => {
    // If this bot has the values 61 and 17 update the result
    if (bot.values.indexOf(61) != -1 && bot.values.indexOf(17) != -1) {
      result = name;
    }
  });
  return result;
};

// Check for a solution to Part 2
const checkForPart2Solution = (outputs) => {
  let result;
  // Check if the outputs map has bins 0, 1, and 2 meaning it would have at least one value in each
  if (outputs.has(0) && outputs.has(1) && outputs.has(2)) {
    // Get the bin values
    let val0 = outputs.get(0);
    let val1 = outputs.get(1);
    let val2 = outputs.get(2);
    // Multiply the first element in each together for the result
    result = val0[0] * val1[0] * val2[0];
  }
  return result;
};

// Parse the input file into a set of useable bot objects
const parseInput = (fileContents) => {
  // Regex to parse each line
  let reg = new RegExp(
    /(value|bot) (\d+) [givesoe tlw]+ (bot|output) (\d+)(?: and high to (bot|output) (\d+))*/,
  );
  // The resulting map of bots
  let bots = new Map();

  // A base bot object to use for creating each bot for the first time
  let baseBot = {
    low: -1,
    lowType: "",
    high: -1,
    highType: "",
    values: [],
  };

  for (let line of fileContents) {
    // Find the matches for the given line
    let matches = line.match(reg);

    // If the first match is value this is adding a value to a bot
    if (matches[1] === "value") {
      // Get or create a new bot
      let botName = parseInt(matches[4]);
      let bot;
      if (bots.has(botName)) bot = bots.get(botName);
      else bot = JSON.parse(JSON.stringify(baseBot));

      // Add the value to the bot's set of values and update the resulting bots map
      bot.values.push(parseInt(matches[2]));
      bots.set(botName, bot);
    }
    // Else this is defining a bot's low and high values
    else if (matches[1] === "bot") {
      // Get or create a new bot
      let botName = parseInt(matches[2]);
      let bot;
      if (bots.has(botName)) bot = bots.get(botName);
      else bot = JSON.parse(JSON.stringify(baseBot));

      // Set the bot's low and high number to pass chips to.
      // Set the bot's low and high types to pass to either another bot or an output bin.
      // Update the resulting bots map.
      bot.low = parseInt(matches[4]);
      bot.lowType = matches[3];
      bot.high = parseInt(matches[6]);
      bot.highType = matches[5];
      bots.set(botName, bot);
    }
  }

  return bots;
};
