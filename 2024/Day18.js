// Puzzle for Day 18: https://adventofcode.com/2024/day/18

let HEIGHT = 71;
let WIDTH = 71;

export const run = (fileContents) => {
  // Parse the data from the input into an array of y,x coordinates
  let data = fileContents.map(line => {
    let splits = line.split(',').map(val => parseInt(val));
    return {y: splits[1], x: splits[0]};
  });
  let result1 = part1(data);
  let result2 = part2(data, result1.shortestPaths)
  return {part1: result1.shortestDistance, part2: result2};
}

/**
 * Part 2 Solution
 * @param {{y: number, x: number}[]} data The spaces where data is falling
 * @returns The location that prevents a completed path
 */
const part2 = (data, shortestPaths) => {
  // Store the answer for the problem
  let answer;
  // Flatten the shortest paths nodes into a single array
  let path = shortestPaths.flat(Infinity);

  // Start where part 1 left off
  for(let i = 1024; !answer; i++){
    // Check if the path is interrupted by the next corrupted location.
    if(path.indexOf(`${data[i].x},${data[i].y}`) !== -1){
      // If it is interrupted then build the graph up to this point
      // Slice the data to the specific length
      let slicedData = data.slice(0, i);
      // Create a graph of it
      let graph = createGraph(slicedData);
      // If the graph does not have the end node the answer is found
      if (!graph.hasNode({y: HEIGHT-1, x: WIDTH-1}))
        answer = slicedData[slicedData.length-1];
      // Otherwise find the shortest paths and repeat the process
      else{
        let result = graph.dijkstraShortestPath({y:0, x:0}, {y: HEIGHT-1, x: WIDTH-1});
        path = result.shortestPaths.flat(Infinity);
      }
    }
  }
  
  return `${answer.x},${answer.y}`;
}

/**
 * Part 1 Solution
 * @param {{y: number, x: number}[]} data The spaces where data is falling
 * @returns The shortest distance to the exit after the first 1024 fall
 */
const part1 = (data) => {
  // Create the graph with the limited set of data
  let graph = createGraph(data.slice(0, 1024));
  // Use Dijkstra's shortest path algorithm to find the shortest distance to the end node
  let result = graph.dijkstraShortestPath({y: 0,x: 0}, {y: HEIGHT-1, x: WIDTH-1});
  return result;
}

/**
 * Create a graph of all open spaces from start to finish. By starting 
 * at the start location and moving out from there if there is not path 
 * then the graph will not contain the end node.
 * @param {{y: number, x: number}[]} data The spaces where data is falling
 * @returns {Graph} Graph of open spaces
 */
const createGraph = (data) => {
  // Create a set of the corrupted locations
  let corruptedLocations = new Set();
  data.forEach(loc => corruptedLocations.add(`${loc.y},${loc.x}`));

  // Initialize a new graph
  let graph = new Graph();

  // Track the locations that have already been visited
  let visited = new Set();
  // Add the start location
  let locations = [{y:0, x:0}];
  // Add the start to the graph 
  graph.addNode({y:0, x:0});

  // Continue while there are still adjacent nodes to add
  while(locations.length > 0){
    // Get the current location
    let current = locations.shift();
    // If already visited then skip it
    if(visited.has(`${current.y},${current.x}`))
      continue;
    // If not added to the graph then add it
    if(!graph.hasNode(current))
      graph.addNode(current);
    // All possible neighbors
    visited.add(`${current.y},${current.x}`);
    [
      {y: current.y-1, x: current.x}, // up
      {y: current.y+1, x: current.x}, // down
      {y: current.y, x: current.x-1}, // left
      {y: current.y, x: current.x+1}  // right
    ]
    // Filter down to only the valid neighbor nodes
    .filter(val => 
      // Check for in bounds of the grid
      val.y >= 0 && 
      val.y < HEIGHT && 
      val.x >= 0 && 
      val.x < WIDTH && 
      // Check if the space is corrupted
      !corruptedLocations.has(`${val.y},${val.x}`))
    // Add each to the graph
    .forEach(val => {
      // If not already
      if(!graph.hasNode(val)){
        // Add the node and edge to the graph
        graph.addNode(val);
        graph.addEdge(current, val, 1);
        // Add the location to the locations to be processed in
        locations.push(val);
      }
    });
  }

  return graph;
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
   * Dijkstra's algorithm with a priority queue
   * @param {{y: number, x: number}} start The start node
   * @param {{y: number, x: number}} end The end node
   * @returns {{
   *  shortestPaths: string[][], 
   *  shortestDistance: number
   * }} All of the shortest paths and the shortest distance from start to end nodes
   */
  dijkstraShortestPath(start, end){
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