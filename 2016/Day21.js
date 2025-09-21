// Puzzle for Day 21: https://adventofcode.com/2016/day/21

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse in the step commands from the input file
  let steps = parseInput(fileContents);

  // The starting passcode for Part 1 to scramble
  let passcode = "abcdefgh".split("");

  // The scrambled passcode after applying all of the steps
  let scrambled = scramblePasscode(steps, passcode);

  // The scrambled passcode from the password file
  let scrambledFilePasscode = "fbgdceah".split("");

  // The uncscrambled passcode after applying all rules in reverse
  let unscrambled = scramblePasscode(steps, scrambledFilePasscode, true);

  return { part1: scrambled.join(""), part2: unscrambled.join("") };
};

// A method to scramble or unscramble a passcode given the set of instructions
const scramblePasscode = (steps, passcode, unscramble = false) => {
  // The resulting passcode
  let result = passcode;

  // The steps in order or revered if unscrambling
  let orderedSteps = unscramble ? steps.reverse() : steps;

  // Apply each step in order
  for (let step of orderedSteps) {
    // Swap command
    if (step.command === "swap") {
      // Position swap
      if (step.type === "position") {
        let firstLetter = result[step.first];
        let lastLetter = result[step.last];
        result[step.first] = lastLetter;
        result[step.last] = firstLetter;
      }
      // Letter swap
      else if (step.type === "letter") {
        let firstIndex = result.indexOf(step.first);
        let lastIndex = result.indexOf(step.last);
        result[firstIndex] = step.last;
        result[lastIndex] = step.first;
      }
    }
    // Reverse command
    else if (step.command === "reverse") {
      let revArr = result.slice(step.first, step.last + 1);
      revArr.reverse();
      result.splice(step.first, revArr.length, ...revArr);
    }
    // Rotate command
    else if (step.command === "rotate") {
      let numRotations = 0;
      let direction = "";
      // Rotating based on a letter position
      if (step.direction === "based") {
        let index = result.indexOf(step.value);
        // Unscrmabling. Each starting index when scrambling maps to a
        // unique index after a unique number of moves. This maps the
        // output index to the number of moves to reach the unscrmabled
        // starting index
        if (unscramble) {
          switch (index) {
            case 0:
              numRotations = 9;
              break;
            case 1:
              numRotations = 1;
              break;
            case 2:
              numRotations = 6;
              break;
            case 3:
              numRotations = 2;
              break;
            case 4:
              numRotations = 7;
              break;
            case 5:
              numRotations = 3;
              break;
            case 6:
              numRotations = 8;
              break;
            case 7:
              numRotations = 4;
              break;
          }
          direction = "left";
        }
        // Scrambling. Follows the formula in the puzzle
        else {
          numRotations = 1 + index + (index >= 4 ? 1 : 0);
          direction = "right";
        }
      }
      // Rotating left or right a given number of spaces.
      // If unscrambling reverse the direction
      else {
        numRotations = step.value;
        direction = unscramble
          ? step.direction === "left"
            ? "right"
            : "left"
          : step.direction;
      }

      // Rotate the array the specified direction the specified number of times
      for (let x = 0; x < numRotations; x++) {
        if (direction === "right") {
          let moving = result.pop();
          result.unshift(moving);
        } else if (direction === "left") {
          let moving = result.shift();
          result.push(moving);
        }
      }
    }
    // Move command
    else if (step.command === "move") {
      // Unscrambling
      if (unscramble) {
        let letter = result.splice(step.last, 1);
        result.splice(step.first, 0, letter[0]);
      }
      // Scrambling
      else {
        let letter = result.splice(step.first, 1);
        result.splice(step.last, 0, letter[0]);
      }
    }
  }

  return result;
};

// Parse each line of the input as a separate command to scramble or unscramble the input
const parseInput = (fileContents) => {
  // Swap regex
  let regSwap = new RegExp(
    /(swap) (position|letter) (\d+|[a-z]+) with (position|letter) (\d+|[a-z]+)/,
  );
  // Reverse regex
  let regRev = new RegExp(/(reverse) positions (\d+) through (\d+)/);
  // Rotate regex
  let regRot = new RegExp(
    /(rotate) (right|left|based) (?:on position of letter )*(\d+|[a-z]+)/,
  );
  // Move regex
  let regMove = new RegExp(/(move) position (\d+) to position (\d+)/);

  let steps = [];

  for (let line of fileContents) {
    // Try to match the line to each of the regex patterns
    let matchesSwap = line.match(regSwap);
    let matchesRev = line.match(regRev);
    let matchesRot = line.match(regRot);
    let matchesMove = line.match(regMove);

    // Swap command
    if (matchesSwap) {
      steps.push({
        command: matchesSwap[1],
        type: matchesSwap[2],
        first:
          matchesSwap[2] === "position"
            ? parseInt(matchesSwap[3])
            : matchesSwap[3],
        last:
          matchesSwap[4] === "position"
            ? parseInt(matchesSwap[5])
            : matchesSwap[5],
      });
    }
    // Reverse command
    else if (matchesRev) {
      steps.push({
        command: matchesRev[1],
        first: parseInt(matchesRev[2]),
        last: parseInt(matchesRev[3]),
      });
    }
    // Rotate command
    else if (matchesRot) {
      steps.push({
        command: matchesRot[1],
        direction: matchesRot[2],
        value:
          matchesRot[2] === "based" ? matchesRot[3] : parseInt(matchesRot[3]),
      });
    }
    // Move command
    else if (matchesMove) {
      steps.push({
        command: matchesMove[1],
        first: parseInt(matchesMove[2]),
        last: parseInt(matchesMove[3]),
      });
    }
  }

  return steps;
};
