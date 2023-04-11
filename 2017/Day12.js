// Puzzle for Day 12: https://adventofcode.com/2017/day/12

export const run = (fileContents) => {
  // Parse the input into a map of all programs and what they are connected to
  let programs = parseInput(fileContents);

  // Build a graph of all programs connected to program 0 
  let graph = buildGraph(programs, 0);

  // Build all possible graphs
  let allGraphs = allGroups(programs);

  return {part1: graph.nodes.length, part2: allGraphs.length};
}

// Build all possible graphs
const allGroups = (programs) => {
  // All of the graphs
  let graphs = [];
  // Continue while there are still programs left in the map
  while(programs.size > 0){
    // Get the first key from the programs map
    let iterator = programs.keys();
    let start = iterator.next().value;
    // Build the graph based on the key that was found as the starting point
    let graph = buildGraph(programs, start);
    // For each node in the graph delete that node from the programs that 
    // are left in the map before repeating the process
    for(let node of graph.nodes){
      programs.delete(node);
    }
    // Add the new graph to the set of all graphs
    graphs.push(graph);
  }
  return graphs;
}

// Build a graph based on a given starting point using a breadth first search (BFS) algorithm
const buildGraph = (programs, startProgram) => {
  // Create the graph and add the starting node
  let graph = new Graph();
  graph.addNode(startProgram);

  // Create a state array anda starting state with the starting program id
  let states = [];
  states.push(startProgram);

  // Continue while there are still next states to process
  while(states.length > 0){
    // Get the current state
    let current = states.shift();
    // Get the connections for this program
    let connections = programs.get(current);

    // Check if each connection has already been added to the graph. If not then it, 
    // a connecting edge, and the next state to check this nodes connections
    for(let connect of connections){
      if(graph.nodes.indexOf(connect) === -1){
        graph.addNode(connect);
        graph.addEdge(current, connect, 1);
        states.push(connect);
      }
    }
  }

  return graph;
}

// Parse the input into a map of programs and which other programs they are connected to.
const parseInput = (fileContents) => {
  // Regex to get the first program id and the string of the program ids it is connected to
  let reg1 = new RegExp(/(\d+) <-> ([\d, ]+)/);
  // Regex to get all of the program id's this program is connected to in an array
  let reg2 = new RegExp(/(\d+)/g);
  // Resulting program map
  let programs = new Map();

  // Parse each line into a new program map object
  for(let line of fileContents){
    let matches1 = line.match(reg1);
    let matches2 = matches1[2].match(reg2);

    programs.set(parseInt(matches1[1]), 
      matches2.map(x => parseInt(x)));
  }

  return programs;
}

// A weighted graph
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

  // Add and edge to the array. Do not include reverse connections since the data already has them
  addEdge(from, to, weight){
    this.edges[from].push({ node: to, weight: weight});
  }
}