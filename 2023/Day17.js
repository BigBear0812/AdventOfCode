// Puzzle for Day 17: https://adventofcode.com/2023/day/17

export const run = (fileContents) => {
  let result1 = solver(fileContents, 0, 3);
  let result2 = solver(fileContents, 3, 10);

  return {part1: result1, part2: result2};
}

/**
 * Solves either part
 * @param {string[]} fileContents 
 * @param {number} minStraight 
 * @param {number} maxStraight 
 * @returns 
 */
const solver = (fileContents, minStraight, maxStraight) => {
  // Create a new node graph and a 2d array of heat loss values
  let graph = new Graph();
  let grid = fileContents.map(l => l.split('').map(x => parseInt(x)));

  // Generate graph nodes and edges
  // Node {
  //   x: X position on the grid
  //   y: Y position on the grid
  //   direction: The direction that the space was entered from
  //   lastTurn: The count of move since a move was last made
  // }
  for(let y = 0; y < grid.length; y++){
    for(let x = 0; x < grid.length; x++){
      // At each node generate all of the possible states that can be had from O 
      // last moves in each direction to the max since last turn
      for(let turn = 0; turn < maxStraight; turn++){
        graph.addNode({x, y, direction: '^', lastTurn: turn});
        graph.addNode({x, y, direction: 'v', lastTurn: turn});
        graph.addNode({x, y, direction: '<', lastTurn: turn});
        graph.addNode({x, y, direction: '>', lastTurn: turn});
      }
      // If moving in a specific direction generate the possible next states based on min and max number of moves
      if(y > 0) {// Above
        for(let turn = 1; turn < maxStraight; turn++){
          graph.addEdge({x, y, direction: '^', lastTurn: turn-1}, {x, y: y-1, direction: '^', lastTurn: turn}, grid[y-1][x]);
        }
        for(let turn = minStraight; turn < maxStraight; turn ++){
          graph.addEdge({x, y, direction: '<', lastTurn: turn}, {x, y: y-1, direction: '^', lastTurn: 0}, grid[y-1][x]);
          graph.addEdge({x, y, direction: '>', lastTurn: turn}, {x, y: y-1, direction: '^', lastTurn: 0}, grid[y-1][x]);
        }
      }
      if(y < grid.length-1) {// Below
        for(let turn = 1; turn < maxStraight; turn++){
          graph.addEdge({x, y, direction: 'v', lastTurn: turn-1}, {x, y: y+1, direction: 'v', lastTurn: turn}, grid[y+1][x]);
        }
        for(let turn = minStraight; turn < maxStraight; turn ++){
          graph.addEdge({x, y, direction: '<', lastTurn: turn}, {x, y: y+1, direction: 'v', lastTurn: 0}, grid[y+1][x]);
          graph.addEdge({x, y, direction: '>', lastTurn: turn}, {x, y: y+1, direction: 'v', lastTurn: 0}, grid[y+1][x]);
        }
      }
      if(x > 0) {// Left
        for(let turn = 1; turn < maxStraight; turn++){
          graph.addEdge({x, y, direction: '<', lastTurn: turn-1}, {x: x-1, y, direction: '<', lastTurn: turn}, grid[y][x-1]);
        }
        for(let turn = minStraight; turn < maxStraight; turn ++){
          graph.addEdge({x, y, direction: '^', lastTurn: turn}, {x: x-1, y, direction: '<', lastTurn: 0}, grid[y][x-1]);
          graph.addEdge({x, y, direction: 'v', lastTurn: turn}, {x: x-1, y, direction: '<', lastTurn: 0}, grid[y][x-1]);
        }
      }
      if(x < grid[y].length-1) {// Right
        for(let turn = 1; turn < maxStraight; turn++){
          graph.addEdge({x, y, direction: '>', lastTurn: turn-1}, {x: x+1, y, direction: '>', lastTurn: turn}, grid[y][x+1]);
        }
        for(let turn = minStraight; turn < maxStraight; turn ++){
          graph.addEdge({x, y, direction: '^', lastTurn: turn}, {x: x+1, y, direction: '>', lastTurn: 0}, grid[y][x+1]);
          graph.addEdge({x, y, direction: 'v', lastTurn: turn}, {x: x+1, y, direction: '>', lastTurn: 0}, grid[y][x+1]);
        }
      }
    }
  }
  // From each possible start state find the shortest path that meets the end condition
  let shortestPaths = []
  let end = {y: grid.length-1, x: grid[grid.length-1].length-1}
  let endNode = `${end.x},${end.y}`;
  shortestPaths.push(graph.dijkstraShortestPath({x: 0, y: 0, direction: '>', lastTurn: 0}, (current) => current.startsWith(endNode)));
  shortestPaths.push(graph.dijkstraShortestPath({x: 0, y: 0, direction: 'v', lastTurn: 0}, (current) => current.startsWith(endNode)));

  // Return the distance of only the shortest path
  let shortest = null;
  for(let path of shortestPaths){
    if(shortest == null || path.distance < shortest.distance)
      shortest = path;
  }

  return shortest.distance;
}

// A weighted graph that will be used find the shortest path between 
// two nodes using Dijkstra's algorithm with a priority queue
class Graph {
  constructor(){
    this.edges = new Map();
  }

  // Add a node to the graph
  addNode(node){
    let key = this.#key(node.x, node.y, node.direction, node.lastTurn);
    this.edges.set(key, []);
  }

  // Add an edge to the graph
  addEdge(from, to, weight){
    let fromNode = this.#key(from.x, from.y, from.direction, from.lastTurn);
    let toNode = this.#key(to.x, to.y, to.direction, to.lastTurn);
    let fromEdges = this.edges.get(fromNode);
    fromEdges.push({node: toNode, weight});
    this.edges.set(fromNode, fromEdges);
  }

  // Used to convert node data into unique strings for identifying each node
  #key(x, y, direction, lastTurn){
    return `${x},${y},${direction},${lastTurn}`;
  }

  // Compute the shortest path between two points using 
  // Dijkstra's algorithm with a priority queue
  dijkstraShortestPath(start, endCondition){
    // The unique strings for the start and end nodes from their data objects
    let startNode = this.#key(start.x, start.y, start.direction, start.lastTurn);
    // let endNode = this.#key(end.x, end.y, end.direction);
    // Priority queue to hold the next possible nodes to visit
    const unvisited = new PriorityQueue();
    // Hash object storing shortest distance to each point
    const distances = new Map();
    // Hash object storing parent of each node
    const parents = new Map();
    
    // The move to make with the smallest cost
    let smallest;

    // Populate the starting state
    for (let node of this.edges.keys()) {
      // For the starting node add it to the unvisited 
      // priority queue and set the distance to it to 0 
      if (node === startNode) {
        distances.set(node, 0);
        unvisited.add(node, 0);
      }
      // Otherwise set the distance to infinity since it has not ben calculated yet
      else {
        distances.set(node, Infinity);
      }
      // Set every nodes parent to null
      parents.set(node, null);
    }

    // Continue processing while not having broken out yet by 
    // reaching the end and while there are still unvisited 
    // next nodes to process
    while (unvisited.hasNodes) {
      // Get the node node with the smallest cost next
      smallest = unvisited.remove().val;
      //let history = !smallestObj.history ? [] : smallestObj.history;
      // If this is the end break out of the loop since this is complete
      if (endCondition(smallest)) {        
        break;
      }

      // If the distance for this smallest node is not infinity then proceed. 
      // If it is still infinity then we do not know how far it is to reach it 
      // and cannot proceed finding the distance for the neighbor nodes.
      if (distances.get(smallest) !== Infinity) {
        // Loop through the neighbor nodes from the graph edges
        for (let neighbor of this.edges.get(smallest)) {
          // Get the neighbor's new distance
          let neighborDist = distances.get(smallest) + neighbor.weight;
          // If this new distance is less than the value already stored in distance
          if (neighborDist < distances.get(neighbor.node)) {
            // Update the stored distance
            distances.set(neighbor.node, neighborDist);
            // Update the parent node
            parents.set(neighbor.node, smallest);
            // Add this node and distance to the queue
            unvisited.add(neighbor.node, neighborDist);
          }
        }
      }
    }

    // The full path to be returned for the shortest path
    let path = [];
    // Continue while there are still parent nodes. 
    // The start will be the only one without a parent node
    let end = smallest;
    while (parents.get(smallest)) {
      path.push(smallest);
      smallest = parents.get(smallest);
    }
    // Add the final start node and reverse the order 
    // to get them from start to end
    path = path.concat(smallest).reverse();

    // Get the distance for the end node from the distances 
    let distance = distances.get(end)

    return {path, distance};
  }
}

// A priority queue using a min heap to keep the smallest 
// cost node as the next to be dequeued
class PriorityQueue {
  // Initialize a new empty array for the heap
  constructor() {
    this.heap = [];
  }

  // Add a new item to the heap
  add(val, priority) {
    // Create the new node for the heap
    let newNode = {val, priority};
    // Push the node on to the end of the heap
    this.heap.push(newNode);
    // Bubble up the node to the correct place
    this.#heapifyUp();
  }

  // Remove the next item from the heap. Since this is a min heap 
  // it will always be the item with the lowest priority
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

  // Return true if there are still nodes to evaluate
  get hasNodes(){
    return this.heap.length > 0;
  }

  // Heapify up a new node to the correct place in the heap
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

  // Heapify down a node added to the top of the heap from the 
  // bottom into it's correct place
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

  // Basic swap method
  #swap(index1, index2){
    let temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp
  }  
}