// Solution Inspired by: https://github.com/mebeim/aoc/blob/master/2022/README.md#day-16---proboscidea-volcanium
// Puzzle for Day 16: https://adventofcode.com/2022/day/16

export const run = (fileContents) => {
  let map = part1(fileContents);
  let result2 = part2(map.input);

  return { part1: map.highest, part2: result2 };
};

const part1 = (fileContents) => {
  // Starting values
  const startValve = "AA";
  let timeLeft = 30;
  // Parse the input and get back the necessary info
  let input = parseInput(fileContents);
  // Use DFS to get back all of the possible paths a runner can take
  let results = depthFirstSearch(
    timeLeft,
    startValve,
    input.goodValves,
    input.distances,
    [],
  );

  // Find the route with the highest value
  let highest = 0;
  for (const result of results) {
    let score = scoreResult(result, input.flowRates);
    if (score > highest) highest = score;
  }

  // Pass the parsed input to Part 2
  return { input, highest };
};

const part2 = (map) => {
  // Starting values
  const startValve = "AA";
  let timeLeft = 26;
  // Use DFS to get back all of the possible paths a runner can take
  let results = depthFirstSearch(
    timeLeft,
    startValve,
    map.goodValves,
    map.distances,
    [],
  );

  // Score all paths that are returned
  let scored = [];
  for (const result of results) {
    let score = scoreResult(result, map.flowRates);
    scored.push({ result, score });
  }

  // Find the highest scoring valid set of paths by comparing them
  let highest = 0;
  for (const a of scored) {
    for (const b of scored) {
      // Paths cannot contain any of the same valve.
      // This means that the array cannot intersect at all.
      let intersect = arraysIntersect(a.result, b.result);
      if (intersect === false) {
        // If they do not intersect sum their scores and see if it is the highest found so far
        let s = a.score + b.score;
        if (s > highest) {
          highest = s;
        }
      }
    }
  }

  return highest;
};

// Check if to arrays have any values in common
const arraysIntersect = (arrayA, arrayB) => {
  for (const a of arrayA) {
    for (const b of arrayB) {
      if (a.valve === b.valve) return true;
    }
  }
  return false;
};

// Score a given path by multiplying it's each valves
// flow rate by the legnth of time it has been on.
const scoreResult = (chosen, rates) => {
  let total = 0;
  for (const choice of chosen) {
    total += choice.time * rates[choice.valve];
  }
  return total;
};

// A depth first search (DFS) implementation to find all possible paths
const depthFirstSearch = (timeLeft, current, valves, distances, chosen) => {
  // Check our base case if we have run out of valves to visit or don't
  // have enough time to viist another one then return
  if (valves.length === 0 || timeLeft <= 2) {
    return [chosen];
  }

  // Continue computing all fo the next possibilities
  let results = [];
  for (const valve of valves) {
    // Calc new time remaining, create a new choices array with
    // this valve included and filter it from our valves array
    let time = timeLeft - (distances[current][valve] + 1);
    let choices = chosen.concat({ valve, time });
    let remaining = valves.filter((v) => v !== valve);
    // Add this result to the results. In this case results that
    // do not reach the bottom fo the DFS tree are still valid
    results.push([choices]);
    // Recurse into the next level of the DFS tree
    let result = depthFirstSearch(time, valve, remaining, distances, choices);
    results.push(result);
  }
  // Flatten results to get all of the results in a single array
  return results.flat();
};

// Parse the input. Create a weighted graph of the input results
// and compute the shortest distance from every valve to every
// other valve using the Floyd-Warshall Algorithm
const parseInput = (fileContent) => {
  // Use regex to parse in all of the results to an array of object containing the critical info
  const reg = new RegExp(
    /Valve ([A-Z][A-Z]) has flow rate=(\d+); tunnels* leads* to valves* ([A-Z, ]*)+/,
  );
  let valves = [];
  for (const line of fileContent) {
    const matches = line.match(reg);
    const name = matches[1];
    const flowRate = parseInt(matches[2]);
    const neighbors = matches[3].split(", ");
    valves.push({ name, flowRate, neighbors });
  }

  // Create a graph and other output vairables
  let graph = new Graph();
  let flowRates = {};
  // Return only valves that have a a flow rate greater than 0 since they do not work
  let goodValves = valves.filter((v) => v.flowRate > 0).map((v) => v.name);
  // Add all valves to the graph and add the flow rate info to it's array
  valves.forEach((v) => {
    graph.addNode(v.name);
    flowRates[v.name] = v.flowRate;
  });
  // Add Edges that connect each valve to it's neighbors. Each connection takes 1 minute
  valves.forEach((v) =>
    v.neighbors.forEach((n) => graph.addEdge(v.name, n, 1)),
  );

  // Compute the shortrest distance from every ndde to every other node
  let distances = graph.floydWarshallAlgorithm();

  return { distances, flowRates, goodValves };
};

// A weighted graph that will be used to run through the Floyd-Warshall Algorithm
class Graph {
  constructor() {
    this.nodes = [];
    this.edges = {};
  }

  // Add a node to the array
  addNode(node) {
    this.nodes.push(node);
    this.edges[node] = [];
  }

  // Add and edge to the array. Do not include reverse connections since the data already has them
  addEdge(from, to, weight) {
    this.edges[from].push({ node: to, weight: weight });
  }

  // Credit: https://www.tutorialspoint.com/The-Floyd-Warshall-algorithm-in-Javascript
  floydWarshallAlgorithm() {
    let dist = {};
    for (let i = 0; i < this.nodes.length; i++) {
      dist[this.nodes[i]] = {};
      // For existing edges assign the dist to be same as weight
      this.edges[this.nodes[i]].forEach(
        (e) => (dist[this.nodes[i]][e.node] = e.weight),
      );
      this.nodes.forEach((n) => {
        // For all other nodes assign it to infinity
        if (dist[this.nodes[i]][n] == undefined)
          dist[this.nodes[i]][n] = Infinity;
        // For self edge assign dist to be 0
        if (this.nodes[i] === n) dist[this.nodes[i]][n] = 0;
      });
    }
    this.nodes.forEach((i) => {
      this.nodes.forEach((j) => {
        this.nodes.forEach((k) => {
          // Check if going from i to k then from k to j is better
          // than directly going from i to j. If yes then update
          // i to j value to the new value
          if (dist[i][k] + dist[k][j] < dist[i][j])
            dist[i][j] = dist[i][k] + dist[k][j];
        });
      });
    });
    return dist;
  }
}
