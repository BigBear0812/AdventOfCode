// Puzzle for Day 12: https://adventofcode.com/2017/day/12

export const run = (fileContents) => {
  let programs = parseInput(fileContents);

  let graph = buildGraph(programs, 0);

  let allGraphs = allGroups(programs);

  return {part1: graph.nodes.length, part2: allGraphs.length};
}

const allGroups = (programs) => {
  let graphs = [];
  while(programs.size > 0){
    let iterator = programs.keys();
    let start = iterator.next().value;
    let graph = buildGraph(programs, start);
    for(let node of graph.nodes){
      programs.delete(node);
    }
    graphs.push(graph);
  }
  return graphs;
}

const buildGraph = (programs, startProgram) => {
  let graph = new Graph();
  graph.addNode(startProgram);

  let states = [];
  states.push(startProgram);

  while(states.length > 0){
    let current = states.shift();
    let connections = programs.get(current);

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

const parseInput = (fileContents) => {
  let reg1 = new RegExp(/(\d+) <-> ([\d, ]+)/);
  let reg2 = new RegExp(/(\d+)/g);
  let programs = new Map();

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