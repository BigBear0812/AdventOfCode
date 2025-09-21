// Puzzle for Day 19: https://adventofcode.com/2022/day/19

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let result1 = part1(fileContents);
  let result2 = part2(result1.blueprints);

  return { part1: result1.total, part2: result2 };
};

const part1 = (fileContents) => {
  // Parse in all of the blueprints
  let blueprints = parseInput(fileContents);

  // Process each blueprint for the given number of minutes
  let results = processBlueprints(blueprints, 24);

  // Get the sum of all quality values for each blueprint
  let total = results.reduce(
    (total, geodes, index) => total + geodes * index,
    0,
  );

  return { blueprints, total };
};

const part2 = (blueprints) => {
  // Process only the first 3 blueprints for the given number of minutes
  let results = processBlueprints(blueprints.slice(0, 3), 32);

  // Multiply each of the outputs together
  let total = results.reduce((total, geodes) => total * geodes, 1);

  return total;
};

// Parse the input line by line using regex
const parseInput = (fileContents) => {
  const reg = new RegExp(
    /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./,
  );
  const blueprints = [];
  for (const line of fileContents) {
    let matches = line.match(reg);
    blueprints.push({
      blueprintNum: parseInt(matches[1]),
      oreRobotOreCost: parseInt(matches[2]),
      clayRobotOreCost: parseInt(matches[3]),
      obsidianRobotOreCost: parseInt(matches[4]),
      obsidianRobotClayCost: parseInt(matches[5]),
      geodeRobotOreCost: parseInt(matches[6]),
      geodeRobotObsidianCost: parseInt(matches[7]),
    });
  }
  return blueprints;
};

// Return the maximum geode output for each factory blueprint
// for the specified number of minutes. This solution runs slowly
// (takes about a minute to complete) because it considers a
// lot of options that are not optimal. Adding conditions to help
// reduce the set of next possible states would cut down this run
// time significantly
const processBlueprints = (blueprints, maxTime) => {
  // The max geodes to be returned for each blueprint
  let results = [];

  // Process blueprints one at a time
  for (const blueprint of blueprints) {
    // Add the starting state to the set of states
    let states = [new State(new Stock(0, 0, 0, 0), new Robots(1, 0, 0, 0))];

    // Breadth first search of all possible outcomes
    for (let t = 0; t < maxTime; t++) {
      // Store unsorted new states seperately
      let newStates = [];
      // Get all next possible states for the given current state processed for each minute
      for (const state of states) {
        // If can create a geode robot
        if (
          state.stock.ore >= blueprint.geodeRobotOreCost &&
          state.stock.obsidian >= blueprint.geodeRobotObsidianCost
        ) {
          newStates.push(
            new State(
              new Stock(
                state.stock.ore +
                  state.robots.ore -
                  blueprint.geodeRobotOreCost,
                state.stock.clay + state.robots.clay,
                state.stock.obsidian +
                  state.robots.obsidian -
                  blueprint.geodeRobotObsidianCost,
                state.stock.geode + state.robots.geode,
              ),
              new Robots(
                state.robots.ore,
                state.robots.clay,
                state.robots.obsidian,
                state.robots.geode + 1,
              ),
            ),
          );
        }
        // If can create an obsidian robot
        if (
          state.stock.ore >= blueprint.obsidianRobotOreCost &&
          state.stock.clay >= blueprint.obsidianRobotClayCost
        ) {
          newStates.push(
            new State(
              new Stock(
                state.stock.ore +
                  state.robots.ore -
                  blueprint.obsidianRobotOreCost,
                state.stock.clay +
                  state.robots.clay -
                  blueprint.obsidianRobotClayCost,
                state.stock.obsidian + state.robots.obsidian,
                state.stock.geode + state.robots.geode,
              ),
              new Robots(
                state.robots.ore,
                state.robots.clay,
                state.robots.obsidian + 1,
                state.robots.geode,
              ),
            ),
          );
        }
        // If can create a clay robot
        if (state.stock.ore >= blueprint.clayRobotOreCost) {
          newStates.push(
            new State(
              new Stock(
                state.stock.ore + state.robots.ore - blueprint.clayRobotOreCost,
                state.stock.clay + state.robots.clay,
                state.stock.obsidian + state.robots.obsidian,
                state.stock.geode + state.robots.geode,
              ),
              new Robots(
                state.robots.ore,
                state.robots.clay + 1,
                state.robots.obsidian,
                state.robots.geode,
              ),
            ),
          );
        }
        // If can create an ore robot
        if (state.stock.ore >= blueprint.oreRobotOreCost) {
          newStates.push(
            new State(
              new Stock(
                state.stock.ore + state.robots.ore - blueprint.oreRobotOreCost,
                state.stock.clay + state.robots.clay,
                state.stock.obsidian + state.robots.obsidian,
                state.stock.geode + state.robots.geode,
              ),
              new Robots(
                state.robots.ore + 1,
                state.robots.clay,
                state.robots.obsidian,
                state.robots.geode,
              ),
            ),
          );
        }
        // If deciding to make no robots
        newStates.push(
          new State(
            new Stock(
              state.stock.ore + state.robots.ore,
              state.stock.clay + state.robots.clay,
              state.stock.obsidian + state.robots.obsidian,
              state.stock.geode + state.robots.geode,
            ),
            new Robots(
              state.robots.ore,
              state.robots.clay,
              state.robots.obsidian,
              state.robots.geode,
            ),
          ),
        );
      }
      // Sort the new states based on the score value calculated for it.
      // Keep only the top 500000. This number was found through trial
      // and error and seems to give the correct result but is very slow.
      states = newStates
        .sort((a, b) => b.score(maxTime, t) - a.score(maxTime, t))
        .slice(0, 500000);
    }

    // Once all possible best states have been found sort the highest
    // geode count to the top and add it to the results
    states.sort((a, b) => b.stock.geode - a.stock.geode);
    let maxGeode = states[0].stock.geode;
    results[blueprint.blueprintNum] = maxGeode;
  }

  return results;
};

// A class for holding a current state
class State {
  constructor(stock, robots) {
    this.stock = stock;
    this.robots = robots;
  }

  // Inspired by https://github.com/CodingAP/advent-of-code/tree/main/profiles/github/2022/day19
  // This score rates this state by how close it is to the final goal to maximize geode output.
  score(maxTime, currentTime) {
    return (
      this.stock.geode +
      (maxTime - currentTime) * this.robots.geode * 10000000 +
      this.robots.obsidian * 100000 +
      this.robots.clay * 100 +
      this.robots.ore
    );
  }
}

// A class for holding the current stock the robots have colledcted for each material
class Stock {
  constructor(ore, clay, obsidian, geode) {
    this.ore = ore;
    this.clay = clay;
    this.obsidian = obsidian;
    this.geode = geode;
  }
}

// A class for keeping track of how many of each robot are in a current state
class Robots {
  constructor(ore, clay, obsidian, geode) {
    this.ore = ore;
    this.clay = clay;
    this.obsidian = obsidian;
    this.geode = geode;
  }
}
