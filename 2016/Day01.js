// Puzzle for Day 1: https://adventofcode.com/2016/day/1

export const run = (fileContents) => {
  // The list of directions
  let directions = [];
  // Your current position
  let position = { x: 0, y: 0 };
  // The current direction you're facing
  let facing = "N";
  // The history of all positions that have been visited in the past starting with the current position
  let positionHistory = new Set();
  positionHistory.add("0,0");
  // The location of the hideout
  let hideoutPosition = null;

  // Regex for parsing each direction in the set
  let reg = new RegExp(/([LR])(\d+)/);
  // Split the directions by the comma into an array
  let splits = fileContents[0].split(",");

  // Parse each split
  for (let split of splits) {
    // Get the relevent info from the directions string with the regex
    let matches = split.match(reg);
    // Add the new direction to the array
    directions.push({ direction: matches[1], distance: parseInt(matches[2]) });
  }

  // Process each direction
  for (let dir of directions) {
    // Handle change in direction
    // Turning left
    if (dir.direction === "L") {
      switch (facing) {
        case "N":
          facing = "W";
          break;
        case "E":
          facing = "N";
          break;
        case "S":
          facing = "E";
          break;
        case "W":
          facing = "S";
      }
    }
    // Turning right
    else if (dir.direction === "R") {
      switch (facing) {
        case "N":
          facing = "E";
          break;
        case "E":
          facing = "S";
          break;
        case "S":
          facing = "W";
          break;
        case "W":
          facing = "N";
          break;
      }
    }

    // Walk in new direction. Doing this one step at a time
    // instead of adding the full distance travelled allows
    // for checking each step for possibly having been there
    // before.
    for (let steps = 0; steps < dir.distance; steps++) {
      switch (facing) {
        case "N":
          position.y += 1;
          break;
        case "E":
          position.x += 1;
          break;
        case "S":
          position.y -= 1;
          break;
        case "W":
          position.x -= 1;
          break;
      }

      // If the hideout position has not been found yet
      if (hideoutPosition === null) {
        // Create a string of the current position
        let positionString = `${position.x},${position.y}`;
        // If it is in the history the hideout has been found
        if (positionHistory.has(positionString))
          hideoutPosition = JSON.parse(JSON.stringify(position));
        // Otherwise add this position to the history
        else positionHistory.add(positionString);
      }
    }
  }
  // Get the distance from the final positoin and fron the hideout
  let distance = Math.abs(position.x) + Math.abs(position.y);
  let hideoutDistance =
    Math.abs(hideoutPosition.x) + Math.abs(hideoutPosition.y);

  return { part1: distance, part2: hideoutDistance };
};
