// Puzzle for Day 15: https://adventofcode.com/2021/day/15

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse in the input array into a 2D array of numbers
  const grid = fileContents.map((line) =>
    line.split("").map((val) => parseInt(val)),
  );

  // Part 1
  const part1 = computePart(grid);

  // Part 2
  const expandedGrid = expandGrid(grid);

  const part2 = computePart(expandedGrid);

  return { part1, part2 };
};

/**
 * Expanded the grid times 5 as specified in the puzzle
 * @param {number[][]} grid The initial grid
 * @returns {number[][]} Grid that is expanded times 5
 */
const expandGrid = (grid) => {
  // Number of times to expand the puzzle
  const expansionMultiple = 5;
  // Size of original grid
  const xLen = grid[grid.length - 1].length;
  const yLen = grid.length;
  // Size of expanded grid
  const expandedX = xLen * expansionMultiple;
  const expandedY = yLen * expansionMultiple;

  // The output expanded grid
  const outputGrid = [];

  // Populate each location of the expanded grid
  for (let y = 0; y < expandedY; y++) {
    let row = [];
    for (let x = 0; x < expandedX; x++) {
      // Calculate how much additional danger to add to a location
      const additionalDanger = Math.floor(x / xLen) + Math.floor(y / yLen);
      // Update the danger value of a location
      let newDanger = additionalDanger + grid[y % yLen][x % xLen];
      while (newDanger > 9) {
        newDanger -= 9;
      }
      // Add to the grid
      row.push(newDanger);
    }
    outputGrid.push(row);
  }

  return outputGrid;
};

/**
 * Compute the result for a part of the puzzle
 * @param {number[][]} grid The grid of locations
 * @returns {number} The shortest distance form start to end
 */
const computePart = (grid) => {
  // Create a graph
  const graph = new Graph();

  // Add each location to the graph
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      // Use the current location as the from node
      let fromNode = { x, y };
      if (!graph.hasNode(fromNode)) graph.addNode(fromNode);

      // Get all adjacent nodes from the grid
      let adjacent = [];
      if (y - 1 >= 0) {
        adjacent.push({ x, y: y - 1, weight: grid[y - 1][x] });
      }
      if (x - 1 >= 0) {
        adjacent.push({ x: x - 1, y, weight: grid[y][x - 1] });
      }
      if (y + 1 < grid.length) {
        adjacent.push({ x, y: y + 1, weight: grid[y + 1][x] });
      }
      if (x + 1 < grid[y].length) {
        adjacent.push({ x: x + 1, y: y, weight: grid[y][x + 1] });
      }

      // Add any adjacent grids and their edge weights to the graph.
      for (let a of adjacent) {
        const toNode = { x: a.x, y: a.y };
        // Edge weight is determined by the value in the to node of the grid.
        // Reverse edges are not automatically being added in this case since
        // they would have a different weight.
        if (!graph.hasNode(toNode)) graph.addNode(toNode);
        graph.addEdge(fromNode, toNode, a.weight);
      }
    }
  }

  // Calculate the shortest path
  const shortest = graph.dijkstraShortestPath(
    { x: 0, y: 0 },
    { x: grid[grid.length - 1].length - 1, y: grid.length - 1 },
  );

  // Return the shortest path distance
  return shortest.distance;
};

/**
 * A weighted graph that will be used find the all of the shortest paths between
 * two nodes using Dijkstra's algorithm with a priority queue
 */
class Graph {
  constructor() {
    this.edges = new Map();
  }

  /**
   * Add a node to the graph
   * @param {{y: number, x: number} node
   */
  addNode(node) {
    let key = this.#key(node.x, node.y);
    this.edges.set(key, []);
  }

  /**
   * Determine if a given node is currently in the grid
   * @param {{y: number, x: number} node
   * @returns {boolean} True if the node is already in the graph
   */
  hasNode(node) {
    let key = this.#key(node.x, node.y);
    return this.edges.has(key);
  }

  /**
   * Add an edge to the graph
   * @param {{y: number, x: number}} from Start node for the edge
   * @param {{y: number, x: number}} to End node for the edge
   * @param {number} weight Edge weight
   * @param {boolean} reverse Reverse directions when adding opposite edge
   */
  addEdge(from, to, weight) {
    // Get the from and to nodes
    let fromNode = this.#key(from.x, from.y);
    let toNode = this.#key(to.x, to.y);

    // Add the initial node
    this.edges.get(fromNode).push({ node: toNode, weight: weight });
    // Add the opposite nodes
    // this.edges[toNode].push({ node: fromNode, weight: weight });
  }

  /**
   * Used to convert node data into unique strings for identifying each node
   * @param {number} x
   * @param {number} y
   * @returns
   */
  #key(x, y) {
    return `${x},${y}`;
  }

  /**
   * Compute the shortest path from start to end using
   * Dijkstra's algorithm with a priority queue
   * @param {{y: number, x: number}} start The start node
   * @param {{y: number, x: number}} end The end node
   * @returns {{
   *  shortestPaths: string[][],
   *  shortestDistance: number
   * }} All of the shortest paths and the shortest distance from start to end nodes
   */
  dijkstraShortestPath(start, end) {
    // The unique strings for the start and end nodes from their data objects
    let startNode = this.#key(start.x, start.y, start.tool);
    let endNode = this.#key(end.x, end.y, end.tool);
    // Priority queue to hold the next possible nodes to visit
    const unvisited = new PriorityQueue();
    // Hash object storing shortest distance to each point
    const distances = new Map();
    // Hash object storing parent of each node
    const parents = new Map();

    // The move to make with the smallest cost
    let smallest;

    // Populate the starting state
    this.edges.keys().forEach((node) => {
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
    });

    // Continue processing while not having broken out yet by
    // reaching the end and while there are still unvisited
    // next nodes to process
    while (unvisited.hasNodes) {
      // Get the node node with the smallest cost next
      smallest = unvisited.remove().val;
      // If this is the end break out of the loop since this is complete
      if (smallest === endNode) {
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
    while (parents.get(smallest)) {
      path.push(smallest);
      smallest = parents.get(smallest);
    }
    // Add the final start node and reverse the order
    // to get them from start to end
    path = path.concat(smallest).reverse();

    // Get the distance for the end node from the distances
    let distance = distances.get(endNode);

    return { path, distance };
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
    let newNode = { val, priority, path };
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
  get hasNodes() {
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
        if (
          (swap === null && rightChild.priority < current.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
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
  #swap(index1, index2) {
    let temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }
}
