// Puzzle for Day 9: https://adventofcode.com/2018/day/9

/**
 * Main Runner
 * @param {string[]} fileContents The file contents in an array of strings for each line
 * @returns {{part1: *, part2: *}} The puzzle results
 */
export const run = (fileContents) => {
  // Regex to parse values from the input line
  let reg = new RegExp(/(\d+) players; last marble is worth (\d+) points/);
  // Parse the information from the input
  let matches = fileContents[0].match(reg);

  // Create int's from the input values for player count and the last marble
  let playerCount = parseInt(matches[1]);
  let lastMarble = parseInt(matches[2]);

  // Find the high scores for parts 1 and 2 of the puzzle
  let highScore1 = findHighScore(playerCount, lastMarble);
  let highScore2 = findHighScore(playerCount, lastMarble * 100);

  return { part1: highScore1, part2: highScore2 };
};

// Find the high score for the game given the number of players and the highest value marble
const findHighScore = (playerCount, lastMarble) => {
  // The elves scores
  let scores = new Array(playerCount).fill(0);

  // The current circle of marbles
  let circle = new LinkedList();
  // Start by inserting the 0 marble
  circle.insert(0);

  // Simulate each marble
  for (let m = 1; m <= lastMarble; m++) {
    // If the marble is a multiple of 23
    if (m % 23 === 0) {
      // Advance back 6
      circle.advancePrev(6);
      // Delete the pervious marble
      let deleted = circle.delete();
      // Update score for the current elf
      scores[(m - 1) % playerCount] += m + deleted;
    }
    // Else this is a marble to be placed like normal
    else {
      // Advance forward 2
      circle.advanceNext(2);
      // Insert the value behind the current marble
      circle.insert(m);
      // Advance back 1 so the new marble is the current one
      circle.advancePrev();
    }
  }

  // Return the highest score
  return Math.max(...scores);
};

// A class for maintaining and manipulating a circular doubley linked list
class LinkedList {
  constructor() {
    this.head = null;
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
  }

  // Advance the head node to the next one in the list the given number of times
  advanceNext(count = 1) {
    for (let x = 0; x < count; x++) this.head = this.head.next;
  }
  // Advance the head node to the prev one in the list the given number of times
  advancePrev(count = 1) {
    for (let x = 0; x < count; x++) this.head = this.head.prev;
  }

  // Delete the prev node to the one at the current head of the list
  // and return the node value being deleted
  delete() {
    let result = this.head.prev.value;

    this.head.prev.prev.next = this.head;
    this.head.prev = this.head.prev.prev;
    this.length--;

    return result;
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
