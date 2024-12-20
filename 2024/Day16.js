// Puzzle for Day 16: https://adventofcode.com/2024/day/16

const PRINT = false;

export const run = (fileContents) => {
  // Make 2D Grid
  let grid = fileContents.map(line => line.split(''));
  // Create the graph object and find the start and end points
  let data = createGraph(grid);
  // Solve each part
  let result1 = part1(data);
  let result2 = part2(grid, result1);
  return {part1: result1.shortestDistance, part2: result2};
}

/**
 * Part 2 Solution
 * @param {string[][]} grid 2D array of all grid locations
 * @param {{
 *  shortestPaths: string[][], 
 *  shortestDistance: number
 * }} result All of the shortest paths and the shortest distance from start to end nodes
 * @returns {number} The number of grid locations visited by all of the paths
 */
const part2 = (grid, result) => {
  // Parse the string array paths into data objects
  let paths = result.shortestPaths.map(path => path.map(node => {
    let splits = node.split(',');
    return{
      y: parseInt(splits[1]),
      x: parseInt(splits[0]),
      direction: splits[2]
    }
  }));

  // Track each unique location that is visited
  let visited = new Set();
  // Walk each path
  for(let path of paths){
    // Keep track of the current position. Starting at the first step
    let current = {y: path[0].y, x: path[0].x, direction: path[0].direction};
    // Add this to the visited Set
    visited.add(`${current.y},${current.x}`);
    // Make each move
    for(let m = 1; m < path.length; m++){
      // Get the next location to reach
      let next = path[m];
      // Turn the current direction to match the next positions ending direction
      current.direction = next.direction;
      // Continue visiting locations until reaching the next node
      while(current.y !== next.y || current.x !== next.x){
        if(current.direction === '^'){
          current.y--;
        }
        else if(current.direction === 'v'){
          current.y++;
        }
        else if(current.direction === '>'){
          current.x++;
        }
        else if(current.direction === '<'){
          current.x--;
        }
        // Add to the visited Set
        visited.add(`${current.y},${current.x}`);
      }
    }
  }
  // Print the grid out like the examples to commandline
  print(grid, visited);
  return visited.size;
}

/**
 * Print out the grid
 * @param {string[][]} grid 2D array of all locations in the grid
 * @param {Set<string>} visited The locations visited by the paths
 * @returns 
 */
const print = (grid, visited) => {
  // Exit if printing is turned off
  if(!PRINT)
    return;
  // Output for the console
  let output = '';
  // Traverse each location on the grid
  for(let y = 0; y < grid.length; y++){
    for(let x = 0; x < grid[y].length; x++){
      // If it has been visited then put an O
      if(visited.has(`${y},${x}`))
        output += 'O';
      // Otherwise use whatever is in the grid
      else
        output += grid[y][x];
    }
    output += '\n';
  }
  console.log(output);
}

/**
 * Part 1 Solution
 * @param {{
 *  graph: Graph,
 *  start: {y: number, x: number},
 *  end: {y: number, x: number}
 * }} data The start and end points for the search. The graph of all intersections and corners in the grid
 * @returns {{
 *  shortestPaths: string[][], 
 *  shortestDistance: number
 * }} All of the shortest paths and the shortest distance from start to end nodes
 */
const part1 = (data) => {
  // Create the start node
  let start = {y: data.start.y, x: data.start.x, direction: '>'};
  // Create each option for the end node
  let end1 = {y: data.end.y, x: data.end.x, direction: '>'};
  let end2 = {y: data.end.y, x: data.end.x, direction: '^'};
  // Run Dijkstra's algorithm for each possible end state
  let result1 = data.graph.dijkstraShortestPath(start, end1);
  let result2 = data.graph.dijkstraShortestPath(start, end2);
  // Return the one with the shortest path
  return result1.shortestDistance < result2.shortestDistance ? result1 : result2;; 
}

/**
 * Create the graph and get the start and end locations
 * @param {string[][]} grid 2D array of characters representing each location in the grid 
 * @returns {{
 *  graph: Graph,
 *  start: {y: number, x: number},
 *  end: {y: number, x: number}
 * }} The start and end points for the search. The graph of all intersections and corners in the grid
 */
const createGraph = (grid) => {
  // Find start and send locations
  let start;
  let end;
  // Search grid at each space until finding the start and end locations
  for(let y = 0; y < grid.length && (!start || !end); y++){
    for(let x = 0; x < grid[y].length && (!start || !end); x++){
      // Save the start location
      if(grid[y][x] === 'S')
        start = {y, x};
      // Save the end location
      else if(grid[y][x] === 'E')
        end = {y, x};
    }
  }
  // Function for getting the next space value based on current direction
  const getNextSpace = (y, x, direction, grid) => {
    if(direction === '^')
      return {y: y-1, x: x, symbol: grid[y-1][x], direction: '^'};
    else if(direction === 'v')
      return {y: y+1, x: x, symbol: grid[y+1][x], direction: 'v'};
    else if(direction === '<')
      return {y: y, x: x-1, symbol: grid[y][x-1], direction: '<'};
    else if(direction === '>')
      return {y: y, x: x+1, symbol: grid[y][x+1], direction: '>'};
  } 
  
  // Get the available paths to the side of a given space
  const getTurnDirections = (y, x, direction, grid) => {
    // Determine the sides depending on current direction
    let sides;
    if(direction === '^' || direction === 'v'){
      sides = [
        getNextSpace(y, x, '<', grid),
        getNextSpace(y, x, '>', grid)
      ];
    }
    else if(direction === '<' || direction === '>'){
      sides = [
        getNextSpace(y, x, '^', grid),
        getNextSpace(y, x, 'v', grid)
      ];
    }
    // Filter out the walls to the sides
    return sides.filter(space => space.symbol !== '#')
  }

  // Create graph
  let graph = new Graph();
  // Track visited spaces that are part of graph edges
  let visitedSpaces = new Set();
  // Track visited intersections 
  let visitedIntersections = new Set();
  // Start at the starting position and direction
  let intersections = [{y: start.y, x: start.x}];

  // Keep going while there are still intersections to process
  while(intersections.length > 0){
    // Get the next intersection to evaluate
    let currentIntersection = intersections.shift();
    // Check if it has already been visited
    if(!visitedIntersections.has(`${currentIntersection.y},${currentIntersection.x}`))
      visitedIntersections.add(`${currentIntersection.y},${currentIntersection.x}`);
    else
      continue;
    // All possible directions
    let directions = ['^', 'v', '<', '>'];
    // Add nodes to the graph for each direction if not already added
    directions.forEach(dir => {
      let node = {y: currentIntersection.y, x: currentIntersection.x, direction: dir};
      if(!graph.hasNode(node))
        graph.addNode(node);
    });

    // Add all turn direction edges
    // Compare every direction to every other direction
    for(let a = 0; a < directions.length; a++){
      for(let b = a+1; b < directions.length; b++){
        // Get the directions and the standard weight for the turn
        let aDir = directions[a];
        let bDir = directions[b];
        let weight = 1000;
        // Check if the turn is 180 degrees instead of 90. If so double the weight
        if((aDir === '^' && bDir === 'v') ||
          (aDir === 'v' && bDir === '^') || 
          (aDir === '<' && bDir === '>') || 
          (aDir === '>' && bDir === '<')){
          weight = 2000;
        }
        // Create the from and to nodes and add this edge to the graph
        let from = {y: currentIntersection.y, x: currentIntersection.x, direction: aDir};
        let to = {y: currentIntersection.y, x: currentIntersection.x, direction: bDir};
        graph.addEdge(from,to, weight);
      }
    }

    // Add all of the move between location edges
    for(let dir of directions){
      // Store a next intersection found if one is found
      let nextIntersection;
      // Get the space that is one step in the current direction
      let currentSpace = getNextSpace(currentIntersection.y, currentIntersection.x, dir, grid);
      // Check if this space has been visited. If it has then this edges has already been accounted for.
      if(!visitedSpaces.has(`${currentSpace.y},${currentSpace.x}`))
        visitedSpaces.add(`${currentSpace.y},${currentSpace.x}`);
      else
        continue;
      // Continue moving this this direction until a dead end, 
      // corner, or intersection is found
      let score = 0;
      while(!nextIntersection){
        // Dead End. If found break out
        if(currentSpace.symbol === '#'){
          break;
        }
        // Get the number of side possible directions to go there are
        let sideDirections = getTurnDirections(currentSpace.y, currentSpace.x, currentSpace.direction, grid);
        // Add one to the score for the current space
        score += 1;
        // Straight Ahead no side exits keep moving ahead
        if(sideDirections.length == 0){
          // Set current space to the next space ahead
          currentSpace = getNextSpace(currentSpace.y, currentSpace.x, currentSpace.direction, grid);
          // Add this next space to the visited spaces
          visitedSpaces.add(`${currentSpace.y},${currentSpace.x}`);
        }
        // Found intersection or corner. Time to stop and make an edge
        else{
          // The new intersection is at this current space
          let newIntersection = {y: currentSpace.y, x: currentSpace.x};
          // Add it to the array of intersections to be processed
          intersections.push(newIntersection);
          // Create from and to nodes from the intersection started and until this new intersection
          let from = {y: currentIntersection.y, x: currentIntersection.x, direction: dir};
          let to = {y: newIntersection.y, x: newIntersection.x, direction: dir};
          // Create a graph node only if necessary
          if(!graph.hasNode(to))
            graph.addNode(to);
          // Add the edge and make sure to reverse the direction for the opposite edge
          graph.addEdge(from, to, score, true);
          break;
        }
      }
    }
  }

  return {start, end, graph};
}

/**
 * A weighted graph that will be used find the all of the shortest paths between
 * two nodes using Dijkstra's algorithm with a priority queue
 */
class Graph {
  constructor(){
    this.edges = {};
  }

  /**
   * Give the reverse direction
   * @param {string} dir Current direction
   * @returns {string} Reverse direction
   */
  #reverseDirection = (dir) => {
    if(dir === '^')
      return 'v';
    else if(dir === 'v')
      return 'v';
    else if(dir === '<')
      return '>';
    else if(dir === '>')
      return '<';
  }

  /**
   * Add a node to the graph
   * @param {{y: number, x: number, direction: string}} node 
   */
  addNode(node){
    let key = this.#key(node.x, node.y, node.direction);
    this.edges[key] = [];
  }

  /**
   * Determine if a given node is currently in the grid
   * @param {{y: number, x: number, direction: string}} node 
   * @returns {boolean} True if the node is already in the graph
   */
  hasNode(node){
    let key = this.#key(node.x, node.y, node.direction);
    return this.edges[key] ? true : false;
  }

  /**
   * Add an edge to the graph
   * @param {{y: number, x: number, direction: string}} from Start node for the edge
   * @param {{y: number, x: number, direction: string}} to End node for the edge
   * @param {number} weight Edge weight
   * @param {boolean} reverse Reverse directions when adding opposite edge
   */
  addEdge(from, to, weight, reverse){
    // Get the from and to nodes
    let fromNode = this.#key(from.x, from.y, from.direction);
    let toNode = this.#key(to.x, to.y, to.direction);
    
    // Add the initial node
    this.edges[fromNode].push({node: toNode, weight: weight});
    // If being asked to reverse direction
    if(reverse){
      // Create reverse direction nodes for the from and to nodes
      let reverseFromNode = this.#key(from.x, from.y, this.#reverseDirection(from.direction));
      let reverseToNode = this.#key(to.x, to.y, this.#reverseDirection(to.direction));
      // If those nodes do not exist create them
      if(!this.edges[reverseFromNode])
        this.edges[reverseFromNode] = [];
      if(!this.edges[reverseToNode])
        this.edges[reverseToNode] = [];
      // Add opposite reversed nodes
      this.edges[reverseToNode].push({node: reverseFromNode, weight: weight});
    }
    else{
      // Otherwise add the opposite nodes
      this.edges[toNode].push({node: fromNode, weight: weight});
    }
  }

  /**
   * Used to convert node data into unique strings for identifying each node
   * @param {number} x 
   * @param {number} y 
   * @param {string} direction 
   * @returns 
   */
  #key(x, y, direction){
    return `${x},${y},${direction}`;
  }

  /**
   * Compute all of the shortest paths between two points using 
   * Dijkstra's algorithm with a priority queue
   * @param {{y: number, x: number, direction: string}} start The start node
   * @param {{y: number, x: number, direction: string}} end The end node
   * @returns {{
   *  shortestPaths: string[][], 
   *  shortestDistance: number
   * }} All of the shortest paths and the shortest distance from start to end nodes
   */
  dijkstraShortestPath(start, end){
    // The unique strings for the start and end nodes from their data objects
    let startNode = this.#key(start.x, start.y, start.direction);
    let endNode = this.#key(end.x, end.y, end.direction);
    // Priority queue to hold the next possible nodes to visit
    const unvisited = new PriorityQueue();
    // Hash object storing shortest distance to each point
    const distances = new Map();
    
    // The move to make with the smallest cost
    let smallest;

    // Populate the starting state
    for (let node in this.edges) {
      // For the starting node add it to the unvisited 
      // priority queue and set the distance to it to 0 
      if (node === startNode) {
        distances.set(node, 0);
        unvisited.add(node, 0, [node]);
      }
      // Otherwise set the distance to infinity since it has not been calculated yet
      else {
        distances.set(node, Infinity);
      }
      // Set every nodes parent to null
      // parents.set(node, null);
    }

    // Track the shortest distance and the shortest paths
    let shortestDistance;
    let shortestPaths = [];
    // Continue processing while not having broken out yet by 
    // reaching the end and while there are still unvisited 
    // next nodes to process
    while (unvisited.hasNodes) {
      // Get the node with the smallest cost next
      smallest = unvisited.remove();

      // If a shortest distance has been found this nodes distance 
      // is greater then skip continuing to process it. 
      if(shortestDistance && smallest.priority > shortestDistance)
        continue;

      // If this is the end save the shortest distance and this shortest path
      if (smallest.val === endNode) {   
        shortestPaths.push(smallest.path);
        shortestDistance = smallest.priority;
        continue;
      }

      // If the distance for this smallest node is not infinity then proceed. 
      // If it is still infinity then we do not know how far it is to reach it 
      // and cannot proceed finding the distance for the neighbor nodes.
      if (distances.get(smallest.val) !== Infinity) {
        // Loop through the neighbor nodes from the graph edges
        for (let neighbor of this.edges[smallest.val]) {
          // Get the neighbor's new distance
          let neighborDist = distances.get(smallest.val) + neighbor.weight;
          // If this new distance is less than or equal to the value already 
          // stored in distance. This allows for multiple paths of the same 
          // length that reach the end
          if (neighborDist <= distances.get(neighbor.node)) {
            // Update the stored distance
            distances.set(neighbor.node, neighborDist);
            // Add this node, distance, and updated path to the queue
            unvisited.add(neighbor.node, neighborDist, [...smallest.path, neighbor.node]);
          }
        }
      }
    }

    return {shortestPaths, shortestDistance};
  }
}

/**
 * A priority queue using a min heap to keep the smallest 
 * cost node as the next to be dequeued
 */
class PriorityQueue {
  /**
   * Initialize a new empty array for the heap
   */
  constructor() {
    this.heap = [];
  }

  /**
   * Add a new item to the heap
   * @param {{y: number, x: number, direction: string}} val The node being queued
   * @param {number} priority Its weight in search
   * @param {string[]} path The path history to arrive at this node
   */
  add(val, priority, path) {
    // Create the new node for the heap
    let newNode = {val, priority, path};
    // Push the node on to the end of the heap
    this.heap.push(newNode);
    // Bubble up the node to the correct place
    this.#heapifyUp();
  }
 
  /**
   * Remove the next item from the heap. Since this is a min heap 
   * it will always be the item with the lowest priority
   * @returns {{
   *  val: {y: number, x: number, direction: string}, 
   *  priority: number, 
   *  path: string[]
   * }} The node with the lowest priority value
   */
  remove() {
    // Get the head item from the heap
    const min = this.heap[0];
    // Pop the last item off the heap
    const end = this.heap.pop();
    // If there are still nodes in the heap then 
    // add the end node to the front of the heap 
    // and heapify down the new node at the top 
    // of the heap
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.#heapifyDown();
    }
    return min;
  }

  /**
   * Return true if there are still nodes to evaluate
   * @returns {boolean} True if the queue has nodes in it
   */
  get hasNodes(){
    return this.heap.length > 0;
  }

  /**
   * Heapify up a new node to the correct place in the heap
   */
  #heapifyUp() {
    // Get the index of the new node that was just added
    let index = this.heap.length - 1;
    // Get the new node
    const current = this.heap[index];
    // Continue moving the index up the heap until it 
    // breaks out or reaches the top
    while (index > 0) {
      // Parent index
      let parentIndex = Math.floor((index - 1) / 2);
      // Parent element
      let parent = this.heap[parentIndex];
      // If the current element has larger priority value than 
      // it's parent then break out. It is in the correct place 
      // in the heap 
      if (current.priority >= parent.priority) break;
      // Otherwise swap places with the parent item
      this.#swap(index, parentIndex);
      // Set index to the elements new index which is the 
      // parent's old index
      index = parentIndex;
    }
  }

  /**
   * Heapify down a node added to the top of the heap from the 
   * bottom into it's correct place
   */
  #heapifyDown() {
    // Starting index of node to heapify down
    let index = 0;
    // Length of the heap
    const length = this.heap.length;
    // The node to move down the heap
    const current = this.heap[0];
    // Continue moving the node down until it breaks out when 
    // it find the correct place for the node
    while (true) {
      // Left child index
      let leftChildIdx = 2 * index + 1;
      // Right child index
      let rightChildIdx = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      // If the left child index if valid
      if (leftChildIdx < length) {
        // Left child node
        leftChild = this.heap[leftChildIdx];
        // If the left child priority is less than the current 
        // node then swap the current node with the left child
        if (leftChild.priority < current.priority) {
          swap = leftChildIdx;
        }
      }

      // If the right child index is valid
      if (rightChildIdx < length) {
        // Right child node
        rightChild = this.heap[rightChildIdx];
        // If there is not a swap and the right child priority 
        // is less than the current priority or if there is a 
        // swap and the right child priority is less than the left 
        // child priority then swap the current with the right child
        if ((swap === null && rightChild.priority < current.priority) ||
            (swap !== null && rightChild.priority < leftChild.priority)) {
          swap = rightChildIdx;
        }
      }

      // If there is no swap then break out of the loop since the 
      // current node is now in the correct place in the heap
      if (swap === null) break;

      // Otherwise swap the child node with the current node
      this.#swap(index, swap);
      // Set the current index to the one it was swapped into
      index = swap;
    }
  }

  /**
   * Basic swap method
   * @param {number} index1 Node index 1
   * @param {number} index2 Node index 2
   */
  #swap(index1, index2){
    let temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp
  }  
}