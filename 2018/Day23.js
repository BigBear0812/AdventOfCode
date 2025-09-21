// Puzzle for Day 23: https://adventofcode.com/2018/day/23

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Parse in nanobots from the input file
  let nanobots = parseInput(fileContents);
  // Find the count of bot in range of the strongest bot
  let inRangeCount = botInRangeOfStrongest(nanobots);
  // Find the minimum distance required to move into range of the most bots
  let distance = distanceToGetInRange(nanobots);

  return { part1: inRangeCount, part2: distance };
};

// Part 2 brilliant solution for solving this converted to JS from this post:
// https://www.reddit.com/r/adventofcode/comments/a8s17l/comment/ecdqzdg/?utm_source=share&utm_medium=web2x&context=3
//
// Create a min priority queue of the distances to the edges of each bot's radius.
// Use 1 to increase the counter for near side points and adding to the result while
// -1 reduces the counter for far side distances to keep it from being pushed out
// too far. Since the answer must be along the edge of one of the radii this this
// will find the closest value that is in range of the most bots.
//
// <-----------------X------------------>
// (----o----)    (---o---)     (--o--)
//        (------0-------) (--o--)
const distanceToGetInRange = (bots) => {
  let queue = new PriorityQueue();

  // Calculate values for each bot
  for (let bot of bots) {
    // Get distance to the bot
    let dist = distance(bot, { x: 0, y: 0, z: 0 });
    // Near side of the field bot's field
    let nearSide = Math.max(0, dist - bot.r);
    // Far side of the bot's field
    let farSide = dist + bot.r + 1;
    // Add both distances to the priority queue
    // with the distance as the priority value
    queue.add({ d: nearSide, e: 1 }, nearSide);
    queue.add({ d: farSide, e: -1 }, farSide);
  }

  // Keep a running count of near side versus far side distances
  let count = 0;
  // Max count of near side distances
  let maxCount = 0;
  // Resulting distance
  let result = 0;

  // Continue processing while there are still distances to process
  while (queue.hasNodes) {
    // Current distance
    let current = queue.remove();
    // Add end value to count (either 1 or -1)
    count += current.val.e;
    // If the count is above the max count
    if (count > maxCount) {
      // Resulting distance
      result = current.val.d;
      // Update max count
      maxCount = count;
    }
  }

  return result;
};

// Part 1 find the number of bots in range of the strongest bot
const botInRangeOfStrongest = (bots) => {
  let strongest = null;

  // Find the strongest bot (the one with the largest radius)
  for (let bot of bots) {
    if (strongest === null || strongest.r < bot.r) strongest = bot;
  }

  // Count the number of bots in range
  let inRangeCount = 0;
  for (let bot of bots) {
    // Distance from the strongest bot to the current bot
    let dist = distance(strongest, bot);
    // If in range, increment the counter
    if (dist <= strongest.r) inRangeCount++;
  }

  return inRangeCount;
};

// Manhattan diastance between two coordinates
const distance = (pointA, pointB) => {
  // Diff for each parameter
  let xDiff = pointA.x - pointB.x;
  let yDiff = pointA.y - pointB.y;
  let zDiff = pointA.z - pointB.z;

  // Add together the absolute values for each parameter
  return Math.abs(xDiff) + Math.abs(yDiff) + Math.abs(zDiff);
};

// Parse the nano bots in from the input file
const parseInput = (fileContents) => {
  // Regex for parsing each line of the input
  let reg = new RegExp(/pos=<([\d-]+),([\d-]+),([\d-]+)>, r=(\d+)/);
  // Array of bots
  let bots = [];

  // Each line defines a new bot
  for (let line of fileContents) {
    // Match the ciritcal values
    let matches = line.match(reg);

    // Parse each number from the matches and
    // add the new bot object to the array
    let x = parseInt(matches[1]);
    let y = parseInt(matches[2]);
    let z = parseInt(matches[3]);
    let r = parseInt(matches[4]);
    bots.push({ x, y, z, r });
  }

  return bots;
};

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
    let newNode = { val, priority };
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
  get hasNodes() {
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

  // Basic swap method
  #swap(index1, index2) {
    let temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }
}
