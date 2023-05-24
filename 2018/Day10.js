// Puzzle for Day 10: https://adventofcode.com/2018/day/10

export const run = (fileContents) => {
  // Parse the input file into a set of points used in the display object
  let display = parseInput(fileContents);

  // Find the output display and how long it takes to find it
  let output = findMessage(display);

  return {part1: output.display, part2: output.seconds};
}

// Find the output message and the amount of time it takes to find
const findMessage = (display) => {
  // The current height of the display points
  let curHeight = display.height;
  // The new height from the next iteration
  let newHeight = curHeight;
  // The number of seconds it takes to find the output
  let seconds;

  // Continue looking for the output while the new height is 
  // less than or equal to the current height
  for(seconds = 0; newHeight <= curHeight; seconds++){
    // Set the current height to the new height
    curHeight = newHeight;
    // Update the points by one more second
    display.updatePoints(1);
    // Set the new height to the updated points height
    newHeight = display.height;
  }

  // The display will be one second after the correct message 
  // so reverse the points and second counter by one
  display.updatePoints(-1);
  seconds -= 1;

  return {display: display.print(), seconds: seconds};
}

// Parse the input file into a display object
const parseInput = (fileContents) => {
  // Regex to parse each line of the file
  let reg = new RegExp(/position=< *(-*\d+),  *(-*\d+)> velocity=< *(-*\d+),  *(-*\d+)>/);
  // Set of points and their velocities
  let points = new Set();

  // Parse each line 
  for(let line of fileContents){
    // The matched digits for the line
    let matches = line.match(reg);
    // Add the point data to the set
    points.add({
      point: {
        x: parseInt(matches[1]),
        y: parseInt(matches[2])
      },
      velocity: {
        x: parseInt(matches[3]),
        y: parseInt(matches[4])
      }
    });
  }

  // Return a new display object
  return new Display(points);
}

// Display for the fireworks to keep track of the points 
// and code to update / display them
class Display {
  constructor(points){
    // Initialize the points and the outer dimensions of them
    this.points = points;
    this.top = null;
    this.bottom = null;
    this.left = null;
    this.right = null;

    // Update the egdes based on the current points set
    this.points.forEach((val) => {
      this.#updateEdges(val.point);
    })
  }

  // Update the points by the given number of seconds
  updatePoints(seconds) {
    // Reset edges to null
    this.top = null;
    this.bottom = null;
    this.left = null;
    this.right = null;
    // Update each point by the given number of seconds
    this.points.forEach((val) => {
      // Update the point coordinates by the velocity values and number of seconds
      val.point.x += seconds * val.velocity.x;
      val.point.y += seconds * val.velocity.y;
      // Update the egde values for the display
      this.#updateEdges(val.point);
    });
  }

  // Update edge values
  #updateEdges(point) {
    if(this.top === null || this.top >= point.y)
      this.top = point.y;
    if(this.bottom === null || this.bottom <= point.y)
      this.bottom = point.y;
    if(this.left === null || this.left >= point.x)
      this.left = point.x;
    if(this.right === null || this.right <= point.x)
      this.right = point.x;
  }

  // Get the height of the points on the grid
  get height() {
    return this.bottom - this.top;
  }

  // Create the console output for the current grid
  print(){
    // Convert the point data set into a string set of the point data
    let strPoints = new Set();
    this.points.forEach((val) => {
      strPoints.add(`${val.point.x},${val.point.y}`);
    });

    // The console output string
    let output = "\n";

    // For each row going from top to bottom
    for(let y = this.top; y <= this.bottom; y++){
      // The current line
      let line = "";
      // For each column going from left to right
      for(let x = this.left; x <= this.right; x++){
        // If the current point stfring is in the set add a # otherwise add a space
        let strPoint = `${x},${y}`;
        if(strPoints.has(strPoint))
          line += "#";
        else
          line += " ";
      }
      // Add current line plus a new line character to the output
      line += "\n";
      output += line;
    }

    return output;
  }
}