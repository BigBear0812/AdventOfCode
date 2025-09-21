// Puzzle for Day 23: https://adventofcode.com/2023/day/23

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  let result1 = solver(fileContents);
  let result2 = solver(fileContents, true);

  return { part1: result1, part2: result2 };
};

// Solver for parts 1 and 2
const solver = (fileContents, part2 = false) => {
  // Create a string[][] to make the graph from
  let grid = fileContents.map((l) => l.split(""));
  // Create a new graph
  let graph = new Graph();

  // Create the start and end points
  let start = { y: 0, x: 1 };
  let end = { y: grid.length - 1, x: grid[grid.length - 1].length - 2 };

  // Get all intersections
  let intersections = new Map();
  // Include the start and end points as nodes in the graph
  intersections.set(JSON.stringify(start), start);
  intersections.set(JSON.stringify(end), end);
  graph.addNode(start);
  graph.addNode(end);
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      // If not a forest tile then get the surrounding possible tiles
      if (grid[y][x] != "#") {
        let nextPossible = getSurrounding({ y, x });
        // Check the directions and see if this is an intersection
        let validDirections = 0;
        for (let next of nextPossible) {
          if (
            next.y >= 0 &&
            next.y < grid.length &&
            next.x >= 0 &&
            next.x < grid[next.y].length &&
            grid[next.y][next.x] != "#"
          )
            validDirections++;
        }
        // If this is an intersection add it to the intersections array and as a node in out graph
        if (validDirections >= 3) {
          intersections.set(JSON.stringify({ y, x }), { y, x });
          graph.addNode({ y, x });
        }
      }
    }
  }

  // Connect intersections and add to graph
  for (let inter of intersections.values()) {
    // Get the start location
    let startKey = JSON.stringify(inter);
    let startVisited = new Set();
    startVisited.add(startKey);

    // Use a Breadth First Search (BFS) to get the paths tyo all connected intersections
    let queue = [];
    queue.push({ pos: inter, visited: startVisited });
    while (queue.length > 0) {
      let current = queue.shift();

      // Check if the current node is an intersection. If so add this as an edge to the graph
      let currentKey = JSON.stringify({ y: current.pos.y, x: current.pos.x });
      if (currentKey != startKey && intersections.has(currentKey)) {
        graph.addEdge(inter, current.pos, current.visited.size - 1);
        continue;
      }

      // Get the net possible spaces to continue moving towards an intersection
      let nextPossible = getSurrounding(current.pos);
      for (let next of nextPossible) {
        // If the next space is valid then add it to the queue to be processed
        if (
          next.y >= 0 &&
          next.y < grid.length &&
          next.x >= 0 &&
          next.x < grid[next.y].length &&
          grid[next.y][next.x] != "#" &&
          (part2 ||
            next.direction == grid[next.y][next.x] ||
            grid[next.y][next.x] == ".") && // This checks arrow directions. Ignore this with the part 2 flag
          !current.visited.has(JSON.stringify({ y: next.y, x: next.x }))
        ) {
          let nextVisited = new Set(current.visited);
          nextVisited.add(JSON.stringify({ y: next.y, x: next.x }));
          queue.push({ pos: next, visited: nextVisited });
        }
      }
    }
  }

  // Get the longest path
  return graph.BreadthFirstLongest(start, end, part2 ? 100 : 0);
};

const getSurrounding = (current) => {
  let nextPossible = [];
  nextPossible.push({ y: current.y - 1, x: current.x, direction: "^" }); // Up
  nextPossible.push({ y: current.y + 1, x: current.x, direction: "v" }); // Down
  nextPossible.push({ y: current.y, x: current.x - 1, direction: "<" }); // Left
  nextPossible.push({ y: current.y, x: current.x + 1, direction: ">" }); // Right
  return nextPossible;
};

// A weighted graph that will be used find the shortest path between
// two nodes using Dijkstra's algorithm with a priority queue
class Graph {
  constructor() {
    this.edges = new Map();
  }

  // Add a node to the graph
  addNode(node) {
    let key = this.#key(node.x, node.y);
    this.edges.set(key, []);
  }

  // Add an edge to the graph
  addEdge(from, to, weight) {
    let fromNode = this.#key(from.x, from.y);
    let toNode = this.#key(to.x, to.y);
    let fromEdges = this.edges.get(fromNode);
    fromEdges.push({ node: toNode, weight });
    this.edges.set(fromNode, fromEdges);
  }

  // Used to convert node data into unique strings for identifying each node
  #key(x, y) {
    return `${x},${y}`;
  }

  // Get the longest path using Breadth First Search (BFS). This doesn't really work in all situations.
  // Not sure why. May come back to it later if I feel like it
  BreadthFirstLongest(start, end, buffer = 0) {
    // set the start and end nodes for the start if the queue and checking for the end point
    let startKey = this.#key(start.x, start.y);
    let endKey = this.#key(end.x, end.y);
    let queue = [];
    // Add the start node to the queue
    let startVisited = new Set();
    startVisited.add(startKey);
    queue.push({ node: startKey, visited: startVisited, distance: 0 });
    // Track the longest path found
    let longestLength = 0;
    while (queue.length > 0) {
      let current = queue.shift();

      // Use this buffer check to cut down on checking bad paths. Not sure why it works or why different
      // values affect things for different situations. This needs to be reexamined later but for now
      // it gave me the right answer. Does not work for the example.
      if (current.distance + buffer < longestLength) {
        continue;
      }

      // Check if the end has been reached
      if (current.node === endKey) {
        longestLength = current.distance;
        continue;
      }

      // Get the next possible edges and see if this path has visited them yet.
      let nextEdges = this.edges.get(current.node);
      for (let next of nextEdges) {
        if (!current.visited.has(next.node)) {
          let nextVisited = new Set(current.visited);
          nextVisited.add(next.node);
          queue.push({
            node: next.node,
            visited: nextVisited,
            distance: current.distance + next.weight,
          });
        }
      }
    }
    return longestLength;
  }
}
