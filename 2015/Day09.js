// Puzzle for Day 9: https://adventofcode.com/2015/day/9

export const run = (fileContents) => {

  // Parse the input file to build an undirected weighted graph
  let graph = parseInput(fileContents);

  // Starting at each node find all of the distances for each path combination that touches each node.
  let results = [];
  for(const node of graph.nodes){
    results.push(graph.distancesToVisitAllNodes(node, 0, [node]));
  }
  // Flatten the results into a single array of all of the total diatances
  results = results.flat();

  // Find the minimum distance
  let min = Infinity;
  for(const result of results){
    min = Math.min(min, result);
  }

  // Find the maximum distance
  let max = 0;
  for(const result of results){
    max = Math.max(max, result);
  }

  return {part1: min, part2: max};
}

// Parse the input
const parseInput = (fileContents) => {
  // Regex to parse each line of the file and a results graph that will be the output
  let reg = new RegExp(/([a-zA-Z]+) to ([a-zA-Z]+) = (\d+)/);
  let graph = new Graph();

  // Read each line
  for(const line of fileContents){
    // Use regex to get the important information
    let matches = line.match(reg);

    // If the first node mentioned is not in the graph add it
    if(graph.nodes.indexOf(matches[1]) === -1)
      graph.addNode(matches[1]);
    // If the second node mentioned is not in the graph add it
    if(graph.nodes.indexOf(matches[2]) === -1)
      graph.addNode(matches[2]);
    // Add the edge weight connecting both nodes
    graph.addEdge(matches[1], matches[2], parseInt(matches[3]));
  }

  return graph;
}

// A weighted graph that will be used find all possible paths that touch all nodes in the graph
class Graph {
  constructor(){
    this.nodes = [];
    this.edges = {};
  }

  // Add a node to the array
  addNode(node){
    this.nodes.push(node);
    this.edges[node] = [];
  }

  // Add and edge to the array
  addEdge(from, to, weight){
    this.edges[from].push({node: to, weight: weight});
    this.edges[to].push({node: from, weight: weight});
  }

  // Depth first search (DFS) to find all paths that touch every node in the graph 
  // given the current node, total cost so far, and the list of nodes already visited.
  distancesToVisitAllNodes(current, totalCost, visited){
    // Check the base case that all node have been visted. If so return the total cost back up the call stack
    if(visited.length === this.nodes.length)
      return totalCost;

    // Find all next poossible moves based on the graphs connecting edges. 
    let possibleNextNodes = this.edges[current];

    // Iterate over all next possible connections
    let results = []
    for(let node of possibleNextNodes){
      // If the node is not in the list of already visited nodes
      if(visited.indexOf(node.node) === -1){
        // Find the new total cost by adding in the cost to visit this next node and add it to the list of visited nodes
        let newTotal = totalCost + node.weight;
        let newVisited = visited.concat([node.node]);
        // Use recusion to continue searching the graph for a base case. Push the result into the results set with the other paths
        results.push(this.distancesToVisitAllNodes(node.node, newTotal, newVisited));
      }
    }
    // Flatten all total distances into one array and return them
    return results.flat();
  }
}
