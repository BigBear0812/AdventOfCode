// Puzzle for Day 16: https://adventofcode.com/2020/day/16

export const run = (fileContents) => {

  // Run each part of the problem
  let result1 = sim(fileContents, true);
  let result2 = sim(fileContents, false);

  return { part1: result1, part2: result2 };
}

/**
 * The Conway Cubes Simulation
 * @param {string[]} fileContents The input file as an array of each line of the input file
 * @param {boolean} threeD True if using 3D instead of 4D modeling
 * @returns {number} The final number of active position after the simulation finishes
 */
const sim = (fileContents, threeD) => {
  // Get the initial set of active points from the input file
  let active = new Set();
  for(let y = 0; y < fileContents.length; y++){
    let line = fileContents[y].split("");
    for(let x = 0; x < fileContents[y].length; x++){
      // If active add the coordinates to the active set
      if(line[x] === "#")
        threeD ? active.add(`{"x":${x},"y":${y},"z":0}`) : active.add(`{"x":${x},"y":${y},"z":0,"w":0}`);
    }
  }

  // The number of rounds to simulate
  const totalRounds = 6;

  for(let r = 0; r < totalRounds; r++){
    // Keep track of the next rounds set of active points
    let nextActive = new Set();
    // Get an array of the current rounds active points set
    let currentActive = Array.from(active, s => JSON.parse(s));
    // Create a set of the inactive points that surround each 
    // currently active point to see if they will be come active
    let currentInactiveSet = new Set();
    
    // Check each current active points to see if it remains active 
    // and get its surrounding inactive points
    for(let a = 0; a < currentActive.length; a++){
      // The currently active point and all of it surrounding points
      let ca = currentActive[a];
      let surrounding = threeD ? getSurrounding3D(ca) : getSurrounding4D(ca);

      // Count the number of surrounding active points and 
      // populate the inactive points set
      let activeCount = 0;
      for(let s = 0; s < surrounding.length; s++){
        let sKey = JSON.stringify(surrounding[s]);
        if(active.has(sKey))
          activeCount++;
        else
          currentInactiveSet.add(sKey);
      }

      // Determine if this point will be active next round
      if(activeCount === 2 || activeCount === 3)
        nextActive.add(JSON.stringify(ca));
    }

    // Get an array of the set of inactive points to 
    // parse through to see if any become active
    let currentInactive = Array.from(currentInactiveSet, s => JSON.parse(s));
    for(let i = 0; i < currentInactive.length; i++){
      // get the current inactive point and it's surrounding points
      let ci = currentInactive[i];
      let surrounding = threeD ? getSurrounding3D(ci) : getSurrounding4D(ci);

      // Count the number of active points and check if the point 
      // is becoming active in the next round
      let activeCount = surrounding.reduce((total, s) => total += active.has(JSON.stringify(s)) ? 1 : 0, 0);
      if(activeCount === 3)
        nextActive.add(JSON.stringify(ci));
    }

    // Set the next active set to the active set to complete the round
    active = nextActive;
  }

  // Return the size of the final round's set of active points
  return active.size;
}

/**
 * Gets the positions of the 80 surrounding adjacent positions
 * @param {{x: number, y: number, z: number, w: number}} pos The center position
 * @returns {{x: number, y: number, z: number, w: number}[]} The surrounding positions
 */
const getSurrounding4D = (pos) => {
  // Find surrounding
  let surrounding = [];
  // Current W
  // Current Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z, w: pos.w}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z, w: pos.w});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z, w: pos.w}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z, w: pos.w});   // left
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z, w: pos.w});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z, w: pos.w}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z, w: pos.w});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z, w: pos.w}); // down right

  // Lower Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z-1, w: pos.w}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z-1, w: pos.w});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z-1, w: pos.w}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z-1, w: pos.w});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z-1, w: pos.w});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z-1, w: pos.w});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z-1, w: pos.w}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z-1, w: pos.w});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z-1, w: pos.w}); // down right

  // Upper Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z+1, w: pos.w}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z+1, w: pos.w});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z+1, w: pos.w}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z+1, w: pos.w});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z+1, w: pos.w});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z+1, w: pos.w});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z+1, w: pos.w}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z+1, w: pos.w});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z+1, w: pos.w}); // down right

  // Lower W
  // Current Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z, w: pos.w-1}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z, w: pos.w-1});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z, w: pos.w-1}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z, w: pos.w-1});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z, w: pos.w-1});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z, w: pos.w-1});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z, w: pos.w-1}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z, w: pos.w-1});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z, w: pos.w-1}); // down right

  // Lower Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z-1, w: pos.w-1}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z-1, w: pos.w-1});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z-1, w: pos.w-1}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z-1, w: pos.w-1});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z-1, w: pos.w-1});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z-1, w: pos.w-1});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z-1, w: pos.w-1}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z-1, w: pos.w-1});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z-1, w: pos.w-1}); // down right

  // Upper Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z+1, w: pos.w-1}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z+1, w: pos.w-1});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z+1, w: pos.w-1}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z+1, w: pos.w-1});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z+1, w: pos.w-1});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z+1, w: pos.w-1});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z+1, w: pos.w-1}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z+1, w: pos.w-1});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z+1, w: pos.w-1}); // down right

  // Upper W
  // Current Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z, w: pos.w+1}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z, w: pos.w+1});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z, w: pos.w+1}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z, w: pos.w+1});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z, w: pos.w+1});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z, w: pos.w+1});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z, w: pos.w+1}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z, w: pos.w+1});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z, w: pos.w+1}); // down right

  // Lower Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z-1, w: pos.w+1}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z-1, w: pos.w+1});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z-1, w: pos.w+1}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z-1, w: pos.w+1});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z-1, w: pos.w+1});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z-1, w: pos.w+1});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z-1, w: pos.w+1}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z-1, w: pos.w+1});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z-1, w: pos.w+1}); // down right

  // Upper Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z+1, w: pos.w+1}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z+1, w: pos.w+1});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z+1, w: pos.w+1}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z+1, w: pos.w+1});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z+1, w: pos.w+1});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z+1, w: pos.w+1});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z+1, w: pos.w+1}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z+1, w: pos.w+1});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z+1, w: pos.w+1}); // down right

  return surrounding;
}

/**
 * Gets the positions of the 26 surrounding adjacent positions
 * @param {{x: number, y: number, z: number}} pos The center position
 * @returns {{x: number, y: number, z: number}[]} The surrounding positions
 */
const getSurrounding3D = (pos) => {
  // Find surrounding
  let surrounding = [];
  // Current Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z});   // left
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z}); // down right

  // Lower Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z-1}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z-1});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z-1}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z-1});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z-1});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z-1});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z-1}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z-1});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z-1}); // down right

  // Upper Z
  surrounding.push({x: pos.x-1, y: pos.y-1, z: pos.z+1}); // up left
  surrounding.push({x: pos.x, y: pos.y-1, z: pos.z+1});   // up center
  surrounding.push({x: pos.x+1, y: pos.y-1, z: pos.z+1}); // up right
  surrounding.push({x: pos.x-1, y: pos.y, z: pos.z+1});   // left
  surrounding.push({x: pos.x, y: pos.y, z: pos.z+1});     // center
  surrounding.push({x: pos.x+1, y: pos.y, z: pos.z+1});   // right
  surrounding.push({x: pos.x-1, y: pos.y+1, z: pos.z+1}); // down left
  surrounding.push({x: pos.x, y: pos.y+1, z: pos.z+1});   // down center
  surrounding.push({x: pos.x+1, y: pos.y+1, z: pos.z+1}); // down right

  return surrounding;
}