// Puzzle for Day 13: https://adventofcode.com/2024/day/13

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = async (fileContents) => {
  let machines = parseInput(fileContents);
  let result1 = findTotalTokens(machines, false);
  let result2 = findTotalTokens(machines, true);
  return { part1: result1, part2: result2 };
};

/**
 * Find the total cost to win all beatable claw machines
 * @param {{
 *    buttonA: {x: number, y: number},
 *    buttonB: {x: number, y: number},
 *    prize: {x: number, y: number}
 *  }[]} machines Array of all claw machine info
 * @param {boolean} part2 True if part 2
 * @returns {number} The total cost to win ann solvable claw machines
 */
const findTotalTokens = (machines, part2) => {
  // Find the total number of A and B Button clicks for all machines
  let totalA = 0;
  let totalB = 0;
  for (let machine of machines) {
    // Linear Algebra
    // Solve System of Two Equations and Two Variables
    // https://flexbooks.ck12.org/cbook/ck-12-college-precalculus/section/10.2/primary/lesson/systems-of-two-equations-and-two-unknowns-c-precalc/
    //
    // ABtn.X * AClicks + BBtn.X * BClicks = Prize.X
    // ABtn.Y * AClicks + BBtn.Y * BClicks = Prize.Y
    let prizeX = part2 ? machine.prize.x + 10000000000000 : machine.prize.x;
    let prizeY = part2 ? machine.prize.y + 10000000000000 : machine.prize.y;

    //  BBtn.Y * BClicks(ABtn.X * AClicks + BBtn.X * BClicks) =  BBtn.Y * BClicks(Prize.X)
    // -BBtn.X * BClicks(ABtn.Y * AClicks + BBtn.Y * BClicks) = -BBtn.X * BClicks(Prize.Y)
    let aClicksXMultiplier = machine.buttonA.x * machine.buttonB.y;
    let aClicksYMultiplier = machine.buttonA.y * machine.buttonB.x * -1;
    let prizeXMultiplied = prizeX * machine.buttonB.y;
    let prizeYMultiplied = prizeY * machine.buttonB.x * -1;

    //   AClicksXMultiplier        * AClicks = PrizeXMultiplied
    // + AClicksYMultiplier        * AClicks = PrizeYMultiplied
    // --------------------------------------------------------------
    //   AClicksMultiplierCombined * AClicks = PrizeMultipliedCombined
    let aClicksMultiplierCombined = aClicksXMultiplier + aClicksYMultiplier;
    let prizeMultipliedCombined = prizeXMultiplied + prizeYMultiplied;

    // AClicks = PrizeMultipliedCombined / AClicksMultiplierCombined
    let aClicks = prizeMultipliedCombined / aClicksMultiplierCombined;
    let aClicksRemainder = prizeMultipliedCombined % aClicksMultiplierCombined;

    // Only continue if there is a whole number of A button clicks.
    // Otherwise there is not a solution
    if (aClicksRemainder === 0) {
      // Solve for B button clicks
      // ABtn.X * AClicks + BBtn.X * BClicks = Prize.X
      //
      // Rewritten to solve for B button clicks
      // BClicks = (Prize.X - ABtn.x * AClicks)/BBtn.X
      let bClicks = (prizeX - machine.buttonA.x * aClicks) / machine.buttonB.x;
      let bClicksRemainder = bClicks % 1;

      // Only continue if there is a whole number of B button clicks.
      // Otherwise there is not a solution
      if (bClicksRemainder === 0) {
        totalA += aClicks;
        totalB += bClicks;
      }
    }
  }

  // Calculate the total cost of all button presses
  return totalA * 3 + totalB;
};

/**
 * Parse the input file contents into an array of claw machine info
 * @param {string[]} fileContents The input file contents
 * @returns {
 *  {
 *    buttonA: {x: number, y: number},
 *    buttonB: {x: number, y: number},
 *    prize: {x: number, y: number}
 *  }[]
 * } An array of each machine's button and prize values.
 */
const parseInput = (fileContents) => {
  // Record all claw machines
  let machines = [];
  // The most recent button and prize info
  let buttonA = null;
  let buttonB = null;
  let prize = null;
  // Parse in each line in order
  for (let l = 0; l < fileContents.length; l++) {
    // If this is a blank separator line save the button and prize info and null out the variables
    if (l % 4 === 3) {
      machines.push({ buttonA, buttonB, prize });
      buttonA = null;
      buttonB = null;
      prize = null;
    } else {
      // Otherwise parse in the line's information
      let matches = fileContents[l]
        .match(/X[\+=](\d+), Y[\+=](\d+)/)
        .map((val) => parseInt(val));
      // If this is the first line for the machine save the info to buttons A
      if (l % 4 === 0) {
        buttonA = { x: matches[1], y: matches[2] };
      }
      // If this is the second line for the machine save the info to buttons B
      else if (l % 4 === 1) {
        buttonB = { x: matches[1], y: matches[2] };
      }
      // If this is the third line for the machine save the info to prize
      else if (l % 4 === 2) {
        prize = { x: matches[1], y: matches[2] };
      }
    }
  }
  // If there is a full machines worth of info left to be added to t
  // the array make sure to include it.
  if (buttonA && buttonB && prize) machines.push({ buttonA, buttonB, prize });

  return machines;
};
