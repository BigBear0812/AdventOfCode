// Puzzle for Day 20: https://adventofcode.com/2024/day/20

export const run = (fileContents) => {
  let data = createGraph(fileContents);
  let result1 = solver(data, 2);
  let result2 = solver(data, 20);
  return {part1: result1, part2: result2};
}

/**
 * Solve either of the problem
 * @param {{graph: Graph, start: {y: number, x: number}, end: {y: number, x: number}}} data The graph data, start, and end points
 * @param {number} shortcutMaxDistance The max distance a shortcut can be
 * @returns Number of shortcuts that save more than 100 picoseconds
 */
const solver = (data, shortcutMaxDistance) => {
  // Distance to the end for each location
  let locationDistances = new Map();
  // Get the path from the end to the start. This produces a shortest path where 
  // each index is the locations distance from the end.
  let pathLocations = data.graph.djikstraShortestPath(data.end, data.start).shortestPaths[0]
  // Parse the info into coordinates and key strings
    .map((loc) => {
      let splits = loc.split(',').map(val => parseInt(val));
      return [loc, {y: splits[1], x: splits[0]}];
    });
  // Populate the location distance map from this information
  pathLocations.forEach((loc, distance) => locationDistances.set(loc[0], distance));

  // Create a map of the results where the key is the time saved and the value 
  // is the number of times this shortcut is found
  let results = new Map();
  // Compare every location with every other location
  for(let a = 0; a < pathLocations.length; a++){
    for(let b = a+1; b < pathLocations.length;b++){
      // Get the both locations
      let aLoc = pathLocations[a];
      let bLoc = pathLocations[b];
      // Compute the manhattan distance between the 2 locations
      let shortcutDistance = Math.abs(aLoc[1].y - bLoc[1].y) + Math.abs(aLoc[1].x - bLoc[1].x);

      // Make sure this is greater than 1 (aka not being neighbors) and this is 
      // within the limit of the shortcut max distance
      if(shortcutDistance <= shortcutMaxDistance && shortcutDistance > 1){
        // Get the difference between the location times to find the graph distance between the points
        let graphDistanceA = locationDistances.get(aLoc[0]);
        let graphDistanceB = locationDistances.get(bLoc[0]);
        let graphDistance = Math.abs(graphDistanceA - graphDistanceB);
        // If the graph distance is greater than the manhattan distance then this is a shortcut
        if(graphDistance > shortcutDistance){
          // Find the time saved by subtracting the shortcut distance from the graph distance
          let savedDistance = graphDistance-shortcutDistance;
          // Add one the the appropriate entry in the map
          if(results.has(savedDistance))
            results.set(savedDistance, results.get(savedDistance) + 1);
          else
            results.set(savedDistance, 1);
        }
      }
    }
  }

  // Return the total count of shortcuts that are 100 or more picoseconds
  return Array.from(results)
  .reduce((total, shortcutTime) =>  total += shortcutTime[0] >= 100 ? shortcutTime[1] : 0, 0);
}

/**
 * Create a graph of all open spaces from start to finish. By starting 
 * at the start location and moving out from there if there is not path 
 * then the graph will not contain the end node.
 * @param {{y: number, x: number}[]} data The spaces where data is falling
 * @returns {Graph} Graph of open spaces
 */
const createGraph = (fileContents) => {
  // Create a set of the wall locations and an array of path locations
  let walls = new Set();
  // Save start and end points
  let start;
  let end;
  let grid = fileContents.map(line => line.split(''));

  // Parse the data from each grid location
  for(let y = 0; y < grid.length; y++){
    for(let x = 0; x < grid[y].length; x++){
      if(grid[y][x] === '#')
        walls.add(`${y},${x}`);
      else if(grid[y][x] === 'S')
        start = {y, x};
      else if(grid[y][x] === 'E')
        end = {y, x};
    }
  }

  // Initialize a new graph
  let graph = new Graph();

  // Track the locations that have already been visited
  let visited = new Set();
  // Add the start location
  let locations = [start];
  graph.addNode(start);

  // Continue while there are still adjacent nodes to add
  while(locations.length > 0){
    // Get the current location 
    let current = locations.shift();
    // If already visited then skip it
    if(visited.has(`${current.y},${current.x}`))
      continue;
    // All possible neighbors
    visited.add(`${current.y},${current.x}`);
    [
      {y: current.y-1, x: current.x}, // up
      {y: current.y+1, x: current.x}, // down
      {y: current.y, x: current.x-1}, // left
      {y: current.y, x: current.x+1}  // right
    ]
    // Filter down to only the valid neighbor nodes that are not walls
    .filter(val => 
      !walls.has(`${val.y},${val.x}`))
    // Add each to the graph
    .forEach(val => {
      // If not already visited
      if(!visited.has(`${val.y},${val.x}`)){
        // Add node and edge to the graph
        graph.addNode(val);
        graph.addEdge(current, val, 1);
        // Add the location to the locations to be processed in
        locations.push(val);
      }
    });
  }

  return {graph, start, end};
}

/**
 * A weighted graph that will be used find the all of the shortest paths between
 * two nodes using Djikstra's algorithm with a priority queue
 */
class Graph {
  constructor(){
      this.edges = {};
  }

  /**
   * Add a node to the graph
   * @param {{y: number, x: number} node 
   */
  addNode(node){
    let key = this.#key(node.x, node.y);
    this.edges[key] = [];
  }

  /**
   * Determine if a given node is currently in the grid
   * @param {{y: number, x: number} node 
   * @returns {boolean} True if the node is already in the graph
   */
  hasNode(node){
    let key = this.#key(node.x, node.y);
    return this.edges[key] ? true : false;
  }

  /**
   * Add an edge to the graph
   * @param {{y: number, x: number}} from Start node for the edge
   * @param {{y: number, x: number}} to End node for the edge
   * @param {number} weight Edge weight
   * @param {boolean} reverse Reverse directions when adding opposite edge
   */
  addEdge(from, to, weight){
    // Get the from and to nodes
    let fromNode = this.#key(from.x, from.y);
    let toNode = this.#key(to.x, to.y);
    
    // Add the initial node
    this.edges[fromNode].push({node: toNode, weight: weight});
    // Add the opposite nodes
    this.edges[toNode].push({node: fromNode, weight: weight});
    
  }

  /**
   * Used to convert node data into unique strings for identifying each node
   * @param {number} x 
   * @param {number} y
   * @returns 
   */
  #key(x, y){
    return `${x},${y}`;
  }

  /**
   * Compute all of the shortest paths between two points using 
   * djikstra's algorithm with a priority queue
   * @param {{y: number, x: number}} start The start node
   * @param {{y: number, x: number}} end The end node
   * @returns {{
   *  shortestPaths: string[][], 
   *  shortestDistance: number
   * }} All of the shortest paths and the shortest distance from start to end nodes
   */
  djikstraShortestPath(start, end){
    // The unique strings for the start and end nodes from their data objects
    let startNode = this.#key(start.x, start.y);
    let endNode = this.#key(end.x, end.y);
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