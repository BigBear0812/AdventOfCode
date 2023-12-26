// Puzzle for Day 24: https://adventofcode.com/2023/day/24

export const run = (fileContents) => {
  // Create a map of the nodes and their corresponding number values
  let nodes = new Map();
  // Store and array of Edge objects for Karger's Algorithm
  let edges = [];
  for (let line of fileContents) {
    // Get the pertinent information from the line using regex
    let matches = line.match(/([a-z]+): ([a-z ]+)/);
    // The from node
    let from = matches[1];
    // The array of to nodes that this node connects to
    let toArr = matches[2].split(" ");
    // Add the from node to the map of nodes if it is not already included
    if (!nodes.has(from)) nodes.set(from, nodes.size);
    for (let to of toArr) {
      // Add the to nodes to the map of nodes if it is not already included
      if (!nodes.has(to)) nodes.set(to, nodes.size);
      // Add the edge using the mapped numbers for each node instead of the names 
      // from the input. This is due to how the implementation of this algorithm works
      edges.push(new Edge(nodes.get(from), nodes.get(to)));
    }
  }

  // Create a new graph with the specified number of nodes 
  // and edges that have been parsed in from the input
  let graph = new Graph(nodes.size, edges.length);
  graph.edge = edges;

  // Run Karger's algorithm until 3 cuts have been detected since we 
  // know that is the minimum number from the problem statement
  let result;
  for (let x = 0; x < 1000; x++) {
    result = kargerMinCut(graph);
    if (result.cutEdges == 3) break;
  }

  // The result components will be an array of each node and the group number is has been assigned.
  // Add these group numbers as properties to the groupCounts object with the values being the total 
  // number of times it comes up in the components array.
  let groupCounts = {};
  result.components.forEach((component) => {
    if (!(component in groupCounts)) groupCounts[component] = 0;
    groupCounts[component]++;
  });

  // Multiply the count of each group together
  let result1 = 1;
  for (let group in groupCounts) {
    result1 *= groupCounts[group];
  }

  return { part1: result1 };
};

/**
 * This run Karger's Min Cut Algorithm on the undirected graph of nodes. This
 * code cam from windmaomao who did an excellent implementation of this algorithm.
 *
 * Reddit: https://www.reddit.com/r/adventofcode/comments/18qbsxs/comment/kevhkgn/?utm_source=share&utm_medium=web2x&context=3
 * GitHub: https://github.com/windmaomao/adventofcode/blob/master/2023/karger.js
 * @param {Graph} graph
 * @returns
 */
class Edge {
  constructor(s, d) {
    this.src = s;
    this.dest = d;
  }
}

class Graph {
  constructor(v, e) {
    this.V = v;
    this.E = e;
    this.edge = [];
  }
}

class subset {
  constructor(p, r) {
    this.parent = p;
    this.rank = r;
  }
}

function kargerMinCut(graph) {
  let V = graph.V;
  let E = graph.E;
  let edge = graph.edge;

  let subsets = [];

  for (let v = 0; v < V; v++) {
    subsets[v] = new subset(v, 0);
  }

  let vertices = V;

  while (vertices > 2) {
    let i = Math.floor(Math.random() * (E - 1));

    let subset1 = find(subsets, edge[i].src);
    let subset2 = find(subsets, edge[i].dest);

    if (subset1 === subset2) {
      continue;
    } else {
      //console.log("Contracting edge " + edge[i].src + "-" + edge[i].dest);
      vertices--;
      Union(subsets, subset1, subset2);
    }
  }

  let cutEdges = 0;
  for (let i = 0; i < E; i++) {
    let subset1 = find(subsets, edge[i].src);
    let subset2 = find(subsets, edge[i].dest);
    if (subset1 !== subset2) {
      cutEdges++;
    }
  }

  const components = new Array(V).fill(0).map((_, i) => find(subsets, i));

  return { cutEdges, components };
}

function find(subsets, i) {
  if (subsets[i].parent !== i) {
    subsets[i].parent = find(subsets, subsets[i].parent);
  }
  return subsets[i].parent;
}

function Union(subsets, x, y) {
  let xRoot = find(subsets, x);
  let yRoot = find(subsets, y);

  if (subsets[xRoot].rank < subsets[yRoot].rank) {
    subsets[xRoot].parent = yRoot;
  } else if (subsets[xRoot].rank > subsets[yRoot].rank) {
    subsets[yRoot].parent = xRoot;
  } else {
    subsets[yRoot].parent = xRoot;
    subsets[xRoot].rank++;
  }
}
