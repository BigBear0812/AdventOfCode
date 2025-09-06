// Puzzle for Day 20: https://adventofcode.com/2018/day/20

export const run = (fileContents) => {
  // The directions instructions will be in the first
  let directions = fileContents[0].split("");

  // Create the maze as a hash map with the minimum number
  // of steps that it takes to reach each location visited
  let maze = createMaze(directions);

  // The furthest number of steps that can be taken to reach a location
  let furthest = 0;
  // The number of locations that take 1000 or more setps to reach
  let overOneThousand = 0;
  maze.forEach((x) => {
    // Find if this value is the furthest
    furthest = Math.max(x, furthest);
    // If this position took 1000 steps or more to reach
    if (x >= 1000) overOneThousand++;
  });

  return { part1: furthest, part2: overOneThousand };
};

// Create the maze as a hash map of the positions and the
// least number of steps it takes to reach each one
const createMaze = (directions) => {
  // Maze as a hash map of positions and number of steps
  let maze = new Map();
  // Initialize with the starting position
  maze.set("0,0", 0);

  // Create a tree to keep track of where the current index
  // is at in the maze. Each branch of the tree splits at an
  // intersection and each child of a parent is a different
  // possible path for the maze to take. The tree variable
  // will always point to the current place in the tree that
  // is being updated.
  let tree = {
    parent: null,
    letters: [],
    position: { x: 0, y: 0 },
    count: 0,
    children: [],
  };

  // Go through each step of the directions excluding
  // the first and last characters
  for (let x = 1; x < directions.length - 1; x++) {
    // If this is denoting the beginning of an intersection
    if (directions[x] === "(") {
      // Create a new child fo the next path with the current as it's parent
      let newChild = {
        parent: tree,
        letters: [],
        position: JSON.parse(JSON.stringify(tree.position)),
        count: tree.count,
        children: [],
      };
      // Add the new child to the curent parent's list of children
      tree.children.push(newChild);
      // Set this new child as the current tree node
      tree = newChild;
    }
    // If this is denoting the end of this intersection
    else if (directions[x] === ")") {
      // Since there are no more child paths to go down move back up a level to the parent
      tree = tree.parent;
    }
    // If this denotes a new branch for this intersection
    else if (directions[x] === "|") {
      // Create a new child node that will be the sibling of the current one.
      let newChild = {
        parent: tree.parent,
        letters: [],
        position: JSON.parse(JSON.stringify(tree.parent.position)),
        count: tree.parent.count,
        children: [],
      };
      // Add the new child as a sibling to the current one
      tree.parent.children.push(newChild);
      // Set the new child to the current tree node
      tree = newChild;
    }
    // Else this is a directional character
    else {
      // Update the position value based on the direction
      switch (directions[x]) {
        case "N":
          tree.position.x--;
          break;
        case "E":
          tree.position.y++;
          break;
        case "S":
          tree.position.x++;
          break;
        case "W":
          tree.position.y--;
      }
      // Update the step count
      tree.count++;
      // Get the current position ley to update the map
      let posStr = `${tree.position.x},${tree.position.y}`;
      // If this is not yet in the map or if it is lower than the
      // map's current value for this position then update it
      // with the current step count
      if (!maze.has(posStr) || maze.get(posStr) > tree.count) {
        maze.set(posStr, tree.count);
      }
      // Add the directional letter to the curent node's set of letter to reach this position
      tree.letters.push(directions[x]);
    }
  }

  return maze;
};
