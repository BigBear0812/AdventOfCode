import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 13: https://adventofcode.com/2015/day/13

// Check that the right number of arguments are present in the command
if (process.argv.length !== 3){
  console.log('Please specify an input file.');
  process.exit(1);
}

// Get the file name from the last argv value
const filename = process.argv[2];

// Open the file and pass it ot our main processing 
open(filename)
.then(async(file) => {
  // Process all of the line of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then((fileContents) => {
  // Parse the input into a rules map
  let rules = parseInput(fileContents, false);

  // Get all arrangements of the seating
  let allArrangements = getAllArrangements(rules);

  // Find highest score
  let highScore = Number.MIN_SAFE_INTEGER;
  for(const list of allArrangements){
    highScore = Math.max(highScore, list.score(rules));
  }

  // Log output
  console.log('Part 1:', highScore);

  // Send file contents to Part 2
  return fileContents;
})
.then((fileContents) => {
  // Parse the input into a rules map
  let rules = parseInput(fileContents, true);

  // Get all arrangements of the seating
  let allArrangements = getAllArrangements(rules);

  // Find highest score
  let highScore = Number.MIN_SAFE_INTEGER;
  for(const list of allArrangements){
    highScore = Math.max(highScore, list.score(rules));
  }

  // Log output
  console.log('Part 2:', highScore);
});

// Parse the input into a rules map
const parseInput = (fileContents, includeYourself) => {
  // Regex for parsing each line
  const reg = new RegExp(/([A-Za-z]+) would (lose|gain) (\d+) happiness units by sitting next to ([A-Za-z]+)/);

  // Add each line to the rules map
  let rules = new Map();
  for(const line of fileContents){
    let matches = line.match(reg);
    let num;
    // Set number positive or negative base on gain or lose
    if(matches[2] === 'gain')
      num = parseInt(matches[3]);
    else
      num = parseInt(matches[3]) * -1;

    // Update or add new object
    let current;
    if(rules.has(matches[1]))
      current = rules.get(matches[1]);
    else
      current = {};
    
    // Update the values and add back to the rules map
    current[matches[4]] = num;
    rules.set(matches[1], current);
  }

  // If including yourself
  if(includeYourself){
    let keys = [];
    // Add a 0 value for yourself to each existing player
    rules.forEach((value, key) => {
      value['yourself'] = 0;
      keys.push(key);
    })

    // Add a yourself key with a 0 value for each player
    let yourself = {};
    for(const key of keys){
      yourself[key] = 0;
    }
    rules.set('yourself', yourself);
  }

  return rules;
}

// Create all arrangements using a BFS style search
const getAllArrangements = (rules) => {
  // All possible seating arrangements as lists to be returned
  let possibilities = [];
  // All of the people at the table
  let keys = []
  // Queue of all possible orders being built
  let queue = [];
  // Add a new array for each person as the first in the array
  for(const key of rules.keys()){
    queue.push([key]);
    keys.push(key);
  }
  // Run while the queue still has things to process
  while(queue.length > 0){
    // Take the first item
    let current = queue.shift();
    // If the length of this arrangement does not have everyone seated yet the add a new person
    if(current.length < keys.length){
      // Add the next new person to the arrangement that is not already in the arrangement 
      // and add each of these options as new arrays back to the queue
      for(const key of keys){
        if(current.indexOf(key) === -1){
          let temp = [...current];
          temp.push(key);
          queue.push(temp);
        }
      }
    }
    // Else the current arranegment has everyone seated 
    else{
      // Add each person in order to a new circularly linked list and add that to the possibilities
      let list = new LinkedList();
      for(const item of current){
        list.insert(item);
      }
      possibilities.push(list);
    }
  }
  return possibilities;
}

// A class for maintaining and manipulating a circular doubley linked list 
class LinkedList {
  constructor(){
    this.head = null;
    this.length = 0;
  }
  
  // Insert values in the last position of the list behind the head of the list
  insert(value){
    // If no items exist insert insert the value as the head node and link it to itself
    if(this.head === null){
      this.head = new LinkedListNode(value, null, null);
      this.head.prev = this.head;
      this.head.next = this.head;
    }
    // If a head already exists add this beihnd the head and update the adjacent node references node references
    else{ 
      let prev = this.head.prev;
      let item = new LinkedListNode(value, this.head, prev);
      this.head.prev = item;
      prev.next = item;
    }
    this.length++; 
  }

  // Get a score for this array based on the rules map that is passed in
  score(rules){
    // All scores initially start at 0
    let score = 0;
    // Start the current pos in the linked list at the head
    let currentPos = this.head;
    let keepChecking = true;
    // Keep add ing up the score while we have not come back around to the head again
    while(keepChecking){
      // Get the current person
      let current = rules.get(currentPos.value);
      // Add the score for the next and prev people
      score += current[currentPos.next.value];
      score += current[currentPos.prev.value];
      // Update the current pos to the next person
      currentPos = currentPos.next;
      // Check if we have reached the head again
      keepChecking = currentPos != this.head;
    }
    return score;
  }
}

// A class for storing linked list node information
class LinkedListNode {
  constructor(value, next, prev){
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}