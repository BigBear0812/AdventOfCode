// Puzzle for Day 10: https://adventofcode.com/2021/day/10

export const run = (fileContents) => {
  // Split each line into a 2D array of individual characters
  const lines = fileContents.map((line) => line.split(""));

  // Keep track or the error characters in corrupted lines
  const errorChars = [];
  // Keep track of the stack of unclosed opening characters for incomplete lines
  const incompleteLineStacks = [];
  // Check each line of chunks
  for (let line of lines) {
    // Keep track of a stack of unclosed opening chunk tags
    const stack = [];
    // Copy the original line to see what characters are remaining
    const charactersRemaining = JSON.parse(JSON.stringify(line));
    // Find the error character if there is one for this line
    let errorChar = "";

    // Continue running if there are still characters to consider
    while (charactersRemaining.length && !errorChar) {
      // Get the next character
      let nextChar = charactersRemaining.shift();

      // If it opens a new chunk push it onto the stack
      if (
        nextChar === "(" ||
        nextChar === "[" ||
        nextChar === "{" ||
        nextChar === "<"
      ) {
        stack.push(nextChar);
      }
      // Else check for errors or proper chunk closing
      else {
        // If this is a closing tag with no opening one then this is an error
        if (!stack.length) {
          errorChar = nextChar;
        }
        // Get the last opening chunk character
        const lastStackChar = stack.pop();
        // If it matches characters make a proper closing chunk then continue
        if (
          (lastStackChar === "(" && nextChar === ")") ||
          (lastStackChar === "[" && nextChar === "]") ||
          (lastStackChar === "{" && nextChar === "}") ||
          (lastStackChar === "<" && nextChar === ">")
        ) {
          continue;
        }
        // Else this is an error character
        else {
          errorChar = nextChar;
        }
      }
    }

    // If an error character was found then add it to the error characters array
    if (errorChar) errorChars.push(errorChar);
    // Otherwise this is an incomplete line and add it to the array of incomplete lines
    else incompleteLineStacks.push(stack);
  }

  // Part 1
  // Evaluate each error character and get the total score
  const part1 = errorChars.reduce((total, char) => {
    if (char === ")") {
      return (total += 3);
    } else if (char === "]") {
      return (total += 57);
    } else if (char === "}") {
      return (total += 1197);
    } else if (char === ">") {
      return (total += 25137);
    }
  }, 0);

  // Part 2
  // Evaluate each stack of opening tags
  const part2 = incompleteLineStacks
    .map((lineStack) => {
      // Evaluate the opening tags in the stack in reverse order and calculate the
      // score based on the value given to the assumed correct closing tag
      return lineStack.reduceRight((total, char) => {
        total *= 5;
        if (char === "(") {
          return (total += 1);
        } else if (char === "[") {
          return (total += 2);
        } else if (char === "{") {
          return (total += 3);
        } else if (char === "<") {
          return (total += 4);
        }
      }, 0);
    })
    // Sort all scores
    .sort((a, b) => (a === b ? 0 : a < b ? -1 : 1))
    // Take the middle score
    .at(incompleteLineStacks.length / 2);
  return { part1, part2 };
};
