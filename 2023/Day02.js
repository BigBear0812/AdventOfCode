// Puzzle for Day 02: https://adventofcode.com/2023/day/2

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Set the maximum number of cubes for each color for Part 1
  let maxRed = 12;
  let maxGreen = 13;
  let maxBlue = 14;

  // Track the total of game ids and total power of all games
  let totalGames = 0;
  let totalPower = 0;

  // Check each game one at a time
  for (const line of fileContents) {
    // Split the game id from the front of the cube info for the game
    let gameSplits = line.split(": ");
    let game = gameSplits[0];
    let cubeInfo = gameSplits[1];

    // Get the game id as an int
    let gameMatch = game.match(/Game (\d+)/);
    let gameNum = parseInt(gameMatch[1]);

    // Track the highest seen values of each cube color for the game
    let highestRed = 0;
    let highestGreen = 0;
    let highestBlue = 0;

    // Split the cube info for the game into individual grabs from the bag
    let grabSplits = cubeInfo.split("; ");
    for (const grab of grabSplits) {
      // Split each grab into each cube color for the grab
      let cubeSplits = grab.split(", ");
      for (const cube of cubeSplits) {
        // Split each cube color into number and color name
        let cubeColorSplit = cube.split(" ");
        // Get the number of cubes for the color as an int
        let cubeCount = parseInt(cubeColorSplit[0]);

        // Check each color option and if it is higher than what has
        // been seen for this game update the highest value
        if (cubeColorSplit[1] == "red" && cubeCount > highestRed) {
          highestRed = cubeCount;
        } else if (cubeColorSplit[1] == "green" && cubeCount > highestGreen) {
          highestGreen = cubeCount;
        } else if (cubeColorSplit[1] == "blue" && cubeCount > highestBlue) {
          highestBlue = cubeCount;
        }
      }
    }

    // Part 1 check if each of the highest seen values is valid. If so add this game id to the total games
    if (
      highestRed <= maxRed &&
      highestGreen <= maxGreen &&
      highestBlue <= maxBlue
    ) {
      totalGames += gameNum;
    }

    // Part 2 Add to the total power each color count multiplied together
    totalPower += highestRed * highestGreen * highestBlue;
  }

  return { part1: totalGames, part2: totalPower };
};
