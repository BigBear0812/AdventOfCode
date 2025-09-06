// Puzzle for Day 19: https://adventofcode.com/2016/day/19

export const run = (fileContents) => {
  // Get the number of elves from the first linke of the input file
  let numElves = parseInt(fileContents[0]);

  // Create an elf circular doubley linked list with the specified number of elves
  let elfCircle1 = createElfCircle(numElves);

  // Find the winning elf when the elves steal from the elf next to themselves
  let winningElf1 = stealFromNext(elfCircle1);

  // Create an elf circular doubley linked list with the specified number of elves
  let elfCircle2 = createElfCircle(numElves);

  // Find the winning elf when the elves steal form across from themselves
  let winningElf2 = stealFromAcross(elfCircle2);

  return { part1: winningElf1.value.elfNum, part2: winningElf2.value.elfNum };
};

// Simulate stealing gifts from the next elf
const stealFromNext = (elfCircle) => {
  // While there is more than one elf left
  while (elfCircle.length > 1) {
    // Get the current head if the list and steal the presents from the next elf in the list
    elfCircle.head.value.numPresents += elfCircle.head.next.value.numPresents;
    // Delete the next elf in the list since they are now out
    elfCircle.delete(elfCircle.head.next);
    // Advance the head of the list to the next elf
    elfCircle.advanceNext();
  }
  return elfCircle.head;
};

// Simulate stealing gifts from the elf across the circle
const stealFromAcross = (elfCircle) => {
  // While there is more than one elf left
  while (elfCircle.length > 1) {
    // Get the current head if the list and steal the presents from the across elf in the list
    elfCircle.head.value.numPresents += elfCircle.across.value.numPresents;
    // Delete the across elf in the list since they are now out
    elfCircle.delete(elfCircle.across);
    // Advance the head of the list to the next elf
    elfCircle.advanceNext();
  }
  return elfCircle.head;
};

// Create a circular doubly linked list of elves
const createElfCircle = (length) => {
  let elfCircle = new LinkedList();

  // Keep adding elves to the list until it reaches the specified length
  for (let x = 1; x <= length; x++) {
    elfCircle.insert({
      elfNum: x,
      numPresents: 1,
    });
  }

  return elfCircle;
};

// A class for maintaining and manipulating a circular doubley linked list
class LinkedList {
  constructor() {
    this.head = null;
    this.across = null;
    this.length = 0;
  }

  // Insert values in the last position of the list behind the head of the list
  insert(value) {
    // If no items exist insert insert the value as the head node and link it to itself
    if (this.head === null) {
      this.head = new LinkedListNode(value, null, null);
      this.head.prev = this.head;
      this.head.next = this.head;
    }
    // If a head already exists add this beihnd the head and update the
    // adjacent node references node references
    else {
      let prev = this.head.prev;
      let item = new LinkedListNode(value, this.head, prev);
      this.head.prev = item;
      prev.next = item;
    }
    this.length++;

    // If this list in longer than one node and the length is even find or update the
    // node that is across from the current head node. This allows us to keep track of
    // the node directly across in even situations and the one that is to the left in
    // odd situations
    if (this.length > 1 && this.length % 2 === 0) {
      // If across node is null find it for the first time
      if (this.across === null) {
        let numMoves = this.length / 2;
        this.across = this.head;
        for (let x = 0; x < numMoves; x++) {
          this.across = this.across.next;
        }
      }
      // Otherwise update this to the next one in the list
      else {
        this.across = this.across.next;
      }
    }
  }

  // Advance the head node to the next one in the list
  advanceNext() {
    this.head = this.head.next;
    this.across = this.across.next;
  }

  // Delete the given node
  delete(node) {
    // If this node is the across node and the length is odd the across node should be
    // the next node. This allows us to keep track of the node directly across in even
    // situations and the one that is to the left in odd situations
    if (node === this.across && this.length % 2 === 1) {
      this.across = this.across.next;
    }
    // Update the next and previous nodes references to cut this node out of the list
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.length--;
  }
}

// A class for storing linked list node information
class LinkedListNode {
  constructor(value, next, prev) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}
