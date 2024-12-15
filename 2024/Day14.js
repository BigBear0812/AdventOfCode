import * as readline from 'node:readline';

// Puzzle for Day 14: https://adventofcode.com/2024/day/14

// The height and width of the area as specified by the puzzle.
const HEIGHT = 103;
const WIDTH = 101;

export const run = async (fileContents) => {
  let robots = parseInput(fileContents);
  let result1 = safetyFactorSim(robots, 100);
  let result2 = await findTheTree(robots);
  return {part1: result1, part2: result2};
}

/**
 * Part 2 Solution
 * @param {{p: {x: number, y: number}, v: {x: number, y: number}}[]} robots Robots info
 * @returns {Promise<number>} The number of seconds until the robots form the Christmas tree
 */
const findTheTree = async (robots) => {
  // Save the second that the user says the tree is found in
  let foundSeconds = null;
  // Continue simulating seconds one at a time until the tree is found
  for(let s = 1; !foundSeconds; s++){
    // Save a set of the new positions generated
    let positions = new Set()
    // Update the position of each robot while also 
    // saving their locations to the positions set
    for(let robot of robots){
      robot.p.x = (robot.p.x + robot.v.x + WIDTH) % WIDTH;
      robot.p.y = (robot.p.y + robot.v.y + HEIGHT) % HEIGHT;
      positions.add(`${robot.p.y},${robot.p.x}`);
    }
    // If the positions set size is the same length as 
    // the array it will mean each robot is on a unique 
    // space. This likely means the solution has been 
    // found but might not. The user will need to 
    // confirm this.
    if(positions.size === robots.length){
      // Generate an output for the entire area
      let output = '';
      for(let y = 0; y < HEIGHT; y++){
        for(let x = 0; x < WIDTH; x++){
          // If a space is filled by a robot use a # otherwise use a .
          output += positions.has(`${y},${x}`) ? '#' : '.';
        }
        output += '\n';
      }
      // Include the question in the output
      output += 'Do you see a tree? (y/N): ';
      // Present the question and await a response
      let answer = await askQuestion(output);
      // If the user answered yes set the found second to the current second
      if(answer.toUpperCase().startsWith('Y')){
        foundSeconds = s;
      }
    }
  }
  return foundSeconds;
}

/**
 * Ask the user a question
 * @param {string} query A question to ask the user
 * @returns {Promise<string>} The answer provided by the user
 */
const askQuestion = (query) => {
  // Create an interface for readline to ask a question through and CLI
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Ask the question in a promise that will complete when the use responds
  return new Promise(resolve => rl.question(query, ans => {
    // Close readline interface
    rl.close();
    // Resolve the promise while passing back the answer
    resolve(ans);
  }));
}

/**
 * Part 1 Solution
 * @param {{p: {x: number, y: number}, v: {x: number, y: number}}[]} robots Robots info
 * @param {number} seconds The number of seconds to simulate
 * @returns {number} Calculated safety factor
 */
const safetyFactorSim = (robots, seconds) => {
  // Find the center line both horizontally and vertically to ignore
  let centerX = Math.floor(WIDTH/2);
  let centerY = Math.floor(HEIGHT/2);
  // Keep track of how many robots are in each quadrant
  let q1 = 0;
  let q2 = 0; 
  let q3 = 0; 
  let q4 = 0;

  // Get the new position of each robot
  for(let robot of robots){
    // Get the X and Y coordinates of the the robot after 100 seconds of movement
    let pX = (robot.p.x + robot.v.x * seconds + WIDTH * seconds) % WIDTH;
    let pY = (robot.p.y + robot.v.y * seconds + HEIGHT * seconds) % HEIGHT;

    // If on a center line ignore it
    if(pX === centerX || pY === centerY){
      continue;
    }
    else{
      // Otherwise find the quadrant to count it in
      if(pX < centerX && pY < centerY){
        q1++;
      }
      else if(pX > centerX && pY < centerY){
        q2++;
      }
      else if(pX < centerX && pY > centerY){
        q3++;
      }
      else if(pX > centerX && pY > centerY){
        q4++;
      }
    }
  }

  // Multiply each quadrants value together to get the solution
  return q1 * q2 * q3 * q4;
}

/**
 * Parse the input file into robot information
 * @param {string[]} fileContents All line of the input files as entries in the array 
 * @returns {{p: {x: number, y: number}, v: {x: number, y: number}}[]} Array of robot starting position and velocities
 */
const parseInput = (fileContents) => {
  // Parse each line fo the input file as a separate robot
  return fileContents.map(line => {
    // Use regex to extract the necessary info from it
    let matches = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/);
    // Create an object for current position and velocity
    return {
      p: {
        x: parseInt(matches[1]),
        y: parseInt(matches[2])
      },
      v: {
        x: parseInt(matches[3]),
        y: parseInt(matches[4])
      }
    };
  });
}