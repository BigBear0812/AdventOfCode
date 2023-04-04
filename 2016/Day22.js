// Puzzle for Day 22: https://adventofcode.com/2016/day/22

export const run = (fileContents) => {
  // The node info
  let nodes = parseInput(fileContents);

  // The number of viable pairs
  let pairsCount = countPairs(nodes);

  // Log output
  console.log("Part 1:", pairsCount);

  // The number of moves to get the goal data to the (0,0) node
  let numMoves = findNumMoves(nodes);

  // Log output
  console.log("Part 2:", numMoves);
}

// Find the number of moves to get the goal data to the (0,0) node

// This solution is specific to the way this data is arranged. This 
// was found by printing out the node grid as descirbed in the 
// example for part 2 and discovering that all data represented as . 
// was essentially interchangeable. Data represented by # was arranged 
// as a wall of imovable data that would have to be avoided. There was 
// also only one empty disk to move data around with. This meant that 
// the calculation was just the manhattan distance to move the empty 
// disk around the wall and to the (goal.x - 1, 0) location. Then move 
// the disk across the top row to the (0,0) node. Each move would take 
// 5 steps plus one more for the final move to the (0,0) terminal.
const findNumMoves = (nodes) => {
  let emptyNode;
  let goalDataX = 0;
  let nodeGrid = [];
  let wallNodes = [];

  // Find the empty node, the goal data X value, create a node grid, and find the wall to go around
  for(let node of nodes){
    // If this node is empty then it is our disk used to move data around
    if(node.used === 0){
      emptyNode = {x: node.x, y: node.y};
    }
    // The x value of the goal data since we know it is in the 0th (meaning = 0) row
    if(goalDataX < node.x){
      goalDataX = node.x;
    }
    // Create the node grid row if it has not alreayd been created
    if(!nodeGrid[node.y]){
      nodeGrid[node.y] = [];
    }
    // Add the node to the grid
    nodeGrid[node.y][node.x] = node;
    // If this node is part of the wall add it to the list of wall nodes
    if(node.size > 100 && (node.used / node.size) * 100 >= 75){
      wallNodes.push(node);
    }
  }

  // Find the end of the walland which row the wall is on
  let lowestWallX = Number.MAX_SAFE_INTEGER;
  let hightestWallX = Number.MIN_SAFE_INTEGER;
  let wallY = wallNodes[0].y;
  for(let node of wallNodes){
    if (node.x > hightestWallX)
      hightestWallX = node.x;
    if (node.x < lowestWallX)
      lowestWallX = node.x
  }

  // Find out which end of the wall is on the grid
  let wallEndX;
  if(hightestWallX + 1 >= goalDataX)
    wallEndX = hightestWallX + 1;
  if(lowestWallX - 1 > 0)
    wallEndX = lowestWallX - 1;

  // Create coordinates for the end of the wal to go around 
  // and the spot to move to before the goal data
  let wallEnd = {x: wallEndX, y: wallY};
  let beforeGoal = {x: goalDataX - 1, y: 0};

  // Calculate the distance from ths start to the end of the wall
  let wallEndDistance = distance(emptyNode, wallEnd);
  // Calculate the distance from the end of the wall to the 
  // space before the goal data
  let wallEndToGoalDistance = distance(wallEnd, beforeGoal);
  // Calculate the number of moves to shift all of 
  // the data across the top row to the (0,0) node
  let moveGoalToStart = (5 * beforeGoal.x) + 1;

  // Add these together to get the total number of moves
  return wallEndDistance + wallEndToGoalDistance + moveGoalToStart;
}

// Manhattan distance calculation
const distance = (a, b) => {
  let xDist = Math.abs(a.x - b.x);
  let yDist = Math.abs(a.y - b.y);
  return xDist + yDist;
}

// Used for printing the grid to discover the patterns in 
// the data used to solve this problem
const printGrid = (nodeGrid) => {
  for(let y = 0; y < nodeGrid.length; y++){
    let line = '';
    for(let x = 0; x < nodeGrid[y].length; x++){
      let node = nodeGrid[y][x];
      let char = '.';
      if(node.size > 100 && (node.used / node.size) * 100 >= 75)
        char = '#';
      else if (node.used === 0)
        char = '_';
      line += char;
    }
    console.log(line);
  }
}

// Count the number of viable pairs for Part 1
const countPairs = (nodes) => {
  let count = 0;

  // Check every node against every other node
  for(let a of nodes){
    for(let b of nodes){
      // If not empty, if not the same node twice, and b can fit a's data
      if (a.used > 0 && a != b && a.used <= b.avail){
        count++;
      }
    }
  }

  return count;
}

// Parse the input fill node info into an array of node objects
const parseInput = (fileContents) => {
  // The regex for parsing each line
  let reg = new RegExp(/\/dev\/grid\/node-x(\d+)-y(\d+) +(\d+)T +(\d+)T +(\d+)T +(\d+)%/);
  // The resulting node data
  let nodes = [];

  // Parse each line into a node if it contains node data
  for(let line of fileContents){
    let matches = line.match(reg);

    if(matches){
      nodes.push({
        x: parseInt(matches[1]),
        y: parseInt(matches[2]),
        size: parseInt(matches[3]),
        used: parseInt(matches[4]),
        avail: parseInt(matches[5]),
        percentUsed: parseInt(matches[6])
      });
    }
  }

  return nodes;
}