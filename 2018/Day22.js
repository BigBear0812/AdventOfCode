// Puzzle for Day 22: https://adventofcode.com/2018/day/22

export const run = (fileContents) => {
  // Depth from the input
  let depth = parseInt(fileContents[0].match(new RegExp(/[a-z]+: (\d+)/))[1]);
  // End point from the input
  let endMatches = fileContents[1].match(new RegExp(/[a-z]+: (\d+),(\d+)/));
  let end = {x: parseInt(endMatches[1]), y: parseInt(endMatches[2]), tool: 'torch'};
  // Start as specified from the puzzle
  let start = {x: 0, y: 0, tool: 'torch'};

  // Create a graph of the regions states and their 
  // relationshsips while finding the total risk for part 1
  let data = createGraph(depth, end);

  // Djikstra's shortest path algorithm with a priority queue 
  // to find the quickest way to reach the end point
  let result = data.graph.djikstraShortestPath(start, end);

  return {part1: data.totalRisk, part2: result.distance};
}

const createGraph = (depth, end) => {
  // A grid to keep track of the info for each region
  let grid = new Map();
  // The total risk for Part 1
  let totalRisk = 0;
  // A weighted graph of the regions and their allowed tools
  let graph = new Graph();

  // Spacing to generate beyond the bounds of the 0,0 start and end region
  let spacing = 100;

  // Max diagonal value
  let maxValue = Math.max(end.x, end.y) + spacing;

  // Construct the grid along the diagonal from highest x, 0 y to 0 x, highest y. 
  // Highest is the max value for this diagonal.
  for(let diagonal = 0; diagonal <= maxValue; diagonal++){
    // Region coordinates
    let x = diagonal;
    let y = 0;
    // Start by adding the first region to the grid
    do{
      // If these coordinates fall into the spacing boundaries then add it
      if(x >= 0 && x <= end.x + spacing && y >= 0 && y <= end.y + spacing){
        // Get the geologic index based on the puzzle rules
        let geologicIndex;
        if((x === 0 && y === 0) || (x === end.x && y === end.y))
          geologicIndex = 0;
        else if(y === 0)
          geologicIndex = x * 16807;
        else if(x === 0)
          geologicIndex = y * 48271;
        else
          geologicIndex = grid.get(`${x-1},${y}`).erosionLevel * grid.get(`${x},${y-1}`).erosionLevel;
        
        // Get the erosion level
        let erosionLevel = (geologicIndex + depth) % 20183;
        // Get the type
        let type = erosionLevel % 3;

        // Get the allowed tools for this region
        let tools;
        if(type === 0)
          tools = ['climbing_gear', 'torch'];
        else if(type === 1)
          tools = ['none', 'climbing_gear'];
        else if(type === 2)
          tools = ['none', 'torch'];

        // If this regions is in the area from the start to the end add it's type to the total risk
        if(x >= 0 && x <= end.x && y >= 0 && y <= end.y)
          totalRisk += type;

        // Add this region to the grid;
        grid.set(`${x},${y}`, {geologicIndex, erosionLevel, type, x, y, tools})

        // Add nodes to the graph for this region and each tool allowed in it
        for(let tool of tools){
          let current = {x, y, tool};
          graph.addNode(current);
        }

        // For each of the tools allowed in this region
        for(let t = 0; t < tools.length; t++){
          let tool = tools[t];
          let current = {x, y, tool};

          // Add a weight 7 edge to this same location to switch tools
          for(let u = t+1; u < tools.length; u++){
            let otherTool = tools[u];
            if(tool !== otherTool)
              graph.addEdge(current, {x, y, tool: otherTool}, 7);
          }

          // Find the next possible moves that have been added to the graph. 
          // Since this is being filled diagonally this is only up and left
          let moves = [];
          moves.push({x: x, y: y-1})// up
          moves.push({x: x-1, y: y})// left

          // Add edges to the graph from this node and tool combo to 
          // allowed adjacent node and tool combos
          for(let move of moves){
            // If the move is in bounds
            if(move.x >= 0 && move.y >= 0){
              // Get the neighbor region from the grid
              let node = grid.get(`${move.x},${move.y}`);
              // If the neighbor exists and has the current tool in common 
              // with the current region add a connecting edge
              if(node !== null && node.tools.includes(tool)){
                graph.addEdge(current, {x: move.x, y: move.y, tool}, 1);
              }
            }
          }
        }
      }

      // Advance along the diagonal.
      y++;
      x--;
    }
    // Continue running until the coordinates are out of bounds
    while(x > -1)
  }

  return {totalRisk, graph};
}

// A weighted graph that will be used find the shortest path between 
// two nodes using Djikstra's algorithm with a priority queue
class Graph {
  constructor(){
    this.edges = {};
  }

  // Add a node to the graph
  addNode(node){
    let key = this.#key(node.x, node.y, node.tool);
    this.edges[key] = [];
  }

  // Add an edge to the graph
  addEdge(from, to, weight){
    let fromNode = this.#key(from.x, from.y, from.tool);
    let toNode = this.#key(to.x, to.y, to.tool);
    this.edges[fromNode].push({node: toNode, weight: weight});
    this.edges[toNode].push({node: fromNode, weight: weight});
  }

  // Used to convert node data into unqiue strings for identifying each node
  #key(x, y, tool){
    return `${x},${y},${tool}`;
  }

  // Compute the shortest path between two points using 
  // djikstra's algorithm with a priority queue
  djikstraShortestPath(start, end){
    // The unique strings for the start and end nodes from their data objects
    let startNode = this.#key(start.x, start.y, start.tool);
    let endNode = this.#key(end.x, end.y, end.tool);
    // Priority queue to hold the next possible nodes to visit
    const unvisited = new PriorityQueue();
    // Hash object storing shortest duistance to each point
    const distances = new Map();
    // Hash object storing parent of each node
    const parents = new Map();
    
    // The move to make with the smallest cost
    let smallest;

    // Populate the starting state
    for (let node in this.edges) {
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
      // If this is the end break out of the loop since this is complete
      if (smallest === endNode) {        
        break;
      }
      // If the distance for this smallest node is not inifity then proceed. 
      // If it is still infity then we do not know how far it is to reach it 
      // and cannot proceed finding the distance for the neighbbor nodes.
      if (distances.get(smallest) !== Infinity) {
        // Loop through the neighbor nodes from the graph edges
        for (let neighbor of this.edges[smallest]) {
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
    let distance = distances.get(endNode)

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
    // Add the end node to the front of the heap
    this.heap[0] = end;
    // If there are still nodes in the heap then heapify 
    // down the new node at the top of the heap
    if (this.heap.length > 0) {
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
      // Rigbht child index
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