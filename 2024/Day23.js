// Puzzle for Day 23: https://adventofcode.com/2024/day/23

export const run = (fileContents) => {
  // Parse the input into a from and to node array from a string array
  let connections = fileContents.map(line => {
    let splits = line.split('-');
    return {from: splits[0], to: splits[1]};
  });
  // Solve both parts
  let result = solver(connections);
  return {part1: result.result1, part2: result.result2};
}

/**
 * Solve both parts of the puzzle
 * @param {{from: string, to: string}[]} connections The connections form the input file as parsed objects
 * @returns {result1, number, result2: string} The results for each part of the puzzle
 */
const solver = (connections) => {
  // Create a graph for storing the connections
  let graph = new Graph();

  // Populate the graph
  for(let connection of connections){
    // Add each node if it has not already been added
    if(!graph.hasNode(connection.from))
      graph.addNode(connection.from);
    if(!graph.hasNode(connection.to))
      graph.addNode(connection.to);
    // Add the edge for this connection
    graph.addEdge(connection.from, connection.to);
  }

  // Find all 3 computer groups
  let groups = Array.from(graph.findAllThreeComputerGroups()).sort();
  // Filter the results for part 1 ot get just the groups that 
  // have a computer name that starts with t
  let result1 =  groups.filter(group => group.match(/"t/)).length;

  // Get all of the node in the graph  
  let nodes = graph.getAllNodes();
  // Create a map for storing the nodes into array based on the number of times 
  // they show up in the any of groups
  let nodeGroupCount = new Map();
  // Track the highest node group count value
  let highestGroupCount = 0;
  // Check each node
  for(let node of nodes){
    // The number of times this node shows up in all of the groups
    let count = 0;
    // Check each group. If it includes this node add to the count
    for(let group of groups){
      if(group.includes(node))
        count++;
    }
    // If this count is already included in the map add it to the array 
    // of existing nodes that share this count
    if(nodeGroupCount.has(count)){
      let countNodes = nodeGroupCount.get(count);
      countNodes.push(node);
      nodeGroupCount.set(count, countNodes); 
    }
    // Else add this count with an array of just this node to the map
    else
      nodeGroupCount.set(count, [node]);

    // If the current count is higher then the highest count update the highest count
    if(count > highestGroupCount)
      highestGroupCount = count;
  }
  // Get the map entry for the highest count. Sort the array alphabetically and 
  // join the values with commas into a string.
  let result2 = nodeGroupCount.get(highestGroupCount).sort().join(',');
  return {result1, result2};
}

/**
 * A graph for keeping track of all of the computer connections
 */
class Graph {
  constructor(){
    this.edges = {};
  }

  /**
   * Add a node to the graph
   * @param {string} node 
   */
  addNode(node){
    let key = this.#key(node);
    this.edges[key] = [];
  }

  /**
   * Determine if a given node is currently in the grid
   * @param {string} node 
   * @returns {boolean} True if the node is already in the graph
   */
  hasNode(node){
    let key = this.#key(node);
    return this.edges[key] ? true : false;
  }

  /**
   * Add an edge to the graph
   * @param {string} from Start node for the edge
   * @param {string} to End node for the edge
   * @param {boolean} reverse Reverse directions when adding opposite edge
   */
  addEdge(from, to, weight){
    // Get the from and to nodes
    let fromNode = this.#key(from);
    let toNode = this.#key(to);
    
    // Add the initial node
    this.edges[fromNode].push(toNode);
    // Add the opposite nodes
    this.edges[toNode].push(fromNode);
    
  }

  /**
   * Used to convert node data into unique strings for identifying each node
   * @param {string} node
   * @returns 
   */
  #key(node){
    return node;
  }

  /**
   * Find all of three computer groups 
   * @returns {string[]} The list of stringified arrays that represent each unique group
   */
  findAllThreeComputerGroups(){
    // The groups three computers found
    let groups = new Set();
    // Check each node in the graph
    for(let current in this.edges){
      // Get the neighbors for this node
      let currentNeighborNodes = this.edges[current];
      // For each neighbor
      for(let neighbor of currentNeighborNodes){
        // Get the neighbors neighbors that are not the first current node 
        // and are also neighbors with the current node
        let finalGroupNeighbors = this.edges[neighbor]
          .filter(edge => currentNeighborNodes.includes(edge) && edge != current);
        // Make sure there are final neighbors to complete the group 
        if(finalGroupNeighbors){
          // Each of these final neighbors forms a new group
          for(let final of finalGroupNeighbors){
            // Add this new group to an array, sort them to make sure each group 
            // is unique since order does not matter, Stringify them to create 
            // a unique key for the groups set.
            groups.add(JSON.stringify([current, neighbor, final].sort()));
          }
        }     
      }
    }
    return groups;
  }

  /**
   * Return all of the nodes currently in the graph
   * @returns {string[]} All nodes
   */
  getAllNodes(){
    return Object.keys(this.edges);
  }
}