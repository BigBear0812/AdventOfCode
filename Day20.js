import process from "node:process";
import { open } from "node:fs/promises";

// Puzzle for Day 20: https://adventofcode.com/2022/day/20

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
  // Process all of the lines of the file after it has been opened
  let fileContents = []
  for await (const line of file.readLines()) {
    fileContents.push(line);
  }
  return fileContents;
})
.then((fileContents) => {
  // Parse file input
  let file = parseInput(fileContents, 1);
  
  // Decrypt the file
  decrypt(file, 1);

  // Find the sum of the 1000th, 2000th, and 3000th values
  let one = file.nthValueAfterZero(1000);
  let two = file.nthValueAfterZero(2000);
  let three = file.nthValueAfterZero(3000);
  let sum = one + two + three;

  // Log output
  console.log(`Part 1 sum of items at 1000, 2000, and 3000: ${sum}`);

  return fileContents;
})
.then((fileContents) => {
  // Parse file input
  let file = parseInput(fileContents, 811589153);
  
  // Decrypt the file
  decrypt(file, 10);

  // Find the sum of the 1000th, 2000th, and 3000th values
  let one = file.nthValueAfterZero(1000);
  let two = file.nthValueAfterZero(2000);
  let three = file.nthValueAfterZero(3000);
  let sum = one + two + three;

  // Log output 
  console.log(`Part 2 sum of items at 1000, 2000, and 3000: ${sum}`);
});

// Parse each line of the input as a seperate number multiplied by the specified mutiplier.
// Insert each number as a node into the linked list in the order they are in the file
const parseInput = (fileContents, multiplier) => {
  let result = new LinkedList();
  for(const line of fileContents){
    result.insert(parseInt(line) * multiplier);
  }
  return result;
};

// Decrypt the linked list by mixing the values the given number of times in the original order of the input
const decrypt = (file, mixIterations) => {
  // File nodes in their original positions in an array
  let ogFile = file.toArray();
  // Iterate the mixing process the specified nunmer of times
  for(let mixes = 0; mixes < mixIterations; mixes++){
    // Mix each number in the order it was originally specified
    for(const node of ogFile){
      file.move(node);
    }
  }
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

  // Outputs the order of the list as a comma seperated string of values
  toString(){
    // Initalize output with the head node's value
    let output = this.head.value + '';
    let node = this.head.next;

    // While the current node is not the head node continue to add values of the nodes to the output
    while(node != this.head){
      output += ', ' + node.value;
      node = node.next;
    }
    return output;
  }

  // Outputs the order of the list as an array of values beginning with the head node
  toArray(){
    // Initalize output with the head node's value
    let output = [this.head];
    let current = this.head.next;

    // While the current node is not the head node continue to add values of the nodes to the output
    while(current !== this.head){
      output.push(current);
      current = current.next;
    }
    return output;
  }

  // Move a specified node it's given number of spaces
  move(node){
    // If the value is 0 do not move it
    if(node.value != 0){
      // Extract the item from the list
      node.prev.next = node.next;
      node.next.prev = node.prev;
      // Move it the expected number of counts in the given direction 
      // while keeping track of the next and prev. The modulus operator 
      // cuts down on the number of moves required in large number situations
      let count = Math.abs(node.value)%(this.length - 1);
      for(let x = 0; x < count; x++){
        // If the value is positive. Move to the next
        if (node.value > 0){
          node.prev = node.next;
          node.next = node.next.next;
        }
        // Else the value is negative. Move to the previous
        else{
          node.next = node.prev;
          node.prev = node.prev.prev;
        }
      }
      // Insert back into the list
      node.prev.next = node;
      node.next.prev = node;
    }
  }

  // Return the value of the node that is nth spaces after the node whose value is 0
  nthValueAfterZero = (nthValue) => {
    // Find the node whose value is 0 by looping through the list until it is found
    let foundItem = this.head;
    while(foundItem.value !== 0){
      foundItem = foundItem.next;
    }

    // Mod the nth value with the length of the list to cut down on the number of 
    // moves along the list need to be made to find the nth value
    let modNthValue = nthValue % this.length;
    for(let x = 0; x <= modNthValue; x++){
      if(x !== modNthValue)
        foundItem = foundItem.next;
    }
    return foundItem.value;
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